<script setup lang="ts">
// QBackTop — API Quasar : <q-back-top :offset="300" position="bottom-right" color="primary" />
// Bouton collé au coin de son conteneur scrollable (position: sticky dans la div parent) :
// il reste visible pendant le scroll — contrairement à position:fixed, aucun ancêtre
// (transform, overflow…) ne peut le faire disparaître.
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { colorValue, foregroundFor } from "../lib/colors"

type BackTopPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"

interface Props {
  /** Seuil de scroll (px) avant affichage (défaut : 300) */
  offset?: number
  /** Coin du conteneur parent où le bouton est collé */
  position?: BackTopPosition
  /** Icône Iconify (défaut : lucide:arrow-up) */
  icon?: string
  /** Couleur du bouton (token ou hex) */
  color?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  offset: 300,
  position: "bottom-right",
  icon: icons.arrowUp,
  color: "primary",
  disable: false,
})

const wrapEl = ref<HTMLElement | null>(null)
const visible = ref(false)
const scroller = ref<HTMLElement | Window | null>(null)

const findScrollContainer = (el: HTMLElement | null): HTMLElement | Window | null => {
  let node: HTMLElement | null = el?.parentElement ?? null
  while (node) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node
    node = node.parentElement
  }
  return typeof window !== "undefined" ? window : null
}

const update = () => {
  const sc = scroller.value
  if (!sc) return
  const top = sc === window ? window.scrollY : (sc as HTMLElement).scrollTop
  visible.value = top > props.offset
}

const onClick = () => {
  if (props.disable) return
  const sc = scroller.value
  if (!sc) return
  if (sc === window) window.scrollTo({ top: 0, behavior: "smooth" })
  else (sc as HTMLElement).scrollTo({ top: 0, behavior: "smooth" })
}

onMounted(() => {
  scroller.value = findScrollContainer(wrapEl.value)
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
  }
  update()
})

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", update, true)
    window.removeEventListener("resize", update)
  }
})

const btnStyle = computed<Record<string, string>>(() => ({
  backgroundColor: colorValue(props.color),
  color: foregroundFor(props.color),
}))

const isTop = computed(() => props.position === "top-left" || props.position === "top-right")
</script>

<template>
  <!-- Positions hautes : le bouton est rendu avant le contenu (sticky top) -->
  <template v-if="isTop">
    <div
      ref="wrapEl"
      class="q-back-top"
      :class="[`q-back-top--${position}`, { 'q-back-top--visible': visible && !disable }]"
    >
      <button
        type="button"
        class="q-back-top__btn"
        :style="btnStyle"
        :aria-label="'Back to top'"
        @click="onClick"
      >
        <Icon :icon="icon" aria-hidden="true" />
      </button>
    </div>
    <slot />
  </template>

  <!-- Positions basses : le bouton est rendu après le contenu (sticky bottom) -->
  <template v-else>
    <slot />
    <div
      ref="wrapEl"
      class="q-back-top"
      :class="[`q-back-top--${position}`, { 'q-back-top--visible': visible && !disable }]"
    >
      <button
        type="button"
        class="q-back-top__btn"
        :style="btnStyle"
        :aria-label="'Back to top'"
        @click="onClick"
      >
        <Icon :icon="icon" aria-hidden="true" />
      </button>
    </div>
  </template>
</template>
