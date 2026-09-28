---
title: Image Picker
description: An image selection field with a thumbnail grid, per-tile removal,
  validation (type, size, count), camera capture and the events that make it usable
  in a real form.
navigation:
  icon: lucide:image-plus
seo:
  title: Image Picker (QImagePicker)
  description: QImagePicker — an image selection grid bound to a File or File[] v-model, with validation, capture and add/remove/rejected events.
---

An image selection field. **`<q-image-picker>`** binds a `File` (single) or `File[]`
(`multiple`) through `v-model` and renders the selection as a thumbnail grid, each tile
removable with its × button; an “Add” tile opens a hidden native file input restricted to
images (`accept` defaults to `image/*`).

Validation covers the accepted types (`accept`), the maximum size (`max-file-size`) and the
maximum count (`max-files`). A rejection never enters the model: it shows up as an internal
error message and, precisely, through `@rejected (file, reason)` — `"size"`, `"type"` or
`"count"`.

> **Bind `v-model`.** The field keeps nothing by itself: without a `v-model` (or an
> `@update:model-value` listener) the picked files are dropped and the grid stays empty —
> the component warns in the console in that case.

## Single image (avatar)

The everyday case: one image, replaced by the next pick. The preview and the file details
are yours — the field only hands over the `File`.

::prose-show-case
<dnax-demo-image-picker demo="avatar"></dnax-demo-image-picker>

#code

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue"

const avatar = ref<File | null>(null)
const avatarUrl = ref<string | null>(null)

// Aperçu : URL d'objet créée depuis le File, révoquée à chaque changement
watch(avatar, (file) => {
  if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value)
  avatarUrl.value = file ? URL.createObjectURL(file) : null
})
onBeforeUnmount(() => avatarUrl.value && URL.revokeObjectURL(avatarUrl.value))
</script>

<template>
  <q-image-picker
    v-model="avatar"
    label="Avatar"
    accept="image/png,image/jpeg"
    add-label="Choose an image"
    hint="PNG or JPEG — a single image: a new pick replaces the previous one"
  />

  <q-avatar v-if="avatarUrl" size="72px" rounded><img :src="avatarUrl" /></q-avatar>
  <q-btn v-if="avatar" flat label="Clear" @click="avatar = null" />
</template>
```
::

Clearing is just `avatar = null` — the model is the single source of truth, the grid follows.

## Gallery (multiple)

`multiple` turns the model into an array; `max-files` hides the Add tile once the quota is
reached, and the counter, the thumbnail viewer and the event log are ordinary application
code around the field.

::prose-show-case
<dnax-demo-image-picker demo="gallery"></dnax-demo-image-picker>

#code

```vue
<script setup lang="ts">
import { ref, watch } from "vue"
import { usePlugin } from "@dnax/ui/runtime"

const $q = usePlugin()

const files = ref<File[]>([])
const urls = ref<string[]>([])
const log = ref<string[]>([])

// Une URL d'objet par fichier : sert au compteur, au journal… et à la visionneuse
watch(files, (current) => {
  urls.value.forEach(URL.revokeObjectURL)
  urls.value = current.map((file) => URL.createObjectURL(file))
})

const preview = (index: number) =>
  $q.imagePreview.open({ images: urls.value, index, transition: "up", counter: true })
</script>

<template>
  <q-image-picker
    v-model="files"
    multiple
    :max-files="5"
    :max-file-size="10 * 1024 * 1024"
    label="Listing photos"
    hint="Up to 5 images · 10 MB max each"
    @add="(file) => log.unshift(`+ ${file.name}`)"
    @remove="(file) => log.unshift(`− ${file.name}`)"
    @rejected="(file, reason) => log.unshift(`✕ ${file.name} · ${reason}`)"
  />

  <p>{{ files.length }}/5 selected</p>

  <!-- les vignettes du champ ne sont pas cliquables : la visionneuse se construit à côté -->
  <button v-for="(url, index) in urls" :key="url" @click="preview(index)">
    <img :src="url" width="64" />
  </button>
</template>
```
::

## Validation

Types, size and count are checked **before** the model is touched, so a rejected file can
never reach your upload.

::prose-show-case
<dnax-demo-image-picker demo="validation"></dnax-demo-image-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const attachments = ref<File[]>([])
const refusals = ref<string[]>([])

const onRejected = (file: File, reason: "size" | "type" | "count") => {
  refusals.value.unshift(
    `${file.name} · ${
      reason === "size" ? "too large" : reason === "type" ? "type not accepted" : "too many files"
    }`,
  )
}
</script>

<template>
  <q-image-picker
    v-model="attachments"
    multiple
    accept="image/png,image/jpeg"
    :max-file-size="1024 * 1024"
    :max-files="3"
    label="Attachments"
    hint="PNG or JPEG · 1 MB max · 3 files max"
    @rejected="onRejected"
  />

  <ul>
    <li v-for="refusal in refusals" :key="refusal">{{ refusal }}</li>
  </ul>
</template>
```
::

The internal message (“Fichier trop lourd (max 1 Mo) · Type de fichier non accepté”) can be
replaced with your own wording through `error-message`, or bypassed entirely with `error` +
your `#error` slot.

## Camera (mobile)

`capture` sets the input's `capture` attribute: on a phone the camera opens straight away
instead of the gallery, `"user"` selecting the front lens.

::prose-show-case
<dnax-demo-image-picker demo="camera"></dnax-demo-image-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const facing = ref<"environment" | "user">("environment")
const photo = ref<File | null>(null)
</script>

<template>
  <q-image-picker
    v-model="photo"
    :capture="facing"
    label="Photo"
    add-label="Take a photo"
    hint="On mobile, capture opens the camera; on desktop, the usual file picker."
  />
</template>
```
::

`capture` has no effect on desktop browsers — the file picker opens as usual, which is why
the value is simply passed from a toggle.

## States

`readonly` renders a frozen grid (no Add tile, no × buttons) and `disable` adds the muted
field styling — both driven by a pre-filled model.

::prose-show-case
<dnax-demo-image-picker demo="states"></dnax-demo-image-picker>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

// Le modèle ne contient que des File : on en fabrique ici pour la démo
const saved = ref<File[]>([new File([blob], "bureau.svg", { type: "image/svg+xml" })])
</script>

<template>
  <q-image-picker v-model="saved" multiple readonly label="readonly — already saved" />
  <q-image-picker v-model="saved" multiple disable label="disable — inactive" />
</template>
```
::

## Recipes

**Sending the files.** The model holds `File` objects: post them as `FormData`, or
`PUT` each one to a signed URL.

```ts
const body = new FormData()
for (const file of files.value) body.append("images", file, file.name)
await $fetch("/api/upload", { method: "POST", body })
```

**Existing images on an edit form.** Already-saved images usually come back as URLs, and the
field only deals with `File`s: render the saved ones beside the picker (a `<q-gallery>`, a
`<q-img>`, a badge “unchanged”), and keep the picker for the replacements. The `@remove`
event tells you which saved image the user dropped.

**One object URL, one owner.** The component creates and revokes its own preview URLs (on
removal, on replacement and on unmount). If you build your own (a viewer, a preview), keep
the same rule: one URL per file, revoked when the file leaves the list.

## API

<dnax-api name="QImagePicker"></dnax-api>
