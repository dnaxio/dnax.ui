---
title: Rolling Text
description: Slot-machine style counters that roll each digit on a vertical wheel
  from a start number to a target.
navigation:
  icon: lucide:arrow-up-down
seo:
  title: Rolling Text (QRollingText)
  description: QRollingText — slot-machine counters with direction, stop order, custom text and manual control.
---

Slot-machine style counters: **`<q-rolling-text>`** rolls each digit on a vertical
wheel from `start-num` to `target-num` — `direction` up or down, a staggered
`stop-order` cascade, any `height` and `duration`, custom `text-list` wheels, and
exposed `start()` / `reset()` methods for manual control. Styled through the
`--q-rolling-text-*` CSS variables.

## Basic

Rolls from `0` to `123` on mount — hit **Replay** to run the animation again.

::prose-show-case
:dnax-demo-rolling-text{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rt = ref()
</script>

<template>
  <q-rolling-text :start-num="0" :target-num="123" />
  <q-btn flat no-caps icon="replay" label="Replay" @click="rt.reset()" />
</template>
```
::

## Direction

`direction="up"` counts upwards, `down` (default) counts downwards.

::prose-show-case
:dnax-demo-rolling-text{demo="direction"}

#code

```vue
<q-rolling-text :start-num="0" :target-num="432" direction="up" :duration="1.5" />
<q-rolling-text :start-num="0" :target-num="432" :duration="1.5" />
```
::

## Stop order

`stop-order="ltr"` stops the left-most wheel first (cascade from the highest
digit); `rtl` starts from the units.

::prose-show-case
:dnax-demo-rolling-text{demo="stop-order"}

#code

```vue
<q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="ltr" />
<q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="rtl" />
```
::

## Custom text

`text-list` rolls non-numeric content: pass an array of strings with the **same
length** — the wheel runs from the first element to the last.

::prose-show-case
:dnax-demo-rolling-text{demo="text"}

#code

```vue
<script setup lang="ts">
const textList = [
  "aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee", "fffff", "ggggg",
]
</script>

<template>
  <q-rolling-text :text-list="textList" :duration="1" :height="36" />
</template>
```
::

## Custom style

Tune `height`, then restyle through the CSS variables:
`--q-rolling-text-background`, `-color`, `-font-size`, `-gap`, `-item-width` and
`-item-border-radius`.

::prose-show-case
:dnax-demo-rolling-text{demo="style"}

#code

```vue
<q-rolling-text
  class="my-rolling"
  :start-num="12345"
  :target-num="54321"
  :height="54"
  :duration="1.5"
/>
```
::

## Manual control

With `:auto-start="false"` nothing happens until you call the exposed `start()`
method; `reset()` replays the whole animation from `start-num`.

::prose-show-case
:dnax-demo-rolling-text{demo="control"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rt = ref()
</script>

<template>
  <q-rolling-text
    ref="rt"
    :start-num="0"
    :target-num="54321"
    :auto-start="false"
  />
  <q-btn flat no-caps icon="play" label="Start" @click="rt.start()" />
  <q-btn flat no-caps icon="replay" label="Reset" @click="rt.reset()" />
</template>
```
::

## API

:dnax-api{name="QRollingText"}
