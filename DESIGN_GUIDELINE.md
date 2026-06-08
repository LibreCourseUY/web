# Design Guideline — LibreCourseUY

> Extracted from the existing codebase. All patterns below are **inferred from usage**, not invented. Follow these rules to stay visually and structurally consistent when adding pages, components, or features.

---

## 1. Visual Foundations

### 1.1 Color Palette

| Token | Tailwind Utility | Hex | Usage |
|---|---|---|---|
| `--background` | `bg-background` | `#10100e` | Page background, navbar background (95% opacity) |
| `--color-emphasis` | `text-emphasis` / `bg-emphasis` | `#f9f9e9` | Primary text, navbar brand, language-toggle background |
| `--color-emphasis-secondary` | `text-emphasis-secondary` | `#5ec2af` | Links, anchor underlines, author links, accent |

### 1.2 Semantic Color Usage

```css
/* Defined in src/styles/globals.css — this is the ONLY place tokens live */
:root {
  --background: #10100e;
  --color-emphasis: #f9f9e9;
  --color-emphasis-secondary: #5ec2af;
}
```

**Rules:**
- **Always** use the token classes (`bg-background`, `text-emphasis`, `text-emphasis-secondary`) rather than hardcoding hex values.
- Use Tailwind **opacity modifiers** for muted variants instead of creating new tokens:
  - `text-emphasis/60` — de-emphasized / secondary text, active nav link
  - `text-emphasis/80` — hover states, muted body text
  - `text-emphasis-secondary/60` — disabled anchors
  - `bg-background/95` — navbar background (translucent)
- **Neutral palette** for structural elements — only these values appear in code:
  - `border-neutral-700` — borders, card outlines, nav link dividers, tech-tag rings
  - `text-neutral-400` — card descriptions, external-link icon
  - `text-neutral-700/45` — FAQ collapse `+` icon (idle)
  - `group-hover:text-neutral-400` — FAQ collapse `+` icon (hover)
  - `bg-neutral-700` — icon-button hover state
  - `ring-1 ring-neutral-700` — tech stack tag outlines
  - `border-white/10` — FAQ item dividers, collapse top-border
- **Card placeholder backgrounds** cycle through:
  ```ts
  ["bg-blue-950", "bg-green-950", "bg-amber-950", "bg-emerald-950"]
  ```
- **Icon tinting** for inline SVGs: `brightness-0 invert opacity-80`

### 1.3 Typography

**Font Family:**
```css
font-family: 'Inter', system-ui, sans-serif;  /* set in globals.css @layer base */
```
Loaded weights via `@fontsource/inter`: **400** (regular), **700** (bold), **900** (black).

**Font Size & Weight Map (all inferred from usage):**

| Element | Tailwind Class | Size | Weight | Line Height |
|---|---|---|---|---|
| Page heading (h1) | `text-6xl` | 3.75rem / 60px | 900 (black) via heading tag | default |
| Section heading (h2) | `text-5xl` | 3rem / 48px | 700 (bold) via heading tag | default |
| Sub-heading (h3) | `text-4xl` | 2.25rem / 36px | 700 (bold) via heading tag | default |
| Body / paragraph | `text-2xl` | 1.5rem / 24px | 400 (regular) | default |
| Card title | `text-lg font-bold` | 1.125rem / 18px | 700 (bold) | default |
| Card description | `text-sm` | 0.875rem / 14px | 400 (regular) | default |
| Nav links | `text-sm font-bold` | 0.875rem / 14px | 700 (bold) | default |
| Tech-stack tags | `text-xs` | 0.75rem / 12px | 400 (regular) | default |
| Numbered-list index | `text-sm` | 0.875rem / 14px | 400 (regular) | default |
| FAQ trigger text | `text-[15px]` | 15px | 400 (regular) | default |
| FAQ body text | `text-2xl` | 1.5rem / 24px | 400 (regular) | `leading-7` |
| Author link | `text-xs` | 0.75rem / 12px | 400 (regular) | default |

**Rules:**
- Use the `<Text variant="h1|h2|p|a">` component for headings, paragraphs, and inline text links — never write raw `<h1>` outside it.
- Only `<h3>` may be written as a raw HTML tag (used once in `index.astro:122`), since no `Text` variant exists for it; if h3 usage grows, add a `h3` variant to `Text`.
- All text is `text-start` (left-aligned). Never center-align body text.

