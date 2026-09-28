// Tests unitaires du clavier numérique : disposition des touches et règles de saisie.
import { describe, expect, it } from "bun:test"
import {
  applyDigitOrder,
  decimalCount,
  digitCount,
  keypadDigits,
  keypadLayout,
  pressKey,
  pressKeys,
  shuffledDigits,
} from "./numericKeyboard"

describe("keypadLayout", () => {
  it("rend 12 touches, 1-9 puis 0 et l'effacement", () => {
    const keys = keypadLayout()
    expect(keys).toHaveLength(12)
    expect(keys.slice(0, 9).map((k) => k.key)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ])
    expect(keys[9]!.kind).toBe("empty")
    expect(keys[10]!.key).toBe("0")
    expect(keys[11]).toMatchObject({ key: "backspace", kind: "backspace", label: "⌫" })
  })

  it("met « C » dans la case libre en mode numeric + clearable", () => {
    const keys = keypadLayout({ clearable: true })
    expect(keys[9]).toMatchObject({ key: "clear", label: "C", kind: "clear" })
  })

  it("met le séparateur décimal en mode decimal (et jamais de C)", () => {
    const keys = keypadLayout({ mode: "decimal", clearable: true })
    expect(keys[9]).toMatchObject({ key: "separator", label: ",", kind: "separator" })
    expect(keys.some((k) => k.kind === "clear")).toBe(false)
  })

  it("affiche le séparateur demandé", () => {
    expect(keypadLayout({ mode: "decimal", decimalSeparator: "." })[9]!.label).toBe(".")
    expect(keypadLayout({ mode: "decimal", decimalSeparator: "." })[9]!.ariaLabel).toContain(".")
  })
})

describe("compteurs", () => {
  it("compte les chiffres, séparateur exclu", () => {
    expect(digitCount("12,50")).toBe(4)
    expect(digitCount("")).toBe(0)
  })

  it("compte les décimales saisies", () => {
    expect(decimalCount("12,5")).toBe(1)
    expect(decimalCount("12,")).toBe(0)
    expect(decimalCount("12")).toBe(-1)
  })
})

describe("pressKey — chiffres", () => {
  it("ajoute les chiffres bout à bout", () => {
    expect(pressKeys("", ["1", "2", "3"])).toBe("123")
  })

  it("conserve les zéros de tête en mode numeric (code, téléphone)", () => {
    expect(pressKeys("", ["0", "4", "0", "6"])).toBe("0406")
  })

  it("remplace le « 0 » seul en mode decimal (montant)", () => {
    expect(pressKeys("", ["0", "5"], { mode: "decimal" })).toBe("5")
    expect(pressKeys("", ["0", "5"], { mode: "numeric" })).toBe("05")
    // … mais pas derrière le séparateur : « 0,5 » reste « 0,5 »
    expect(pressKeys("0,", ["5"], { mode: "decimal" })).toBe("0,5")
  })

  it("respecte maxLength (en chiffres), quel que soit le séparateur", () => {
    expect(pressKeys("", ["1", "2", "3", "4"], { maxLength: 3 })).toBe("123")
    expect(pressKeys("12", ["3"], { maxLength: 3, mode: "decimal" })).toBe("123")
    // Le séparateur ne compte pas : « 12,5 » = 3 chiffres, le 4e est refusé si maxLength = 3
    expect(pressKeys("12,5", ["9"], { maxLength: 3, mode: "decimal" })).toBe("12,5")
    expect(pressKeys("12,5", ["9"], { maxLength: 4, mode: "decimal" })).toBe("12,59")
  })

  it("ignore les touches inconnues", () => {
    expect(pressKey("12", "abc")).toBe("12")
  })
})

describe("pressKey — séparateur, décimales", () => {
  it("n'accepte le séparateur qu'une fois, jamais en mode numeric", () => {
    expect(pressKeys("", ["separator", "separator"], { mode: "decimal" })).toBe("0,")
    expect(pressKeys("12", ["separator"], { mode: "decimal" })).toBe("12,")
    expect(pressKeys("12", ["separator"], { mode: "numeric" })).toBe("12")
  })

  it("pose « 0, » quand le champ est vide", () => {
    expect(pressKey("", "separator", { mode: "decimal" })).toBe("0,")
  })

  it("borne les décimales avec maxDecimals", () => {
    expect(pressKeys("12,", ["5", "0", "9"], { mode: "decimal", maxDecimals: 2 })).toBe("12,50")
    expect(pressKey("12,5", "separator", { mode: "decimal", maxDecimals: 0 })).toBe("12,5")
  })

  it("suit le séparateur demandé", () => {
    expect(pressKeys("", ["1", "separator", "5"], { mode: "decimal", decimalSeparator: "." })).toBe(
      "1.5",
    )
  })
})

describe("pressKey — effacement", () => {
  it("retire le dernier caractère, puis vide", () => {
    expect(pressKeys("123", ["backspace", "backspace"])).toBe("1")
    expect(pressKey("1", "backspace")).toBe("")
    expect(pressKey("", "backspace")).toBe("")
  })

  it("efface tout avec clear", () => {
    expect(pressKey("12,50", "clear")).toBe("")
  })

  it("permet de repartir après un effacement complet", () => {
    expect(pressKeys("123", ["clear", "7"])).toBe("7")
  })
})

describe("disposition aléatoire", () => {
  /** Générateur congruentiel linéaire : une suite reproductible pour les tests */
  const seeded = (seed: number) => {
    let state = seed
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296
      return state / 4294967296
    }
  }

  it("mélange les dix chiffres, sans perte ni doublon", () => {
    const order = shuffledDigits()
    expect([...order].sort()).toEqual([...keypadDigits].sort())
    expect(new Set(order).size).toBe(10)
  })

  it("est reproductible pour une graine donnée", () => {
    expect(shuffledDigits(seeded(7))).toEqual(shuffledDigits(seeded(7)))
  })

  it("ne retombe pas sur l'ordre canonique avec un vrai aléa", () => {
    const canonical = keypadDigits.join("")
    const identical = Array.from({ length: 100 }, () => shuffledDigits().join("")).filter(
      (order) => order === canonical,
    )
    expect(identical).toHaveLength(0)
  })

  it("répartit les chiffres dans les cellules et laisse les touches d'édition", () => {
    const base = keypadLayout({ mode: "decimal" })
    const order = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"]
    const shuffled = applyDigitOrder(base, order)

    expect(shuffled[0]).toMatchObject({ key: "9", kind: "digit" })
    expect(shuffled[8]).toMatchObject({ key: "1", kind: "digit" })
    expect(shuffled[10]).toMatchObject({ key: "0", kind: "digit" })
    // Le séparateur (case 9) et l'effacement (case 11) ne bougent pas
    expect(shuffled[9]).toMatchObject({ key: "separator", kind: "separator" })
    expect(shuffled[11]).toMatchObject({ key: "backspace", kind: "backspace" })
  })

  it("garde dix touches chiffre et les touches spéciales en place (clearable)", () => {
    const shuffled = applyDigitOrder(keypadLayout({ clearable: true }), shuffledDigits(seeded(3)))
    expect(shuffled.filter((k) => k.kind === "digit")).toHaveLength(10)
    expect(shuffled[9]!.kind).toBe("clear")
    expect(shuffled[11]!.kind).toBe("backspace")
  })
})
