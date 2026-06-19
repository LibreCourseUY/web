# AGENTS.md

## Project

Astro 5 + TypeScript website template.

## Quick Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (localhost:4321) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing |

## Structure

```
src/
├── components/   # Astro (.astro) components
├── layouts/      # Astro layouts
├── lib/          # Utilities (cn, etc.)
├── pages/        # Route pages (.astro)
└── styles/       # Global CSS
```

## Conventions

- **Class merging**: Use `cn()` from `@/lib/utils` (tailwind-merge + clsx) never raw template literals for conditional classes.
- **Astro components**: `.astro` extension, use Astro fetch/frontmatter for data and server rendering.
- **Path alias**: `@/` maps to `src/` (configured in `tsconfig.json`).
- **SEO**: Add `<Layout title="..." description="...">` on every page, it wraps astro-seo's `<SEO>`.
- **Fonts**: Import Fontsource CSS in layout frontmatter (e.g. `@fontsource/inter/400.css`).
- **Images**: Use Astro's built-in `<Image />` from `astro:assets` for optimized images (no extra package needed).
- **Dark mode**: Tailwind `dark:` variants work out of the box, no class switching is configured by default.

## Config Files

| File | What it wires |
|------|---------------|
| `astro.config.mjs` | Tailwind, Sitemap, Partytown integrations |
| `tsconfig.json` | Strict mode, `@/*` path alias |
| `.eslintrc.cjs` | ESLint (TS + Astro + Prettier) |
| `.prettierrc` | Prettier with `prettier-plugin-astro` |

## Framework Notes

- **Partytown** is configured with `forward: ['dataLayer.push']`, uncomment/add analytics forwarding in `astro.config.mjs`.
- **Sitemap** auto-generates at build from `src/pages/` routes, the `site` URL in `astro.config.mjs` must be updated before production.
- **astro-seo** provides an `<SEO>` component with Open Graph, Twitter card, and JSON-LD props, see `src/layouts/Layout.astro` for basic usage; extend as needed.

## Toolchain Quirks

- `prettier-plugin-astro` is required for `.astro` formatting, it will not format `.astro` files without being listed in `.prettierrc` plugins.
- ESLint's `astro-eslint-parser` is configured only for `*.astro` files via the overrides block, `.ts` files use the `@typescript-eslint/parser` normally.
