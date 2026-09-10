---
title: Input
description: A single-line text field with a label above, validation states, icons
  and affixes.
navigation:
  icon: lucide:text-cursor-input
seo:
  title: Input (QInput)
  description: QInput — a single-line text field with the Quasar API.
---

A single-line text field with a label shown above, validation states, icons and
affixes. **`<q-input>`** implements the Quasar field vocabulary — `outlined`,
`filled`, `borderless`, `clearable`, `counter`, `dense` — plus rounded corners
(`radius`) and an auto-growing textarea (`autogrow`). The label is always rendered
above the field.

## Basic usage

::prose-show-case
:dnax-demo-input{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const text = ref("")
</script>

<template>
  <q-input v-model="text" label="Email" placeholder="you@example.com" />
</template>
```
::

### Field types

::prose-show-case
:dnax-demo-input{demo="types"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const email = ref("")
const password = ref("")
const age = ref(null)
</script>

<template>
  <q-input v-model="email" type="email" label="Email" placeholder="you@example.com" />
  <q-input v-model="password" type="password" label="Password" />
  <q-input v-model="age" type="number" label="Age" />
</template>
```
::

### Autogrow textarea

::prose-show-case
:dnax-demo-input{demo="autogrow"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const bio = ref("")
</script>

<template>
  <q-input v-model="bio" label="Bio" autogrow placeholder="Write a few lines…" />
</template>
```
::

## Variants & density

The default field renders a bordered control with a white background. `outlined`
makes the background transparent, `filled` switches to a gray underline style and
`borderless` removes the border entirely.

::prose-show-case
:dnax-demo-input{demo="variants"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const outlinedVal = ref("")
const filledVal = ref("")
const borderlessVal = ref("")
</script>

<template>
  <q-input v-model="outlinedVal" label="Outlined" outlined />
  <q-input v-model="filledVal" label="Filled" filled />
  <q-input v-model="borderlessVal" label="Borderless" borderless />
</template>
```
::

### Dense & radius

::prose-show-case
:dnax-demo-input{demo="dense"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const denseVal = ref("")
</script>

<template>
  <q-input v-model="denseVal" label="Dense pill" dense radius placeholder="Rounded" />
</template>
```
::

## Clearable & counter

::prose-show-case
:dnax-demo-input{demo="clear"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const clearMe = ref("Hello Dnax")
const message = ref("")
</script>

<template>
  <q-input v-model="clearMe" label="Clearable" clearable />
  <q-input v-model="message" label="Message" counter :maxlength="20" />
</template>
```
::

### Icons & affixes

Leading/trailing icons through the `#prepend` / `#append` slots (which take
precedence), or quicker with the `icon-left` / `icon-right` props; static text via
`prefix` / `suffix`.

::prose-show-case
:dnax-demo-input{demo="affixes"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const username = ref("")
</script>

<template>
  <q-input v-model="username" label="Username" prefix="@">
    <template #prepend><q-icon name="lucide:user" /></template>
    <template #append><q-icon name="lucide:badge-check" /></template>
  </q-input>
</template>
```
::

::prose-show-case
:dnax-demo-input{demo="iconProps"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const email = ref("")
</script>

<template>
  <q-input v-model="email" label="Email" icon-left="lucide:mail" icon-right="lucide:check" />
</template>
```
::

## Mask

`mask` formats the input while typing — `#` digit, `A` letter, `N` alphanumeric,
`X` any; other characters are inserted automatically. `fill-mask` shows empty slots
as `_`; `unmasked-value` emits the value without the mask characters.

::prose-show-case
:dnax-demo-input{demo="mask"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const phone = ref("")
const code = ref("")
const birthDate = ref("")
</script>

<template>
  <q-input v-model="phone" label="Phone" mask="##-##-##-##" placeholder="12-34-56-78" outlined />
  <q-input v-model="code" label="Code" mask="XX-XX-XX" fill-mask placeholder="AB-CD-EF" outlined />
  <q-input v-model="date" label="Date" mask="##/##/####" placeholder="15/08/1990" outlined />
  <!-- # digit · A letter · N alphanumeric · X any -->
</template>
```
::

## Hint & error

::prose-show-case
:dnax-demo-input{demo="hint"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const hintEmail = ref("")
const errorEmail = ref("")
</script>

<template>
  <q-input v-model="hintEmail" label="Email" type="email" hint="We never share your email." />
  <q-input v-model="errorEmail" label="Email" type="email" error error-message="Please enter a valid email address." />
</template>
```
::

## API

:dnax-api{name="QInput"}
