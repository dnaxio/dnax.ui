// Tests unitaires des points d'ancrage (`breakpoints`) du bottom sheet.
import { describe, expect, it } from "bun:test"
import {
  clampRatio,
  nearestBreakpoint,
  normalizeBreakpoints,
  ratioFromDrag,
  releaseBreakpoint,
  stepBreakpoint,
} from "./bottomSheet"

describe("normalizeBreakpoints", () => {
  it("trie et dédoublonne les fractions de ]0, 1]", () => {
    expect(normalizeBreakpoints([0.5, 0.25, 0.75, 0.25])).toEqual([0.25, 0.5, 0.75])
    expect(normalizeBreakpoints([1, 0.5])).toEqual([0.5, 1])
  })

  it("écarte 0 (état « fermé »), les hors-bornes et le non numérique", () => {
    expect(normalizeBreakpoints([0, 0.25, 1.5, -0.5])).toEqual([0.25])
    expect(normalizeBreakpoints([Number.NaN, Number.POSITIVE_INFINITY])).toEqual([])
    expect(normalizeBreakpoints(["0.25", "0.5"])).toEqual([0.25, 0.5])
  })

  it("accepte une chaîne (usage en attribut)", () => {
    expect(normalizeBreakpoints("0.25, 0.5")).toEqual([0.25, 0.5])
    expect(normalizeBreakpoints("[0.25, 0.5, 0.75]")).toEqual([0.25, 0.5, 0.75])
    expect(normalizeBreakpoints("")).toEqual([])
  })

  it("rend une liste vide pour une valeur absente ou illisible", () => {
    expect(normalizeBreakpoints()).toEqual([])
    expect(normalizeBreakpoints(null)).toEqual([])
    expect(normalizeBreakpoints(0.5)).toEqual([])
    expect(normalizeBreakpoints({})).toEqual([])
  })
})

describe("nearestBreakpoint", () => {
  const anchors = [0.25, 0.5, 0.75]

  it("choisit le point d'ancrage le plus proche (le plus bas à égalité)", () => {
    expect(nearestBreakpoint(0.3, anchors)).toBe(0.25)
    expect(nearestBreakpoint(0.4, anchors)).toBe(0.5)
    expect(nearestBreakpoint(0.375, anchors)).toBe(0.25)
    expect(nearestBreakpoint(0.9, anchors)).toBe(0.75)
  })

  it("borne la valeur quand la liste est vide", () => {
    expect(nearestBreakpoint(1.4, [])).toBe(1)
    expect(nearestBreakpoint(-2, [])).toBe(0)
  })
})

describe("stepBreakpoint", () => {
  const anchors = [0.25, 0.5, 0.75]

  it("monte et descend d'un cran depuis le point d'ancrage courant", () => {
    expect(stepBreakpoint(0.25, anchors, 1)).toBe(0.5)
    expect(stepBreakpoint(0.5, anchors, 1)).toBe(0.75)
    expect(stepBreakpoint(0.75, anchors, -1)).toBe(0.5)
  })

  it("reste sur place aux extrémités", () => {
    expect(stepBreakpoint(0.75, anchors, 1)).toBe(0.75)
    expect(stepBreakpoint(0.25, anchors, -1)).toBe(0.25)
  })

  it("accepte une liste non triée et une valeur intermédiaire", () => {
    expect(stepBreakpoint(0.6, [0.25, 0.75, 0.5], 1)).toBe(0.75)
  })
})

describe("clampRatio / ratioFromDrag", () => {
  it("borne une fraction et protège le non numérique", () => {
    expect(clampRatio(1.4)).toBe(1)
    expect(clampRatio(-0.2)).toBe(0)
    expect(clampRatio(Number.NaN)).toBe(0)
    expect(clampRatio(0.4, 0.25, 0.75)).toBe(0.4)
  })

  it("convertit un drag vertical en fraction (vers le haut = agrandir)", () => {
    // 100 px vers le haut dans une vue de 800 px → +0.125
    expect(ratioFromDrag(0.5, -100, 800)).toBeCloseTo(0.625, 5)
    expect(ratioFromDrag(0.5, 200, 800)).toBeCloseTo(0.25, 5)
    expect(ratioFromDrag(0.5, 9999, 800)).toBe(0)
  })

  it("rend la fraction de départ si la hauteur de vue est inutilisable", () => {
    expect(ratioFromDrag(0.5, 100, 0)).toBe(0.5)
    expect(ratioFromDrag(0.5, Number.NaN, 800)).toBe(0.5)
  })
})

describe("releaseBreakpoint", () => {
  const anchors = [0.25, 0.5, 0.75]

  it("se pose sur le point d'ancrage le plus proche", () => {
    expect(releaseBreakpoint(0.28, anchors)).toEqual({ close: false, breakpoint: 0.25 })
    expect(releaseBreakpoint(0.7, anchors)).toEqual({ close: false, breakpoint: 0.75 })
    expect(releaseBreakpoint(1, anchors)).toEqual({ close: false, breakpoint: 0.75 })
  })

  it("ferme le panneau relâché à 0 ou sous le plus bas point d'ancrage", () => {
    expect(releaseBreakpoint(0, anchors)).toEqual({ close: true })
    expect(releaseBreakpoint(-0.1, anchors)).toEqual({ close: true })
    // 0.05 est à plus de 0.15 sous 0.25 → fermeture
    expect(releaseBreakpoint(0.05, anchors)).toEqual({ close: true })
    // 0.15 reste dans la tolérance → on remonte sur 0.25
    expect(releaseBreakpoint(0.15, anchors)).toEqual({ close: false, breakpoint: 0.25 })
  })

  it("respecte un seuil de fermeture explicite", () => {
    expect(releaseBreakpoint(0.2, anchors, 0)).toEqual({ close: true })
    expect(releaseBreakpoint(0.2, anchors, 0.5)).toEqual({ close: false, breakpoint: 0.25 })
  })

  it("ferme toujours sans point d'ancrage exploitable", () => {
    expect(releaseBreakpoint(0.5, [])).toEqual({ close: true })
    expect(releaseBreakpoint(Number.NaN, anchors)).toEqual({ close: true })
  })
})