### 1.4 Border Radius

| Token | Class | Value | Where |
|---|---|---|---|
| Card corners | `rounded-lg` | 0.5rem / 8px | `<Cards>` |
| Language toggle | `rounded-full` | 9999px | Navbar `<button>` |
| Icon button | `rounded-full` | 9999px | Card external-link icon hover |

### 1.5 Shadows & Effects

- **No `shadow-*` classes** exist in the codebase. The only depth effect is `backdrop-blur-sm` on the sticky navbar.
- Do not introduce `shadow-*` without aligning with the team.

### 1.6 Opacity Scale (documented usage)

| Value | Usage |
|---|---|
| `/95` | Navbar background: `bg-background/95` |
| `/80` | Muted body text, hover states, card icon tint |
| `/60` | De-emphasized text, active nav link, disabled anchor |
| `/45` | FAQ idle `+` icon |
| `/10` | FAQ item border: `border-white/10` |

### 1.7 Spacing Scale

**Implicit spacing conventions — do not introduce arbitrary values outside this set:**

| Size | Where Used |
|---|---|
| `p-4` | Card inner padding |
| `p-6` | List-item padding |
| `px-12` | Navbar horizontal padding, page horizontal margin |
| `md:mx-24` | Page horizontal margin on `md+` screens |
| `lg:px-24` | Navbar horizontal padding on `lg+` screens |
| `py-5` | Collapse trigger vertical padding |
| `pb-5` | Collapse body bottom padding |
| `pt-16 pb-24` | FAQ section vertical padding |
| `mb-4` | Hero heading bottom margin |
| `mb-12` | Section bottom margin |
| `mt-12` | Section top margin, image top margin |
| `gap-4` | Nav links, hero link group, card layout |
| `gap-6` | List items, card-project spacing |
| `gap-x-12` | Section column gaps, footer |
| `gap-y-3` | Card content vertical gap |
| `space-y-4` | List items |
| `space-y-12` | Section content groups |
| `h-16` | Navbar height |
| `min-h-dvh` | Hero and projects sections |
| `min-h-64` | Footer |
| `w-12 h-6` | Language toggle button |
| `w-6 h-6` | Icon button (external link) |
| `w-24 h-24` → `md:w-52 md:h-52` | Card image placeholder (responsive) |
| `w-52 h-52` | Card project image |

**Spacing Rule:** Use Tailwind's default spacing scale. Never use arbitrary pixel values (`p-[13px]`) unless the design explicitly requires an exact value that is not in Tailwind's scale.

### 1.8 Z-Index Scale

| Value | Usage |
|---|---|
| `z-10` | Hero heading (layered above background elements) |
| `z-50` | Navbar (sticky, must overlay all page content) |

### 1.9 Breakpoints

| Breakpoint | Width (Tailwind v4 default) | Usage |
|---|---|---|
| `md:` | 768px | Layout shifts (nav visibility, page margins, flex direction, card placeholder size) |
| `lg:` | 1024px | Navbar horizontal padding increase |

No `sm:`, `xl:`, or `2xl:` overrides exist. Do not introduce new breakpoints without aligning with the team.

### 1.10 Responsive Behavior Patterns

| Pattern | Code |
|---|---|
| Navbar hidden on mobile | `hidden md:flex` on the navbar container |
| Page margins grow | `mx-12 md:mx-24` |
| Navbar padding grows | `px-12 lg:px-24` |
| About section stacks on mobile, side-by-side on desktop | `flex-row flex-wrap md:flex-nowrap` |
| Card placeholder hidden on mobile | `hidden md:flex`, size `w-24 h-24 md:w-52 md:h-52` |
| Hero vertical padding only on desktop | `mt-12 md:pt-12` |
| Hero heading width constrained | `max-w-4xl` |

---

## 2. Component Library

### 2.1 `Text` (`src/components/Text/Text.astro`)

**Purpose:** Polymorphic text element — renders `h1`, `h2`, `p`, or `a` with predefined styles.

**Props:**
```ts
| { variant: 'h1' | 'h2' | 'p' }
| { variant: 'a'; link?: string; openInTab?: boolean }
// All variants accept className?: string
```

