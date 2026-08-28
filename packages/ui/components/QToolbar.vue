<script setup lang="ts">
// QToolbar — API Quasar : <q-toolbar inset shrink>
// Barre d'actions avec padding horizontal par défaut (0 12px), min-height 50px.
// Styles : packages/ui/styles/main.css (classe .q-toolbar)
interface Props {
  /** Padding gauche supplémentaire (16px) — cas : toolbar sous un drawer */
  inset?: boolean
  /** Réduit la toolbar à la largeur de son contenu (pas de stretch) */
  shrink?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inset: false,
  shrink: false,
})
</script>

<template>
  <div
    class="q-toolbar"
    :class="{
      'q-toolbar--inset': props.inset,
      'q-toolbar--shrink': props.shrink,
    }"
  >
    <slot />
  </div>
</template>
