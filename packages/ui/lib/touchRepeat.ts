// v-touch-repeat — directive : déclenche un handler en boucle tant que
// l'élément est pressé (appui long répété), équivalent Quasar
// https://quasar.dev/vue-directives/touch-repeat
//
// Usage :
//   <button v-touch-repeat.mouse="onRepeat">…</button>
//   <button v-touch-repeat.mouse="{ delay: 500, interval: 100 }">…</button>
//   <button v-touch-repeat.mouse="'500:100'">…</button>
// modifiers : mouse (inclut la souris), capture / mouseCapture, stop, prevent,
// passive
//
// Détails du handler : { evt, count, elapsed }

export interface TouchRepeatDetails {
  evt: Event
  /** Nombre d'appels (1 = premier, après le délai) */
  count: number
  /** Temps écoulé depuis le pointerdown (ms) */
  elapsed: number
}

export type TouchRepeatHandler = (details: TouchRepeatDetails) => void

const DEFAULTS = { delay: 600, interval: 150 }

interface RepeatOptions {
  handler: TouchRepeatHandler
  delay: number
  interval: number
  mouse: boolean
  stop: boolean
  prevent: boolean
  capture: boolean
  passive: boolean
}

type QElement = HTMLElement & { __qTouchRepeatCleanup?: () => void }

function parseValue(value: unknown): { delay?: number; interval?: number } {
  if (typeof value === "number") return { interval: value }
  if (typeof value === "string") {
    const [delay, interval] = value.split(":")
    const out: { delay?: number; interval?: number } = {}
    const d = Number(delay)
    if (Number.isFinite(d)) out.delay = d
    const i = Number(interval)
    if (Number.isFinite(i)) out.interval = i
    return out
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>
    const out: { delay?: number; interval?: number } = {}
    const d = Number(o.delay)
    if (Number.isFinite(d)) out.delay = d
    const i = Number(o.interval)
    if (Number.isFinite(i)) out.interval = i
    return out
  }
  return {}
}

export const vTouchRepeat = {
  mounted(el: HTMLElement, binding: { value?: unknown; modifiers?: Record<string, boolean> }) {
    const handler = binding.value
    if (typeof handler !== "function") {
      console.warn("[v-touch-repeat] value doit être une fonction (handler)")
      return
    }
    const m = binding.modifiers ?? {}
    const parsed = parseValue(binding.value)
    const options: RepeatOptions = {
      handler: handler as TouchRepeatHandler,
      delay: parsed.delay ?? DEFAULTS.delay,
      interval: parsed.interval ?? DEFAULTS.interval,
      mouse: !!m.mouse || !!m.mouseCapture,
      stop: !!m.stop,
      prevent: !!m.prevent,
      capture: !!m.capture || !!m.mouseCapture,
      passive: !!m.passive,
    }

    el.style.touchAction = "none"

    let active = false
    let count = 0
    let startTime = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let intervalTimer: ReturnType<typeof setInterval> | undefined

    const stop = () => {
      active = false
      if (timer) clearTimeout(timer)
      if (intervalTimer) clearInterval(intervalTimer)
      timer = undefined
      intervalTimer = undefined
    }

    const tick = () => {
      count++
      options.handler({
        evt: lastEvt ?? new Event("touch-repeat"),
        count,
        elapsed: Math.round(performance.now() - startTime),
      })
    }

    let lastEvt: Event | null = null

    const onPointerDown = (e: PointerEvent) => {
      if (active) return
      if (e.pointerType === "mouse" && !options.mouse) return
      if (options.prevent && !options.passive) e.preventDefault()
      if (options.stop) e.stopPropagation()
      active = true
      count = 0
      startTime = performance.now()
      lastEvt = e
      timer = setTimeout(() => {
        tick()
        intervalTimer = setInterval(tick, options.interval)
      }, options.delay)
    }

    const onPointerUp = (e: PointerEvent) => {
      lastEvt = e
      stop()
    }

    const capture = options.capture
    el.addEventListener("pointerdown", onPointerDown, { capture, passive: options.passive })
    el.addEventListener("pointerup", onPointerUp, { capture })
    el.addEventListener("pointercancel", onPointerUp, { capture })
    el.addEventListener("pointerleave", onPointerUp, { capture })

    ;(el as QElement).__qTouchRepeatCleanup = () => {
      el.removeEventListener("pointerdown", onPointerDown, { capture } as any)
      el.removeEventListener("pointerup", onPointerUp, { capture } as any)
      el.removeEventListener("pointercancel", onPointerUp, { capture } as any)
      el.removeEventListener("pointerleave", onPointerUp, { capture } as any)
      stop()
      el.style.touchAction = ""
    }
  },
  unmounted(el: HTMLElement) {
    ;(el as QElement).__qTouchRepeatCleanup?.()
    delete (el as QElement).__qTouchRepeatCleanup
  },
}
