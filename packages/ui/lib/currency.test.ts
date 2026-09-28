// Tests unitaires de la saisie/formatage des montants (`<q-input-currency>`).
import { describe, expect, it } from "bun:test"
import {
  applyLimits,
  caretForDigitCount,
  currencyFormat,
  digitCountBefore,
  draftValue,
  formatAmount,
  formatDraft,
  localeOf,
  parseAmount,
  roundTo,
  stepValue,
} from "./currency"

/** Neutralise les différentes espaces de groupement (fine insécable selon ICU) */
const plain = (text: string) => text.replace(/[\s\u00a0\u202f]/g, " ")

describe("localeOf", () => {
  it("déduit la locale de la langue du design system", () => {
    expect(localeOf("fr")).toBe("fr-FR")
    expect(localeOf("en")).toBe("en-US")
  })

  it("garde une locale complète et retombe sur en-US", () => {
    expect(localeOf("de-DE")).toBe("de-DE")
    expect(localeOf()).toBe("en-US")
  })
})

describe("currencyFormat", () => {
  it("lit séparateurs et devise de la locale français", () => {
    const format = currencyFormat({ locale: "fr-FR", currency: "EUR" })

    expect(format.decimal).toBe(",")
    expect(format.symbol).toBe("€")
    expect(format.position).toBe("after")
    expect(format.spaced).toBe(true)
    expect(format.decimals).toBe(2)
    expect(/[\s\u00a0\u202f]/.test(format.group)).toBe(true)
  })

  it("lit les conventions anglo-saxonnes", () => {
    const format = currencyFormat({ locale: "en-US", currency: "USD" })

    expect(format.decimal).toBe(".")
    expect(format.group).toBe(",")
    expect(format.symbol).toBe("$")
    expect(format.position).toBe("before")
    expect(format.spaced).toBe(false)
  })

  it("prend les décimales de la devise, surchargeables", () => {
    expect(currencyFormat({ locale: "fr-FR", currency: "JPY" }).decimals).toBe(0)
    expect(currencyFormat({ locale: "fr-FR", currency: "EUR", decimals: 3 }).decimals).toBe(3)
    expect(currencyFormat({ locale: "fr-FR" }).decimals).toBe(2)
  })

  it("suit le mode d'affichage demandé", () => {
    expect(currencyFormat({ locale: "fr-FR", currency: "EUR", currencyDisplay: "code" }).symbol).toBe("EUR")
    expect(
      plain(currencyFormat({ locale: "fr-FR", currency: "EUR", currencyDisplay: "name" }).symbol),
    ).toContain("euro")
  })

  it("reste utilisable sans devise et ne jette pas sur une devise inconnue", () => {
    const bare = currencyFormat({ locale: "fr-FR" })
    expect(bare.symbol).toBe("")
    expect(bare.position).toBe("after")

    // Un code inconnu n'est pas une erreur pour `Intl` : il ressort tel quel
    const bogus = currencyFormat({ locale: "fr-FR", currency: "ZZZ" })
    expect(bogus.currency).toBe("ZZZ")
    expect(bogus.symbol).toBe("ZZZ")
  })
})

describe("parseAmount", () => {
  const fr = { locale: "fr-FR", currency: "EUR", allowNegative: true } as const
  const en = { locale: "en-US", currency: "USD", allowNegative: true } as const

  it("garde les chiffres et le séparateur de la locale", () => {
    expect(parseAmount("1 234,56", fr)).toEqual({
      negative: false,
      integer: "1234",
      fraction: "56",
      hasSeparator: true,
    })
  })

  it("borne le nombre de décimales", () => {
    expect(parseAmount("12,3456", fr).fraction).toBe("34")
    expect(parseAmount("12,3456", { ...fr, decimals: 3 }).fraction).toBe("345")
  })

  it("accepte l'autre séparateur quand il est sans ambiguïté", () => {
    // Collage d'une valeur anglo-saxonne, saisie au point en français
    expect(draftValue(parseAmount("$1,234.56", en))).toBe(1234.56)
    expect(draftValue(parseAmount("1.234,56 €", fr))).toBe(1234.56)
    expect(draftValue(parseAmount("1.5", fr))).toBe(1.5)
    expect(draftValue(parseAmount("12,50", en))).toBe(12.5)
    // Trop de chiffres après le point en français → c'est un séparateur de groupe
    expect(parseAmount("1.234", fr).integer).toBe("1234")
    expect(parseAmount("1.234", fr).hasSeparator).toBe(false)
  })

  it("gère le signe selon allowNegative", () => {
    expect(parseAmount("-12,5", fr).negative).toBe(true)
    expect(parseAmount("-12,5", { ...fr, allowNegative: false }).negative).toBe(false)
    expect(parseAmount("12-5", fr).integer).toBe("125")
  })

  it("ignore tout le reste (lettres, devise, espaces)", () => {
    expect(parseAmount("12 abc 345", fr).integer).toBe("12345")
    expect(parseAmount("", fr)).toEqual({ negative: false, integer: "", fraction: "", hasSeparator: false })
  })
})

