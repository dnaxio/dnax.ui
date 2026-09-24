---
title: Intersection
description: Reveals its content when it scrolls into view — transitions,
  re-toggle, events and an `active` slot.
navigation:
  icon: lucide:scan-eye
seo:
  title: Intersection (QIntersection)
  description: QIntersection — scroll-triggered reveal with transitions and events.
---

Reveals its content when it scrolls into view (Quasar-style): **`<q-intersection>`**
wraps a slot and animates it in with a `transition` (fade, scale, slide-*, flip…)
as soon as an IntersectionObserver sees it — `once` (default) fires a single time,
`once="false"` re-hides when it leaves. The default slot exposes `{ active }` so you
can condition what renders inside while the intersection is active. Emits `show` /
`hide` and mirrors the state through a boolean `v-model`.

## Basic

Scroll the box: each block reveals with its own transition when it enters the
viewport (here the scroll container is passed as `root`).

::prose-show-case
:dnax-demo-intersection{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref()
</script>

<template>
  <div ref="box" class="scroll">
    <div class="spacer"></div>
    <q-intersection :root="box" transition="fade">
      <div class="card">Fade reveal</div>
    </q-intersection>
    <div class="spacer"></div>
    <q-intersection :root="box" transition="slide-up">
      <div class="card">Slide up</div>
    </q-intersection>
    <div class="spacer"></div>
    <q-intersection :root="box" transition="scale">
      <div class="card">Scale</div>
    </q-intersection>
  </div>
</template>
```
::

## Transitions

`transition` picks the entrance animation: fade, scale, slide-up/down/left/right,
flip — or any custom name (classes `q-intersection-{name}-enter-active`…).
Animations respect `prefers-reduced-motion`.

::prose-show-case
:dnax-demo-intersection{demo="transitions"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref()
</script>

<template>
  <div ref="box" class="scroll">
    <div class="spacer"></div>
    <q-intersection :root="box" transition="fade">
      <div class="card">fade</div>
    </q-intersection>
    <div class="spacer"></div>
    <q-intersection :root="box" transition="scale">
      <div class="card">scale</div>
    </q-intersection>
    <div class="spacer"></div>
    <q-intersection :root="box" transition="slide-left">
      <div class="card">slide-left</div>
    </q-intersection>
    <div class="spacer"></div>
    <q-intersection :root="box" transition="flip">
      <div class="card">flip</div>
    </q-intersection>
  </div>
</template>
```
::

## Re-toggle (once false)

`once="false"` hides the content again when it scrolls out of view — `show` /
`hide` and the `v-model` track the state live.

::prose-show-case
:dnax-demo-intersection{demo="toggle"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref()
const shows = ref(0)
const hides = ref(0)
const intersected = ref(false)
</script>

<template>
  <div ref="box" class="scroll">
    <div class="spacer"></div>
    <q-intersection
      v-model="intersected"
      :root="box"
      :once="false"
      transition="slide-up"
      @show="shows++"
      @hide="hides++"
    >
      <div class="card">Reveals again when scrolled back into view</div>
    </q-intersection>
    <div class="spacer"></div>
    <div class="spacer"></div>
  </div>
  <p class="demo-p demo-meta">visible = {{ intersected }} · shows = {{ shows }} · hides = {{ hides }}</p>
</template>
```
::

## Chat messages

Scroll the conversation: each bubble reveals as it enters, and
`#default="{ active }"` renders the timestamp only while the bubble is active.

::prose-show-case
:dnax-demo-intersection{demo="chat"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref()
const messages = [
  { who: "me", text: "Hey!", time: "09:12" },
  { who: "other", text: "Scroll reveals!", time: "09:14" },
  { who: "me", text: "And { active } in the slot.", time: "09:15" },
  { who: "other", text: "The timestamps show while a bubble is active.", time: "09:20" },
]
</script>

<template>
  <div ref="box" class="chat">
    <q-intersection
      v-for="(m, i) in messages"
      :key="i"
      :root="box"
      transition="slide-up"
    >
      <template #default="{ active }">
        <div class="msg" :class="'msg--' + m.who">
          <div class="avatar">{{ m.who === 'me' ? '🧑' : '🤖' }}</div>
          <div class="bubble">
            <p class="text">{{ m.text }}</p>
            <span v-if="active" class="time">{{ m.time }}</span>
          </div>
        </div>
      </template>
    </q-intersection>
  </div>
</template>
```
::

## Photo cards

A grid of cards (photo + description) reveals on scroll — the `card--active`
class from the slot zooms the image while the card is intersected.

::prose-show-case
:dnax-demo-intersection{demo="cards"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const box = ref()
const cards = [
  { img: "card-1.jpg", title: "Alpine sunrise", desc: "Golden light over the peaks at dawn." },
  { img: "card-2.jpg", title: "Coastal cliffs", desc: "Wild ocean views, salt in the air." },
  { img: "card-3.jpg", title: "Forest trail", desc: "Morning mist between the pines." },
  { img: "card-4.jpg", title: "Deep woods", desc: "Where the old trees whisper." },
]
</script>

<template>
  <div ref="box" class="cards">
    <q-intersection
      v-for="(c, i) in cards"
      :key="i"
      :root="box"
      transition="slide-up"
    >
      <template #default="{ active }">
        <article class="card" :class="{ 'card--active': active }">
          <img :src="c.img" :alt="c.title" class="card__img" />
          <div class="card__body">
            <h4>{{ c.title }}</h4>
            <p>{{ c.desc }}</p>
          </div>
        </article>
      </template>
    </q-intersection>
  </div>
</template>
```
::

## API

:dnax-api{name="QIntersection"}
