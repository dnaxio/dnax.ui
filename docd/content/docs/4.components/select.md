---
title: Select
description: A dropdown selector for single or multiple values — inline, modal,
  sheet and dialog modes, fuzzy search, chips and primitive options.
navigation:
  icon: lucide:chevrons-up-down
seo:
  title: Select (QSelect)
  description: QSelect — a dropdown selector for single or multiple values with the Quasar API.
---

A dropdown selector for single or multiple values. **`<q-select>`** renders an inline dropdown by default, with `modal`, `sheet` and `dialog` modes for mobile, plus client-side fuzzy search (`use-search`), selected chips (`use-chips`) and `emit-value` to bind the option value instead of the whole object.

## Basic usage

::prose-show-case
:dnax-demo-select{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
]

const color = ref(null)
</script>

<template>
  <q-select
    v-model="color"
    :options="colors"
    label="Color"
    placeholder="Pick a color"
  />
</template>
```
::

### Custom option keys

By default the option `label` and `value` keys are used. With `option-label` / `option-value` you can map any object shape, and `emit-value` binds the raw value instead of the option object.

::prose-show-case
:dnax-demo-select{demo="customKeys"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const country = ref(null)

const countries = [
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "us", name: "United States" },
]
</script>

<template>
  <q-select
    v-model="country"
    :options="countries"
    option-label="name"
    option-value="id"
    label="Country"
    emit-value
  />
</template>
```
::

## Outlined & clearable

::prose-show-case
:dnax-demo-select{demo="outlined"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const framework = ref(null)

const frameworks = [
  { id: "vue", name: "Vue" },
  { id: "react", name: "React" },
  { id: "svelte", name: "Svelte" },
]
</script>

<template>
  <q-select
    v-model="framework"
    :options="frameworks"
    option-label="name"
    option-value="id"
    label="Framework"
    placeholder="Select…"
    outlined
    clearable
    dense
  />
</template>
```
::

## Multiple selection

With `multiple` the `v-model` becomes an array; `use-chips` displays each selection as a removable chip.

::prose-show-case
:dnax-demo-select{demo="multiple"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
]

const multi = ref([])
</script>

<template>
  <q-select
    v-model="multi"
    :options="colors"
    label="Favorite colors"
    multiple
    use-chips
    emit-value
    clearable
  />
</template>
```
::

## Primitive options

Passing plain strings or numbers as `options` works out of the box: each value is automatically normalized into `{ value, label }` (same value, stringified label), and the `v-model` keeps the original value.

::prose-show-case
:dnax-demo-select{demo="primitives"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const size = ref("")
const level = ref(0)
</script>

<template>
  <q-select
    v-model="size"
    :options="['S', 'M', 'L', 'XL']"
    label="Size"
  />

  <q-select
    v-model="level"
    :options="[1, 2, 3, 4, 5]"
    label="Level"
  />
  <!-- Les options string/number sont normalisées automatiquement en
       { value: x, label: x } — le v-model garde la valeur d'origine. -->
</template>
```
::

## API

:dnax-api{name="QSelect"}
