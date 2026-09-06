// v-touch-hold — directive : détecte l'appui long (hold) sur un élément,
// tactile ET souris (modifier .mouse), équivalent Quasar
// https://quasar.dev/vue-directives/touch-hold
//
// Usage :
//   <div v-touch-hold="handler" />                  → 600ms, sensibilité 5/7px
//   <div v-touch-hold.mouse="{ time: 400, sensitivity: 6 }" />
//   <div v-touch-hold="'400:8:10'" />               → 400ms, 8px tactile, 10px souris
//   <div v-touch-hold="350" />
// modifiers : mouse (inclut la souris), capture / mouseCapture, stop, prevent,
// passive
//
// Détails du handler (compatible Quasar) :
//   { evt, position: { left, top }, duration }
// Après déclenchement, le geste est « consommé » : le click/touchend qui suit
// est supprimé (un appui long ne déclenche pas aussi un clic).

export interface TouchHoldDetails {
  evt: Event
  position: { left: number; top: number }
  duration: number
}

export type TouchHoldHandler = (details: TouchHoldDetails) => void

const DEFAULTS = { time: 600, touchSensitivity: 5, mouseSensitivity: 7 }

interface HoldOptions {
  handler: TouchHoldHandler
  time: number
  touchSensitivity: number
  mouseSensitivity: number
  mouse: boolean
  stop: boolean
  prevent: boolean
  capture: boolean
  passive: boolean
}

type QElement = HTMLElement & { __qTouchHoldCleanup?: () => void }

function parseValue(value: unknown): Partial<typeof DEFAULTS> {
  if (typeof value === "number") return { time: value }
  if (typeof value === "string") {
    const [t, touch, mouse] = value.split(":")
    const out: Partial<typeof DEFAULTS> = {}
    const num = Number(t)
    if (Number.isFinite(num)) out.time = num
    if (touch !== undefined) {
      const n = Number(touch)
      if (Number.isFinite(n)) out.touchSensitivity = n
    }
    if (mouse !== undefined) {
      const n = Number(mouse)
      if (Number.isFinite(n)) out.mouseSensitivity = n
    }
    return out
  }
  if (Array.isArray(value)) {
    const out: Partial<typeof DEFAULTS> = {}
    const t = Number(value[0])
    if (Number.isFinite(t)) out.time = t
    const touch = Number(value[1])
    if (Number.isFinite(touch)) out.touchSensitivity = touch
    const mouse = Number(value[2])
    if (Number.isFinite(mouse)) out.mouseSensitivity = mouse
    return out
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>
    const out: Partial<typeof DEFAULTS> = {}
    const t = Number(o.time ?? o.duration)
    if (Number.isFinite(t)) out.time = t
    const touch = Number(o.sensitivity ?? o.touchSensitivity)
    if (Number.isFinite(touch)) out.touchSensitivity = touch
    const mouse = Number(o.mouseSensitivity)
    if (Number.isFinite(mouse)) out.mouseSensitivity = mouse
    return out
  }
  return {}
}

