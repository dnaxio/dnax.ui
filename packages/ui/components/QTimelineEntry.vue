<script setup lang="ts">
// QTimelineEntry — une entrée de <q-timeline> (API Quasar).
//   <q-timeline-entry heading title="2024" />
//   <q-timeline-entry title="Shipped" subtitle="2 days ago" icon="lucide:check" color="positive" />
//
// `side` place l'entrée à gauche ou à droite du rail. **Sans `side`, l'alternance
// est automatique** : la classe `q-timeline__entry--auto` s'appuie sur
// `:nth-child(odd|even)` de la racine du parent (impair → gauche, pair → droite) —
// un `heading` compte donc dans l'alternance, comme dans Quasar.
import { computed, inject } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import { colorValue, foregroundFor } from "../lib/colors"
import { qTimelineKey, type TimelineLayout } from "./QTimeline.vue"

interface Props {
  /** Entrée « titre de période » : centrée, sans pastille ni côté */
  heading?: boolean
  /** Élément rendu (`li` par défaut) */
  tag?: string
  /** Côté de l'entrée : left | right (défaut : alternance automatique) */
  side?: "left" | "right"
  /** Icône Iconify dans la pastille (ex. "lucide:check") */
  icon?: string
  /** URL d'image dans la pastille (prioritaire sur l'icône) */
  avatar?: string
  /** Titre de l'entrée */
  title?: string
  /** Sous-titre (date, lieu…) */
  subtitle?: string
  /** Couleur de la pastille (token ou hex) — héritée du conteneur sinon */
  color?: string
  /** Thème sombre */
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  heading: false,
  tag: "li",
  icon: "",
  avatar: "",
  title: "",
  subtitle: "",
  color: "",
  dark: false,
})

// Contexte du conteneur, avec repli si l'entrée est utilisée hors <q-timeline>.
const timeline = inject(qTimelineKey, undefined)
const parentColor = computed(() => timeline?.value.color ?? "primary")
const layout = computed<TimelineLayout>(() => timeline?.value.layout ?? "comfortable")

/** Espacement vertical selon le layout hérité du conteneur. */
const LAYOUT_GAP: Record<TimelineLayout, string> = {
  dense: "12px",
  comfortable: "26px",
  loose: "42px",
}

const entryClasses = computed(() =>
  cn(
    "q-timeline__entry",
    // côté explicite, sinon alternance automatique (nth-child) portée par `--auto`
    props.side ? `q-timeline__entry--${props.side}` : "q-timeline__entry--auto",
    props.dark && "q-timeline__entry--dark",
  ),
)

const entryStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = { "--q-timeline-gap": LAYOUT_GAP[layout.value] }

  // Couleur propre à l'entrée → surcharge la couleur héritée du conteneur ;
  // sinon on déduit seulement la couleur de texte de la pastille.
  if (props.color) {
    style["--q-timeline-color"] = colorValue(props.color)
    style["--q-timeline-color-foreground"] = foregroundFor(props.color)
  }
  else {
    style["--q-timeline-color-foreground"] = foregroundFor(parentColor.value)
  }

  if (props.dark) {
    style["--q-timeline-fg"] = "#e6edf3"
    style["--q-timeline-muted"] = "rgb(255 255 255 / 0.6)"
    style["--q-timeline-surface"] = "#0f1115"
  }

  return style
})
</script>

<template>
  <!-- Titre de période : centré, sans pastille -->
  <component
    v-if="heading"
    :is="tag"
    class="q-timeline__heading"
    :style="entryStyle"
    role="listitem"
    v-bind="$attrs"
  >
    <span class="q-timeline__heading-title">
      <slot name="title">
        <slot>{{ title }}</slot>
      </slot>
    </span>
  </component>

  <!-- Entrée standard : pastille posée sur le rail + contenu -->
  <component
    v-else
    :is="tag"
    class="q-timeline__entry"
    :class="entryClasses"
    :style="entryStyle"
    role="listitem"
    v-bind="$attrs"
  >
    <span class="q-timeline__dot">
      <slot name="icon">
        <img v-if="avatar" class="q-timeline__avatar" :src="avatar" alt="" />
        <Icon v-else-if="icon" :icon="icon" class="q-timeline__icon" aria-hidden="true" />
      </slot>
    </span>

    <div class="q-timeline__content">
      <div v-if="$slots.title || title" class="q-timeline__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.subtitle || subtitle" class="q-timeline__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
      <div v-if="$slots.default" class="q-timeline__body">
        <slot />
      </div>
    </div>
  </component>
