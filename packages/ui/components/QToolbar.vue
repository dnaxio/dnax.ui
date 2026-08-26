<script setup lang="ts">
// QToolbar — API Quasar : <q-toolbar inset shrink>
// Styles : packages/ui/styles/main.css (classe .q-toolbar)
interface Props {
  /** Applique une marge horizontale (cas : toolbar sous un QDrawer) */
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
