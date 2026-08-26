<script setup lang="ts">
// QVirtualScroll — API Quasar : <q-virtual-scroll :items="rows" item-key="id" virtual-scroll-slice-size="12" />
// Ne rend que la fenêtre visible (+ marges) ; hauteurs réelles mesurées par ResizeObserver
// (slot scoped : { item, index, ref }) — le consommateur bind :ref sur son élément.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

interface Props {
  /** Données à afficher */
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
  items: () => [],
  itemKey: "id",
  virtualScrollSliceSize: 14,
  virtualScrollSliceRatioBefore: 1,
  virtualScrollSliceRatioAfter: 1,
  virtualScrollItemSize: 24,
  virtualScrollStickySizeStart: 0,
  virtualScrollStickySizeEnd: 0,
})

defineSlots<{
  default?: (props: { item: any; index: number; ref: (el: Element | null) => void }) => any
  before?: () => any
  after?: () => any
}>()

const itemSize = () => props.virtualScrollItemSize
const sliceBefore = computed(() => Math.ceil(props.virtualScrollSliceSize * props.virtualScrollSliceRatioBefore))
const sliceAfter = computed(() => Math.ceil(props.virtualScrollSliceSize * props.virtualScrollSliceRatioAfter))

const scrollTop = ref(0)

// — Hauteurs mesurées par index (celles non mesurées → taille estimée) —
const itemSizes = new Map<number, number>()
const observers = new Map<number, ResizeObserver>()
const refFns = new Map<number, (el: Element | null) => void>()

// Préfixe cumulé des offsets (reconstruit quand les tailles changent, pas au scroll)
let prefix: number[] = [0]
let total = 0
let rafPending = false

const rebuildPrefix = () => {
  let acc = 0
  prefix = new Array(props.items.length + 1)
  prefix[0] = 0
  for (let i = 0; i < props.items.length; i++) {
    acc += itemSizes.get(i) ?? itemSize()
    prefix[i + 1] = acc
  }
  total = acc
}

const scheduleRebuild = () => {
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    rafPending = false
    rebuildPrefix()
  })
}

const observeItem = (index: number, el: Element | null) => {
  if (el === null) {
    observers.get(index)?.disconnect()
    observers.delete(index)
    return
  }
  if (observers.has(index)) return
  const ro = new ResizeObserver(() => {
    const h = el.getBoundingClientRect().height
    if (h > 0 && itemSizes.get(index) !== h) {
      itemSizes.set(index, h)
      scheduleRebuild()
    }
  })
  ro.observe(el)
  observers.set(index, ro)
  const h = el.getBoundingClientRect().height
  if (h > 0) {
    itemSizes.set(index, h)
    scheduleRebuild()
  }
}

/** Fonction de ref stable par index (évite de re-créer la closure à chaque rendu) */
const itemRef = (index: number) => {
  let fn = refFns.get(index)
  if (!fn) {
    fn = (el) => observeItem(index, el)
    refFns.set(index, fn)
  }
  return fn
}

const clearObservers = () => {
  for (const ro of observers.values()) ro.disconnect()
  observers.clear()
  refFns.clear()
}

// — Fenêtrage —
const findFirst = (pos: number): number => {
  let lo = 0
  let hi = prefix.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (prefix[mid]! <= pos) lo = mid
    else hi = mid - 1
  }
  return lo
}

const start = computed(() => {
  if (props.items.length === 0) return 0
  return Math.max(0, findFirst(scrollTop.value) - sliceBefore.value)
})

const end = computed(() =>
  Math.min(props.items.length, start.value + props.virtualScrollSliceSize + sliceAfter.value),
)

const renderedItems = computed(() => props.items.slice(start.value, end.value))

const offsetOf = (index: number) => prefix[index] ?? 0

const sliceY = computed(() => props.virtualScrollStickySizeStart + offsetOf(start.value))
const spacerH = computed(
  () => props.virtualScrollStickySizeStart + total + props.virtualScrollStickySizeEnd,
)

const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

const getKey = (item: any): string | number | symbol | undefined => {
  if (typeof props.itemKey === "function") return props.itemKey(item) as string | number | symbol
  if (props.itemKey) return (item?.[props.itemKey] ?? undefined) as string | number | symbol | undefined
  return item?.id ?? item?.key
}

watch(
  () => props.items,
  (val, old) => {
    if (val !== old) {
      itemSizes.clear()
      clearObservers()
    }
    rebuildPrefix()
  },
  { immediate: true },
)

watch(() => props.virtualScrollItemSize, rebuildPrefix)

onMounted(() => rebuildPrefix())
onBeforeUnmount(clearObservers)
</script>

<template>
  <div class="q-virtual-scroll" @scroll.passive="onScroll">
    <div class="q-virtual-scroll__content">
      <slot name="before" />
      <div class="q-virtual-scroll__spacer" :style="{ height: `${spacerH}px` }">
        <div class="q-virtual-scroll__slice" :style="{ transform: `translateY(${sliceY}px)` }">
          <template v-for="(item, off) in renderedItems" :key="getKey(item)">
            <slot :item="item" :index="start + off" :ref="itemRef(start + off)" />
          </template>
        </div>
      </div>
      <slot name="after" />
    </div>
  </div>
</template>
