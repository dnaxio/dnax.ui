---
title: Swipe Cell
description: A list cell that reveals left/right actions when swiped — events,
  lock-on-open and before-close.
navigation:
  icon: lucide:arrow-left-right
seo:
  title: Swipe Cell (QSwipeCell)
  description: QSwipeCell — a swipeable list cell revealing left/right action panels.
---

A list cell that reveals actions when swiped (Vant-style):
**`<q-swipe-cell>`** drags horizontally to uncover `#left` / `#right` action
panels (`left-width` / `right-width`), snaps open past half the width, and
supports a `before-close` hook, `lock-on-open`, events (`@open`, `@close`,
`@click`) and exposed `open()` / `close()` methods. Built **mobile-first**
(Pointer Events + native vertical scroll via `touch-action: pan-y`) — ready for
**Capacitor** applications.

## Basic (right actions)

Swipe a row to the left to reveal the actions — click one to trigger it and
close the cell.

::prose-show-case
:dnax-demo-swipe-cell{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = [
  { name: "Alice Martin", role: "Product designer", emoji: "🎨" },
  { name: "Bruno Lefèvre", role: "Backend engineer", emoji: "⚙️" },
  { name: "Chloé Dubois", role: "Frontend engineer", emoji: "🧑‍💻" },
  { name: "David Chen", role: "Data analyst", emoji: "📊" },
]
</script>

<template>
  <div class="list">
    <q-swipe-cell v-for="(item, i) in items" :key="i" :right-width="140">
      <div class="cell">
        <div class="avatar">{{ item.emoji }}</div>
        <div class="info"><b>{{ item.name }}</b><span>{{ item.role }}</span></div>
      </div>
      <template #right>
        <button class="action action--fav">★</button>
        <button class="action action--del">🗑</button>
      </template>
    </q-swipe-cell>
  </div>
  <!-- Glissez une cellule vers la gauche pour révéler les actions. -->
</template>
```
::

## Left & right actions

Swipe left or right to reveal each side's actions.

::prose-show-case
:dnax-demo-swipe-cell{demo="both"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = [
  { name: "Alice Martin", role: "Product designer", emoji: "🎨" },
  { name: "Bruno Lefèvre", role: "Backend engineer", emoji: "⚙️" },
  { name: "Chloé Dubois", role: "Frontend engineer", emoji: "🧑‍💻" },
  { name: "David Chen", role: "Data analyst", emoji: "📊" },
]
</script>

<template>
  <div class="list">
    <q-swipe-cell v-for="(item, i) in items" :key="i" :left-width="90" :right-width="90">
      <div class="cell">
        <div class="avatar">{{ item.emoji }}</div>
        <div class="info"><b>{{ item.name }}</b><span>{{ item.role }}</span></div>
      </div>
      <template #left>
        <button class="action action--read">Read</button>
      </template>
      <template #right>
        <button class="action action--del">Delete</button>
      </template>
    </q-swipe-cell>
  </div>
  <!-- Glissez vers la droite → action de gauche, vers la gauche → action de droite. -->
</template>
```
::

## Lock on open

`lock-on-open` freezes the drag once the actions are revealed. Each action
button keeps its own handler; close by clicking an action, the cell, or
**anywhere outside** the cell.

::prose-show-case
:dnax-demo-swipe-cell{demo="lock"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = [
  { name: "Alice Martin", role: "Product designer", emoji: "🎨" },
  { name: "Bruno Lefèvre", role: "Backend engineer", emoji: "⚙️" },
  { name: "Chloé Dubois", role: "Frontend engineer", emoji: "🧑‍💻" },
  { name: "David Chen", role: "Data analyst", emoji: "📊" },
]
</script>

<template>
  <div class="list">
    <q-swipe-cell :right-width="140" lock-on-open>
      <div class="cell">
        <div class="avatar">🔐</div>
        <div class="info"><b>Locked cell</b><span>Once open, you cannot swipe it again</span></div>
      </div>
      <template #right>
        <button class="action action--fav" @click="fav()">★ Fav</button>
        <button class="action action--del" @click="remove()">🗑 Delete</button>
      </template>
    </q-swipe-cell>
  </div>
  <!-- lock-on-open : le swipe est bloqué une fois ouvert — cliquez un bouton
       d'action (Fav ou Delete), la cellule, ou n'importe où en dehors pour fermer. -->
</template>
```
::

## Before close

`before-close` can veto the close of an **action** (useful for confirmations) —
clicking the cell itself always closes. Here `before-close` returns `false`, so
“Delete” stays open while tapping the cell closes it.

::prose-show-case
:dnax-demo-swipe-cell{demo="before"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const denied = ref(0)
const beforeClose = () => {
  denied.value++
  return false // refuse toujours la fermeture
}
</script>

<template>
  <div class="list">
    <q-swipe-cell :right-width="110" :before-close="beforeClose">
      <div class="cell">
        <div class="avatar">🔒</div>
        <div class="info"><b>Protected cell</b><span>before-close returns false → stays open</span></div>
      </div>
      <template #right>
        <button class="action action--del">Delete</button>
      </template>
    </q-swipe-cell>
  </div>
  <p class="demo-p demo-meta">close attempts denied: {{ denied }}</p>
</template>
```
::

## Events

`@open`, `@close` and `@click` carry `{ name, position }`.

::prose-show-case
:dnax-demo-swipe-cell{demo="events"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const last = ref("—")
const log = (e: string) => (last.value = e)
</script>

<template>
  <div class="list">
    <q-swipe-cell
      :right-width="120"
      @open="log('open ' + $event.position)"
      @close="log('close ' + $event.position)"
      @click="log('click ' + $event.position)"
    >
      <div class="cell">
        <div class="avatar">📣</div>
        <div class="info"><b>Tracked cell</b><span>open / close / click events</span></div>
      </div>
      <template #right>
        <button class="action action--fav">Archive</button>
      </template>
    </q-swipe-cell>
  </div>
  <p class="demo-p demo-meta">last event: {{ last }}</p>
</template>
```
::

## API

:dnax-api{name="QSwipeCell"}
