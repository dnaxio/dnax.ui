// Tests unitaires du suivi des modifications du tableur (delta référence → état courant).
import { describe, expect, it } from "bun:test"
import {
  deepEqual,
  diffDocuments,
  diffRows,
  diffSheets,
  sameCellValue,
  type QSpreadsheetDocumentPayload,
} from "./spreadsheetChanges"

describe("sameCellValue", () => {
  it("tient « vide » pour équivalent (null / undefined / \"\")", () => {
    expect(sameCellValue(null, undefined)).toBe(true)
    expect(sameCellValue("", null)).toBe(true)
    expect(sameCellValue("", "")).toBe(true)
    // … mais une valeur effacée n'est pas « identique » à une valeur présente
    expect(sameCellValue(null, 0)).toBe(false)
    expect(sameCellValue("", "x")).toBe(false)
  })

  it("compare les primitives, NaN compris", () => {
    expect(sameCellValue(18.5, 18.5)).toBe(true)
    expect(sameCellValue("a", "b")).toBe(false)
    expect(sameCellValue(NaN, NaN)).toBe(true)
    expect(sameCellValue(0, false)).toBe(false)
  })

  it("compare les tableaux (multiselect) élément par élément", () => {
    expect(sameCellValue(["a", "b"], ["a", "b"])).toBe(true)
    expect(sameCellValue(["a", "b"], ["b", "a"])).toBe(false)
    expect(sameCellValue(["a"], ["a", "b"])).toBe(false)
    expect(sameCellValue([], [])).toBe(true)
  })
})

