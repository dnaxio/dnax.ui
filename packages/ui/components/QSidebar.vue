<script lang="ts">
// QSidebar — panneau latéral type Sidebar shadcn-vue, API QDrawer Quasar :
// <q-sidebar v-model="open" side="left" width="260px" bordered show-if-above :breakpoint="1023">
// Fournit le contexte (toggle) aux QSidebarTrigger enfants.
import type { InjectionKey, Ref } from "vue"

export interface SidebarContext {
  open: Readonly<Ref<boolean>>
  setOpen: (v: boolean) => void
  toggle: () => void
}

export const qSidebarKey: InjectionKey<SidebarContext> = Symbol("q-sidebar")
</script>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from "vue"
import type { StyleValue } from "vue"
import { cn } from "../lib/utils"
import { useOverlayBack } from "../lib/overlayBack"
import { qLayoutKey } from "../lib/layout"

interface Props {
  /** Ouvert (v-model) — mode offcanvas ; ignoré en mode statique */
  modelValue?: boolean
  /** Côté : left | right */
  side?: "left" | "right"
  /** Largeur (défaut 260px) */
  width?: string
  /** Hauteur du panneau (ex. "calc(100vh - 64px)", "80vh") — sinon pleine hauteur */
  height?: string
  /** Hauteur max — le contenu scrolle (ex. "70vh") */
  maxHeight?: string
  /** Bordure côté intérieur */
  bordered?: boolean
  /** Ombre portée */
  elevated?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Toujours visible au-delà du breakpoint (mode statique) */
  showIfAbove?: boolean
  /** Mode statique : reste collé en haut pendant le scroll de la page (position: sticky) */
  sticky?: boolean
  /** Breakpoint de bascule statique/offcanvas (px) */
  breakpoint?: number
  /** Styles CSS additionnels appliqués au panneau */
  style?: StyleValue
  /** Classe(s) additionnelle(s) appliquée(s) au panneau */
  class?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  side: "left",
  width: "260px",
  height: "",
  maxHeight: "",
  bordered: false,
  elevated: false,
  dark: false,
  showIfAbove: false,
  sticky: false,
  breakpoint: 1023,
  style: undefined,
  class: "",
  disable: false,
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

// Multi-racines (<aside> + backdrop) : Vue ne peut pas hériter les attributs tout seul
// (avertissement « could not be automatically inherited because component renders
// fragment … »). On les applique explicitement sur le panneau, la seule racine qui
// compte : `id`, `data-*`, `aria-label`… arrivent donc sur l'<aside> (l'accessibilité
// et les sélecteurs de test sont préservés). `class` / `style` restent des props.
defineOptions({ inheritAttrs: false })

// — Mode statique (viewport >= breakpoint && show-if-above) —
const isAbove = ref(false)
let mql: MediaQueryList | null = null

const updateMql = () => {
  isAbove.value = mql?.matches ?? false
}

onMounted(() => {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    mql = window.matchMedia(`(min-width: ${props.breakpoint}px)`)
    updateMql()
    mql.addEventListener("change", updateMql)
  }
})
onBeforeUnmount(() => {
  mql?.removeEventListener("change", updateMql)
})

const isStatic = computed(() => props.showIfAbove && isAbove.value && !props.disable)
const open = computed(() => (isStatic.value ? true : (props.modelValue ?? true)))

const setOpen = (v: boolean) => {
  if (!isStatic.value) emit("update:modelValue", v)
}
const toggle = () => setOpen(!open.value)

provide<SidebarContext>(qSidebarKey, { open, setOpen, toggle })

// — Placement dans un QLayout (facultatif) —
// En mode statique le panneau occupe sa cellule (« l » / « r » du `view`) et devient
// sticky si la lettre est en majuscule ; en offcanvas il est `fixed` (recouvrant),
// donc sa place dans la grille ne compte plus.
const layout = inject(qLayoutKey, null)
const layoutZone = computed(() => layout?.zones.value[props.side])

// « Retour » navigateur → ferme la sidebar (mode offcanvas uniquement)
const overlayOpen = computed(() => !isStatic.value && open.value)
useOverlayBack(overlayOpen, () => setOpen(false), "QSidebar")

// Échap ferme en offcanvas
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && !isStatic.value && open.value) setOpen(false)
}

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("keydown", onDocKeydown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("keydown", onDocKeydown)
})

