<script setup lang="ts">
// QIcon — API Quasar : <q-icon name="…" size="24px" color="primary" left right>
// name : composant icône Lucide (@lucide/vue)
import { computed } from "vue"
import type { Component } from "vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

const SIZE_MAP: Record<string, string> = { sm: "16px", md: "24px", lg: "32px", xl: "48px" }

interface Props {
  /** Icône Lucide */
  name?: Component
  /** Taille : sm|md|lg|xl ou valeur CSS ("1.5rem", "20px") */
  size?: string
  /** Couleur (token ou hex) */
  color?: string
  /** Marge à droite */
  left?: boolean
  /** Marge à gauche */
  right?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "",
  left: false,
  right: false,
})

const iconStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  const size = SIZE_MAP[props.size] ?? props.size
  style.width = size
  style.height = size
  if (props.color) style.color = colorValue(props.color)
  return style
})

const iconClasses = computed(() => cn("q-icon", props.left && "q-icon--left", props.right && "q-icon--right"))
</script>

<template>
  <component
    :is="name"
    v-if="name"
    class="q-icon"
    :class="iconClasses"
    :style="iconStyle"
    aria-hidden="true"
  />
  <slot v-else />
</template>