export const vTouchHold = {
  mounted(el: HTMLElement, binding: { value?: unknown; modifiers?: Record<string, boolean> }) {
    const handler = binding.value
    if (typeof handler !== "function") {
      console.warn("[v-touch-hold] value doit être une fonction (handler)")
      return
    }
    const m = binding.modifiers ?? {}
    const parsed = parseValue(binding.value)
    const options: HoldOptions = {
      handler: handler as TouchHoldHandler,
      time: parsed.time ?? DEFAULTS.time,
      touchSensitivity: parsed.touchSensitivity ?? DEFAULTS.touchSensitivity,
      mouseSensitivity: parsed.mouseSensitivity ?? DEFAULTS.mouseSensitivity,
      mouse: !!m.mouse || !!m.mouseCapture,
      stop: !!m.stop,
      prevent: !!m.prevent,
      capture: !!m.capture || !!m.mouseCapture,
      passive: !!m.passive,
    }

    // Éviter scroll / context menu / sélection pendant l'appui
    el.style.touchAction = "none"
    el.style.userSelect = "none"
    ;(el as HTMLElement).style.webkitUserSelect = "none"

    let timer: ReturnType<typeof setTimeout> | undefined
    let pending = false
    let consumed = false
    let startX = 0
    let startY = 0
    let lastEvt: PointerEvent | null = null
    let startTime = 0

    const clearTimer = () => {
      if (timer) clearTimeout(timer)
      timer = undefined
    }

    const cancel = () => {
      clearTimer()
      pending = false
    }

    const finish = () => {
      clearTimer()
      if (!pending) return
      pending = false
      consumed = true
      const duration = Math.round(performance.now() - startTime)
      const evt = lastEvt
      if (evt) {
        options.handler({
          evt,
          position: { left: evt.clientX, top: evt.clientY },
          duration: options.time || duration,
        })
      }
      // Consomme la fin du geste : pas de click/touchend après un hold
      const onUp = (e: Event) => {
        if (options.prevent) e.preventDefault()
        if (options.stop) e.stopPropagation()
        window.removeEventListener("pointerup", onUp, true)
        window.removeEventListener("pointercancel", onCancelAfter, true)
        window.removeEventListener("click", onClick, true)
        window.removeEventListener("touchend", onUp, true)
      }
      const onClick = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        window.removeEventListener("click", onClick, true)
        window.removeEventListener("pointerup", onUp, true)
        window.removeEventListener("touchend", onUp, true)
      }
      const onCancelAfter = () => {
        window.removeEventListener("pointerup", onUp, true)
        window.removeEventListener("pointercancel", onCancelAfter, true)
        window.removeEventListener("click", onClick, true)
      }
      window.addEventListener("pointerup", onUp, true)
      window.addEventListener("pointercancel", onCancelAfter, true)
      window.addEventListener("touchend", onUp, true)
      window.addEventListener("click", onClick, true)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (pending || consumed) return
      if (e.pointerType === "mouse" && !options.mouse) return
      if (options.prevent && !options.passive) e.preventDefault()
      pending = true
      startX = e.clientX
      startY = e.clientY
      startTime = performance.now()
      lastEvt = e
      const sensitivity = e.pointerType === "mouse" ? options.mouseSensitivity : options.touchSensitivity
      timer = setTimeout(finish, options.time)

      const onMove = (ev: PointerEvent) => {
        if (!pending) return
        if (Math.abs(ev.clientX - startX) > sensitivity || Math.abs(ev.clientY - startY) > sensitivity) {
          cancel()
          cleanup()
        }
      }
      const onUpEarly = () => cancel()
      const cleanup = () => {
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerup", onUpEarly)
        el.removeEventListener("pointercancel", onUpEarly)
      }
      el.addEventListener("pointermove", onMove, { passive: options.passive })
      el.addEventListener("pointerup", onUpEarly)
      el.addEventListener("pointercancel", onUpEarly)
      ;(el as any).__qHoldCleanupEarly = cleanup
    }

    const onContext = (e: Event) => {
      if (pending || consumed) e.preventDefault()
    }

    const capture = options.capture
    el.addEventListener("pointerdown", onPointerDown, { capture, passive: options.passive })
    el.addEventListener("contextmenu", onContext, { capture })

    ;(el as QElement).__qTouchHoldCleanup = () => {
      el.removeEventListener("pointerdown", onPointerDown, { capture } as any)
      el.removeEventListener("contextmenu", onContext, { capture } as any)
      ;(el as any).__qHoldCleanupEarly?.()
      clearTimer()
      el.style.touchAction = ""
      el.style.userSelect = ""
      el.style.webkitUserSelect = ""
    }
  },
  unmounted(el: HTMLElement) {
    ;(el as QElement).__qTouchHoldCleanup?.()
    delete (el as QElement).__qTouchHoldCleanup
  },
}
