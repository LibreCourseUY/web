import { copyFile } from 'node:fs/promises';

// Keep the existing directory-style URLs and also publish the exact review filename.
export default function comparisonPreview() {
  return {
    name: 'comparison-preview',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((request, _response, next) => {
          if (request.url?.split('?')[0] === '/new_index.html') {
            request.url = request.url.replace('/new_index.html', '/new_index/');
          }
          next();
        });
      },
      'astro:build:done': async ({ dir }) => {
        await copyFile(new URL('new_index/index.html', dir), new URL('new_index.html', dir));
      },
    },
  };
}
