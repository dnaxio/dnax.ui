<script setup lang="ts">
// QItem — API Quasar : <q-item clickable active active-class="…" dense disable>
import { cn } from "../lib/utils"

interface Props {
  /** Clic + hover (cursor pointer) */
  clickable?: boolean
  /** Hauteur réduite */
  dense?: boolean
  /** État actif */
  active?: boolean
  /** Classe ajoutée quand actif */
  activeClass?: string
  /** Désactivé */
  disable?: boolean
  tabindex?: string | number
  /** Élément rendu (div par défaut) */
  tag?: string
  /** Indentation (multiples de 8px) */
  insetLevel?: number
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  dense: false,
  active: false,
  activeClass: "",
  disable: false,
  tag: "div",
  insetLevel: 0,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const itemClasses = cn(
  "q-item",
  props.clickable && "q-item--clickable",
  props.dense && "q-item--dense",
  props.active && "q-item--active",
  props.active && props.activeClass,
  props.disable && "q-item--disabled",
)

const itemStyle = props.insetLevel > 0 ? { paddingLeft: `${8 + props.insetLevel * 8}px` } : {}
</script>

<template>
  <component
    :is="tag"
    class="q-item"
    :class="itemClasses"
    :style="itemStyle"
    :tabindex="clickable ? (tabindex ?? 0) : undefined"
    role="listitem"
    :aria-disabled="disable || undefined"
    @click="(e: MouseEvent) => { if (!disable) emit('click', e) }"
  >
    <slot />
  </component>
</template>
