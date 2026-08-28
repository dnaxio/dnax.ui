<script lang="ts">
// QTabPanels — API Quasar : <q-tab-panels v-model="tab" animated swipeable> + QTabPanel enfants.
// Affiche le panneau dont le `name` correspond au v-model (partagé avec QTabs).
import type { InjectionKey, Ref } from "vue"

export interface QTabPanelRegistration {
  name: string | number
  el: Ref<HTMLElement | null>
}

export interface QTabPanelsContext {
  activeName: Readonly<Ref<string | number | null>>
  register: (panel: QTabPanelRegistration) => void
  unregister: (name: string | number) => void
  animated: Readonly<Ref<boolean>>
  animation: Readonly<Ref<QTabPanelsAnimation>>
  dark: Readonly<Ref<boolean>>
}

/** Type d'animation du panneau actif (mode animated) */
export type QTabPanelsAnimation = "fade" | "slide-right" | "slide-left" | "slide-up" | "slide-down"

export const qTabPanelsKey: InjectionKey<QTabPanelsContext> = Symbol("q-tab-panels")
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, shallowRef } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Panneau actif (v-model) — même valeur que QTabs */
  modelValue?: string | number | null
  /** Anime l'apparition du panneau actif */
  animated?: boolean
  /** Type d'animation : fade (défaut) | slide-right | slide-left | slide-up | slide-down */
  animation?: QTabPanelsAnimation
  /** Swipe tactile pour changer de panneau */
  swipeable?: boolean
  /** Thème sombre */
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  animated: false,
  animation: "fade",
  swipeable: false,
  dark: false,
})

const emit = defineEmits<{ "update:modelValue": [value: string | number | null] }>()

const panelRegs = shallowRef<QTabPanelRegistration[]>([])

// — Swipe tactile (horizontal) : panneau suivant / précédent —
let touchStartX = 0
let touchStartY = 0
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0]?.clientX ?? 0
  touchStartY = e.touches[0]?.clientY ?? 0
}
const onTouchEnd = (e: TouchEvent) => {
  const t = e.changedTouches[0]
  if (!t) return
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
  if (props.modelValue === null || props.modelValue === undefined) return
  const order = panelRegs.value.map((p) => p.name)
  const idx = order.indexOf(props.modelValue)
  if (dx < 0 && idx < order.length - 1) emit("update:modelValue", order[idx + 1] ?? null)
  else if (dx > 0 && idx > 0) emit("update:modelValue", order[idx - 1] ?? null)
}

provide<QTabPanelsContext>(qTabPanelsKey, {
  activeName: computed(() => props.modelValue),
  register: (p) => {
    panelRegs.value = [...panelRegs.value, p]
  },
  unregister: (name) => {
    panelRegs.value = panelRegs.value.filter((p) => p.name !== name)
  },
  animated: computed(() => props.animated),
  animation: computed(() => props.animation),
  dark: computed(() => props.dark),
})

const panelsClasses = computed(() =>
  cn(
    "q-tab-panels",
    props.animated && "q-tab-panels--animated",
    props.dark && "q-tab-panels--dark",
  ),
)
</script>

<template>
  <div
    class="q-tab-panels"
    :class="panelsClasses"
    @touchstart.passive="onTouchStart"
    @touchend.passive="swipeable ? onTouchEnd : undefined"
  >
    <slot />
  </div>
</template>