// Verrouille le scroll du body quand la sidebar offcanvas est ouverte : le body
// ne bouge plus en arrière-plan (et le swipe ne part pas sur la page)
watch(
  () => !isStatic.value && open.value,
  (locked) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = locked ? "hidden" : ""
    }
  },
  { immediate: true },
)

const rootClasses = computed(() =>
  cn(
    "q-sidebar",
    isStatic.value ? "q-sidebar--static" : "q-sidebar--offcanvas",
    !isStatic.value && open.value && "q-sidebar--open",
    props.side === "right" && "q-sidebar--right",
    // sticky : prop explicite, ou imposé par la casse de la lettre dans un QLayout
    (props.sticky || !!layoutZone.value?.fixed) && "q-sidebar--sticky",
    props.bordered && "q-sidebar--bordered",
    props.elevated && "q-sidebar--elevated",
    props.dark && "q-sidebar--dark",
    props.class,
  ),
)

const rootStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = { "--q-sidebar-w": props.width }
  if (props.height) style.height = props.height
  if (props.maxHeight) style.maxHeight = props.maxHeight
  // Cellule de la grille QLayout (mode statique : en offcanvas le panneau est fixed)
  const zone = layoutZone.value
  if (isStatic.value && zone?.area) style.gridArea = zone.area
  // Sticky : ne s'accroche qu'aux barres qui le surplombent (rangée 0 = au-dessus de lui)
  if (isStatic.value && zone?.fixed) {
    if (zone.cells.some(([row]) => row === 0)) style["--q-sidebar-sticky-top"] = "0px"
    if (zone.cells.some(([row]) => row === 2)) style["--q-sidebar-sticky-bottom"] = "0px"
  }
  return style
})

// — Swipe pour fermer (mode offcanvas, pattern bottom-sheet) —
const rootEl = ref<HTMLElement | null>(null)
const dragging = ref(false)
let startX = 0
let startY = 0
let currentDx = 0
let isHorizontal = false

const onPointerDown = (e: PointerEvent) => {
  if (isStatic.value || !open.value || props.disable) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  startX = e.clientX
  startY = e.clientY
  currentDx = 0
  isHorizontal = false
  dragging.value = true
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragging.value || !rootEl.value) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY

  // Ne capture le geste que s'il est majoritairement horizontal (le scroll
  // vertical du contenu continue de fonctionner)
  if (!isHorizontal) {
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      isHorizontal = true
      rootEl.value.style.transition = "none"
    }
    else return
  }

  // Sens : left → glisser vers la gauche (dx négatif) ; right → vers la droite
  const dir = props.side === "right" ? 1 : -1
  const travel = Math.max(0, dir * dx)
  currentDx = travel
  rootEl.value.style.transform = `translateX(${dir === 1 ? travel : -travel}px)`
}

const onPointerUp = () => {
  if (!dragging.value) return
  dragging.value = false
  const el = rootEl.value
  if (!el) return
  el.style.transition = "" // restaure la transition CSS
  const width = el.offsetWidth || parseInt(props.width, 10) || 260
  if (currentDx > Math.min(80, width * 0.3)) {
    // Fermer : l'animation continue depuis la position de swipe jusqu'au bord
    const final = props.side === "right" ? "100%" : "-100%"
    el.style.transform = `translateX(${final})`
    setOpen(false)
  }
  else if (el) {
    el.style.transform = "" // rebond : la transition CSS ramène à l'ouverture
  }
  currentDx = 0
}

// Nettoie le transform inline laissé par le swipe à la réouverture, pour que
// le panneau reparte de la position CSS (pas de l'endroit où on a relâché)
watch(open, (v) => {
  const el = rootEl.value
  if (!el) return
  el.style.transition = ""
  if (v) el.style.transform = ""
})
</script>

<template>
  <aside
    ref="rootEl"
    class="q-sidebar"
    :class="rootClasses"
    :style="[rootStyle, props.style]"
    v-bind="$attrs"
    :aria-hidden="!isStatic && !open ? 'true' : undefined"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <slot />
  </aside>
  <div
    v-if="!isStatic && open && !disable"
    class="q-sidebar__backdrop"
    aria-hidden="true"
    @click="setOpen(false)"
  />
</template>
