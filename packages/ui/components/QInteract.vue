<script lang="ts">
// QInteract — conteneur d'éléments positionnables (drag & resize), pour
// construire des dashboards / tableaux de bord type Power BI.
// Chaque élément : { id, x, y, w, h } en pixels, plus toutes les données
// métier que vous voulez (title, type de widget…). v-model:items reçoit les
// nouvelles positions après chaque interaction ; chaque drag / resize émet
// aussi ses événements dédiés.
export interface QInteractItem {
  /** Identifiant unique de l'élément */
  id: string | number
  /** Position gauche (px) */
  x: number
  /** Position haut (px) */
  y: number
  /** Largeur (px) */
  w: number
  /** Hauteur (px) */
  h: number
  /** Données métier libres (title, type, …) */
  [key: string]: any
}

export interface QInteractLayout {
  /** Position en pixels */
  x: number
  y: number
  /** Position exprimée en colonnes / rangées pour un damier de `columns` colonnes */
  column: number
  row: number
  spanColumns: number
  spanRows: number
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"

interface Props {
  /** Éléments (v-model:items) : [{ id, x, y, w, h, … }] */
  items?: QInteractItem[]
  /** Élément sélectionné (v-model:selected) : son id */
  selected?: string | number | null
  /** Hauteur du conteneur (px ou CSS) */
  height?: string | number
  /** Largeur du conteneur (px ou CSS) */
  width?: string | number
  /** Autorise drag & resize (défaut true) */
  interactive?: boolean
  /** Lecture seule : drag & resize désactivés, poignées masquées */
  readonly?: boolean
  /** Uniquement draggable depuis la barre d'en-tête (sinon toute la carte) */
  handle?: boolean
  /** Pas de grille (snap) en px — 0 désactive */
  snap?: number
  /** Marge intérieure minimale (px) */
  padding?: number
  /** Espacement entre les éléments (px) — évite qu'ils soient collés */
  gap?: number
  /** Largeur minimale d'un élément (px) */
  minWidth?: number
  /** Hauteur minimale d'un élément (px) */
  minHeight?: number
  /** Affiche les lignes de la grille */
  showGrid?: boolean
  /** Empêche le chevauchement des éléments (drag/resize bloqués sur une zone occupée) */
  collision?: boolean
  /** Hauteur réduite (curseurs + barre) */
  dense?: boolean
  dark?: boolean
  /** Clic sur un élément le passe au premier plan */
  bringToFront?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  selected: null,
  height: 420,
  width: "100%",
  interactive: true,
  readonly: false,
  handle: false,
  snap: 8,
  padding: 10,
  gap: 0,
  minWidth: 60,
  minHeight: 40,
  showGrid: false,
  collision: false,
  dense: false,
  dark: false,
  bringToFront: true,
})

const emit = defineEmits<{
  "update:items": [value: QInteractItem[]]
  "update:selected": [value: string | number | null]
  select: [item: QInteractItem]
  "drag-start": [item: QInteractItem]
  "drag-move": [item: QInteractItem]
  "drag-end": [item: QInteractItem]
  "resize-start": [item: QInteractItem]
  "resize-move": [item: QInteractItem]
  "resize-end": [item: QInteractItem]
}>()

const local = ref<QInteractItem[]>([])
watch(
  () => props.items,
  (v) => {
    if (v && v !== local.value) local.value = v.map((it) => ({ ...it }))
  },
  { immediate: true },
)
const push = (next: QInteractItem[]) => {
  local.value = next
  emit("update:items", next)
}

const sel = ref<string | number | null>(props.selected)
watch(
  () => props.selected,
  (v) => {
    sel.value = v
  },
)
const select = (item: QInteractItem) => {
  sel.value = item.id
  emit("update:selected", item.id)
  emit("select", item)
}
const byId = (id: string | number) => local.value.find((it) => String(it.id) === String(id))
const indexOf = (id: string | number) => local.value.findIndex((it) => String(it.id) === String(id))

// Met à jour un élément (fusionne, ne remplace pas l'objet pendant le drag)
const patchItem = (id: string | number, patch: Partial<QInteractItem>, live = false) => {
  const i = indexOf(id)
  if (i < 0) return
  const merged = { ...local.value[i], ...patch } as QInteractItem
  const next = [...local.value]
  next[i] = merged
  if (live) {
    local.value = next
  } else {
    push(next)
  }
}

