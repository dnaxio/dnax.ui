// fixedLayout — offset automatique des barres fixed (q-header, q-back-header)
// et du q-page qui les suit.
//
// Problème : les barres fixed sortent du flux (position: fixed) → le contenu de
// q-page passe dessous. Ce module :
//  - q-page (mode "page") reçoit un padding-top = hauteur cumulée des barres
//    fixed qui le précèdent (le contenu ne se retrouve plus sous le header)
//  - chaque barre fixed suivante (mode "bar") s'empile sous la précédente (top)
//
// Les barres fixed sont cherchées dans TOUT le sous-arbre de l'enveloppe q-app
// (pas seulement parmi les frères directs) et ordonnées par position dans le
// document : l'imbrication intermédiaire (wrapper, rendu conditionnel…) est
// gérée. Les hauteurs sont observées (ResizeObserver) et l'ajout/suppression de
// barres aussi (MutationObserver sur la racine).
import { onBeforeUnmount, onMounted, watch } from "vue"
import type { Ref } from "vue"

export const FIXED_BAR_SELECTOR = ".q-header--fixed, .q-back-header--fixed"

/** Racine du layout : le .q-app le plus proche, sinon le parent direct. */
function layoutRoot(el: HTMLElement): HTMLElement | null {
  return el.closest(".q-app") ?? el.parentElement
}

/**
 * Hauteur cumulée des barres fixed qui précèdent `el` dans l'ordre du document,
 * sous la même enveloppe q-app. `el` lui-même (cas mode "bar") est exclu.
 */
export function fixedBarsHeightBefore(el: HTMLElement): number {
  const root = layoutRoot(el)
  if (!root) return 0
  const bars = Array.from(root.querySelectorAll<HTMLElement>(FIXED_BAR_SELECTOR))
  let total = 0
  for (const bar of bars) {
    if (bar === el) continue
    // DOCUMENT_POSITION_FOLLOWING = la barre est AVANT el dans le document
    if (bar.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
      total += bar.offsetHeight
    }
  }
  return total
}

/** Toutes les barres fixed sous l'enveloppe q-app (pour l'observation). */
function fixedBarsInRoot(el: HTMLElement): HTMLElement[] {
  const root = layoutRoot(el)
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FIXED_BAR_SELECTOR))
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
  let mo: MutationObserver | null = null

  const sync = () => {
    const node = el.value
    if (!node || typeof ResizeObserver === "undefined") return
    const bars = fixedBarsInRoot(node)
    ro?.disconnect()
    ro = new ResizeObserver(apply)
    bars.forEach((b) => ro!.observe(b))
  }

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

  onMounted(() => {
    apply()
    sync()
    // Barres ajoutées/retirées dynamiquement (rendu conditionnel) → re-synchronise
    const root = el.value ? layoutRoot(el.value) : null
    if (root && typeof MutationObserver !== "undefined") {
      mo = new MutationObserver(() => {
        sync()
        apply()
      })
      mo.observe(root, { childList: true, subtree: true })
    }
    window.addEventListener("resize", apply)
  })
  onBeforeUnmount(() => {
    ro?.disconnect()
    mo?.disconnect()
    window.removeEventListener("resize", apply)
  })

  // Ré-applique/efface quand la condition change (ex. bascule fixed)
  watch(enabled, (v) => {
    if (v) apply()
    else clear()
  })

  return apply
}
