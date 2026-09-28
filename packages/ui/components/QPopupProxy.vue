<script lang="ts">
// QPopupProxy — proxy de popup façon Quasar : le contenu du slot par défaut est
// rendu dans un PANNEAU ancré à l'élément parent sur grand écran, et dans un
// DIALOGUE centré sur écran étroit — même contenu, même API dans les deux cas.
//
// <q-btn label="Actions" @click="proxy?.show()">
//   <q-popup-proxy ref="proxy" position="bottom-end">
//     <q-list>…</q-list>
//   </q-popup-proxy>
// </q-btn>
//
// Comme QTooltip, le proxy n'a PAS de déclencheur propre : il rend une ancre
// invisible DANS la cible (display:none) et retrouve ainsi son élément parent —
// même après le Teleport du panneau vers <body> (qui couperait le lien DOM).

/**
 * Placement du panneau autour du parent : côté principal + alignement sur l'axe
 * perpendiculaire — mêmes valeurs que QBtnActions / QBtnDropdown.
 */
export type PopupProxyPosition =
  | "bottom-start" | "bottom-end" | "bottom"
  | "top-start" | "top-end" | "top"
  | "left-start" | "left-end" | "left"
  | "right-start" | "right-end" | "right"
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import type { StyleValue } from "vue"
import { cn } from "../lib/utils"
import QDialog from "./QDialog.vue"

interface Props {
  /** Ouvert (v-model) ; sinon état interne piloté par show() / hide() / toggle() */
  modelValue?: boolean
  /** Largeur de fenêtre (px) EN DESSOUS de laquelle le panneau devient un dialogue — défaut 599 */
  breakpoint?: number
  /** Placement du panneau autour du parent — défaut "bottom-end" */
  position?: PopupProxyPosition
  /** Distance entre le panneau et le parent, en px — défaut 4 */
  offset?: number
  /** Le clic extérieur / Échap ne ferment pas le popup */
  persistent?: boolean
  /** Classes attribuées au panneau téléporté (en plus de `q-popup-proxy__panel`) */
  contentClass?: string
  /** Style(s) du panneau téléporté — PRIORITAIRE sur le style calculé (placement) */
  contentStyle?: StyleValue
  /** Thème sombre */
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  breakpoint: 599,
  position: "bottom-end",
  offset: 4,
  persistent: false,
  contentClass: "",
  contentStyle: "",
  dark: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  show: []
  hide: []
}>()

// Multi-racines (ancre + Teleport ou dialogue) : Vue ne peut pas hériter les
// attributs tout seul. Ils sont posés sur l'ancre, seule racine toujours présente.
defineOptions({ inheritAttrs: false })

// — Ouverture contrôlée / interne —
// Détection du v-model par les PROPS RÉELLEMENT PASSÉES (vnode.props) : une prop
// Boolean non fournie vaut false (pas undefined) → `modelValue !== undefined`
// serait TOUJOURS contrôlé et le proxy ne s'ouvrirait jamais sans v-model.
const instance = getCurrentInstance()
const controlled = computed(() => {
  const p = instance?.vnode.props
  return !!(p && ("modelValue" in p || "onUpdate:modelValue" in p))
})

const internalOpen = ref(false)
const isOpen = computed(() => (controlled.value ? props.modelValue : internalOpen.value))

const setOpen = (v: boolean) => {
  if (controlled.value) emit("update:modelValue", v)
  else internalOpen.value = v
}

// — Bascule large / étroit —
// Valeur identique serveur/client (1024) puis mise à jour au montage : aucun
// mismatch d'hydratation (le popup est de toute façon fermé au prerender).
const windowWidth = ref(1024)
const isWide = computed(() => windowWidth.value >= props.breakpoint)

// — Ancre & éléments —
const anchorEl = ref<HTMLElement | null>(null)
const parentEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const dialogEl = ref<HTMLElement | null>(null)

// ═════════ Positionnement (fixed, téléporté) ═════════
// Placement par « point d'ancrage » (top/left fixed) + décalage par translation en
// % de la taille du panneau (−100% = bord opposé, −50% = centré) — même logique que
// QBtnActions, aucun calcul de largeur/hauteur nécessaire. Le clamp n'intervient
// qu'une fois le panneau mesuré : il décale alors le point d'ancrage en px pour
// garder le panneau dans le viewport.
const PAD = 8
const panelPos = ref({ top: 0, left: 0, transform: "none" })

