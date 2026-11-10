// Taille de cellule : presets, bornes, dérivés (largeur, police).
// Le point sensible est la **non-régression** : `md` doit reproduire exactement les valeurs
// historiques (32 px de haut, 160 px de large, 13 px de police).
import { describe, expect, it } from "bun:test"
import { CELL_SIZE_MAX, CELL_SIZE_MIN, CELL_SIZE_PX, cellFontFor, cellSizePx, cellWidthFor, headerMetricsFor } from "./cellSize"

describe("cellSizePx", () => {
  it("md est le défaut historique (32 px)", () => {
    expect(cellSizePx()).toBe(32)
    expect(cellSizePx(null)).toBe(32)
    expect(cellSizePx("md")).toBe(32)
    expect(CELL_SIZE_PX.md).toBe(32)
  })

  it("résout les presets", () => {
    expect(cellSizePx("sm")).toBe(28)
    expect(cellSizePx("lg")).toBe(40)
  })

  it("accepte une valeur en px, arrondie et bornée", () => {
    expect(cellSizePx(48)).toBe(48)
    expect(cellSizePx(66)).toBe(66)
    expect(cellSizePx(47.6)).toBe(48)
    expect(cellSizePx(2)).toBe(CELL_SIZE_MIN)
    expect(cellSizePx(999)).toBe(CELL_SIZE_MAX)
    expect(cellSizePx(Number.NaN)).toBe(32)
  })
})

describe("cellWidthFor", () => {
  it("garde le ratio historique 5:1", () => {
    expect(cellWidthFor(32)).toBe(160)
    expect(cellWidthFor(28)).toBe(140)
    expect(cellWidthFor(40)).toBe(200)
    expect(cellWidthFor(48)).toBe(240)
    expect(cellWidthFor(66)).toBe(330)
  })
})

describe("cellFontFor", () => {
  it("md garde la police historique (13 px)", () => {
    expect(cellFontFor(32)).toBe(13)
  })

  it("grandit avec la cellule puis plafonne", () => {
    expect(cellFontFor(28)).toBe(11)
    expect(cellFontFor(40)).toBe(16)
    expect(cellFontFor(48)).toBe(19)
    expect(cellFontFor(66)).toBe(20)
    expect(cellFontFor(120)).toBe(20)
  })
})

describe("headerMetricsFor", () => {
  it("md reproduit exactement l'historique (aucune régression)", () => {
    expect(headerMetricsFor(32)).toEqual({
      height: 28,
      gutter: 34,
      labelFont: 11.5,
      letterFont: 9.5,
      rowFont: 11,
    })
  })

  it("sm réduit l'en-tête", () => {
    const m = headerMetricsFor(28)
    expect(m.height).toBe(25)
    expect(m.gutter).toBe(28)
    expect(m.labelFont).toBe(9.5)
  })

  it("lg et 66 agrandissent l'en-tête", () => {
    expect(headerMetricsFor(40)).toEqual({
      height: 35,
      gutter: 41,
      labelFont: 14,
      letterFont: 12,
      rowFont: 14,
    })
    const big = headerMetricsFor(66)
    expect(big.height).toBe(56) // plafonné
    expect(big.gutter).toBe(47)
    expect(big.labelFont).toBe(16)
  })

  it("la gouttière s'élargit avec la police (numéros à 4-5 chiffres)", () => {
    expect(headerMetricsFor(48).gutter).toBeGreaterThan(headerMetricsFor(32).gutter)
    expect(headerMetricsFor(120).gutter).toBeLessThanOrEqual(56)
  })
})
