<script setup lang="ts">
// QTextCaption — légende superposée à une image (QImg) ou tout conteneur positionné.
// <q-text-caption position="bottom" absolute title="…" subtitle="…" />
// Dégradé sombre par défaut ; position bottom|top|left|right ; absolute = ancré au bord.
import { computed } from "vue"
import { cn } from "../lib/utils"

export type QTextCaptionPosition = "bottom" | "top" | "left" | "right"

interface Props {
  /** Bord du conteneur où la légende est ancrée */
  position?: QTextCaptionPosition
  /** Position absolute (sort du flux, ancré au bord du conteneur positionné) */
  absolute?: boolean
  /** Prend toute la largeur du conteneur */
  fit?: boolean
  /** Dégradé sombre derrière le texte (défaut : true) */
  gradient?: boolean
  /** Titre en gras */
  title?: string
  /** Sous-titre */
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom",
  absolute: false,
  fit: false,
  gradient: true,
  title: "",
  subtitle: "",
})

const classes = computed(() =>
  cn(
    "q-text-caption",
    `q-text-caption--${props.position}`,
    props.absolute && "q-text-caption--absolute",
    props.fit && "q-text-caption--fit",
    !props.gradient && "q-text-caption--flat",
  ),
)
</script>

<template>
  <div :class="classes">
    <slot>
      <span v-if="title" class="q-text-caption__title">{{ title }}</span>
      <span v-if="subtitle" class="q-text-caption__subtitle">{{ subtitle }}</span>
    </slot>
  </div>
</template>
