import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import comparisonPreview from './scripts/comparison-preview.mjs';

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
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith('/new/') && !/^\/new_index(?:\.html)?\/?$/.test(path);
      },
    }),
    comparisonPreview(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
