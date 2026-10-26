// $q.wakeLock — Screen Wake Lock : logique pure + fabrique testable hors navigateur.
import { describe, expect, it } from "bun:test"
import {
  createWakeLock,
  isDocumentVisible,
  isWakeLockCapable,
  shouldReacquire,
} from "./wakeLock"

class FakeSentinel {
  released = false
  releaseCalls = 0
  private listeners = new Set<() => void>()

  async release() {
    this.releaseCalls++
    this.released = true
    for (const cb of [...this.listeners]) cb()
  }

  addEventListener(_type: "release", cb: () => void) {
    this.listeners.add(cb)
  }

  removeEventListener(_type: "release", cb: () => void) {
    this.listeners.delete(cb)
  }

  /** Simule le relâchement décidé par le navigateur (page masquée, veille…). */
  autoRelease() {
    this.released = true
    for (const cb of [...this.listeners]) cb()
  }
}

function fakeApi(options: { fail?: Error } = {}) {
  const sentinels: FakeSentinel[] = []
  return {
    calls: 0,
    sentinels,
    async request(_type: "screen") {
      this.calls++
      if (options.fail) throw options.fail
      const s = new FakeSentinel()
      sentinels.push(s)
      return s
    },
  }
}

function fakeVisibility(state = "visible") {
  const listeners = new Set<() => void>()
  return {
    visibilityState: state as string,
    addEventListener(_type: "visibilitychange", cb: () => void) {
      listeners.add(cb)
    },
    removeEventListener(_type: "visibilitychange", cb: () => void) {
      listeners.delete(cb)
    },
    set(next: string) {
      this.visibilityState = next
      for (const cb of [...listeners]) cb()
    },
    count() {
      return listeners.size
    },
  }
}

function client(options: Partial<Parameters<typeof createWakeLock>[0]> = {}) {
  return createWakeLock({
    server: false,
    deferCapability: false,
    api: fakeApi(),
    visibility: fakeVisibility(),
    ...options,
  })
}

describe("isWakeLockCapable", () => {
  it("exige une API avec request()", () => {
    expect(isWakeLockCapable(null)).toBe(false)
    expect(isWakeLockCapable(undefined)).toBe(false)
    expect(isWakeLockCapable({} as never)).toBe(false)
    expect(isWakeLockCapable({ request: async () => new FakeSentinel() })).toBe(true)
  })
})

describe("isDocumentVisible", () => {
  it("visible sauf `visibilityState: 'hidden'` (et sans document injecté)", () => {
    expect(isDocumentVisible(null)).toBe(true)
    expect(isDocumentVisible({ addEventListener() {} })).toBe(true)
    expect(
      isDocumentVisible({ visibilityState: "visible", addEventListener() {} }),
    ).toBe(true)
    expect(
      isDocumentVisible({ visibilityState: "hidden", addEventListener() {} }),
    ).toBe(false)
  })
})

describe("shouldReacquire", () => {
  it("uniquement si demandé, visible et rien de tenu", () => {
    expect(shouldReacquire(true, true, false)).toBe(true)
    expect(shouldReacquire(false, true, false)).toBe(false)
    expect(shouldReacquire(true, false, false)).toBe(false)
    expect(shouldReacquire(true, true, true)).toBe(false)
  })
})

describe("createWakeLock", () => {
  it("au serveur : méthodes sans effet, rien de capable ni d'actif", async () => {
    const lock = createWakeLock({ server: true })
    expect(lock.isCapable).toBe(false)
    expect(lock.isActive).toBe(false)
    await expect(lock.request()).resolves.toBeUndefined()
    await expect(lock.release()).resolves.toBeUndefined()
  })

  it("sans API : `Not capable`", async () => {
    const lock = client({ api: null })
    expect(lock.isCapable).toBe(false)
    await expect(lock.request()).rejects.toThrow("Not capable")
    expect(lock.isActive).toBe(false)
  })

  it("request() acquiert le verrou, une seule fois (idempotent)", async () => {
    const api = fakeApi()
    const lock = client({ api })

    await lock.request()
    expect(lock.isActive).toBe(true)
    expect(api.calls).toBe(1)

    await lock.request()
    expect(api.calls).toBe(1)
    expect(lock.isActive).toBe(true)
  })

  it("release() rend la main au système", async () => {
    const api = fakeApi()
    const lock = client({ api })

    await lock.request()
    await lock.release()

    expect(lock.isActive).toBe(false)
    expect(api.sentinels[0]!.releaseCalls).toBe(1)

    // Une nouvelle demande fonctionne.
    await lock.request()
    expect(api.calls).toBe(2)
    expect(lock.isActive).toBe(true)
  })

  it("le navigateur relâche → isActive retombe, et le verrou est redemandé au retour", async () => {
    const api = fakeApi()
    const visibility = fakeVisibility("visible")
    const lock = client({ api, visibility })

    await lock.request()
    expect(lock.isActive).toBe(true)

    // Onglet masqué : le navigateur relâche de lui-même.
    visibility.set("hidden")
    api.sentinels[0]!.autoRelease()
    expect(lock.isActive).toBe(false)
    expect(api.calls).toBe(1)

    // Retour de visibilité : la demande mémorisée est rejouée.
    visibility.set("visible")
    await Promise.resolve()
    expect(api.calls).toBe(2)
    expect(lock.isActive).toBe(true)
  })

  it("après release(), plus aucune redemande au changement de visibilité", async () => {
    const api = fakeApi()
    const visibility = fakeVisibility("visible")
    const lock = client({ api, visibility })

    await lock.request()
    await lock.release()

    visibility.set("hidden")
    visibility.set("visible")
    await Promise.resolve()

    expect(api.calls).toBe(1)
    expect(lock.isActive).toBe(false)
  })

  it("le refus du navigateur est propagé (échec doux côté appelant)", async () => {
    const api = fakeApi({ fail: new Error("denied") })
    const lock = client({ api })

    await expect(lock.request()).rejects.toThrow("denied")
    expect(lock.isActive).toBe(false)
  })

  it("destroy() détache l'écouteur de visibilité", async () => {
    const visibility = fakeVisibility()
    const lock = client({ visibility })

    expect(visibility.count()).toBe(1)
    lock.destroy()
    expect(visibility.count()).toBe(0)
  })

  it("isCapable n'est révélé qu'après hydratation (report d'un tick)", async () => {
    const api = fakeApi()
    const lock = createWakeLock({ server: false, api, visibility: null })

    expect(lock.isCapable).toBe(false)
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(lock.isCapable).toBe(true)
  })
})
