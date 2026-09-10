# v-touch-swipe

> Detects a fast released slide (swipe) with touch and mouse, filtered by direction and configurable thresholds.

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

<prose-show-case>
<dnax-demo-touch-swipe demo="basic">



</dnax-demo-touch-swipe>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Modifiers & value

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
        v-touch-swipe="handler"
      </code>
    </td>
    
    <td>
      Touch swipe in any direction (≥ 50px, ≤ 300ms).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .horizontal / .vertical
      </code>
    </td>
    
    <td>
      Capture only on the given axis.
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
      Includes the mouse.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        { distance, duration }
      </code>
    </td>
    
    <td>
      Custom thresholds (px / ms).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .stop / .prevent / .capture / .passive
      </code>
    </td>
    
    <td>
      Listener behavior.
    </td>
  </tr>
</tbody>
</table>
