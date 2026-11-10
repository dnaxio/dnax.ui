// Colonnes **calculées** : propager la formule d'une ligne vers les lignes où la cellule de
// formule est encore vide, dès que les colonnes qu'elle référence (celles de **la même ligne**)
// sont renseignées.
//
// C'est le comportement « colonne calculée » d'un tableur : `total = =B1*C1` sur les lignes
// existantes ; une nouvelle ligne où l'on saisit `qty` puis `price` reçoit `=B7*C7` toute
// seule. Les calculs **purs** vivent ici (testés hors navigateur) ; le composant ne fait que
// brancher et émettre `update:rows`.
import { isBlankValue, shiftFormulaRefs } from "./spreadsheet"

/** Une formule modèle trouvée dans une colonne (et la ligne qui la porte). */
export interface FormulaTemplate {
  row: number
  formula: string
}

const isFormula = (v: unknown): v is string =>
  typeof v === "string" && v.trim().startsWith("=")

/** Remplace les littéraux de chaîne par leur équivalent vide (analyse des références). */
const stripStrings = (src: string): string =>
  src.replace(/"(?:[^"]|"")*"/g, '""').replace(/'(?:[^']|'')*'/g, "''")

const lettersToIndex = (letters: string): number => {
  let n = 0
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n - 1
}

/**
 * Colonnes dont la formule utilise la cellule de la **même ligne** (`row`, 0-based).
 *
 * Deux formes de références sont reconnues :
 * - A1 non absolue en ligne (`B2`, `$B2`) qui pointe sur `row` → la colonne `B` ;
 * - nom de champ (`=qty*price`, référencé par `name` de colonne).
 *
 * Sont ignorées : les références de **ligne absolue** (`$B$5`, constantes), les plages
 * inter-lignes (`D1:D4` dans une ligne de total), les noms de fonctions (`SUM(`) et les
 * littéraux de chaîne.
 */
export const sameRowRefs = (
  formula: string,
  row: number,
  columns: readonly string[],
): string[] => {
  const out: string[] = []
  const add = (name: string | undefined) => {
    if (name && !out.includes(name)) out.push(name)
  }
  const byLower = new Map(columns.map((c) => [c.toLowerCase(), c]))
  let src = stripStrings(formula)

  // 1) références A1 (la partie « ligne » doit pointer sur `row`, sans `$`)
  const a1 = /(\$?)([A-Za-z]{1,3})(\$?)(\d+)/g
  const withoutA1 = src.replace(a1, (all, colAbs: string, letters: string, rowAbs: string, digits: string) => {
    if (!rowAbs && Number(digits) === row + 1) {
      add(columns[lettersToIndex(letters)])
    }
    // `$A$1` dans une formule de champ reste un littéral de référence : on neutralise
    return " ".repeat(all.length)
  })
  src = withoutA1

  // 2) références par nom de colonne (identifiant non suivi d'une parenthèse)
  const ident = /(^|[^A-Za-z0-9_$])([A-Za-z_][A-Za-z0-9_]*)(?!\s*\()/g
  for (const m of src.matchAll(ident)) {
    const word = m[2]!
    const upper = word.toUpperCase()
    if (upper === "TRUE" || upper === "FALSE") continue
    add(byLower.get(word.toLowerCase()))
  }
  return out
}

/** Modèle le plus proche : la dernière formule **au-dessus**, sinon la première en dessous. */
const nearestTemplate = (list: readonly FormulaTemplate[], row: number): FormulaTemplate | undefined => {
  let above: FormulaTemplate | undefined
  for (const t of list) {
    if (t.row <= row) above = t
    else if (!above) return t // aucune au-dessus → la première en dessous
  }
  return above
}

/** Options de `withAutoFormulas`. */
export interface AutoFormulaOptions {
  /** Ne traiter que cette ligne (après une saisie) — sinon toute la grille */
  onlyRow?: number
}

/**
 * Renvoie une **nouvelle** liste de lignes où les formules de colonne ont été propagées, ou
 * `null` si rien n'a changé (aucune écriture inutile).
 *
 * Règles :
 * - seule une cellule de formule **vide** est remplie (jamais d'écrasement) ;
 * - il faut que **toutes** les colonnes référencées de la ligne soient renseignées ;
 * - la formule vient de la ligne la plus proche (au-dessus d'abord) et ses références A1 sont
 *   recalées de `row - sourceRow` ;
 * - une formule qui ne référence que des lignes absolues / des plages / sa propre colonne est
 *   ignorée (rien pour déclencher le calcul).
 */
export const withAutoFormulas = (
  rows: readonly Record<string, any>[],
  columns: readonly { name: string }[],
  options: AutoFormulaOptions = {},
): Record<string, any>[] | null => {
  if (!rows.length || !columns.length) return null

  // Modèles par colonne, dans l'ordre des lignes (une passe)
  const templates = new Map<string, FormulaTemplate[]>()
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]
    if (!row) continue
    for (const col of columns) {
      const v = row[col.name]
      if (!isFormula(v)) continue
      const list = templates.get(col.name)
      if (list) list.push({ row: r, formula: v.trim() })
      else templates.set(col.name, [{ row: r, formula: v.trim() }])
    }
  }
  if (!templates.size) return null

  const names = columns.map((c) => c.name)
  let out: Record<string, any>[] | null = null

  for (let r = 0; r < rows.length; r++) {
    if (options.onlyRow !== undefined && r !== options.onlyRow) continue
    const row = rows[r]
    if (!row) continue
    let patch: Record<string, any> | null = null
    for (const [name, list] of templates) {
      if (!isBlankValue(row[name])) continue
      const tpl = nearestTemplate(list, r)
      if (!tpl) continue
      const formula = shiftFormulaRefs(tpl.formula, r - tpl.row, 0)
      const refs = sameRowRefs(formula, r, names)
      // Une formule qui se référence elle-même (même ligne, même colonne) ne peut pas être
      // propagée : elle donnerait `#CYCLE!` sur la ligne cible.
      if (refs.includes(name)) continue
      if (!refs.length) continue
      if (!refs.every((n) => !isBlankValue(row[n]))) continue
      patch ??= { ...row }
      patch[name] = formula
    }
    if (!patch) continue
    out ??= rows.map((x) => x)
    out[r] = patch
  }
  return out
}
