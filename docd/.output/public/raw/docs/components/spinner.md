# Spinner

> Loading indicators as crisp SVGs — thirteen types, any size and color, plus a thickness for the ring variants.

Loading indicators as crisp SVGs. **<q-spinner>** offers thirteen variants via `type` (tail, oval, bars, dots, grid, rings, puff, audio, ios, radio, gear, gears, cube), any `size`, any `color` and a `thickness` for the ring variants. Animations respect `prefers-reduced-motion`.

## Basic

The classic `tail` by default — a faint track with a rotating arc.

<prose-show-case>
<dnax-demo-spinner demo="basic">



</dnax-demo-spinner>

<template v-slot:code="">

```vue
<q-spinner size="40px" color="primary" />
<q-spinner type="ios" size="40px" color="secondary" />
<q-spinner type="audio" size="40px" color="positive" />
<q-spinner type="radio" size="40px" color="warning" />
<q-spinner type="gear" size="40px" color="info" />
<q-spinner type="gears" size="40px" color="teal" />
<q-spinner type="cube" size="40px" color="#7c3aed" />
```

</template>
</prose-show-case>

## All types

Switch `type` live: `tail`, `oval`, `bars`, `dots`, `grid`, `rings`, `puff`, `audio`, `ios`, `radio`, `gear`, `gears`, `cube`.

<prose-show-case>
<dnax-demo-spinner demo="types">



</dnax-demo-spinner>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const type = ref("tail")
const types = ["tail", "oval", "bars", "dots", "grid", "rings", "puff", "audio", "ios", "radio", "gear", "gears", "cube"]
</script>

<template>
  <q-select v-model="type" :options="types" outlined dense label="Type" />
  <q-spinner :type="type" size="44px" color="primary" />
</template>
```

</template>
</prose-show-case>

## Sizes

`size` accepts px or any CSS value.

<prose-show-case>
<dnax-demo-spinner demo="sizes">



</dnax-demo-spinner>

<template v-slot:code="">

```vue
<q-spinner size="16px" />
<q-spinner size="24px" color="secondary" />
<q-spinner size="36px" color="positive" />
<q-spinner size="48px" color="warning" />
<q-spinner size="64px" color="teal" />
```

</template>
</prose-show-case>

## Colors & thickness

Any token or hex; `thickness` tunes the stroke of the ring variants.

<prose-show-case>
<dnax-demo-spinner demo="colors">



</dnax-demo-spinner>

<template v-slot:code="">

```vue
<q-spinner :thickness="3" color="primary" />
<q-spinner :thickness="3" color="secondary" />
<q-spinner :thickness="3" color="#7c3aed" />
<q-spinner type="dots" color="negative" />
<q-spinner type="audio" color="warning" />
<q-spinner type="bars" color="positive" />
```

</template>
</prose-show-case>

## API

<dnax-api name="QSpinner">



</dnax-api>
