// Grid breakpoints — configurables via les CSS vars --q-grid-bp-* (:root par défaut).
// Lues au runtime et converties en matchMedia (pas de var() dans @media → compatible lightningcss).
import { onBeforeUnmount, ref } from "vue"
import type { Ref } from "vue"

const DEFAULTS: Record<string, number> = { sm: 600, md: 1024, lg: 1440, xl: 1920 }

const readBreakpoint = (name: string): number => {
  if (typeof window === "undefined" || typeof getComputedStyle === "undefined")
    return DEFAULTS[name] ?? 0
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(`--q-grid-bp-${name}`)
    .trim()
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : (DEFAULTS[name] ?? 0)
}

export interface QBreakpointState {
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
}

/** Breakpoints actifs (matchMedia) — valeurs lues des CSS vars --q-grid-bp-* */
export function useGridBreakpoints(): Ref<QBreakpointState> {
  const state = ref<QBreakpointState>({ sm: false, md: false, lg: false, xl: false })
  const handlers: [MediaQueryList, () => void][] = []
  if (typeof window !== "undefined" && typeof matchMedia !== "undefined") {
    for (const name of ["sm", "md", "lg", "xl"] as const) {
      const mq = window.matchMedia(`(min-width: ${readBreakpoint(name)}px)`)
      const apply = () => {
        state.value = { ...state.value, [name]: mq.matches }
      }
      mq.addEventListener("change", apply)
      apply()
      handlers.push([mq, apply])
    }
  }
  onBeforeUnmount(() => {
    for (const [mq, apply] of handlers) mq.removeEventListener("change", apply)
  })
  return state
}
