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
  /** Respiration douce du titre/sous-titre : mots qui s'estompent en boucle */
  breathing?: boolean
  /** Apparition « générée » : mots révélés en séquence (blur + fondu) */
  generate?: boolean
  /** Sous-chaîne du titre à surligner (marqueur qui se dessine) */
  highlight?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom",
  absolute: false,
  fit: false,
  gradient: true,
  title: "",
  subtitle: "",
  breathing: false,
  generate: false,
  highlight: "",
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

/** Mots d'une chaîne + délai de respiration (cascade) */
const words = (s: string) => s.split(" ").filter(Boolean)
const wordDelay = (i: number) => ({ animationDelay: `${i * 0.12}s` })

/** Parties du titre autour du mot surligné : [avant, mot, après] ou null */
const hlParts = computed<[string, string, string] | null>(() => {
  if (!props.highlight || !props.title) return null
  const idx = props.title.indexOf(props.highlight)
  if (idx === -1) return null
  return [
    props.title.slice(0, idx),
    props.highlight,
    props.title.slice(idx + props.highlight.length),
  ]
})
</script>

<template>
  <div :class="classes">
    <slot>
      <span v-if="title" class="q-text-caption__title">
        <template v-if="hlParts">
          <template v-for="(part, i) in hlParts" :key="i">
            <span v-if="i === 1" class="q-text-caption__highlight">{{ part }}</span>
            <template v-else>{{ part }}</template>
          </template>
        </template>
        <template v-else-if="generate">
          <span
            v-for="(w, i) in words(title)"
            :key="i"
            class="q-text-caption__gen-word"
            :style="{ animationDelay: `${i * 0.08}s` }"
          >{{ w }}</span>
        </template>
        <template v-else-if="breathing">
          <span
            v-for="(w, i) in words(title)"
            :key="i"
            class="q-text-caption__word"
            :style="wordDelay(i)"
          >{{ w }}</span>
        </template>
        <template v-else>{{ title }}</template>
      </span>

      <template v-if="generate && subtitle">
        <span class="q-text-caption__subtitle">
          <span
            v-for="(w, i) in words(subtitle)"
            :key="i"
            class="q-text-caption__gen-word"
            :style="{ animationDelay: `${i * 0.08}s` }"
          >{{ w }}</span>
        </span>
      </template>
      <template v-else-if="breathing && subtitle">
        <span class="q-text-caption__subtitle q-text-caption__breathe">
          <span
            v-for="(w, i) in words(subtitle)"
            :key="i"
            class="q-text-caption__word"
            :style="wordDelay(i)"
          >{{ w }}</span>
        </span>
      </template>
      <span v-else-if="subtitle" class="q-text-caption__subtitle">{{ subtitle }}</span>
    </slot>
  </div>
</template>
