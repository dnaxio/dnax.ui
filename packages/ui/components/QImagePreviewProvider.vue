<script setup lang="ts">
// QImagePreviewProvider — rend la pile de visionneuses programmatiques ($q.imagePreview).
// Intégré dans QConfigProvider (rendu automatiquement par le plus externe),
// mais utilisable aussi en autonome : <q-image-preview-provider><slot /></q-image-preview-provider>.
// Chaque entrée de la pile est rendue dans un <q-image-preview> ; quand la
// visionneuse se ferme, l'entrée est retirée de la pile (onDismiss appelé).
import { imagePreviewStack, closeImagePreview } from "../lib/q"
import type { ImagePreviewController } from "../lib/q"

const stack = imagePreviewStack

const handleDismiss = (ctrl: ImagePreviewController) => {
  ctrl._opts.onDismiss?.()
  closeImagePreview(ctrl)
}
</script>

<template>
  <slot />
  <q-image-preview
    v-for="(entry, idx) in stack"
    :key="idx"
    :model-value="true"
    :images="entry._opts.images"
    :index="entry._opts.index ?? 0"
    :transition="entry._opts.transition ?? 'fade'"
    :close-btn="entry._opts.closeBtn"
    :counter="entry._opts.counter"
    :close-on-backdrop="entry._opts.closeOnBackdrop"
    :close-on-swipe-down="entry._opts.closeOnSwipeDown"
    :nav="entry._opts.nav"
    @update:model-value="(v: boolean) => !v && handleDismiss(entry)"
    @update:index="(i: number) => (entry._opts.index = i)"
  />
</template>
