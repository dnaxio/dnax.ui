<script setup lang="ts">
// QSlider — curseur : <q-slider v-model="val" :min="0" :max="100" step="5" label markers />
// Drag pointer (track + thumb), clavier (flèches/Home/End), snap au step, bulle de valeur.
import { computed, ref } from "vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

interface Props {
  modelValue?: number
  min?: number
  max?: number
  /** Pas de progression (défaut 1) */
  step?: number
  /** Le curseur saute sur les steps pendant le drag (sinon au relâchement) */
  snap?: boolean
  /** Bulle de valeur pendant le drag */
  label?: boolean
  /** Bulle toujours visible */
  labelAlways?: boolean
  /** Points sur les steps */
  markers?: boolean
  vertical?: boolean
  reverse?: boolean
  disable?: boolean
  readonly?: boolean
  color?: string
  trackColor?: string
  thumbColor?: string
  dense?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  snap: false,
  label: false,
  labelAlways: false,
  markers: false,
  vertical: false,
  reverse: false,
  disable: false,
  readonly: false,
  color: "primary",
  trackColor: "",
  thumbColor: "",
  dense: false,
  dark: false,
})

const emit = defineEmits<{ "update:modelValue": [value: number]; change: [value: number] }>()

const trackEl = ref<HTMLElement | null>(null)
const dragging = ref(false)
const dragValue = ref<number | null>(null)

const snapped = (v: number): number => {
  const steps = Math.round((v - props.min) / props.step)
  return Math.min(props.max, Math.max(props.min, props.min + steps * props.step))
}

const displayValue = computed(() => {
  if (dragging.value && !props.snap && dragValue.value !== null) return dragValue.value
  return snapped(props.modelValue ?? 0)
})

const pct = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return ((displayValue.value - props.min) / span) * 100
})

const valueFromPos = (clientX: number, clientY: number): number => {
  const el = trackEl.value
  if (!el) return props.modelValue ?? 0
  const r = el.getBoundingClientRect()
  let ratio = props.vertical
    ? 1 - (clientY - r.top) / Math.max(1, r.height)
    : (clientX - r.left) / Math.max(1, r.width)
  if (props.reverse) ratio = 1 - ratio
  ratio = Math.min(1, Math.max(0, ratio))
  return props.min + ratio * (props.max - props.min)
}

const onPointerDown = (e: PointerEvent) => {
  if (props.disable || props.readonly) return
  dragging.value = true
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  const v = valueFromPos(e.clientX, e.clientY)
  if (props.snap) emit("update:modelValue", snapped(v))
  else dragValue.value = v
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragging.value) return
  const v = valueFromPos(e.clientX, e.clientY)
  if (props.snap) emit("update:modelValue", snapped(v))
  else dragValue.value = v
}

const onPointerUp = () => {
  if (!dragging.value) return
  dragging.value = false
  if (dragValue.value !== null) {
    const v = snapped(dragValue.value)
    dragValue.value = null
    emit("update:modelValue", v)
    emit("change", v)
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disable || props.readonly) return
  let next: number | null = null
  if (e.key === "ArrowRight" || e.key === "ArrowUp") next = (props.modelValue ?? 0) + props.step
  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = (props.modelValue ?? 0) - props.step
  else if (e.key === "Home") next = props.min
  else if (e.key === "End") next = props.max
  if (next === null) return
  e.preventDefault()
  const v = snapped(next)
  emit("update:modelValue", v)
  emit("change", v)
}

// — styles calculés —
const THUMB = 20

const trackStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.trackColor) style.backgroundColor = colorValue(props.trackColor)
  return style
})

const fillStyle = computed<Record<string, string>>(() => ({
  backgroundColor: colorValue(props.color),
  ...(props.vertical ? { height: `${pct.value}%` } : { width: `${pct.value}%` }),
}))

const thumbStyle = computed<Record<string, string>>(() => ({
  borderColor: colorValue(props.thumbColor || props.color),
  ...(props.vertical
    ? { top: `calc(${pct.value}% - ${THUMB / 2}px)` }
    : { left: `calc(${pct.value}% - ${THUMB / 2}px)` }),
}))

const markerPositions = computed<number[]>(() => {
  const list: number[] = []
  const span = props.max - props.min
  if (span <= 0 || props.step <= 0) return list
  for (let v = props.min; v <= props.max + 1e-9; v += props.step) {
    list.push(((v - props.min) / span) * 100)
  }
  return list
})

const rootClasses = computed(() =>
  cn(
    "q-slider",
    props.vertical && "q-slider--vertical",
    props.dense && "q-slider--dense",
    props.dark && "q-slider--dark",
    (props.disable || props.readonly) && "q-slider--disabled",
  ),
)
</script>

<template>
  <div
    ref="trackEl"
    class="q-slider"
    :class="rootClasses"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="Math.round(displayValue)"
    :tabindex="disable || readonly ? -1 : 0"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeydown"
  >
    <div class="q-slider__track" :style="trackStyle">
      <div class="q-slider__track-fill" :style="fillStyle" />
      <div class="q-slider__thumb" :class="{ 'q-slider__thumb--dragging': dragging }" :style="thumbStyle">
        <span
          v-if="label && (labelAlways || dragging)"
          class="q-slider__label"
          :style="{ backgroundColor: colorValue(color) }"
        >
          {{ Math.round(displayValue) }}
        </span>
      </div>
    </div>
    <span
      v-for="(m, i) in markerPositions"
      :key="i"
      class="q-slider__marker"
      :style="vertical ? { top: `${m}%` } : { left: `${m}%` }"
    />
  </div>
</template>
