# Gallery

> A responsive image grid with single or multiple selection, labels, a max-selected limit, hover zoom and a viewer mode.

A responsive grid of images with built-in selection. **<q-gallery>** takes URLs or
`{ src, label, description }` objects, and supports **single or multiple** selection
(`v-model` returns the raw items), optional `labels` under each image, a
`max-selected` limit, a `hover` zoom animation and a pure `viewer` mode — no images
selected, nothing to pick.

## Basic

Click an image to select it (single), click again to deselect — the `v-model`
receives the URL. `hover` adds a subtle zoom + shadow on mouse-over (respects
`prefers-reduced-motion`).

<prose-show-case>
<dnax-demo-gallery demo="basic">



</dnax-demo-gallery>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const IMAGES = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1287&auto=format&fit=crop",
]

const selected = ref<string | null>(null)
</script>

<template>
  <q-gallery v-model="selected" :images="IMAGES" hover />
  <p class="demo-p demo-meta">Selected: <code>{{ selected }}</code></p>
</template>
```

</template>
</prose-show-case>

## Multiple selection

`multiple` toggles items in an array; `max-selected` caps the count (here 4) and
dims the rest.

<prose-show-case>
<dnax-demo-gallery demo="multiple">



</dnax-demo-gallery>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const IMAGES = [/* … */]
const selected = ref<string[]>([])
</script>

<template>
  <q-gallery v-model="selected" :images="IMAGES" multiple :max-selected="4" />
  <p class="demo-p demo-meta">{{ selected.length }} selected (max 4)</p>
</template>
```

</template>
</prose-show-case>

## Labels & descriptions

Pass objects with `label` and `description`, add `labels` — the caption fades in
over the bottom of each image.

<prose-show-case>
<dnax-demo-gallery demo="labels">



</dnax-demo-gallery>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const LABELED = [
  { src: "img-1.jpg", label: "Alpine sunrise", description: "Golden light over the peaks" },
  { src: "img-2.jpg", label: "Coastal cliffs", description: "Wild ocean views" },
  { src: "img-3.jpg", label: "Forest trail", description: "Morning mist between the pines" },
  { src: "img-4.jpg", label: "Desert dunes", description: "Endless sand at dusk" },
]
const selected = ref<any[]>([])
</script>

<template>
  <q-gallery
    v-model="selected"
    :images="LABELED"
    labels
    :cols="2"
    multiple
  />
  <p class="demo-p demo-meta">{{ selected.length }} selected</p>
</template>
```

</template>
</prose-show-case>

## Custom data

Pass any JSON array and point to your own fields with `src-key`, `label-key` and
`description-key` — `@select` and the `v-model` return the **full original object**.

<prose-show-case>
<dnax-demo-gallery demo="custom">



</dnax-demo-gallery>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const photos = [
  { id: 1, url: "img-1.jpg", name: "Alpine sunrise", desc: "Golden light over the peaks" },
  { id: 2, url: "img-2.jpg", name: "Coastal cliffs", desc: "Wild ocean views" },
  { id: 3, url: "img-3.jpg", name: "Forest trail", desc: "Morning mist between the pines" },
  { id: 4, url: "img-4.jpg", name: "Desert dunes", desc: "Endless sand at dusk" },
]
const selected = ref<any[]>([])
const last = ref<any>(null)
</script>

<template>
  <q-gallery
    v-model="selected"
    :images="photos"
    src-key="url"
    label-key="name"
    description-key="desc"
    labels
    multiple
    @select="last = $event"
  />
  <p class="demo-p demo-meta">Last select: {{ JSON.stringify(last?.image) }}</p>
</template>
```

</template>
</prose-show-case>

## Viewer mode

`:selectable="false"` turns the gallery into a plain picture grid — no selection
state, no cursor.

<prose-show-case>
<dnax-demo-gallery demo="viewer">



</dnax-demo-gallery>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const IMAGES = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1287&auto=format&fit=crop",
]

const selected = ref<string | null>(null)
</script>

<template>
  <q-gallery :images="IMAGES" :cols="8" dense :selectable="false" />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QGallery">



</dnax-api>
