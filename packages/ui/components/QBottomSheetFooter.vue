<script setup lang="ts">
// QBottomSheetFooter — pied du panneau façon barre d'app (équivalent QFooter) :
// les actions sont embarquées dans un <q-toolbar> (min-height 50px, padding
// 0 12px) et alignées à droite (justify-content: flex-end — styles/main.css).
import QToolbar from "./QToolbar.vue"
</script>

<template>
  <div class="q-bottom-sheet__footer">
    <q-toolbar>
      <slot />
    </q-toolbar>
  </div>
</template>
