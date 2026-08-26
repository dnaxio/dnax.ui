<script setup lang="ts">
// QCircularProgress — anneau de progression : <q-circular-progress :value="0.7" size="64px" show-value />
// SVG stroke-dasharray ; valeur centrée optionnelle (prop, slot ou #value).
import { computed } from "vue"
import { colorValue } from "../lib/colors"

const SIZE_MAP: Record<string, string> = { xs: "32px", sm: "48px", md: "64px", lg: "96px", xl: "128px" }

interface Props {
  /** Valeur (entre min et max, défaut 0-1) */
  value?: number
  min?: number
  max?: number
  /** Diamètre : xs→xl ou valeur CSS */
  size?: string
  /** Épaisseur de l'anneau (px) */
  thickness?: number
  /** Couleur de l'anneau (token ou hex) */
  color?: string
  /** Couleur de la piste (défaut : gris clair) */
  trackColor?: string
  /** Affiche la valeur centrée */
  showValue?: boolean
  /** Sens inverse */
  reverse?: boolean
  /** Mode indéterminé (rotation) */
  indeterminate?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  min: 0,
  max: 1,
  size: "md",
  thickness: 6,
  color: "primary",
  trackColor: "",
  showValue: false,
  reverse: false,
  indeterminate: false,
  dark: false,
})

const ratio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.min(1, Math.max(0, (props.value - props.min) / span))
})

const diameter = computed(() => SIZE_MAP[props.size] ?? props.size)

// SVG : r = (diamètre - épaisseur) / 2 ; circonférence = 2πr
const r = computed(() => {
  const d = parseFloat(diameter.value) || 64
  return (d - props.thickness) / 2
})

const circumference = computed(() => 2 * Math.PI * r.value)

const dashOffset = computed(() => circumference.value * (1 - ratio.value))

const stroke = computed(() => colorValue(props.color))

const rootStyle = computed<Record<string, string>>(() => ({
  width: diameter.value,
  height: diameter.value,
}))

const valueStyle = computed<Record<string, string>>(() => ({
  color: props.color ? colorValue(props.color) : "",
  fontSize: `calc(${diameter.value} * 0.25)`,
}))

const displayValue = computed(() => Math.round(ratio.value * 100))
</script>

<template>
  <div
    class="q-circular-progress"
    :class="{
      'q-circular-progress--dark': dark,
      'q-circular-progress--indeterminate': indeterminate,
    }"
    :style="rootStyle"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="min"
    :aria-valuemax="max"
  >
    <svg class="q-circular-progress__svg" :width="diameter" :height="diameter" viewBox="0 0 100 100">
      <!-- piste -->
      <circle
        cx="50"
        cy="50"
        :r="50 - props.thickness"
        class="q-circular-progress__track"
        :class="{ 'q-circular-progress__track--dark': dark }"
        fill="none"
        :stroke="trackColor ? colorValue(trackColor) : undefined"
        :stroke-width="thickness"
      />
      <!-- anneau de progression -->
      <circle
        cx="50"
        cy="50"
        :r="50 - props.thickness"
        class="q-circular-progress__bar"
        fill="none"
        :stroke="stroke"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="reverse ? -dashOffset : dashOffset"
        :transform="`rotate(-90 50 50)`"
      />
    </svg>
    <div v-if="showValue && !indeterminate" class="q-circular-progress__value" :style="valueStyle">
      <slot name="value">{{ displayValue }}%</slot>
    </div>
  </div>
</template>
