<script setup lang="ts">
// QSwipeCell — cellule que l'on glisse horizontalement pour révéler des actions
// (API Vant SwipeCell) : <q-swipe-cell :right-width="160"><template #right>…</template>…</q-swipe-cell>.
// Drag vers la gauche → panneau droit, vers la droite → panneau gauche (snap à la moitié).
// Props : left-width, right-width, disabled, name, before-close.
// Events : open / close / click ({ name, position }). Méthodes : open, close.
import { onBeforeUnmount, ref, watch } from "vue"

type SwipePosition = "left" | "right"

interface Props {
  /** Largeur du panneau d'actions de gauche, en px (0 = aucun) */
  leftWidth?: number
  /** Largeur du panneau d'actions de droite, en px (0 = aucun) */
  rightWidth?: number
  /** Désactive le glissement */
  disabled?: boolean
  /** Bloque le glissement quand les actions sont affichées (on ferme par clic) */
  lockOnOpen?: boolean
  /** Identifiant (retourné dans les events, pour la coordination) */
  name?: string | number
  /** Hook avant fermeture : retourner false (ou Promise false) garde la cellule ouverte */
  beforeClose?: (args: { name?: string | number; position: SwipePosition | "" }) => boolean | Promise<boolean>
}

const props = withDefaults(defineProps<Props>(), {
  leftWidth: 0,
  rightWidth: 0,
  disabled: false,
  lockOnOpen: false,
  name: "",
  beforeClose: undefined,
})

const emit = defineEmits<{
  open: [payload: { name?: string | number; position: SwipePosition }]
  close: [payload: { name?: string | number; position: SwipePosition }]
  click: [payload: { name?: string | number; position: SwipePosition | "" }]
}>()

const rootEl = ref<HTMLElement | null>(null)
const wrapperEl = ref<HTMLElement | null>(null)

const offset = ref(0)
const opened = ref<SwipePosition | "">("")
let dragging = false
let moved = false
let startX = 0
let startOffset = 0

const maxLeft = () => props.leftWidth || 0
const maxRight = () => props.rightWidth || 0

/** Applique la translation au wrapper (avec transition) */
const applyOffset = (v: number, transition = true) => {
  offset.value = v
  const el = wrapperEl.value
  if (!el) return
  if (transition) el.style.transition = "transform 0.3s ease"
  el.style.transform = `translateX(${v}px)`
  if (transition) {
    setTimeout(() => el.style.removeProperty("transition"), 320)
  }
  const position: SwipePosition | "" = v < 0 ? "right" : v > 0 ? "left" : ""
  if (position !== opened.value) {
    const from = opened.value
    opened.value = position
    if (from) emit("close", { name: props.name, position: from })
    if (position) emit("open", { name: props.name, position })
  }
}

const onPointerDown = (e: PointerEvent) => {
  if (props.disabled) return
  // lock-on-open : quand les actions sont affichées, le glissement est bloqué
  if (props.lockOnOpen && opened.value) return
  dragging = true
  moved = false
  startX = e.clientX
  startOffset = offset.value
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  if (wrapperEl.value) wrapperEl.value.style.removeProperty("transition")
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragging) return
  const dx = e.clientX - startX
  if (!moved && Math.abs(dx) > 4) moved = true
  if (!moved) return
  const next = Math.min(maxLeft(), Math.max(-maxRight(), startOffset + dx))
  offset.value = next // <— indispensable : le snap (pointerup) se base dessus
  if (wrapperEl.value) wrapperEl.value.style.transform = `translateX(${next}px)`
}

const onPointerUp = () => {
  if (!dragging) return
  dragging = false
  if (moved) {
    // snap : ouvre le côté si on a dépassé la moitié, sinon revient
    const target =
      offset.value <= -maxRight() / 2
        ? -maxRight()
        : offset.value >= maxLeft() / 2
          ? maxLeft()
          : 0
    applyOffset(target)
  }
}

const close = async () => {
  if (offset.value === 0) return
  if (props.beforeClose) {
    const ok = await props.beforeClose({ name: props.name, position: opened.value })
    if (ok === false) return
  }
  applyOffset(0)
}

/** Fermeture forcée, sans passer par before-close (clic sur la cellule) */
const forceClose = () => applyOffset(0)

const open = (position: SwipePosition) => {
  const w = position === "left" ? maxLeft() : maxRight()
  if (!w) return
  applyOffset(position === "left" ? w : -w)
}

const onClickCell = () => {
  if (opened.value) {
    // Le clic sur la cellule referme TOUJOURS (before-close ne s'applique qu'aux actions)
    forceClose()
  } else {
    emit("click", { name: props.name, position: "" })
  }
}

const onClickAction = (position: SwipePosition) => {
  emit("click", { name: props.name, position })
  close()
}

defineExpose({ open, close })

// — Clic extérieur : referme la cellule ouverte (clic en dehors des actions) —
const onDocPointerDown = (e: PointerEvent) => {
  if (!opened.value) return
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) {
    forceClose()
  }
}

watch(opened, (v) => {
  if (v) document.addEventListener("pointerdown", onDocPointerDown)
  else document.removeEventListener("pointerdown", onDocPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocPointerDown)
  if (wrapperEl.value) wrapperEl.value.style.removeProperty("transition")
})
</script>

<template>
  <div ref="rootEl" class="q-swipe-cell">
    <div class="q-swipe-cell__left" :style="{ width: `${leftWidth}px` }" @click="onClickAction('left')">
      <slot name="left" />
    </div>
    <div class="q-swipe-cell__right" :style="{ width: `${rightWidth}px` }" @click="onClickAction('right')">
      <slot name="right" />
    </div>
    <div
      ref="wrapperEl"
      class="q-swipe-cell__wrapper"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click="onClickCell"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.q-swipe-cell {
  position: relative;
  overflow: hidden;
}

/* panneaux d'actions : à leur place DANS le conteneur, derrière le wrapper
   (qui les couvre) — le glissement du wrapper les révèle */
.q-swipe-cell__left,
.q-swipe-cell__right {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: stretch;
  z-index: 0;
}
.q-swipe-cell__left {
  left: 0;
}
.q-swipe-cell__right {
  right: 0;
}

/* contenu de la cellule : glisse horizontalement AU-DESSUS des panneaux */
.q-swipe-cell__wrapper {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  touch-action: pan-y; /* scroll vertical OK, glissement horizontal capté */
  cursor: grab;
}
</style>
