// Tests unitaires de la normalisation des options de colonne (`lib/spreadsheetOptions.ts`).
// Cas visé : des données d'API `[{ _id, name }]` (ou `{ _id, name, value }`) utilisées
// directement via `optionLabel` / `optionValue`, sans mapping manuel.
import { describe, expect, it } from "bun:test"
import { normalizeCellOptions } from "./spreadsheetOptions"

const users = [
  { _id: "u_8f3a", name: "Ada Lovelace", value: "ADA" },
  { _id: "u_1b2c", name: "Alan Turing", value: "ALAN" },
]

describe("normalizeCellOptions — sans accesseurs (forme historique)", () => {
  it("laisse passer `{ value, label, color? }`", () => {
    const opts = [{ value: "tea", label: "Tea", color: "#ede9fe" }]
    expect(normalizeCellOptions(opts)).toEqual([{ value: "tea", label: "Tea", color: "#ede9fe" }])
  })

  it("accepte un label numérique et l'absence de couleur", () => {
    expect(normalizeCellOptions([{ value: 1, label: 1 }])).toEqual([{ value: 1, label: 1 }])
  })

  it("normalise une option primitive", () => {
    expect(normalizeCellOptions(["a", 3])).toEqual([
      { value: "a", label: "a" },
      { value: 3, label: "3" },
    ])
  })

  it("replie le label sur la valeur string si `label` manque", () => {
    expect(normalizeCellOptions([{ value: "it" }])).toEqual([{ value: "it", label: "it" }])
  })

  it("tolère une entrée qui n'est pas un tableau", () => {
    expect(normalizeCellOptions(false)).toEqual([])
    expect(normalizeCellOptions(undefined)).toEqual([])
  })
})

describe("normalizeCellOptions — `optionLabel` / `optionValue`", () => {
  it("mappe `[{ _id, name }]` par nom de clé", () => {
    expect(normalizeCellOptions(users, "name", "_id")).toEqual([
      { value: "u_8f3a", label: "Ada Lovelace" },
      { value: "u_1b2c", label: "Alan Turing" },
    ])
  })

  it("mappe par fonction, comme `option-label` de QSelect", () => {
    expect(normalizeCellOptions(users, (u) => u.name, (u) => u._id)).toEqual([
      { value: "u_8f3a", label: "Ada Lovelace" },
      { value: "u_1b2c", label: "Alan Turing" },
    ])
  })

  it("permet de stocker le code métier (`value`) plutôt que l'`_id`", () => {
    expect(normalizeCellOptions(users, "name", "value")[0]).toEqual({
      value: "ADA",
      label: "Ada Lovelace",
    })
  })

  it("transmet `color` tel quel (décoré côté app)", () => {
    const decorated = users.map((u) => ({ ...u, color: u.value === "ADA" ? "#ede9fe" : "#dcfce7" }))
    const opts = normalizeCellOptions(decorated, "name", "_id")
    expect(opts[0]).toEqual({ value: "u_8f3a", label: "Ada Lovelace", color: "#ede9fe" })
    expect(opts[1]!.color).toBe("#dcfce7")
  })

  it("replie le label sur la valeur si la clé de label est absente de l'objet", () => {
    expect(normalizeCellOptions([{ _id: "x" }], "name", "_id")).toEqual([{ value: "x", label: "x" }])
  })

  it("ne mute pas les objets source", () => {
    const source = [{ _id: "u_1", name: "Ada" }]
    normalizeCellOptions(source, "name", "_id")
    expect(source).toEqual([{ _id: "u_1", name: "Ada" }])
  })

  it("produit une nouvelle liste à chaque appel (le cache est géré par le composant)", () => {
    const a = normalizeCellOptions(users, "name", "_id")
    const b = normalizeCellOptions(users, "name", "_id")
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })
})