const rootEl = ref<HTMLElement | null>(null)
const sizeStyle = computed<Record<string, string>>(() => ({
  height: typeof props.height === "number" ? props.height + "px" : props.height,
  width: typeof props.width === "number" ? props.width + "px" : props.width,
}))
const gridStyle = computed<Record<string, string>>(() => {
  const s = Math.max(1, props.snap || 1)
  return { backgroundSize: s + "px " + s + "px" }
})

// ─── Drag ───
const drag = ref<{ id: string | number; dx: number; dy: number; sx: number; sy: number; item: QInteractItem } | null>(null)

const isHandle = (el: EventTarget | null): boolean => {
  const node = el as HTMLElement | null
  if (!props.handle) return false
  return !!node?.closest?.(".q-interact__handle")
}

const canInteract = () => props.interactive && !props.readonly
const dragStart = (e: PointerEvent, item: QInteractItem) => {
  if (!canInteract()) return
  if (e.button !== 0) return
  if (props.handle && !isHandle(e.target)) return
  select(item)
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const root = rootEl.value?.getBoundingClientRect()
  if (!root) return
  drag.value = {
    id: item.id,
    sx: item.x,
    sy: item.y,
    dx: e.clientX - rect.left,
    dy: e.clientY - rect.top,
    item,
  }
  emit("drag-start", item)
  window.addEventListener("pointermove", onDragMove)
  window.addEventListener("pointerup", onDragEnd)
}
const onDragMove = (e: PointerEvent) => {
  const d = drag.value
  if (!d || !rootEl.value) return
  const root = rootEl.value.getBoundingClientRect()
  const snap = Math.max(1, props.snap || 1)
  const cur = byId(d.id)
  if (!cur) return
  const maxX = root.width - props.padding - cur.w + (props.gap || 0) / 2
  const maxY = root.height - props.padding - cur.h + (props.gap || 0) / 2
  const nx = Math.round(Math.max(props.padding, Math.min(maxX, e.clientX - root.left - d.dx)) / snap) * snap
  const ny = Math.round(Math.max(props.padding, Math.min(maxY, e.clientY - root.top - d.dy)) / snap) * snap
  // Collision : on ne pose pas l'élément sur une zone occupée
  if (props.collision && collidesWithOthers(d.id, { x: nx, y: ny, w: cur.w, h: cur.h })) {
    if (cur.x !== nx || cur.y !== ny) emit("drag-move", cur)
    return
  }
  patchItem(d.id, { x: nx, y: ny }, true)
  const updated = byId(d.id)
  if (updated) emit("drag-move", updated)
}
const onDragEnd = () => {
  window.removeEventListener("pointermove", onDragMove)
  window.removeEventListener("pointerup", onDragEnd)
  const d = drag.value
  drag.value = null
  if (!d) return
  const cur = byId(d.id)
  if (cur) emit("update:items", local.value.map((it) => ({ ...it })))
  if (cur) emit("drag-end", cur)
}

// ─── Resize (poignée bas-droite) ───
const rs = ref<{ id: string | number; item: QInteractItem } | null>(null)
const resizeStart = (e: PointerEvent, item: QInteractItem) => {
  if (!canInteract()) return
  e.stopPropagation()
  select(item)
  rs.value = { id: item.id, item }
  emit("resize-start", item)
  window.addEventListener("pointermove", onResizeMove)
  window.addEventListener("pointerup", onResizeEnd)
}
const intersectsRect = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
const collidesWithOthers = (id: string | number, rect: { x: number; y: number; w: number; h: number }) =>
  props.collision &&
  local.value.some((it) => String(it.id) !== String(id) && intersectsRect(rect, it))
const onResizeMove = (e: PointerEvent) => {
  const r = rs.value
  if (!r || !rootEl.value) return
  const root = rootEl.value.getBoundingClientRect()
  const base = byId(r.id)
  if (!base) return
  const snap = Math.max(1, props.snap || 1)
  const cur = local.value[indexOf(r.id)]!
  const g = props.gap || 0
  const w = Math.round(Math.min(root.width - props.padding - cur.x + g / 2, Math.max(props.minWidth, e.clientX - root.left - cur.x)) / snap) * snap
  const h = Math.round(Math.min(root.height - props.padding - cur.y + g / 2, Math.max(props.minHeight, e.clientY - root.top - cur.y)) / snap) * snap
  if (collidesWithOthers(r.id, { x: cur.x, y: cur.y, w, h })) {
    if (cur.w !== w || cur.h !== h) emit("resize-move", cur)
    return
  }
  patchItem(r.id, { w, h }, true)
  const updated = byId(r.id)
  if (updated) emit("resize-move", updated)
}
const onResizeEnd = () => {
  window.removeEventListener("pointermove", onResizeMove)
  window.removeEventListener("pointerup", onResizeEnd)
  const r = rs.value
  rs.value = null
  if (!r) return
  const cur = byId(r.id)
  if (cur) emit("update:items", local.value.map((it) => ({ ...it })))
  if (cur) emit("resize-end", cur)
}

