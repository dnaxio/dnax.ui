// fixedLayout — offset automatique des barres fixed (q-header, q-back-header)
// et du q-page qui les suit.
//
// Problème : les barres fixed sortent du flux (position: fixed) → le contenu de
// q-page passe dessous. Ce module :
//  - q-page (mode "page") reçoit un padding-top = hauteur cumulée des barres
//    fixed frères qui le précèdent (le contenu ne se retrouve plus sous le header)
//  - chaque barre fixed suivante (mode "bar") s'empile sous la précédente (top)
//
// Les barres fixed sont détectées par le sélecteur FIXED_BAR_SELECTOR parmi les
// frères du même parent ; la hauteur est observée (ResizeObserver) pour suivre
// les changements de taille (contenu, safe-area).
import { onBeforeUnmount, onMounted, watch } from "vue"
import type { Ref } from "vue"

export const FIXED_BAR_SELECTOR = ".q-header--fixed, .q-back-header--fixed"

/** Hauteur cumulée des barres fixed qui précèdent `el` (frères du même parent) */
export function fixedBarsHeightBefore(el: HTMLElement): number {
  const parent = el.parentElement
  if (!parent) return 0
  let total = 0
  for (const child of parent.children) {
    if (child === el) break
    if (child instanceof HTMLElement && child.matches(FIXED_BAR_SELECTOR)) {
      total += child.offsetHeight
    }
  }
  return total
}

/** Barres fixed frères de `el` (pour l'observation ResizeObserver) */
function fixedBarSiblings(el: HTMLElement): HTMLElement[] {
  const parent = el.parentElement
  if (!parent) return []
  return Array.from(parent.children).filter(
    (c): c is HTMLElement => c instanceof HTMLElement && c.matches(FIXED_BAR_SELECTOR),
  )
}

/**
 * Applique l'offset lié aux barres fixed qui précèdent `el` :
 * - mode "page" : padding-top = hauteur cumulée (q-page) + variable --q-page-offset
 * - mode "bar"  : top = hauteur cumulée (empilement des barres fixed)
 *
 * `enabled` permet de n'activer que dans certaines conditions (ex. props.fixed).
 */
export function useFixedBarOffset(
  el: Ref<HTMLElement | null>,
  mode: "page" | "bar",
  enabled: () => boolean = () => true,
) {
  let ro: ResizeObserver | null = null

  const apply = () => {
    const node = el.value
    if (!node || !enabled()) return
    const h = fixedBarsHeightBefore(node)
    if (mode === "page") {
      node.style.setProperty("--q-page-offset", h ? `${h}px` : "0px")
      node.style.paddingTop = h ? `${h}px` : ""
    }
    else {
      node.style.top = h ? `${h}px` : ""
    }
  }

  const clear = () => {
    const node = el.value
    if (!node) return
    if (mode === "page") {
      node.style.removeProperty("--q-page-offset")
      node.style.paddingTop = ""
    }
    else {
      node.style.top = ""
    }
  }

  const observe = () => {
    const node = el.value
    if (!node || typeof ResizeObserver === "undefined") return
    const bars = fixedBarSiblings(node)
    if (!bars.length) return
    ro = new ResizeObserver(apply)
    bars.forEach((b) => ro!.observe(b))
  }

  onMounted(() => {
    apply()
    observe()
    window.addEventListener("resize", apply)
  })
  onBeforeUnmount(() => {
    ro?.disconnect()
    window.removeEventListener("resize", apply)
  })

  // Ré-applique/efface quand la condition change (ex. bascule fixed)
  watch(enabled, (v) => {
    if (v) apply()
    else clear()
  })

  return apply
}
