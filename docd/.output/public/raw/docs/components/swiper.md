# Swiper

> A full-featured carousel — slides-per-view, loop, navigation, autoplay, effects, thumbs, virtual and more.

A full-featured carousel: **<q-swiper>** takes every parameter as a prop
(`slides-per-view`, `space-between`, `loop`, `navigation`, `autoplay`, `effect`,
`virtual`…) and emits events (`@slide-change`, `@swiper`…).
**<q-swiper-slide>** is the slide (with `virtual-index`, `zoom`) exposing
`isActive`/`isVisible`… via its slot. Every module is pre-registered — autoplay,
free mode, grid, parallax, all effects (fade, coverflow, cards, cube, flip,
creative), navigation, pagination, scrollbar, keyboard, mousewheel, zoom,
virtual, thumbs, controller, hash navigation, a11y.

## Basic

`slides-per-view`, `space-between`, `loop` and `centered-slides` — drag with the
mouse or swipe on touch.

<prose-show-case>
<dnax-demo-swiper demo="basic">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<script setup lang="ts">
const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]
</script>

<template>
  <q-swiper :slides-per-view="2" :space-between="16" loop centered-slides>
    <q-swiper-slide v-for="i in 8" :key="i">
      <div class="slide slide--img">
        <img class="slide__img" :src="images[i % images.length]" :alt="'Slide ' + (i + 1)" />
        <span class="slide__caption">Slide {{ i + 1 }}</span>
      </div>
    </q-swiper-slide>
  </q-swiper>
  <!-- loop exige plus de slides que slides-per-view (ici 8 pour 2 par vue). -->
</template>
```

</template>
</prose-show-case>

`loop` needs more slides than `slides-per-view` — here 8 slides for 2 per view
(Swiper warns otherwise).

## Navigation & pagination

`navigation` adds prev/next arrows, `:pagination="{ clickable: true }"` the
bullets — both themed with the design-system primary color.

<prose-show-case>
<dnax-demo-swiper demo="nav">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const current = ref(1)
</script>

<template>
  <q-swiper navigation :pagination="{ clickable: true }" @slide-change="current = $event.realIndex + 1">
    <q-swiper-slide v-for="i in 5" :key="i">
      <div class="slide">Slide {{ i }}</div>
    </q-swiper-slide>
  </q-swiper>
  <p class="demo-p demo-meta">Current slide: {{ current }}</p>
</template>
```

</template>
</prose-show-case>

## Autoplay

`:autoplay="{ delay: 1800 }"` advances automatically;
`disableOnInteraction: false` keeps it running after you drag.

<prose-show-case>
<dnax-demo-swiper demo="autoplay">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<q-swiper :autoplay="{ delay: 1800, disableOnInteraction: false }" loop>
  <q-swiper-slide v-for="i in 5" :key="i">
    <div class="slide">Autoplay {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
```

</template>
</prose-show-case>

## Free mode & mousewheel

`free-mode` removes the snap (scroll freely), `mousewheel` enables wheel
scrolling and `grab-cursor` shows a grab hand.

<prose-show-case>
<dnax-demo-swiper demo="free">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<q-swiper free-mode mousewheel grab-cursor :slides-per-view="3" :space-between="16">
  <q-swiper-slide v-for="i in 9" :key="i">
    <div class="slide slide--sm">Free {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- free-mode : défilement libre sans snap · mousewheel · grab-cursor -->
```

</template>
</prose-show-case>

## Keyboard & scrollbar

`keyboard` navigates with the arrow keys (focus the carousel first);
`:scrollbar="{ draggable: true }"` adds a draggable bar.

<prose-show-case>
<dnax-demo-swiper demo="keyboard">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<q-swiper keyboard :scrollbar="{ draggable: true }" :slides-per-view="3" :space-between="16">
  <q-swiper-slide v-for="i in 8" :key="i">
    <div class="slide slide--sm">KB {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- keyboard : flèches ← → après focus · scrollbar draggable -->
```

</template>
</prose-show-case>

## Grid

`:grid="{ rows: 2, fill: 'row' }"` arranges the slides on several rows (fixed
height required).

<prose-show-case>
<dnax-demo-swiper demo="grid">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<q-swiper :slides-per-view="3" :space-between="16" :grid="{ rows: 2, fill: 'row' }" class="fixed">
  <q-swiper-slide v-for="i in 8" :key="i">
    <div class="slide slide--sm">Grid {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- grid : 2 rangées × 3 colonnes (hauteur fixe requise) -->
```

</template>
</prose-show-case>

## Effects

`effect` switches the transition: `slide`, `fade`, `cube`, `flip`,
`coverflow`, `cards`, `creative`. Non-slide effects require a fixed-height
container.

<prose-show-case>
<dnax-demo-swiper demo="effects">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const effect = ref("coverflow")
const effects = ["slide", "fade", "cube", "flip", "coverflow", "cards", "creative"]

const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]
</script>

<template>
  <q-select v-model="effect" :options="effects" outlined dense label="Effect" class="select" />
  <q-swiper :effect="effect" class="fixed">
    <q-swiper-slide v-for="(img, i) in images" :key="i">
      <div class="slide slide--img">
        <img class="slide__img" :src="img" :alt="effect" />
        <span class="slide__caption">{{ effect }}</span>
      </div>
    </q-swiper-slide>
  </q-swiper>
</template>
```

</template>
</prose-show-case>

## Parallax

`parallax` moves elements with `data-swiper-parallax` at different speeds while
dragging.

<prose-show-case>
<dnax-demo-swiper demo="parallax">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<q-swiper parallax class="fixed">
  <q-swiper-slide v-for="i in 4" :key="i">
    <div class="parallax">
      <div class="parallax__title" data-swiper-parallax="300">Slide {{ i }}</div>
      <p class="parallax__text" data-swiper-parallax="200">Layers move at different speeds as you drag.</p>
    </div>
  </q-swiper-slide>
</q-swiper>
```

</template>
</prose-show-case>

## Zoom

`:zoom="true"` + the slide `zoom` prop — double-click (or pinch on touch) to
zoom in.

<prose-show-case>
<dnax-demo-swiper demo="zoom">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<script setup lang="ts">
const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]
</script>

