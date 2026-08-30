<script setup lang="ts">
// QPullToRefresh — tirer pour rafraîchir : <q-pull-to-refresh @refresh="(done) => { ...; done() }">
// Conteneur scrollable ; geste de traction quand scrollTop = 0 → indicateur + refresh.
import { computed, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { colorValue } from "../lib/colors"

interface Props {
  /** État de rafraîchissement (v-model) */
  modelValue?: boolean
  /** Couleur de l'indicateur (token ou hex) */
  color?: string
  /** Distance (px) de traction avant déclenchement */
  pullBack?: number
  /** Icône Iconify de l'indicateur (défaut : lucide:refresh-cw) */
  icon?: string
  /** Taille de l'icône / du spinner de l'indicateur (CSS, défaut 28px) */
  size?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  color: "primary",
  pullBack: 40,
  size: "28px",
  disable: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  /** Appelé quand le seuil est atteint ; appeler done() pour terminer */
  refresh: [done: () => void]
}>()

const internalRefreshing = ref(false)
const refreshing = computed({
  get: () => props.modelValue ?? internalRefreshing.value,
  set: (v) => {
    internalRefreshing.value = v
    emit("update:modelValue", v)
  },
})

const done = () => {
  refreshing.value = false
  pullDistance.value = 0
}

// — Geste de traction (Pointer Events : tactile + souris) —
const contentRef = ref<HTMLElement | null>(null)
const pulling = ref(false)
const startY = ref(0)
const pullDistance = ref(0)
const RESISTANCE = 0.45

const progress = computed(() => Math.min(1, pullDistance.value / props.pullBack))

const onPointerDown = (e: PointerEvent) => {
  if (props.disable || refreshing.value) return
  if (contentRef.value && contentRef.value.scrollTop > 0) return
  startY.value = e.clientY
  pulling.value = true
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!pulling.value) return
  const dy = e.clientY - startY.value
  if (dy <= 0 || (contentRef.value && contentRef.value.scrollTop > 0)) {
    pullDistance.value = 0
    return
  }
  pullDistance.value = Math.min(props.pullBack * 3, dy * RESISTANCE)
}

const onPointerUp = () => {
  if (!pulling.value) return
  pulling.value = false
  if (pullDistance.value >= props.pullBack) {
    refreshing.value = true
    emit("refresh", done)
  }
  pullDistance.value = 0
}

const indicatorY = computed(() => (refreshing.value ? 60 : pullDistance.value))

const indicatorStyle = computed<Record<string, string>>(() => ({
  transform: `translateY(${indicatorY.value}px)`,
}))

const iconStyle = computed<Record<string, string>>(() => ({
  color: colorValue(props.color),
  width: props.size,
  height: props.size,
  transform: `rotate(${progress.value * 180}deg)`,
}))

const rootClasses = computed(() => [
  "q-pull-to-refresh",
  pulling.value && "q-pull-to-refresh--pulling",
  refreshing.value && "q-pull-to-refresh--refreshing",
])
</script>

<template>
  <div
    ref="contentRef"
    class="q-pull-to-refresh"
    :class="rootClasses"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="q-pull-to-refresh__indicator" :style="indicatorStyle">
      <template v-if="refreshing">
        <slot name="refreshing">
          <span
            class="q-spinner"
            :style="{ color: colorValue(color), width: size, height: size }"
            aria-hidden="true"
          />
        </slot>
      </template>
      <template v-else>
        <slot name="pulling" :position="pullDistance">
          <Icon :icon="icon || icons.refreshCw" class="q-pull-to-refresh__icon" :style="iconStyle" aria-hidden="true" />
        </slot>
      </template>
    </div>
    <div class="q-pull-to-refresh__inner">
      <slot />
    </div>
  </div>
</template>
