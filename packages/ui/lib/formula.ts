// Moteur de formules style tableur pour QDataGrid.
// Syntaxe : une valeur de cellule qui commence par "=" est une formule :
//   =price * quantity            → références par nom de colonne (ligne courante)
//   =SUM(E1:E3)                  → plages A1, fonctions intégrées
//   =E4 * $B$5                   → références A1 (absolues avec $)
//   =IF(A1 > 0, "ok", "ko")      → fonctions, comparaisons
// Opérateurs : + - * / ^ % & = <> < > <= >= · parenthèses · unaires +/- · chaînes "..."/'...'
// Erreurs : #DIV/0! #NAME? #VALUE! #REF! #N/A #CYCLE! #ERROR! (rendues en rouge par le grid).

export class FormulaError {
  readonly code: string
  constructor(code: string) {
    this.code = code
  }
  toString() {
    return this.code
  }
}

export const isError = (v: unknown): v is FormulaError => v instanceof FormulaError

export type FormulaValue = number | string | boolean | null | FormulaError
type EvalValue = FormulaValue | FormulaValue[]

export interface FormulaContext {
  /** Ligne (0-based) de la cellule qui contient la formule — pour les références par champ */
  row: number
  /** Résout une référence par nom de colonne (dans ctx.row). undefined = champ inconnu */
  resolveField: (name: string) => FormulaValue | undefined
  /** Résout une référence positionnelle A1 (row/col 0-based). undefined = hors grille */
  resolveCell: (row: number, col: number) => FormulaValue | undefined
}

// ─── AST ───
interface RefToken {
  raw: string
  field?: string // nom de colonne (identifiant simple)
  col?: number // 0-based si A1
  row?: number // 0-based si A1
  colAbs?: boolean
  rowAbs?: boolean
  either?: boolean // ressemble à A1 (lettres+chiffres) mais peut être un champ (ex. price1)
}

type Node =
  | { kind: "num"; value: number }
  | { kind: "str"; value: string }
  | { kind: "ref"; ref: RefToken }
  | { kind: "range"; start: RefToken; end: RefToken }
  | { kind: "call"; name: string; args: Node[] }
  | { kind: "unary"; op: "+" | "-"; arg: Node }
  | { kind: "postfix"; op: "%"; arg: Node }
  | { kind: "binary"; op: string; left: Node; right: Node }

// ─── Parser (descente récursive, précédence) ───
class Parser {
  private pos = 0

  constructor(private src: string) {}

  private peek() {
    return this.src[this.pos]
  }
  eof() {
    return this.pos >= this.src.length
  }
  private next() {
    return this.src[this.pos++]
  }
  private skipWs() {
    while (!this.eof() && /\s/.test(this.peek()!)) this.pos++
  }
  private expect(char: string) {
    this.skipWs()
    if (this.peek() !== char) throw new Error("expected " + char)
    this.pos++
  }

  /** parse une expression complète (niveau comparaison) */
  parseExpr(): Node {
    this.skipWs()
    return this.parseComparison()
  }

  private parseComparison(): Node {
    let left = this.parseAdditive()
    for (;;) {
      this.skipWs()
      let op: string | null = null
      if (this.peek() === "=") op = "="
      else if (this.peek() === "<") {
        if (this.src[this.pos + 1] === ">") {
          op = "<>"
          this.pos++
        } else if (this.src[this.pos + 1] === "=") {
          op = "<="
          this.pos++
        } else op = "<"
      } else if (this.peek() === ">") {
        if (this.src[this.pos + 1] === "=") {
          op = ">="
          this.pos++
        } else op = ">"
      }
      if (!op) return left
      this.pos++
      const right = this.parseAdditive()
      left = { kind: "binary", op, left, right }
    }
  }

  private parseAdditive(): Node {
    let left = this.parseMultiplicative()
    for (;;) {
      this.skipWs()
      const op = this.peek()
      if (op !== "+" && op !== "-" && op !== "&") return left
      this.pos++
      const right = this.parseMultiplicative()
      left = { kind: "binary", op, left, right }
    }
  }

