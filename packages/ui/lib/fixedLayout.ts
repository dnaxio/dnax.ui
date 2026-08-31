// fixedLayout — offset automatique des barres fixed (q-header, q-back-header,
// q-footer) et du q-page qui les entoure.
//
// Problème : les barres fixed sortent du flux (position: fixed) → le contenu de
// q-page passe dessous. Ce module :
//  - q-page (mode "page") reçoit un padding-top = hauteur cumulée des barres
//    fixed HAUT qui le précèdent ET un padding-bottom = hauteur cumulée des
//    barres fixed BAS qui le suivent (le contenu n'est masqué ni en haut ni en
//    bas au scroll)
//  - chaque barre fixed suivante (mode "bar") s'empile sous la précédente (top)
//  - chaque barre fixed basse (mode "bar-bottom") s'empile au-dessus de la
//    suivante (bottom)
//
// Les barres fixed sont cherchées dans TOUT le sous-arbre de l'enveloppe q-app
// (pas seulement parmi les frères directs) et ordonnées par position dans le
// document : l'imbrication intermédiaire (wrapper, rendu conditionnel…) est
// gérée. Les hauteurs sont observées (ResizeObserver) et l'ajout/suppression de
// barres aussi (MutationObserver sur la racine).
import { onBeforeUnmount, onMounted, watch } from "vue"
import type { Ref } from "vue"

/** Barres fixed en haut de l'écran */
export const FIXED_TOP_SELECTOR = ".q-header--fixed, .q-back-header--fixed"
/** Barres fixed en bas de l'écran */
export const FIXED_BOTTOM_SELECTOR = ".q-footer--fixed"
/** Toutes les barres fixed (haut + bas) */
export const FIXED_BAR_SELECTOR = `${FIXED_TOP_SELECTOR}, ${FIXED_BOTTOM_SELECTOR}`

/** Racine du layout : le .q-app le plus proche, sinon le parent direct. */
function layoutRoot(el: HTMLElement): HTMLElement | null {
  return el.closest(".q-app") ?? el.parentElement
}

/**
 * Hauteur cumulée des barres fixed HAUT qui précèdent `el` dans l'ordre du
 * document, sous la même enveloppe q-app. `el` lui-même (cas mode "bar") est exclu.
 */
export function fixedBarsHeightBefore(el: HTMLElement): number {
  const root = layoutRoot(el)
  if (!root) return 0
  const bars = Array.from(root.querySelectorAll<HTMLElement>(FIXED_TOP_SELECTOR))
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

/**
 * Hauteur cumulée des barres fixed BAS qui SUIVENT `el` dans l'ordre du
 * document, sous la même enveloppe q-app. `el` lui-même (cas mode "bar-bottom")
 * est exclu.
 */
export function fixedBarsHeightAfter(el: HTMLElement): number {
  const root = layoutRoot(el)
  if (!root) return 0
  const bars = Array.from(root.querySelectorAll<HTMLElement>(FIXED_BOTTOM_SELECTOR))
  let total = 0
  for (const bar of bars) {
    if (bar === el) continue
    // DOCUMENT_POSITION_PRECEDING = la barre est APRÈS el dans le document
    if (bar.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING) {
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
 * Applique l'offset lié aux barres fixed qui entourent `el` :
 * - mode "page"       : padding-top = barres HAUT précédentes,
 *                       padding-bottom = barres BAS suivantes
 *                       (+ variables --q-page-offset / --q-page-offset-bottom)
 * - mode "bar"        : top = hauteur cumulée (empilement des barres fixed HAUT)
 * - mode "bar-bottom" : bottom = hauteur cumulée (empilement des footers fixed
 *                       depuis le bas de l'écran)
 *
 * `enabled` permet de n'activer que dans certaines conditions (ex. props.fixed).
 */
export function useFixedBarOffset(
  el: Ref<HTMLElement | null>,
  mode: "page" | "bar" | "bar-bottom",
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
    if (mode === "page") {
      const top = fixedBarsHeightBefore(node)
      const bottom = fixedBarsHeightAfter(node)
      node.style.setProperty("--q-page-offset", top ? `${top}px` : "0px")
      node.style.setProperty("--q-page-offset-bottom", bottom ? `${bottom}px` : "0px")
      node.style.paddingTop = top ? `${top}px` : ""
      node.style.paddingBottom = bottom ? `${bottom}px` : ""
    }
    else if (mode === "bar") {
      const h = fixedBarsHeightBefore(node)
      node.style.top = h ? `${h}px` : ""
    }
    else {
      const h = fixedBarsHeightAfter(node)
      node.style.bottom = h ? `${h}px` : ""
    }
  }

  const clear = () => {
    const node = el.value
    if (!node) return
    if (mode === "page") {
      node.style.removeProperty("--q-page-offset")
      node.style.removeProperty("--q-page-offset-bottom")
      node.style.paddingTop = ""
      node.style.paddingBottom = ""
    }
    else if (mode === "bar") {
      node.style.top = ""
    }
    else {
      node.style.bottom = ""
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
