<script setup lang="ts">
// QScrollArea — API Quasar : <q-scroll-area visible :thumb-style="…" :content-style="…" delay="350">
// Zone scrollable avec barre de défilement personnalisée (native masquée, thumb draggable).
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { cn } from "../lib/utils"

interface Props {
  barStyle?: string
  barClass?: string
  thumbStyle?: string
  thumbClass?: string
  contentStyle?: string
  contentClass?: string
  /** Toujours afficher la barre */
  visible?: boolean
  /** Délai de masquage après scroll (ms) */
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  delay: 350,
})

const contentRef = ref<HTMLElement | null>(null)
const viewportH = ref(0)
const scrollH = ref(0)
const scrollTop = ref(0)
const thumbH = ref(0)
const show = ref(false)
const dragging = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const scrollable = computed(() => scrollH.value > viewportH.value + 1)

const measure = () => {
  const c = contentRef.value
  if (!c) return
  viewportH.value = c.clientHeight
  scrollH.value = c.scrollHeight
  thumbH.value = Math.max(24, (viewportH.value / scrollH.value) * viewportH.value)
  scrollTop.value = c.scrollTop
}

const onScroll = () => {
  const c = contentRef.value
  if (c) scrollTop.value = c.scrollTop
  show.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (!dragging.value) show.value = false
  }, props.delay)
}

const thumbTop = computed(() =>
  scrollH.value > 0 ? (scrollTop.value / scrollH.value) * viewportH.value : 0,
)

const barVisible = computed(() => show.value || props.visible || dragging.value)

// Drag du thumb
const onThumbDown = (e: PointerEvent) => {
  const c = contentRef.value
  if (!c) return
  dragging.value = true
  const startY = e.clientY
  const startTop = c.scrollTop
  const onMove = (ev: PointerEvent) => {
    const dy = ev.clientY - startY
    c.scrollTop = startTop + (dy / viewportH.value) * scrollH.value
    scrollTop.value = c.scrollTop
  }
  const onUp = () => {
    dragging.value = false
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
  }
  window.addEventListener("pointermove", onMove)
  window.addEventListener("pointerup", onUp)
}

onMounted(() => {
  measure()
  if (typeof window !== "undefined") window.addEventListener("resize", measure)
})
onBeforeUnmount(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", measure)
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <div class="q-scroll-area">
    <div
      ref="contentRef"
      class="q-scroll-area__content"
      :class="contentClass"
      :style="contentStyle"
      @scroll="onScroll"
    >
      <slot />
    </div>
    <div
      v-if="scrollable"
      class="q-scroll-area__bar"
      :class="cn(barClass, barVisible && 'q-scroll-area__bar--visible')"
      :style="barStyle"
      aria-hidden="true"
    >
      <div
        class="q-scroll-area__thumb"
        :class="thumbClass"
        :style="[{ height: `${thumbH}px`, transform: `translateY(${thumbTop}px)` }, thumbStyle]"
        @pointerdown="onThumbDown"
      />
    </div>
  </div>
</template>
