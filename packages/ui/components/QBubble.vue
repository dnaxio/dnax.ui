<script setup lang="ts">
// QBubble — bulle de conversation type Bubble shadcn-vue :
// variants default | secondary | muted | tinted | outline | ghost | destructive, align start|end.
import { computed } from "vue"
import { cn } from "../lib/utils"
import { QPrimitive } from "../lib/primitive"

interface Props {
  /** Traitement visuel */
  variant?: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"
  /** Alignement dans la conversation */
  align?: "start" | "end"
  /** Élément/composant rendu */
  as?: string
  /** Fusion sur l'enfant du slot (bouton, lien…) */
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  align: "start",
  as: "div",
  asChild: false,
})

const classes = computed(() =>
  cn("q-bubble", `q-bubble--${props.variant}`, `q-bubble--align-${props.align}`, props.class),
)
</script>

<template>
  <QPrimitive :as="as" :as-child="asChild" :class="classes">
    <slot />
  </QPrimitive>
</template>
