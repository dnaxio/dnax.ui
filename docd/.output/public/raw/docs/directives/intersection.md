# v-intersection

> Calls a handler when an element enters or leaves the viewport, with shared observers and a one-shot mode.

`v-intersection` calls a handler when the element **enters or leaves the
viewport** — powered by the `IntersectionObserver` API. Accepted values: a
function, `{ handler, cfg }` (observer options), or `false` to disable; the
`.once` modifier observes only the first appearance. Elements with identical
options **share a single observer** (frugal for long lists).

## Setup

Registered automatically by the `@dnax/ui` module (client mode):

```ts
// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-intersection="onVisibility">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vIntersection } from "@dnax/ui"

app.directive("intersection", vIntersection)
```

## Usage

```html
<!-- handler appelé à chaque changement de visibilité -->
<div v-intersection="onEntry">…</div>

<!-- une seule fois : l'observation s'arrête après la 1ère entrée -->
<div v-intersection.once="onFirstView">…</div>

<!-- configuration (threshold, rootMargin…) — observer partagé par cfg -->
<div v-intersection="{ handler: onEntry, cfg: { threshold: 0.3 } }">…</div>

<!-- désactivé -->
<div v-intersection="false">…</div>
```

```ts
// handler(entry: IntersectionObserverEntry)
const onEntry = ({ isIntersecting, target }) => {
  if (isIntersecting) {
    // visible — ex. lazy load, animation…
  }
}
```

## Live demo

Scroll inside the box: cards light up on entry and dim on exit; the `.once`
sentinel fires only once:

<prose-show-case>
<dnax-demo-intersection-directive demo="basic">



</dnax-demo-intersection-directive>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const visible = ref({})
const mark = (index, isIntersecting) => {
  visible.value[index] = isIntersecting
}
</script>

<template>
  <div class="ix-scroll">
    <div
      v-for="i in 8"
      :key="i"
      class="ix-card"
      :class="{ 'ix-card--on': visible[i] }"
      v-intersection="(e) => mark(i, e.isIntersecting)"
    >
      Card {{ i }} — {{ visible[i] ? 'visible' : 'hidden' }}
    </div>
    <div class="ix-sentinel" v-intersection.once="onOnce">
      Sentinel (.once) fired {{ onceCount }} time(s)
    </div>
  </div>

  <p>{{ Object.values(visible).filter(Boolean).length }} card(s) visible</p>
</template>
```

</template>
</prose-show-case>
