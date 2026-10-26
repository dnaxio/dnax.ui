// Tests unitaires des flèches de défilement de QTabs (`lib/tabs.ts`).
import { describe, expect, it } from "bun:test"
import { tabArrowState, tabArrowStep } from "./tabs"

describe("tabArrowState", () => {
  it("pas de débordement → aucune flèche", () => {
    expect(tabArrowState(0, 400, 400)).toEqual({ canStart: false, canEnd: false })
  })

  it("début → seule la flèche de fin", () => {
    expect(tabArrowState(0, 400, 900)).toEqual({ canStart: false, canEnd: true })
  })

  it("milieu → les deux flèches", () => {
    expect(tabArrowState(200, 400, 900)).toEqual({ canStart: true, canEnd: true })
  })

  it("fin → seule la flèche de début", () => {
    expect(tabArrowState(500, 400, 900)).toEqual({ canStart: true, canEnd: false })
  })

  it("tolère l'arrondi des sous-pixels (1 px)", () => {
    // Collé au début malgré un `scrollLeft` de 1 (arrondi)
    expect(tabArrowState(1, 400, 900)).toEqual({ canStart: false, canEnd: true })
    // Collé à la fin malgré un `scrollLeft` à 1 px du max
    expect(tabArrowState(499, 400, 900)).toEqual({ canStart: true, canEnd: false })
  })
})

describe("tabArrowStep", () => {
  it("avance d'environ 60 % de la zone visible, avec un plancher de 80 px", () => {
    expect(tabArrowStep(400)).toBe(240)
    expect(tabArrowStep(100)).toBe(80) // 60 < 80 → plancher
  })
})
