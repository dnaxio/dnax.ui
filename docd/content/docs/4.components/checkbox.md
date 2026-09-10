---
title: Checkbox
description: A toggle control with boolean, indeterminate and array models —
  keyboard-accessible, with per-state icons and any color token.
navigation:
  icon: lucide:square-check
seo:
  title: Checkbox (QCheckbox)
  description: QCheckbox — a toggle control with boolean, indeterminate and array models.
---

A toggle control with three model shapes: a boolean, an indeterminate state (via
`indeterminate-value`) or an array of selected `val`s. **`<q-checkbox>`** is fully
keyboard-accessible, supports Iconify icons per state and accepts any color token.

## Basic usage

::prose-show-case
<dnax-demo-checkbox demo="simple"></dnax-demo-checkbox>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const checked = ref(true)
</script>

<template>
  <q-checkbox v-model="checked" label="Accept terms" color="secondary" />
</template>
```
::

## Array model (val)

When the `v-model` is an array, each checkbox adds or removes its `val` from the
list — the classic multi-select pattern.

::prose-show-case
<dnax-demo-checkbox demo="array"></dnax-demo-checkbox>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const features = ref(["wifi"])

const featureOptions = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "gps", label: "GPS" },
  { value: "bluetooth", label: "Bluetooth" },
]
</script>

<template>
  <q-checkbox v-for="opt in featureOptions" :key="opt.value"
    v-model="features" :val="opt.value" :label="opt.label" />
</template>
```
::

## Indeterminate state

Set `indeterminate-value` (default `null`) to render a mixed state — useful for a
"select all" master checkbox.

::prose-show-case
<dnax-demo-checkbox demo="indeterminate"></dnax-demo-checkbox>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const state = ref("mixed")
</script>

<template>
  <q-checkbox v-model="state" label="Select all"
    indeterminate-value="mixed" />
</template>
```
::

## Disabled, readonly & layout

::prose-show-case
<dnax-demo-checkbox demo="states"></dnax-demo-checkbox>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const locked = ref(false)
</script>

<template>
  <q-checkbox v-model="locked" label="Disabled" disable />
  <q-checkbox v-model="locked" label="Readonly" readonly color="secondary" />
</template>
```
::

### Label position & icons

::prose-show-case
<dnax-demo-checkbox demo="layout"></dnax-demo-checkbox>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const liked = ref(true)
</script>

<template>
  <q-checkbox v-model="liked" label="Left label" left-label color="teal" />
  <q-checkbox v-model="liked" color="primary"
    checked-icon="lucide:thumbs-up" unchecked-icon="lucide:thumbs-down" />
</template>
```
::

## API

<dnax-api name="QCheckbox"></dnax-api>
