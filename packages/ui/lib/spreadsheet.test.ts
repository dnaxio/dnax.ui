// Tests unitaires des helpers purs du tableur (bun test).
import { describe, expect, it } from "bun:test"
import {
  colLetter,
  colFromLetters,
  isBlankValue,
  isoAddDays,
  shiftFormulaRefs,
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
