---
title: v-ripple
description: Adds a material ripple to any element — click point or center, custom
  color, keyboard trigger and an early mode.
navigation:
  icon: lucide:mouse-pointer-click
seo:
  title: v-ripple directive
  description: v-ripple — a material ripple on any element, with position, color, keyboard and early-trigger options.
---

`v-ripple` adds a **material ripple** to any element or component root — the Quasar
`v-ripple` equivalent. By default the wave starts **at the click point** and takes
the element's own text color (`currentColor`); `.center`, `.early`, a color argument
and an options object change that.

## Setup

The `@dnax/ui` Nuxt module registers the directive automatically (a no-op during
SSR — the wave only exists in the browser):

```ts
// @dnax/ui Nuxt module → enregistrée automatiquement :
// <div v-ripple>…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vRipple } from "@dnax/ui"

app.directive("ripple", vRipple)
```

## Usage

```html
<div v-ripple>Click me</div>

<!-- toujours depuis le centre -->
<div v-ripple.center>Click me</div>

<!-- couleur : token dnax.ui (primary, negative…) ou couleur CSS -->
<div v-ripple:primary>Click me</div>
<div v-ripple="{ color: '#8b5cf6' }">Click me</div>

<!-- l'onde démarre dès pointerdown (annulée si le geste devient un scroll) -->
<div v-ripple.early>Press and hold me</div>

<!-- activable / désactivable à la volée -->
<div v-ripple="enabled">Click me</div>
```

## Live demo

### Basic

On a plain surface, on list rows and on a `<q-btn>` — the default color is the
element's text color:

::prose-show-case
:dnax-demo-ripple{demo="basic"}

#code

```vue
<template>
  <div class="rip-surface" v-ripple>Click anywhere on this surface</div>

  <div class="rip-list">
    <div class="rip-row" v-ripple>
      <q-icon name="lucide:folder" />
      <span>Documents</span>
    </div>
    <div class="rip-row" v-ripple>
      <q-icon name="lucide:image" />
      <span>Pictures</span>
    </div>
  </div>

  <q-btn no-caps color="primary" label="v-ripple on a QBtn" v-ripple />
</template>
```
::

### Position & color

The left surface ripples **from the click point**, the right one always **from the
center** (`.center`). Below, the color comes from an argument (`v-ripple:primary`)
or from the options object:

::prose-show-case
:dnax-demo-ripple{demo="position"}

#code

```vue
<template>
  <div class="rip-surface" v-ripple>From the click point</div>
  <div class="rip-surface rip-surface--dark" v-ripple.center>Always centered</div>
</template>
```
::

::prose-show-case
:dnax-demo-ripple{demo="color"}

#code

```vue
<template>
  <div class="rip-surface" v-ripple:primary>v-ripple:primary</div>
  <div class="rip-surface" v-ripple:negative>v-ripple:negative</div>
  <div class="rip-surface" v-ripple="{ color: '#8b5cf6' }">color: '#8b5cf6'</div>
</template>
```
::

### Early trigger & runtime toggle

`.early` paints the wave on `pointerdown` instead of `click` — it feels closer to
native Material on slow taps, and cancels itself if the gesture turns into a
scroll. The second surface is enabled/disabled through the directive value:

::prose-show-case
:dnax-demo-ripple{demo="options"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const enabled = ref(true)
</script>

<template>
  <div class="rip-surface" v-ripple.early>Early — starts on pointerdown</div>
  <div class="rip-surface" v-ripple="enabled">
    Runtime toggle — currently <b>{{ enabled ? "enabled" : "disabled" }}</b>
  </div>
  <q-btn no-caps :label="enabled ? 'Disable the directive' : 'Enable the directive'"
         @click="enabled = !enabled" />
</template>
```
::

## Value

| Value | Effect |
| --- | --- |
| _nothing_ / `true` | Ripple enabled with the default options. |
| `false` | Directive disabled (only an explicit `false` disables it). |
| `{ early, stop, center, color, keyCodes }` | Same options as the modifiers, from an object. |

## Options & modifiers

| Option / modifier | Effect |
| --- | --- |
| `.center` | The wave always starts from the **center** of the element (also via `{ center: true }`). |
| `.early` | Trigger on `pointerdown` / `keydown` instead of `click` / `keyup`; the wave is cancelled if the gesture becomes a scroll/pan or the pointer leaves the element (also via `{ early: true }`). |
| `.stop` | Stops the propagation of the triggering event (also via `{ stop: true }`). |
| `v-ripple:primary` | Color, as an argument (token or CSS color). Same as `{ color: 'primary' }`. |
| `color` | Wave color: a dnax.ui token (`primary`, `negative`, `info`…) resolved to `var(--token)`, or any CSS color (`#8b5cf6`, `rgb()`, `red`). Defaults to the element's text color. |
| `keyCodes` | Key codes that trigger the wave, e.g. `[13, 32]` (Enter, Space). Default `[13, 32]`. |

## How it works

The directive appends a `.q-ripple` container (**`position: absolute`**, `100% ×
100%`, `overflow: hidden`, `border-radius: inherit`) holding the animated
`.q-ripple__inner` disc. The host therefore does **not** need `overflow: hidden` —
the wave is clipped to the host's own shape/radius.

| Detail | Behaviour |
| --- | --- |
| Container | A `position: relative` block is required for the wave layer. If the host computes to `position: static`, the directive sets `position: relative` and **restores the original value on unmount**. |
| Geometry | The disc diameter is the host's diagonal (`hypot(width, height)`); it starts at the click point (or the center) and always expands to cover the whole element. |
| Color | `currentColor` by default, so on a filled `<q-btn>` the wave matches the label color. Tokens are mapped with `colorValue()` → `var(--token)`. |
| Keyboard | <kbd>Enter</kbd> / <kbd>Space</kbd> ripple **from the center**. On natively activatable elements (`button`, `a[href]`, `input[type=button|submit|reset]`) the browser already emits a centered `click`, so no key listener is added — no double wave. |
| Touch | The wave waits ~100 ms before painting, so a flick-scroll across the element does not flash a ripple. |
| Opt-out | An event carrying `qSkipRipple = true` is ignored (same convention as Quasar) — lets a component own its own ripple. |
