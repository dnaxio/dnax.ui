<script setup lang="ts">
// QBadge — API Quasar : <q-badge label="3" color="negative" floating multi-line transparent outline>
import { computed } from "vue"
import { cn } from "../lib/utils"
import { colorValue, foregroundFor } from "../lib/colors"

interface Props {
  /** Texte ou nombre */
  label?: string | number
  /** Couleur de fond (token ou hex) */
  color?: string
  /** Couleur du texte (token ou hex) */
  textColor?: string
  /** Positionné en absolu (coin supérieur droit du parent, qui doit être relative) */
  floating?: boolean
  /** Retour à la ligne (bordure carrée) */
  multiLine?: boolean
  /** Légèrement transparent */
  transparent?: boolean
  /** Contour seul */
  outline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  textColor: "",
  floating: false,
  multiLine: false,
  transparent: false,
  outline: false,
})

const badgeStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  style["--q-badge-bg"] = colorValue(props.color)
  style["--q-badge-fg"] = props.textColor ? colorValue(props.textColor) : foregroundFor(props.color)
  return style
})

const badgeClasses = computed(() =>
  cn(
    "q-badge",
    props.floating && "q-badge--floating",
    props.multiLine && "q-badge--multi-line",
    props.transparent && "q-badge--transparent",
    props.outline && "q-badge--outline",
  ),
)
</script>

<template>
  <span class="q-badge" :class="badgeClasses" :style="badgeStyle">
    <slot>{{ label }}</slot>
  </span>
</template>
