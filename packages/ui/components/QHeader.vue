<script setup lang="ts">
// QHeader — barre haute. fixed = position: fixed en haut (opt-in).
// Safe-area top/left/right appliquées toujours (styles/main.css).
// Quand plusieurs barres fixed sont empilées (q-back-header + q-header), chaque
// barre se décale sous la précédente automatiquement.
import { computed, inject, ref } from "vue"
import { useFixedBarOffset } from "../lib/fixedLayout"
import { qLayoutKey } from "../lib/layout"

interface Props {
  /** Fixe la barre en haut de l'écran (sort du flux) */
  fixed?: boolean
  /** Colle la barre en haut pendant le scroll du document (automatique dans un QLayout avec une lettre majuscule) */
  sticky?: boolean
  /** Fond translucide (frosted glass) : true = 70%, ou valeur % ("70") */
  translucent?: boolean | number
  /** Glassmorphism marqué : fond très translucide + flou fort + bordure claire */
  glass?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fixed: false,
  sticky: false,
})

const rootEl = ref<HTMLElement | null>(null)

// Placement dans un QLayout (facultatif) : cellule « h » du `view`, et sticky imposé
// par la casse de la lettre (H) — la barre reste alors close dans sa cellule.
const layout = inject(qLayoutKey, null)
const zone = computed(() => layout?.zones.value.header)
const isSticky = computed(() => props.sticky || !!zone.value?.fixed)
const layoutStyle = computed<Record<string, string | undefined>>(() => ({
  gridArea: zone.value?.area,
}))

// Empilement : top = hauteur cumulée des barres fixed précédentes (si fixed)
useFixedBarOffset(rootEl, "bar", () => props.fixed)

const translucentStyle = computed<Record<string, string> | undefined>(() =>
  props.translucent === true || typeof props.translucent === "number"
    ? { "--q-translucent-opacity": `${typeof props.translucent === "number" ? props.translucent : 70}%` }
    : undefined,
)
</script>

<template>
  <div
    ref="rootEl"
    class="q-header"
    :class="{
      'q-header--fixed': fixed,
      'q-header--sticky': isSticky,
      'q-header--translucent': translucent === true || typeof translucent === 'number',
      'q-header--glass': glass,
    }"
    :style="[translucentStyle, layoutStyle]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
