// Tests des colonnes calculées (`autoFormula`) — bun test, sans navigateur.
import { describe, expect, it } from "bun:test"
import { sameRowRefs, withAutoFormulas } from "./formulaColumn"

describe("sameRowRefs", () => {
  const names = ["a", "b", "c"]

  it("références A1 non absolues de la même ligne", () => {
    expect(sameRowRefs("=A2*B2", 1, names)).toEqual(["a", "b"])
  })

  it("ignore les lignes absolues et les plages inter-lignes", () => {
    expect(sameRowRefs("=$A$2*B2", 1, names)).toEqual(["b"])
    expect(sameRowRefs("=SUM(A1:A4)", 4, names)).toEqual([])
  })

  it("reconnaît les références par nom de colonne, pas les fonctions ni TRUE/FALSE", () => {
    expect(sameRowRefs("=IF(qty>0,price,TRUE)", 0, ["qty", "price", "total"])).toEqual([
      "qty",
      "price",
    ])
  })

  it("ignore les littéraux de chaîne", () => {
    expect(sameRowRefs('=IF(A1>0,"A1","x")', 0, names)).toEqual(["a"])
  })

  it("aucune référence de la ligne (totaux, constantes)", () => {
    expect(sameRowRefs("=SUM(D1:D4)", 4, ["d"])).toEqual([])
    expect(sameRowRefs("=42", 0, names)).toEqual([])
  })
})

describe("withAutoFormulas", () => {
  const columns = [{ name: "a" }, { name: "b" }, { name: "c" }]

  it("remplit la cellule de formule vide quand toutes ses références sont renseignées", () => {
    const rows = [
      { a: 1, b: 2, c: "=A1*B1" },
      { a: 3, b: 4, c: "" },
      { a: 5, b: "", c: "" },
    ]
    const next = withAutoFormulas(rows, columns)
    expect(next).not.toBeNull()
    expect(next![1]!.c).toBe("=A2*B2")
    expect(next![2]!.c).toBe("") // `b` manquant → pas de calcul
    expect(rows[1]!.c).toBe("") // l'entrée n'est pas mutée
    expect(next![0]).toBe(rows[0]!) // les lignes intactes sont partagées
  })

  it("n'écrase jamais une cellule occupée", () => {
    const rows = [
      { a: 1, b: 2, c: "=A1*B1" },
      { a: 3, b: 4, c: "=A2+B2" },
      { a: 5, b: 6, c: 42 },
    ]
    expect(withAutoFormulas(rows, columns)).toBeNull()
  })

  it("aucune formule dans la colonne → null", () => {
    expect(withAutoFormulas([{ a: 1, b: 2, c: "" }], columns)).toBeNull()
  })

  it("propage la formule vers le bas avec les références recalées", () => {
    const rows = [
      { a: 1, b: 2, c: "=A1*B1" },
      { a: 3, b: 4, c: "" },
      { a: 5, b: 6, c: "" },
    ]
    const next = withAutoFormulas(rows, columns)!
    expect(next![1]!.c).toBe("=A2*B2")
    expect(next![2]!.c).toBe("=A3*B3")
  })

  it("ligne insérée au-dessus du modèle → références recalées vers le haut", () => {
    const rows = [
      { a: 1, b: 2, c: "" },
      { a: 3, b: 4, c: "=A2*B2" },
    ]
    expect(withAutoFormulas(rows, columns)![0]!.c).toBe("=A1*B1")
  })

  it("formules par nom de colonne", () => {
    const cols = [{ name: "qty" }, { name: "price" }, { name: "total" }]
    const rows = [
      { qty: 1, price: 2, total: "=qty*price" },
      { qty: 3, price: 4, total: "" },
    ]
    expect(withAutoFormulas(rows, cols)![1]!.total).toBe("=qty*price")
  })

  it("`onlyRow` ne traite que la ligne demandée", () => {
    const rows = [
      { a: 1, b: 2, c: "=A1*B1" },
      { a: 3, b: 4, c: "" },
      { a: 5, b: 6, c: "" },
    ]
    const next = withAutoFormulas(rows, columns, { onlyRow: 2 })!
    expect(next![1]!.c).toBe("")
    expect(next![2]!.c).toBe("=A3*B3")
  })

  it("ignore une formule qui référence sa propre colonne (auto-référence)", () => {
    const rows = [
      { a: 1, b: 2, c: "=C1+A1" },
      { a: 3, b: 4, c: "" },
    ]
    expect(withAutoFormulas(rows, columns)).toBeNull()
  })

  it("un total de colonne (plage) n'est pas propagé aux lignes vides", () => {
    const rows = [
      { a: 1, b: 2, c: "=A1*B1" },
      { a: 3, b: 4, c: "=A2*B2" },
      { a: "", b: "", c: "=SUM(C1:C2)" },
    ]
    expect(withAutoFormulas(rows, columns)).toBeNull()
  })
})
