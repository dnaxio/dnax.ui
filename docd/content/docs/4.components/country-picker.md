---
title: Country Picker
description: A ready-made country selector with flags, dialing codes and
  English/French search.
navigation:
  icon: lucide:globe
seo:
  title: Country Picker (QCountryPicker)
  description: QCountryPicker — a country selector bound to an ISO code, with flags, dialing codes and a searchable dataset.
---

A ready-made **country selector**: **`<q-country-picker>`** binds a `v-model` to an
ISO 3166-1 alpha-2 code (e.g. `"FR"`), shows the flag, name and dialing code, and
ships with a built-in search (name, code or dial), keyboard navigation and a full
country dataset in **English or French** (`language`). Four display `mode`s:
`inline` dropdown, `modal`, `sheet` and fullscreen `dialog` — no flags assets
needed (emoji flags).

## Modes

`mode` switches how the list opens: `inline` (dropdown under the field), `modal`
(centered panel), `sheet` (bottom sheet) or `dialog` (fullscreen). A `title` and a
`width` tune the panel. In `sheet` mode, drag the handle (or swipe) **down** to
dismiss — tune the threshold with `drag-threshold`. Per-mode options
(`sheet-options`, `modal-options`) override `height` of the list, `width`, `style`,
`class` and `search-placeholder`.

::prose-show-case
<dnax-demo-country-picker demo="modes"></dnax-demo-country-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("FR")
const mode = ref("inline")
const modes = [
  { label: "Inline", value: "inline" },
  { label: "Modal", value: "modal" },
  { label: "Sheet", value: "sheet" },
  { label: "Dialog", value: "dialog" },
]
</script>

<template>
  <q-btn
    v-for="m in modes"
    :key="m.value"
    flat
    no-caps
    :color="mode === m.value ? 'primary' : undefined"
    :label="m.label"
    @click="mode = m.value"
  />
  <q-country-picker v-model="code" :mode="mode" label="Country" outlined title="Select a country" />
</template>
```
::

## Sheet & modal options

`sheet-options` and `modal-options` override the panel per mode: `height`
(scrollable list), `width`, `style`, `class` and `search-placeholder`. Bottom-sheet
extras: `height` (panel), `translucent` (frosted glass), `rounded`, `persistent`
and `content-style`.

::prose-show-case
<dnax-demo-country-picker demo="sheet-options"></dnax-demo-country-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("FR")
</script>

<template>
  <q-country-picker
    v-model="code"
    mode="sheet"
    label="Country"
    outlined
    title="Select a country"
    :sheet-options="{ height: '45vh', searchPlaceholder: 'Find a country…' }"
    :height="'80vh'"
    translucent
    persistent
  />

  <!-- modalOptions accepte les mêmes clés : height, width, style, class, searchPlaceholder -->
</template>
```
::

## Basic

Click the field, type to filter, pick a country — the `v-model` receives the ISO
code.

::prose-show-case
<dnax-demo-country-picker demo="basic"></dnax-demo-country-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("FR")
</script>

<template>
  <q-country-picker v-model="code" label="Country" />
  <p class="demo-p demo-meta">Selected: <code>{{ code }}</code></p>
</template>
```
::

## Language

`language` switches the country names between `"en"` and `"fr"` — the search
matches both languages.

::prose-show-case
<dnax-demo-country-picker demo="language"></dnax-demo-country-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("FR")
const lang = ref("en")
const langOptions = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
]
</script>

<template>
  <q-select
    v-model="lang"
    :options="langOptions"
    emit-value
    option-label="label"
    option-value="value"
    outlined
    dense
    label="Language"
  />
  <q-country-picker v-model="code" :language="lang" label="Country" outlined />
</template>
```
::

## Field styles

The field reuses the design-system input styles: `outlined`, `filled`,
`borderless`, `dense` and a `label`.

::prose-show-case
<dnax-demo-country-picker demo="styles"></dnax-demo-country-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("FR")
</script>

<template>
  <q-country-picker v-model="code" label="Country" outlined dense />
  <q-country-picker v-model="code" label="Country" filled dense />
</template>
```
::

## Hide dialing code

`:show-dial="false"` hides the phone prefix — flag and name only.

::prose-show-case
<dnax-demo-country-picker demo="no-dial"></dnax-demo-country-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("FR")
</script>

<template>
  <q-country-picker v-model="code" label="Country" :show-dial="false" outlined />
</template>
```
::

## Custom country list

Pass your own `countries` (objects with `code`, `name` and `dial`) to restrict the
choices.

::prose-show-case
<dnax-demo-country-picker demo="custom"></dnax-demo-country-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("FR")
const shortList = [
  { code: "FR", name: "France", nameFr: "France", dial: "+33" },
  { code: "DE", name: "Germany", nameFr: "Allemagne", dial: "+49" },
  { code: "ES", name: "Spain", nameFr: "Espagne", dial: "+34" },
  { code: "IT", name: "Italy", nameFr: "Italie", dial: "+39" },
  { code: "PT", name: "Portugal", nameFr: "Portugal", dial: "+351" },
  { code: "NL", name: "Netherlands", nameFr: "Pays-Bas", dial: "+31" },
]
</script>

<template>
  <q-country-picker v-model="code" :countries="shortList" label="Europe" outlined />
</template>
```
::

## API

<dnax-api name="QCountryPicker"></dnax-api>
