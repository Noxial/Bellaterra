# Bellaterra — Claude Code Rules

Bellaterra is a **Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS 4** luxury property rental platform. These rules ensure consistent, high-quality code when implementing features or Figma designs.

---

## Stack Overview

| Concern | Solution |
|---|---|
| Framework | Nuxt 4 (`future.compatibilityVersion: 4`) |
| UI | Vue 3 Composition API (`<script setup lang="ts">`) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` (NOT PostCSS) |
| Fonts | `@nuxtjs/google-fonts` — Noto Sans (body), Cormorant Garamond (display) |
| Composables | `@vueuse/nuxt` auto-imports VueUse |
| Database | Nitro experimental SQLite (`.data/db.sqlite`) |
| State | Nuxt `useState()` for cross-component SSR-safe state |

---

## Project Structure

```
app/
├── assets/css/main.css       # Tailwind @import + @theme tokens + custom classes
├── components/layout/        # TheHeader.vue, TheFooter.vue
├── composables/              # useHeaderSolid.ts, useHeaderLight.ts, useInquiry.ts
├── layouts/                  # default.vue, admin.vue
├── middleware/               # admin.ts (client-side route guard)
├── pages/                    # File-based routing
│   ├── index.vue, gallery.vue, about.vue, retreats.vue, inquiry.vue
│   ├── property/[slug].vue
│   └── admin/                # Protected admin pages
├── plugins/                  # scrollReveal.ts (v-reveal directive)
└── types/index.ts            # All TypeScript interfaces

server/
├── api/                      # Nitro API routes (file = endpoint)
│   ├── inquiries/, gallery/, content/, properties/
│   └── admin/                # Auth-protected admin endpoints
├── database/db.ts            # Schema init + seed (initSchema())
├── middleware/admin-auth.ts  # Server-side cookie auth for /api/admin/*
└── plugins/database.ts       # Calls initSchema() at server startup
```

---

## Design Tokens

**IMPORTANT: Never hardcode hex values. Always use the token names below.**

Tokens are defined in `app/assets/css/main.css` under `@theme {}` and used directly as Tailwind classes:

```css
/* app/assets/css/main.css */
@theme {
  --color-cream: #F2EFEA;        /* bg-cream, text-cream — Warm Cream White */
  --color-warm-white: #F8F6F2;   /* bg-warm-white — near-white for form pages */
  --color-sand: #D8CBB8;         /* bg-sand, text-sand — Light Sand/Beige */
  --color-chocolate: #5A3E2B;    /* bg-chocolate — Rich Walnut Brown (dark sections) */
  --color-espresso: #3D2416;     /* bg-espresso — Deep Walnut (darkest sections) */
  --color-cocoa: #7A5A3E;        /* bg-cocoa — Medium Warm Brown */
  --color-terracotta: #C47A5A;   /* bg-terracotta — Dusty Terracotta (accent) */
  --color-amber: #C9A77A;        /* bg-amber — Natural Oak Wood (warm accent) */
  --color-stone: #B8A89A;        /* bg-stone — Soft Taupe Stone */
  --color-olive: #7A8A6B;        /* bg-olive — Muted Olive Green */
  --color-charcoal: #3A3A3A;     /* bg-charcoal — Warm Charcoal (grounds/text) */
  --font-sans: 'Noto Sans', sans-serif;
  --font-display: 'Cormorant Garamond', serif;
}
```

Use these as standard Tailwind utilities:
```html
<!-- ✅ Correct -->
<div class="bg-cream text-charcoal">
<h1 class="font-display text-cream">
<span class="text-golden-brass/60">  <!-- opacity modifier works normally -->

<!-- ❌ Wrong -->
<div style="background: #F2E7D6">
<h1 style="font-family: 'Cormorant Garamond'">
```

---

## Typography

```html
<!-- Display / Headlines: Cormorant Garamond -->
<h1 class="font-display font-light text-8xl tracking-tight leading-none">
<h2 class="font-display font-light text-6xl tracking-tight leading-tight">

<!-- Body: Noto Sans -->
<p class="font-sans font-light text-base leading-relaxed">
<p class="font-sans text-xs tracking-widest uppercase font-semibold">