<template>
  <q-swiper :zoom="true" :slides-per-view="2" :space-between="16" class="fixed">
    <q-swiper-slide v-for="(img, i) in images" :key="i" zoom>
      <img class="img" :src="img" :alt="'Zoom ' + (i + 1)" />
    </q-swiper-slide>
  </q-swiper>
  <!-- zoom : double-clic (ou pincement) pour zoomer -->
</template>
```

</template>
</prose-show-case>

## Thumbs gallery

A second carousel acts as a thumbnail strip: pass its instance via
`:thumbs="{ swiper }"` and set `watch-slides-progress` on it.

<prose-show-case>
<dnax-demo-swiper demo="thumbs">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const thumbs = ref(null)

const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]
</script>

<template>
  <q-swiper :thumbs="{ swiper: thumbs }" :space-between="12" class="fixed">
    <q-swiper-slide v-for="(img, i) in images" :key="i">
      <div class="slide slide--img">
        <img class="slide__img" :src="img" :alt="'Gallery ' + (i + 1)" />
      </div>
    </q-swiper-slide>
  </q-swiper>

  <q-swiper watch-slides-progress :slides-per-view="4" :space-between="12" class="thumbs" @swiper="(s) => (thumbs = s)">
    <q-swiper-slide v-for="(img, i) in images" :key="i">
      <img class="thumb__img" :src="img" :alt="'Thumb ' + (i + 1)" />
    </q-swiper-slide>
  </q-swiper>
</template>
```

</template>
</prose-show-case>

## Controller

A **master** carousel drives a **slave** one via
`:controller="{ control: master }"`. Keep it **unidirectional** — mutual
control loops forever.

<prose-show-case>
<dnax-demo-swiper demo="controller">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const master = ref()
</script>

<template>
  <q-swiper :slides-per-view="3" :space-between="12" @swiper="(s) => (master = s)">
    <q-swiper-slide v-for="i in 5" :key="i">
      <div class="slide slide--sm">Master {{ i }}</div>
    </q-swiper-slide>
  </q-swiper>

  <q-swiper :controller="{ control: master }" :slides-per-view="3" :space-between="12">
    <q-swiper-slide v-for="i in 5" :key="i">
      <div class="slide slide--sm">Slave {{ i }}</div>
    </q-swiper-slide>
  </q-swiper>
  <!-- Unidirectionnel : le master pilote le slave (le contrôle mutuel ferait une boucle infinie). -->
</template>
```

</template>
</prose-show-case>

## Hash navigation

`hash-navigation` mirrors the active slide in the URL hash (`#slide/1`…) and
restores it on load.

<prose-show-case>
<dnax-demo-swiper demo="hash">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<q-swiper hash-navigation class="fixed">
  <q-swiper-slide v-for="i in 4" :key="i">
    <div class="slide slide--tall">#slide/{{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- hash-navigation : l'URL reflète la slide active (#slide/1…) -->
```

</template>
</prose-show-case>

## Lazy loading

Lazy images are handled natively: `loading="lazy"` on the images,
`lazy-preload` to preload neighbors, and the slide `lazy` prop for a built-in
spinner.

<prose-show-case>
<dnax-demo-swiper demo="lazy">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<script setup lang="ts">
const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]
</script>

<template>
  <q-swiper lazy-preload :slides-per-view="3" :space-between="16">
    <q-swiper-slide v-for="(img, i) in images" :key="i" lazy>
      <img class="img" :src="img" loading="lazy" :alt="'Image ' + (i + 1)" />
    </q-swiper-slide>
  </q-swiper>
  <!-- lazy : images chargées à l'approche (spinner intégré) -->
</template>
```

</template>
</prose-show-case>

## Virtual slides

`virtual` renders thousands of slides on demand — set `virtual-index` on each
slide.

<prose-show-case>
<dnax-demo-swiper demo="virtual">



</dnax-demo-swiper>

<template v-slot:code="">

```vue
<q-swiper virtual :slides-per-view="3" :space-between="16">
  <q-swiper-slide v-for="(_, i) in 1000" :key="i" :virtual-index="i">
    <div class="slide slide--sm">Slide {{ i + 1 }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- virtual : 1000 slides rendus à la volée. -->
```

</template>
</prose-show-case>

## QSwiper — the carousel

QSwiper forwards every carousel parameter and event — breakpoints, thumbs,
controller, keyboard, scrollbar, zoom, grid, parallax… all as props and events
on the component.

<dnax-api name="QSwiper">



</dnax-api>

## QSwiperSlide — one slide

<dnax-api name="QSwiperSlide">



</dnax-api>
