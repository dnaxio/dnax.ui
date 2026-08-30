<script setup lang="ts">
// QMarquee — bandeau défilant infini : <q-marquee :text="…" :pause-on-hover="true" />.
// Deux copies du contenu (track animé translateX -50%) pour une boucle parfaite.
// Props : text (ou slot), direction (left|right), duration (s), gap, pause-on-hover.
import { computed } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Texte (sinon slot par défaut, rendu 2× pour la boucle) */
  text?: string
  /** Sens de défilement : "left" (vers la gauche) | "right" */
  direction?: "left" | "right"
  /** Durée d'un cycle complet, en secondes (défaut 20) */
  duration?: number
  /** Espace entre les deux copies (défaut 24px) */
  gap?: string
  /** Met en pause au survol */
  pauseOnHover?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: "",
  direction: "left",
  duration: 20,
  gap: "24px",
  pauseOnHover: false,
})

const marqueeStyle = computed<Record<string, string>>(() => ({
  "--q-marquee-duration": `${props.duration}s`,
  "--q-marquee-gap": props.gap,
}))

const marqueeClasses = computed(() =>
  cn(
    "q-marquee",
    props.direction === "right" && "q-marquee--reverse",
    props.pauseOnHover && "q-marquee--pause-on-hover",
    props.class,
  ),
)
</script>

<template>
  <div class="q-marquee" :class="marqueeClasses" :style="marqueeStyle">
    <div class="q-marquee__track">
      <div class="q-marquee__copy">
        <slot>{{ text }}</slot>
      </div>
      <div class="q-marquee__copy" aria-hidden="true">
        <slot>{{ text }}</slot>
      </div>
    </div>
  </div>
</template>
