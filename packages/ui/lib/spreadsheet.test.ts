// Tests unitaires des helpers purs du tableur (bun test).
import { describe, expect, it } from "bun:test"
import {
  colLetter,
  colFromLetters,
  isBlankValue,
  isoAddDays,
  shiftFormulaRefs,
  functionQueryAt,
  rankSuggestions,
  functionCallAt,
  signatureArgs,
  csvEscape,
  csvSplitLine,
  parseCsv,
  deriveCols,
} from "./spreadsheet"

describe("lettres de colonnes", () => {
  it("colLetter : 0→A, 25→Z, 26→AA, 27→AB, 701→ZZ, 702→AAA", () => {
    expect(colLetter(0)).toBe("A")
    expect(colLetter(25)).toBe("Z")
    expect(colLetter(26)).toBe("AA")
    expect(colLetter(27)).toBe("AB")
    expect(colLetter(701)).toBe("ZZ")
    expect(colLetter(702)).toBe("AAA")
  })
  it("colFromLetters est l'inverse", () => {
    expect(colFromLetters("A")).toBe(0)
    expect(colFromLetters("AA")).toBe(26)
    expect(colFromLetters("zz")).toBe(701)
    for (let i = 0; i < 200; i++) expect(colFromLetters(colLetter(i))).toBe(i)
  })
})

describe("shiftFormulaRefs (autofill)", () => {
  it("décale les références relatives de (dr,dc)", () => {
    expect(shiftFormulaRefs("=B1*C1", 1, 0)).toBe("=B2*C2")
    expect(shiftFormulaRefs("=A1", 0, 2)).toBe("=C1")
  })
  it("préserve les $ absolus", () => {
    expect(shiftFormulaRefs("=$B$1+A1", 2, 0)).toBe("=$B$1+A3")
    expect(shiftFormulaRefs("=$B1+B$1", 1, 1)).toBe("=$B2+C$1")
  })
  it("décale les plages entières", () => {
    expect(shiftFormulaRefs("=SUM(D1:D4)", 1, 0)).toBe("=SUM(D2:D5)")
  })
  it("laisse les valeurs sans lettres intactes", () => {
    expect(shiftFormulaRefs("=1+2", 1, 1)).toBe("=1+2")
  })
  it("ne touche pas aux littéraux de chaîne", () => {
    expect(shiftFormulaRefs('=IF(A1>0,"A1","x")', 1, 0)).toBe('=IF(A2>0,"A1","x")')
    expect(shiftFormulaRefs("=CONCAT('B2',A1)", 0, 1)).toBe("=CONCAT('B2',B1)")
  })
  it("ne confond pas un identifiant avec une référence", () => {
    expect(shiftFormulaRefs("=LOG10(A1)", 1, 0)).toBe("=LOG10(A2)")
    expect(shiftFormulaRefs("=price1+A1", 1, 0)).toBe("=price1+A2")
    expect(shiftFormulaRefs("=A1:price2", 1, 0)).toBe("=A2:price2")
  })
})

describe("functionQueryAt (autocomplétion fx)", () => {
  it("rend l'identifiant en cours de frappe, en minuscules", () => {
    expect(functionQueryAt("=SU")).toBe("su")
    expect(functionQueryAt("=sum(")).toBe("")
    expect(functionQueryAt("=SUM(A1)+IF")).toBe("if")
  })

  it("ne suggère rien hors d'une formule ou dans une chaîne", () => {
    expect(functionQueryAt("SUM")).toBe("")
    expect(functionQueryAt('="hello wor')).toBe("")
    expect(functionQueryAt("='hello wor")).toBe("")
  })

  it("ne suggère pas au milieu d'une référence ou d'une plage", () => {
    expect(functionQueryAt("=A1", 2)).toBe("")
    expect(functionQueryAt("=A1:B")).toBe("")
    expect(functionQueryAt("=$AB")).toBe("")
    expect(functionQueryAt("=A1+B")).toBe("b")
    expect(functionQueryAt("=SUM(A")).toBe("a")
  })

  it("suit le curseur, pas seulement la fin du texte", () => {
    expect(functionQueryAt("=SU+1", 3)).toBe("su")
    expect(functionQueryAt("=SU+1", 5)).toBe("")
  })
})

