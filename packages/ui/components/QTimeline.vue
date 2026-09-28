<script lang="ts">
// QTimeline — conteneur d'une frise chronologique verticale (API Quasar).
//   <q-timeline color="primary" layout="comfortable">
//     <q-timeline-entry heading title="2024" />
//     <q-timeline-entry title="Shipped" icon="lucide:check" />
//   </q-timeline>
//
// Le conteneur dessine le rail (ligne de 1px) et transmet la couleur et
// l'espacement aux entrées, à la fois par `provide`/`inject` (ci-dessous) et par
// des variables CSS héritées (`--q-timeline-color`, `--q-timeline-gap`…).
import type { ComputedRef, InjectionKey } from "vue"

/** Espacement vertical de la frise */
export type TimelineLayout = "dense" | "comfortable" | "loose"

/** Contexte hérité par les entrées (voir `qTimelineKey`). */
export interface TimelineContext {
  /** Couleur du rail et des pastilles (token ou hex) */
  color: string
  /** Espacement vertical des entrées */
  layout: TimelineLayout
}

/** Clé locale d'injection : couleur + layout du conteneur vers les entrées. */
export const qTimelineKey: InjectionKey<ComputedRef<TimelineContext>> = Symbol("q-timeline")
</script>

<script setup lang="ts">
import { computed, provide } from "vue"
import { cn } from "../lib/utils"
import { colorValue, foregroundFor } from "../lib/colors"

interface Props {
  /** Couleur du rail et des pastilles par défaut (token ou hex) */
  color?: string
  /** Thème sombre */
  dark?: boolean
  /** Élément rendu (`ul` par défaut) */
  tag?: string
  /** Espacement vertical : dense | comfortable (défaut) | loose */
  layout?: TimelineLayout
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  dark: false,
  tag: "ul",
  layout: "comfortable",
})

const timelineClasses = computed(() =>
  cn("q-timeline", `q-timeline--${props.layout}`, props.dark && "q-timeline--dark"),
)

// Variables CSS posées sur la racine : le rail les lit, les entrées les héritent.
const timelineStyle = computed<Record<string, string>>(() => ({
  "--q-timeline-color": colorValue(props.color),
  "--q-timeline-color-foreground": foregroundFor(props.color),
  ...(props.dark
    ? {
        "--q-timeline-fg": "#e6edf3",
        "--q-timeline-muted": "rgb(255 255 255 / 0.6)",
        "--q-timeline-surface": "#0f1115",
      }
    : {}),
}))

provide(qTimelineKey, computed<TimelineContext>(() => ({ color: props.color, layout: props.layout })))
</script>

<template>
  <component
    :is="tag"
    class="q-timeline"
    :class="timelineClasses"
    :style="timelineStyle"
    role="list"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<style scoped>
.q-timeline {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--q-timeline-fg, var(--foreground, #1d1d1d));
}

/* Rail vertical : une ligne de 1px centrée qui traverse toute la frise.
   La couleur est héritée du conteneur, surchargeable par entrée. */
.q-timeline::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background-color: var(--q-timeline-color, var(--primary));
}

/* Thème sombre forcé par la prop `dark` (les variables sont posées inline). */
.q-timeline--dark {
  color: var(--q-timeline-fg, #e6edf3);
}
</style>