  private parseMultiplicative(): Node {
    let left = this.parsePower()
    for (;;) {
      this.skipWs()
      const op = this.peek()
      if (op !== "*" && op !== "/") return left
      this.pos++
      const right = this.parsePower()
      left = { kind: "binary", op, left, right }
    }
  }

  private parsePower(): Node {
    const left = this.parseUnary()
    this.skipWs()
    if (this.peek() === "^") {
      this.pos++
      const right = this.parsePower() // associatif à droite
      return { kind: "binary", op: "^", left, right }
    }
    return left
  }

  private parseUnary(): Node {
    this.skipWs()
    const op = this.peek()
    if (op === "+" || op === "-") {
      this.pos++
      return { kind: "unary", op, arg: this.parseUnary() }
    }
    return this.parsePostfix()
  }

  private parsePostfix(): Node {
    let node = this.parsePrimary()
    for (;;) {
      this.skipWs()
      if (this.peek() === "%") {
        this.pos++
        node = { kind: "postfix", op: "%", arg: node }
      } else return node
    }
  }

  private parsePrimary(): Node {
    this.skipWs()
    const ch = this.peek()
    if (ch === "(") {
      this.pos++
      const node = this.parseExpr()
      this.expect(")")
      return node
    }
    if (ch === '"' || ch === "'") return { kind: "str", value: this.parseString(ch) }
    if (ch && /[0-9.]/.test(ch)) return this.parseNumber()
    if (ch && /[A-Za-z_$]/.test(ch)) return this.parseRefOrCall()
    throw new Error("unexpected char")
  }

  private parseString(quote: string): string {
    this.pos++ // quote d'ouverture
    let out = ""
    while (!this.eof()) {
      const c = this.next()
      if (c === quote) {
        if (this.peek() === quote) {
          this.pos++ // échappement ""
          out += quote
        } else return out
      } else out += c
    }
    throw new Error("unterminated string")
  }

  private parseNumber(): Node {
    let s = ""
    while (!this.eof() && /[0-9.]/.test(this.peek()!)) s += this.next()
    const value = parseFloat(s)
    return { kind: "num", value: Number.isNaN(value) ? 0 : value }
  }

  private parseRefOrCall(): Node {
    // [$]lettres[$]chiffres  → A1 ;  identifiant( → appel ;  sinon champ
    let colAbs = false
    if (this.peek() === "$") {
      colAbs = true
      this.pos++
    }
    let letters = ""
    while (!this.eof() && /[A-Za-z]/.test(this.peek()!)) letters += this.next()
    if (letters.length === 0) throw new Error("bad ref")

    // Appel de fonction : identifiant suivi de "("
    if (this.peek() === "(") {
      if (colAbs) throw new Error("bad call")
      this.pos++
      const args: Node[] = []
      this.skipWs()
      if (this.peek() !== ")") {
        for (;;) {
          args.push(this.parseExpr())
          this.skipWs()
          if (this.peek() === ",") {
            this.pos++
            continue
          }
          break
        }
      }
      this.expect(")")
      return { kind: "call", name: letters, args }
    }

    let rowAbs = false
    if (this.peek() === "$") {
      rowAbs = true
      this.pos++
    }
    let digits = ""
    while (!this.eof() && /[0-9]/.test(this.peek()!)) digits += this.next()

    let token: RefToken
    if (digits.length > 0 && letters.length <= 3) {
      token = {
        raw: (colAbs ? "$" : "") + letters + (rowAbs ? "$" : "") + digits,
        col: lettersToCol(letters),
        row: parseInt(digits, 10) - 1,
        colAbs,
        rowAbs,
        either: !colAbs && !rowAbs,
      }
    } else {
      token = { raw: (colAbs ? "$" : "") + letters, field: letters }
    }

    // Plage A1:A3 (uniquement par positions)
    this.skipWs()
    if (this.peek() === ":") {
      this.pos++
      const end = this.parseRefOnly()
      return { kind: "range", start: token, end }
    }
    return { kind: "ref", ref: token }
  }

