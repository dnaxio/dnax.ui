<script setup lang="ts">
// QTooltip — API Quasar, comportement type shadcn-vue (reka-ui) :
// <q-tooltip side="top" align="center" :side-offset="8" show-arrow :delay="300" disable>
// À placer en enfant de la cible. Affichage au hover/focus, position fixed calculée
// avec FLIP automatique (bascule du côté opposé si manque de place) et clamping.
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import { colorValue, foregroundFor } from "../lib/colors"

type Side = "top" | "bottom" | "left" | "right"
type Align = "start" | "center" | "end"
type TooltipType = "positive" | "success" | "negative" | "error" | "info" | "warning"

interface Props {
  /** Contrôle externe (v-model) ; sinon géré au hover */
  modelValue?: boolean
  /** Délai d'ouverture (ms) — défaut 300 */
  delay?: number
  /** Délai d'ouverture (ms), prioritaire sur delay */
  openDelay?: number
  /** Délai de fermeture (ms) — défaut 0 */
  closeDelay?: number
  /** Désactive le tooltip */
  disable?: boolean
  /** Ancrage legacy : "edge align" (ex. "top middle", "right middle") */
  anchor?: string
  /** Bord d'ancrage : top | bottom | left | right (défaut : top) */
  side?: Side
  /** Alignement : start | center | end (défaut : center) */
  align?: Align
  /** Distance tooltip ↔ cible (px) — défaut 8 */
  sideOffset?: number
  /** Décalage d'alignement (px) — défaut 0 */
  alignOffset?: number
  /** Décalage supplémentaire [x, y] en px (compat ancêtre) */
  offset?: [number, number]
  /** Flèche pointant vers la cible */
  showArrow?: boolean
  /** true = le survol du tooltip ne le maintient pas ouvert (pointer-events none) */
  disableHoverableContent?: boolean
  /** Variante sémantique — définit le fond : positive/success, negative/error, info, warning */
  type?: TooltipType
  /** Couleur de fond (token ou hex) — prioritaire sur type */
  color?: string
  /** Couleur du texte (token ou hex) — défaut : blanc (contraste calculé si couleur libre) */
  textColor?: string
  /** Icône Iconify affichée dans le tooltip (ex. "lucide:info") */
  icon?: string
  /** Position de l'icône : left (défaut) | right */
  iconPosition?: "left" | "right"
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  disable: false,
  sideOffset: 8,
  alignOffset: 0,
  offset: () => [0, 0] as [number, number],
  showArrow: false,
  disableHoverableContent: false,
  contentClass: "",
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

// — Délais —
const openDelay = computed(() => props.openDelay ?? props.delay ?? 300)
const closeDelay = computed(() => props.closeDelay ?? 0)

// — Side / align (props explicites > anchor legacy) —
const anchorSide = computed<Side>(() => (props.anchor?.split(" ")[0] as Side) || "top")
const anchorAlign = computed<Align>(() => {
  const a = props.anchor?.split(" ")[1]
  if (a === "left" || a === "top") return "start"
  if (a === "right" || a === "bottom") return "end"
  return "center"
})
const side = computed<Side>(() => props.side ?? anchorSide.value)
const align = computed<Align>(() => props.align ?? anchorAlign.value)
const effectiveSide = ref<Side>("top") // après flip éventuel

// — Ouverture contrôlée / interne —
// Détection du v-model par les PROPS RÉELLEMENT PASSÉES (vnode.props) : un prop
// Boolean non fourni vaut false (pas undefined) → `modelValue !== undefined`
// serait TOUJOURS contrôlé et le tooltip ne s'ouvrirait jamais sans v-model.
const instance = getCurrentInstance()
const controlled = computed(() => {
  const p = instance?.vnode.props
  return !!(p && ("modelValue" in p || "onUpdate:modelValue" in p))
})
const internalOpen = ref(false)
const open = computed(() => (controlled.value ? props.modelValue : internalOpen.value))

const setOpen = (v: boolean) => {
  if (controlled.value) emit("update:modelValue", v)
  else internalOpen.value = v
}

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const cancelHide = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const show = () => {
  if (props.disable) return
  cancelHide()
  if (showTimer) clearTimeout(showTimer)
  showTimer = setTimeout(() => setOpen(true), openDelay.value)
}

const scheduleHide = () => {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => setOpen(false), closeDelay.value)
}

// — Positionnement (flip + clamp) —
const tipRef = ref<HTMLElement | null>(null)
const parentEl = ref<HTMLElement | null>(null)
const posStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})
// Ancre invisible rendue DANS la cible : retrouve l'élément parent même après
// le Teleport vers body (qui couperait le lien DOM).
const anchorEl = ref<HTMLElement | null>(null)

const PAD = 8
const ARROW = 10

