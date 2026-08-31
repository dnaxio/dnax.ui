<script setup lang="ts">
// QHeader — barre haute. fixed = position: fixed en haut (opt-in).
// Safe-area top/left/right appliquées toujours (styles/main.css).
// Quand plusieurs barres fixed sont empilées (q-back-header + q-header), chaque
// barre se décale sous la précédente automatiquement.
import { computed, ref } from "vue"
import { useFixedBarOffset } from "../lib/fixedLayout"

interface Props {
  /** Fixe la barre en haut de l'écran (sort du flux) */
  fixed?: boolean
  /** Fond translucide (frosted glass) : true = 70%, ou valeur % ("70") */
  translucent?: boolean | number
  /** Glassmorphism marqué : fond très translucide + flou fort + bordure claire */
  glass?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fixed: false,
})

const rootEl = ref<HTMLElement | null>(null)

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
      'q-header--translucent': translucent === true || typeof translucent === 'number',
      'q-header--glass': glass,
    }"
    :style="translucentStyle"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
