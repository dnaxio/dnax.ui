---
title: Rating
description: A star rating bound with v-model — custom max, Iconify icons, sizes,
  colors and readonly/disabled states.
navigation:
  icon: lucide:star
seo:
  title: Rating (QRating)
  description: QRating — a star rating bound with v-model, with custom max, icon, size and colors.
---

A star rating with `v-model` on the current value. **`<q-rating>`** supports a
custom `max`, any Iconify `icon`, color and `size` tokens, hover preview on
desktop, and dims unselected stars unless `no-dimming` is set.

## Basic usage

::prose-show-case
:dnax-demo-rating{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const note = ref(3)
</script>

<template>
  <q-rating v-model="note" :max="5" />
</template>
```
::

## Sizes & colors

`size` accepts `sm` | `md` | `lg` | `xl` or any CSS value; `color` takes a design
token or hex (default `warning`).

::prose-show-case
:dnax-demo-rating{demo="sizes"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const review = ref(4)
</script>

<template>
  <q-rating v-model="review" :max="5" color="secondary" size="sm" />
  <q-rating v-model="review" :max="5" color="warning" size="md" />
  <q-rating v-model="review" :max="5" color="primary" size="xl" />
</template>
```
::

## Custom icon

Any Iconify icon can replace the default star, and `no-dimming` keeps unselected
icons at full opacity.

::prose-show-case
:dnax-demo-rating{demo="icons"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const hearts = ref(5)
</script>

<template>
  <q-rating v-model="hearts" :max="5" icon="lucide:heart"
    color="red" no-dimming />
</template>
```
::

## Readonly & disabled

::prose-show-case
:dnax-demo-rating{demo="readonly"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const fixed = ref(5)
</script>

<template>
  <q-rating v-model="fixed" :max="5" readonly />
  <q-rating v-model="fixed" :max="5" color="teal" disable />
</template>
```
::

## API

:dnax-api{name="QRating"}