  /** Lit un token de référence seul (extrémité de plage) */
  private parseRefOnly(): RefToken {
    this.skipWs()
    let colAbs = false
    if (this.peek() === "$") {
      colAbs = true
      this.pos++
    }
    let letters = ""
    while (!this.eof() && /[A-Za-z]/.test(this.peek()!)) letters += this.next()
    let rowAbs = false
    if (this.peek() === "$") {
      rowAbs = true
      this.pos++
    }
    let digits = ""
    while (!this.eof() && /[0-9]/.test(this.peek()!)) digits += this.next()
    if (digits.length === 0 || letters.length === 0 || letters.length > 3)
      throw new Error("bad range")
    return {
      raw: (colAbs ? "$" : "") + letters + (rowAbs ? "$" : "") + digits,
      col: lettersToCol(letters),
      row: parseInt(digits, 10) - 1,
      colAbs,
      rowAbs,
    }
  }
}

const lettersToCol = (letters: string): number => {
  let n = 0
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n - 1
}

// ─── Évaluation ───
const err = (code: string): FormulaError => new FormulaError(code)

const toNum = (v: FormulaValue): number | FormulaError => {
  if (v === null || v === undefined) return 0
  if (typeof v === "boolean") return v ? 1 : 0
  if (typeof v === "number") return v
  const t = (v as string).trim()
  if (t === "") return 0
  const n = Number(t)
  return Number.isNaN(n) ? err("#VALUE!") : n
}

const toStr = (v: FormulaValue): string => {
  if (v === null || v === undefined) return ""
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE"
  return String(v)
}

const truthy = (v: FormulaValue): boolean => {
  if (v === null || v === undefined) return false
  if (typeof v === "boolean") return v
  if (typeof v === "number") return v !== 0
  return v !== ""
}

// collect=false ne produit jamais de tableau (les plages renvoient #VALUE!) —
// ce garde sert uniquement au typage.
const toScalar = (v: EvalValue): FormulaValue => (Array.isArray(v) ? err("#VALUE!") : v)

const resolveRef = (ref: RefToken, ctx: FormulaContext): FormulaValue => {
  if (ref.field !== undefined) {
    const v = ctx.resolveField(ref.field)
    return v === undefined ? err("#NAME?") : v
  }
  if (ref.either) {
    const f = ctx.resolveField(ref.raw)
    if (f !== undefined) return f
  }
  const v = ctx.resolveCell(ref.row!, ref.col!)
  return v === undefined ? err("#REF!") : v
}

const resolveRefPos = (ref: RefToken): [number, number] | null => {
  if (ref.field !== undefined) return null // pas de plage par champ
  return [ref.row!, ref.col!]
}

function evalNode(node: Node, ctx: FormulaContext, collect: boolean): EvalValue {
  switch (node.kind) {
    case "num":
      return node.value
    case "str":
      return node.value
    case "ref":
      return resolveRef(node.ref, ctx)
    case "range": {
      if (!collect) return err("#VALUE!")
      const a = resolveRefPos(node.start)
      const b = resolveRefPos(node.end)
      if (!a || !b) return err("#REF!")
      const out: FormulaValue[] = []
      for (let r = Math.min(a[0], b[0]); r <= Math.max(a[0], b[0]); r++)
        for (let c = Math.min(a[1], b[1]); c <= Math.max(a[1], b[1]); c++)
          out.push(ctx.resolveCell(r, c) ?? null)
      return out
    }
    case "unary": {
      const v = evalNode(node.arg, ctx, false)
      if (isError(v)) return v
      const n = toNum(v as FormulaValue)
      return isError(n) ? n : node.op === "-" ? -n : n
    }
    case "postfix": {
      const v = evalNode(node.arg, ctx, false)
      if (isError(v)) return v
      const n = toNum(v as FormulaValue)
      return isError(n) ? n : n / 100
    }
    case "binary":
      return evalBinary(node, ctx)
    case "call":
      return evalCall(node, ctx)
  }
}

