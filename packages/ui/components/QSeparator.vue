<script setup lang="ts">
// QSeparator — API Quasar : <q-separator vertical inset spaced dark>
// Équivalent du Separator shadcn-vue (reka-ui) : div role="separator".
interface Props {
  /** Séparateur vertical (sinon horizontal) */
  vertical?: boolean
  /** Marge intérieure (16px) */
  inset?: boolean
  /** Espacement (8px) autour */
  spaced?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Décoration pure : pas de rôle ARIA (role="none") */
  decorative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  inset: false,
  spaced: false,
  dark: false,
  decorative: false,
})
</script>

<template>
  <div
    class="q-separator"
    :class="{
      'q-separator--horizontal': !props.vertical,
      'q-separator--vertical': props.vertical,
      'q-separator--inset': props.inset,
      'q-separator--spaced': props.spaced,
      'q-separator--dark': props.dark,
    }"
    :role="props.decorative ? 'none' : 'separator'"
    :aria-orientation="props.vertical ? 'vertical' : 'horizontal'"
  />
</template>
