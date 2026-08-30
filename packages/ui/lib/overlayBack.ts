// overlayBack — ferme l'overlay ouvert quand l'utilisateur appuie sur « retour »
// (bouton back du navigateur, geste iOS, bouton back Android via Capacitor).
//
// Le principe : chaque composant overlay (dialog, bottom sheet, action sheet,
// image preview, sidebar, select/date/country en mode sheet/modal/dialog…)
// s'enregistre dans une pile LIFO tant qu'il est ouvert, via le composable
// useOverlayBack(). Un handler global écoute popstate en phase de capture (avant
// le listener de vue-router) : si un overlay est ouvert, il restaure l'URL
// courante (history.pushState) et ferme l'overlay au lieu de naviguer.
//
// Installation automatique côté Nuxt (module) ou manuelle :
//   import { installOverlayBackHandler } from "@dnax/ui"
//   installOverlayBackHandler() // ou avec un router : installOverlayBackHandler(router)
import { onBeforeUnmount, watch } from "vue"
import type { Ref } from "vue"
import type { Router } from "vue-router"

export interface OverlayHandle {
  /** Ferme l'overlay (set v-model=false, close(), dismiss()…) */
  close: () => void
  /** Nom de l'overlay pour le debug (ex. "QDialog") */
  label?: string
}

// — Pile LIFO des overlays ouverts (module-level, client-side) —
const overlayStack: OverlayHandle[] = []

/** Enregistre un overlay ouvert — retourne un unregister */
export function registerOverlay(handle: OverlayHandle): () => void {
  overlayStack.push(handle)
  return () => unregisterOverlay(handle)
}

export function unregisterOverlay(handle: OverlayHandle) {
  const idx = overlayStack.indexOf(handle)
  if (idx !== -1) overlayStack.splice(idx, 1)
}

export function hasOpenOverlays(): boolean {
  return overlayStack.length > 0
}

/** Ferme le dernier overlay ouvert (le plus haut de la pile) */
export function closeTopmostOverlay(): boolean {
  const top = overlayStack[overlayStack.length - 1]
  if (!top) return false
  top.close()
  return true
}

/**
 * Composable pour les composants overlay : s'enregistre dans la pile quand
 * `open` devient vrai, se désenregistre quand il se ferme ou à l'unmount.
 *
 *   useOverlayBack(open, () => { open.value = false }, "QDialog")
 */
export function useOverlayBack(
  open: Ref<boolean>,
  close: () => void,
  label?: string,
) {
  let unregister: (() => void) | null = null

  const sync = (v: boolean) => {
    if (v) {
      unregister?.()
      unregister = registerOverlay({ close, label })
    }
    else {
      unregister?.()
      unregister = null
    }
  }

  watch(open, sync, { immediate: true })
  onBeforeUnmount(() => unregister?.())
}

// — Handler global « retour » (popstate) —
let installed = false

/**
 * Installe le handler qui ferme l'overlay ouvert sur « retour ».
 * - Sans router : restaure l'URL courante (pushState) pour annuler le back.
 * - Avec router : en plus, une garde beforeEach bloque la navigation quand le
 *   popstate a été consommé par un overlay.
 *
 * Idempotent (un seul handler par session). Retourne une fonction de désinstallation.
 */
export function installOverlayBackHandler(router?: Router): () => void {
  if (typeof window === "undefined" || installed) return () => {}

  let consumedPop = false

  const onPopState = () => {
    if (!hasOpenOverlays()) return
    // Annule le back du navigateur : on re-pousse l'URL courante avant que le
    // listener (bubble) de vue-router ne lise la nouvelle URL → navigation no-op.
    consumedPop = true
    history.pushState(null, "", window.location.href)
    closeTopmostOverlay()
  }
  // Phase de capture : s'exécute avant le listener bubble du router.
  window.addEventListener("popstate", onPopState, true)

  let removeGuard = () => {}
  if (router) {
    removeGuard = router.beforeEach(() => {
      if (consumedPop) {
        consumedPop = false
        return false // navigation annulée (l'URL a déjà été restaurée)
      }
      return true
    })
  }

  installed = true

  return () => {
    window.removeEventListener("popstate", onPopState, true)
    removeGuard()
    installed = false
  }
}