function evalBinary(node: Extract<Node, { kind: "binary" }>, ctx: FormulaContext): FormulaValue {
  if (node.op === "&") {
    const a = toScalar(evalNode(node.left, ctx, false))
    const b = toScalar(evalNode(node.right, ctx, false))
    if (isError(a)) return a
    if (isError(b)) return b
    return toStr(a) + toStr(b)
  }
  const a = toScalar(evalNode(node.left, ctx, false))
  const b = toScalar(evalNode(node.right, ctx, false))
  if (isError(a)) return a
  if (isError(b)) return b

  switch (node.op) {
    case "+":
    case "-":
    case "*":
    case "/":
    case "^": {
      const na = toNum(a as FormulaValue)
      const nb = toNum(b as FormulaValue)
      if (isError(na)) return na
      if (isError(nb)) return nb
      switch (node.op) {
        case "+":
          return na + nb
        case "-":
          return na - nb
        case "*":
          return na * nb
        case "/":
          return nb === 0 ? err("#DIV/0!") : na / nb
        case "^":
          return Math.pow(na, nb)
      }
      break
    }
    case "=":
    case "<>":
    case "<":
    case ">":
    case "<=":
    case ">=": {
      const cmp = compare(a as FormulaValue, b as FormulaValue)
      if (cmp === "err") return err("#VALUE!")
      switch (node.op) {
        case "=":
          return cmp === 0
        case "<>":
          return cmp !== 0
        case "<":
          return cmp < 0
        case ">":
          return cmp > 0
        case "<=":
          return cmp <= 0
        case ">=":
          return cmp >= 0
      }
      break
    }
  }
  return err("#ERROR!")
}

function compare(a: FormulaValue, b: FormulaValue): number | "err" {
  if (typeof a === "boolean") a = a ? 1 : 0
  if (typeof b === "boolean") b = b ? 1 : 0
  if (typeof a === "string" && typeof b === "string") {
    return a === b ? 0 : a < b ? -1 : 1
  }
  if (a === null) a = 0
  if (b === null) b = 0
  if (typeof a === "number" && typeof b === "number") {
    return a === b ? 0 : a < b ? -1 : 1
  }
  const na = toNum(a)
  const nb = toNum(b)
  if (!isError(na) && !isError(nb)) {
    return na === nb ? 0 : na < nb ? -1 : 1
  }
  const sa = toStr(a)
  const sb = toStr(b)
  return sa === sb ? 0 : sa < sb ? -1 : 1
}

function evalCall(node: Extract<Node, { kind: "call" }>, ctx: FormulaContext): FormulaValue {
  const name = node.name.toLowerCase()

  // Appels paresseux (évalués conditionnellement)
  if (name === "if" && node.args.length >= 2) {
    const cond = toScalar(evalNode(node.args[0]!, ctx, false))
    if (isError(cond)) return cond
    return truthy(cond)
      ? toScalar(evalNode(node.args[1]!, ctx, false))
      : node.args[2] !== undefined
        ? toScalar(evalNode(node.args[2], ctx, false))
        : false
  }
  if (name === "iferror" && node.args.length >= 1) {
    const v = toScalar(evalNode(node.args[0]!, ctx, false))
    if (isError(v))
      return node.args[1] !== undefined ? toScalar(evalNode(node.args[1], ctx, false)) : null
    return v
  }
  if (name === "and" || name === "or") {
    if (node.args.length === 0) return name === "and"
    for (const arg of node.args) {
      const v = toScalar(evalNode(arg, ctx, false))
      if (isError(v)) return v
      const t = truthy(v)
      if (name === "and" && !t) return false
      if (name === "or" && t) return true
    }
    return name === "and"
  }

  const fn = FUNCTIONS[name]
  if (!fn) return err("#NAME?")

  const raw = node.args.map((a) => evalNode(a, ctx, true))
  const hadArray = raw.some(Array.isArray)
  const flat = raw.flatMap((v) => (Array.isArray(v) ? (v as FormulaValue[]) : [v as FormulaValue]))
  return fn(flat, hadArray)
}

type GridFunction = (args: FormulaValue[], hadArray: boolean) => FormulaValue

const scalar = (args: FormulaValue[], hadArray: boolean, fn: (v: FormulaValue) => FormulaValue): FormulaValue => {
  if (hadArray) return err("#VALUE!")
  return fn(args[0] ?? null)
}

const numbers = (args: FormulaValue[]): number[] =>
  args.filter((v): v is number => typeof v === "number")

