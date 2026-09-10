---
title: Splitter
description: Two resizable panels around a draggable separator — pointer and
  keyboard accessible.
navigation:
  icon: lucide:panel-left
seo:
  title: Splitter (QSplitter)
  description: QSplitter — two resizable panels around a draggable, keyboard-accessible separator.
---

Splits a region into two resizable panels (`#before` / `#after`) around a
draggable separator — the equivalent of the shadcn-vue Resizable, with a Quasar
API. The handle is draggable with the pointer and keyboard-accessible (arrows,
`Shift` = 10% steps).

## Basic (vertical)

The `v-model` holds the size of the `#before` panel in `unit` (`%` by default).
A fixed `height` on the container keeps the splitter visible.

::prose-show-case
:dnax-demo-splitter{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const split = ref(30)
const files = ["App.vue", "main.ts", "useAuth.ts", "README.md", "package.json"]
</script>

<template>
  <q-splitter v-model="split" style="height: 260px">
    <template #before>
      <div class="panel panel--code">
        <p class="panel__title">Files</p>
        <div v-for="f in files" :key="f" class="file">{{ f }}</div>
      </div>
    </template>
    <template #after>
      <div class="panel panel--preview">
        <p class="panel__title">Preview</p>
        <p class="demo-p">Drag the handle — or focus it and use the arrow keys.</p>
      </div>
    </template>
  </q-splitter>
  <p class="demo-p demo-meta">Left panel: {{ Math.round(split) }}%</p>
</template>
```
::

## Horizontal

`horizontal` stacks the panels vertically (top / bottom) — the separator
becomes a row-resize handle.

::prose-show-case
:dnax-demo-splitter{demo="horizontal"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const splitH = ref(60)
</script>

<template>
  <q-splitter v-model="splitH" horizontal style="height: 240px">
    <template #before>
      <div class="panel panel--header">
        <p class="panel__title">Toolbar</p>
        <p class="demo-p">Top panel — drag the separator up/down.</p>
      </div>
    </template>
    <template #after>
      <div class="panel panel--body">
        <p class="panel__title">Content</p>
        <p class="demo-p">Shift + arrows step by 10% instead of 1%.</p>
      </div>
    </template>
  </q-splitter>
</template>
```
::

## Fixed sidebar (px & limits)

`unit="px"` sizes the first panel in pixels (real layouts: sidebar + content),
and `limits` clamps the drag between `[min, max]`.

::prose-show-case
:dnax-demo-splitter{demo="px"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const sidePx = ref(180)
</script>

<template>
  <q-splitter v-model="sidePx" unit="px" :limits="[120, 320]" style="height: 220px">
    <template #before>
      <div class="panel panel--sidebar">Sidebar ({{ Math.round(sidePx) }}px)</div>
    </template>
    <template #after>
      <div class="panel panel--body">
        <p class="panel__title">Main content</p>
        <p class="demo-p">Clamped between 120 px and 320 px.</p>
      </div>
    </template>
  </q-splitter>
</template>
```
::

## Custom separator

The `#separator` slot replaces the default handle — combine it with
`separator-style` (transparent track, colored knob…) for a custom look.

::prose-show-case
:dnax-demo-splitter{demo="custom"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const splitCustom = ref(40)
</script>

<template>
  <q-splitter
    v-model="splitCustom"
    style="height: 220px"
    separator-style="background: transparent"
  >
    <template #before>
      <div class="panel panel--a">A</div>
    </template>
    <template #after>
      <div class="panel panel--b">B</div>
    </template>
    <template #separator>
      <span class="knob">
        <span class="knob__dot" />
        <span class="knob__dot" />
        <span class="knob__dot" />
      </span>
    </template>
  </q-splitter>
</template>
```
::

## API

:dnax-api{name="QSplitter"}
