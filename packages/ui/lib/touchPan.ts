// v-touch-pan — directive : détecte les gestes « pan » (glisser) sur un
// élément, tactile ET souris (modifier .mouse), équivalent Quasar
// https://quasar.dev/vue-directives/touch-pan
//
// Usage : <div v-touch-pan.horizontal.mouse.prevent="onPan" />
//   modifiers : horizontal | vertical | up | down | left | right (filtres de
//   direction), mouse (inclut la souris), prevent (bloque le scroll natif),
//   stop, capture, passive, mouseCapture
//
// Détails passés au handler (compatible Quasar) :
//   { evt, position: { top, left }, direction, delta: { x, y },
//     distance: { x, y }, duration, speed: { x, y },
//     isFirst, isFinal, isVertical, isHorizontal }

export interface PanPosition {
  top: number
  left: number
}

export interface PanDelta {
  x: number
  y: number
}

export type PanDirection = "up" | "down" | "left" | "right"

export interface PanDetails {
  evt: PointerEvent
  position: PanPosition
  direction: PanDirection
  delta: PanDelta
  distance: PanDelta
  duration: number
  speed: PanDelta
  isFirst: boolean
  isFinal: boolean
  isVertical: boolean
  isHorizontal: boolean
}

export type TouchPanHandler = (details: PanDetails) => void

interface PanState {
  pointerId: number
  startX: number
  startY: number
  lastX: number
  lastY: number
  startTime: number
  lastTime: number
  axis: "horizontal" | "vertical" | null
  panning: boolean
}

const PAN_MIN = 4 // seuil avant de déclarer le pan (px)

interface TouchPanOptions {
  handler: TouchPanHandler
  allowHorizontal: boolean
  allowVertical: boolean
  allowUp: boolean
  allowDown: boolean
  allowLeft: boolean
  allowRight: boolean
  mouse: boolean
  prevent: boolean
  stop: boolean
  capture: boolean
  passive: boolean
  mouseCapture: boolean
}

type QElement = HTMLElement & { __qTouchPanCleanup?: () => void }

function axisAllowed(options: TouchPanOptions, direction: PanDirection) {
  if (options.allowHorizontal) return direction === "left" || direction === "right"
  if (options.allowVertical) return direction === "up" || direction === "down"
  switch (direction) {
    case "up": return options.allowUp
    case "down": return options.allowDown
    case "left": return options.allowLeft
    case "right": return options.allowRight
  }
}

function parseDirection(dx: number, dy: number): PanDirection {
  return Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up")
}

function applyPrevent(e: Event, options: TouchPanOptions, active: boolean) {
  if (options.stop) e.stopPropagation()
  if (options.prevent && active) e.preventDefault()
}

