---
title: Slider
description: A draggable range input with pointer and keyboard support — steps,
  markers, colors and a vertical orientation.
navigation:
  icon: lucide:sliders-horizontal
seo:
  title: Slider (QSlider)
  description: QSlider — a draggable range input (pointer + keyboard) with the Quasar API.
---

A draggable range input with pointer and keyboard support (arrows, Home/End). **`<q-slider>`** snaps to `step`, shows a value bubble (`label` / `label-always`), step `markers`, custom `color` / `track-color` / `thumb-color` and a `vertical` orientation.

## Basic usage

::prose-show-case
:dnax-demo-slider{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const val = ref(40)
</script>

<template>
  <q-slider v-model="val" :min="0" :max="100" :step="5" label />
</template>
```
::

## Steps & markers

`markers` draws a dot on every step; `label-always` keeps the value bubble visible instead of only while dragging.

::prose-show-case
:dnax-demo-slider{demo="markers"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const price = ref(120)
</script>

<template>
  <q-slider v-model="price" :min="0" :max="300" :step="30"
    label label-always markers color="teal" />
</template>
```
::

## Colors & snap

`snap` makes the thumb jump directly to the nearest step while dragging instead of rounding on release.

::prose-show-case
:dnax-demo-slider{demo="colors"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const volume = ref(60)
</script>

<template>
  <q-slider v-model="volume" :min="0" :max="100" :step="5" label snap color="secondary" />
</template>
```
::

## Disabled, readonly & vertical

::prose-show-case
:dnax-demo-slider{demo="states"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const locked = ref(50)
</script>

<template>
  <q-slider v-model="locked" label disable />
  <q-slider v-model="locked" label readonly color="teal" />
</template>
```
::

### Vertical

::prose-show-case
:dnax-demo-slider{demo="vertical"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const vertical = ref(70)
</script>

<template>
  <q-slider v-model="vertical" :min="0" :max="100"
    vertical label markers color="primary" />
</template>
```
::

## API

:dnax-api{name="QSlider"}
