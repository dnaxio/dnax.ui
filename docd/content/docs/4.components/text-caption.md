---
title: Text Caption
description: A caption overlaid on an image — title and subtitle anchored to any
  edge, with gradient and text animations.
navigation:
  icon: lucide:image
seo:
  title: Text Caption (QTextCaption)
  description: QTextCaption — a caption (title + subtitle) overlaid on an image,
    with the Quasar API.
---

A caption overlaid on an image (or any positioned container):
**`<q-text-caption>`** anchors a bold `title` and a `subtitle` to any edge
(`position`), with a dark gradient by default (`gradient`), an `absolute` anchor,
and optional `breathing`, `generate` or `highlight` text animations.

## Basic

`absolute` pins the caption to the bottom of the image over a dark gradient.

::prose-show-case
:dnax-demo-text-caption{demo="basic"}

#code

```vue
<script setup lang="ts">
const IMG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"
</script>

<template>
  <div class="stage">
    <img :src="IMG" class="img" alt="Mountain landscape" />
    <q-text-caption absolute title="Alpine sunrise" subtitle="Golden light over the peaks" />
  </div>
</template>
```
::

## Breathing

`breathing` makes the title and subtitle words fade in a gentle cascade loop —
tune it with `--q-breathe-duration`; respects `prefers-reduced-motion`.

::prose-show-case
:dnax-demo-text-caption{demo="breathing"}

#code

```vue
<script setup lang="ts">
const IMG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"
</script>

<template>
  <div class="stage">
    <img :src="IMG" class="img" alt="Mountain landscape" />
    <q-text-caption absolute breathing title="Alpine sunrise" subtitle="Golden light over the peaks" />
  </div>
</template>
```
::

## Generate

`generate` reveals the title and subtitle word by word (blur + fade + rise) —
Inspira text-generate style.

::prose-show-case
:dnax-demo-text-caption{demo="generate"}

#code

```vue
<script setup lang="ts">
const IMG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"
</script>

<template>
  <div class="stage">
    <img :src="IMG" class="img" alt="Mountain landscape" />
    <q-text-caption absolute generate title="Alpine sunrise" subtitle="Golden light over the peaks" />
  </div>
</template>
```
::

## Highlight

`highlight` draws a marker over a substring of the title (Inspira highlight-text
style) — tune the color with `--q-highlight-color`.

::prose-show-case
:dnax-demo-text-caption{demo="highlight"}

#code

```vue
<script setup lang="ts">
const IMG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"
</script>

<template>
  <div class="stage">
    <img :src="IMG" class="img" alt="Mountain landscape" />
    <q-text-caption absolute highlight="sunrise" title="Alpine sunrise" subtitle="Golden light over the peaks" />
  </div>
</template>
```
::

## Positions

`position` moves the caption to `top`, `left` or `right` (default `bottom`).

::prose-show-case
:dnax-demo-text-caption{demo="positions"}

#code

```vue
<script setup lang="ts">
const IMG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"
</script>

<template>
  <div class="row">
    <div class="stage stage--sm">
      <img :src="IMG" class="img" alt="Position top" />
      <q-text-caption absolute position="top" title="Top" />
    </div>
    <div class="stage stage--sm">
      <img :src="IMG" class="img" alt="Position left" />
      <q-text-caption absolute position="left" title="Left" />
    </div>
  </div>
</template>
```
::

## API

:dnax-api{name="QTextCaption"}
