---
title: Tooltip
description: A small label shown on hover or keyboard focus, with sides,
  alignment, an arrow, delays and a controlled mode.
navigation:
  icon: lucide:message-square
seo:
  title: Tooltip (QTooltip)
  description: QTooltip — a label on hover/focus with anchors, sides, arrow and delays.
---

A small label that appears on **hover or keyboard focus** of its parent element.
**`<q-tooltip>`** is placed *as a child* of the target, is positioned automatically
(fixed) and supports sides & alignment, an arrow, **auto-flip** when there is no
room, open/close delays, `disable` and controlled `v-model`.

## Basic

The tooltip lives inside the target element — hover it (or focus it with the
keyboard) to reveal the tip after `delay` ms.

::prose-show-case
:dnax-demo-tooltip{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <q-btn label="Hover me" color="primary">
    <q-tooltip>Hello! I'm a tooltip.</q-tooltip>
  </q-btn>

  <!-- Le tooltip est un ENFANT de l'élément cible -->
  <div class="target">
    Hover this text
    <q-tooltip>…and I appear here</q-tooltip>
  </div>
</template>
```
::

## Anchors & offset

`anchor` takes an edge (`top`, `bottom`, `left`, `right`) plus an alignment
(`middle`, `left`, `right` / `top`, `bottom`) — e.g. `top middle`. `offset` shifts
the tip by `[x, y]` pixels.

::prose-show-case
:dnax-demo-tooltip{demo="anchors"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <q-btn label="Top (default)" color="secondary">
    <q-tooltip>Anchored on top</q-tooltip>
  </q-btn>

  <q-btn label="Bottom" color="secondary">
    <q-tooltip anchor="bottom middle">Anchored on bottom</q-tooltip>
  </q-btn>

  <q-btn label="Left" color="secondary">
    <q-tooltip anchor="left middle">Anchored on the left</q-tooltip>
  </q-btn>

  <q-btn label="Right + offset" color="secondary">
    <q-tooltip anchor="right middle" :offset="[16, 0]">Pushed 16px right</q-tooltip>
  </q-btn>
</template>
```
::

## Side, align & arrow

The modern API: `side` (top / bottom / left / right), `align` (start / center /
end), `side-offset` and `align-offset`. `show-arrow` renders a small arrow pointing
at the target. When there is not enough room on the requested side, the tooltip
**flips** to the opposite side automatically.

::prose-show-case
:dnax-demo-tooltip{demo="side-align"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <q-btn label="Top · start" outline>
    <q-tooltip side="top" align="start" show-arrow>Top start</q-tooltip>
  </q-btn>

  <q-btn label="Bottom · center" outline>
    <q-tooltip side="bottom" align="center" show-arrow>Bottom center</q-tooltip>
  </q-btn>

  <q-btn label="Left · end" outline>
    <q-tooltip side="left" align="end" show-arrow>Left end</q-tooltip>
  </q-btn>

  <q-btn label="Right · center" outline>
    <q-tooltip side="right" align="center" show-arrow>Right center</q-tooltip>
  </q-btn>
  <!-- Pas assez de place sur le côté demandé ? Le tooltip FLIP automatiquement. -->
</template>
```
::

## Delay

`delay` waits before showing the tip (default `300` ms) — useful to avoid tooltips
flashing while the mouse passes over.

::prose-show-case
:dnax-demo-tooltip{demo="delay"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <q-btn label="Hover and wait…" color="primary">
    <q-tooltip :delay="800">I appear after 800 ms (default: 300).</q-tooltip>
  </q-btn>
</template>
```
::

## Disable & v-model

`disable` turns a tooltip off (reactively). With `v-model`, the tooltip becomes
controlled — the parent events still open it, so both hover and the bound value
work together.

::prose-show-case
:dnax-demo-tooltip{demo="disable"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <q-checkbox v-model="enabled" label="Tooltips enabled" />

  <q-btn label="First" outline>
    <q-tooltip :disable="!enabled">Enabled</q-tooltip>
  </q-btn>
  <q-btn label="Second" outline>
    <q-tooltip :disable="!enabled">Also enabled</q-tooltip>
  </q-btn>
</template>
```
::

### Controlled

::prose-show-case
:dnax-demo-tooltip{demo="controlled"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <q-btn label="Toggle the tooltip" color="primary" @click="tipOpen = !tipOpen">
    <q-tooltip v-model="tipOpen">Controlled by v-model (hover also opens it).</q-tooltip>
  </q-btn>
  <p class="demo-p demo-meta">Open: {{ tipOpen }}</p>
</template>
```
::

## Types & icons

`type` applies a semantic background (`positive`/`success`, `negative`/`error`,
`info`, `warning`); `color` overrides it (token or hex) and `text-color` the text.
`icon` renders an Iconify icon (`icon-position` left or right).

::prose-show-case
:dnax-demo-tooltip{demo="types"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <q-btn label="Positive" outline>
    <q-tooltip type="positive" show-arrow>All good!</q-tooltip>
  </q-btn>

  <q-btn label="Info" outline>
    <q-tooltip type="info" show-arrow icon="lucide:info">More details</q-tooltip>
  </q-btn>

  <q-btn label="Warning" outline>
    <q-tooltip type="warning" show-arrow icon="lucide:triangle-alert">Careful!</q-tooltip>
  </q-btn>

  <q-btn label="Error" outline>
    <q-tooltip type="error" show-arrow icon="lucide:circle-x">Something failed</q-tooltip>
  </q-btn>

  <q-btn label="Custom" outline>
    <q-tooltip color="#7c3aed" icon="lucide:sparkles" icon-position="right">Custom color, icon right</q-tooltip>
  </q-btn>
</template>
```
::

## API

:dnax-api{name="QTooltip"}
