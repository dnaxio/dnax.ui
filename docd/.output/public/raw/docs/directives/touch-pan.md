# v-touch-pan

> Detects the pan (drag) gesture with touch and mouse support, per-direction capture and live details.

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

<prose-show-case>
<dnax-demo-touch-pan demo="basic">



</dnax-demo-touch-pan>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Modifiers

<table>
<thead>
  <tr>
    <th>
      Usage
    </th>
    
    <th>
      Effect
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        v-touch-pan="handler"
      </code>
    </td>
    
    <td>
      Touch pan — all directions (dominant axis at the first movement).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .horizontal
      </code>
    </td>
    
    <td>
      Horizontal-only capture (left/right); native vertical scroll stays possible.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .vertical
      </code>
    </td>
    
    <td>
      Vertical-only capture (up/down).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .up / .down / .left / .right
      </code>
    </td>
    
    <td>
      Capture on specific directions.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .mouse
      </code>
    </td>
    
    <td>
      Includes mouse events (default: touch only).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .prevent
      </code>
    </td>
    
    <td>
      Blocks native scroll during the pan (touch).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .stop / .capture / .passive
      </code>
    </td>
    
    <td>
      Listener behavior: stopPropagation, capture, passive.
    </td>
  </tr>
</tbody>
</table>

## Details

Each event calls your handler with a details object — same shape as Quasar:

<table>
<thead>
  <tr>
    <th>
      Property
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Meaning
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        evt
      </code>
    </td>
    
    <td>
      <code>
        PointerEvent
      </code>
    </td>
    
    <td>
      Source event (pointermove / pointerup).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      <code>
        { top, left }
      </code>
    </td>
    
    <td>
      Current pointer position (clientY/clientX).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        direction
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      <code>
        'up' | 'down' | 'left' | 'right'
      </code>
      
       — dominant axis at start.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delta
      </code>
    </td>
    
    <td>
      <code>
        { x, y }
      </code>
    </td>
    
    <td>
      Movement since the last event (signed).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        distance
      </code>
    </td>
    
    <td>
      <code>
        { x, y }
      </code>
    </td>
    
    <td>
      Total movement since the pan started (signed).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        duration
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      Pan duration in ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
    </td>
    
    <td>
      <code>
        { x, y }
      </code>
    </td>
    
    <td>
      Speed (px/s), positive per axis.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isFirst / isFinal
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      First / last event of the pan.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isVertical / isHorizontal
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      Axis retained for this pan.
    </td>
  </tr>
</tbody>
</table>
