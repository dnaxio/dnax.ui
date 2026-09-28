---
title: v-touch-swipe
description: Detects a fast released slide (swipe) with touch and mouse, filtered by
  direction and configurable thresholds.
navigation:
  icon: lucide:move-horizontal
seo:
  title: v-touch-swipe directive
  description: v-touch-swipe — swipe detector with direction filters and custom distance/duration thresholds.
---

`v-touch-swipe` detects a **fast then released** slide (swipe), touch and mouse
(`.mouse` modifier), filtered by direction (`.horizontal`, `.vertical`,
`.up/.down/.left/.right`). Default thresholds: distance ≥ **50px**, duration ≤
**300ms**.

## Setup

```ts
// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-touch-swipe.horizontal.mouse="onSwipe">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchSwipe } from "@dnax/ui"

app.directive("touch-swipe", vTouchSwipe)
```

## Usage

```html
<div v-touch-swipe.horizontal.mouse="onSwipe">…</div>

<!-- seuils custom : distance 40px, durée max 300ms -->
<div v-touch-swipe="{ distance: 40, duration: 300 }">…</div>
```

```ts
// Détails reçus :
// { evt, direction, distance: { x, y }, duration, speed: { x, y } }
const onSwipe = ({ direction, distance, speed }) => {
  console.log('swipe', direction, distance, speed)
}
```

## Live demo

::prose-show-case
:dnax-demo-touch-swipe{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
const direction = ref("—")

const onSwipe = ({ direction, speed }) => {
  count.value++
  direction.value = direction
}
</script>

<template>
  <div class="swipe-pad" v-touch-swipe.horizontal.mouse.prevent="onSwipe">
    Swipe me ← / →
  </div>

  <p>swipes: {{ count }} · direction: {{ direction }} · speed: {{ speed }}</p>
</template>
```
::

## Modifiers & value

| Usage | Effect |
| --- | --- |
| `v-touch-swipe="handler"` | Touch swipe in any direction (≥ 50px, ≤ 300ms). |
| `.horizontal / .vertical` | Capture only on the given axis. |
| `.up / .down / .left / .right` | Capture on specific directions. |
| `.mouse` | Includes the mouse. |
| `{ distance, duration }` | Custom thresholds (px / ms). |
| `.stop / .prevent / .capture / .passive` | Listener behavior. |
