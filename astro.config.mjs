import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// `lastmod` comes from the committed SEO manifest, which seoslug derives from
// git history, so the sitemap reflects real content changes.
const seoManifest = JSON.parse(
  readFileSync(new URL('./src/data/seo-manifest.json', import.meta.url), 'utf8'),
);

function newestContentDate() {
  let newest = 0;
  for (const entry of Object.values(seoManifest)) {
    const schema = entry?.schema_jsonld;
    const nodes = Array.isArray(schema) ? schema : (schema?.['@graph'] ?? (schema ? [schema] : []));
    for (const node of nodes) {
      const stamp = node && typeof node === 'object' ? Date.parse(node.dateModified) : NaN;
      if (Number.isFinite(stamp) && stamp > newest) newest = stamp;
    }
  }
  return newest ? new Date(newest) : undefined;
}

function lastmodFor(pageUrl) {
  const pathname = new URL(pageUrl).pathname;
  const entry =
    seoManifest[pathname] ?? seoManifest[pathname.endsWith('/') ? pathname : `${pathname}/`];
  const schema = entry?.schema_jsonld;
  const nodes = Array.isArray(schema) ? schema : (schema?.['@graph'] ?? (schema ? [schema] : []));
  for (const node of nodes) {
    if (node && typeof node === 'object' && node.dateModified) {
      const date = new Date(node.dateModified);
      if (!Number.isNaN(date.valueOf())) return date;
    }
  }
  // Pages without their own date inherit the most recent content change.
  return newestContentDate();
}

export default defineConfig({
  site: 'https://librecourse.uy/',
  prefetch: true,
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwind()],
    css: {
      transformer: 'lightningcss',
    },
    build: {
      cssMinify: 'lightningcss',
    },
  },
  integrations: [
    sitemap({
      serialize: (item) => {
        const lastmod = lastmodFor(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
