<script lang="ts">
// QBoard — tableau de bord type Power BI : une grille de tuiles en arrière-plan
// (colonnes × rangées) et, À L'INTÉRIEUR, QInteract qui gère le drag & resize
// des widgets. Les items sont exprimés en TUILLES :
//   { id, column, row, spanColumns, spanRows, … }
// QBoard traduit ces tuiles en pixels pour QInteract et reconvertit les
// positions déplacées / redimensionnées en tuiles (v-model:items).
export interface QBoardItem {
  /** Identifiant unique */
  id: string | number
  /** Colonne de départ (0-based) */
  column: number
  /** Rangée de départ (0-based) */
  row: number
  /** Nombre de colonnes occupées */
  spanColumns: number
  /** Nombre de rangées occupées */
  spanRows: number
  /** Données métier libres (title, type de widget, …) */
  [key: string]: any
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import QInteract from "./QInteract.vue"
import type { QInteractItem } from "./QInteract.vue"
import { cn } from "../lib/utils"

interface Props {
  /** Tuiles (v-model:items) : [{ id, column, row, spanColumns, spanRows, … }] */
  items?: QBoardItem[]
  /** Tuile sélectionnée (v-model:selected) */
  selected?: string | number | null
  /** Nombre de colonnes de la grille (défaut 12) */
  columns?: number
  /** Hauteur d'une rangée en px (défaut 64) */
  rowHeight?: number
  /** Nombre de rangées visibles (défaut : calculé depuis les tuiles) */
  rows?: number
  /** Hauteur du conteneur (px ou CSS) — sinon auto depuis rows */
  height?: string | number
  /** Marge intérieure (px) */
  padding?: number
  /** Espacement entre les tuiles (px, défaut 6) */
  gap?: number
  /** Autorise drag & resize (défaut true) */
  interactive?: boolean
  /** Lecture seule : drag & resize désactivés, poignées masquées */
  readonly?: boolean
  /** Drag limité à la poignée haute */
  handle?: boolean
  /** Empêche le chevauchement des tuiles (défaut true) */
  collision?: boolean
  /** Affiche la numérotation des tuiles de fond */
  showLabels?: boolean
  dense?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  selected: null,
  columns: 12,
  rowHeight: 64,
  rows: 0,
  height: undefined,
  padding: 10,
  gap: 6,
  interactive: true,
  readonly: false,
  handle: false,
  collision: true,
  showLabels: false,
  dense: false,
  dark: false,
})

const emit = defineEmits<{
  "update:items": [value: QBoardItem[]]
  "update:selected": [value: string | number | null]
  select: [item: QBoardItem]
  "drag-end": [item: QBoardItem]
  "resize-end": [item: QBoardItem]
}>()

const grid = ref<QBoardItem[]>([])
watch(
  () => props.items,
  (v) => {
    if (v && v !== grid.value) grid.value = v.map((it) => ({ ...it }))
  },
  { immediate: true },
)
const push = (next: QBoardItem[]) => {
  grid.value = next
  emit("update:items", next)
}

const sel = ref<string | number | null>(props.selected)
watch(
  () => props.selected,
  (v) => {
    sel.value = v
  },
)

// ─── Largeur réelle (Responsive : la cellule s'adapte à la largeur) ───
const rootEl = ref<HTMLElement | null>(null)
const widthPx = ref(0)
let ro: ResizeObserver | null = null
onMounted(() => {
  if (rootEl.value) widthPx.value = rootEl.value.clientWidth
  if (typeof ResizeObserver !== "undefined" && rootEl.value) {
    ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      if (w !== widthPx.value) widthPx.value = w
    })
    ro.observe(rootEl.value)
  }
})
onBeforeUnmount(() => ro?.disconnect())

const innerWidth = computed(() => Math.max(1, widthPx.value - props.padding * 2))
const cellW = computed(() => innerWidth.value / Math.max(1, props.columns))

// ─── Hauteur ───
const usedRows = computed(() => {
  if (props.rows > 0) return props.rows
  let max = 1
  for (const it of grid.value) max = Math.max(max, it.row + (it.spanRows || 1))
  return max
})
const heightStyle = computed<Record<string, string>>(() =>
  props.height !== undefined
    ? { height: typeof props.height === "number" ? props.height + "px" : props.height }
    : { height: usedRows.value * props.rowHeight + props.padding * 2 + "px" },
)

