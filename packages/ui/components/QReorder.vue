<script setup lang="ts">
// QReorder — liste réordonnable par glisser-déposer :
// <q-reorder v-model="items" row-key="id"> <template #item="{ item, index }">…</template> </q-reorder>
// Drag sur toute la ligne (ou seulement la poignée avec `handle`), clavier ↑/↓, pointer events.
import { computed, nextTick, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"

interface Props {
  /** Items (v-model) — l'ordre est mis à jour au drop */
  modelValue?: any[]
  /** Clé stable par item pour les animations (string ou fonction) — défaut : l'index */
  rowKey?: string | ((item: any) => any)
  /** Le drag ne démarre que depuis la poignée (sinon toute la ligne) */
  handle?: boolean
  disable?: boolean
  itemClass?: string
  handleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  handle: false,
  disable: false,
  itemClass: "",
  handleClass: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: any[]]
  /** Émis quand un item change de position : { from, to } */
  reorder: [payload: { from: number; to: number }]
}>()

const list = ref<any[]>([...props.modelValue])
watch(
  () => props.modelValue,
  (v) => {
    if (v && v !== list.value) list.value = [...v]
  },
)

const keyOf = (item: any, index: number) => {
  if (!props.rowKey) return typeof item === "object" && item !== null ? index : item
  return typeof props.rowKey === "function" ? props.rowKey(item) : item?.[props.rowKey]
}

// — Drag (pointer events sur window) —
const containerEl = ref<HTMLElement | null>(null)
const itemEls = ref<(HTMLElement | null)[]>([])
const heights = ref<number[]>([])

const draggingIndex = ref<number | null>(null)
const pointerIndex = ref<number | null>(null)
const startY = ref(0)
const dragDy = ref(0)

let cleanup: (() => void) | null = null

const interactive = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest("button, input, select, textarea, a, [contenteditable]")

const onPointerDown = (i: number, e: PointerEvent) => {
  if (props.disable) return
  if (props.handle && !(e.target as Element).closest(".q-reorder__handle")) return
  if (!props.handle && interactive(e.target)) return
  e.preventDefault()
  heights.value = itemEls.value.map((el) => el?.offsetHeight ?? 0)
  draggingIndex.value = i
  pointerIndex.value = i
  startY.value = e.clientY
  dragDy.value = 0

  const onMove = (ev: PointerEvent) => {
    dragDy.value = ev.clientY - startY.value
    const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null
    const row = el?.closest?.(".q-reorder__item") as HTMLElement | null
    const idx = row ? Number(row.dataset.index) : -1
    if (!Number.isNaN(idx) && idx >= 0) pointerIndex.value = idx
  }
  const onUp = () => {
    commit()
    if (cleanup) cleanup()
  }
  window.addEventListener("pointermove", onMove)
  window.addEventListener("pointerup", onUp)
  window.addEventListener("pointercancel", onUp)
  cleanup = () => {
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
    window.removeEventListener("pointercancel", onUp)
    cleanup = null
  }
}

const commit = () => {
  const from = draggingIndex.value
  const to = pointerIndex.value
  draggingIndex.value = null
  pointerIndex.value = null
  dragDy.value = 0
  if (from === null || to === null || from === to) return
  const next = [...list.value]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  list.value = next
  emit("update:modelValue", next)
  emit("reorder", { from, to })
}

const itemStyle = (i: number): Record<string, string> | undefined => {
  if (draggingIndex.value === null) return undefined
  if (i === draggingIndex.value) {
    return { transform: `translateY(${dragDy.value}px)`, transition: "none" }
  }
  const h = heights.value[draggingIndex.value] ?? 0
  if (pointerIndex.value !== null && pointerIndex.value > draggingIndex.value && i > draggingIndex.value && i <= pointerIndex.value)
    return { transform: `translateY(-${h}px)` }
  if (pointerIndex.value !== null && pointerIndex.value < draggingIndex.value && i >= pointerIndex.value && i < draggingIndex.value)
    return { transform: `translateY(${h}px)` }
  return undefined
}

// — Clavier : ↑ / ↓ déplace l'item —
const move = (from: number, to: number) => {
  if (props.disable) return
  to = Math.max(0, Math.min(list.value.length - 1, to))
  if (to === from) return
  const next = [...list.value]
  const [m] = next.splice(from, 1)
  next.splice(to, 0, m)
  list.value = next
  emit("update:modelValue", next)
  emit("reorder", { from, to })
  nextTick(() => itemEls.value[to]?.focus())
}

const onKeydown = (i: number, e: KeyboardEvent) => {
  if (e.key === "ArrowUp") {
    e.preventDefault()
    move(i, i - 1)
  } else if (e.key === "ArrowDown") {
    e.preventDefault()
    move(i, i + 1)
  }
}

const rootClasses = computed(() =>
  cn("q-reorder", props.disable && "q-reorder--disabled"),
)
</script>

<template>
  <div ref="containerEl" class="q-reorder" :class="rootClasses" role="list">
    <div
      v-for="(item, i) in list"
      :key="keyOf(item, i)"
      :ref="(el) => (itemEls[i] = el as HTMLElement | null)"
      class="q-reorder__item"
      :class="[
        itemClass,
        i === draggingIndex && 'q-reorder__item--dragging',
        !handle && 'q-reorder__item--drag-all',
      ]"
      :data-index="i"
      :style="itemStyle(i)"
      role="listitem"
      :tabindex="disable ? -1 : 0"
      :aria-grabbed="i === draggingIndex || undefined"
      @pointerdown="onPointerDown(i, $event)"
      @keydown="onKeydown(i, $event)"
    >
      <div class="q-reorder__content">
        <slot name="item" :item="item" :index="i" :dragging="i === draggingIndex">
          <span class="q-reorder__label">{{ String(item) }}</span>
        </slot>
      </div>

      <span
        class="q-reorder__handle"
        :class="handleClass"
        aria-hidden="true"
      >
        <slot name="handle" :index="i" :dragging="i === draggingIndex">
          <Icon :icon="icons.gripVertical" class="q-reorder__grip" />
        </slot>
      </span>
    </div>
  </div>
</template>
