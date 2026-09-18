"""Pre-build: generates the SEO manifest for the Astro site via seoslug.

Scans ``src/pages/**/*.astro`` for the ``<Layout title=... description=...>``
props, enriches each route with per-page metadata (entity type, breadcrumbs,
author, FAQ, git dates), builds a deterministic SEO payload with seoslug, and
writes ``src/data/seo-manifest.json``. The committed manifest is consumed at
build time by ``src/components/Seo/Seo.astro``.

Run with: ``python3 scripts/generate_seo.py``
Requires: ``pip install seoslug`` (2.x)
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import warnings
from pathlib import Path

from seoslug import (
    Breadcrumb,
    FAQItem,
    OGImage,
    Robots,
    SchemaRegistry,
    SEOConfig,
    SEOEntity,
    URLPolicy,
    build_seo_payload,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = PROJECT_ROOT / "src" / "pages"
OUTPUT = PROJECT_ROOT / "src" / "data" / "seo-manifest.json"

SITE_URL = "https://librecourse.uy"
SITE_NAME = "LibreCourseUY"

# Per-route structured-data metadata. Routes not listed fall back to a plain
# "page" entity with no breadcrumbs, so new pages keep working.
ROUTES: dict[str, dict] = {
    "/": {"entity_type": "home"},
    "/learn/": {
        "entity_type": "other",
        "author": SITE_NAME,
        "breadcrumbs": [("Home", "/"), ("How to Learn", "/learn/")],
    },
    "/contribute/": {
        "entity_type": "other",
        "author": SITE_NAME,
        "breadcrumbs": [("Home", "/"), ("Contribute", "/contribute/")],
    },
    "/projects/": {
        "entity_type": "taxonomy",
        "breadcrumbs": [("Home", "/"), ("Projects", "/projects/")],
    },
    "/docs/": {
        "entity_type": "taxonomy",
        "breadcrumbs": [("Home", "/"), ("Docs", "/docs/")],
    },
    "/docs/gpg-signature/": {
        "entity_type": "post",
        "author": SITE_NAME,
        "breadcrumbs": [
            ("Home", "/"),
            ("Docs", "/docs/"),
            ("GPG Signature", "/docs/gpg-signature/"),
        ],
    },
    "/cla/": {
        "entity_type": "page",
        "breadcrumbs": [("Home", "/"), ("CLA", "/cla/")],
    },
}

HOME_SOCIAL = ["https://github.com/LibreCourseUY"]

LAYOUT_RE = re.compile(r"<Layout\b(?P<attrs>.*?)>", re.DOTALL)
ATTR_RE = re.compile(r'(\w+)="([^"]*)"')
COLLAPSE_RE = re.compile(r'<Collapse\b[^>]*question="([^"]*)"[^>]*>([\s\S]*?)</Collapse>')
TAG_RE = re.compile(r"<[^>]+>")


def website_schema(entity: SEOEntity, config: SEOConfig, canonical: str, title: str, description: str | None, og_image: str | None) -> dict:
    """Custom homepage schema: WebSite + Organization + FAQPage as an @graph."""
    website: dict = {
        "@type": "WebSite",
        "@id": f"{canonical}#website",
        "name": config.site_name or title,
        "url": canonical,
    }
    if description:
        website["description"] = description
    if og_image:
        website["image"] = og_image
    if config.publisher_name:
        publisher: dict = {"@type": "Organization", "name": config.publisher_name}
        if config.publisher_logo:
            publisher["logo"] = config.publisher_logo
        if HOME_SOCIAL:
            publisher["sameAs"] = HOME_SOCIAL
        website["publisher"] = publisher

    graph: list[dict] = [website]

    if entity.faq_items:
        graph.append(
            {
                "@type": "FAQPage",
                "@id": f"{canonical}#faq",
                "url": canonical,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": item.question,
                        "acceptedAnswer": {"@type": "Answer", "text": item.answer},
                    }
                    for item in entity.faq_items
                ],
            }
        )

    return {"@context": "https://schema.org", "@graph": graph}


REGISTRY = SchemaRegistry()
REGISTRY.register("WebSite", website_schema)

CONFIG = SEOConfig(
    canonical_host="librecourse.uy",
    public_base_url=SITE_URL,
    url_policy=URLPolicy(
        enforce_https=True,
        lowercase_paths=True,
        trailing_slash="always",
    ),
    site_name=SITE_NAME,
    default_og_image=OGImage(
        url=f"{SITE_URL}/og.jpg",
        width=1200,
        height=630,
        alt=SITE_NAME,
    ),
    default_robots=Robots(index=True, follow=True, max_snippet=-1, max_image_preview="large"),
    publisher_name=SITE_NAME,
    publisher_logo=f"{SITE_URL}/icon.png",
    title_template="{title}",
    locale="en_US",
    schema_type_map={
        "home": "WebSite",
        "page": "WebPage",
        "taxonomy": "CollectionPage",
        "post": "TechArticle",
        "other": "HowTo",
    },
    schema_registry=REGISTRY,
    emit_warnings=True,
)


def route_from_file(filepath: Path) -> str:
    rel = filepath.relative_to(PAGES_DIR)
    parts = list(rel.parts)
    if parts[-1] == "index.astro":
        parts.pop()
        return "/" if not parts else "/" + "/".join(parts) + "/"
    return "/" + str(Path(*parts).with_suffix("")) + "/"


def layout_props(filepath: Path) -> dict[str, str]:
    match = LAYOUT_RE.search(filepath.read_text(encoding="utf-8"))
    return dict(ATTR_RE.findall(match.group("attrs"))) if match else {}


def plain_text(html: str) -> str:
    text = TAG_RE.sub(" ", html)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def faq_items(filepath: Path) -> list[FAQItem]:
    items: list[FAQItem] = []
    for question, answer in COLLAPSE_RE.findall(filepath.read_text(encoding="utf-8")):
        cleaned = plain_text(answer)
        if cleaned:
            items.append(FAQItem(question=question.strip(), answer=cleaned))
    return items


def schema_label(schema: object) -> str:
    if isinstance(schema, dict):
        if "@graph" in schema:
            return "@graph"
        return str(schema.get("@type", "?"))
    if isinstance(schema, list):
        return "+".join(str(item.get("@type", "?")) for item in schema if isinstance(item, dict))
    return "?"


def git_dates(filepath: Path) -> tuple[str | None, str | None]:
    """Return (published, updated) dates from git history, or (None, None)."""
    try:
        result = subprocess.run(
            ["git", "log", "--format=%aI", "--follow", "--", str(filepath.relative_to(PROJECT_ROOT))],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        dates = result.stdout.split()
        if not dates:
            return None, None
        return dates[-1][:10], dates[0][:10]
    except Exception:
        return None, None


def main() -> int:
    manifest: dict[str, dict] = {}
    collected: list[warnings.WarningMessage] = []

    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")

        for filepath in sorted(PAGES_DIR.rglob("*.astro")):
            route = route_from_file(filepath)
            props = layout_props(filepath)
            meta = ROUTES.get(route, {"entity_type": "home" if route == "/" else "page"})

            published, updated = git_dates(filepath)
            entity = SEOEntity(
                entity_type=meta["entity_type"],
                title=props.get("title") or SITE_NAME,
                excerpt=props.get("description") or None,
                author_name=meta.get("author"),
                published_at=published,
                updated_at=updated,
                breadcrumbs=[
                    Breadcrumb(name=name, url=url)
                    for name, url in meta.get("breadcrumbs", [])
                ]
                or None,
                faq_items=faq_items(filepath) if route == "/" else None,
            )

            if not props.get("description"):
                warnings.warn(f"{route}: layout is missing a description", stacklevel=1)

            payload = build_seo_payload(entity, route, CONFIG)
            if payload is None:
                print(f"  SKIP  {filepath.relative_to(PROJECT_ROOT)}")
                continue

            payload_dict = payload.to_dict()
            manifest[route] = payload_dict
            print(
                f"  OK    {route:<24} {meta['entity_type']:<10} {schema_label(payload_dict.get('schema_jsonld'))}"
            )

        collected = list(caught)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nWrote {OUTPUT.relative_to(PROJECT_ROOT)} ({len(manifest)} routes)")

    # BreadcrumbList and @graph nodes legitimately omit top-level name/description
    # and per-node @context; seoslug's generic validator flags them anyway.
    benign = ("missing @context", "recommended name is missing", "recommended description is missing")
    real = [w for w in collected if not any(marker in str(w.message) for marker in benign)]
    suppressed = len(collected) - len(real)

    if real:
        print(f"\n{len(real)} validation warning(s):")
        for warning in real:
            print(f"  - {warning.message}")
    if suppressed:
        print(f"\n{suppressed} structural warning(s) suppressed (BreadcrumbList/@graph nodes).")

    return 1 if real else 0


if __name__ == "__main__":
    sys.exit(main())
