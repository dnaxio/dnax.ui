<script setup lang="ts">
// QBottomSheetFooter — pied du panneau façon barre d'app (équivalent QFooter) :
// les actions sont embarquées dans un <q-toolbar> (min-height 50px, padding
// 0 12px) et alignées à droite (justify-content: flex-end — styles/main.css).
// no-padding retire le padding horizontal du toolbar.
import QToolbar from "./QToolbar.vue"

interface Props {
  /** Supprime le padding du toolbar (actions collées aux bords) */
  noPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  noPadding: false,
})
</script>

<template>
  <div
    class="q-bottom-sheet__footer"
    :class="{ 'q-bottom-sheet__footer--no-padding': noPadding }"
    v-bind="$attrs"
  >
    <q-toolbar>
      <slot />
    </q-toolbar>
  </div>
</template>
