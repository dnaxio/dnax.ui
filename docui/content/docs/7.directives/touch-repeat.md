---
title: v-touch-repeat
description: Repeats a handler while an element is pressed — ideal for steppers,
  counters and continuous scrolling.
navigation:
  icon: lucide:repeat
seo:
  title: v-touch-repeat directive
  description: v-touch-repeat — repeat a handler while pressed, with configurable delay and interval.
---

`v-touch-repeat` repeats a handler **while the element is pressed** (touch and
mouse via `.mouse`): a first call after the **delay** (600 ms by default), then
every **interval** ms (150 ms by default) — ideal for steppers (+ / −), counters
or continuous scrolling.

## Setup

```ts
// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <button v-touch-repeat.mouse="onRepeat">…</button>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchRepeat } from "@dnax/ui"

app.directive("touch-repeat", vTouchRepeat)
```

## Usage

```html
<button v-touch-repeat.mouse="onRepeat">Hold to repeat</button>

<!-- réglages : 500ms avant le 1er appel, puis toutes les 100ms -->
<button v-touch-repeat.mouse="{ delay: 500, interval: 100 }">…</button>

<!-- ou forme courte '500:100' -->
```

```ts
// Détails reçus :
// { evt, count, elapsed }
const onRepeat = ({ count }) => {
  console.log('repeat', count)
}
```

## Live demo

::prose-show-case
:dnax-demo-touch-repeat{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const value = ref(0)
const onRepeat = () => { value.value++ }
</script>

<template>
  <div class="repeat-row">
    <button class="repeat-pad" type="button" v-touch-repeat.mouse="onRepeat">
      +1 (600 / 150ms)
    </button>
    <button class="repeat-pad repeat-pad--fast" type="button"
      v-touch-repeat.mouse="{ delay: 400, interval: 60 }">
      +1 (400 / 60ms)
    </button>
  </div>

  <p>value: {{ value }} · fast: {{ fastValue }}</p>
</template>
```
::

## Modifiers & value

| Usage | Effect |
| --- | --- |
| `v-touch-repeat="handler"` | First call after 600 ms, then every 150 ms. |
| `600` (number) | Custom repeat interval. |
| `'500:100'` | Delay : interval. |
| `{ delay, interval }` | Settings as an object. |
| `.mouse` | Includes the mouse. |
| `.stop / .prevent / .capture / .passive` | Listener behavior. |
