<script setup lang="ts">
// QTooltip — API Quasar : <q-tooltip delay="300" anchor="top middle" :offset="[0, 8]" disable>
// À placer en enfant du composant cible. Affichage au hover/focus, position fixe calculée.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Contrôle externe (v-model) ; sinon géré au hover */
  modelValue?: boolean
  /** Délai d'affichage (ms) */
  delay?: number
  /** Désactive le tooltip */
  disable?: boolean
  /** Ancrage : "top|bottom|left|right" + "left|middle|right|top|bottom" */
  anchor?: string
  /** Décalage [x, y] en px */
  offset?: [number, number]
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  delay: 300,
  disable: false,
  anchor: "top middle",
  offset: () => [0, 8] as [number, number],
  contentClass: "",
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

const controlled = computed(() => props.modelValue !== undefined)
const internalOpen = ref(false)
const open = computed(() => (controlled.value ? props.modelValue : internalOpen.value))

const tipRef = ref<HTMLElement | null>(null)
const parentEl = ref<HTMLElement | null>(null)
const posStyle = ref<Record<string, string>>({})

let showTimer: ReturnType<typeof setTimeout> | null = null

const show = () => {
  if (props.disable) return
  if (showTimer) clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    if (controlled.value) emit("update:modelValue", true)
    else internalOpen.value = true
  }, props.delay)
}

const hide = () => {
  if (showTimer) clearTimeout(showTimer)
  if (controlled.value) emit("update:modelValue", false)
  else internalOpen.value = false
}

const updatePosition = () => {
  const tip = tipRef.value
  const parent = parentEl.value
  if (!tip || !parent) return
  const pr = parent.getBoundingClientRect()
  const tw = tip.offsetWidth
  const th = tip.offsetHeight
  const [edge, align = "middle"] = props.anchor.split(" ")
  const [ox, oy] = props.offset

  let left = 0
  let top = 0
  if (edge === "top" || edge === "bottom") {
    left = align === "left" ? pr.left : align === "right" ? pr.right - tw : pr.left + (pr.width - tw) / 2
    top = edge === "top" ? pr.top - th - oy : pr.bottom + oy
  }
  else {
    top = align === "top" ? pr.top : align === "bottom" ? pr.bottom - th : pr.top + (pr.height - th) / 2
    left = edge === "left" ? pr.left - tw - ox : pr.right + ox
  }

  const vw = window.innerWidth
  const vh = window.innerHeight
  left = Math.max(8, Math.min(left, vw - tw - 8))
  top = Math.max(8, Math.min(top, vh - th - 8))
  posStyle.value = { left: `${left}px`, top: `${top}px` }
}

watch(open, async (v) => {
  if (v) {
    await nextTick()
    updatePosition()
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)
    }
  }
  else if (typeof window !== "undefined") {
    window.removeEventListener("scroll", updatePosition, true)
    window.removeEventListener("resize", updatePosition)
  }
})

onMounted(() => {
  parentEl.value = tipRef.value?.parentElement ?? null
  const p = parentEl.value
  if (p) {
    p.addEventListener("mouseenter", show)
    p.addEventListener("mouseleave", hide)
    p.addEventListener("focusin", show)
    p.addEventListener("focusout", hide)
  }
})

onBeforeUnmount(() => {
  const p = parentEl.value
  if (p) {
    p.removeEventListener("mouseenter", show)
    p.removeEventListener("mouseleave", hide)
    p.removeEventListener("focusin", show)
    p.removeEventListener("focusout", hide)
  }
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", updatePosition, true)
    window.removeEventListener("resize", updatePosition)
  }
  if (showTimer) clearTimeout(showTimer)
})
</script>

<template>
  <div
    ref="tipRef"
    v-show="open"
    class="q-tooltip"
    :class="cn(open && 'q-tooltip--show', contentClass)"
    :style="posStyle"
    role="tooltip"
  >
    <slot />
  </div>
</template>