<!-- Kicker labels (section labels with animated line) -->
<p class="kicker text-terracotta text-xs tracking-[0.3em] uppercase font-semibold">
```

**Font weights available:** 300 (light), 400 (normal), 600 (semibold).

---

## Custom CSS Classes (app/assets/css/main.css)

**IMPORTANT: Use these existing classes — do not recreate them.**

| Class | Purpose |
|---|---|
| `.kicker` | Section label with an animated left-line (requires `.is-visible` to animate) |
| `.nav-link` | Underline-slide animation on hover / router-link-active |
| `.arrow-animate` | Arrow that slides right on parent hover |
| `.card-lift` | Card elevation + translateY(-4px) on hover |
| `.btn-fill` | Button with sliding fill on hover (requires variant below) |
| `.btn-fill-dark` | Black fill for btn-fill |
| `.btn-fill-cream` | Cream fill for btn-fill |
| `.btn-fill-terra` | Terracotta fill for btn-fill |
| `.reveal` | Scroll reveal — fade up (added by `v-reveal` directive) |
| `.reveal-left` | Scroll reveal — fade from left |
| `.reveal-scale` | Scroll reveal — scale up |
| `.is-visible` | Activates any reveal animation |
| `.animate-scroll-line` | Animated scroll indicator line |
| `.scrollbar-hide` | Hides scrollbar cross-browser |

Button pattern:
```html
<NuxtLink
  to="/inquiry"
  class="btn-fill btn-fill-terra px-10 py-3.5 bg-terracotta text-cream text-xs font-semibold tracking-widest uppercase hover:text-charcoal transition-colors duration-300"
>
  Inquire
</NuxtLink>
```

---

## Scroll Reveal Directive

The `v-reveal` directive is globally registered via `app/plugins/scrollReveal.ts`:

```html
<!-- Default: fade up -->
<div v-reveal>...</div>

<!-- With delay (ms) -->
<p v-reveal="{ delay: 150 }">...</p>

<!-- Fade from left -->
<div v-reveal="{ type: 'left' }">...</div>

<!-- Scale up -->
<div v-reveal="{ type: 'scale', delay: 200 }">...</div>
```

- SSR-safe: has `getSSRProps()` hook
- Respects `prefers-reduced-motion`
- Use staggered delays (0, 80, 130, 180, 250ms) for sequential reveals

---

## Component Patterns

### Vue SFC Structure

```vue
<script setup lang="ts">
// 1. SEO (public pages only)
useSeoMeta({ title: '...', description: '...' })

// 2. Header state (if page has light/solid bg)
const headerLight = useHeaderLight()
onMounted(() => { headerLight.value = true })
onUnmounted(() => { headerLight.value = false })

// 3. Data fetching (SSR-compatible)
const { data } = await useFetch<MyType>('/api/...')

// 4. Computed / local state
const computed1 = computed(() => ...)
</script>

<template>
  <div>
    <!-- Sections use semantic HTML -->
    <section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-cream">
      ...
    </section>
  </div>
</template>
```

### Header State Composables

Pages that sit on light backgrounds (no full-screen hero) must signal the header:

```typescript
// For light bg pages (cream) — header uses dark logo + dark nav
const headerLight = useHeaderLight()  // composable in app/composables/
onMounted(() => { headerLight.value = true })
onUnmounted(() => { headerLight.value = false })

// For pages needing a solid header always (e.g. gallery)
const headerSolid = useHeaderSolid()
onMounted(() => { headerSolid.value = true })
onUnmounted(() => { headerSolid.value = false })
```

Logic in TheHeader.vue:
- `headerSolid || isScrolled` → `bg-deep-green`
- `headerLight && !scrolled && !solid` → transparent header with dark logo/nav

---

## Page Layout Patterns

### Full-screen hero (transparent header overlays it)

```html
<section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
  <img ... class="absolute inset-0 w-full h-full object-cover" />
  <!-- Base overlay -->
  <div class="absolute inset-0 bg-charcoal/55"></div>
  <!-- Bottom gradient -->
  <div class="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent"></div>
  <!-- Top gradient ensures header readability -->
  <div class="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-charcoal/60 to-transparent"></div>
  <!-- Content offset accounts for transparent fixed header -->
  <div class="relative z-10 text-center ... mt-20 md:mt-24">
    ...
  </div>
</section>
```

### Section with dark photo hero (non-full-screen)

```html
<section class="relative min-h-[70vh] flex items-end overflow-hidden pt-24">
  <!-- pt-24 accounts for fixed header height (h-24) -->
```

### Standard content section

```html
<section class="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-cream">
  <div class="max-w-7xl mx-auto">
    ...
  </div>
</section>
```

**Standard section spacing:** `py-24 md:py-40` · **Padding:** `px-6 md:px-16 lg:px-24` · **Max width:** `max-w-7xl mx-auto`

---

## Responsive Breakpoints

Uses Tailwind defaults:
- `md:` — 768px (tablet+)
- `lg:` — 1024px (desktop+)

Common patterns:
```html
class="grid grid-cols-1 md:grid-cols-2"
class="text-5xl md:text-7xl lg:text-8xl"
class="px-6 md:px-16 lg:px-24"
class="py-24 md:py-40"
class="hidden md:flex"   <!-- desktop only -->
class="md:hidden"         <!-- mobile only -->
```

---

## Data Fetching

**IMPORTANT: Use `useFetch()` for SSR-compatible fetching in pages. Use `$fetch()` for mutations.**

```typescript
// SSR data load (in page setup)
const { data } = await useFetch<Property>('/api/properties/303')