const placePanel = () => {
  const parent = parentEl.value
  if (!parent || typeof document === "undefined") return
  const rect = parent.getBoundingClientRect()
  const [main, alt] = props.position.split("-") as [
    "bottom" | "top" | "left" | "right",
    "start" | "end" | undefined,
  ]
  const off = props.offset
  const midX = (rect.left + rect.right) / 2
  const midY = (rect.top + rect.bottom) / 2

  let top = 0
  let left = 0
  let tx = "0%"
  let ty = "0%"

  if (main === "bottom" || main === "top") {
    // Axe horizontal : bord gauche (start), bord droit (end) ou centre
    if (alt === "start") left = rect.left
    else if (alt === "end") { left = rect.right; tx = "-100%" }
    else { left = midX; tx = "-50%" }
    if (main === "bottom") top = rect.bottom + off
    else { top = rect.top - off; ty = "-100%" }
  }
  else {
    // Axe vertical : haut (start), bas (end) ou centre
    if (alt === "start") top = rect.top
    else if (alt === "end") { top = rect.bottom; ty = "-100%" }
    else { top = midY; ty = "-50%" }
    if (main === "right") left = rect.right + off
    else { left = rect.left - off; tx = "-100%" }
  }

  // Clamp viewport : seulement si le panneau est déjà rendu (taille connue)
  const panel = panelEl.value
  if (panel) {
    const pw = panel.offsetWidth
    const ph = panel.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    const dx = tx === "-100%" ? -pw : tx === "-50%" ? -pw / 2 : 0
    const dy = ty === "-100%" ? -ph : ty === "-50%" ? -ph / 2 : 0
    const clampedX = Math.min(Math.max(left + dx, PAD), Math.max(PAD, vw - pw - PAD))
    const clampedY = Math.min(Math.max(top + dy, PAD), Math.max(PAD, vh - ph - PAD))
    left += clampedX - (left + dx)
    top += clampedY - (top + dy)
  }

  panelPos.value = {
    top,
    left,
    transform: tx === "0%" && ty === "0%" ? "none" : `translate(${tx}, ${ty})`,
  }
}

const panelStyle = computed<StyleValue>(() => ({
  top: `${panelPos.value.top}px`,
  left: `${panelPos.value.left}px`,
  transform: panelPos.value.transform,
}))

// — Suivi (resize / scroll) tant que le panneau ancré est ouvert —
let tracking = false
const startTracking = () => {
  if (tracking || typeof window === "undefined") return
  tracking = true
  window.addEventListener("resize", placePanel)
  window.addEventListener("scroll", placePanel, true)
}
const stopTracking = () => {
  if (!tracking || typeof window === "undefined") return
  tracking = false
  window.removeEventListener("resize", placePanel)
  window.removeEventListener("scroll", placePanel, true)
}

// — Focus : premier élément focusable à l'ouverture, restauration à la fermeture —
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
let lastFocused: HTMLElement | null = null

const focusFirst = (container: HTMLElement | null) => {
  if (!container) return
  const el = container.querySelector<HTMLElement>(FOCUSABLE)
  ;(el ?? container).focus({ preventScroll: true })
}

const restoreFocus = () => {
  const el = lastFocused
  lastFocused = null
  if (el && typeof document !== "undefined" && document.contains(el)) el.focus({ preventScroll: true })
}

// — Cycle ouverture / fermeture (commun aux deux rendus) —
const onOpened = async () => {
  if (typeof document === "undefined") return
  lastFocused = (document.activeElement as HTMLElement | null) ?? null
  await nextTick()
  if (isWide.value) {
    startTracking()
    placePanel()
    await nextTick() // 2ᵉ passage : taille du panneau connue → clamp viewport
    placePanel()
    focusFirst(panelEl.value)
  }
  else {
    focusFirst(dialogEl.value)
  }
  emit("show")
}

const onClosed = () => {
  stopTracking()
  emit("hide")
  restoreFocus()
}

watch(isOpen, (v, old) => {
  if (v) onOpened()
  else if (old) onClosed()
})

// Fenêtre redimensionnée pendant l'ouverture : bascule de rendu + repositionnement
watch(isWide, async (wide) => {
  if (!isOpen.value) return
  if (wide) {
    await nextTick()
    startTracking()
    placePanel()
    await nextTick()
    placePanel()
    focusFirst(panelEl.value)
  }
  else {
    stopTracking()
    await nextTick()
    focusFirst(dialogEl.value)
  }
})

