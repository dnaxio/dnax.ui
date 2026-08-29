<script setup lang="ts">
// QInfiniteScroll — API Quasar : <q-infinite-scroll :offset="250" @load="onLoad" animated>
// Charge plus de contenu quand on approche du bas (scroll fenêtre ou conteneur scrollable).
// Le handler reçoit (index, done) — appeler done() quand le chargement est fini.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue"

interface Props {
  /** Distance (px) du bas avant de déclencher le chargement (défaut : 250) */
  offset?: number
  /** Désactive le chargement */
  disable?: boolean
  /** Anime l'arrivée des nouveaux items (fondu + glissement vers le haut) */
  animated?: boolean
  /** Masque l'indicateur de chargement (scroll silencieux — TikTok/Instagram) */
  hideLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  offset: 250,
  disable: false,
  animated: false,
  hideLoading: false,
})

const emit = defineEmits<{
  load: [index: number, done: () => void]
}>()

const rootEl = ref<HTMLElement | null>(null)
const loading = ref(false)
let loadIndex = 0

// Conteneur scrollable le plus proche (ou la fenêtre)
const scrollContainer = ref<HTMLElement | Window | null>(null)

const findScrollContainer = (el: HTMLElement | null): HTMLElement | Window | null => {
  let node: HTMLElement | null = el?.parentElement ?? null
  while (node) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node
    node = node.parentElement
  }
  return typeof window !== "undefined" ? window : null
}

const load = () => {
  if (props.disable || loading.value) return
  loading.value = true
  loadIndex += 1
  emit("load", loadIndex, () => {
    loading.value = false
    nextTick(check)
  })
}

const check = () => {
  if (props.disable || loading.value) return
  const el = rootEl.value
  const sc = scrollContainer.value
  if (!el || !sc) return
  const rect = el.getBoundingClientRect()
  if (sc === window) {
    if (rect.bottom <= window.innerHeight + props.offset) load()
  }
  else {
    const scRect = (sc as HTMLElement).getBoundingClientRect()
    if (rect.bottom <= scRect.bottom + props.offset) load()
  }
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  scrollContainer.value = findScrollContainer(rootEl.value)
  if (typeof window !== "undefined") {
    // capture : capte aussi le scroll des conteneurs internes
    window.addEventListener("scroll", check, true)
    window.addEventListener("resize", check)
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(check)
      if (rootEl.value) resizeObserver.observe(rootEl.value)
    }
  }
  check()
})

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", check, true)
    window.removeEventListener("resize", check)
    resizeObserver?.disconnect()
  }
})

const classes = computed(() => ({
  "q-infinite-scroll--animated": props.animated,
}))
</script>

<template>
  <div ref="rootEl" class="q-infinite-scroll" :class="classes">
    <slot />
    <div v-if="loading && !hideLoading" class="q-infinite-scroll__loading" role="status" aria-live="polite">
      <slot name="loading">
        <span class="q-spinner" aria-hidden="true" />
        <span class="q-infinite-scroll__loading-label">Loading more…</span>
      </slot>
    </div>
  </div>
</template>
