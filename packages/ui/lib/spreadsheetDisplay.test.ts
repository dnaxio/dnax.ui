// Textes « plats » d'une cellule : barre de formule (fx) et recherche.
// Le cas d'origine : une cellule `attachment` (tableau d'objets) affichait
// « [object Object],[object Object] » dans fx.
import { describe, expect, it } from "bun:test"
import { fxTextFor, searchTextFor } from "./spreadsheetDisplay"

const files = [
  { id: "a", name: "login.png", size: 12, type: "image/png" },
  { id: "b", name: "dashboard.png", size: 34, type: "image/png" },
]

describe("fxTextFor", () => {
  it("n'affiche rien pour un fichier joint", () => {
    expect(fxTextFor(files, "attachment")).toBe("")
    expect(fxTextFor([], "attachment")).toBe("")
    expect(fxTextFor(null, "attachment")).toBe("")
  })

  it("ne laisse jamais fuiter [object Object]", () => {
    expect(fxTextFor({ name: "x" })).toBe("")
    expect(fxTextFor([{ a: 1 }, { b: 2 }])).toBe("")
  })

  it("garde le texte des valeurs simples", () => {
    expect(fxTextFor("Ada")).toBe("Ada")
    expect(fxTextFor(18.5)).toBe("18.5")
    expect(fxTextFor(true)).toBe("true")
    expect(fxTextFor("=A1*2")).toBe("=A1*2")
    expect(fxTextFor(null)).toBe("")
    expect(fxTextFor(undefined)).toBe("")
  })

  it("joint proprement un tableau scalaire (multiselect)", () => {
    expect(fxTextFor(["tea", "beer"])).toBe("tea, beer")
    expect(fxTextFor(["tea", null, "beer"])).toBe("tea, beer")
  })
})

describe("searchTextFor", () => {
  it("indexe les noms de fichiers", () => {
    expect(searchTextFor(files, "attachment")).toBe("login.png, dashboard.png")
  })

  it("retombe sur le texte simple", () => {
    expect(searchTextFor("rapport.pdf", "string")).toBe("rapport.pdf")
    expect(searchTextFor(null, "string")).toBe("")
    expect(searchTextFor({ a: 1 })).toBe("")
  })
})
