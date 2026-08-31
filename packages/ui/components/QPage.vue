<script setup lang="ts">
// QPage — zone de contenu. Prop `virtual` : active le virtual scroll
// (rendu fenêtré via QVirtualScroll) quand on a beaucoup d'items.
// Padding-top/padding-bottom automatiques quand des barres fixed
// (q-header / q-back-header avant, q-footer après) entourent la page : le
// contenu reste visible, jamais masqué par les barres au scroll.
import { onBeforeUnmount, onMounted, ref } from "vue"
import { useFixedBarOffset } from "../lib/fixedLayout"
import QVirtualScroll from "./QVirtualScroll.vue"

interface Props {
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

defineProps<Props>()

const rootEl = ref<HTMLElement | null>(null)
// ref fonctionnel : sur un élément → l'élément ; sur q-virtual-scroll (composant) → .$el
const setRoot = (el: unknown) => {
  const node = el as (HTMLElement & { $el?: HTMLElement }) | null
  rootEl.value = node?.$el ?? node ?? null
}

// Offset automatique : padding-top = hauteur des barres fixed précédentes
useFixedBarOffset(rootEl, "page")
</script>

<template>
  <q-virtual-scroll
    v-if="virtual"
    :ref="setRoot"
    class="q-page"
    :items="items"
    :item-key="itemKey"
    :virtual-scroll-slice-size="virtualScrollSliceSize"
    :virtual-scroll-slice-ratio-before="virtualScrollSliceRatioBefore"
    :virtual-scroll-slice-ratio-after="virtualScrollSliceRatioAfter"
    :virtual-scroll-item-size="virtualScrollItemSize"
    :virtual-scroll-sticky-size-start="virtualScrollStickySizeStart"
    :virtual-scroll-sticky-size-end="virtualScrollStickySizeEnd"
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
  <div v-else :ref="setRoot" class="q-page">
    <slot />
  </div>
</template>
