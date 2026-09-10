# Inner Loading

> An overlay spinner shown inside a container while it loads — label, size, color, dark overlay and custom icon.

An overlay spinner shown inside a container while it loads.
**<q-inner-loading>** covers its parent (which must be `position: relative`) with
a fading overlay — ideal for tables, cards and panels that fetch data.

## Basic

A simple spinner centered over the panel — toggle it with `showing` (boolean).

<prose-show-case>
<dnax-demo-inner-loading demo="basic">



</dnax-demo-inner-loading>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { reactive } from "vue"

const demo = reactive({ basic: false, label: false, dark: false, icon: false })

const run = (key) => {
  demo[key] = true
  setTimeout(() => (demo[key] = false), 1800)
}
</script>

<template>
  <div class="panel">
    <h3>Orders</h3>
    <p>Recent orders will appear here…</p>
    <q-inner-loading :showing="demo.basic" />
  </div>

  <q-btn unelevated color="primary" no-caps label="Reload" @click="run('basic')" />
</template>
```

</template>
</prose-show-case>

## Label & size

`label` adds a caption under the spinner; `size` is `sm | md | lg` or any CSS size;
`color` accepts a token or hex.

<prose-show-case>
<dnax-demo-inner-loading demo="label">



</dnax-demo-inner-loading>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { reactive } from "vue"

const demo = reactive({ basic: false, label: false, dark: false, icon: false })

const run = (key) => {
  demo[key] = true
  setTimeout(() => (demo[key] = false), 1800)
}
</script>

<template>
  <div class="panel">
    <h3>Exporting report</h3>
    <p>Generating the PDF file…</p>
    <q-inner-loading :showing="demo.label" label="Exporting…" color="secondary" size="lg" />
  </div>
</template>
```

</template>
</prose-show-case>

## Dark overlay

`dark` dims the overlay background — handy on light panels.

<prose-show-case>
<dnax-demo-inner-loading demo="dark">



</dnax-demo-inner-loading>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { reactive } from "vue"

const demo = reactive({ basic: false, label: false, dark: false, icon: false })

const run = (key) => {
  demo[key] = true
  setTimeout(() => (demo[key] = false), 1800)
}
</script>

<template>
  <div class="panel panel--dark">
    <h3>Syncing data</h3>
    <p>Waiting for the server…</p>
    <q-inner-loading :showing="demo.dark" label="Syncing…" dark size="sm" />
  </div>
</template>
```

</template>
</prose-show-case>

## Icon spinner

`icon` replaces the CSS spinner with an Iconify icon in rotation — any icon works
(loader, refresh, hourglass…).

<prose-show-case>
<dnax-demo-inner-loading demo="icon">



</dnax-demo-inner-loading>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { reactive } from "vue"

const demo = reactive({ basic: false, label: false, dark: false, icon: false })

const run = (key) => {
  demo[key] = true
  setTimeout(() => (demo[key] = false), 1800)
}
</script>

<template>
  <div class="panel">
    <h3>Refreshing feed</h3>
    <p>Fetching the latest posts…</p>
    <q-inner-loading :showing="demo.icon" icon="lucide:loader-circle" label="Refreshing…" color="positive" />
  </div>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QInnerLoading">



</dnax-api>
