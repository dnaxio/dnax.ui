<script setup lang="ts">
// QItemSection — API Quasar : <q-item-section avatar side top no-wrap>
// Sections d'un QItem : principale (flex:1), side (droite), avatar, thumbnail.
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

interface Props {
  /** Zone avatar (largeur fixe, pas de stretch) */
  avatar?: boolean
  /** Zone vignette/image */
  thumbnail?: boolean
  /** Alignée à droite (actions…) */
  side?: boolean
  /** Alignée en haut */
  top?: boolean
  /** Pas de retour à la ligne */
  noWrap?: boolean
  /** Couleur du texte (token ou hex) */
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  avatar: false,
  thumbnail: false,
  side: false,
  top: false,
  noWrap: false,
  color: "",
})

const sectionClasses = cn(
  "q-item__section",
  props.avatar && "q-item__section--avatar",
  props.thumbnail && "q-item__section--thumbnail",
  props.side && "q-item__section--side",
  props.top && "q-item__section--top",
  props.noWrap && "q-item__section--no-wrap",
)

const sectionStyle = props.color ? { color: colorValue(props.color) } : {}
</script>

<template>
  <div class="q-item__section" :class="sectionClasses" :style="sectionStyle">
    <slot />
  </div>
</template>
