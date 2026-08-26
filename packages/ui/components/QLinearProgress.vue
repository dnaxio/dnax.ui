<script setup lang="ts">
// QLinearProgress — barre de progression linéaire : <q-linear-progress value="0.7" color="secondary" stripe />
import { computed } from "vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

interface Props {
  /** Valeur (entre min et max, défaut 0-1) */
  value?: number
  min?: number
  max?: number
  /** Couleur de la barre (token ou hex) */
  color?: string
  /** Couleur de la piste */
  trackColor?: string
  /** Épaisseur (défaut 4px) */
  size?: string
  rounded?: boolean
  /** Rayures animées */
  stripe?: boolean
  /** Sens inverse (remplit depuis la droite) */
  reverse?: boolean
  /** Mode indéterminé (bande qui traverse) */
  indeterminate?: boolean
  /** Mode recherche (bande qui traverse en sens inverse) */
  query?: boolean
  dark?: boolean
  /** Sans transition sur width */
  instantFeedback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  min: 0,
  max: 1,
  color: "primary",
  trackColor: "",
  size: "4px",
  rounded: false,
  stripe: false,
  reverse: false,
  indeterminate: false,
  query: false,
  dark: false,
  instantFeedback: false,
})

const ratio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.min(1, Math.max(0, (props.value - props.min) / span))
})

const trackStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = { height: props.size }
  if (props.trackColor) style.backgroundColor = colorValue(props.trackColor)
  return style
})

const fillStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = { backgroundColor: colorValue(props.color) }
  if (!props.indeterminate && !props.query) {
    style.width = `${ratio.value * 100}%`
  }
  return style
})

const classes = computed(() =>
  cn(
    "q-linear-progress",
    props.rounded && "q-linear-progress--rounded",
    props.dark && "q-linear-progress--dark",
    props.stripe && "q-linear-progress--stripe",
    props.reverse && "q-linear-progress--reverse",
    props.indeterminate && "q-linear-progress--indeterminate",
    props.query && "q-linear-progress--query",
    props.instantFeedback && "q-linear-progress--instant",
  ),
)
</script>

<template>
  <div
    class="q-linear-progress"
    :class="classes"
    :style="trackStyle"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="min"
    :aria-valuemax="max"
  >
    <div class="q-linear-progress__fill" :style="fillStyle" />
  </div>
</template>
