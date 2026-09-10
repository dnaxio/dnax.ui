---
title: Infinite Scroll
description: Loads more content automatically when you approach the bottom of a
  page or of a scrollable container.
navigation:
  icon: lucide:infinity
seo:
  title: Infinite Scroll (QInfiniteScroll)
  description: QInfiniteScroll — auto-load more content near the bottom of a scrollable list.
---

Loads more content automatically when you approach the bottom of the page or of a
scrollable container. **`<q-infinite-scroll>`** emits `load(index, done)` when the
scroll position is within `offset` px of the bottom — call `done()` when your fetch
finishes to re-arm the scroller.

## Basic

20 items are loaded first; scrolling near the bottom appends 10 more (60 max). The
spinner shows while `done()` hasn't been called.

::prose-show-case
<dnax-demo-infinite-scroll demo="basic"></dnax-demo-infinite-scroll>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = ref(Array.from({ length: 20 }, (_, i) => "Item " + (i + 1)))
let seq = 20
const total = 60

const loadMore = (index, done) => {
  setTimeout(() => {
    const next = Math.min(seq + 10, total)
    for (let i = seq + 1; i <= next; i++) items.value.push("Item " + i)
    seq = next
    done()
  }, 700)
}
</script>

<template>
  <q-infinite-scroll :offset="200" @load="loadMore">
    <div class="item" v-for="it in items" :key="it">{{ it }}</div>
  </q-infinite-scroll>
</template>
```
::

## Animated

`animated` fades + slides each newly appended item up when it mounts (0.3s,
disabled with `prefers-reduced-motion`).

::prose-show-case
<dnax-demo-infinite-scroll demo="animated"></dnax-demo-infinite-scroll>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = ref(Array.from({ length: 20 }, (_, i) => "Item " + (i + 1)))
let seq = 20
const total = 60

const loadMore = (index, done) => {
  setTimeout(() => {
    const next = Math.min(seq + 10, total)
    for (let i = seq + 1; i <= next; i++) items.value.push("Item " + i)
    seq = next
    done()
  }, 700)
}
</script>

<template>
  <q-infinite-scroll :offset="200" animated @load="loadMore">
    <div class="item" v-for="it in items" :key="it">{{ it }}</div>
  </q-infinite-scroll>
  <!-- animated: each new item fades + slides up on mount -->
</template>
```
::

## Custom loading

The `#loading` slot replaces the default spinner — any content works. Combine with
`disable` to stop loading (e.g. no more pages).

::prose-show-case
<dnax-demo-infinite-scroll demo="slot"></dnax-demo-infinite-scroll>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = ref(Array.from({ length: 20 }, (_, i) => "Item " + (i + 1)))
let seq = 20
const total = 60

const loadMore = (index, done) => {
  setTimeout(() => {
    const next = Math.min(seq + 10, total)
    for (let i = seq + 1; i <= next; i++) items.value.push("Item " + i)
    seq = next
    done()
  }, 700)
}
</script>

<template>
  <q-infinite-scroll :offset="200" @load="loadMore">
    <div class="item" v-for="it in items" :key="it">{{ it }}</div>
    <template #loading>
      <q-spinner />
    </template>
  </q-infinite-scroll>
</template>
```
::

### Silent loading

`hide-loading` hides the indicator entirely — content just appears as you scroll
(the TikTok / Instagram feed pattern). Combine with `animated` for a subtle
entrance.

::prose-show-case
<dnax-demo-infinite-scroll demo="silent"></dnax-demo-infinite-scroll>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = ref(Array.from({ length: 20 }, (_, i) => "Item " + (i + 1)))
let seq = 20
const total = 60

const loadMore = (index, done) => {
  setTimeout(() => {
    const next = Math.min(seq + 10, total)
    for (let i = seq + 1; i <= next; i++) items.value.push("Item " + i)
    seq = next
    done()
  }, 700)
}
</script>

<template>
  <q-infinite-scroll :offset="200" hide-loading animated @load="loadMore">
    <div class="item" v-for="it in items" :key="it">{{ it }}</div>
  </q-infinite-scroll>
  <!-- hide-loading: no spinner — items just appear (TikTok / Instagram style) -->
</template>
```
::

## API

<dnax-api name="QInfiniteScroll"></dnax-api>
