<script setup lang="ts">
// QContainer — conteneur centré à largeur max : <q-container max-width="1200px" fluid>
import { computed } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Largeur max du contenu (défaut 1200px) */
  maxWidth?: string | number
  /** Supprime la largeur max (pleine largeur, padding conservé) */
  fluid?: boolean
  /** Padding horizontal (défaut 16px) */
  padding?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: "1200px",
  fluid: false,
  padding: "16px",
})

const containerStyle = computed<Record<string, string>>(() => ({
  "--q-container-max": typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth,
  "--q-container-pad": props.padding,
}))

const containerClasses = computed(() => cn("q-container", props.fluid && "q-container--fluid", props.class))
</script>

<template>
  <div class="q-container" :class="containerClasses" :style="containerStyle">
    <slot />
  </div>
</template>