const FUNCTIONS: Record<string, GridFunction> = {
  sum: (args) => numbers(args).reduce((acc, n) => acc + n, 0),
  average: (args) => {
    const n = numbers(args)
    return n.length ? n.reduce((acc, x) => acc + x, 0) / n.length : err("#DIV/0!")
  },
  avg: (args) => FUNCTIONS.average!(args, false),
  min: (args) => {
    const n = numbers(args)
    return n.length ? Math.min(...n) : 0
  },
  max: (args) => {
    const n = numbers(args)
    return n.length ? Math.max(...n) : 0
  },
  count: (args) => numbers(args).length,
  counta: (args) => args.filter((v) => v !== null && v !== undefined).length,
  abs: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    return isError(n) ? n : Math.abs(n)
  }),
  round: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    if (isError(n)) return n
    const d = args[1] === undefined ? 0 : Math.trunc(Number(args[1]) || 0)
    const f = Math.pow(10, d)
    return Math.round(n * f) / f
  }),
  roundup: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    if (isError(n)) return n
    const d = args[1] === undefined ? 0 : Math.trunc(Number(args[1]) || 0)
    const f = Math.pow(10, d)
    return (n < 0 ? -1 : 1) * Math.ceil(Math.abs(n) * f) / f
  }),
  rounddown: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    if (isError(n)) return n
    const d = args[1] === undefined ? 0 : Math.trunc(Number(args[1]) || 0)
    const f = Math.pow(10, d)
    return (n < 0 ? -1 : 1) * Math.floor(Math.abs(n) * f) / f
  }),
  floor: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    return isError(n) ? n : Math.floor(n)
  }),
  ceiling: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    return isError(n) ? n : Math.ceil(n)
  }),
  ceil: (args, h) => FUNCTIONS.ceiling!(args, h),
  int: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    return isError(n) ? n : Math.trunc(n)
  }),
  mod: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    if (isError(n)) return n
    const m = toNum(args[1] ?? null)
    if (isError(m)) return m
    return m === 0 ? err("#DIV/0!") : n % m
  }),
  sqrt: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    return isError(n) ? n : n < 0 ? err("#VALUE!") : Math.sqrt(n)
  }),
  power: (args, h) => scalar(args, h, (v) => {
    const n = toNum(v)
    if (isError(n)) return n
    const e = toNum(args[1] ?? null)
    return isError(e) ? e : Math.pow(n, e)
  }),
  pow: (args, h) => FUNCTIONS.power!(args, h),
  pi: () => Math.PI,
  not: (args, h) => scalar(args, h, (v) => !truthy(v)),
  concat: (args) => args.map(toStr).join(""),
  upper: (args, h) => scalar(args, h, (v) => toStr(v).toUpperCase()),
  lower: (args, h) => scalar(args, h, (v) => toStr(v).toLowerCase()),
  trim: (args, h) => scalar(args, h, (v) => toStr(v).trim()),
  len: (args, h) => scalar(args, h, (v) => toStr(v).length),
  isblank: (args, h) => scalar(args, h, (v) => v === null || v === undefined || v === ""),
  isnumber: (args, h) => scalar(args, h, (v) => typeof v === "number"),
  istext: (args, h) => scalar(args, h, (v) => typeof v === "string"),
  value: (args, h) => scalar(args, h, (v) => toNum(v)),
  n: (args, h) => scalar(args, h, (v) => {
    if (v === null || v === undefined) return 0
    if (typeof v === "boolean") return v ? 1 : 0
    if (typeof v === "number") return v
    return toNum(v)
  }),
}

/** Évalue une formule ("=…" optionnel). Retourne une valeur ou une FormulaError. */
export function evaluateFormula(source: string, ctx: FormulaContext): FormulaValue {
  const src = source.startsWith("=") ? source.slice(1) : source
  try {
    const parser = new Parser(src)
    const node = parser.parseExpr()
    if (!parser.eof()) return err("#ERROR!")
    const v = evalNode(node, ctx, false)
    return Array.isArray(v) ? err("#VALUE!") : v
  } catch {
    return err("#ERROR!")
  }
}
