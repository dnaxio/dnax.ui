// Tests des calculs de placement des panneaux ancrés (menu, autocomplete) — bun test.
import { describe, expect, it } from "bun:test"
import { clampLeft, maxHeightFor, pickSide, spaceAbove, spaceBelow } from "./anchoredPosition"
import type { PlacementInput } from "./anchoredPosition"

/** Fenêtre 800×600, ancre de 100 de haut à `top`. */
const base = (top: number, panelHeight: number, extra: Partial<PlacementInput> = {}): PlacementInput => ({
  anchor: { top, bottom: top + 40, left: 100, right: 300 },
  panelHeight,
  viewportHeight: 600,
  viewportWidth: 800,
  panelWidth: 200,
  ...extra,
})

describe("spaceBelow / spaceAbove", () => {
  it("déduit l'écart (4) et la marge (8)", () => {
    const input = base(100, 200) // bas de l'ancre = 140
    expect(spaceBelow(input)).toBe(600 - 140 - 4 - 8)
    expect(spaceAbove(input)).toBe(100 - 4 - 8)
  })

  it("jamais négatif", () => {
    expect(spaceAbove(base(2, 200))).toBe(0)
    expect(spaceBelow(base(598, 200))).toBe(0)
  })

  it("marge et écart personnalisés", () => {
    expect(spaceBelow(base(100, 200, { margin: 0, offset: 0 }))).toBe(600 - 140)
  })
})

describe("pickSide — bascule automatique", () => {
  it("reste en bas quand ça tient", () => {
    expect(pickSide(base(100, 200))).toBe("bottom")
  })

  it("bascule en haut quand le panneau ne tient pas en bas et tient au-dessus", () => {
    // ancre en bas de la fenêtre : 60px sous l'ancre, 400px au-dessus
    expect(pickSide(base(400, 240))).toBe("top")
  })

  it("reste en bas quand il n'y a pas plus de place au-dessus", () => {
    // ancre tout en haut : 548px sous l'ancre, 0 au-dessus
    expect(pickSide(base(10, 240))).toBe("bottom")
  })

  it("quand aucun côté ne suffit, prend celui qui a le plus de place (et sera borné en hauteur)", () => {
    // 68px en bas, 288px au-dessus → plus haut, même si 500px ne tiennent nulle part
    expect(pickSide(base(300, 500, { viewportHeight: 420 }))).toBe("top")
  })

  it("`preferred: top` bascule en bas quand il n'y a pas la place au-dessus", () => {
    expect(pickSide(base(10, 240), "top")).toBe("bottom")
    expect(pickSide(base(400, 240), "top")).toBe("top")
  })

  it("sans hauteur mesurée, garde le côté demandé (pas de saut au 1er rendu)", () => {
    expect(pickSide(base(500, 0))).toBe("bottom")
    expect(pickSide(base(10, 0), "top")).toBe("top")
  })

  it("`flip: false` force le côté demandé", () => {
    expect(pickSide(base(400, 240), "bottom", false)).toBe("bottom")
  })
})

describe("maxHeightFor", () => {
  it("renvoie l'espace du côté retenu", () => {
    const input = base(400, 240)
    expect(maxHeightFor(input, "top")).toBe(Math.round(spaceAbove(input)))
    expect(maxHeightFor(input, "bottom")).toBe(Math.round(spaceBelow(input)))
  })
})

describe("clampLeft", () => {
  it("ramène le panneau dans la fenêtre", () => {
    expect(clampLeft(700, 200, 800)).toBe(592) // 800 - 200 - 8
    expect(clampLeft(-40, 200, 800)).toBe(8)
  })

  it("laisse passer quand ça tient", () => {
    expect(clampLeft(120, 200, 800)).toBe(120)
  })

  it("panneau plus large que la fenêtre → marge gauche", () => {
    expect(clampLeft(100, 900, 800)).toBe(8)
  })

  it("largeur inconnue → inchangé", () => {
    expect(clampLeft(700, 0, 800)).toBe(700)
  })
})
