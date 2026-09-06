// v-close — directive : ferme l'overlay (dialog, bottom sheet, …) le plus
// proche au clic (équivalent Quasar v-close-popup).
// Les overlays s'enregistrent en posant el.__qClose sur leur élément racine
// (markOverlayClose) ; la directive remonte depuis l'élément cliqué.

interface QCloseMarker extends HTMLElement {
  __qClose?: () => void
  __qVClose?: () => void
}

/** Marque un élément comme « overlay fermable » (posé par QDialog, QBottomSheet…) */
export function markOverlayClose(el: HTMLElement | null, close: () => void) {
  if (!el) return
  ;(el as QCloseMarker).__qClose = close
}

/** Remonte jusqu'à l'overlay le plus proche portant __qClose */
function closestOverlay(el: Element): QCloseMarker | null {
  let node: Element | null = el
  while (node) {
    const marker = node as QCloseMarker
    if (typeof marker.__qClose === "function") return marker
    node = node.parentElement
  }
  return null
}

/** Ferme l'overlay parent le plus proche de `el` */
export function closeParentOverlay(el: Element) {
  closestOverlay(el)?.__qClose?.()
}

/** Directive : <q-btn v-close> → ferme le dialog/sheet parent au clic.
 *  v-close="false" désactive la fermeture. */
export const vClose = {
  mounted(el: HTMLElement, binding: { value?: unknown }) {
    const onClick = () => {
      if (binding.value === false) return
      closeParentOverlay(el)
    }
    el.addEventListener("click", onClick)
    ;(el as QCloseMarker).__qVClose = onClick
  },
  unmounted(el: HTMLElement) {
    const fn = (el as QCloseMarker).__qVClose
    if (fn) el.removeEventListener("click", fn)
  },
}
