// Tests unitaires du padding utilisateur de QPage (prop `padding`).
import { describe, expect, it } from "bun:test"
import { PAGE_PADDING, resolvePagePadding } from "./pagePadding"

describe("resolvePagePadding", () => {
  it("applique 14px sur la prop booléenne (modifier)", () => {
    expect(resolvePagePadding(true)).toBe(PAGE_PADDING)
    expect(resolvePagePadding(true)).toBe("14px")
  })

  it("n'applique aucun padding si la prop est absente ou fausse", () => {
    expect(resolvePagePadding()).toBeUndefined()
    expect(resolvePagePadding(false)).toBeUndefined()
    expect(resolvePagePadding("")).toBeUndefined()
    expect(resolvePagePadding("   ")).toBeUndefined()
    expect(resolvePagePadding(null)).toBeUndefined()
  })

  it("rend la valeur CSS explicite telle quelle", () => {
    expect(resolvePagePadding("12px")).toBe("12px")
    expect(resolvePagePadding(" 2rem ")).toBe("2rem")
    // Plusieurs valeurs : la prop reste une longueur CSS quelconque
    expect(resolvePagePadding("12px 24px")).toBe("12px 24px")
  })

  it("ajoute l'unité manquante (une longueur nue invaliderait le calc())", () => {
    expect(resolvePagePadding("12")).toBe("12px")
    expect(resolvePagePadding("1.5")).toBe("1.5px")
    expect(resolvePagePadding(18)).toBe("18px")
    expect(resolvePagePadding(0)).toBe("0px")
  })

  it("ignore les nombres non finis", () => {
    expect(resolvePagePadding(Number.NaN)).toBeUndefined()
    expect(resolvePagePadding(Number.POSITIVE_INFINITY)).toBeUndefined()
  })
})
