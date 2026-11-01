---
title: Input textarea
description: A multi-line text field — visible rows, auto-growth capped at a max number
  of rows, manual resize, counter and validation states.
navigation:
  icon: lucide:wrap-text
seo:
  title: Input textarea (QInputTextarea)
  description: QInputTextarea — a dedicated multi-line field with rows, max-rows, resize,
    counter and the q-input field vocabulary.
---

A **multi-line** text field. **`<q-input-textarea>`** is textarea-only: unlike
[`<q-input>`](/docs/components/input), which switches between `<input>` and
`<textarea>` depending on its props, it is laid out *for* multi-line content — the text
is anchored to the top of the control, `rows` sets the visible height, and the growth
behaviour (`autogrow` + `max-rows`) is explicit.

It keeps the field vocabulary of `<q-input>`: `label` shown above, `outlined` /
`filled` / `borderless`, `dense`, `radius`, `error` / `error-message`, `hint`,
`counter`, `clearable`, `prefix` / `suffix`, and the `#prepend` / `#append` slots.

## Basic

`rows` defaults to `3`.

::prose-show-case
<dnax-demo-input-textarea demo="basic"></dnax-demo-input-textarea>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const bio = ref("")
</script>

<template>
  <q-input-textarea v-model="bio" label="Bio" placeholder="Tell us about yourself…" />
</template>
```
::

## Rows

`rows` is the number of visible lines — the control is sized by it, not by the content.
Use it for a fixed-height field (a comment box, a message body…).

::prose-show-case
<dnax-demo-input-textarea demo="rows"></dnax-demo-input-textarea>

#code

```vue
<template>
  <q-input-textarea v-model="oneLine" label="rows = 1" :rows="1" />
  <q-input-textarea v-model="bio" label="rows = 3 (default)" />
  <q-input-textarea v-model="sixLines" label="rows = 6" :rows="6" />
</template>
```
::

## Auto-grow

`autogrow` grows the field with its content. `max-rows` caps the growth: beyond that
the field scrolls (`overflow-y: auto`) instead of stretching the layout — the classic
"comment box" behaviour.

The height is measured **on mount** (a pre-filled multi-line value is never clipped),
on every value change, and when the field **width** changes (a narrower field wraps
into more lines).

::prose-show-case
<dnax-demo-input-textarea demo="autogrow"></dnax-demo-input-textarea>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const prefilled = ref("A first line.\nA second one.\nA third one.")
const capped = ref("")
</script>

<template>
  <q-input-textarea v-model="prefilled" label="Autogrow" autogrow />
  <q-input-textarea v-model="capped" label="Autogrow — max 4 lines" autogrow :max-rows="4" />
</template>
```
::

## Manual resize

`resize` gives the native resize handle back: `vertical` (height only) or `both`. It is
ignored with `autogrow`, since both would drive the height.

::prose-show-case
<dnax-demo-input-textarea demo="resize"></dnax-demo-input-textarea>

#code

```vue
<template>
  <q-input-textarea v-model="bio" label="resize = vertical" resize="vertical" />
  <q-input-textarea v-model="bio" label="resize = both" resize="both" :rows="2" />
</template>
```
::

## Counter, hint & error

`counter` shows `length / maxlength` under the field; `hint` and `error` +
`error-message` share the same line. The `#hint` and `#error` slots override the text.

::prose-show-case
<dnax-demo-input-textarea demo="counter"></dnax-demo-input-textarea>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const counted = ref("")
</script>

<template>
  <q-input-textarea v-model="counted" label="Message" counter :maxlength="120" />
</template>
```
::

## Variants & dense

::prose-show-case
<dnax-demo-input-textarea demo="variants"></dnax-demo-input-textarea>

#code

```vue
<template>
  <q-input-textarea v-model="outlinedVal" label="Outlined" outlined :rows="2" />
  <q-input-textarea v-model="filledVal" label="Filled" filled :rows="2" />
  <q-input-textarea v-model="borderlessVal" label="Borderless" borderless :rows="2" />
  <q-input-textarea v-model="denseVal" label="Dense" dense :rows="2" />
</template>
```
::

### States

::prose-show-case
<dnax-demo-input-textarea demo="states"></dnax-demo-input-textarea>

#code

```vue
<template>
  <q-input-textarea v-model="hintVal" label="With a hint" hint="Markdown is supported." />
  <q-input-textarea v-model="errorVal" label="With an error" error error-message="Please write at least 20 characters." />
  <q-input-textarea v-model="readonlyVal" label="Readonly" readonly :rows="2" />
  <q-input-textarea v-model="bio" label="Disabled" disable />
  <q-input-textarea v-model="prefilled" label="Clearable" clearable :rows="3" />
</template>
```
::

## `q-input` or `q-input-textarea`?

| Need | Use |
| --- | --- |
| One line, all the input types (`password`, `email`, `number`…) and `mask` | [`<q-input>`](/docs/components/input) |
| A textarea that grows from 1 line to a few lines | `<q-input autogrow :max-rows="4">` |
| A dedicated multi-line field with `rows`, manual `resize` and top-anchored text | `<q-input-textarea>` |

`<q-input>` renders a textarea as soon as `autogrow`, `rows > 1` or `resize` is set —
that keeps existing forms working, but `q-input-textarea` remains the recommended
component for a real multi-line field.

## API

<dnax-api name="QInputTextarea"></dnax-api>
