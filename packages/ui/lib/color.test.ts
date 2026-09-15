// Tests unitaires de la normalisation des couleurs (bun test).
import { describe, expect, it } from "bun:test"
import { normalizeCssColor, rgbaFromBytes } from "./color"

/** Faux contexte 2D mimant un navigateur : une valeur **non reconnue** laisse `fillStyle`
 *  inchangé (c'est cette règle qui sert à détecter une couleur invalide). */
function fakeCtx(options: {
  /** Sérialisation de la couleur (Chrome conserve l'espace : `oklch(…)` reste `oklch(…)`) */
  serialize?: (value: string) => string
  /** Lecture du pixel peint */
  pixel?: [number, number, number, number]
  /** Reconnaissance d'une couleur CSS */
  recognized?: (value: string) => boolean
}) {
  const {
    serialize = (v: string) => v,
    pixel = [249, 115, 22, 255] as [number, number, number, number],
    recognized = (v: string) => v.trim() !== "" && !/^zorglub/.test(v),
  } = options
  const ctx = {
    _fill: "#000000",
    get fillStyle() {
      return this._fill
    },
    set fillStyle(value: string) {
      if (recognized(value)) this._fill = serialize(value)
    },
    clearRect() {},
    fillRect() {},
    getImageData: () => ({ data: Uint8ClampedArray.from(pixel) }),
  }
  return ctx as unknown as CanvasRenderingContext2D
}

describe("rgbaFromBytes", () => {
  it("rend `#rrggbb` pour une couleur opaque", () => {
    expect(rgbaFromBytes(249, 115, 22, 255)).toBe("#f97316")
    expect(rgbaFromBytes(0, 0, 0, 255)).toBe("#000000")
  })
  it("rend `rgba()` dès qu'il y a de la transparence", () => {
    expect(rgbaFromBytes(0, 0, 0, 0)).toBe("rgba(0, 0, 0, 0)")
    expect(rgbaFromBytes(0, 0, 0, 140)).toBe("rgba(0, 0, 0, 0.549)")
    expect(rgbaFromBytes(255, 255, 255, 128)).toBe("rgba(255, 255, 255, 0.502)")
  })
  it("borne les octets", () => {
    expect(rgbaFromBytes(-20, 300, 12.6, 255)).toBe("#00ff0d")
  })
})

describe("normalizeCssColor", () => {
  it("convertit un oklch alors même que `fillStyle` conserve l'espace colorimétrique", () => {
    // Comportement de Chrome : la sérialisation garde `oklch(…)` — d'où le bug de survol
    // quand on recopiait simplement `fillStyle` (zrender ne sait pas relire un oklch).
    const ctx = fakeCtx({ serialize: (v) => (v.startsWith("oklch") ? "oklch(0.646 0.222 41.116)" : v) })
    expect(normalizeCssColor("oklch(64.6% .222 41.116)", ctx)).toBe("#f97316")
  })
  it("convertit les autres syntaxes modernes et garde les formes simples", () => {
    const ctx = fakeCtx({ serialize: (v) => (v.startsWith("oklch") ? "oklch(0.5 0.1 200)" : v) })
    expect(normalizeCssColor("#f97316", ctx)).toBe("#f97316")
    expect(normalizeCssColor("color-mix(in srgb, #fff 70%, transparent)", ctx)).toBe("#f97316")
    expect(normalizeCssColor("rgb(0 0 0 / 0.55)", ctx)).toBe("#f97316")
  })
  it("conserve la transparence relue sur le pixel", () => {
    const ctx = fakeCtx({ serialize: (v) => (v.startsWith("oklch") ? "oklch(0.5 0.1 200)" : v), pixel: [0, 0, 0, 140] })
    expect(normalizeCssColor("oklch(50% .1 200 / 55%)", ctx)).toBe("rgba(0, 0, 0, 0.549)")
  })
  it("renvoie `undefined` pour une couleur invalide (ou un contexte absent)", () => {
    expect(normalizeCssColor("zorglub(1)", fakeCtx({}))).toBeUndefined()
    expect(normalizeCssColor("", fakeCtx({}))).toBeUndefined()
    expect(normalizeCssColor({ toString: () => "#fff" } as unknown as string, fakeCtx({}))).toBeUndefined()
    expect(normalizeCssColor("oklch(1 0 0)", null)).toBeUndefined()
    expect(normalizeCssColor("oklch(1 0 0)", undefined)).toBeUndefined()
  })
  it("retombe sur la sérialisation si la lecture des pixels échoue", () => {
    const ctx = fakeCtx({ serialize: (v) => (v.startsWith("oklch") ? "oklch(0.5 0.1 200)" : v) })
    ;(ctx as any).getImageData = () => {
      throw new Error("canvas illisible")
    }
    expect(normalizeCssColor("oklch(50% .1 200)", ctx)).toBe("oklch(0.5 0.1 200)")
  })
})
