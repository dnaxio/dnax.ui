---
title: Collapse
description: A clickable header that smoothly expands or collapses its content,
  controlled or uncontrolled, with icons and a custom header slot.
navigation:
  icon: lucide:chevrons-up-down
seo:
  title: Collapse (QCollapse)
  description: QCollapse — an expandable panel with a clickable header and the Quasar API.
---

A clickable header that expands or collapses its content with a smooth height
animation. **`<q-collapse>`** supports a controlled `v-model` (or internal state
via `default-opened`), Iconify icons on the left and right of the header, and a
custom `#header` slot.

## Basic

`label` + optional `caption`; the chevron rotates when open. The content stays
mounted and animates via a measured height.

::prose-show-case
<dnax-demo-collapse demo="basic"></dnax-demo-collapse>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const openBasic = ref(true)
</script>

<template>
  <q-collapse v-model="openBasic" label="Account" caption="Profile, security and preferences">
    <p class="demo-p">
      The content is animated with a measured height (0 → auto) and stays
      mounted in the DOM — hidden with CSS, not unmounted.
    </p>
  </q-collapse>
</template>
```
::

## Icons

`icon-left` sits before the title, `icon-right` before the chevron — any Iconify
name.

::prose-show-case
<dnax-demo-collapse demo="icons"></dnax-demo-collapse>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const openIcons = ref(false)
</script>

<template>
  <q-collapse
    v-model="openIcons"
    label="Security"
    caption="Two-factor authentication"
    icon-left="lucide:shield"
    icon-right="lucide:badge-check"
  >
    <p class="demo-p">Iconify icons on both sides of the header.</p>
  </q-collapse>
</template>
```
::

## Uncontrolled

Without a `v-model`, the collapse manages its own state — initialized with
`default-opened`.

::prose-show-case
<dnax-demo-collapse demo="uncontrolled"></dnax-demo-collapse>

#code

```vue
<q-collapse label="FAQ — What is Dnax UI?" default-opened>
  <p class="demo-p">
    Without a <code>v-model</code>, the collapse keeps its own internal state,
    initialized by <code>default-opened</code>.
  </p>
</q-collapse>
```
::

## Dense & disabled

`dense` shrinks the header; `disable` blocks the toggle.

::prose-show-case
<dnax-demo-collapse demo="states"></dnax-demo-collapse>

#code

```vue
<q-collapse label="Dense" caption="Compact header" dense>
  <p class="demo-p">A smaller header with <code>dense</code>.</p>
</q-collapse>

<q-collapse label="Disabled" disable>
  <p class="demo-p">Clicking the header does nothing.</p>
</q-collapse>
```
::

## Custom header

Use the `#header` slot (and optional `header-class`) to build your own header
content — the chevron stays managed by the component.

::prose-show-case
<dnax-demo-collapse demo="custom"></dnax-demo-collapse>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const openCustom = ref(false)
</script>

<template>
  <q-collapse v-model="openCustom" header-class="q-collapse__header--custom">
    <template #header>
      <q-icon name="lucide:sparkles" color="primary" />
      <span class="q-collapse__label">Custom header</span>
    </template>
    <p class="demo-p">Anything goes inside the <code>#header</code> slot.</p>
  </q-collapse>
</template>
```
::

## API

<dnax-api name="QCollapse"></dnax-api>