**Rules:**
- Use `<Text variant="h1">` for page-level headings, `<Text variant="h2">` for section headings.
- Use `<Text variant="p">` for all body paragraphs.
- Use `<Text variant="a">` for inline links in body text (auto-formats URLs via `formatLink`).
- If you need an isolated standalone link (not inline), use `<Anchor>` instead.

### 2.2 `Anchor` (`src/components/Anchor/Anchor.astro`)

**Purpose:** Standalone link with an underline `::after` pseudo-element in `--color-emphasis-secondary`.

**Props:**
```ts
{ className?: string; href?: string; disabled?: boolean }
```

**Rules:**
- Always opens in `_blank` (hardcoded in component).
- When `disabled={true}`, renders as a `<span>` (not an `<a>`) and text gets `text-emphasis-secondary/60`.
- Use for call-to-action links, navigation-style links, and standalone hyperlinks (not inline).

### 2.3 `Cards` (`src/components/Cards/Cards.astro`)

**Purpose:** Project card with optional image, tech stack tags, author link, and external-link icon.

**Props:**
```ts
extends ProjectType & { className?: string; index?: number }
```

**Rules:**
- Always render inside a container with `space-y-6` for consistent vertical rhythm between cards.
- `index` drives background color cycling from `default_colors` (see section 1.2).
- When no image is provided, a color placeholder with the GitHub SVG icon is shown (hidden on mobile).
- Tech stack tags use `ring-1 ring-neutral-700` (not `border`).
- External link icon is a `<Text variant="a">` wrapping an inline SVG arrow icon.
- Author link is `<Text variant="a">` with `className="text-xs hover:underline"`.

### 2.4 `Collapse` (`src/components/Collapse/Collapse.astro`)

**Purpose:** FAQ accordion — click-to-expand with accordion behavior (clicking one collapses others).

**Props:**
```ts
{ question: string; open?: boolean }
```

**Rules:**
- Contains a `<script>` tag with vanilla JS for interactivity (no framework).
- Uses CSS transitions: `transition-[max-height] duration-350 ease-in-out` for the body, `transition-[transform,color] duration-300 ease-in-out` for the `+` icon.
- The `+` icon rotates 45° when the item is open (`group-[.open]:rotate-45`).
- Wraps the question in `<Text variant="p">` and the body in `<Text variant="p">` as well.
- Faq-item top border: `border-white/10`. Last item gets `border-b border-white/10` via the parent's `[&_.faq-item:last-child]:border-b [&_.faq-item:last-child]:border-white/10`.

### 2.5 `List` / `ListItem` (`src/components/List/`)

**Purpose:** Thin wrappers around `<ul>` and `<li>`.

**Props:**
```ts
// List
{ className?: string }
// ListItem
{ className?: string }
```

**Rules:**
- `List` comes with `text-2xl space-y-4`.
- For numbered-step lists, manually insert a `<span>` with the number: `<span class="mr-3 text-sm">{String(i + 1).padStart(2, '0')}</span>`.
- List items with borders use: `className="first:border-t border-b border-neutral-700 p-6 flex flex-row justify-start items-center gap-6"`.

### 2.6 `Navbar` (`src/components/Navbar/Navbar.astro`)

**Purpose:** Sticky top navigation with brand, route links, and language toggle.

**Rules:**
- Hidden on mobile (`hidden md:flex`).
- Sticky with `backdrop-blur-sm`, `z-50`, `bg-background/95`.
- Route links: `text-sm font-bold`. Active route (`pathname === item.href`) gets `text-emphasis/60 font-normal`. Inactive gets `text-emphasis hover:text-emphasis/80`.
- Routes are separated by `border-r border-neutral-700` (except the last).
- Language toggle button is `disabled` with `cursor-not-allowed` and `bg-emphasis w-12 h-6 rounded-full`.
- When adding a new route, add it to the `route` array object (not a separate list).

---

## 3. Layout

### 3.1 Page Layout (`src/layouts/Layout.astro`)

```astro
<body class="bg-background font-sans text-emphasis antialiased max-w-max">
  <Navbar pathname={Astro.url.pathname} class="hidden md:flex" />
  <div class="mx-12 md:mx-24">
    <slot />
  </div>
</body>
```

