<script setup lang="ts">
// QCardActions — API Quasar : <q-card-actions align="right" vertical>
// À utiliser dans le slot "actions" de QCard (ou n'importe où).
interface Props {
  /** Alignement des actions */
  align?: "left" | "center" | "right" | "between" | "around" | "evenly" | "stretch"
  /** Empile verticalement */
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: "stretch",
  vertical: false,
})
</script>

<template>
  <div
    class="q-card__actions"
    :class="[
      `q-card__actions--${props.align}`,
      props.vertical && 'q-card__actions--vertical',
    ]"
  >
    <slot />
  </div>
</template>
