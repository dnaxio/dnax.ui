<script setup lang="ts">
// QBubbleReactions — réactions ancrées au bord de la bulle (équivalent BubbleReactions).
// side : top | bottom (chevauché) ; align : start | end.
import { computed } from "vue"
import { cn } from "../lib/utils"
import { QPrimitive } from "../lib/primitive"

interface Props {
  /** Côté de la bulle où ancrer les réactions */
  side?: "top" | "bottom"
  /** Alignement inline */
  align?: "start" | "end"
  /** Élément/composant rendu */
  as?: string
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  side: "bottom",
  align: "end",
  as: "div",
  asChild: false,
})

const classes = computed(() =>
  cn(
    "q-bubble__reactions",
    props.align === "start" && "q-bubble__reactions--start",
    props.side === "top" && "q-bubble__reactions--top",
    props.class,
  ),
)
</script>

<template>
  <QPrimitive :as="as" :as-child="asChild" :class="classes">
    <slot />
  </QPrimitive>
</template>
