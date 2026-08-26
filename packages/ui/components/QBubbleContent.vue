<script setup lang="ts">
// QBubbleContent — contenu de la bulle (équivalent BubbleContent).
// as-child : le conteneur (bouton/lien) reçoit le style de la bulle.
import { computed } from "vue"
import { cn } from "../lib/utils"
import { QPrimitive } from "../lib/primitive"

interface Props {
  /** Élément/composant rendu */
  as?: string
  /** Fusion sur l'enfant du slot */
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  asChild: false,
})

const classes = computed(() => cn("q-bubble__content", props.class))
</script>

<template>
  <QPrimitive :as="as" :as-child="asChild" :class="classes">
    <slot />
  </QPrimitive>
</template>