describe("deepEqual", () => {
  it("ignore l'ordre des clés (records reconstruits)", () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  it("respecte l'ordre des tableaux et descend en profondeur", () => {
    expect(deepEqual([1, 2], [1, 2])).toBe(true)
    expect(deepEqual([1, 2], [2, 1])).toBe(false)
    expect(deepEqual({ a: { b: [1, { c: 2 }] } }, { a: { b: [1, { c: 2 }] } })).toBe(true)
    expect(deepEqual({ a: { b: [1, { c: 2 }] } }, { a: { b: [1, { c: 3 }] } })).toBe(false)
  })
})

const row = (key: string, values: Record<string, any> = {}) => ({ _key: key, ...values })

describe("diffRows", () => {
  it("sépare ajoutées / modifiées / supprimées", () => {
    const before = [row("a", { name: "Ada" }), row("b", { name: "Grace" })]
    const after = [row("a", { name: "Ada" }), row("c", { name: "Alan" })]
    const delta = diffRows(before, after, { columns: ["name"], sheet: "s1" })
    expect(delta.added.map((r) => r.key)).toEqual(["c"])
    expect(delta.deleted.map((r) => r.key)).toEqual(["b"])
    expect(delta.updated).toHaveLength(0)
    expect(delta.added[0]).toMatchObject({ sheet: "s1", row: { name: "Alan" } })
  })

  it("identifie par `_key` : un réordonnancement n'est pas une modification", () => {
    const before = [row("a", { n: 1 }), row("b", { n: 2 })]
    const after = [row("b", { n: 2 }), row("a", { n: 1 })]
    const delta = diffRows(before, after, { columns: ["n"] })
    expect(delta.added).toHaveLength(0)
    expect(delta.deleted).toHaveLength(0)
    expect(delta.updated).toHaveLength(0)
  })

  it("liste les colonnes modifiées", () => {
    const delta = diffRows(
      [row("a", { name: "Ada", age: 36, city: "London" })],
      [row("a", { name: "Ada", age: 37, city: "London" })],
      { columns: ["name", "age", "city"] },
    )
    expect(delta.updated).toHaveLength(1)
    expect(delta.updated[0]!.columns).toEqual(["age"])
    expect(delta.updated[0]!.before).toMatchObject({ age: 36 })
    expect(delta.updated[0]!.row).toMatchObject({ age: 37 })
  })

  it("ne compare que le schéma courant (colonne supprimée / ajoutée vide)", () => {
    // colonne supprimée : le schéma ne la contient plus → aucune ligne « modifiée »
    const removed = diffRows(
      [row("a", { name: "Ada", gone: 5 })],
      [row("a", { name: "Ada" })],
      { columns: ["name"] },
    )
    expect(removed.updated).toHaveLength(0)
    // colonne ajoutée vide : "" vs absence = « vide » des deux côtés → rien non plus
    const added = diffRows([row("a", { name: "Ada" })], [row("a", { name: "Ada", extra: "" })], {
      columns: ["name", "extra"],
    })
    expect(added.updated).toHaveLength(0)
  })

  it("compare les valeurs de type tableau (multiselect)", () => {
    const delta = diffRows(
      [row("a", { tags: ["design", "docs"] })],
      [row("a", { tags: ["design", "backend"] })],
      { columns: ["tags"] },
    )
    expect(delta.updated[0]!.columns).toEqual(["tags"])
  })

  it("sans schéma déclaré, compare les clés des lignes (`_key` exclue)", () => {
    const delta = diffRows([row("a", { n: 1 })], [row("a", { n: 2 })])
    expect(delta.updated[0]!.columns).toEqual(["n"])
  })

  it("ignore les lignes sans clé (non identifiables)", () => {
    const delta = diffRows([{ n: 1 }], [{ n: 1 }])
    expect(delta.added).toHaveLength(0)
    expect(delta.deleted).toHaveLength(0)
  })
})

describe("diffSheets", () => {
  const sheet = (key: string, name: string, columns?: any[]) => ({ key, name, columns, rows: [] })

  it("sépare ajoutées / supprimées", () => {
    const delta = diffSheets([sheet("a", "A")], [sheet("a", "A"), sheet("b", "B")])
    expect(delta.added.map((s) => s.key)).toEqual(["b"])
    expect(delta.deleted).toHaveLength(0)

    const back = diffSheets([sheet("a", "A"), sheet("b", "B")], [sheet("a", "A")])
    expect(back.deleted.map((s) => s.key)).toEqual(["b"])
    expect(back.added).toHaveLength(0)
  })

  it("détecte un renommage et un changement de schéma", () => {
    const renamed = diffSheets([sheet("a", "A")], [sheet("a", "B")])
    expect(renamed.updated[0]).toMatchObject({ key: "a", changed: ["name"] })

    const schema = diffSheets(
      [sheet("a", "A", ["x"])],
      [sheet("a", "A", ["x", "y"])],
    )
    expect(schema.updated[0]!.changed).toEqual(["columns"])
  })

  it("ne signale rien quand la feuille est inchangée", () => {
    const delta = diffSheets([sheet("a", "A", ["x"])], [sheet("a", "A", ["x"])])
    expect(delta.added).toHaveLength(0)
    expect(delta.updated).toHaveLength(0)
    expect(delta.deleted).toHaveLength(0)
  })
})

describe("diffDocuments", () => {
  const doc = (over: Partial<QSpreadsheetDocumentPayload> = {}): QSpreadsheetDocumentPayload => ({
    version: 1,
    active: "s1",
    sheets: [{ key: "s1", name: "One", columns: ["name", "age"], rows: [row("a", { name: "Ada", age: 36 })] }],
    ...over,
  })

  it("référence identique → rien de modifié", () => {
    const changes = diffDocuments(doc(), doc())
    expect(changes.dirty).toBe(false)
    expect(changes.count).toBe(0)
    expect(changes.rows.added).toHaveLength(0)
    expect(changes.extras).toEqual([])
  })

  it("sans référence → aucun delta (pas de faux positif)", () => {
    expect(diffDocuments(null, doc()).dirty).toBe(false)
  })

  it("une cellule modifiée → ligne mise à jour, avec sa feuille et sa colonne", () => {
    const after = doc()
    after.sheets![0]!.rows = [row("a", { name: "Ada", age: 37 })]
    const changes = diffDocuments(doc(), after)
    expect(changes.dirty).toBe(true)
    expect(changes.count).toBe(1)
    expect(changes.rows.updated[0]).toMatchObject({ sheet: "s1", key: "a", columns: ["age"] })
  })

  it("changer d'onglet actif n'est pas une modification", () => {
    const before = doc({ active: "s1" })
    const after = doc({ active: "s1" })
    after.active = "s1"
    expect(diffDocuments(before, after).dirty).toBe(false)
    // et une valeur `active` différente non plus
    expect(diffDocuments(doc({ active: "s1" }), doc({ active: "s9" })).dirty).toBe(false)
  })

  it("une mise en forme seule rend le document modifié (extras)", () => {
    const before = doc()
    const after = doc()
    ;(after.sheets![0] as any).formats = { "0:name": { bold: true } }
    const changes = diffDocuments(before, after)
    expect(changes.dirty).toBe(true)
    expect(changes.rows.updated).toHaveLength(0)
    expect(changes.extras).toEqual(["formats"])
    // … et elle compte pour un élément (indicateur « 1 modified »)
    expect(changes.count).toBe(1)
  })

  it("feuille ajoutée : portée par `sheets.added`, ses lignes ne sont pas répétées dans `rows`", () => {
    const after = doc()
    after.sheets!.push({ key: "s2", name: "Two", columns: ["name"], rows: [row("z", { name: "Zoe" })] })
    const changes = diffDocuments(doc(), after)
    expect(changes.sheets.added.map((s) => s.key)).toEqual(["s2"])
    expect(changes.rows.added).toHaveLength(0)
    expect(changes.count).toBe(1)
  })

  it("feuille supprimée : portée par `sheets.deleted`", () => {
    const before = doc()
    before.sheets!.push({ key: "s2", name: "Two", columns: ["name"], rows: [row("z", { name: "Zoe" })] })
    const changes = diffDocuments(before, doc())
    expect(changes.sheets.deleted.map((s) => s.key)).toEqual(["s2"])
    expect(changes.rows.deleted).toHaveLength(0)
  })

  it("colonne supprimée : changement de schéma, pas de bruit sur les lignes", () => {
    const before = doc()
    before.sheets![0]!.columns = ["name", "age"]
    const after = doc()
    after.sheets![0]!.columns = ["name"]
    after.sheets![0]!.rows = [row("a", { name: "Ada" })]
    const changes = diffDocuments(before, after)
    expect(changes.sheets.updated[0]!.changed).toEqual(["columns"])
    expect(changes.rows.updated).toHaveLength(0)
  })
})
