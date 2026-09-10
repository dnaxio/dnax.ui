# v-touch-hold

> Detects a long press with touch and mouse, a configurable delay and a consumed gesture (no click on top).

`v-touch-hold` detects a **long press** (hold) — touch and mouse (`.mouse`
modifier). The default delay is **600 ms**, sensitivity **5px** (touch) / **7px**
(mouse), all configurable. Once triggered, the gesture is **consumed**: the long
press does not produce a click on top.

## Setup

Registered automatically by the `@dnax/ui` module (client mode):

```ts
// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-touch-hold.mouse="onHold">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchHold } from "@dnax/ui"

app.directive("touch-hold", vTouchHold)
```

## Usage

```html
<div v-touch-hold.mouse="onHold">
  Press and hold me
</div>

<!-- délai personnalisé : 400ms, 8px tactile, 10px souris -->
<div v-touch-hold.mouse="'400:8:10'">…</div>

<!-- ou objet : 350ms, sensibilité 6px -->
<div v-touch-hold.mouse="{ time: 350, sensitivity: 6 }">…</div>
```

```ts
// Détails reçus :
// { evt, position: { left, top }, duration }
const onHold = ({ position, duration }) => {
  console.log('hold', duration + 'ms', position)
}
```

## Live demo

Press and hold (with the mouse) on a pad: the first one uses the default delay
(600 ms), the second a 350 ms delay — a `@click` on the fast pad does not fire
after a hold (gesture consumed):

<prose-show-case>
<dnax-demo-touch-hold demo="basic">



</dnax-demo-touch-hold>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
const last = ref({ duration: 0, x: 0, y: 0 })

const onHold = ({ position, duration }) => {
  count.value++
  last.value = { duration, x: Math.round(position.left), y: Math.round(position.top) }
}
</script>

<template>
  <div class="hold-row">
    <button class="hold-pad" v-touch-hold.mouse="onHold">
      Hold 600ms
    </button>
    <button class="hold-pad hold-pad--fast" v-touch-hold.mouse="{ time: 350, sensitivity: 6 }" @click="fastCount++">
      Hold 350ms
    </button>
  </div>

  <p>holds: {{ count }} · fast: {{ fastCount }} · last:
    {{ last.duration }}ms at {{ last.x }}, {{ last.y }}</p>
</template>
```

</template>
</prose-show-case>

## Value

<table>
<thead>
  <tr>
    <th>
      Value
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
        handler
      </code>
    </td>
    
    <td>
      Hold for 600 ms (default) — sensitivity 5px touch / 7px mouse.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        number (e.g. 400)
      </code>
    </td>
    
    <td>
      Custom hold delay in ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        '400:8:10'
      </code>
    </td>
    
    <td>
      Delay + touch sensitivity + mouse sensitivity (Quasar-style arg).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        { time, sensitivity, mouseSensitivity }
      </code>
    </td>
    
    <td>
      Same settings as an object.
    </td>
  </tr>
</tbody>
</table>

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
        v-touch-hold="handler"
      </code>
    </td>
    
    <td>
      Touch-only long press (600 ms by default).
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
        .capture / .mouseCapture
      </code>
    </td>
    
    <td>
      Capture: the hold still applies even if a child calls stopPropagation.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .prevent / .stop / .passive
      </code>
    </td>
    
    <td>
      Event behavior (preventDefault, stopPropagation, passive).
    </td>
  </tr>
</tbody>
</table>
