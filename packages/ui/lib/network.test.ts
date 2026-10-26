// $q.network — état de connexion : logique pure + fabrique testable hors DOM.
// (La règle projet interdit le navigateur : on injecte `navigator` et la cible d'événements.)
import { describe, expect, it } from "bun:test"
import { effect } from "vue"
import { createNetwork, onlineAfterEvent, resolveOnline } from "./network"

/** Fausse cible d'événements (window) + compteur d'écouteurs. */
function fakeTarget() {
  const listeners = new Map<string, Set<(event: { type: string }) => void>>()
  return {
    addEventListener(type: string, cb: (event: { type: string }) => void) {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type)!.add(cb)
    },
    removeEventListener(type: string, cb: (event: { type: string }) => void) {
      listeners.get(type)?.delete(cb)
    },
    /** Émet un événement comme le navigateur. */
    emit(type: string) {
      for (const cb of [...(listeners.get(type) ?? [])]) cb({ type })
    },
    /** Nombre d'écouteurs encore attachés pour ce type. */
    count(type: string) {
      return listeners.get(type)?.size ?? 0
    },
  }
}

describe("resolveOnline", () => {
  it("considère « en ligne » quand l'information manque (serveur, navigateur sans API)", () => {
    expect(resolveOnline(undefined)).toBe(true)
    expect(resolveOnline(null)).toBe(true)
    expect(resolveOnline({})).toBe(true)
  })

  it("suit navigator.onLine quand il est un booléen", () => {
    expect(resolveOnline({ onLine: true })).toBe(true)
    expect(resolveOnline({ onLine: false })).toBe(false)
  })
})

describe("onlineAfterEvent", () => {
  it("online → connecté, offline → déconnecté", () => {
    expect(onlineAfterEvent("online", false)).toBe(true)
    expect(onlineAfterEvent("offline", true)).toBe(false)
  })

  it("un autre événement ne change rien", () => {
    expect(onlineAfterEvent("focus", false)).toBe(false)
    expect(onlineAfterEvent("focus", true)).toBe(true)
  })
})

describe("createNetwork", () => {
  it("lit l'état initial dans navigator.onLine", () => {
    const nav = { onLine: false }
    const net = createNetwork({ navigator: nav, target: null })
    expect(net.online).toBe(false)
    expect(net.offline).toBe(true)
  })

  it("sans cible (SSR), aucune écoute n'est posée et l'état reste stable", () => {
    const net = createNetwork({ navigator: null, target: null })
    expect(net.online).toBe(true)
  })

  it("suit les événements online / offline de la cible", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })

    target.emit("offline")
    expect(net.online).toBe(false)
    expect(net.offline).toBe(true)

    target.emit("online")
    expect(net.online).toBe(true)
    expect(net.offline).toBe(false)
  })

  it("est réactif : un effet est rejoué au changement (template `$q.network.online`)", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })
    const seen: boolean[] = []

    effect(() => {
      seen.push(net.online)
    })

    target.emit("offline")
    target.emit("online")

    expect(seen).toEqual([true, false, true])
  })

  it("ne notifie qu'un vrai changement d'état", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })
    let offlineCalls = 0
    let onlineCalls = 0
    net.on("offline", () => offlineCalls++)
    net.on("online", () => onlineCalls++)

    target.emit("offline")
    target.emit("offline")
    target.emit("online")
    target.emit("online")

    expect(offlineCalls).toBe(1)
    expect(onlineCalls).toBe(1)
  })

  it("on() cible le bon événement et rend un désabonnement", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })
    const seen: string[] = []
    const stopOnline = net.on("online", () => seen.push("online"))
    net.on("offline", () => seen.push("offline"))

    target.emit("offline")
    target.emit("online")
    stopOnline()
    target.emit("offline")
    target.emit("online")

    expect(seen).toEqual(["offline", "online", "offline"])
  })

  it("on() ignore un type inconnu (JS non typé)", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })
    const stop = net.on("focus" as never, () => {
      throw new Error("ne doit jamais être appelé")
    })

    target.emit("offline")
    expect(typeof stop).toBe("function")
    stop()
  })

  it("les abonnements se désabonnent", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })
    let calls = 0
    const off = net.on("offline", () => calls++)

    target.emit("offline")
    off()
    target.emit("online")
    target.emit("offline")

    expect(calls).toBe(1)
  })

  it("un abonné qui jette ne bloque pas les suivants", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })
    let calls = 0
    net.on("offline", () => {
      throw new Error("boom")
    })
    net.on("offline", () => calls++)

    target.emit("offline")

    expect(calls).toBe(1)
  })

  it("refresh() relit navigator.onLine (valeur devenue obsolète)", () => {
    const nav = { onLine: true }
    const net = createNetwork({ navigator: nav, target: fakeTarget() })

    nav.onLine = false
    expect(net.refresh()).toBe(false)
    expect(net.online).toBe(false)

    nav.onLine = true
    expect(net.online).toBe(false) // pas de sondage automatique
    expect(net.refresh()).toBe(true)
    expect(net.online).toBe(true)
  })

  it("destroy() détache les écouteurs et vide les abonnements", () => {
    const target = fakeTarget()
    const net = createNetwork({ navigator: { onLine: true }, target })
    let calls = 0
    net.on("offline", () => calls++)

    expect(target.count("online")).toBe(1)
    expect(target.count("offline")).toBe(1)

    net.destroy()
    target.emit("offline")

    expect(target.count("online")).toBe(0)
    expect(target.count("offline")).toBe(0)
    expect(net.online).toBe(true)
    expect(calls).toBe(0)
  })
})
