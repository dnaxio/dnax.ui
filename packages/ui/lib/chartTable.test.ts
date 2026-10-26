// Tests des **micro-visualisations de cellule** de la marque `table` (barres de données,
// barres divergentes, heat, sparklines) — purs, sans DOM.
import { describe, expect, it } from "bun:test"
import { cellBarGeometry, cellScale, cellVisualOf, sparklineGeometry } from "./chartTable"
import { tableModel } from "./chart"

describe("cellVisualOf", () => {
  it("`true` = barre de données, objet rendu tel quel, absent = rien", () => {
    expect(cellVisualOf(true)).toEqual({ type: "bar" })
    expect(cellVisualOf(undefined)).toBeUndefined()
    expect(cellVisualOf(false)).toBeUndefined()
    expect(cellVisualOf({ type: "delta" })).toEqual({ type: "delta" })
  })
})

describe("cellScale", () => {
  it("bornes observées, ramenées à zéro", () => {
    expect(cellScale([10, 50, 100], { type: "bar" })).toEqual({ min: 0, max: 100, maxAbs: 100 })
    expect(cellScale([-10, 20], { type: "delta" })).toEqual({ min: -10, max: 20, maxAbs: 20 })
  })

  it("bornes explicites (`min` / `max`) et valeurs non numériques ignorées", () => {
    expect(cellScale([10, null, "x", 30], { type: "bar", min: 0, max: 200 })).toEqual({
      min: 0,
      max: 200,
      maxAbs: 200,
    })
    expect(cellScale([], { type: "bar" })).toEqual({ min: 0, max: 0, maxAbs: Number.EPSILON })
  })
})

describe("cellBarGeometry", () => {
  const scale = { min: 0, max: 100, maxAbs: 100 }

  it("`bar` : barre à gauche proportionnelle à la valeur", () => {
    expect(cellBarGeometry(50, { type: "bar" }, scale)).toEqual({
      width: 50,
      left: 0,
      ratio: 0.5,
      diverging: false,
      sign: 1,
    })
    expect(cellBarGeometry(-25, { type: "bar" }, scale)?.width).toBe(25)
    expect(cellBarGeometry(0, { type: "bar" }, scale)?.width).toBe(0)
  })

  it("`delta` : divergente depuis 50 %, positives à droite", () => {
    expect(cellBarGeometry(25, { type: "delta" }, scale)).toMatchObject({
      left: 50,
      width: 12.5,
      diverging: true,
      sign: 1,
    })
    expect(cellBarGeometry(-25, { type: "delta" }, scale)).toMatchObject({
      left: 37.5,
      width: 12.5,
      diverging: true,
      sign: -1,
    })
  })

  it("`heat` : barre pleine largeur, l'intensité porte la valeur", () => {
    expect(cellBarGeometry(25, { type: "heat" }, scale)).toMatchObject({ left: 0, width: 100, ratio: 0.25 })
  })

  it("aucune barre pour une sparkline ou une valeur manquante", () => {
    expect(cellBarGeometry(10, { type: "sparkline" }, scale)).toBeUndefined()
    expect(cellBarGeometry(undefined, { type: "bar" }, scale)).toBeUndefined()
    expect(cellBarGeometry("x", { type: "bar" }, scale)).toBeUndefined()
  })
})

describe("sparklineGeometry", () => {
  it("trace la ligne, la surface et le point final", () => {
    const spark = sparklineGeometry([1, 2, 3], { point: "last" })!
    expect(spark.points.length).toBe(3)
    expect(spark.path.startsWith("M2,")).toBe(true)
    expect(spark.path).toContain("L98,2")
    expect(spark.areaPath).toContain("Z")
    expect(spark.marker).toEqual(spark.points[2]!)
  })

  it("met en évidence `first`, `high`, `low` ou rien", () => {
    const first = sparklineGeometry([3, 1, 7], { point: "first" })!
    expect(first.marker).toEqual(first.points[0]!)
    const high = sparklineGeometry([3, 1, 7], { point: "high" })!
    expect(high.marker).toEqual(high.points[2]!)
    const low = sparklineGeometry([3, 1, 7], { point: "low" })!
    expect(low.marker).toEqual(low.points[1]!)
    expect(sparklineGeometry([3, 1, 7], { point: false })!.marker).toBeUndefined()
  })

  it("valeurs constantes : ligne au milieu ; aucune valeur : rien", () => {
    const flat = sparklineGeometry([5, 5, 5])!
    expect(flat.points.every((p) => p.y === flat.points[0]!.y)).toBe(true)
    expect(flat.points[0]!.y).toBe(12)
    expect(sparklineGeometry([])).toBeUndefined()
    expect(sparklineGeometry(undefined)).toBeUndefined()
  })
})

describe("tableModel — échelles et totaux des micro-visualisations", () => {
  const rows = [
    { type: "A", orders: 100, target: 10, trend: [1, 2, 3] },
    { type: "B", orders: 50, target: -5, trend: [3, 2, 1] },
  ]
  const mark = {
    type: "table" as const,
    data: rows,
    totals: { label: "Total" },
    columns: [
      { field: "type", label: "Type" },
      { field: "orders", label: "Orders", cell: { type: "bar" as const } },
      { field: "target", label: "vs Target", cell: { type: "delta" as const } },
      { field: "trend", label: "Trend", cell: { type: "sparkline" as const } },
    ],
  }

  it("calcule une échelle par colonne visualisée (jamais pour une sparkline)", () => {
    const model = tableModel(mark)
    expect(model.cellScales).toEqual({
      orders: { min: 0, max: 100, maxAbs: 100 },
      target: { min: -5, max: 10, maxAbs: 10 },
    })
    expect(model.cellScales?.trend).toBeUndefined()
  })

  it("expose les valeurs **brutes** des totaux pour les barres du pied de table", () => {
    const model = tableModel(mark)
    expect(model.totalValues).toEqual({ orders: 150, target: 5 })
    expect(model.totals).toEqual({ type: "Total", orders: "150", target: "5" })
  })

  it("sans `cell`, pas d'échelle (modèle inchangé)", () => {
    const model = tableModel({ type: "table", data: rows, columns: ["type", "orders"] })
    expect(model.cellScales).toBeUndefined()
    expect(model.totalValues).toBeUndefined()
    expect(model.totals).toBeUndefined()
  })
})
