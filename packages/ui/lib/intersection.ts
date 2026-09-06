// v-intersection — directive : appelle un handler quand l'élément entre /
// sort du viewport (Intersection Observer), équivalent Quasar
// https://quasar.dev/vue-directives/intersection
//
// Usage :
//   <div v-intersection="onEnter">…</div>
//   <div v-intersection.once="onFirstEnter">…</div>
//   <div v-intersection="{ handler, cfg: { rootMargin: '0px', threshold: 0.2 } }">…</div>
//   <div v-intersection="false">…</div>   (désactive l'observation)
//
// Le handler reçoit un IntersectionObserverEntry. Les éléments partageant les
// mêmes options (cfg) utilisent le même IntersectionObserver sous le capot.

export type IntersectionValue =
  | ((entry: IntersectionObserverEntry) => void)
  | { handler: (entry: IntersectionObserverEntry) => void; cfg?: IntersectionObserverInit }
  | false
  | undefined
  | null

type PoolEntry = {
  key: string
  observer: IntersectionObserver
  elements: Set<Element>
}

type QElement = HTMLElement & {
  __qIntersection?: {
    key: string
    observer: IntersectionObserver
    handler: (e: IntersectionObserverEntry) => void
    once: boolean
    raw: IntersectionValue
  }
}

const pool = new Map<string, PoolEntry>()

function getPoolEntry(cfg: IntersectionObserverInit): PoolEntry {
  const key = JSON.stringify([
    cfg.rootMargin ?? "0px",
    cfg.threshold ?? 0,
    cfg.root === null ? null : cfg.root instanceof Element ? (cfg.root as Element).id || "" : String(cfg.root),
  ])
  let entry = pool.get(key)
  if (!entry) {
    const elements = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const rec = (e.target as QElement).__qIntersection
        if (!rec) continue
        if (rec.once && e.isIntersecting) {
          rec.handler(e)
          unobserve(e.target as QElement)
          continue
        }
        rec.handler(e)
      }
    }, cfg)
    entry = { key, observer, elements }
    pool.set(key, entry)
  }
  return entry
}

function unobserve(el: QElement) {
  const rec = el.__qIntersection
  if (!rec) return
  const entry = pool.get(rec.key)
  el.__qIntersection = undefined
  rec.observer.unobserve(el)
  if (entry) {
    entry.elements.delete(el)
    if (entry.elements.size === 0) {
      entry.observer.disconnect()
      pool.delete(rec.key)
    }
  }
}

function apply(el: HTMLElement, value: IntersectionValue, once = false) {
  const target = el as QElement
  if (target.__qIntersection) unobserve(target)
  if (!value) return

  let handler: (entry: IntersectionObserverEntry) => void
  let cfg: IntersectionObserverInit = { root: null, rootMargin: "0px", threshold: 0 }

  if (typeof value === "function") {
    handler = value
  }
  else if (typeof value === "object") {
    handler = value.handler
    if (value.cfg) cfg = { ...value.cfg }
  }
  else {
    return
  }

  const entry = getPoolEntry(cfg)
  target.__qIntersection = { key: entry.key, observer: entry.observer, handler, once, raw: value }
  entry.elements.add(el)
  entry.observer.observe(el)
}

export const vIntersection = {
  mounted(el: HTMLElement, binding: { value?: IntersectionValue; modifiers?: Record<string, boolean> }) {
    apply(el, binding.value, !!binding.modifiers?.once)
  },
  updated(el: HTMLElement, binding: { value?: IntersectionValue; modifiers?: Record<string, boolean> }) {
    const rec = (el as QElement).__qIntersection
    if (rec && rec.raw === binding.value) return
    apply(el, binding.value, !!binding.modifiers?.once)
  },
  unmounted(el: HTMLElement) {
    unobserve(el as QElement)
  },
}
