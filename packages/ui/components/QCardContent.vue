<script setup lang="ts">
// QCardContent — bloc de contenu (équivalent QCardSection) : padding + alignement optionnel.
import { computed } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Espacement autour (défaut 20px) */
  padding?: string
  /** Alignement du texte */
  align?: "left" | "center" | "right"
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  align: "left",
})

const classes = computed(() => cn("q-card-content", `q-card-content--align-${props.align}`, props.class))

const style = computed<Record<string, string> | undefined>(() =>
  props.padding ? { padding: props.padding } : undefined,
)
</script>

<template>
  <div class="q-card-content" :class="classes" :style="style">
    <slot />
  </div>
</template>
