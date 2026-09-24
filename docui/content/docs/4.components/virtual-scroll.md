---
title: Virtual Scroll
description: A windowed list renderer that mounts only the visible items — scroll
  through hundreds of thousands of rows.
navigation:
  icon: lucide:rows-3
seo:
  title: Virtual Scroll (QVirtualScroll)
  description: QVirtualScroll — a windowed list renderer with measured heights.
---

A windowed list renderer: **`<q-virtual-scroll>`** only mounts the items around the
visible area (plus margins), measuring real heights with a `ResizeObserver` — scroll
smoothly through hundreds of thousands of rows with a handful of DOM nodes.

## Basic usage

Pass `:items` and render each row through the scoped default slot — bind the slot's
`ref` to your element so heights can be measured. `50 000 rows` below, only a window
is mounted.

::prose-show-case
:dnax-demo-virtual-scroll{demo="basic"}

#code

```vue
<script setup lang="ts">
const rows = Array.from({ length: 50000 }, (_, i) => "Row " + (i + 1))
</script>

<template>
  <q-virtual-scroll :items="rows" item-key="id" style="height: 320px">
    <template #default="{ item, index, ref }">
      <div :ref="ref" class="item">{{ item }}</div>
    </template>
  </q-virtual-scroll>
</template>
```
::

## Variable heights

Items don't need a fixed height: each mounted row is measured by a `ResizeObserver`
and the prefix offsets rebuild — rows of different lengths stay perfectly aligned
while scrolling.

::prose-show-case
:dnax-demo-virtual-scroll{demo="mixed"}

#code

```vue
<script setup lang="ts">
const mixed = Array.from({ length: 20000 }, (_, i) => ({
  id: i,
  title: "Row " + (i + 1),
  desc: "Description " + ((i % 3) + 1) + ": …",
}))
</script>

<template>
  <q-virtual-scroll :items="mixed" item-key="id" style="height: 320px">
    <template #default="{ item, ref }">
      <div :ref="ref" class="card">
        <b>{{ item.title }}</b>
        <p>{{ item.desc }}</p>
      </div>
    </template>
  </q-virtual-scroll>
</template>
```
::

## Tuning

`virtual-scroll-slice-size` is the number of items rendered around the visible
window (default 14); `-ratio-before / -after` multiply it on each side.
`virtual-scroll-item-size` is the initial estimated height (px) used until a row is
measured.

::prose-show-case
:dnax-demo-virtual-scroll{demo="tuning"}

#code

```vue
<q-virtual-scroll
  :items="rows"
  item-key="id"
  virtual-scroll-slice-size="20"
  virtual-scroll-item-size="48"
  style="height: 320px"
>
  <template #default="{ item, ref }">
    <div :ref="ref" class="item">{{ item }}</div>
  </template>
</q-virtual-scroll>
<!-- slice-size : items rendus autour de la fenêtre · item-size : hauteur estimée -->
```
::

## Inside QPage

`q-page` has a `virtual` mode that wraps this component — windowed list plus the
automatic offset under fixed bars (`q-header` / `q-footer`).

```html
<q-page virtual :items="rows" item-key="id" style="height: 400px">
  <template #default="{ item }">
    <div class="item">{{ item }}</div>
  </template>
</q-page>
<!-- QPage virtual = q-virtual-scroll avec l'offset auto des barres fixed -->
```

## API

:dnax-api{name="QVirtualScroll"}