// With default fallback
const { data: cms } = await useFetch<Record<string, string>>('/api/content/home')
const c = computed(() => cms.value ?? {})
const heroTitle = computed(() => c.value['hero::title'] || 'Default title')

// Client-side mutation
await $fetch('/api/admin/inquiries', { method: 'PATCH', body: { status } })
```

---

## API Route Patterns

API routes live in `server/api/`. File name = HTTP method:

```
server/api/gallery/index.get.ts     → GET  /api/gallery
server/api/inquiries/index.post.ts  → POST /api/inquiries
server/api/admin/content/index.patch.ts → PATCH /api/admin/content
```

Standard handler pattern:
```typescript
export default defineEventHandler(async (event) => {
  const db = useDatabase()
  // For GET: return data
  const rows = await db.sql`SELECT * FROM table`
  return rows.rows

  // For POST: validate then insert
  const body = await readBody(event)
  if (!body.required_field) {
    throw createError({ statusCode: 400, message: 'required_field is required' })
  }
  await db.sql`INSERT INTO table (col) VALUES (${body.col})`
  return { success: true }
})
```

Admin routes are protected by `server/middleware/admin-auth.ts` which checks the `bellaterra_admin` cookie.

---

## Figma MCP Integration

### Required Flow

1. Call `get_design_context` with the Figma `fileKey` and `nodeId`
2. Call `get_screenshot` for visual reference
3. If output is too large, use `get_metadata` to get the node map first, then re-fetch specific nodes
4. Translate the Figma output (React + Tailwind) into this project's Vue/Nuxt conventions
5. Validate final UI against the screenshot

### Translation Rules

- **Replace React with Vue 3** `<script setup>` + `<template>`
- **Map Figma colors** to tokens from `@theme {}` in `main.css` — never hardcode hex
- **Replace Tailwind hardcoded colors** (`text-[#F2E7D6]`) with named tokens (`text-cream`)
- **Reuse existing components** from `app/components/` before creating new ones
- **Reuse CSS classes** from `main.css` (`.btn-fill`, `.card-lift`, `.kicker`, `.nav-link`, etc.)
- **Add `v-reveal` directives** to elements that should animate in on scroll
- **Use `font-display`** for Cormorant Garamond headlines, `font-sans` for Noto Sans body
- **Assets**: If Figma MCP returns a localhost image URL, use it directly. Do NOT use placeholder images.

### Asset Handling

- Static assets → `public/` directory
- Uploaded user assets → `public/uploads/` (served at `/uploads/filename`)
- **IMPORTANT: Do NOT install new icon packages.** Use inline SVGs as done in existing components.

---

## Color Section Mapping

The site uses a deliberate section color rhythm — follow it:

| Section type | Background | Text |
|---|---|---|
| Hero / dark | Photo + overlay | `text-cream` |
| Light content | `bg-cream` | `text-charcoal` |
| Form pages | `bg-warm-white` | `text-chocolate` |
| Dark editorial | `bg-espresso` | `text-cream` |
| Mid-tone section | `bg-cocoa` | `text-cream` |
| CTA accent | `bg-terracotta` | `text-cream` |
| Footer | `bg-chocolate` | `text-cream` |

---

## TypeScript Types

All types are in `app/types/index.ts`. Key ones:

```typescript
Property, PropertyImage
Inquiry, InquiryNote
PageContent        // CMS: { key: string, value: string, page: string }
Retreat, RetreatAddon
AvailabilityBlock
GalleryImage, GalleryCategory
SeoMetadata
ApiSuccess<T>, ApiError
```

---

## Admin Area

Admin pages at `/admin/*` are protected:
- Client-side: `app/middleware/admin.ts` redirects unauthenticated users
- Server-side: `server/middleware/admin-auth.ts` blocks all `/api/admin/*` (except `/auth/`)
- Auth: cookie `bellaterra_admin = 'authenticated'`
- Admin layout: `app/layouts/admin.vue` (fixed sidebar, content offset)

---

## Accessibility & Motion

- All animations respect `@media (prefers-reduced-motion: reduce)` — defined in `main.css`
- Focus styles: `2px solid terracotta` outline via `:focus-visible`
- Selection: `bg-terracotta text-cream`
- Interactive elements (`a`, `button`) have 300ms transitions by default

---

## Do Not

- **Do not** hardcode hex colors — use token class names
- **Do not** add `pt-20 md:pt-24` to `<main>` in `default.vue` — the layout has no top padding; pages handle their own header offset
- **Do not** install new npm packages without confirming — the stack is intentionally minimal
- **Do not** use `.client.ts` plugin suffix unless the plugin is truly browser-only (causes SSR directive crash)
- **Do not** call `initSchema()` in API routes — it's called once at startup in `server/plugins/database.ts`
- **Do not** use `window`, `document`, or browser APIs outside `import.meta.client` guards or `onMounted()`
