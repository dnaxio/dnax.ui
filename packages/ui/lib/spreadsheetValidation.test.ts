// Tests unitaires de la validation de colonne de QSpreadsheet (`lib/spreadsheetValidation.ts`).
// L'accès à ArkType est **injecté** : on teste l'ordonnancement des règles sans bundler
// ni navigateur, et on vérifie qu'une expression est bien transmise telle quelle.
import { describe, expect, it } from "bun:test"
import { checkValidation, normalizeValidation, type ArkCheck } from "./spreadsheetValidation"

/** Faux ArkType : échoue pour toute valeur >= 4 (comme une règle `"number < 4"`). */
const fakeArk: ArkCheck = async (schema, value) =>
  schema === "number < 4" && typeof value === "number" && value >= 4 ? "must be < 4" : null

const noArk: ArkCheck = async () => {
  throw new Error("arkCheck ne devait pas être appelé")
}

describe("normalizeValidation", () => {
  it("une chaîne devient un schéma ArkType", () => {
    expect(normalizeValidation("number < 4")).toEqual({ schema: "number < 4" })
  })

  it("un objet est laissé tel quel", () => {
    const rule = { min: 0, max: 10 }
    expect(normalizeValidation(rule)).toBe(rule)
  })

  it("undefined → undefined", () => {
    expect(normalizeValidation(undefined)).toBeUndefined()
  })
})

describe("checkValidation — expression directe (« number < 4 »)", () => {
  it("transmet l'expression à ArkType et remonte son message", async () => {
    expect(await checkValidation("number < 4", 3, fakeArk)).toBeNull()
    expect(await checkValidation("number < 4", 4, fakeArk)).toBe("must be < 4")
  })

  it("`message` surcharge le message d'ArkType", async () => {
    const rule = { schema: "number < 4", message: "Trop grand" }
    expect(await checkValidation(rule, 9, fakeArk)).toBe("Trop grand")
  })

  it("une valeur vide passe (comme la forme objet)", async () => {
    expect(await checkValidation("number < 4", null, noArk)).toBeNull()
    expect(await checkValidation("number < 4", "", noArk)).toBeNull()
  })

  it("`required` refuse le vide **avant** d'appeler ArkType", async () => {
    expect(await checkValidation({ required: true, schema: "number < 4" }, null, noArk)).toBe(
      "Required",
    )
  })
})

describe("checkValidation — règle objet", () => {
  it("sans règle → null", async () => {
    expect(await checkValidation(undefined, 42, noArk)).toBeNull()
  })

  it("required + message", async () => {
    expect(await checkValidation({ required: true }, "", noArk)).toBe("Required")
    expect(await checkValidation({ required: true, message: "Obligatoire" }, [], noArk)).toBe(
      "Obligatoire",
    )
  })

  it("list : une valeur (mode simple)", async () => {
    const rule = { list: ["a", "b"] }
    expect(await checkValidation(rule, "a", noArk)).toBeNull()
    expect(await checkValidation(rule, "z", noArk)).toBe("Not in the allowed list")
  })

  it("list : chaque valeur (multiselect)", async () => {
    const rule = { list: [1, 2, 3] }
    expect(await checkValidation(rule, [1, 3], noArk)).toBeNull()
    expect(await checkValidation(rule, [1, 9], noArk)).toBe("Not in the allowed list")
  })

  it("list : compare en texte (1 ≡ « 1 »)", async () => {
    expect(await checkValidation({ list: ["1", "2"] }, 1, noArk)).toBeNull()
  })

  it("integer / min / max", async () => {
    expect(await checkValidation({ integer: true }, 2.5, noArk)).toBe("Integer required")
    expect(await checkValidation({ min: 0 }, -1, noArk)).toBe("Value below minimum (0)")
    expect(await checkValidation({ max: 100 }, 150, noArk)).toBe("Value above maximum (100)")
    expect(await checkValidation({ min: 0, max: 100 }, 42, noArk)).toBeNull()
  })

  it("min/max ne s'appliquent qu'aux nombres", async () => {
    expect(await checkValidation({ min: 0 }, "abc", noArk)).toBeNull()
  })

  it("pattern (texte seulement)", async () => {
    const rule = { pattern: "^\\d{4}$" }
    expect(await checkValidation(rule, "2026", noArk)).toBeNull()
    expect(await checkValidation(rule, "26", noArk)).toBe(
      "Value does not match the required format",
    )
    expect(await checkValidation(rule, 2026 as any, noArk)).toBeNull() // non-string : ignoré
  })

  it("le schéma est évalué en dernier (min échoue avant)", async () => {
    const rule = { min: 0, schema: "number < 4" }
    expect(await checkValidation(rule, -1, fakeArk)).toBe("Value below minimum (0)")
    expect(await checkValidation(rule, 9, fakeArk)).toBe("must be < 4")
  })
})