**Rules:**
- Every `.astro` page must wrap content in `<Layout title="..." description="...">`.
- The `<SEO>` component (from `astro-seo`) is pre-integrated; pass `title` and `description`.
- Page content is constrained horizontally via `mx-12 md:mx-24`.
- The body uses `max-w-max` (content-width constraint — no full-width bleed).

### 3.2 Section Patterns

```astro
<section id="..." class="...">
  <Text variant="h2">Section Title</Text>
  <div class="space-y-12">...</div>
</section>
```

**Section spacing rules:**
- Hero section: `min-h-dvh mt-12 md:pt-12`
- Content sections: `mb-12` (about), `mt-12` (projects)
- FAQ section: `pt-16 pb-24`
- Footer: `min-h-64 flex flex-row gap-x-12 justify-end items-end pb-12`

### 3.3 Footer

```astro
<footer class="min-h-64 flex flex-row gap-x-12 justify-end items-end pb-12">
  <span class="text-emphasis/60">Libre<span>Course</span>UY</span>
  <span class="footer-copy">© 2026 — Open Source Education</span>
</footer>
```

---

## 4. Utilities

### 4.1 `cn()` — Class Merging

```ts
import { cn } from '@/lib/utils';

cn('base-class', conditional && 'active-class', props.className)
```
Always use `cn()` instead of template literals for conditional classes. It merges Tailwind classes and resolves conflicts via `tailwind-merge`.

### 4.2 `formatLink()` — URL Normalization

```ts
import { formatLink } from '@/lib/utils';

formatLink('github.com/user')   // → 'https://github.com/user'
formatLink('https://example.com') // → 'https://example.com'
```
Prepend `https://` when the user provides a URL without a protocol.

---

## 5. TypeScript Types

### 5.1 `ProjectType` (`src/lib/types.ts`)

```ts
export interface ProjectType {
  title: string;
  description: string;
  autor: { name: string; link: string };
  image?: string | null;
  stack: string[];
  pj_link: string;
}
```

---

## 6. Animations & Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Collapse body | `max-height` | 350ms | `ease-in-out` |
| Collapse `+` icon | `transform`, `color` | 300ms | `ease-in-out` |
| Collapse trigger | `color` | 200ms | (default) |
| Anchor underline | `opacity` | (none, CSS hover pseudo) | (none) |

**Rules:**
- Keep transitions confined to the `Collapse` component. Do not add page-level transitions without agreement.
- Use `duration-200` for micro-interactions (hover color changes).

---

## 7. Accessibility Conventions

- **ARIA attributes:** Collapse uses `aria-expanded` (toggled by the accordion JS). Navbar has no explicit ARIA markup yet.
- **`alt` text:** Images always have descriptive `alt` attributes.
- **Disabled anchors** render as `<span>` (not `<a>`) with `cursor-default`.
- **Language toggle** uses `disabled` + `cursor-not-allowed`.
- **Color contrast:** Text is `#f9f9e9` on `#10100e` (high contrast). Accent links (`#5ec2af`) meet WCAG AA on the dark background.
- **Tab order:** Links open in `_blank` but lack `rel="noopener noreferrer"` (potential improvement).
- **Semantic HTML:** The page uses `<main>`, `<section>`, `<footer>`, `<ul>`, `<li>`, `<h1>`, `<h2>`, `<h3>` correctly.

---

## 8. Do's and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Use `cn()` for all conditional classes | Use raw template literals for class strings |
| Use `<Text variant="...">` for h1, h2, p, a | Write raw `<h1>`, `<h2>`, `<p>` with arbitrary classes |
| Use `text-emphasis/60` for muted text | Create a new color token for each opacity variant |
| Use `border-neutral-700` for borders | Use arbitrary gray hex values |
| Use `<Anchor>` for standalone links | Use `<Text variant="a">` for standalone links |
| Use `space-y-12` for section content spacing | Invent new spacing values outside the documented scale |
| Put design tokens ONLY in `globals.css` `:root` and `@theme` | Scatter hex values across components |
| Hide navbar on mobile with `hidden md:flex` | Build a separate mobile nav without agreement |
| Use `bg-background/95` + `backdrop-blur-sm` for the navbar | Add a different navbar background treatment |
