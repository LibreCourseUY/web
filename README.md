# web

LibreCourseUY web

## Compare the proposed version

The existing site remains at `/`. The proposed home is available at `/new_index.html`,
with its supporting pages under `/new/`. A comparison bar links each proposal page to
its current counterpart. Review pages use `noindex` and are excluded from the sitemap
and generated `llms` files.

Run `pnpm dev`, then open `http://localhost:4321/new_index.html`. To load the public
project catalog during local development, run:

```sh
PUBLIC_AWESOME_FEED_URL=https://raw.githubusercontent.com/LibreCourseUY/awesome-librecourseuy/master/public/entries.json pnpm dev
```

`pnpm build` also produces the exact static file `dist/new_index.html` for deployment.
