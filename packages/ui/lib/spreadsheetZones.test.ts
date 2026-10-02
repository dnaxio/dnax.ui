// Tests unitaires des **zones** de QSpreadsheet (`lib/spreadsheetZones.ts`) : la traduction de la
// forme **lisible** (noms de colonnes) vers les rectangles d'index, et le préremplissage.
import { describe, expect, it } from "bun:test"
import { inLockRect, lockRect, lockRects, prefillForRow } from "./spreadsheetZones"

/** Colonnes : task(0) · total(1) · status(2) */
const cols = ["task", "total", "status"]
const colIndex = (name: string) => cols.indexOf(name)

describe("lockRect", () => {
  it("une cellule : `{ row, column }`", () => {
    expect(lockRect({ row: 2, column: "total" }, colIndex)).toEqual({
      r0: 2,
      c0: 1,
      r1: 2,
      c1: 1,
    })
  })

  it("toute une ligne : `{ row }` (colonnes non bornées)", () => {
    expect(lockRect({ row: 0 }, colIndex)).toEqual({ r0: 0, c0: null, r1: 0, c1: null })
  })

  it("toute une colonne : `{ column }` (lignes non bornées)", () => {
    expect(lockRect({ column: "total" }, colIndex)).toEqual({
      r0: null,
      c0: 1,
      r1: null,
      c1: 1,
    })
  })

  it("un bloc : `{ from, to }` (bornes incluses)", () => {
    expect(
      lockRect(
        { from: { row: 0, column: "task" }, to: { row: 2, column: "status" } },
        colIndex,
      ),
    ).toEqual({ r0: 0, c0: 0, r1: 2, c1: 2 })
  })

  it("un bloc `from`/`to` dans n'importe quel ordre", () => {
    expect(
      lockRect(
        { from: { row: 3, column: "status" }, to: { row: 1, column: "task" } },
        colIndex,
      ),
    ).toEqual({ r0: 1, c0: 0, r1: 3, c1: 2 })
  })

  it("ignore ce qui ne désigne rien (objet vide, colonne inconnue, from sans to)", () => {
    expect(lockRect({}, colIndex)).toBeNull()
    expect(lockRect({ row: 1, column: "nope" }, colIndex)).toBeNull()
    expect(lockRect({ from: { row: 0, column: "task" } }, colIndex)).toBeNull()
    expect(lockRect(undefined, colIndex)).toBeNull()
  })
})

describe("lockRects", () => {
  it("résout la liste et ignore les verrous invalides", () => {
    expect(lockRects([{ row: 0 }, { column: "nope" }, { row: 1, column: "task" }], colIndex)).toEqual(
      [
        { r0: 0, c0: null, r1: 0, c1: null },
        { r0: 1, c0: 0, r1: 1, c1: 0 },
      ],
    )
  })

  it("tolère une entrée non-tableau", () => {
    expect(lockRects(undefined, colIndex)).toEqual([])
  })
})

describe("inLockRect", () => {
  const rect = { r0: 1, c0: 1, r1: 2, c1: 1 }

  it("borne inclusivement", () => {
    expect(inLockRect(rect, 1, 1)).toBe(true)
    expect(inLockRect(rect, 2, 1)).toBe(true)
    expect(inLockRect(rect, 0, 1)).toBe(false)
    expect(inLockRect(rect, 3, 1)).toBe(false)
    expect(inLockRect(rect, 1, 0)).toBe(false)
    expect(inLockRect(rect, 1, 2)).toBe(false)
  })

  it("une borne `null` est non bornée", () => {
    expect(inLockRect({ r0: null, c0: 1, r1: null, c1: 1 }, 999, 1)).toBe(true)
    expect(inLockRect({ r0: 0, c0: null, r1: 0, c1: null }, 0, 999)).toBe(true)
  })
})

