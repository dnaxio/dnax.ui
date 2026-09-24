<script setup lang="ts">
// QPage — zone de contenu. Prop `padding` : padding uniforme du contenu —
// présence (modifier) = 14px, valeur CSS (« 12px ») = cette valeur.
// Prop `virtual` : active le virtual scroll (rendu fenêtré via QVirtualScroll) quand
// on a beaucoup d'items.
// Padding-top/padding-bottom automatiques quand des barres fixed
// (q-header / q-back-header avant, q-footer après) entourent la page : le
// contenu reste visible, jamais masqué par les barres au scroll.
// La composition du padding (utilisateur + offsets des barres + safe-area) vit dans
// `styles/main.css` : ce composant ne pose que `--q-page-padding`, l'offset mesuré est
// publié en variables par `lib/fixedLayout.ts`.
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import type { CSSProperties } from "vue"
import { useFixedBarOffset } from "../lib/fixedLayout"
import { resolvePagePadding } from "../lib/pagePadding"
import QVirtualScroll from "./QVirtualScroll.vue"

interface Props {
  /** Padding uniforme du contenu : modifier (sans valeur) = 14px, valeur CSS = cette valeur */
  padding?: boolean | string | number
  /** Active le virtual scroll (rendu fenêtré des items) */
  virtual?: boolean
  /** Données à afficher (requis si virtual) */
  items?: any[]
  /** Clé d'item : string (propriété) ou fonction */
  itemKey?: string | ((item: any) => unknown)
  /** Nombre d'items rendus autour de la zone visible */
  virtualScrollSliceSize?: number
  /** Ratio d'items rendus avant la zone visible */
  virtualScrollSliceRatioBefore?: number
  /** Ratio d'items rendus après la zone visible */
  virtualScrollSliceRatioAfter?: number
  /** Taille moyenne d'un item en px (estimation initiale) */
  virtualScrollItemSize?: number
  /** Espace réservé en haut (contenu sticky) */
  virtualScrollStickySizeStart?: number
  /** Espace réservé en bas (contenu sticky) */
  virtualScrollStickySizeEnd?: number
}

const props = withDefaults(defineProps<Props>(), {
  padding: false,
})

const rootEl = ref<HTMLElement | null>(null)
// ref fonctionnel : sur un élément → l'élément ; sur q-virtual-scroll (composant) → .$el
const setRoot = (el: unknown) => {
  const node = el as (HTMLElement & { $el?: HTMLElement }) | null
  rootEl.value = node?.$el ?? node ?? null
}

// Offset automatique : padding (haut/bas) = hauteur des barres fixed autour de la page
useFixedBarOffset(rootEl, "page")

// Padding utilisateur → variable CSS lue par `.q-page` (styles/main.css), qui le
// compose avec les offsets et la safe-area. Inline (et non posé à l'impératif) pour
// être rendu dès le SSR.
const rootStyle = computed<CSSProperties | undefined>(() => {
  const padding = resolvePagePadding(props.padding)
  return padding ? ({ "--q-page-padding": padding } as CSSProperties) : undefined
})
</script>

<template>
  <q-virtual-scroll
    v-if="virtual"
    :ref="setRoot"
    class="q-page"
    :style="rootStyle"
    :items="items"
    :item-key="itemKey"
    :virtual-scroll-slice-size="virtualScrollSliceSize"
    :virtual-scroll-slice-ratio-before="virtualScrollSliceRatioBefore"
    :virtual-scroll-slice-ratio-after="virtualScrollSliceRatioAfter"
    :virtual-scroll-item-size="virtualScrollItemSize"
    :virtual-scroll-sticky-size-start="virtualScrollStickySizeStart"
    :virtual-scroll-sticky-size-end="virtualScrollStickySizeEnd"
    v-bind="$attrs"
  >
    <template #default="scope">
      <slot v-bind="scope" />
    </template>
    <template #before>
      <slot name="before" />
    </template>
    <template #after>
      <slot name="after" />
    </template>
  </q-virtual-scroll>
  <div v-else :ref="setRoot" class="q-page" :style="rootStyle" v-bind="$attrs">
    <slot />
  </div>
</template>
