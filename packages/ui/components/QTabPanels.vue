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
  /** Nom de la transition active (direction next/prev, vertical) */
  transitionName: Readonly<Ref<string>>
  animated: Readonly<Ref<boolean>>
  dark: Readonly<Ref<boolean>>
}

export const qTabPanelsKey: InjectionKey<QTabPanelsContext> = Symbol("q-tab-panels")
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Panneau actif (v-model) — même valeur que QTabs */
  modelValue?: string | number | null
  /** Anime les transitions entre panneaux */
  animated?: boolean
  /** Transition vers le panneau suivant (défaut : q-tab-panel-next) */
  transitionNext?: string
  /** Transition vers le panneau précédent (défaut : q-tab-panel-prev) */
  transitionPrev?: string
  /** Transition verticale */
  vertical?: boolean
  /** Swipe tactile pour changer de panneau */
  swipeable?: boolean
  /** Thème sombre */
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  animated: false,
  transitionNext: "q-tab-panel-next",
  transitionPrev: "q-tab-panel-prev",
  vertical: false,
  swipeable: false,
  dark: false,
})

const emit = defineEmits<{ "update:modelValue": [value: string | number | null] }>()

const panelRegs = shallowRef<QTabPanelRegistration[]>([])
const direction = ref<"next" | "prev">("next")

// Direction de transition : suivant / précédent (ordre d'enregistrement)
watch(
  () => props.modelValue,
  (v, old) => {
    if (old === null || old === undefined || v === null || v === undefined) return
    const order = panelRegs.value.map((p) => p.name)
    direction.value = order.indexOf(v) > order.indexOf(old) ? "next" : "prev"
  },
)

const transitionName = computed(() => {
  const base = direction.value === "next" ? props.transitionNext : props.transitionPrev
  return props.vertical ? `${base}-vertical` : base
})

// Hauteur du conteneur = hauteur du panneau actif (les panneaux sont position:absolute en mode animé)
const minHeight = ref<number | null>(null)
const measureActive = async () => {
  await nextTick()
  const active = panelRegs.value.find((p) => p.name === props.modelValue)?.el.value
  minHeight.value = active ? active.offsetHeight : null
}
watch([() => props.modelValue, panelRegs], measureActive)
onMounted(() => {
  measureActive()
  if (typeof window !== "undefined") window.addEventListener("resize", measureActive)
})
onBeforeUnmount(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", measureActive)
})

// — Swipe tactile (horizontal) —
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
  transitionName,
  animated: computed(() => props.animated),
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
    :style="animated && minHeight ? { minHeight: `${minHeight}px` } : undefined"
    @touchstart.passive="onTouchStart"
    @touchend.passive="swipeable ? onTouchEnd : undefined"
  >
    <slot />
  </div>
</template>
