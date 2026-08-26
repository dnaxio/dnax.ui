<script setup lang="ts">
// QSplitter — API Quasar : <q-splitter v-model="ratio" horizontal :limits="[20, 80]" unit="%">
// Équivalent du Resizable shadcn-vue : panneaux flex + handle draggable (pointer) + clavier.
import { computed, ref } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Ratio de division : % (0-100) ou px selon unit */
  modelValue?: number
  /** Division horizontale (sinon verticale) */
  horizontal?: boolean
  /** Limites [min, max] du panneau avant, en % (défaut [0, 50]) */
  limits?: [number, number]
  /** Inverse les deux panneaux */
  reverse?: boolean
  /** Unité de modelValue */
  unit?: "%" | "px"
  disable?: boolean
  separatorClass?: string
  separatorStyle?: string
  beforeClass?: string
  beforeStyle?: string
  afterClass?: string
  afterStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 50,
  horizontal: false,
  limits: () => [0, 50],
  reverse: false,
  unit: "%",
  disable: false,
  separatorClass: "",
  separatorStyle: "",
  beforeClass: "",
  beforeStyle: "",
  afterClass: "",
  afterStyle: "",
})

const emit = defineEmits<{ "update:modelValue": [value: number] }>()

const containerRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

// — Drag du handle —
const onPointerDown = (e: PointerEvent) => {
  if (props.disable) return
  dragging.value = true
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragging.value || props.disable) return
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return
  const total = props.horizontal ? rect.height : rect.width
  if (total <= 0) return
  const pos = props.horizontal ? e.clientY - rect.top : e.clientX - rect.left
  const pct = Math.max(props.limits[0], Math.min(props.limits[1], (pos / total) * 100))
  emit("update:modelValue", props.unit === "%" ? pct : (pct / 100) * total)
}

const onPointerUp = () => {
  dragging.value = false
}

// — Clavier sur le handle (ARIA) —
const onKeydown = (e: KeyboardEvent) => {
  if (props.disable) return
  const dir =
    props.horizontal
      ? (e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0)
      : (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0)
  if (dir === 0) return
  e.preventDefault()
  const step = e.shiftKey ? 10 : 1
  const current = props.modelValue ?? 50
  const rect = containerRef.value?.getBoundingClientRect()
  const total = rect ? (props.horizontal ? rect.height : rect.width) : 100
  const currentPct = props.unit === "%" ? current : (current / total) * 100
  const nextPct = Math.max(props.limits[0], Math.min(props.limits[1], currentPct + dir * step))
  emit("update:modelValue", props.unit === "%" ? nextPct : (nextPct / 100) * total)
}

const beforeStyle = computed<Record<string, string>>(() => {
  const v = props.modelValue ?? 50
  return { flex: `0 0 ${v}${props.unit}` }
})

const rootClasses = computed(() =>
  cn(
    "q-splitter",
    props.horizontal && "q-splitter--horizontal",
    props.reverse && "q-splitter--reverse",
    props.disable && "q-splitter--disabled",
  ),
)

const separatorClasses = computed(() =>
  cn(
    "q-splitter__separator",
    dragging.value && "q-splitter__separator--dragging",
    props.separatorClass,
  ),
)
</script>

<template>
  <div ref="containerRef" class="q-splitter" :class="rootClasses">
    <div
      class="q-splitter__before"
      :class="beforeClass"
      :style="[beforeStyle, props.beforeStyle]"
    >
      <slot name="before" />
    </div>

    <div
      class="q-splitter__separator"
      :class="separatorClasses"
      :style="separatorStyle"
      role="separator"
      :aria-orientation="horizontal ? 'horizontal' : 'vertical'"
      :aria-valuenow="Math.round(modelValue ?? 50)"
      :aria-valuemin="limits[0]"
      :aria-valuemax="limits[1]"
      tabindex="0"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
    >
      <slot name="separator">
        <span class="q-splitter__handle" />
      </slot>
    </div>

    <div class="q-splitter__after" :class="afterClass" :style="afterStyle">
      <slot name="after" />
    </div>
  </div>
</template>
