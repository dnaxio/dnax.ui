# Linear Progress

> A linear progress bar — determinate, striped, reversed or indeterminate, with a configurable range and thickness.

A linear progress bar. **<q-linear-progress>** takes a `value` (default range
0–1, custom with `min` / `max`), a `color` and `track-color`, a thickness (`size`),
plus `stripe`, `reverse`, `rounded` and the indeterminate / query loading modes.

## Basic values

The `value` is a ratio (0–1 by default); the bar fills from left to right.

<prose-show-case>
<div className="demo-col">
<q-linear-progress :value="0.25">



</q-linear-progress>


  <q-linear-progress :value="0.5" color="secondary">



</q-linear-progress>


  <q-linear-progress :value="0.75" color="positive">



</q-linear-progress>


  <q-linear-progress :value="1" color="teal">



</q-linear-progress>
</div>

<template v-slot:code="">

```vue
<q-linear-progress :value="0.25" />
<q-linear-progress :value="0.5" color="secondary" />
<q-linear-progress :value="0.75" color="positive" />
<q-linear-progress :value="1" color="teal" />
```

</template>
</prose-show-case>

## Simulated download

Drive the `value` with a timer for a live progress — rounded and thicker for a UI
bar.

<prose-show-case>
<dnax-demo-linear-progress demo="download">



</dnax-demo-linear-progress>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue"

const progress = ref(0)
let timer = null

const startDownload = () => {
  if (timer) return
  progress.value = 0
  timer = setInterval(() => {
    progress.value += Math.random() * 0.12
    if (progress.value >= 1) {
      progress.value = 1
      clearInterval(timer)
      timer = null
    }
  }, 180)
}

onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <q-linear-progress :value="progress" color="positive" size="8px" rounded />
  <p class="demo-p demo-meta">{{ Math.round(progress * 100) }}% — press Start to simulate a download.</p>
  <q-btn label="Start download" color="primary" @click="startDownload" />
</template>
```

</template>
</prose-show-case>

## Colors & stripe

`color` accepts any token or hex; `stripe` adds animated stripes.

<prose-show-case>
<div className="demo-col">
<q-linear-progress :value="0.7" color="primary" stripe="">



</q-linear-progress>


  <q-linear-progress :value="0.6" color="secondary" stripe="">



</q-linear-progress>


  <q-linear-progress :value="0.8" color="negative">



</q-linear-progress>


  <q-linear-progress :value="0.9" color="warning">



</q-linear-progress>


  <q-linear-progress :value="0.5" color="#7c3aed">



</q-linear-progress>
</div>

<template v-slot:code="">

```vue
<q-linear-progress :value="0.7" color="primary" stripe />
<q-linear-progress :value="0.6" color="secondary" stripe />
<q-linear-progress :value="0.8" color="negative" />
<q-linear-progress :value="0.9" color="warning" />
<q-linear-progress :value="0.5" color="#7c3aed" />
```

</template>
</prose-show-case>

## Sizes

`size` sets the thickness (default 4 px) — from a hairline to a chunky bar;
`rounded` softens the ends.

<prose-show-case>
<div className="demo-col">
<q-linear-progress :value="0.5" size="2px">



</q-linear-progress>


  <q-linear-progress :value="0.5" size="4px" color="secondary">



</q-linear-progress>


  <q-linear-progress :value="0.5" size="8px" color="positive">



</q-linear-progress>


  <q-linear-progress :value="0.5" size="12px" color="warning" rounded="">



</q-linear-progress>


  <q-linear-progress :value="0.5" size="16px" color="teal" rounded="">



</q-linear-progress>
</div>

<template v-slot:code="">

```vue
<q-linear-progress :value="0.5" size="2px" />
<q-linear-progress :value="0.5" size="4px" color="secondary" />
<q-linear-progress :value="0.5" size="8px" color="positive" />
<q-linear-progress :value="0.5" size="12px" color="warning" rounded />
<q-linear-progress :value="0.5" size="16px" color="teal" rounded />
```

</template>
</prose-show-case>

## Loading modes

`indeterminate` sweeps a band across the track (loading…); `query` is the reverse
sweep (search…).

<prose-show-case>
<div className="demo-col">

Indeterminate — loading…


  <q-linear-progress indeterminate="">



</q-linear-progress>


  Query — search…


  <q-linear-progress query="" color="secondary">



</q-linear-progress>
</div>

<template v-slot:code="">

```vue
<div class="group">
  <p class="demo-p demo-label">Indeterminate — loading…</p>
  <q-linear-progress indeterminate />
  <p class="demo-p demo-label">Query — search…</p>
  <q-linear-progress query color="secondary" />
</div>
```

</template>
</prose-show-case>

## Custom range & reverse

`min`/`max` remap the value (e.g. 0–100); `reverse` fills from the right.

<prose-show-case>
<div className="demo-col">
<q-linear-progress :value="60" :min="0" :max="100" color="secondary">



</q-linear-progress>


  value = 60 (min 0, max 100)


  <q-linear-progress :value="0.7" reverse="" color="teal" stripe="">



</q-linear-progress>


  reverse — fills from the right

</div>

<template v-slot:code="">

```vue
<q-linear-progress :value="60" :min="0" :max="100" color="secondary" />
<p class="demo-p demo-meta">value = 60 (min 0, max 100)</p>
<q-linear-progress :value="0.7" reverse color="teal" stripe />
<p class="demo-p demo-meta">reverse — fills from the right</p>
```

</template>
</prose-show-case>

## API

<dnax-api name="QLinearProgress">



</dnax-api>
