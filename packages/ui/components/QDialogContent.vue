<script setup lang="ts">
// QDialogContent — section de corps de la modale (équivalent QCardSection).
// Le panneau <q-dialog> est en flex-column (max-height 90vh) : avec `scrollable`,
// le corps prend l'espace restant et défile en interne, entre un header et un
// footer fixes (essentiel en mode maximized, où le panneau est overflow: hidden).
interface Props {
  /** Rendu scrollable : le corps défile entre header et footer fixes */
  scrollable?: boolean
}

withDefaults(defineProps<Props>(), {
  scrollable: false,
})
</script>

<template>
  <div class="q-dialog__body" :class="{ 'q-dialog__body--scrollable': scrollable }" v-bind="$attrs">
    <slot />
  </div>
</template>
