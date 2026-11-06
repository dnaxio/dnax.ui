---
title: Icon
description: Render any Iconify icon by name with size tokens, theme colors and
  inline spacing.
navigation:
  icon: lucide:star
seo:
  title: Icon (QIcon)
  description: QIcon — renders any Iconify icon by name, with color and size tokens.
---

Icons render any Iconify icon by name — `name="lucide:star"` — with token-based
colors and size tokens or raw CSS lengths. They are used everywhere in the design
system (buttons, chips, badges, accordions…).

## Sizes

::prose-show-case
<div class="demo-row">
  <q-icon name="lucide:star" size="sm"></q-icon>
  <q-icon name="lucide:star" size="md"></q-icon>
  <q-icon name="lucide:star" size="lg"></q-icon>
  <q-icon name="lucide:star" size="xl"></q-icon>
</div>

#code

```vue
<q-icon name="lucide:star" size="sm" />
<q-icon name="lucide:star" size="md" />
<q-icon name="lucide:star" size="lg" />
<q-icon name="lucide:star" size="xl" />
```
::

`size` maps the tokens `sm` (16px), `md` (24px), `lg` (32px) and `xl` (48px), or
accepts any CSS length such as `"1.5rem"`.

## Colors

::prose-show-case
<div class="demo-row">
  <q-icon name="lucide:heart" color="primary"></q-icon>
  <q-icon name="lucide:heart" color="positive"></q-icon>
  <q-icon name="lucide:heart" color="negative"></q-icon>
  <q-icon name="lucide:heart" color="warning"></q-icon>
  <q-icon name="lucide:heart" color="#7c3aed"></q-icon>
</div>

#code

```vue
<q-icon name="lucide:heart" color="primary" />
<q-icon name="lucide:heart" color="positive" />
<q-icon name="lucide:heart" color="negative" />
<q-icon name="lucide:heart" color="warning" />
<q-icon name="lucide:heart" color="#7c3aed" />
```
::

`color` accepts any design token (`primary`, `positive`, `negative`…) or a hex
value. Without a color the icon inherits the current text color.

## Custom CSS sizes

::prose-show-case
<div class="demo-row">
  <q-icon name="lucide:rocket" size="2rem"></q-icon>
  <q-icon name="lucide:rocket" size="40px" color="info"></q-icon>
  <q-icon name="lucide:rocket" size="lg" color="secondary"></q-icon>
</div>

#code

```vue
<q-icon name="lucide:rocket" size="2rem" />
<q-icon name="lucide:rocket" size="40px" color="info" />
<q-icon name="lucide:rocket" size="lg" color="secondary" />
```
::

## Spacing & rotation

::prose-show-case
<dnax-demo-icon demo="spacing"></dnax-demo-icon>

#code

```vue
<span class="demo-inline"><q-icon name="lucide:mail" left /> Inbox</span>
<span class="demo-inline">Drafts <q-icon name="lucide:chevron-right" right /></span>
<q-icon name="lucide:refresh-cw" size="lg" class="demo-spin" />
```
::

`left` and `right` add inline margins for in-text usage. There is no rotation prop —
apply a CSS transform class instead (see the rotated refresh icon).

```css
/* rotation : classe CSS personnalisée */
.demo-spin {
  transform: rotate(45deg);
}
```

## Bundling (offline & SSR)

By default `@iconify/vue` resolves every icon **at runtime** from `api.iconify.design`.
Consequences: the server-rendered HTML only contains an empty
`<svg class="iconify iconify--lucide">` shell (the `<path>` arrive after the client
fetch), and without network there is no icon at all.

`@dnax/ui` embeds a **subset** of `lucide` — only the names actually referenced in the
code — and registers it with Iconify's `addCollection`, which is purely local: no
request, and the SSR renders the `<path>` elements.

### With the Nuxt module (default)

The module builds the set at **build time** and registers it at boot, on **server and
client**. Nothing to do in your app: it scans your sources (`rootDir`, recursively) for
`lucide:…` names and merges them with the design-system subset.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // default — nothing to write
  dnaxUi: { icons: { scan: true } },
})
```

| Option | Effect |
| --- | --- |
| *(default)* | design system **+** every `lucide:…` found in your sources |
| `icons: { scan: false }` | design system only (static subset) |
| `icons: { dirs: ["app"] }` | limit the scan (paths relative to `rootDir`) |
| `icons: false` | embed nothing — every icon goes through the API |

`node_modules`, `.nuxt`, `.output`, `.data`, `dist`, `public` are never scanned. New
icon names picked up in dev regenerate the plugin automatically; in the meantime they
render through the API (degradation, not breakage).

Icons that cannot be found by scanning stay on the API: dynamic names
(`:icon="row.icon"` computed at runtime) and names coming from a CMS/API response.

### Without the module

```ts
import { registerIcons } from "@dnax/ui"

registerIcons() // design-system subset, idempotent
```

For your own icons, generate a committed set and register it — `registerIconSet`
**merges** with what is already loaded (same `lucide` prefix):

```bash
bun node_modules/@dnax/ui/scripts/gen-icon-set.ts \
  --out ./app/iconSet.ts --src ./app --src ./content --type-import @dnax/ui
```

```ts [plugins/icons.ts]
import { registerIconSet } from "@dnax/ui/runtime"
import { lucideIconSet } from "~/iconSet"

export default defineNuxtPlugin(() => {
  registerIconSet(lucideIconSet)
})
```

The generator scans `.vue`, `.ts`, `.js`, `.mjs` and `.md` recursively, resolves
`lucide:` aliases, and warns about names that do not exist in the collection (typos).
A unit test (`lib/iconSet.test.ts`) fails if a design-system component references a
`lucide:` name missing from the generated file — so forgetting to regenerate breaks CI,
not the page.

> ⚠️ `@iconify-json/lucide` ships as a dependency of `@dnax/ui` (the module reads it at
> build time). If your app also uses **`@nuxt/icon`**, that module auto-detects installed
> `@iconify-json/*` packages and puts the whole collection in the Nitro server bundle —
> set `icon: { serverBundle: "remote" }` (or `false`) to avoid ~650 Ko of server weight.

> The docs site you are reading relies on the default scan: no generated file, no
> plugin. `packages/ui/lib/iconSet.ts` still holds the design-system subset (committed
> and tested).

## API

<dnax-api name="QIcon"></dnax-api>