describe("prefillForRow", () => {
  const names = ["task", "total", "status"]

  it("toute la colonne : la valeur est posée sur chaque ligne", () => {
    const fills = [{ column: "status", value: "todo" }]
    expect(prefillForRow(fills, 0, names)).toEqual({ status: "todo" })
    expect(prefillForRow(fills, 7, names)).toEqual({ status: "todo" })
  })

  it("une cellule : seulement la ligne visée", () => {
    const fills = [{ row: 2, column: "total", value: 0 }]
    expect(prefillForRow(fills, 2, names)).toEqual({ total: 0 })
    expect(prefillForRow(fills, 1, names)).toEqual({})
  })

  it("toute une ligne : toutes les colonnes", () => {
    expect(prefillForRow([{ row: 1, value: "—" }], 1, names)).toEqual({
      task: "—",
      total: "—",
      status: "—",
    })
  })

  it("un bloc : les colonnes et lignes couvertes", () => {
    const fills = [
      { from: { row: 0, column: "total" }, to: { row: 1, column: "status" }, value: false },
    ]
    expect(prefillForRow(fills, 0, names)).toEqual({ total: false, status: false })
    expect(prefillForRow(fills, 1, names)).toEqual({ total: false, status: false })
    expect(prefillForRow(fills, 2, names)).toEqual({})
  })

  it("cumule plusieurs zones (la dernière gagne) et ignore l'inconnu", () => {
    expect(
      prefillForRow(
        [
          { column: "status", value: "todo" },
          { row: 0, column: "status", value: "urgent" },
          { column: "nope", value: 1 },
        ],
        0,
        names,
      ),
    ).toEqual({ status: "urgent" })
  })

  it("tolère une entrée vide ou non-tableau", () => {
    expect(prefillForRow(undefined, 0, names)).toEqual({})
    expect(prefillForRow([], 0, names)).toEqual({})
    expect(prefillForRow([{ column: "task", value: 1 }], 0, [])).toEqual({})
  })
})

describe("prefillForRow — value fonction (valeurs dynamiques)", () => {
  const names = ["task", "effectif", "net"]

  it("appelle la fonction avec le contexte (lettre, index, taille du document)", () => {
    const seen: any[] = []
    const fills = [
      {
        row: 1,
        column: "net",
        value: (ctx: any) => {
          seen.push(ctx)
          const L = ctx.letterOf("effectif")
          return `=SUM(${L}1:${L}${ctx.rowCount})`
        },
      },
    ]
    expect(prefillForRow(fills, 1, names, { rowCount: 4 })).toEqual({ net: "=SUM(B1:B4)" })
    expect(seen[0]).toMatchObject({
      rowIndex: 1,
      column: "net",
      columnIndex: 2,
      letter: "C",
      rowCount: 4,
    })
    expect(seen[0].letterOf("effectif")).toBe("B")
  })

  it("reçoit la ligne ciblée (agrégat calculé, pas une formule)", () => {
    const fills = [{ row: 0, column: "net", value: (ctx: any) => Number(ctx.row.effectif) * 2 }]
    expect(prefillForRow(fills, 0, names, { row: { effectif: 21 } })).toEqual({ net: 42 })
  })

  it("une chaîne de formule constante passe telle quelle", () => {
    expect(prefillForRow([{ row: 0, column: "net", value: "=B1*2" }], 0, names)).toEqual({
      net: "=B1*2",
    })
  })

  it("une value **fonction** peut renvoyer une formule", () => {
    const fills = [
      {
        row: 0,
        column: "net",
        value: (ctx: any) => `=SUM(${ctx.letterOf("effectif")}1:${ctx.letterOf("effectif")}${ctx.rowCount})`,
      },
    ]
    expect(prefillForRow(fills, 0, names, { rowCount: 3 })).toEqual({ net: "=SUM(B1:B3)" })
  })

  it("value reste littéral (pas de normalisation du préfixe `=`)", () => {
    expect(prefillForRow([{ row: 0, column: "net", value: "SUM(B1:B2)" }], 0, names)).toEqual({
      net: "SUM(B1:B2)",
    })
  })
})

describe("prefillForRow — fx (formule prioritaire)", () => {
  const names = ["task", "effectif", "net"]

  it("fx accepte une formule sans préfixe `=` (normalisée)", () => {
    expect(prefillForRow([{ row: 0, column: "net", fx: "SUM(B1:B2)" }], 0, names)).toEqual({
      net: "=SUM(B1:B2)",
    })
    expect(prefillForRow([{ row: 0, column: "net", fx: "=B1*2" }], 0, names)).toEqual({
      net: "=B1*2",
    })
  })

  it("fx est prioritaire sur value", () => {
    expect(
      prefillForRow([{ row: 0, column: "net", value: 42, fx: "B1*2" }], 0, names),
    ).toEqual({ net: "=B1*2" })
  })

  it("fx fonction reçoit le contexte et peut être dynamique", () => {
    const fills = [
      {
        row: 0,
        column: "net",
        fx: (ctx: any) => {
          const L = ctx.letterOf("effectif")
          return `SUM(${L}1:${L}${ctx.rowCount - 1})`
        },
      },
    ]
    expect(prefillForRow(fills, 0, names, { rowCount: 3 })).toEqual({ net: "=SUM(B1:B2)" })
  })

  it("un fx vide retombe sur value ; sinon rien n'est posé", () => {
    expect(prefillForRow([{ row: 0, column: "net", fx: "  ", value: 7 }], 0, names)).toEqual({
      net: 7,
    })
    expect(prefillForRow([{ row: 0, column: "net" }], 0, names)).toEqual({})
  })
})
