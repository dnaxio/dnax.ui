<script setup lang="ts">
// QContainer — conteneur centré à largeur max : <q-container max-width="1200px" fluid>
// background-effect : "grid" (grille de carrés) | "aurora" (halos colorés animés).
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Largeur max du contenu (défaut 1200px) */
  maxWidth?: string | number
  /** Supprime la largeur max (pleine largeur, padding conservé) */
  fluid?: boolean
  /** Padding horizontal (défaut 16px) */
  padding?: string
  /** Effet d'arrière-plan : "grid" | "aurora" | "star" | "falling-stars" | "flickering-grid" | "interactive-grid" | "wave" (vagues qui glissent) */
  backgroundEffect?:
    | "grid"
    | "aurora"
    | "star"
    | "falling-stars"
    | "flickering-grid"
    | "interactive-grid"
    | "wave"
  /** Couleur des lignes de la grille (background-effect="grid") — tout format CSS */
  gridColor?: string
  /** Espacement entre les lignes de la grille (défaut 32px) */
  gridSpacing?: string
  /** Couleur des étoiles (background-effect="star") — tout format CSS */
  starColor?: string
  /** Espacement entre les étoiles (défaut 24px) */
  starSpacing?: string
  /** Taille des points d'étoile (défaut 1px) */
  starDotSize?: string
  /** Couleur du premier halo (background-effect="aurora", défaut cyan) */
  auroraColor?: string
  /** Couleur du second halo (background-effect="aurora", défaut violet) */
  auroraColor2?: string
  /** Couleur de la première vague (background-effect="wave", défaut bleu) */
  waveColor?: string
  /** Couleur de la seconde vague (background-effect="wave", défaut violet) */
  waveColor2?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: "1200px",
  fluid: false,
  padding: "16px",
})

const containerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    "--q-container-max": typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth,
    "--q-container-pad": props.padding,
  }
  if (props.gridColor) style["--q-grid-color"] = props.gridColor
  if (props.gridSpacing) style["--q-grid-spacing"] = props.gridSpacing
  if (props.starColor) style["--q-star-color"] = props.starColor
  if (props.starSpacing) style["--q-star-spacing"] = props.starSpacing
  if (props.starDotSize) style["--q-star-dot-size"] = props.starDotSize
  if (props.auroraColor) style["--q-aurora-color"] = props.auroraColor
  if (props.auroraColor2) style["--q-aurora-color-2"] = props.auroraColor2
  if (props.waveColor) style["--q-wave-color"] = props.waveColor
  if (props.waveColor2) style["--q-wave-color-2"] = props.waveColor2
  return style
})

const containerClasses = computed(() =>
  cn(
    "q-container",
    props.fluid && "q-container--fluid",
    props.backgroundEffect && "q-container--bg",
    props.class,
  ),
)

// — Étoiles filantes : positions + minutage (durées/délais en s) —
interface FallingStar {
  left: string
  delay: number
  duration: number
}

const FALLING_STARS: FallingStar[] = [
  { left: "8%", delay: 0, duration: 9 },
  { left: "22%", delay: 2.5, duration: 11 },
  { left: "35%", delay: 5, duration: 8.5 },
  { left: "48%", delay: 1.5, duration: 10 },
  { left: "58%", delay: 4, duration: 9.5 },
  { left: "70%", delay: 6.5, duration: 8 },
  { left: "82%", delay: 3, duration: 10.5 },
  { left: "92%", delay: 7, duration: 9 },
  { left: "15%", delay: 8, duration: 11.5 },
  { left: "63%", delay: 9, duration: 8.5 },
]

const starStyle = (s: FallingStar): Record<string, string> => ({
  left: s.left,
  "--q-star-delay": `${s.delay}s`,
  "--q-star-duration": `${s.duration}s`,
})

// — Grille qui grésille : cellules qui clignotent à des positions variées —
interface FlickerCell {
  left: string
  top: string
  delay: number
  duration: number
}

const FLICKER_CELLS: FlickerCell[] = [
  { left: "6%", top: "18%", delay: 0, duration: 2.4 },
  { left: "14%", top: "62%", delay: 0.8, duration: 1.9 },
  { left: "23%", top: "34%", delay: 1.6, duration: 2.8 },
  { left: "31%", top: "78%", delay: 0.3, duration: 2.1 },
  { left: "42%", top: "12%", delay: 2.2, duration: 1.7 },
  { left: "50%", top: "48%", delay: 1.1, duration: 2.6 },
  { left: "58%", top: "84%", delay: 0.5, duration: 2 },
  { left: "66%", top: "28%", delay: 2.7, duration: 1.8 },
  { left: "75%", top: "58%", delay: 1.4, duration: 2.3 },
  { left: "83%", top: "20%", delay: 0.9, duration: 2.5 },
  { left: "90%", top: "70%", delay: 2, duration: 1.9 },
  { left: "36%", top: "92%", delay: 1.8, duration: 2.2 },
]

const flickerStyle = (c: FlickerCell): Record<string, string> => ({
  left: c.left,
  top: c.top,
  "--q-flicker-delay": `${c.delay}s`,
  "--q-flicker-duration": `${c.duration}s`,
})

// — Grille interactive : le glow suit la souris (vars --q-mouse-x/y sur le root) —
const rootEl = ref<HTMLElement | null>(null)

const onMouseMove = (e: MouseEvent) => {
  if (props.backgroundEffect !== "interactive-grid" || !rootEl.value) return
  const rect = rootEl.value.getBoundingClientRect()
  rootEl.value.style.setProperty("--q-mouse-x", `${e.clientX - rect.left}px`)
  rootEl.value.style.setProperty("--q-mouse-y", `${e.clientY - rect.top}px`)
}

onMounted(() => rootEl.value?.addEventListener("mousemove", onMouseMove))
onBeforeUnmount(() => rootEl.value?.removeEventListener("mousemove", onMouseMove))
</script>

<template>
  <div ref="rootEl" class="q-container" :class="containerClasses" :style="containerStyle">
    <div
      v-if="backgroundEffect"
      class="q-container__bg"
      :class="`q-container__bg--${backgroundEffect}`"
      aria-hidden="true"
    >
      <template v-if="backgroundEffect === 'falling-stars'">
        <span
          v-for="(s, i) in FALLING_STARS"
          :key="i"
          class="q-container__star"
          :style="starStyle(s)"
        />
      </template>
      <template v-else-if="backgroundEffect === 'flickering-grid'">
        <span
          v-for="(c, i) in FLICKER_CELLS"
          :key="i"
          class="q-container__flicker"
          :style="flickerStyle(c)"
        />
      </template>
      <span
        v-else-if="backgroundEffect === 'interactive-grid'"
        class="q-container__glow"
      />
      <template v-else-if="backgroundEffect === 'wave'">
        <svg
          class="q-container__wave q-container__wave--1"
          viewBox="0 0 960 128"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,64 C80,100 160,28 240,64 C320,100 400,28 480,64 C560,100 640,28 720,64 C800,100 880,28 960,64"
            fill="var(--q-wave-color)"
          />
        </svg>
        <svg
          class="q-container__wave q-container__wave--2"
          viewBox="0 0 960 128"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,64 C80,100 160,28 240,64 C320,100 400,28 480,64 C560,100 640,28 720,64 C800,100 880,28 960,64"
            fill="var(--q-wave-color-2)"
          />
        </svg>
      </template>
    </div>
    <slot />
  </div>
</template>
