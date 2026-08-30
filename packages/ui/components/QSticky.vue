<script setup lang="ts">
// QSticky — colle du contenu au haut (ou bas) du viewport pendant le scroll :
// <q-sticky :offset-top="16"><q-btn … /></q-sticky>.
// Le composant garde sa place dans le flux (placeholder de même taille) et passe
// en position:fixed quand il atteint l'offset ; avec `container`, il reste
// à l'intérieur de ce conteneur (transform borné au bord bas/haut).
// Events : @scroll="{ scrollTop, isFixed }" et @change="isFixed".
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue"

type QStickyPosition = "top" | "bottom"

interface Props {
  /** Offset depuis le haut du viewport quand le composant est collé, en px (défaut 0) */
  offsetTop?: number
  /** Offset depuis le bas du viewport quand le composant est collé, en px (défaut 0) */
  offsetBottom?: number
  /** Position de collage : "top" | "bottom" (défaut top) */
  position?: QStickyPosition
  /** Conteneur optionnel : le composant reste à l'intérieur (s'arrête au bord du conteneur) */
  container?: Element | null
  /** z-index quand collé (défaut 99) */
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  offsetTop: 0,
  offsetBottom: 0,
  position: "top",
  container: null,
  zIndex: 99,
})

const emit = defineEmits<{
  scroll: [payload: { scrollTop: number; isFixed: boolean }]
  change: [isFixed: boolean]
}>()

const root = ref<HTMLElement | null>(null)

const state = reactive({
  fixed: false,
  width: 0, // largeur mesurée
  height: 0, // hauteur mesurée
  transform: 0, // correction pour rester dans le conteneur
})
const isReset = ref(false)

const offset = computed(() =>
  props.position === "top" ? props.offsetTop : props.offsetBottom,
)

const isHidden = () => !root.value || root.value.offsetParent === null

/** Conteneur de scroll réel le plus proche (overflow scrollable), sinon window */
const findScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
  let node = el?.parentElement ?? null
  while (node) {
    const overflowY = getComputedStyle(node).overflowY
    if (
      /(auto|scroll|overlay)/.test(overflowY) &&
      node.scrollHeight > node.clientHeight
    ) {
      return node
    }
    node = node.parentElement
  }
  return window
}

let scrollParent: HTMLElement | Window = window

const scrollTop = () =>
  scrollParent === window
    ? window.scrollY || document.documentElement.scrollTop
    : (scrollParent as HTMLElement).scrollTop

const onScroll = () => {
  if (!root.value || isHidden()) return

  const { container, position } = props
  const rootRect = root.value.getBoundingClientRect()

  state.width = rootRect.width
  state.height = rootRect.height

  if (position === "top") {
    if (container) {
      const containerRect = container.getBoundingClientRect()
      const difference = containerRect.bottom - offset.value - state.height
      state.fixed = offset.value > rootRect.top && containerRect.bottom > 0
      state.transform = difference < 0 ? difference : 0
    } else {
      state.fixed = offset.value > rootRect.top
    }
  } else {
    const clientHeight = document.documentElement.clientHeight
    if (container) {
      const containerRect = container.getBoundingClientRect()
      const difference =
        clientHeight - containerRect.top - offset.value - state.height
      state.fixed =
        clientHeight - offset.value < rootRect.bottom &&
        clientHeight > containerRect.top
      state.transform = difference < 0 ? -difference : 0
    } else {
      state.fixed = clientHeight - offset.value < rootRect.bottom
    }
  }

  emit("scroll", { scrollTop: scrollTop(), isFixed: state.fixed })
}

watch(
  () => state.fixed,
  (value) => emit("change", value),
)

/** Re-mesure après un resize quand le composant est collé */
const onResize = () => {
  if (!root.value || isHidden() || !state.fixed) return
  isReset.value = true
  nextTick(() => {
    if (!root.value) return
    const r = root.value.getBoundingClientRect()
    state.width = r.width
    state.height = r.height
    isReset.value = false
  })
}

onMounted(() => {
  if (root.value) {
    scrollParent = findScrollParent(root.value)
    scrollParent.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    onScroll()
  }
})

onBeforeUnmount(() => {
  scrollParent.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", onResize)
})

// Placeholder : conserve la place du contenu dans le flux quand il est collé
const rootStyle = computed(() => {
  if (isReset.value || !state.fixed) return undefined
  return { width: `${state.width}px`, height: `${state.height}px` }
})

const stickyStyle = computed(() => {
  if (!state.fixed || isReset.value) return undefined
  const style: Record<string, string> = {
    width: `${state.width}px`,
    height: `${state.height}px`,
    [props.position]: `${offset.value}px`,
    "--q-sticky-z-index": String(props.zIndex),
  }
  if (state.transform) style.transform = `translate3d(0, ${state.transform}px, 0)`
  return style
})
</script>

<template>
  <div ref="root" class="q-sticky" :style="rootStyle">
    <div
      class="q-sticky__content"
      :class="{ 'q-sticky__content--fixed': state.fixed && !isReset }"
      :style="stickyStyle"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.q-sticky__content--fixed {
  position: fixed;
  z-index: var(--q-sticky-z-index, 99);
}
</style>