// ─── API ───
const itemStyle = (item: QInteractItem) => {
  const g = props.gap || 0
  return {
    left: item.x + g / 2 + "px",
    top: item.y + g / 2 + "px",
    width: Math.max(0, item.w - g) + "px",
    height: Math.max(0, item.h - g) + "px",
  }
}
const isSelected = (item: QInteractItem) => String(sel.value) === String(item.id)

const bringToFront = (item: QInteractItem) => {
  if (!props.bringToFront) return
  const i = indexOf(item.id)
  if (i < 0) return
  const next = [...local.value]
  const it = next.splice(i, 1)[0] as QInteractItem
  next.push(it)
  push(next)
}

const addItem = (item: QInteractItem) => {
  push([...local.value, { ...item }])
  select(item)
}
const removeItem = (id: string | number) => {
  push(local.value.filter((it) => String(it.id) !== String(id)))
  if (String(sel.value) === String(id)) sel.value = null
}
const clear = () => push([])

/** Positions réelles (racine du conteneur) en px */
const realPos = (item: QInteractItem) => {
  const root = rootEl.value?.getBoundingClientRect()
  if (!root) return { x: item.x, y: item.y }
  return { x: root.left + item.x, y: root.top + item.y }
}

/**
 * Exprime chaque élément en tuiles pour un damier de `columns` colonnes :
 * { x, y, column, row, spanColumns, spanRows } — utile pour décrire le layout
 * d'un dashboard à reconstruire sur d'autres écrans (Power BI-like).
 */
const toGrid = (columns = 12): QInteractLayout[] => {
  const root = rootEl.value
  if (!root) return []
  const colW = root.clientWidth / columns
  const rowH = props.snap || 10
  return local.value.map((it) => ({
    x: it.x,
    y: it.y,
    column: Math.round(it.x / colW),
    row: Math.round(it.y / rowH),
    spanColumns: Math.max(1, Math.round(it.w / colW)),
    spanRows: Math.max(1, Math.round(it.h / rowH)),
  }))
}

const rootClasses = computed(() =>
  cn(
    "q-interact",
    props.dense && "q-interact--dense",
    props.dark && "q-interact--dark",
    props.showGrid && "q-interact--grid",
    !props.interactive && "q-interact--static",
    props.readonly && "q-interact--static",
  ),
)

defineExpose({
  select,
  addItem,
  removeItem,
  clear,
  bringToFront,
  getItem: byId,
  getItems: () => local.value.map((it) => ({ ...it })),
  realPos,
  toGrid,
})
</script>

<template>
  <div ref="rootEl" class="q-interact" :class="rootClasses" :style="[sizeStyle, props.showGrid ? gridStyle : undefined]">
    <template v-for="item in local" :key="item.id">
      <div
        class="q-interact__item"
        :class="{
          'q-interact__item--active': isSelected(item),
          'q-interact__item--dragging': drag?.id === item.id,
          'q-interact__item--resizing': rs?.id === item.id,
        }"
        :style="itemStyle(item)"
        @pointerdown="dragStart($event, item)"
        @click="select(item)"
        @dblclick="bringToFront(item)"
      >
        <div v-if="handle" class="q-interact__handle">
          <slot name="handle" :item="item">
            <span class="q-interact__grip"><Icon icon="lucide:grip-vertical" /></span>
          </slot>
        </div>
        <div class="q-interact__content">
          <slot name="item" :item="item" :index="local.indexOf(item)">
            <div class="q-interact__default">
              {{ item.title ?? String(item.id) }}
            </div>
          </slot>
        </div>
        <span
          v-if="interactive && !readonly"
          class="q-interact__resize"
          title="Resize"
          @pointerdown="resizeStart($event, item)"
        />
      </div>
    </template>
    <slot v-if="!local.length" name="empty" />
  </div>
</template>
