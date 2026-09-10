---
title: v-touch-pan
description: Detects the pan (drag) gesture with touch and mouse support, per-direction
  capture and live details.
navigation:
  icon: lucide:move
seo:
  title: v-touch-pan directive
  description: v-touch-pan — pan gesture detector with direction filters and Quasar-style details.
---

`v-touch-pan` detects the **pan** gesture (dragging an element) — the homegrown
replacement for Hammer.js, Quasar-style. It works with **touch and mouse**
(`.mouse` modifier), with per-direction capture (`.horizontal`, `.vertical`,
`.up/.down/.left/.right`) and optional scroll blocking (`.prevent`).

## Setup

Registered automatically by the `@dnax/ui` module (client mode):

```ts
// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-touch-pan.horizontal.mouse="onPan">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchPan } from "@dnax/ui"

app.directive("touch-pan", vTouchPan)
```

## Usage

```html
<!-- Tactile + souris (modifier .mouse), capture uniquement
     horizontale ; .prevent bloque le scroll natif pendant le pan -->
<div
  class="draggable"
  v-touch-pan.horizontal.mouse.prevent="onPan"
  :style="{ transform: 'translate(' + x + 'px, ' + y + 'px)' }"
>Drag me</div>
```

```ts
// Détails reçus (API Quasar) :
// { evt, position, direction, delta, distance, duration, speed,
//   isFirst, isFinal, isVertical, isHorizontal }
const onPan = ({ delta }) => {
  x.value += delta.x
  y.value += delta.y
}
```

## Live demo

Grab the dot (with the mouse) and drag it horizontally — the position follows the
pan and the details update live:

::prose-show-case
:dnax-demo-touch-pan{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const x = ref(0)
const y = ref(0)
const direction = ref("—")
const last = ref({ distance: { x: 0, y: 0 }, duration: 0, speed: { x: 0, y: 0 }, isFirst: false, isFinal: false })

const onPan = ({ delta, direction, distance, duration, speed, isFirst, isFinal }) => {
  x.value += delta.x
  y.value += delta.y
  direction.value = direction
  last.value = { distance, duration, speed, isFirst, isFinal }
}
</script>

<template>
  <div class="pan-stage">
    <div
      class="pan-ball"
      v-touch-pan.horizontal.mouse.prevent="onPan"
      :style="{ transform: 'translate(' + x + 'px, ' + y + 'px)' }"
    ></div>
  </div>

  <p>direction: {{ direction }} · distance: {{ last.distance.x }}, {{ last.distance.y }} ·
    duration: {{ last.duration }}ms · speed: {{ last.speed.x }}, {{ last.speed.y }}px/s ·
    isFirst: {{ last.isFirst }} · isFinal: {{ last.isFinal }}</p>
</template>
```
::

## Modifiers

| Usage | Effect |
| --- | --- |
| `v-touch-pan="handler"` | Touch pan — all directions (dominant axis at the first movement). |
| `.horizontal` | Horizontal-only capture (left/right); native vertical scroll stays possible. |
| `.vertical` | Vertical-only capture (up/down). |
| `.up / .down / .left / .right` | Capture on specific directions. |
| `.mouse` | Includes mouse events (default: touch only). |
| `.prevent` | Blocks native scroll during the pan (touch). |
| `.stop / .capture / .passive` | Listener behavior: stopPropagation, capture, passive. |

## Details

Each event calls your handler with a details object — same shape as Quasar:

| Property | Type | Meaning |
| --- | --- | --- |
| `evt` | `PointerEvent` | Source event (pointermove / pointerup). |
| `position` | `{ top, left }` | Current pointer position (clientY/clientX). |
| `direction` | `string` | `'up' \| 'down' \| 'left' \| 'right'` — dominant axis at start. |
| `delta` | `{ x, y }` | Movement since the last event (signed). |
| `distance` | `{ x, y }` | Total movement since the pan started (signed). |
| `duration` | `number` | Pan duration in ms. |
| `speed` | `{ x, y }` | Speed (px/s), positive per axis. |
| `isFirst / isFinal` | `boolean` | First / last event of the pan. |
| `isVertical / isHorizontal` | `boolean` | Axis retained for this pan. |