</template>

<style scoped>
/* ─── Tronc commun : entrée et titre de période ─────────────────────────── */
.q-timeline__entry,
.q-timeline__heading {
  position: relative;
  padding-bottom: var(--q-timeline-gap, 26px);
  list-style: none;
}

/* ─── Entrée standard : une demi-colonne autour du rail centré ──────────── */
.q-timeline__entry {
  box-sizing: border-box;
  width: 50%;
}

/* Côté gauche (impair par défaut) : contenu poussé vers le rail, à droite */
.q-timeline__entry--left,
.q-timeline__entry--auto:nth-child(odd) {
  margin-right: auto;
  padding-right: 30px;
  text-align: right;
}

/* Côté droit (pair par défaut) : contenu poussé vers le rail, à gauche */
.q-timeline__entry--right,
.q-timeline__entry--auto:nth-child(even) {
  margin-left: auto;
  padding-left: 30px;
  text-align: left;
}

/* ─── Pastille posée sur le rail ────────────────────────────────────────── */
.q-timeline__dot {
  position: absolute;
  top: 0;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--q-timeline-color, var(--primary));
  color: var(--q-timeline-color-foreground, var(--primary-foreground, #fff));
  /* anneau qui détache la pastille du rail */
  box-shadow: 0 0 0 3px var(--q-timeline-surface, var(--background, #fff));
}

.q-timeline__entry--left .q-timeline__dot,
.q-timeline__entry--auto:nth-child(odd) .q-timeline__dot {
  right: 0;
  transform: translateX(50%);
}

.q-timeline__entry--right .q-timeline__dot,
.q-timeline__entry--auto:nth-child(even) .q-timeline__dot {
  left: 0;
  transform: translateX(-50%);
}

.q-timeline__icon {
  width: 12px;
  height: 12px;
}

.q-timeline__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ─── Contenu de l'entrée ───────────────────────────────────────────────── */
.q-timeline__content {
  display: inline-block;
  max-width: 100%;
  text-align: left;
}

.q-timeline__title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--q-timeline-fg, var(--foreground, #1d1d1d));
}

.q-timeline__subtitle {
  margin-top: 2px;
  font-size: 12.5px;
  color: var(--q-timeline-muted, var(--muted-foreground, rgb(0 0 0 / 0.55)));
}

.q-timeline__body {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--q-timeline-muted, var(--muted-foreground, rgb(0 0 0 / 0.68)));
}

/* ─── Titre de période : centré, sans pastille ──────────────────────────── */
.q-timeline__heading {
  z-index: 1;
  text-align: center;
}

.q-timeline__heading-title {
  display: inline-block;
  padding: 3px 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--q-timeline-fg, var(--foreground, #1d1d1d));
  background-color: var(--q-timeline-surface, var(--background, #fff));
  border-radius: 999px;
}

/* ─── Thème sombre ──────────────────────────────────────────────────────── */
/* La prop `dark` est traitée par les variables inline (cf. entryStyle).
   Mode sombre ambiant : repli quand les jetons du design system sont absents. */
.dark .q-timeline__title,
.dark .q-timeline__heading-title {
  color: var(--q-timeline-fg, #e6edf3);
}
.dark .q-timeline__subtitle,
.dark .q-timeline__body {
  color: var(--q-timeline-muted, rgb(255 255 255 / 0.6));
}
.dark .q-timeline__heading-title {
  background-color: var(--q-timeline-surface, #0f1115);
}
</style>
