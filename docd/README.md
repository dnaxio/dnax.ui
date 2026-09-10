# Dnax UI — Docd site

Second documentation site for **Dnax UI**, built with the
[Docd](https://docd.uithing.com) Nuxt layer (`@baybreezy/docd`, based on
[Nuxt Content](https://content.nuxt.com) and [UI Thing](https://uithing.com)).

It renders the **same content** as the Docus site (`ddocs/`) with a different
theme and MDC block names. See [`CONVERSION.md`](./CONVERSION.md) for the
conversion contract.

## Development

```bash
bun install        # from the repository root — docd is a workspace member
bun run dev        # http://localhost:3000
```

## Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Dev server (`--host`) |
| `bun run build` | Nuxt SSR build |
| `bun run generate` | Prerender every route to `.output/public` (validates all pages) |
| `bun run preview` | Preview the production build |
| `bun run prepare` | `nuxt prepare` (regenerates `.nuxt` types) |

Content is ported from `ddocs/content/`:

```bash
bun docd/scripts/port-from-ddocs.mjs
```

## Structure

```
docd/
├── app/
│   ├── app.config.ts                     # Docd theme config (title, borders…)
│   ├── assets/css/main.css               # API tables + live-demo helpers
│   ├── components/DnaxApi.vue            # <dnax-api name="QXxx"> API block
│   ├── components/DnaxPropsTable.vue     # Props table
│   ├── components/demos/**               # One demo component per page
│   ├── composables/useComponentDocs.ts   # Build-time component metadata
│   └── plugins/dnax-providers.client.ts  # $q.* providers (dialog, notify, …)
├── content/
│   ├── index.md                          # Landing (::landing-hero)
│   └── docs/**                           # Generated from ddocs/content/docs
└── scripts/
    ├── component-parse.ts                # Static SFC analysis (slots/events/…)
    ├── dnax-ui-meta.ts                   # → #build/dnax-ui-meta.mjs
    └── port-from-ddocs.mjs               # ddocs/content → docd/content
```