describe("rankSuggestions (autocomplétion)", () => {
  const items = [
    { name: "SUM" },
    { name: "SUMIF" },
    { name: "SUMPRODUCT" },
    { name: "MID" },
    { name: "MEDIAN" },
    { name: "IF" },
    { name: "IFS" },
  ]

  it("classe égalité > préfixe, puis nom le plus court", () => {
    expect(rankSuggestions(items, "sum").map((i) => i.name)).toEqual([
      "SUM",
      "SUMIF",
      "SUMPRODUCT",
    ])
    expect(rankSuggestions(items, "if").map((i) => i.name)).toEqual(["IF", "IFS", "SUMIF"])
  })

  it("trouve une sous-chaîne", () => {
    expect(rankSuggestions(items, "edian").map((i) => i.name)).toEqual(["MEDIAN"])
    expect(rankSuggestions(items, "ia").map((i) => i.name)).toEqual(["MEDIAN"])
  })

  it("trouve une sous-séquence (fuzzy)", () => {
    expect(rankSuggestions(items, "sm").map((i) => i.name)).toEqual([
      "SUM",
      "SUMIF",
      "SUMPRODUCT",
    ])
  })

  it("respecte la limite et ignore une requête vide", () => {
    expect(rankSuggestions(items, "s", 1)).toHaveLength(1)
    expect(rankSuggestions(items, "")).toEqual([])
    expect(rankSuggestions(items, "zzz")).toEqual([])
  })
})

describe("functionCallAt / signatureArgs (aide à l'argument)", () => {
  const known = ["SUM", "IF", "MAX"]

  it("détecte la fonction et l'index de l'argument courant", () => {
    expect(functionCallAt("=SUM(", 5, known)).toEqual({ name: "sum", index: 0 })
    expect(functionCallAt("=SUM(A1,", 8, known)).toEqual({ name: "sum", index: 1 })
    expect(functionCallAt("=IF(A1>0,", 9, known)).toEqual({ name: "if", index: 1 })
  })

  it("prend la fonction la plus interne", () => {
    expect(functionCallAt("=SUM(IF(A1>0,", 13, known)).toEqual({ name: "if", index: 1 })
  })

  it("ignore les virgules des chaînes et les appels fermés", () => {
    expect(functionCallAt('=IF(A1,"x,y",', 7, known)).toEqual({ name: "if", index: 1 })
    expect(functionCallAt('=IF(A1,"x,y",', 13, known)).toEqual({ name: "if", index: 2 })
    expect(functionCallAt("=A1+B1", 6, known)).toBeNull()
    expect(functionCallAt("=SUM(A1)", 9, known)).toBeNull()
  })

  it("signatureArgs découpe les paramètres", () => {
    expect(signatureArgs("range, criteria, [sum_range]")).toEqual([
      "range",
      "criteria",
      "[sum_range]",
    ])
    expect(signatureArgs("")).toEqual([])
  })
})

describe("dates ISO", () => {
  it("isoAddDays", () => {
    expect(isoAddDays("2026-09-07", 1)).toBe("2026-09-08")
    expect(isoAddDays("2026-09-07", -7)).toBe("2026-08-31")
    expect(isoAddDays("2026-12-31", 1)).toBe("2027-01-01")
  })
  it("isBlankValue", () => {
    expect(isBlankValue(null)).toBe(true)
    expect(isBlankValue(undefined)).toBe(true)
    expect(isBlankValue("")).toBe(true)
    expect(isBlankValue(0)).toBe(false)
    expect(isBlankValue("0")).toBe(false)
  })
})

describe("CSV", () => {
  it("csvEscape quote si nécessaire", () => {
    expect(csvEscape("simple", ",")).toBe("simple")
    expect(csvEscape("a,b", ",")).toBe('"a,b"')
    expect(csvEscape('say "hi"', ",")).toBe('"say ""hi"""')
    expect(csvEscape("ligne\nsuivante", ";")).toBe('"ligne\nsuivante"')
    expect(csvEscape(null, ",")).toBe("")
  })
  it("csvSplitLine gère les guillemets doublés et les délimiteurs", () => {
    expect(csvSplitLine('a,"b,c",d', ",")).toEqual(["a", "b,c", "d"])
    expect(csvSplitLine('"x""y",z', ",")).toEqual(['x"y', "z"])
    expect(csvSplitLine("a;b", ";")).toEqual(["a", "b"])
  })
  it("parseCsv : multiligne, quotes, CRLF", () => {
    const text = 'h1,h2\r\n"a,1","b""2"\r\nc,d\n'
    expect(parseCsv(text)).toEqual([
      ["h1", "h2"],
      ["a,1", 'b"2'],
      ["c", "d"],
    ])
  })
  it("deriveCols déduit les colonnes des clés", () => {
    expect(deriveCols([{ a: 1, b: "x" }, { b: 2, c: true }])).toEqual([
      { name: "a", type: "text" },
      { name: "b", type: "text" },
      { name: "c", type: "text" },
    ])
  })
})