const updatePosition = () => {
  const tip = tipRef.value
  const parent = parentEl.value
  if (!tip || !parent) return
  const pr = parent.getBoundingClientRect()
  const tw = tip.offsetWidth
  const th = tip.offsetHeight
  const vw = window.innerWidth
  const vh = window.innerHeight

  const place = (s: Side, a: Align) => {
    const off = props.sideOffset
    const aoff = props.alignOffset
    let left = 0
    let top = 0
    if (s === "top" || s === "bottom") {
      left = a === "start" ? pr.left + aoff : a === "end" ? pr.right - tw - aoff : pr.left + (pr.width - tw) / 2
      top = s === "top" ? pr.top - th - off : pr.bottom + off
    } else {
      top = a === "start" ? pr.top + aoff : a === "end" ? pr.bottom - th - aoff : pr.top + (pr.height - th) / 2
      left = s === "left" ? pr.left - tw - off : pr.right + off
    }
    return { left: left + props.offset[0], top: top + props.offset[1] }
  }

  let s = side.value
  let a = align.value
  let pos = place(s, a)

  // FLIP : bascule sur le côté opposé si le côté demandé déborde
  if (s === "top" && pos.top < PAD && pr.bottom + props.sideOffset + th <= vh - PAD) {
    s = "bottom"
    pos = place(s, a)
  } else if (s === "bottom" && pos.top + th > vh - PAD && pr.top - props.sideOffset - th >= PAD) {
    s = "top"
    pos = place(s, a)
  } else if (s === "left" && pos.left < PAD && pr.right + props.sideOffset + tw <= vw - PAD) {
    s = "right"
    pos = place(s, a)
  } else if (s === "right" && pos.left + tw > vw - PAD && pr.left - props.sideOffset - tw >= PAD) {
    s = "left"
    pos = place(s, a)
  }

  // CLAMP : garde le tooltip dans le viewport
  pos.left = Math.max(PAD, Math.min(pos.left, vw - tw - PAD))
  pos.top = Math.max(PAD, Math.min(pos.top, vh - th - PAD))
  effectiveSide.value = s

  posStyle.value = { left: `${pos.left}px`, top: `${pos.top}px` }

  // Flèche : centrée/alignée sur le bord côté cible
  if (props.showArrow) {
    if (s === "top" || s === "bottom") {
      const x = a === "start" ? 14 + props.alignOffset : a === "end" ? tw - 14 - props.alignOffset : tw / 2
      arrowStyle.value = {
        left: `${x - ARROW / 2}px`,
        top: s === "top" ? `${th - ARROW / 2}px` : `${-ARROW / 2}px`,
      }
    } else {
      const y = a === "start" ? 14 + props.alignOffset : a === "end" ? th - 14 - props.alignOffset : th / 2
      arrowStyle.value = {
        top: `${y - ARROW / 2}px`,
        left: s === "left" ? `${tw - ARROW / 2}px` : `${-ARROW / 2}px`,
      }
    }
  }
}

watch(open, async (v) => {
  if (v) {
    await nextTick()
    updatePosition()
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)
    }
  } else if (typeof window !== "undefined") {
    window.removeEventListener("scroll", updatePosition, true)
    window.removeEventListener("resize", updatePosition)
  }
})

onMounted(() => {
  // L'ancre (span invisible rendu DANS la cible) permet de retrouver l'élément
  // cible même après le Teleport vers body (qui coupe le lien DOM parent).
  parentEl.value = anchorEl.value?.parentElement ?? null
  const p = parentEl.value
  if (p) {
    p.addEventListener("mouseenter", show)
    p.addEventListener("mouseleave", scheduleHide)
    p.addEventListener("focusin", show)
    p.addEventListener("focusout", scheduleHide)
  }
})

onBeforeUnmount(() => {
  const p = parentEl.value
  if (p) {
    p.removeEventListener("mouseenter", show)
    p.removeEventListener("mouseleave", scheduleHide)
    p.removeEventListener("focusin", show)
    p.removeEventListener("focusout", scheduleHide)
  }
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", updatePosition, true)
    window.removeEventListener("resize", updatePosition)
  }
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
})

const tipClasses = computed(() =>
  cn("q-tooltip", open.value && "q-tooltip--show", props.contentClass),
)

// — Thème : type sémantique / couleur / texte / icône —
const typeBg = computed<string | undefined>(() => {
  switch (props.type) {
    case "positive":
    case "success":
      return "positive"
    case "negative":
    case "error":
      return "negative"
    case "info":
      return "info"
    case "warning":
      return "warning"
    default:
      return undefined
  }
})

const themeStyle = computed<Record<string, string>>(() => {
  const s: Record<string, string> = {}
  const bg = props.color ?? typeBg.value
  if (bg) {
    s["--q-tooltip-bg"] = colorValue(bg)
    s["--q-tooltip-fg"] = props.textColor ? colorValue(props.textColor) : foregroundFor(bg)
  } else if (props.textColor) {
    s["--q-tooltip-fg"] = colorValue(props.textColor)
  }
  return s
})
</script>

<template>
  <!-- Ancre invisible dans la cible : sert de référence pour le hover ET pour
       retrouver l'élément cible après le Teleport. -->
  <span ref="anchorEl" class="q-tooltip__anchor" aria-hidden="true" style="display: none" />
  <Teleport to="body">
    <div
      ref="tipRef"
      v-show="open"
      class="q-tooltip"
      :class="[tipClasses, disableHoverableContent && 'q-tooltip--no-hover']"
      :style="[themeStyle, posStyle]"
      role="tooltip"
      @mouseenter="cancelHide"
      @mouseleave="scheduleHide"
    >
      <Icon
        v-if="icon && iconPosition !== 'right'"
        :icon="icon"
        class="q-tooltip__icon"
        aria-hidden="true"
      />
      <slot />
      <Icon
        v-if="icon && iconPosition === 'right'"
        :icon="icon"
        class="q-tooltip__icon"
        aria-hidden="true"
      />
      <span v-if="showArrow" class="q-tooltip__arrow" :style="arrowStyle" aria-hidden="true" />
    </div>
  </Teleport>
</template>