export const vTouchPan = {
  mounted(el: HTMLElement, binding: { value?: unknown; modifiers?: Record<string, boolean> }) {
    const handler = binding.value
    if (typeof handler !== "function") {
      console.warn("[v-touch-pan] value doit être une fonction (handler)")
      return
    }
    const m = binding.modifiers ?? {}
    const options: TouchPanOptions = {
      handler: handler as TouchPanHandler,
      allowHorizontal: !!m.horizontal,
      allowVertical: !!m.vertical,
      allowUp: !!m.up,
      allowDown: !!m.down,
      allowLeft: !!m.left,
      allowRight: !!m.right,
      mouse: !!m.mouse || !!m.mouseCapture,
      prevent: !!m.prevent,
      stop: !!m.stop,
      capture: !!m.capture || !!m.mouseCapture,
      passive: !!m.passive,
      mouseCapture: false,
    }
    options.mouseCapture = !!m.mouseCapture

    let state: PanState | null = null

    // touch-action : laisser le scroll natif quand on ne capture qu'un axe
    if (options.prevent) el.style.touchAction = "none"
    else if (options.allowHorizontal && !options.allowVertical) el.style.touchAction = "pan-y"
    else if (options.allowVertical && !options.allowHorizontal) el.style.touchAction = "pan-x"
    else el.style.touchAction = options.allowUp || options.allowDown || options.allowLeft || options.allowRight ? "pan-y pan-x" : "auto"

    const onPointerDown = (e: PointerEvent) => {
      if (state) return
      if (e.pointerType === "mouse" && !options.mouse) return
      applyPrevent(e, options, false)
      state = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        startTime: performance.now(),
        lastTime: performance.now(),
        axis: null,
        panning: false,
      }
      try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId) } catch { /* ignore */ }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!state || state.pointerId !== e.pointerId) return
      const dx = e.clientX - state.startX
      const dy = e.clientY - state.startY
      const deltaX = e.clientX - state.lastX
      const deltaY = e.clientY - state.lastY
      const now = performance.now()
      const duration = now - state.startTime

      if (!state.panning) {
        if (Math.abs(dx) < PAN_MIN && Math.abs(dy) < PAN_MIN) return
        const direction = parseDirection(dx, dy)
        if (!axisAllowed(options, direction)) return
        state.axis = direction === "left" || direction === "right" ? "horizontal" : "vertical"
        state.panning = true
        applyPrevent(e, options, true)
        state.lastX = e.clientX
        state.lastY = e.clientY
        state.lastTime = now
        emit(state, e, direction, { x: 0, y: 0 }, { x: dx, y: dy }, duration, true)
        return
      }

      const direction = state.axis === "horizontal" ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up")
      applyPrevent(e, options, true)
      state.lastX = e.clientX
      state.lastY = e.clientY
      state.lastTime = now
      emit(state, e, direction, { x: deltaX, y: deltaY }, { x: dx, y: dy }, duration, false)
    }

    const onPointerEnd = (e: PointerEvent) => {
      if (!state || state.pointerId !== e.pointerId) return
      const dx = e.clientX - state.startX
      const dy = e.clientY - state.startY
      const duration = performance.now() - state.startTime
      if (state.panning) {
        const direction = state.axis === "horizontal" ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up")
        emit(state, e, direction, { x: 0, y: 0 }, { x: dx, y: dy }, duration, false, true)
      }
      state = null
    }

    const onPointerCancel = (e: PointerEvent) => {
      if (state && state.pointerId === e.pointerId) state = null
    }

    const emit = (
      s: PanState,
      evt: PointerEvent,
      direction: PanDirection,
      delta: PanDelta,
      distance: PanDelta,
      duration: number,
      isFirst: boolean,
      isFinal = false,
    ) => {
      const elapsed = Math.max(duration, 1)
      options.handler({
        evt,
        position: { top: evt.clientY, left: evt.clientX },
        direction,
        delta,
        distance,
        duration,
        speed: { x: Math.abs(distance.x) / elapsed * 1000, y: Math.abs(distance.y) / elapsed * 1000 },
        isFirst,
        isFinal,
        isVertical: s.axis === "vertical",
        isHorizontal: s.axis === "horizontal",
      })
    }

    const capture = options.capture
    el.addEventListener("pointerdown", onPointerDown, { capture, passive: options.passive })
    el.addEventListener("pointermove", onPointerMove, { capture, passive: options.passive })
    el.addEventListener("pointerup", onPointerEnd, { capture })
    el.addEventListener("pointercancel", onPointerCancel, { capture })

    ;(el as QElement).__qTouchPanCleanup = () => {
      el.removeEventListener("pointerdown", onPointerDown, { capture } as any)
      el.removeEventListener("pointermove", onPointerMove, { capture } as any)
      el.removeEventListener("pointerup", onPointerEnd, { capture } as any)
      el.removeEventListener("pointercancel", onPointerCancel, { capture } as any)
      el.style.touchAction = ""
    }
  },
  unmounted(el: HTMLElement) {
    ;(el as QElement).__qTouchPanCleanup?.()
    delete (el as QElement).__qTouchPanCleanup
  },
}
