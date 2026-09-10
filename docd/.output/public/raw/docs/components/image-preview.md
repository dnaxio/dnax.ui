# Image Preview

> A fullscreen image viewer with fade/up/zoom transitions, swipe navigation, a counter and dismiss events.

A fullscreen image viewer (lightbox) for a list of URLs. **<q-image-preview>**
opens with a `transition` (fade / up / down / zoom), navigates with a horizontal
**swipe**, arrow buttons or the keyboard, shows the position (`2 / 5`) and closes by
swiping **down**, clicking the backdrop or the optional `close-btn` — firing
`@dismiss` on close.

## Basic (transition up)

Click a thumbnail to open the viewer at that image — swipe horizontally to
navigate, swipe down to close.

<prose-show-case>
<dnax-demo-image-preview demo="basic">



</dnax-demo-image-preview>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const images = ["url-1.jpg", "url-2.jpg", "url-3.jpg", "url-4.jpg"]

const open = ref(false)
const index = ref(0)
</script>

<template>
  <div class="grid">
    <img v-for="(img, i) in images" :key="i" :src="img" class="thumb" @click="index = i; open = true" />
  </div>

  <q-image-preview v-model="open" :images="images" v-model:index="index" transition="up" />
</template>
```

</template>
</prose-show-case>

## Fade & close button

`transition="fade"` and `close-btn` adds a × in the top-right corner.

<prose-show-case>
<dnax-demo-image-preview demo="fade">



</dnax-demo-image-preview>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const images = ["url-1.jpg", "url-2.jpg", "url-3.jpg", "url-4.jpg"]

const open = ref(false)
const index = ref(0)
const dismissed = ref(0)
</script>

<template>
  <q-btn color="primary" no-caps label="Open gallery (fade)" @click="openFade = true" />
  <p class="demo-p demo-meta">Dismissed {{ dismissed }}×</p>

  <q-image-preview
    v-model="openFade"
    :images="images"
    v-model:index="indexFade"
    transition="fade"
    close-btn
    @dismiss="dismissed++"
  />
</template>
```

</template>
</prose-show-case>

## Zoom & no counter

`transition="zoom"` scales in; `:counter="false"` hides the position badge.

<prose-show-case>
<dnax-demo-image-preview demo="zoom">



</dnax-demo-image-preview>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const images = ["url-1.jpg", "url-2.jpg", "url-3.jpg", "url-4.jpg"]

const open = ref(false)
const index = ref(0)
const dismissed = ref(0)
</script>

<template>
  <q-btn color="secondary" no-caps label="Open with zoom" @click="openZoom = true" />

  <q-image-preview
    v-model="openZoom"
    :images="images"
    v-model:index="indexZoom"
    transition="zoom"
    close-btn
    :counter="false"
  />
</template>
```

</template>
</prose-show-case>

## Programmatic ($q.imagePreview)

Open the viewer from anywhere with `$q.imagePreview.open()` — rendered by the
automatically mounted `QImagePreviewProvider`. The returned controller exposes
`goTo(index)`.

<prose-show-case>
<dnax-demo-image-preview demo="programmatic">



</dnax-demo-image-preview>

<template v-slot:code="">

```ts
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

$q.imagePreview.open({
  images,
  index: 0,
  transition: "up",
  closeBtn: true,
  onDismiss: () => console.log("closed"),
})
```

</template>
</prose-show-case>

## API

<dnax-api name="QImagePreview">



</dnax-api>
