<script setup lang="ts">
// QFooter — barre basse (safe-area bottom appliquée par styles/main.css : .q-app .q-footer)
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useFixedBarOffset } from "../lib/fixedLayout"

interface Props {
  /** Fixe la barre en bas de l'écran (sort du flux) */
  fixed?: boolean
  /** Ombre portée vers le haut */
  elevated?: boolean
  /** Masqué au scroll vers le bas, réaffiché au scroll vers le haut */
  reveal?: boolean
  /** Bordure supérieure */
  bordered?: boolean
  /** Fond translucide (frosted glass) : true = 70%, ou valeur % */
  translucent?: boolean | number
  /** Glassmorphism marqué : fond très translucide + flou fort + bordure claire */
  glass?: boolean
  /** Supprime le padding horizontal (éléments collés aux bords, safe-area conservée) */
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fixed: false,
  elevated: false,
  reveal: false,
  bordered: false,
  noPadding: false,
})

const rootEl = ref<HTMLElement | null>(null)

// Empilement : bottom = hauteur cumulée des footers fixed suivants (si fixed)
useFixedBarOffset(rootEl, "bar-bottom", () => props.fixed)

const translucentStyle = computed<Record<string, string> | undefined>(() =>
  props.translucent === true || typeof props.translucent === "number"
    ? { "--q-translucent-opacity": `${typeof props.translucent === "number" ? props.translucent : 70}%` }
    : undefined,
)

// reveal : écoute le scroll de la fenêtre
const visible = ref(true)
let lastY = 0

const onScroll = () => {
  if (typeof window === "undefined") return
  const y = window.scrollY
  visible.value = y <= 0 || y < lastY // haut de page ou scroll up → visible
  lastY = y
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", onScroll, { passive: true })
  }
})
onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", onScroll)
  }
})
</script>

<template>
  <footer
    ref="rootEl"
    class="q-footer"
    :class="{
      'q-footer--fixed': fixed,
      'q-footer--elevated': props.elevated,
      'q-footer--bordered': props.bordered,
      'q-footer--reveal': props.reveal,
      'q-footer--reveal-hidden': props.reveal && !visible,
      'q-footer--translucent': props.translucent === true || typeof props.translucent === 'number',
      'q-footer--glass': props.glass,
      'q-footer--no-padding': props.noPadding,
    }"
    :style="translucentStyle"
    v-bind="$attrs"
  >
    <slot />
  </footer>
</template>
