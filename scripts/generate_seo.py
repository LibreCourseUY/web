"""Pre-build: generates the SEO manifest for the Astro site via seoslug.

Scans ``src/pages/**/*.astro`` for the ``<Layout title=... description=...>``
props, builds a deterministic SEO payload per route, and writes
``src/data/seo-manifest.json``. The committed manifest is consumed at build
time by ``src/components/Seo.astro``.

Run with: ``python3 scripts/generate_seo.py``
Requires: ``pip install seoslug pyyaml``
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from seoslug import (
    OGImage,
    Robots,
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

SEO_CONFIG = SEOConfig(
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
    publisher_name=SITE_NAME,
    title_template="{title}",
    default_robots=Robots(index=True, follow=True),
    locale="en_US",
)

LAYOUT_RE = re.compile(r"<Layout\b(?P<attrs>.*?)>", re.DOTALL)
ATTR_RE = re.compile(r'(\w+)="([^"]*)"')


def route_from_file(filepath: Path) -> str:
    rel = filepath.relative_to(PAGES_DIR)
    parts = list(rel.parts)
    if parts[-1] == "index.astro":
        parts.pop()
        return "/" if not parts else "/" + "/".join(parts) + "/"
    stem = Path(*parts).with_suffix("")
    return "/" + str(stem) + "/"


def layout_props(filepath: Path) -> dict[str, str]:
    match = LAYOUT_RE.search(filepath.read_text(encoding="utf-8"))
    if not match:
        return {}
    return dict(ATTR_RE.findall(match.group("attrs")))


def main() -> int:
    manifest: dict[str, dict] = {}

    for filepath in sorted(PAGES_DIR.rglob("*.astro")):
        route = route_from_file(filepath)
        props = layout_props(filepath)
        title = props.get("title") or SITE_NAME
        description = props.get("description")

        entity = SEOEntity(
            entity_type="home" if route == "/" else "page",
            title=title,
            excerpt=description or None,
        )
        payload = build_seo_payload(entity, route, SEO_CONFIG)
        if payload is None:
            print(f"  SKIP  {filepath.relative_to(PROJECT_ROOT)}")
            continue

        manifest[route] = payload.to_dict()
        print(f"  OK    {route}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nWrote {OUTPUT.relative_to(PROJECT_ROOT)} ({len(manifest)} routes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
