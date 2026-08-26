<script setup lang="ts">
// QBtnGroup — API Quasar : <q-btn-group unelevated outline stretch>
// Groupe de QBtn soudés (bords fusionnés, rayons sur les extrémités).
interface Props {
  /** Boutons sans ombre */
  unelevated?: boolean
  /** Contour de groupe */
  outline?: boolean
  /** Les boutons s'étendent également */
  stretch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unelevated: false,
  outline: false,
  stretch: false,
})
</script>

<template>
  <div
    class="q-btn-group"
    :class="{
      'q-btn-group--unelevated': props.unelevated,
      'q-btn-group--outline': props.outline,
      'q-btn-group--stretch': props.stretch,
    }"
  >
    <slot />
  </div>
</template>
