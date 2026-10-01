// Tests unitaires des coercitions défensives de QSelect (`optionsOf` / `selectionOf`).
// Régression : `multiple` + modèle scalaire (`false`) faisait jeter `list.map` et
// empêchait le popup entier de se rendre.
import { describe, expect, it } from "bun:test"
import { optionsOf, selectionOf } from "./select"

describe("optionsOf", () => {
  it("laisse passer un tableau (même vide)", () => {
    expect(optionsOf(["a", "b"])).toEqual(["a", "b"])
    expect(optionsOf([])).toEqual([])
  })

  it("traite toute valeur non-tableau comme vide (au lieu de planter)", () => {
    expect(optionsOf(false)).toEqual([])
    expect(optionsOf(undefined)).toEqual([])
    expect(optionsOf(null)).toEqual([])
    expect(optionsOf("oops")).toEqual([])
    expect(optionsOf({ value: 1 })).toEqual([])
  })
})

describe("selectionOf", () => {
  it("multiple : accepte un tableau", () => {
    expect(selectionOf(["a", "b"], true)).toEqual(["a", "b"])
    expect(selectionOf([], true)).toEqual([])
  })

  it("multiple + scalaire → rien de sélectionné (le bug d'origine : `false`)", () => {
    expect(selectionOf(false, true)).toEqual([])
    expect(selectionOf(true, true)).toEqual([])
    expect(selectionOf("a", true)).toEqual([])
    expect(selectionOf(0, true)).toEqual([])
  })

  it("simple : emballe la valeur, sauf null/undefined", () => {
    expect(selectionOf("a", false)).toEqual(["a"])
    expect(selectionOf(0, false)).toEqual([0])
    expect(selectionOf(false, false)).toEqual([false])
    expect(selectionOf(null, false)).toEqual([])
    expect(selectionOf(undefined, false)).toEqual([])
  })
})
