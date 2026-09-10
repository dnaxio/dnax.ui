---
title: Sticky
description: Pins content to the top or bottom of the viewport while scrolling,
  optionally bounded to a container.
navigation:
  icon: lucide:pin
seo:
  title: Sticky (QSticky)
  description: QSticky — pin content to the top or bottom of the viewport, bounded to a container.
---

Pins content to the **top** or **bottom** of the viewport while you scroll:
**`<q-sticky>`** keeps its place in the layout (a same-size placeholder
reserves the space) and switches to `fixed` once it reaches `offset-top` /
`offset-bottom`. Pass a `container` to keep it inside that element — it then
stops at the container's edge instead of following the scroll forever. Emits
`@scroll` (`{ scrollTop, isFixed }`) and `@change` (`isFixed`).

## Basic

Scroll down the page: the bar pins to the top of the viewport and the
`@change` event flips the badge.

::prose-show-case
:dnax-demo-sticky{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const stuck = ref(false)
</script>

<template>
  <q-sticky @change="stuck = $event">
    <div class="bar">Sticky bar <span v-if="stuck">· stuck</span></div>
  </q-sticky>
  <p v-for="i in 24" :key="i" class="line">Line {{ i }} — keep scrolling…</p>
</template>
```
::

## Offset

`:offset-top="16"` leaves a 16 px gap between the pinned bar and the top of the
viewport.

::prose-show-case
:dnax-demo-sticky{demo="offset"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const stuck = ref(false)
</script>

<template>
  <q-sticky :offset-top="16" @change="stuck = $event">
    <div class="bar">Pinned 16px from the top</div>
  </q-sticky>
  <p v-for="i in 24" :key="i" class="line">Line {{ i }} — keep scrolling…</p>
</template>
```
::

## Container bounds

With `:container="box"` the bar is pushed down when it reaches the bottom edge
of the container — it never escapes it.

::prose-show-case
:dnax-demo-sticky{demo="bound"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref<HTMLElement>()
</script>

<template>
  <div ref="box" class="viewport">
    <q-sticky :container="box">
      <div class="bar bar--accent">Stays inside its container</div>
    </q-sticky>
    <p v-for="i in 14" :key="i" class="line">Line {{ i }} — the bar stops at the container's bottom edge…</p>
  </div>
</template>
```
::

## Bottom position

`position="bottom"` pins the action to the bottom of the viewport — the classic
sticky “add to cart” button.

::prose-show-case
:dnax-demo-sticky{demo="bottom"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref<HTMLElement>()
</script>

<template>
  <div ref="box" class="viewport">
    <p v-for="i in 14" :key="i" class="line">Line {{ i }} — the action stays pinned to the bottom…</p>
    <q-sticky position="bottom" :offset-bottom="16" :container="box">
      <q-btn color="primary" unelevated no-caps icon="shopping-cart" label="Add to cart" class="buy" />
    </q-sticky>
  </div>
</template>
```
::

## Events

`@scroll` fires on every scroll with `{ scrollTop, isFixed }`; `@change` fires
once per state switch.

::prose-show-case
:dnax-demo-sticky{demo="events"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref<HTMLElement>()
const ev = ref(0)
const fixed = ref(false)
const changes = ref(0)
</script>

<template>
  <div ref="box" class="viewport">
    <q-sticky
      :container="box"
      @scroll="({ scrollTop, isFixed }) => { ev = scrollTop; fixed = isFixed }"
      @change="changes++"
    >
      <div class="bar bar--outline">
        scrollTop {{ ev }} · fixed {{ fixed }} · changes {{ changes }}
      </div>
    </q-sticky>
    <p v-for="i in 14" :key="i" class="line">Line {{ i }} — watch the counters update as you scroll…</p>
  </div>
</template>
```
::

## API

:dnax-api{name="QSticky"}
