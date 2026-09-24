---
title: Reorder
description: A draggable list — reorder with the mouse, touch or keyboard, with
  custom item slots.
navigation:
  icon: lucide:grip-vertical
seo:
  title: Reorder (QReorder)
  description: QReorder — a draggable list with v-model, an item slot and a reorder event.
---

A draggable list: reorder items with the mouse or touch, or with the keyboard
(`↑`/`↓` when an item is focused). **`<q-reorder>`** updates the `v-model` on drop
and emits `reorder` with `{ from, to }`. The `#item` slot receives
`{ item, index, dragging }`.

## Basic

Drag any row (the whole line is draggable by default). Items slide smoothly as you
move; release to commit.

::prose-show-case
:dnax-demo-reorder{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = ref(["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra"])
</script>

<template>
  <q-reorder v-model="items" @reorder="onReorder">
    <template #item="{ item, index, dragging }">
      <div class="row" :class="{ 'row--dragging': dragging }">
        <span class="row__index">{{ index + 1 }}</span>
        <span>{{ item }}</span>
      </div>
    </template>
  </q-reorder>
</template>
```
::

## Custom items

The `#item` slot renders anything; pass `row-key` for stable keys with object
items.

::prose-show-case
:dnax-demo-reorder{demo="custom"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const tracks = ref([
  { id: "m83", title: "Midnight City", artist: "M83" },
  { id: "daft", title: "Instant Crush", artist: "Daft Punk" },
  { id: "fm", title: "Feels Like We Only Go Backwards", artist: "Tame Impala" },
  { id: "blond", title: "Pink + White", artist: "Frank Ocean" },
])
</script>

<template>
  <q-reorder v-model="tracks" row-key="id">
    <template #item="{ item, dragging }">
      <div class="track" :class="{ 'track--dragging': dragging }">
        <span class="track__art">🎵</span>
        <div class="track__meta">
          <b>{{ item.title }}</b>
          <span>{{ item.artist }}</span>
        </div>
      </div>
    </template>
  </q-reorder>
</template>
```
::

## Handle mode

`handle` restricts the drag to the grip — ideal when rows contain interactive
content (buttons, inputs).

::prose-show-case
:dnax-demo-reorder{demo="handle"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const queue = ref(["Now playing", "Next up", "Later", "Last"])
</script>

<template>
  <q-reorder v-model="queue" handle>
    <template #item="{ item, index }">
      <span class="row">{{ index + 1 }}. {{ item }}</span>
    </template>
  </q-reorder>
  <!-- handle : le drag ne démarre que depuis la poignée (grip) -->
</template>
```
::

## Disabled

`disable` locks the list (no drag, no keyboard move).

::prose-show-case
:dnax-demo-reorder{demo="disabled"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const locked = ref(["Locked A", "Locked B", "Locked C"])
</script>

<template>
  <q-reorder v-model="locked" disable>
    <template #item="{ item }">
      <span class="row">{{ item }}</span>
    </template>
  </q-reorder>
</template>
```
::

## API

Slots: `#item` (receives `{ item, index, dragging }`) and `#handle` (default: grip
icon). Events: `update:modelValue` and `reorder` (`{ from, to }`).

:dnax-api{name="QReorder"}
