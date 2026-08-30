<script setup lang="ts">
// QCard — API Quasar : <q-card elevated bordered dark square rounded="lg">
// Pas d'ombre par défaut ; elevated l'ajoute, flat la retire explicitement.
// Slots : default, media (zone image en haut), actions (zone actions en bas)
import { computed } from "vue"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  /** Ajoute l'ombre portée (défaut : aucune) */
  elevated?: boolean
  /** Retire explicitement l'ombre */
  flat?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Bordure fine */
  bordered?: boolean
  /** Coins droits */
  square?: boolean
  /** Coins arrondis : true = md, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
  /** Glassmorphism : fond translucide + flou d'arrière-plan (backdrop-filter) */
  glass?: boolean
  /** Animation au survol : élévation + ombre renforcée */
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  elevated: false,
  flat: false,
  dark: false,
  bordered: false,
  square: false,
  glass: false,
  hover: false,
})

// radius : prop explicite > composantProps.QCard.radius ; échelle → --q-radius
const effectiveRadius = useRadius("QCard", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))
</script>

<template>
  <div
    class="q-card"
    :class="{
      'q-card--elevated': props.elevated,
      'q-card--flat': props.flat,
      'q-card--dark': props.dark,
      'q-card--bordered': props.bordered,
      'q-card--square': props.square,
      'q-card--glass': props.glass,
      'q-card--hover': props.hover,
    }"
    :style="roundedStyle"
  >
    <slot name="media" />
    <slot />
    <div v-if="$slots.actions" class="q-card__actions-slot">
      <slot name="actions" />
    </div>
  </div>
</template>