const onWindowResize = () => {
  windowWidth.value = window.innerWidth
}

// — Fermeture : clic extérieur (phase de CAPTURE) et Échap — sauf `persistent` —
// Le rendu étroit est un QDialog : il gère lui-même backdrop / Échap (via persistent).
const onDocMousedown = (e: MouseEvent) => {
  if (!isOpen.value || !isWide.value || props.persistent) return
  const target = e.target as Node
  if (parentEl.value?.contains(target) || panelEl.value?.contains(target)) return
  setOpen(false)
}

const onDocKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value || !isWide.value || props.persistent) return
  if (e.key !== "Escape") return
  e.preventDefault()
  setOpen(false)
}

// — Méthodes publiques —
const show = () => setOpen(true)
const hide = () => setOpen(false)
const toggle = () => (isOpen.value ? hide() : show())

defineExpose({ show, hide, toggle })

onMounted(() => {
  // L'ancre (span invisible rendu DANS la cible) donne l'élément parent, même
  // après le Teleport du panneau vers <body>.
  parentEl.value = anchorEl.value?.parentElement ?? null
  if (typeof window !== "undefined") {
    windowWidth.value = window.innerWidth
    window.addEventListener("resize", onWindowResize)
  }
  if (typeof document !== "undefined") {
    // Phase de CAPTURE : sinon un `@mousedown.stop` parent (contenu de QDialog,
    // QDataGrid…) bloque l'événement avant `document` → popup jamais fermé.
    document.addEventListener("mousedown", onDocMousedown, true)
    document.addEventListener("keydown", onDocKeydown)
  }
  if (isOpen.value) onOpened()
})

onBeforeUnmount(() => {
  stopTracking()
  if (typeof window !== "undefined") window.removeEventListener("resize", onWindowResize)
  if (typeof document !== "undefined") {
    document.removeEventListener("mousedown", onDocMousedown, true)
    document.removeEventListener("keydown", onDocKeydown)
  }
})
</script>

<template>
  <!-- Ancre invisible DANS la cible : référence pour retrouver l'élément parent. -->
  <span
    ref="anchorEl"
    class="q-popup-proxy__anchor"
    aria-hidden="true"
    style="display: none"
    v-bind="$attrs"
  />

  <!-- Grand écran (≥ breakpoint) : panneau ancré au parent, téléporté dans <body> -->
  <Teleport v-if="isWide" to="body">
    <Transition name="q-popup">
      <div
        v-if="isOpen"
        ref="panelEl"
        class="q-popup-proxy__panel"
        :class="[dark && 'dark', contentClass]"
        :style="[panelStyle, contentStyle]"
        role="dialog"
        tabindex="-1"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>

  <!-- Écran étroit : même contenu rendu dans un QDialog (transition du dialog) -->
  <QDialog
    v-else
    :model-value="isOpen"
    :persistent="persistent"
    :content-class="cn('q-popup-proxy__dialog-content', contentClass)"
    :content-style="contentStyle"
    @update:model-value="setOpen"
  >
    <div ref="dialogEl" class="q-popup-proxy__dialog">
      <slot />
    </div>
  </QDialog>
</template>

<style scoped>
/* Panneau ancré (grand écran) — téléporté dans <body>, donc position: fixed et
   couche « menus téléportés » (--q-z-menu), au-dessus des overlays modaux. */
.q-popup-proxy__panel {
  position: fixed;
  z-index: var(--q-z-menu, 3200);
  min-width: 160px;
  padding: 4px;
  background-color: var(--card, #fff);
  color: var(--foreground, #1d1d1d);
  border: 1px solid var(--border, rgb(0 0 0 / 0.12));
  border-radius: var(--radius, var(--q-radius, 6px));
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.15);
  outline: none;
}

/* Mode sombre : le panneau est téléporté hors du conteneur du provider → on couvre
   à la fois l'ancêtre `.dark` (html) et la classe `dark` posée par la prop. */
.dark .q-popup-proxy__panel,
.q-popup-proxy__panel.dark {
  background-color: var(--card, #161b22);
  color: var(--foreground, #e6edf3);
  border-color: var(--border, rgb(255 255 255 / 0.12));
}

/* Contenu du dialogue (écran étroit) — surface/ombre fournies par QDialog. */
.q-popup-proxy__dialog {
  color: var(--foreground);
}
</style>
