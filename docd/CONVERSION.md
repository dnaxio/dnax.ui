# Conversion guide — `ddocs/` (Docus) → `docd/` (Docd)

`docd/` is a **second documentation site** for the same product, built on the
[Docd](https://docd.uithing.com) Nuxt layer (`@baybreezy/docd`, UI Thing based)
instead of Docus. It renders **the exact same content** as `ddocs/` — only the
theme layer and a few MDC block names differ.

Everything under `docd/content/` is **generated** from `ddocs/content/`:

```bash
bun docd/scripts/port-from-ddocs.mjs
```

Do not hand-edit `docd/content/docs/**` for structural changes: fix the Docus page
first, then re-run the port. Only the two index pages (below) are maintained by
hand.

## Source of truth

| Piece | Path |
| --- | --- |
| Pages (generated) | `ddocs/content/docs/**` → `docd/content/docs/**` |
| Landing page (hand-written) | `docd/content/index.md` |
| Docs hub (hand-written) | `docd/content/docs/index.md` |
| Demo components (copied verbatim) | `ddocs/app/components/demos/**` → `docd/app/components/demos/**` |
| API block | `docd/app/components/DnaxApi.vue` (+ `DnaxPropsTable.vue`) |
| Global demo helpers CSS | `docd/app/assets/css/main.css` (`.demo-row`, `.demo-col`, `.demo-stack`, `.demo-p`, `.demo-meta`, `.demo-label`, `.demo-grid`) |

## Rewrites applied by the port script

| Docus (`ddocs/`) | Docd (`docd/`) |
| --- | --- |
| `::dnax-demo` | `::prose-show-case` — Docd's native **Preview / Code** block, Preview active by default |
| `::note` | `::prose-callout{variant="note"}` |
| `navigation.icon: i-lucide-x` | `navigation.icon: lucide:x` |
| `content/docs/2.essentials/` | skipped (Docus-only empty group) |

Everything else is copied unchanged: frontmatter (`title`, `description`,
`navigation`, `seo`), prose, `::prose-show-case` bodies and `#code` fences,
`<dnax-demo-xxx demo="y"></dnax-demo-xxx>` / `:dnax-demo-xxx{demo="y"}` demo
hooks, and `<dnax-api name="QXxx"></dnax-api>` API blocks.

## Page skeleton

```md
---
title: <title>
description: <one-line summary>
navigation:
  icon: lucide:<kebab-icon>
seo:
  title: <title> (<QXxx>)
  description: <one-line summary>
---

<lead paragraph>

## <section>

<prose>

::prose-show-case
<dnax-demo-xxx demo="y"></dnax-demo-xxx>

#code

```vue
…
```
::

## API

:dnax-api{name="QXxx"}
```

## Differences to keep in mind

- **Demos** use Docd's `::prose-show-case` (not `::dnax-demo`). The `#code` slot
  syntax is identical; the tabs and "Preview first" behaviour come from Docd.
- **Callouts** use `::prose-callout{variant="…"}` (variants: `default`, `info`,
  `success`, `warning`, `error`, `tip`, `note`, `example`).
- **Cards** (only used on the docs hub) use `::prose-card{icon title to}` —
  Docd has no `card-group`, so cards are stacked instead of grid-laid-out.
- **API tables** are rendered by our own `<DnaxApi>`/`<DnaxPropsTable>` (same
  component as `ddocs/`), fed by `scripts/dnax-ui-meta.ts`
  (`#build/dnax-ui-meta.mjs`) and the runtime props. Docd's built-in
  `componentApi` frontmatter mechanism is intentionally **not** used.
- **Icons** in Docd navigation use the `lucide:*` prefix (Docd convention);
  `@nuxt/icon` also accepts `i-lucide-*`, so the rewrite is cosmetic.

## ⚠️ Pitfalls

1. **Self-closing component tags are forbidden in MDC** (parse5 ignores `/>`): the
   tag swallows everything after it. Use the inline form (`:dnax-api{name="QXxx"}`)
   for childless components or an explicit closing tag (`<q-btn …></q-btn>`). Only
   real void elements (`<br />`, `<img />`) may self-close. Inside fenced code
   blocks, normal Vue syntax applies.
2. **`DnaxApi` resolves its runtime props during `setup`** (top-level
   `await import("@dnax/ui/runtime")`). Keep that: with a `watchEffect` the API
   tables are rendered as “Loading…” in the prerendered HTML.
3. **Layer components need flat names.** `nuxt.config.ts` declares
   `components: [{ path: "~/components", pathPrefix: false }]` so
   `app/components/demos/DnaxDemoBtn.vue` is `<dnax-demo-btn>` (not
   `<demos-dnax-demo-btn>`) — exactly like `ddocs/`.
4. `@dnax/ui` is consumed as a **workspace link** (`workspace:*`), so the local
   `packages/ui` sources are used (the published npm build is older).

## Commands

```bash
cd docd && bun run dev          # dev server
cd docd && bun run generate     # prerender → .output/public (validates every page)
cd docd && bun run build        # SSR build
```

After a port run, always re-run `bun run generate` and check for `[500]` / `[404]`
in the output.