describe("draftValue / formatDraft / formatAmount", () => {
  const fr = { locale: "fr-FR", currency: "EUR" } as const
  const en = { locale: "en-US", currency: "USD" } as const

  it("rend null tant que rien n'est saisi", () => {
    expect(draftValue(parseAmount("", fr))).toBeNull()
    expect(draftValue(parseAmount("-", fr))).toBeNull()
    expect(draftValue(parseAmount(",", fr))).toBeNull()
    expect(draftValue(parseAmount("0", fr))).toBe(0)
    expect(draftValue(parseAmount("0,05", fr))).toBe(0.05)
  })

  it("groupe les milliers et conserve le séparateur final", () => {
    expect(plain(formatDraft(parseAmount("1234", fr), fr))).toBe("1 234")
    expect(plain(formatDraft(parseAmount("1234,", fr), fr))).toBe("1 234,")
    expect(plain(formatDraft(parseAmount("1234,5", fr), fr))).toBe("1 234,5")
    expect(formatDraft(parseAmount("1234567.89", en), en)).toBe("1,234,567.89")
  })

  it("formate un montant avec ses décimales complètes", () => {
    expect(plain(formatAmount(1234.5, fr))).toBe("1 234,50")
    expect(formatAmount(1234.5, en)).toBe("1,234.50")
    expect(plain(formatAmount(-12.5, fr))).toBe("-12,50")
    expect(plain(formatAmount(1234.5, { locale: "fr-FR", currency: "JPY" }))).toBe("1 235")
    expect(formatAmount(null, fr)).toBe("")
  })
})

describe("roundTo / applyLimits / stepValue", () => {
  const fr = { locale: "fr-FR", currency: "EUR" } as const

  it("arrondit sans erreur binaire", () => {
    expect(roundTo(1.005, 2)).toBe(1.01)
    expect(roundTo(12.345, 2)).toBe(12.35)
    expect(roundTo(2.675, 2)).toBe(2.68)
    expect(roundTo(1234.5, 0)).toBe(1235)
  })

  it("applique l'arrondi de la devise puis les bornes", () => {
    expect(applyLimits(1.005, fr)).toBe(1.01)
    expect(applyLimits(12.5, { ...fr, max: 10 })).toBe(10)
    expect(applyLimits(-3, { ...fr, min: 0 })).toBe(0)
    expect(applyLimits(null, fr)).toBeNull()
  })

  it("avance par pas, en bornant", () => {
    expect(stepValue(10, 1, 1, false, fr)).toBe(11)
    expect(stepValue(10, 0.5, -1, false, fr)).toBe(9.5)
    expect(stepValue(null, 1, 1, false, fr)).toBe(1)
    expect(stepValue(10, 1, 1, true, fr)).toBe(20)
    expect(stepValue(10, 1, 1, false, { ...fr, max: 10 })).toBe(10)
  })
})

describe("curseur", () => {
  it("compte les chiffres avant une position", () => {
    expect(digitCountBefore("1 234,56", 3)).toBe(2)
    expect(digitCountBefore("1 234,56", 0)).toBe(0)
    expect(digitCountBefore("1 234,56", 99)).toBe(6)
  })

  it("replace le curseur après n chiffres, même après reformatage", () => {
    expect(caretForDigitCount("1 234", 2)).toBe(3)
    expect(caretForDigitCount("12 345", 6)).toBe(6)
    expect(caretForDigitCount("1 234", 0)).toBe(0)
    expect(caretForDigitCount("1 234", 99)).toBe(5)
  })

  it("survit à l'ajout d'un séparateur de groupe", () => {
    // « 1234 » + « 5 » tapé après 4 chiffres → « 12 345 », curseur après le 5e chiffre
    const digits = digitCountBefore("1234", 4) + 1
    expect(caretForDigitCount(plain("12 345"), digits)).toBe(6)
  })
})
