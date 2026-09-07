// Tests unitaires du moteur de formules A1 (bun test).
import { describe, expect, it } from "bun:test"
import { evaluateFormula, isError } from "./formula"
import type { FormulaValue } from "./formula"

type Grid = (string | number | boolean | null)[][]

function harness(grid: Grid, formulaRow = 0) {
  return (f: string): FormulaValue =>
    evaluateFormula(f, {
      row: formulaRow,
      resolveField: () => undefined,
      resolveCell: (r, c) => {
        const row = grid[r]
        return row && c >= 0 && c < row.length
          ? (row[c] as FormulaValue | undefined)
          : undefined
      },
    })
}

describe("opérateurs & références", () => {
  const grid: Grid = [
    [1, 2, 3],
    [10, 20, 30],
  ]
  const e = harness(grid)
  it("arithmétique et parenthèses", () => {
    expect(e("=1+2*3")).toBe(7)
    expect(e("=(1+2)*3")).toBe(9)
    expect(e("=2^3")).toBe(8)
    expect(e("=10%")).toBe(0.1)
    expect(e("=200*10%")).toBe(20)
  })
  it("références A1 / plages / concat", () => {
    expect(e("=A1+B1")).toBe(3)
    expect(e("=A2*C1")).toBe(30)
    expect(e('="x"&A1')).toBe("x1")
  })
  it("comparaisons", () => {
    expect(e("=B2>B1")).toBe(true)
    expect(e('=A1="1"')).toBe(true)
  })
  it("référence hors grille → #REF!", () => {
    expect(String(e("=Z99"))).toBe("#REF!")
  })
  it("division par zéro → #DIV/0!", () => {
    expect(String(e("=1/0"))).toBe("#DIV/0!")
  })
})

describe("fonctions agrégation", () => {
  const grid: Grid = [
    [5, "x", 10],
    [null, 2, 3],
  ]
  const e = harness(grid)
  it("SUM / AVERAGE / MIN / MAX sur plages", () => {
    expect(e("=SUM(A1:C2)")).toBe(20)
    expect(e("=AVERAGE(A1,C1,C2)")).toBe(6)
    expect(e("=MIN(A1:C2)")).toBe(2)
    expect(e("=MAX(A1:C2)")).toBe(10)
  })
  it("COUNT compte les nombres, COUNTA les non-vides", () => {
    expect(e("=COUNT(A1:C2)")).toBe(4)
    expect(e("=COUNTA(A1:C2)")).toBe(5)
  })
})

describe("fonctions logiques (lazy)", () => {
  const e = harness([[]])
  it("IF n'évalue que la branche prise", () => {
    expect(e("=IF(1,1,1/0)")).toBe(1)
    expect(e('=IF(0,1,"no")')).toBe("no")
  })
  it("IFS premier vrai", () => {
    expect(e('=IFS(1>2,"a",1<2,"b")')).toBe("b")
    expect(String(e("=IFS(0,1)"))).toBe("#N/A")
  })
  it("SWITCH avec défaut", () => {
    expect(e('=SWITCH(2,1,"un",2,"deux","autre")')).toBe("deux")
    expect(e('=SWITCH(9,1,"un","autre")')).toBe("autre")
  })
  it("IFERROR / IFNA", () => {
    expect(e('=IFERROR(1/0,"ko")')).toBe("ko")
    expect(e('=IFERROR(2,"ko")')).toBe(2)
  })
  it("AND / OR / NOT", () => {
    expect(e("=AND(1,1>0)")).toBe(true)
    expect(e("=OR(0,1=1)")).toBe(true)
    expect(e("=NOT(0)")).toBe(true)
  })
})

describe("VLOOKUP", () => {
  const grid: Grid = [
    ["A", 1, "x"],
    ["B", 2, "y"],
    ["A", 3, "z"],
  ]
  const e = harness(grid)
  it("recherche exacte dans la 1re colonne", () => {
    expect(e('=VLOOKUP("B",A1:C3,2)')).toBe(2)
    expect(e('=VLOOKUP("A",A1:C3,3)')).toBe("x")
  })
  it("absence → #N/A, colonne hors plage → #REF!", () => {
    expect(String(e('=VLOOKUP("Z",A1:C3,2)'))).toBe("#N/A")
    expect(String(e('=VLOOKUP("A",A1:C3,5)'))).toBe("#REF!")
  })
  it("pas une plage → #VALUE!", () => {
    expect(String(e('=VLOOKUP("A",A1,2)'))).toBe("#VALUE!")
  })
})

describe("fonctions texte", () => {
  const e = harness([[]])
  it("LEFT / RIGHT / MID", () => {
    expect(e('=LEFT("Hello",2)')).toBe("He")
    expect(e('=RIGHT("Hello",2)')).toBe("lo")
    expect(e('=MID("Hello",2,3)')).toBe("ell")
  })
  it("FIND / SUBSTITUTE / REPLACE / CONCAT", () => {
    expect(e('=FIND("llo","Hello")')).toBe(3)
    expect(e('=SUBSTITUTE("a-b-a","a","x",2)')).toBe("a-b-x")
    expect(e('=SUBSTITUTE("a-b-a","a","x")')).toBe("x-b-x")
    expect(e('=REPLACE("Hello",1,2,"XY")')).toBe("XYllo")
    expect(e('=CONCATENATE("a",1)')).toBe("a1")
  })
  it("UPPER / LOWER / TRIM / LEN", () => {
    expect(e('=UPPER("aB")')).toBe("AB")
    expect(e('=TRIM("  x  ")')).toBe("x")
    expect(e('=LEN("abc")')).toBe(3)
  })
})

describe("fonctions dates", () => {
  const e = harness([[]])
  it("DATE construit en UTC", () => {
    expect(e("=DATE(2026,9,7)")).toBe("2026-09-07")
  })
  it("YEAR / MONTH / DAY", () => {
    expect(e('=YEAR("2026-09-07")')).toBe(2026)
    expect(e('=MONTH("2026-09-07")')).toBe(9)
    expect(e('=DAY("2026-09-07")')).toBe(7)
  })
  it("EDATE", () => {
    expect(e('=EDATE("2026-01-15",1)')).toBe("2026-02-15")
  })
  it("TODAY / NOW / RAND sont valides", () => {
    const t = e("=TODAY()")
    expect(typeof t).toBe("string")
    expect(String(t)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    const r = e("=RAND()")
    expect(typeof r).toBe("number")
    expect(Number(r)).toBeGreaterThanOrEqual(0)
    expect(Number(r)).toBeLessThan(1)
  })
})

describe("math & erreurs de type", () => {
  const e = harness([[]])
  it("ABS / ROUND / INT / MOD / SQRT / POWER", () => {
    expect(e("=ABS(-4)")).toBe(4)
    expect(e("=ROUND(1.234,2)")).toBe(1.23)
    expect(e("=INT(-3.7)")).toBe(-3)
    expect(e("=MOD(7,3)")).toBe(1)
    expect(e("=SQRT(16)")).toBe(4)
    expect(e("=POWER(2,3)")).toBe(8)
  })
  it("#NAME? pour une fonction inconnue", () => {
    expect(String(e("=NOPE(1)"))).toBe("#NAME?")
  })
  it("#VALUE! pour du texte en numéro", () => {
    expect(String(e('=1+"a"'))).toBe("#VALUE!")
  })
  it("isError détecte FormulaError", () => {
    expect(isError(e("=1/0"))).toBe(true)
  })
})
