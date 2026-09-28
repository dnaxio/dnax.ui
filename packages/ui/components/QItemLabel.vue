<script setup lang="ts">
// QItemLabel — API Quasar : <q-item-label overline caption header :lines="2" color="primary">
// Libellé de texte d'un QItem : variantes overline / caption / header,
// troncature multi-lignes (lines) et couleur (token ou hex).
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

interface Props {
  /** Petites majuscules, lettrage espacé (étiquette au-dessus) */
  overline?: boolean
  /** Texte secondaire (couleur atténuée) */
  caption?: boolean
  /** Titre d'en-tête */
  header?: boolean
  /** Tronque après N lignes (`-webkit-line-clamp`) — 0 = pas de troncature */
  lines?: number
  /** Couleur du texte (token ou hex) */
  color?: string
  /** Élément rendu (div par défaut) */
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  overline: false,
  caption: false,
  header: false,
  lines: 0,
  color: "",
  tag: "div",
})

const labelClasses = cn(
  "q-item__label",
  props.caption && "q-item__label--caption",
  props.overline && "q-item__label--overline",
  props.header && "q-item__label--header",
  props.lines > 0 && "q-item__label--clamp",
)

const labelStyle: Record<string, string> = {
  ...(props.color ? { color: colorValue(props.color) } : {}),
  ...(props.lines > 0 ? { "--q-item-label-lines": String(props.lines) } : {}),
}
</script>

<template>
  <component
    :is="tag"
    class="q-item__label"
    :class="labelClasses"
    :style="labelStyle"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<style scoped>
.q-item__label {
  font-size: 14px;
  line-height: 1.35;
  color: var(--foreground);
}

/* ─── caption : texte secondaire atténué ─── */
.q-item__label--caption {
  font-size: 12.5px;
  color: var(--muted-foreground);
}

/* ─── overline : petites majuscules, lettrage espacé ─── */
.q-item__label--overline {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--muted-foreground);
}

/* ─── header : titre de section ─── */
.q-item__label--header {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--muted-foreground);
}

/* ─── troncature multi-lignes avec … (line-clamp) ─── */
.q-item__label--clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--q-item-label-lines, 1);
  line-clamp: var(--q-item-label-lines, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
</style>
