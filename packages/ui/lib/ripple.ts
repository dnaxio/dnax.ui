// v-ripple — directive : onde « material ripple » au clic et au clavier,
// équivalent Quasar https://quasar.dev/vue-directives/material-ripple
//
// Usage :
//   <div v-ripple />                                      → onde depuis le point cliqué
//   <div v-ripple.center />                               → onde depuis le centre
//   <div v-ripple:primary />                              → couleur (token ou couleur CSS)
//   <div v-ripple="{ early: true, stop: true }" />        → déclenchement dès pointerdown
//   <div v-ripple="false" />                              → directive désactivée
//   <div v-ripple="{ keyCodes: [13, 32], color: '#f00' }" />
// modifiers : center | early | stop
//
// Le conteneur `.q-ripple` (position absolute, 100 %×100 %, overflow hidden) est
// injecté dans l'élément : pas besoin de lui imposer `overflow: hidden`. En
// revanche il faut un bloc conteneur → si `position` calculée vaut `static`,
// la directive pose `position: relative` (et restaure la valeur au démontage).

import { colorValue } from "./colors"

/** Options de `v-ripple` (les modifiers `.center` / `.early` / `.stop` ont le même effet) */
export interface RippleOptions {
  /** Déclenche l'onde dès `pointerdown` (au lieu du `click`), annulée si le geste devient un scroll/pan */
  early?: boolean
  /** Stoppe la propagation de l'événement déclencheur */
  stop?: boolean
  /** L'onde démarre au centre de l'élément au lieu du point d'interaction */
  center?: boolean
  /** Couleur de l'onde : token dnax.ui (`primary`, `negative`…) ou couleur CSS (`#f00`, `rgb()`, nom CSS) */
  color?: string
  /** Codes clavier déclenchant l'onde (défaut `[13, 32]` — Entrée, Espace) */
  keyCodes?: number | number[]
}

/** `false` désactive la directive ; un objet configure les options */
export type RippleValue = boolean | RippleOptions | undefined

/** Attente avant peinture (tactile : le temps que le navigateur tranche tap vs scroll) */
const ENTER_DELAY = 50
const TOUCH_ENTER_DELAY = 100
/** Onde pleine puis extinction */
const HOLD_MS = 250
const LEAVE_MS = 275
/** Anti-rebond du déclenchement clavier (répétition de touche) */
const KEY_THROTTLE = 300
/** Entrée / Espace */
const DEFAULT_KEY_CODES = [13, 32]

/** Éléments que le navigateur active nativement au clavier (le `click` suffit : pas de doublon) */
const NATIVE_ACTIVATION = "button, a[href], input[type='button'], input[type='submit'], input[type='reset']"

interface RippleHandle {
  /** Identifiant du pointeur tant que le geste peut encore devenir un clic (mode `early`) */
  pointerId: number | null
  /** Retire immédiatement l'onde (démontage) */
  abort: () => void
  /** Éteint l'onde en douceur (geste devenu scroll/pan) */
  cancel: () => void
}

interface RippleContext {
  enabled: boolean
  early: boolean
  stop: boolean
  center: boolean
  color?: string
  keyCodes: number[]
  keyTime: number
  /** 0 = aucun listener, 1 = mode clic, 2 = mode early */
  bound: 0 | 1 | 2
  ripples: RippleHandle[]
  /** Position inline d'origine (null = jamais touchée par la directive) */
  prevPosition: string | null
}

interface RippleInstance {
  ctx: RippleContext
  /** (Re)branche les listeners selon `enabled` / `early` */
  bind: () => void
  /** Débranche tout et restaure les styles touchés */
  dispose: () => void
}

interface RippleBinding {
  value?: unknown
  arg?: string
  modifiers?: Record<string, boolean>
}

type QElement = HTMLElement & { __qRipple?: RippleInstance }
type EventFlags = Event & { qSkipRipple?: boolean; qKeyEvent?: boolean }

