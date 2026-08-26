<script setup lang="ts">
// QText — texte avec troncature multi-lignes : <q-text text="…" :lines="2" />
// lines > 0 → line-clamp (… à la fin), title = texte complet au survol.
import { computed } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Texte (sinon slot par défaut) */
  text?: string | number
  /** Nombre de lignes avant troncature (1, 2, 3…) ; absent = pas de clamp */
  lines?: number
  /** Élément rendu (p par défaut) */
  tag?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: "p",
})

const clampStyle = computed<Record<string, string> | undefined>(() =>
  props.lines ? { "--q-text-lines": String(props.lines) } : undefined,
)
</script>

<template>
  <component
    :is="tag"
    class="q-text"
    :class="cn(lines && 'q-text--clamp', props.class)"
    :style="clampStyle"
    :title="lines && text !== undefined ? String(text) : undefined"
  >
    <slot>{{ text }}</slot>
  </component>
</template>
