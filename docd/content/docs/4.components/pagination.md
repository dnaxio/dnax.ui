---
title: Pagination
description: Page navigation with v-model, boundary and direction links, a
  collapsible window, sizes and color variants.
navigation:
  icon: lucide:list-ordered
seo:
  title: Pagination (QPagination)
  description: QPagination — page navigation with the Quasar API.
---

Page navigation with a Quasar API: `v-model` holds the current page, `max` the last
one. **`<q-pagination>`** supports first/last (`boundary-links`) and prev/next
(`direction-links`) buttons, a collapsible window with ellipses (`max-pages`), sizes
and color variants.

## Paginated list

The real-world use: slice a collection by page and wire the pagination below it.

::prose-show-case
:dnax-demo-pagination{demo="list"}

#code

```vue
<script setup lang="ts">
import { computed, ref } from "vue"

const allItems = ref(Array.from({ length: 23 }, (_, i) => "Row " + (i + 1)))
const page = ref(1)
const perPage = 5
const pageItems = computed(() => allItems.value.slice((page.value - 1) * perPage, page.value * perPage))
const maxPage = computed(() => Math.ceil(allItems.value.length / perPage))
</script>

<template>
  <div class="list">
    <div v-for="it in pageItems" :key="it" class="row">{{ it }}</div>
  </div>
  <q-pagination v-model="page" :max="maxPage" boundary-links direction-links />
  <p class="demo-p demo-meta">Page {{ page }} / {{ maxPage }} — {{ allItems.length }} rows, {{ perPage }} per page.</p>
</template>
```
::

## Basic

The simplest form: all pages as buttons, the active one highlighted with
`active-color` (default primary).

::prose-show-case
:dnax-demo-pagination{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const page = ref(4)
</script>

<template>
  <q-pagination v-model="page" :max="10" />
  <p class="demo-p demo-meta">Current page: {{ page }}</p>
</template>
```
::

## Window & ellipses

`max-pages` caps the number of page buttons around the current one — gaps collapse
into ellipses: `1 … 5 6 7 … 20`.

::prose-show-case
:dnax-demo-pagination{demo="window"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const page = ref(7)
</script>

<template>
  <q-pagination v-model="page" :max="20" :max-pages="5" boundary-links />
  <!-- max-pages = fenêtre de boutons : 1 … 5 6 7 … 20 (ellipses sur les trous) -->
</template>
```
::

## Variants & sizes

Same button vocabulary as `q-btn`: `flat`, `outline`, `unelevated`, `rounded`,
`square`, `dense` — plus `size` (xs → xl or a CSS value) and `active-color`.

::prose-show-case
:dnax-demo-pagination{demo="variants"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const page = ref(3)
</script>

<template>
  <q-pagination v-model="page" :max="8" rounded outline dense active-color="secondary" />
  <q-pagination v-model="page" :max="8" unelevated size="lg" active-color="teal" />
</template>
```
::

## API

:dnax-api{name="QPagination"}
