// $q.network — état de la connexion réseau (API Quasar-style, SSR-safe).
//
// Source unique : `navigator.onLine` + événements `online` / `offline` de `window`.
// L'objet exposé se lit **sans `.value`** (`$q.network.online`), donc directement dans
// un template, et reste **réactif** (ses getters lisent une ref interne).
//
// Le serveur n'a pas d'état réseau : au SSR `online` vaut `true` (pas de bannière
// « hors ligne » fantôme). Côté client, l'état réel de `navigator.onLine` est lu au
// chargement du module, avant hydratation — deux rendus ne diffèrent que si l'appareil
// est réellement hors ligne (comportement de `useOnline` de VueUse).
//
// La logique pure (`resolveOnline`, `onlineAfterEvent`) et la fabrique `createNetwork`
// (cible d'événements injectable) sont testables sans DOM.
import { reactive, ref } from "vue"

/** Sous-ensemble de `navigator` utilisé (injectable pour les tests). */
export interface NetworkNavigator {
  onLine?: boolean
}

/** Cible des événements `online` / `offline` (`window` en production, objet factice en test). */
export interface NetworkEventTarget {
  addEventListener: (type: string, listener: (event: { type: string }) => void) => void
  removeEventListener?: (type: string, listener: (event: { type: string }) => void) => void
}

export interface QNetwork {
  /** Connecté au réseau — booléen réactif, se lit **sans `.value`** */
  readonly online: boolean
  /** Inversé de `online` (`v-if="$q.network.offline"`) */
  readonly offline: boolean
  /** Re-lit `navigator.onLine` (retour au premier plan…) et met à jour l'état */
  refresh: () => boolean
  /**
   * Abonnement aux passages `"online"` / `"offline"` (transitions réelles seulement).
   * Renvoie la fonction de désabonnement.
   */
  on: (type: NetworkEvent, cb: () => void) => () => void
  /** Détache les écouteurs (instance de test / usage hors singleton) */
  destroy: () => void
}

/** Événements réseau exposés par `$q.network.on()`. */
export type NetworkEvent = "online" | "offline"

export interface NetworkOptions {
  /** Source de `navigator.onLine` (défaut : `navigator` global ; `null` au serveur) */
  navigator?: NetworkNavigator | null
  /** Cible des événements (défaut : `window` ; `null` au serveur) */
  target?: NetworkEventTarget | null
  /** Force la valeur initiale (sinon `resolveOnline(navigator)`) */
  initial?: boolean
}

/**
 * `true` par défaut : le serveur et les navigateurs sans `navigator.onLine` sont
 * considérés **en ligne** (évite une bannière « hors ligne » au chargement SSR).
 */
export function resolveOnline(nav?: NetworkNavigator | null): boolean {
  return typeof nav?.onLine === "boolean" ? nav.onLine : true
}

/** État après un événement : `online` → true, `offline` → false, autre → inchangé. */
export function onlineAfterEvent(type: string, current: boolean): boolean {
  if (type === "online") return true
  if (type === "offline") return false
  return current
}

/**
 * Crée un objet réseau réactif. Sans `target`, aucun écouteur n'est posé (SSR) ;
 * sans `navigator`, l'état initial vaut `true`.
 */
export function createNetwork(options: NetworkOptions = {}): QNetwork {
  const nav = "navigator" in options
    ? (options.navigator ?? null)
    : typeof navigator !== "undefined"
      ? navigator
      : null
  const target = "target" in options
    ? (options.target ?? null)
    : typeof window !== "undefined"
      ? window
      : null

  const online = ref(options.initial ?? resolveOnline(nav))
  const listeners: Record<"online" | "offline", Set<() => void>> = {
    online: new Set(),
    offline: new Set(),
  }

  const setOnline = (next: boolean) => {
    if (online.value === next) return
    online.value = next
    for (const cb of [...listeners[next ? "online" : "offline"]]) {
      try {
        cb()
      }
      catch {
        // Un abonné fautif ne doit pas empêcher les autres d'être notifiés.
      }
    }
  }

  const handleEvent = (event: { type: string }) => {
    setOnline(onlineAfterEvent(event.type, online.value))
  }

  const refresh = () => {
    const next = resolveOnline(nav)
    setOnline(next)
    return next
  }

  const on = (type: NetworkEvent, cb: () => void) => {
    // Garde runtime : un type inconnu (JS non typé) renvoie un désabonnement inerte.
    if (type !== "online" && type !== "offline") return () => {}
    listeners[type].add(cb)
    return () => {
      listeners[type].delete(cb)
    }
  }

  target?.addEventListener("online", handleEvent)
  target?.addEventListener("offline", handleEvent)

  return reactive({
    /** @see QNetwork.online */
    get online() {
      return online.value
    },
    get offline() {
      return !online.value
    },
    refresh,
    on,
    destroy: () => {
      target?.removeEventListener?.("online", handleEvent)
      target?.removeEventListener?.("offline", handleEvent)
      listeners.online.clear()
      listeners.offline.clear()
    },
  })
}

/** Singleton exposé sous `$q.network` (et importable directement depuis `@dnax/ui`). */
export const network: QNetwork = createNetwork()
