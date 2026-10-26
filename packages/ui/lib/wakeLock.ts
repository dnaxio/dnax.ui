// $q.wakeLock — Screen Wake Lock façon Quasar (`AppWakeLockPlugin`).
// https://quasar.dev/quasar-plugins/app-wake-lock
//
// - `request()` garde l'écran allumé ; `release()` rend la main au délai système.
// - `isActive` ne vaut `true` que **tant que le verrou est réellement tenu** : le
//   navigateur le relâche de lui-même quand la page est masquée (onglet, veille…).
//   La demande est alors **mémorisée** et rejouée au retour de visibilité, jusqu'à
//   `release()`.
// - `isCapable` vaut `false` au serveur **et au premier rendu client**, puis prend sa
//   valeur réelle après hydratation (sinon le `v-if` d'un bouton « garder l'écran
//   allumé » divergerait du HTML SSR).
// - Sans API (navigateur non supporté), les méthodes rejettent `Not capable` ; au
//   serveur elles se résolvent sans effet.
//
// Logique pure (`isWakeLockCapable`, `isDocumentVisible`, `shouldReacquire`) et fabrique
// `createWakeLock` à dépendances injectables : testable sans DOM.
import { reactive, ref } from "vue"

/** Sentinel minimal du Screen Wake Lock API (injectable pour les tests). */
export interface WakeLockSentinelLike {
  /** Passe à `true` quand le navigateur relâche le verrou de lui-même */
  released?: boolean
  release: () => Promise<void>
  addEventListener?: (type: "release", listener: () => void) => void
  removeEventListener?: (type: "release", listener: () => void) => void
}

/** Sous-ensemble de `navigator.wakeLock`. */
export interface WakeLockApiLike {
  request: (type: "screen") => Promise<WakeLockSentinelLike>
}

/** Sous-ensemble de `document` utilisé pour suivre la visibilité. */
export interface WakeLockVisibilityLike {
  visibilityState?: string
  addEventListener: (type: "visibilitychange", listener: () => void) => void
  removeEventListener?: (type: "visibilitychange", listener: () => void) => void
}

export interface QWakeLock {
  /** Un verrou est réellement tenu (réactif, lecture sans `.value`) */
  readonly isActive: boolean
  /** Screen Wake Lock disponible — `false` au serveur et avant hydratation */
  readonly isCapable: boolean
  /** Demande le verrou (idempotent). Rejette si non supporté (`Not capable`). */
  request: () => Promise<void>
  /** Relâche le verrou et cesse les redemandes automatiques */
  release: () => Promise<void>
  /** Détache l'écouteur de visibilité (instance de test / usage hors singleton) */
  destroy: () => void
}

export interface WakeLockOptions {
  /** API Screen Wake Lock (défaut : `navigator.wakeLock` ; `null` si absente) */
  api?: WakeLockApiLike | null
  /** Document pour la visibilité (défaut : `document` ; `null` au serveur) */
  visibility?: WakeLockVisibilityLike | null
  /** Force le mode serveur : aucune API lue, méthodes sans effet */
  server?: boolean
  /**
   * Diffère `isCapable` après l'hydratation (défaut : `true` côté client) — évite un
   * décalage entre le HTML SSR (`isCapable = false`) et le premier rendu client.
   */
  deferCapability?: boolean
}

/** `true` seulement si l'API Screen Wake Lock est exposée par le navigateur. */
export function isWakeLockCapable(api?: WakeLockApiLike | null): boolean {
  return !!api && typeof api.request === "function"
}

/** Une page est considérée visible sauf si le document dit explicitement `hidden`. */
export function isDocumentVisible(visibility?: WakeLockVisibilityLike | null): boolean {
  return visibility?.visibilityState !== "hidden"
}

/** Faut-il redemander le verrou ? (demandé, page visible, et rien de tenu) */
export function shouldReacquire(wanted: boolean, visible: boolean, held: boolean): boolean {
  return wanted && visible && !held
}

function notCapableError(): Error {
  const message = "Not capable"
  return typeof DOMException === "function"
    ? new DOMException(message, "NotSupportedError")
    : new Error(message)
}

/**
 * Crée le gestionnaire de verrou. Sans `visibility`, aucune écoute n'est posée ;
 * en mode serveur, `request()` / `release()` se résolvent sans effet.
 */
export function createWakeLock(options: WakeLockOptions = {}): QWakeLock {
  const server = options.server ?? typeof window === "undefined"
  const api = "api" in options
    ? (options.api ?? null)
    : typeof navigator !== "undefined"
      ? ((navigator as Navigator & { wakeLock?: WakeLockApiLike }).wakeLock ?? null)
      : null
  const visibility = "visibility" in options
    ? (options.visibility ?? null)
    : typeof document !== "undefined"
      ? document
      : null

  const active = ref(false)
  const capable = ref(false)

  // `isCapable` n'est révélé qu'après le rendu SSR/hydratation (cf. en-tête).
  if (!server) {
    if (options.deferCapability === false) {
      capable.value = isWakeLockCapable(api)
    }
    else {
      setTimeout(() => {
        capable.value = isWakeLockCapable(api)
      }, 0)
    }
  }

  /** L'utilisateur veut garder l'écran allumé (survit aux relâchements du navigateur). */
  let wanted = false
  let sentinel: WakeLockSentinelLike | null = null
  let pending: Promise<void> | null = null

  const bindRelease = (s: WakeLockSentinelLike) => {
    s.addEventListener?.("release", () => {
      if (sentinel !== s) return
      sentinel = null
      active.value = false
    })
  }

  const request = async (): Promise<void> => {
    if (server) return
    if (!isWakeLockCapable(api)) throw notCapableError()

    wanted = true
    if (sentinel && sentinel.released !== true) {
      active.value = true
      return
    }
    if (pending) return pending

    pending = (async () => {
      const s = await api!.request("screen")
      if (!wanted) {
        // `release()` a été appelé pendant la demande : ne pas reprendre le verrou.
        await s.release().catch(() => {})
        return
      }
      sentinel = s
      active.value = true
      bindRelease(s)
    })()

    try {
      await pending
    }
    finally {
      pending = null
    }
  }

  const release = async (): Promise<void> => {
    wanted = false
    const s = sentinel
    sentinel = null
    active.value = false
    if (s) await s.release().catch(() => {})
  }

  const onVisibilityChange = () => {
    if (sentinel?.released === true) {
      sentinel = null
      active.value = false
    }
    const held = sentinel !== null && sentinel.released !== true
    if (!shouldReacquire(wanted, isDocumentVisible(visibility), held)) return
    // Refus possible (batterie faible, iframe…) : la prochaine visibilité réessaiera.
    void request().catch(() => {})
  }

  visibility?.addEventListener("visibilitychange", onVisibilityChange)

  return reactive({
    get isActive() {
      return active.value
    },
    get isCapable() {
      return capable.value
    },
    request,
    release,
    destroy: () => {
      visibility?.removeEventListener?.("visibilitychange", onVisibilityChange)
    },
  })
}

/** Singleton exposé sous `$q.wakeLock` (et importable directement depuis `@dnax/ui`). */
export const wakeLock: QWakeLock = createWakeLock()
