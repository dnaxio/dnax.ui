# Back Top

> A sticky floating button that appears after scrolling past an offset and smooth-scrolls back to the top.

A button **stuck to the corner of its scrollable parent** (`position: sticky` in
the parent div), which appears after scrolling down past `offset` px and smoothly
scrolls back to the top when clicked. It tracks the window scroll — or the nearest
scrollable container — and never disappears while scrolling (no fixed/transform
pitfalls).

## Basic

Scroll the stage below — after `offset="100"` px the round button fades in at the
bottom-right corner; click it to jump back to the top.

<prose-show-case>
<dnax-demo-back-top demo="basic">



</dnax-demo-back-top>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = ref(Array.from({ length: 30 }, (_, i) => "Row " + (i + 1)))
</script>

<template>
  <q-back-top :offset="100" />

  <!-- inside a scrollable container, it tracks that container's scroll -->
  <div class="scroll" style="max-height: 320px; overflow-y: auto">
    <p v-for="row in rows" :key="row">{{ row }}</p>
  </div>
  <q-back-top :offset="100" />
</template>
```

</template>
</prose-show-case>

## Positions

The button is `position: sticky` in its parent container — it stays glued to the
corner while the container scrolls (no `position: fixed`, so no ancestor can break
it). Scroll one of the stages below to reveal it at its corner:

<prose-show-case>
<dnax-demo-back-top demo="positions">



</dnax-demo-back-top>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = ref(Array.from({ length: 30 }, (_, i) => "Row " + (i + 1)))
</script>

<template>
  <q-back-top :offset="100" position="bottom-right" />
  <q-back-top :offset="100" position="bottom-left" />
  <q-back-top :offset="100" position="top-right" />
  <q-back-top :offset="100" position="top-left" />
</template>
```

</template>
</prose-show-case>

## Custom

`position` (bottom-right default, bottom-left, top-right, top-left), `color`, an
Iconify `icon` or a custom slot.

<prose-show-case>
<dnax-demo-back-top demo="custom">



</dnax-demo-back-top>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = ref(Array.from({ length: 30 }, (_, i) => "Row " + (i + 1)))
</script>

<template>
  <q-back-top
    :offset="100"
    position="bottom-left"
    color="secondary"
    icon="lucide:rocket"
  />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QBackTop">



</dnax-api>
