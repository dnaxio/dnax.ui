// Tests unitaires du moteur de formules A1 (bun test).
import { describe, expect, it } from "bun:test"
import { criteriaMatcher, evaluateFormula, FORMULA_FUNCTION_NAMES, isError } from "./formula"
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

describe("XLOOKUP + dates avancées", () => {
  const grid: Grid = [
    ["A", 1, "x"],
    ["B", 2, "y"],
    ["A", 3, "z"],
  ]
  const e = harness(grid)
  it("XLOOKUP retourne la cellule correspondante du range retour", () => {
    expect(e('=XLOOKUP("B",A1:A3,B1:B3)')).toBe(2)
    expect(e('=XLOOKUP("A",A1:A3,C1:C3)')).toBe("x")
  })
  it("XLOOKUP fallback / #N/A", () => {
    expect(String(e('=XLOOKUP("Z",A1:A3,B1:B3,"?")'))).toBe("?")
    expect(String(e('=XLOOKUP("Z",A1:A3,B1:B3)'))).toBe("#N/A")
  })
  it("WEEKDAY / EOMONTH / DATEDIF / TEXT", () => {
    const d = harness([[]])
    // 2026-09-07 = lundi
    expect(d('=WEEKDAY("2026-09-07",2)')).toBe(1)
    expect(d('=EOMONTH("2026-01-15",0)')).toBe("2026-01-31")
    expect(d('=DATEDIF("2026-01-01","2026-02-10","D")')).toBe(40)
    expect(d('=TEXT(1.5,"0.00")')).toBe("1.50")
    expect(d('=TEXT(0.12,"0%")')).toBe("12%")
    expect(d('=TEXT("2026-09-07","YYYY-MM-DD")')).toBe("2026-09-07")
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

describe("espaces autour de la formule", () => {
  const e = harness([[]])
  it("accepte des espaces avant le `=` (isFormulaRaw les tolère)", () => {
    expect(e("  =1+2")).toBe(3)
    expect(e(" =SUM(1,2) ")).toBe(3)
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

// ─── Extension 2026-10-17 : critères, stats, recherche, dates, texte ───

describe("critères (SUMIF / COUNTIF / *IFS)", () => {
  const grid: Grid = [
    ["A", "x", 10],
    ["B", "y", 20],
    ["C", "x", 30],
    [null, null, null],
    ["D", "y", 40],
  ]
  const e = harness(grid)

  it("SUMIF : critère texte, comparaison numérique, plage de somme optionnelle", () => {
    expect(e('=SUMIF(B1:B5,"x",C1:C5)')).toBe(40)
    expect(e('=SUMIF(B1:B5,"y",C1:C5)')).toBe(60)
    expect(e('=SUMIF(C1:C5,">15")')).toBe(90)
    expect(e('=SUMIF(C1:C5,"<>")')).toBe(100)
  })

  it("COUNTIF : égalité (insensible à la casse), vides, jokers", () => {
    expect(e('=COUNTIF(A1:A5,"a")')).toBe(1)
    expect(e('=COUNTIF(A1:A5,"?")')).toBe(4)
    expect(e('=COUNTIF(A1:A5,"")')).toBe(1)
    expect(e('=COUNTIF(A1:A5,"<>")')).toBe(4)
    expect(e('=COUNTIF(A1:A5,"a*")')).toBe(1)
    expect(e('=COUNTIF(A1:A5,">b")')).toBe(2)
  })

  it("AVERAGEIF ignore les non-nombres ; #DIV/0! sans correspondance", () => {
    expect(e('=AVERAGEIF(B1:B5,"y",C1:C5)')).toBe(30)
    expect(String(e('=AVERAGEIF(B1:B5,"z",C1:C5)'))).toBe("#DIV/0!")
  })

  it("COUNTIFS / SUMIFS / AVERAGEIFS croisent plusieurs critères", () => {
    expect(e('=COUNTIFS(B1:B5,"x",C1:C5,">15")')).toBe(1)
    expect(e('=SUMIFS(C1:C5,B1:B5,"x",C1:C5,">15")')).toBe(30)
    expect(e('=SUMIFS(C1:C5,B1:B5,"x")')).toBe(40)
    expect(e('=AVERAGEIFS(C1:C5,B1:B5,"y")')).toBe(30)
  })

  it("SUMPRODUCT multiplie les plages terme à terme", () => {
    expect(e("=SUMPRODUCT(C1:C3,C1:C3)")).toBe(1400)
    expect(e("=SUMPRODUCT(C1:C2)")).toBe(30)
  })
})

describe("criteriaMatcher (unitaire)", () => {
  it("compare nombres, textes, vides et jokers", () => {
    expect(criteriaMatcher(">10")(15)).toBe(true)
    expect(criteriaMatcher(">10")("abc")).toBe(false)
    expect(criteriaMatcher("<=5")(5)).toBe(true)
    expect(criteriaMatcher(0)("0")).toBe(true)
    expect(criteriaMatcher("paris")("PARIS")).toBe(true)
    expect(criteriaMatcher("paris")("paris ")).toBe(false)
    expect(criteriaMatcher("par*")("paris")).toBe(true)
    expect(criteriaMatcher("<>")(null)).toBe(false)
    expect(criteriaMatcher("")("")).toBe(true)
    expect(criteriaMatcher("<m")("apple")).toBe(true)
  })
})

describe("statistiques", () => {
  const grid: Grid = [
    [10],
    [20],
    [30],
    [40],
  ]
  const e = harness(grid)

  it("MEDIAN / LARGE / SMALL / RANK", () => {
    expect(e("=MEDIAN(A1:A4)")).toBe(25)
    expect(e("=LARGE(A1:A4,2)")).toBe(30)
    expect(e("=SMALL(A1:A4,2)")).toBe(20)
    expect(e("=RANK(20,A1:A4)")).toBe(3)
    expect(e("=RANK(20,A1:A4,1)")).toBe(2)
    expect(String(e("=LARGE(A1:A4,9)"))).toBe("#NUM!")
    expect(String(e("=RANK(99,A1:A4)"))).toBe("#N/A")
  })

  it("STDEV / STDEVP / VAR / VARP", () => {
    expect(Number(e("=STDEV(A1:A4)"))).toBeCloseTo(12.9099, 3)
    expect(Number(e("=STDEVP(A1:A4)"))).toBeCloseTo(11.1803, 3)
    expect(Number(e("=VAR(A1:A4)"))).toBeCloseTo(166.6667, 3)
    expect(e("=VARP(A1:A4)")).toBe(125)
    expect(String(e("=STDEV(A1)"))).toBe("#DIV/0!")
  })
})

describe("recherche INDEX / MATCH", () => {
  const grid: Grid = [
    ["A", "x", 10],
    ["B", "y", 20],
    ["C", "x", 30],
  ]
  const e = harness(grid)

  it("INDEX sur une plage (ligne/colonne, index unique)", () => {
    expect(e("=INDEX(C1:C3,2)")).toBe(20)
    expect(e("=INDEX(A1:C1,2)")).toBe("x")
    expect(e("=INDEX(A1:C3,3,3)")).toBe(30)
    expect(String(e("=INDEX(A1:C3,9,1)"))).toBe("#REF!")
  })

  it("MATCH exact et approché", () => {
    expect(e('=MATCH("x",B1:B3,0)')).toBe(1)
    expect(e("=MATCH(30,C1:C3,0)")).toBe(3)
    expect(e("=MATCH(25,C1:C3,1)")).toBe(2)
    expect(String(e("=MATCH(99,C1:C3,0)"))).toBe("#N/A")
  })
})

describe("littéraux TRUE / FALSE", () => {
  const e = harness([[]])
  it("valeurs booléennes en littéral et en fonction", () => {
    expect(e("=IF(TRUE,1,2)")).toBe(1)
    expect(e("=IF(FALSE,1,2)")).toBe(2)
    expect(e("=TRUE()")).toBe(true)
    expect(e("=FALSE()")).toBe(false)
    expect(e('=IFS(0,1,TRUE,"x")')).toBe("x")
  })
  it("un identifiant plus long reste une référence", () => {
    expect(String(e("=TRUE1"))).toBe("#NAME?")
  })
})

describe("erreurs (ISERROR / ISERR / ISNA / NA)", () => {
  const e = harness([[]])
  it("distingue erreur générique, #N/A et absence d'erreur", () => {
    expect(e("=ISERROR(1/0)")).toBe(true)
    expect(e("=ISERROR(1)")).toBe(false)
    expect(e("=ISERR(1/0)")).toBe(true)
    expect(e("=ISERR(NA())")).toBe(false)
    expect(e("=ISNA(NA())")).toBe(true)
    expect(e("=ISNA(1/0)")).toBe(false)
    expect(String(e("=NA()"))).toBe("#N/A")
  })
})

describe("texte étendu", () => {
  const e = harness([[]])
  it("TEXTJOIN / PROPER / SEARCH / EXACT", () => {
    expect(e('=TEXTJOIN("-",1,"a","","b")')).toBe("a-b")
    expect(e('=TEXTJOIN("-",0,"a","","b")')).toBe("a--b")
    expect(e('=PROPER("hello world")')).toBe("Hello World")
    expect(e('=SEARCH("B","abc")')).toBe(2)
    expect(String(e('=SEARCH("z","abc")'))).toBe("#VALUE!")
    expect(e('=EXACT("a","A")')).toBe(false)
    expect(e('=EXACT("a","a")')).toBe(true)
  })
})

describe("dates étendues", () => {
  const grid: Grid = [
    ["2026-10-05"],
    ["2026-10-06"],
  ]
  const e = harness(grid)
  it("DAYS / WEEKNUM / ISOWEEKNUM", () => {
    expect(e('=DAYS("2026-10-10","2026-10-01")')).toBe(9)
    expect(e('=WEEKNUM("2026-01-05",2)')).toBe(2)
    expect(e('=ISOWEEKNUM("2026-01-05")')).toBe(2)
    expect(e('=WEEKDAY("2026-10-05",2)')).toBe(1)
  })
  it("WORKDAY / NETWORKDAYS (avec et sans fériés)", () => {
    expect(e('=WORKDAY("2026-10-16",1)')).toBe("2026-10-19")
    expect(e('=NETWORKDAYS("2026-10-01","2026-10-07")')).toBe(5)
    expect(e('=NETWORKDAYS("2026-10-01","2026-10-07",A1:A2)')).toBe(3)
  })
})

describe("parité moteur ↔ autocomplétion", () => {
  it("aucune fonction intégrée n'est absente de FORMULA_FNS", async () => {
    const vue = await Bun.file(new URL("../components/QSpreadsheet.vue", import.meta.url)).text()
    const start = vue.indexOf("const FORMULA_FNS")
    const end = vue.indexOf("const fxSource")
    const block = vue.slice(start, end)
    const suggested = new Set([...block.matchAll(/name: "([A-Z]+)"/g)].map((m) => m[1]!))
    // Alias internes volontairement absents des suggestions.
    const aliases = new Set(["AVG", "CEIL", "POW"])
    const missing = FORMULA_FUNCTION_NAMES.filter((n) => !aliases.has(n) && !suggested.has(n))
    expect(missing).toEqual([])
  })
})