// ─── Tuiles → pixels (pour QInteract) ───
const pxItems = ref<QInteractItem[]>([])
const clampCol = (c: number) => Math.max(0, Math.min(props.columns - 1, c))
const buildPx = () => {
  pxItems.value = grid.value.map((it) => {
    const col = Math.min(it.column, props.columns - 1)
    return {
      ...it,
      x: Math.round(col * cellW.value) + props.padding,
      y: Math.round(it.row * props.rowHeight) + props.padding,
      w: Math.round((it.spanColumns || 1) * cellW.value),
      h: Math.round((it.spanRows || 1) * props.rowHeight),
    }
  })
}
watch([grid, cellW, () => props.rowHeight, () => props.padding], buildPx, { immediate: true })
watch(innerWidth, () => nextTickPx())

let pending = false
const nextTickPx = () => {
  if (pending) return
  pending = true
  nextTick(() => {
    pending = false
    buildPx()
  })
}

// ─── QInteract (pixels) → tuiles ───
const toGridItem = (px: QInteractItem): QBoardItem => {
  const cw = cellW.value || 1
  const column = clampCol(Math.round((px.x - props.padding) / cw))
  const spanColumns = Math.max(1, Math.round(px.w / cw))
  const row = Math.max(0, Math.round((px.y - props.padding) / props.rowHeight))
  const spanRows = Math.max(1, Math.round(px.h / props.rowHeight))
  return { ...px, column, row, spanColumns, spanRows } as QBoardItem
}

const onInteractItems = (pxList: QInteractItem[]) => {
  const next = pxList.map(toGridItem)
  // recentre les tuiles si elles débordent de la grille
  for (const it of next) {
    it.column = clampCol(Math.min(it.column, props.columns - (it.spanColumns || 1)))
  }
  push(next)
  buildPx()
}
const onSelect = (px: QInteractItem) => {
  const g = toGridItem(px)
  sel.value = g.id
  emit("update:selected", g.id)
  emit("select", g)
}
const forwardDragEnd = (px: QInteractItem) => {
  emit("drag-end", toGridItem(px))
}
const forwardResizeEnd = (px: QInteractItem) => {
  emit("resize-end", toGridItem(px))
}

const gridToUser = (g: QBoardItem) => g
const userOf = (px: QInteractItem) => toGridItem(px)

const gridStyle = computed<Record<string, string>>(() => ({
  backgroundSize: Math.max(1, cellW.value) + "px " + props.rowHeight + "px",
}))

const rootClasses = computed(() =>
  cn("q-board", props.dark && "q-board--dark", props.dense && "q-board--dense"),
)

// ─── API ───
const addItem = (item: QBoardItem) => {
  push([...grid.value, { ...item }])
  sel.value = item.id
  emit("update:selected", item.id)
}
const removeItem = (id: string | number) => {
  push(grid.value.filter((it) => String(it.id) !== String(id)))
  if (String(sel.value) === String(id)) sel.value = null
}
const clear = () => push([])
const layout = () => grid.value.map((it) => ({ ...it }))

defineExpose({
  addItem,
  removeItem,
  clear,
  layout,
  getItems: () => grid.value.map((it) => ({ ...it })),
  columns: () => props.columns,
  rows: () => usedRows.value,
})
</script>

<template>
  <div ref="rootEl" class="q-board" :class="rootClasses" :style="heightStyle">
    <!-- ═══════ Grille de tuiles en arrière-plan ═══════ -->
    <div class="q-board__grid" :style="gridStyle" aria-hidden="true">
      <template v-if="showLabels">
        <span
          v-for="c in columns"
          :key="'c' + c"
          class="q-board__cell-label q-board__cell-label--col"
          :style="{ left: props.padding + (c - 1) * cellW + 'px', width: cellW + 'px' }"
        >{{ c }}</span>
        <span
          v-for="r in usedRows"
          :key="'r' + r"
          class="q-board__cell-label q-board__cell-label--row"
          :style="{ top: props.padding + (r - 1) * rowHeight + 'px', height: rowHeight + 'px' }"
        >{{ r }}</span>
      </template>
    </div>

    <!-- ═══════ QInteract à l'intérieur (drag & resize) ═══════ -->
    <QInteract
      class="q-board__interact"
      :items="pxItems"
      :selected="sel"
      :interactive="interactive"
      :readonly="readonly"
      :handle="handle"
      :snap="1"
      :collision="collision"
      :padding="props.padding"
      :gap="gap"
      :min-width="cellW"
      :min-height="rowHeight"
      :dense="dense"
      @update:items="onInteractItems"
      @update:selected="(v) => (sel = v)"
      @select="onSelect"
      @drag-end="forwardDragEnd"
      @resize-end="forwardResizeEnd"
    >
      <template #item="{ item }">
        <slot name="item" :item="userOf(item)" />
      </template>
      <template #handle="{ item }">
        <slot name="handle" :item="userOf(item)" />
      </template>
      <slot name="empty" />
    </QInteract>
  </div>
</template>
