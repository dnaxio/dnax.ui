---
title: Button
description: Buttons trigger actions — variants, colors, icons, sizes, loading
  and disabled states.
navigation:
  icon: lucide:square-mouse-pointer
seo:
  title: Button (QBtn)
  description: QBtn — a button (native button/a) with the Quasar API.
---

Buttons trigger actions. **`<q-btn>`** renders a native `<button>` — or an `<a>`
when `href` is set — and exposes the Quasar API: variants such as `unelevated`,
`outline` and `flat`, Iconify icons, theme colors, sizes, and `loading` /
`disable` states.

## Variants

::prose-show-case
<div class="demo-row">
  <q-btn label="Default"></q-btn>
  <q-btn label="Unelevated" unelevated></q-btn>
  <q-btn label="Outline" outline></q-btn>
  <q-btn label="Flat" flat></q-btn>
  <q-btn label="Rounded" radius></q-btn>
</div>

#code

```vue
<q-btn label="Default" />
<q-btn label="Unelevated" unelevated />
<q-btn label="Outline" outline />
<q-btn label="Flat" flat />
<q-btn label="Rounded" radius />
```
::

The default button has an elevation shadow. `unelevated` removes it, `outline`
keeps a transparent background with a border, `flat` drops the border too, and
`radius` (or `radius="sm|md|lg"` for a finer scale) rounds the corners into a
pill. `no-caps` disables any text transformation applied by the theme, `dense`
reduces the height.

## Colors

::prose-show-case
<div class="demo-row">
  <q-btn label="Primary" color="primary"></q-btn>
  <q-btn label="Secondary" color="secondary"></q-btn>
  <q-btn label="Positive" color="positive"></q-btn>
  <q-btn label="Negative" color="negative"></q-btn>
  <q-btn label="Warning" color="warning"></q-btn>
  <q-btn label="Info" color="info"></q-btn>
  <q-btn label="Custom" color="#7c3aed"></q-btn>
</div>

#code

```vue
<q-btn label="Primary" color="primary" />
<q-btn label="Secondary" color="secondary" />
<q-btn label="Positive" color="positive" />
<q-btn label="Negative" color="negative" />
<q-btn label="Warning" color="warning" />
<q-btn label="Info" color="info" />
<q-btn label="Custom" color="#7c3aed" />
```
::

`color` accepts any design token (`primary`, `secondary`, `accent`, `dark`,
`positive`, `negative`, `info`, `warning`) or a raw hex value such as `#7c3aed`.
Use `text-color` to override the foreground.

## Icons

::prose-show-case
<div class="demo-row">
  <q-btn label="Download" icon="lucide:download"></q-btn>
  <q-btn label="Send" icon="lucide:send" icon-right="lucide:arrow-right"></q-btn>
  <q-btn icon="lucide:plus" round color="secondary"></q-btn>
  <q-btn icon="lucide:search" round outline></q-btn>
  <q-btn label="Settings" icon="lucide:settings" flat></q-btn>
</div>

#code

```vue
<q-btn label="Download" icon="lucide:download" />
<q-btn label="Send" icon="lucide:send" icon-right="lucide:arrow-right" />
<q-btn icon="lucide:plus" round color="secondary" />
<q-btn icon="lucide:search" round outline />
<q-btn label="Settings" icon="lucide:settings" flat />
```
::

Icons use Iconify names — `icon="lucide:download"`. `icon-right` places an icon on
the trailing edge, and `round` turns the button into a perfect circle, ideal for
icon-only buttons.

## Sizes

::prose-show-case
<div class="demo-row">
  <q-btn label="Small" size="sm"></q-btn>
  <q-btn label="Medium" size="md"></q-btn>
  <q-btn label="Large" size="lg"></q-btn>
  <q-btn label="X-Large" size="xl"></q-btn>
  <q-btn label="Custom" size="2.25rem"></q-btn>
</div>

#code

```vue
<q-btn label="Small" size="sm" />
<q-btn label="Medium" size="md" />
<q-btn label="Large" size="lg" />
<q-btn label="X-Large" size="xl" />
<q-btn label="Custom" size="2.25rem" />
```
::

`size` accepts the tokens `sm`, `md`, `lg`, `xl` or any CSS length (`"2.25rem"`).
Combine with `dense` for a compact form factor.

## States

::prose-show-case
<div class="demo-row">
  <q-btn label="Loading" loading></q-btn>
  <q-btn label="Disabled" disable></q-btn>
  <q-btn label="Stretch" stretch unelevated></q-btn>
</div>

#code

```vue
<q-btn label="Loading" loading />
<q-btn label="Disabled" disable />
<q-btn label="Stretch" stretch unelevated />
```
::

### Interactive loading

::prose-show-case
<dnax-demo-btn demo="loading"></dnax-demo-btn>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const loadingState = ref(false)
const startLoading = () => {
  loadingState.value = true
  setTimeout(() => (loadingState.value = false), 2200)
}
</script>

<template>
  <div class="demo-row">
    <q-btn label="Simulate loading" :loading="loadingState" @click="startLoading" />
  </div>
</template>
```
::

`loading` swaps the content for a spinner and blocks clicks. A `disable`d button
is visually muted and ignores pointer events. `stretch` makes the button fill the
width of its container.

## Links & events

::prose-show-case
<div class="demo-row">
  <q-btn label="Internal link" href="/docs/components/btn"></q-btn>
  <q-btn label="External link" icon="lucide:external-link" href="https://nuxt.com" outline></q-btn>
</div>

#code

```vue
<q-btn label="Internal link" href="/docs/components/btn" />
<q-btn label="External link" icon="lucide:external-link" href="https://nuxt.com" outline />
```
::

Passing `href` renders a native `<a>` with the same look. QBtn declares no custom
events — attach native listeners such as `@click` directly.

### Click event

::prose-show-case
<dnax-demo-btn demo="click"></dnax-demo-btn>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const clicks = ref(0)
</script>

<template>
  <div class="demo-row">
    <q-btn label="Click me" @click="clicks++" />
    <p class="demo-p">Clicked {{ clicks }} times.</p>
  </div>
</template>
```
::

## API

<dnax-api name="QBtn"></dnax-api>