/** Point d'interaction d'un événement souris / tactile / clavier */
const eventPoint = (evt: Event): { left: number; top: number } => {
  const e = evt as MouseEvent & { touches?: TouchList }
  const touch = e.touches?.[0]
  if (touch) return { left: touch.clientX, top: touch.clientY }
  if (typeof e.clientX === "number") return { left: e.clientX, top: e.clientY }
  return { left: 0, top: 0 }
}

const parseKeyCodes = (value: RippleOptions["keyCodes"]): number[] => {
  if (value === undefined) return [...DEFAULT_KEY_CODES]
  const list = (Array.isArray(value) ? value.flat() : [value]).map(Number)
  return list.filter((n) => Number.isFinite(n))
}

/** Un élément activable nativement produit déjà un `click` au clavier */
const hasNativeActivation = (el: HTMLElement): boolean => {
  try {
    return el.matches(NATIVE_ACTIVATION)
  } catch {
    return false
  }
}

/** Options effectives = valeur objet + modifiers + argument (couleur) */
const applyOptions = (ctx: RippleContext, binding: RippleBinding) => {
  const opts: RippleOptions = typeof binding.value === "object" && binding.value !== null
    ? (binding.value as RippleOptions)
    : {}
  const m = binding.modifiers ?? {}

  ctx.early = opts.early === true || m.early === true
  ctx.stop = opts.stop === true || m.stop === true
  ctx.center = opts.center === true || m.center === true
  ctx.color = opts.color ?? binding.arg
  ctx.keyCodes = parseKeyCodes(opts.keyCodes)
}

/** Crée et lance l'onde (conteneur `.q-ripple` + pastille `.q-ripple__inner`) */
const spawnRipple = (el: HTMLElement, ctx: RippleContext, evt: Event, forceCenter: boolean) => {
  if (ctx.stop) evt.stopPropagation()

  const rect = el.getBoundingClientRect()
  const diameter = Math.hypot(rect.width, rect.height)
  if (!diameter) return

  const radius = diameter / 2
  const point = eventPoint(evt)
  const centerX = (rect.width - diameter) / 2
  const centerY = (rect.height - diameter) / 2
  const fromCenter = ctx.center || forceCenter
  const x = fromCenter ? centerX : point.left - rect.left - radius
  const y = fromCenter ? centerY : point.top - rect.top - radius

  const node = document.createElement("span")
  node.className = "q-ripple"
  node.setAttribute("dir", "ltr")
  if (ctx.color) node.style.color = colorValue(ctx.color)

  const inner = document.createElement("span")
  inner.className = "q-ripple__inner"
  inner.style.width = `${diameter}px`
  inner.style.height = `${diameter}px`
  inner.style.transform = `translate(${x}px, ${y}px) scale(0.2)`
  inner.style.opacity = "0"

  node.append(inner)
  el.append(node)

  let timer: ReturnType<typeof setTimeout> | undefined
  // 0 = en attente, 1 = apparition, 2 = extinction
  let phase: 0 | 1 | 2 = 0

  const remove = () => {
    clearTimeout(timer)
    node.remove()
    const index = ctx.ripples.indexOf(handle)
    if (index !== -1) ctx.ripples.splice(index, 1)
  }

  const leave = () => {
    phase = 2
    inner.classList.remove("q-ripple__inner--enter")
    inner.classList.add("q-ripple__inner--leave")
    inner.style.opacity = "0"
    timer = setTimeout(remove, LEAVE_MS)
  }

  const enter = () => {
    phase = 1
    inner.classList.add("q-ripple__inner--enter")
    inner.style.transform = `translate(${centerX}px, ${centerY}px) scale(1)`
    inner.style.opacity = "0.2"
    timer = setTimeout(leave, HOLD_MS)
  }

  const handle: RippleHandle = {
    pointerId: evt.type === "pointerdown" ? (evt as PointerEvent).pointerId : null,
    abort() {
      clearTimeout(timer)
      node.remove()
    },
    cancel() {
      handle.pointerId = null
      if (phase === 2) return
      clearTimeout(timer)
      if (phase === 0) remove()
      else leave()
    },
  }

  ctx.ripples.push(handle)

  const isTouch = evt.type === "pointerdown" && (evt as PointerEvent).pointerType === "touch"
  timer = setTimeout(enter, isTouch ? TOUCH_ENTER_DELAY : ENTER_DELAY)
}

