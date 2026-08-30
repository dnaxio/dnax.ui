<script setup lang="ts">
// QParallax — effet parallaxe type Quasar : <q-parallax :src="img" :height="300" :speed="0.6">
// L'image de fond se déplace plus lentement que le scroll de la fenêtre (ou du
// conteneur scrollable parent), en restant toujours couvrante. Content via slot.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Image de fond (URL) */
  src?: string
  /** Hauteur du bloc (px ou chaîne CSS) — défaut 200 */
  height?: number | string
  /** Intensité du parallaxe 0.1–1 (défaut 1) */
  speed?: number
  /** Désactive l'effet (image statique, cover) */
  disable?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
  speed: 1,
  disable: false,
  contentClass: "",
})

const containerEl = ref<HTMLElement | null>(null)
const mediaEl = ref<HTMLElement | null>(null)
const mediaStyle = ref<Record<string, string>>({})

let scrollParent: HTMLElement | Window | null = null
let raf = 0

const reducedMotion =
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const update = () => {
  const el = containerEl.value
  const media = mediaEl.value
  if (!el || !media) return
  const h = el.offsetHeight
  const speed = Math.min(1, Math.max(0.1, props.speed))
  const mediaH = h * (1 + 2 * 0.15 * speed) // 1.3× à speed 1
  const travel = (mediaH - h) / 2

  // Viewport visible : la fenêtre, ou le conteneur scrollable détecté
  let vpTop = 0
  let vpH = window.innerHeight
  if (scrollParent && scrollParent !== window) {
    const r = (scrollParent as HTMLElement).getBoundingClientRect()
    vpTop = r.top
    vpH = r.height
  }
  const vpCenter = vpTop + vpH / 2
  const elCenter = el.getBoundingClientRect().top + h / 2
  const maxDist = vpH / 2 + h / 2
  const percent = Math.max(-1, Math.min(1, (elCenter - vpCenter) / maxDist))
  const parallax = -(travel * percent)

  mediaStyle.value = {
    top: -travel + "px",
    height: mediaH + "px",
    transform:
      props.disable || reducedMotion ? "none" : `translate3d(0, ${parallax}px, 0)`,
  }
}

const schedule = () => {
  if (props.disable || reducedMotion) return
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(update)
}

const findScrollParent = (el: HTMLElement): HTMLElement | Window => {
  let node = el.parentElement
  while (node) {
    const s = getComputedStyle(node)
    if (/(auto|scroll|overlay)/.test(s.overflowY) && node.scrollHeight > node.clientHeight)
      return node
    node = node.parentElement
  }
  return window
}

onMounted(() => {
  if (typeof window === "undefined") return
  scrollParent = findScrollParent(containerEl.value!)
  const target = scrollParent === window ? window : scrollParent
  target.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  update()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (scrollParent) {
    const target = scrollParent === window ? window : scrollParent
    target.removeEventListener("scroll", schedule)
  }
  window.removeEventListener("resize", schedule)
})

watch(() => props.disable, update)

const containerStyle = computed<Record<string, string>>(() => ({
  height: typeof props.height === "number" ? props.height + "px" : props.height,
}))
</script>

<template>
  <div
    ref="containerEl"
    class="q-parallax"
    :class="cn(props.disable && 'q-parallax--disabled')"
    :style="containerStyle"
  >
    <div ref="mediaEl" class="q-parallax__media" :style="mediaStyle">
      <img v-if="src" :src="src" alt="" loading="lazy" draggable="false" />
    </div>
    <div class="q-parallax__content" :class="contentClass">
      <slot />
    </div>
  </div>
</template>
