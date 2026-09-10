---
title: Chip
description: Compact elements for tags, filters and selections — icons, removable
  close button, outline, square and dense variants.
navigation:
  icon: lucide:tag
seo:
  title: Chip (QChip)
  description: QChip — a compact tag, filter or selection element with the Quasar API.
---

Chips are compact elements used for tags, filters or selections. They support
icons on both sides, a removable close button, outline / square / dense variants
and disabled state — with colors driven by the design tokens.

## Basic usage

::prose-show-case
<div class="demo-row">
  <q-chip label="Vue"></q-chip>
  <q-chip label="Nuxt" icon="lucide:rocket" color="secondary"></q-chip>
  <q-chip label="Dnax" icon="lucide:sparkles" icon-right="lucide:arrow-up-right" color="positive"></q-chip>
  <q-chip label="Danger" color="negative"></q-chip>
</div>

#code

```vue
<q-chip label="Vue" />
<q-chip label="Nuxt" icon="lucide:rocket" color="secondary" />
<q-chip label="Dnax" icon="lucide:sparkles" icon-right="lucide:arrow-up-right" color="positive" />
<q-chip label="Danger" color="negative" />
```
::

`label` sets the text; `icon` and `icon-right` place Iconify icons on either side.
Without a label, the default slot renders.

## Variants

::prose-show-case
<div class="demo-row">
  <q-chip label="Outline" outline></q-chip>
  <q-chip label="Square" square></q-chip>
  <q-chip label="Dense" dense color="info"></q-chip>
  <q-chip label="Dark" color="dark"></q-chip>
</div>

#code

```vue
<q-chip label="Outline" outline />
<q-chip label="Square" square />
<q-chip label="Dense" dense color="info" />
<q-chip label="Dark" color="dark" />
```
::

`outline` keeps a border-only look, `square` removes the pill radius, and `dense`
tightens the padding for compact lists.

## Removable

::prose-show-case
<dnax-demo-chip demo="removable"></dnax-demo-chip>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const chips = ref(["Vue", "Nuxt", "Shadcn"])
const resetChips = () => {
  chips.value = ["Vue", "Nuxt", "Shadcn"]
}
</script>

<template>
  <q-chip
    v-for="(c, i) in chips"
    :key="c"
    :label="c"
    removable
    color="secondary"
    @remove="chips.splice(i, 1)"
  />
</template>
```
::

`removable` shows a close button that emits `remove`. There is no built-in
`v-model` — the consumer decides what removal means (here the chip is spliced out
of the list).

## Events & disabled

::prose-show-case
<dnax-demo-chip demo="events"></dnax-demo-chip>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
</script>

<template>
  <q-chip label="Click me" icon="lucide:thumbs-up" @click="count++" />
  <q-chip label="Disabled" icon="lucide:lock" disable />
</template>
```
::

Chips emit `click` (with the mouse event) and `remove`. The `disable` prop mutes
the chip and blocks both events.

## API

<dnax-api name="QChip"></dnax-api>
