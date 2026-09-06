// v-touch-swipe — directive : détecte le « swipe » (glissement rapide puis
// relâchement), équivalent Quasar
// https://quasar.dev/vue-directives/touch-swipe
//
// Usage :
//   <div v-touch-swipe.horizontal.mouse="onSwipe">…</div>
//   <div v-touch-swipe="{ distance: 40, duration: 300 }">…</div>
// modifiers : horizontal | vertical | up | down | left | right (filtres de
// direction), mouse (inclut la souris), capture / mouseCapture, stop, prevent,
// passive
//
// Détails du handler : { evt, direction, distance: { x, y }, duration,
// speed: { x, y } }

export type SwipeDirection = "up" | "down" | "left" | "right"

export interface TouchSwipeDetails {
  evt: PointerEvent
  direction: SwipeDirection
  /** Distance totale (px), par axe (signée) */
  distance: { x: number; y: number }
  duration: number
  /** Vitesse finale (px/s), par axe */
  speed: { x: number; y: number }
}

export type TouchSwipeHandler = (details: TouchSwipeDetails) => void

const DEFAULTS = { distance: 50, duration: 300 }

interface SwipeOptions {
  handler: TouchSwipeHandler
  distance: number
  duration: number
  allowHorizontal: boolean
  allowVertical: boolean
  allowUp: boolean
  allowDown: boolean
  allowLeft: boolean
  allowRight: boolean
  mouse: boolean
  stop: boolean
  prevent: boolean
  capture: boolean
  passive: boolean
}

type QElement = HTMLElement & { __qTouchSwipeCleanup?: () => void }

function parseValue(value: unknown): { distance?: number; duration?: number } {
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>
    const out: { distance?: number; duration?: number } = {}
    const d = Number(o.distance)
    if (Number.isFinite(d)) out.distance = d
    const t = Number(o.duration)
    if (Number.isFinite(t)) out.duration = t
    return out
  }
  return {}
}

function axisAllowed(o: SwipeOptions, direction: SwipeDirection) {
  if (o.allowHorizontal) return direction === "left" || direction === "right"
  if (o.allowVertical) return direction === "up" || direction === "down"
  switch (direction) {
    case "up": return o.allowUp
    case "down": return o.allowDown
    case "left": return o.allowLeft
    case "right": return o.allowRight
  }
}

export const vTouchSwipe = {
  mounted(el: HTMLElement, binding: { value?: unknown; modifiers?: Record<string, boolean> }) {
    const handler = binding.value
    if (typeof handler !== "function") {
      console.warn("[v-touch-swipe] value doit être une fonction (handler)")
      return
    }
    const m = binding.modifiers ?? {}
    const parsed = parseValue(binding.value)
    const options: SwipeOptions = {
      handler: handler as TouchSwipeHandler,
      distance: parsed.distance ?? DEFAULTS.distance,
      duration: parsed.duration ?? DEFAULTS.duration,
      allowHorizontal: !!m.horizontal,
      allowVertical: !!m.vertical,
      allowUp: !!m.up,
      allowDown: !!m.down,
      allowLeft: !!m.left,
      allowRight: !!m.right,
      mouse: !!m.mouse || !!m.mouseCapture,
      stop: !!m.stop,
      prevent: !!m.prevent,
      capture: !!m.capture || !!m.mouseCapture,
      passive: !!m.passive,
    }

    if (options.prevent) el.style.touchAction = "none"
    else if (options.allowHorizontal && !options.allowVertical) el.style.touchAction = "pan-y"
    else if (options.allowVertical && !options.allowHorizontal) el.style.touchAction = "pan-x"
    else el.style.touchAction = "auto"

    let startX = 0
    let startY = 0
    let startTime = 0
    let lastX = 0
    let lastY = 0
    let lastTime = 0
    let tracking = false

    const guard = (e: Event) => {
      if (options.stop) e.stopPropagation()
      if (options.prevent) e.preventDefault()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (tracking) return
      if (e.pointerType === "mouse" && !options.mouse) return
      guard(e)
      tracking = true
      startX = lastX = e.clientX
      startY = lastY = e.clientY
      startTime = lastTime = performance.now()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!tracking) return
      lastX = e.clientX
      lastY = e.clientY
      lastTime = performance.now()
      guard(e)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!tracking) return
      tracking = false
      const now = performance.now()
      const duration = now - startTime
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const direction: SwipeDirection =
        Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up")
      if (!axisAllowed(options, direction)) return
      const along = direction === "left" || direction === "right" ? Math.abs(dx) : Math.abs(dy)
      if (along < options.distance) return
      if (duration > options.duration) return
      const elapsed = Math.max(now - lastTime, 1)
      const instSpeed = {
        x: (lastX - startX) / elapsed * 1000,
        y: (lastY - startY) / elapsed * 1000,
      }
      options.handler({
        evt: e,
        direction,
        distance: { x: dx, y: dy },
        duration,
        speed: { x: Math.round(instSpeed.x), y: Math.round(instSpeed.y) },
      })
    }

    const onCancel = () => { tracking = false }
    const capture = options.capture
    el.addEventListener("pointerdown", onPointerDown, { capture, passive: options.passive })
    el.addEventListener("pointermove", onPointerMove, { capture, passive: options.passive })
    el.addEventListener("pointerup", onPointerUp, { capture })
    el.addEventListener("pointercancel", onCancel, { capture })

    ;(el as QElement).__qTouchSwipeCleanup = () => {
      el.removeEventListener("pointerdown", onPointerDown, { capture } as any)
      el.removeEventListener("pointermove", onPointerMove, { capture } as any)
      el.removeEventListener("pointerup", onPointerUp, { capture } as any)
      el.removeEventListener("pointercancel", onCancel, { capture } as any)
      el.style.touchAction = ""
    }
  },
  unmounted(el: HTMLElement) {
    ;(el as QElement).__qTouchSwipeCleanup?.()
    delete (el as QElement).__qTouchSwipeCleanup
  },
}
