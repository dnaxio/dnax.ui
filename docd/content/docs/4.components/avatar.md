---
title: Avatar
description: A circular image with an automatic fallback to initials, an Iconify
  icon or a custom slot.
navigation:
  icon: lucide:circle-user
seo:
  title: Avatar (QAvatar)
  description: QAvatar — a circular image with automatic fallback to initials, icon or slot.
---

A circular image with an automatic fallback. **`<q-avatar>`** renders a
picture from `src`; if it fails to load (or is missing), it falls
back to **initials** computed from `alt`, an Iconify
`icon`, or a custom slot.

## Sizes

Presets `xs` → `xl`, or any CSS size
(`size="7rem"`). The font scales automatically (40% of the size).

::prose-show-case
<dnax-demo-avatar demo="sizes"></dnax-demo-avatar>

#code

```vue
<script setup lang="ts">
const photo1 = "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef"
  + "?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const photo2 = "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b"
  + "?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
</script>

<template>
  <q-avatar size="xs" :src="photo1" alt="Alex" />
  <q-avatar size="sm" :src="photo1" alt="Alex" />
  <q-avatar size="md" :src="photo1" alt="Alex" />
  <q-avatar size="lg" :src="photo1" alt="Alex" />
  <q-avatar size="xl" :src="photo1" alt="Alex" />
  <q-avatar size="7rem" :src="photo1" alt="Alex" />
</template>
```
::

## Photos

Pass any image URL in `src` — the avatar is perfectly round and
keeps its aspect ratio via `object-fit: cover`.

::prose-show-case
<dnax-demo-avatar demo="photos"></dnax-demo-avatar>

#code

```vue
<script setup lang="ts">
const photo1 = "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef"
  + "?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const photo2 = "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b"
  + "?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
</script>

<template>
  <q-avatar size="xl" :src="photo1" alt="Alex" />
  <q-avatar size="xl" :src="photo2" alt="Sam" />
</template>
```
::

## Colors & initials

Without an image, the background `color` (token or hex) is applied
and the initials from `alt` are shown — the foreground
(`text-color`) is computed automatically for contrast.

::prose-show-case
<dnax-demo-avatar demo="colors"></dnax-demo-avatar>

#code

```vue
<q-avatar color="primary" alt="Jean Dupont" />
<q-avatar color="secondary" alt="Marie Curie" />
<q-avatar color="positive" alt="Paul Martin" />
<q-avatar color="warning" text-color="dark" alt="Sara Lee" />
<q-avatar color="#7c3aed" alt="Ada Lovelace" />
```
::

## Icons

An Iconify `icon` as fallback — useful for roles
(`lucide:user`) or statuses.

::prose-show-case
<dnax-demo-avatar demo="icons"></dnax-demo-avatar>

#code

```vue
<q-avatar icon="lucide:user" color="primary" />
<q-avatar icon="lucide:rocket" color="secondary" />
<q-avatar icon="lucide:zap" color="warning" />
<q-avatar icon="lucide:star" color="positive" />
```
::

## Shapes

Circle by default; `rounded` for slightly rounded corners,
`square` for sharp edges.

::prose-show-case
<dnax-demo-avatar demo="shapes"></dnax-demo-avatar>

#code

```vue
<script setup lang="ts">
const photo1 = "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef"
  + "?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const photo2 = "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b"
  + "?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
</script>

<template>
  <q-avatar :src="photo2" alt="Alex" />       <!-- circle (default) -->
  <q-avatar :src="photo2" alt="Alex" rounded />      <!-- rounded corners -->
  <q-avatar :src="photo2" alt="Alex" square />       <!-- square -->
</template>
```
::

## Fallback

When `src` is missing or fails to load, the avatar shows — in
order — a custom slot, the `icon`, or the initials from
`alt`.

::prose-show-case
<dnax-demo-avatar demo="fallback"></dnax-demo-avatar>

#code

```vue
<q-avatar src="broken.jpg" alt="Jean Dupont" />    <!-- initials from alt -->
<q-avatar src="broken.jpg" icon="lucide:user" color="secondary" /> <!-- icon -->
<q-avatar src="broken.jpg" color="positive">                       <!-- custom slot -->
  <q-icon name="lucide:heart" color="white" size="28px" />
</q-avatar>
```
::

## API

<dnax-api name="QAvatar"></dnax-api>