function setup(el: HTMLElement, binding: RippleBinding) {
  const ctx: RippleContext = {
    enabled: binding.value !== false,
    early: false,
    stop: false,
    center: false,
    keyCodes: [...DEFAULT_KEY_CODES],
    keyTime: 0,
    bound: 0,
    ripples: [],
    prevPosition: null,
  }
  applyOptions(ctx, binding)

  // Le conteneur d'onde est en `position: absolute` → il lui faut un bloc conteneur.
  const ensurePosition = () => {
    if (!ctx.enabled) return
    if (typeof getComputedStyle !== "function") return
    if (getComputedStyle(el).position !== "static") return
    if (ctx.prevPosition === null) ctx.prevPosition = el.style.position
    el.style.position = "relative"
  }
  ensurePosition()

  const onStart = (evt: Event) => {
    const e = evt as EventFlags & MouseEvent
    if (e.qSkipRipple) return
    // `detail === 0` : clic synthétisé au clavier (pas de coordonnées fiables) → onde centrée
    spawnRipple(el, ctx, evt, e.qKeyEvent === true || (evt.type === "click" && e.detail === 0))
  }

  const onKey = (evt: Event) => {
    const e = evt as EventFlags & KeyboardEvent
    if (e.qSkipRipple) return
    if (!ctx.keyCodes.includes(e.keyCode)) return
    // Sur un <button>/<a href>, le navigateur émet déjà un `click` (centré) : ne pas doubler
    if (hasNativeActivation(el)) return
    const now = Date.now()
    if (now - ctx.keyTime < KEY_THROTTLE) return
    ctx.keyTime = now
    spawnRipple(el, ctx, evt, true)
  }

  // Le geste ne peut plus devenir un clic (scroll/pan, ou pointeur sorti)
  const onCancel = (evt: Event) => {
    const e = evt as PointerEvent
    if (e.type === "pointerleave" && e.buttons === 0) return
    for (let i = ctx.ripples.length - 1; i >= 0; i--) {
      const ripple = ctx.ripples[i]
      if (ripple.pointerId === e.pointerId) ripple.cancel()
    }
  }

  const bind = () => {
    const mode: 0 | 1 | 2 = ctx.enabled ? (ctx.early ? 2 : 1) : 0
    if (mode === ctx.bound) return

    if (ctx.bound === 1) {
      el.removeEventListener("click", onStart)
      el.removeEventListener("keyup", onKey)
    } else if (ctx.bound === 2) {
      el.removeEventListener("pointerdown", onStart)
      el.removeEventListener("pointercancel", onCancel)
      el.removeEventListener("pointerleave", onCancel)
      el.removeEventListener("keydown", onKey)
    }

    if (mode === 1) {
      el.addEventListener("click", onStart)
      el.addEventListener("keyup", onKey)
    } else if (mode === 2) {
      el.addEventListener("pointerdown", onStart)
      el.addEventListener("pointercancel", onCancel)
      el.addEventListener("pointerleave", onCancel)
      el.addEventListener("keydown", onKey)
    }

    ctx.bound = mode
  }

  bind()

  ;(el as QElement).__qRipple = {
    ctx,
    bind,
    dispose() {
      ctx.ripples.forEach((ripple) => ripple.abort())
      ctx.ripples.length = 0
      ctx.enabled = false
      bind()
      if (ctx.prevPosition !== null) el.style.position = ctx.prevPosition
    },
  }
}

/** Directive `v-ripple` : <div v-ripple.center:primary /> */
export const vRipple = {
  mounted(el: HTMLElement, binding: RippleBinding) {
    setup(el, binding)
  },
  updated(el: HTMLElement, binding: RippleBinding) {
    const instance = (el as QElement).__qRipple
    if (!instance) return
    instance.ctx.enabled = binding.value !== false
    applyOptions(instance.ctx, binding)
    instance.bind()
  },
  unmounted(el: HTMLElement) {
    const instance = (el as QElement).__qRipple
    if (!instance) return
    instance.dispose()
    delete (el as QElement).__qRipple
  },
}
