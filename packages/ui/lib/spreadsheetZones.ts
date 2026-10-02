// **Zones** de QSpreadsheet (`<q-spreadsheet>`) désignées par des **noms** — servent à deux
// choses : verrouiller des cellules (`lockedRanges`) et les **préremplir** (`prefill`).
//
// On désigne les cellules par **nom de colonne** (la clé dans `rows`), jamais par index :
//
//   { row: 2, column: "total" }   → la cellule « total » de la ligne 2
//   { row: 0 }                    → toute la ligne 0
//   { column: "total" }           → toute la colonne « total »
//   { from: {...}, to: {...} }    → un bloc (bornes incluses, dans n'importe quel ordre)
//
// `lockRect()` traduit cette forme en rectangle d'**index** (une borne `null` = non bornée) ;
// `prefillForRow()` en déduit les valeurs à poser dans une ligne neuve. Logique **pure**,
// testable hors navigateur — comme `spreadsheetValidation.ts`.
import { colLetter } from "./spreadsheet"

/** Un coin, en clair : ligne (0-based) + **nom** de colonne. */
export interface QSpreadsheetLockPoint {
  /** Ligne, 0-based (0 = première ligne de données) */
  row: number
  /** Nom de la colonne — la clé utilisée dans `rows` (ex. `"total"`) */
  column: string
}

/**
 * Un verrou, écrit avec des **noms** :
 * - `{ row: 2, column: "total" }` → une cellule ;
 * - `{ row: 0 }` → toute la ligne 0 ;
 * - `{ column: "total" }` → toute la colonne ;
 * - `{ from, to }` → le bloc entre les deux coins (bornes incluses).
 */
export interface QSpreadsheetLock {
  /** Ligne (0-based). Omise → **toutes** les lignes. */
  row?: number
  /** Nom de colonne. Omise → **toutes** les colonnes. */
  column?: string
  /** Premier coin d'un **bloc** (avec `to`) — prioritaire sur `row` / `column`. */
  from?: QSpreadsheetLockPoint
  /** Coin opposé du bloc (avec `from`). */
  to?: QSpreadsheetLockPoint
}

/** Rectangle d'index. Une borne `null` = **non bornée** (toutes les lignes / colonnes). */
export interface LockRect {
  r0: number | null
  c0: number | null
  r1: number | null
  c1: number | null
}

/**
 * Traduit un verrou lisible en rectangle d'index.
 * `null` quand il ne désigne rien : objet vide, `from`/`to` incomplets, ou nom de colonne
 * inconnu (un verrou mal orthographié est **ignoré** plutôt que de tout verrouiller).
 */
export function lockRect(
  lock: QSpreadsheetLock | undefined,
  columnIndex: (name: string) => number,
): LockRect | null {
  if (!lock) return null

  if (lock.from && lock.to) {
    const a = columnIndex(lock.from.column)
    const b = columnIndex(lock.to.column)
    if (a === -1 || b === -1) return null
    return {
      r0: Math.min(lock.from.row, lock.to.row),
      r1: Math.max(lock.from.row, lock.to.row),
      c0: Math.min(a, b),
      c1: Math.max(a, b),
    }
  }

  const hasRow = typeof lock.row === "number"
  const hasColumn = typeof lock.column === "string"
  if (!hasRow && !hasColumn) return null

  let c0: number | null = null
  let c1: number | null = null
  if (hasColumn) {
    const ci = columnIndex(lock.column as string)
    if (ci === -1) return null
    c0 = ci
    c1 = ci
  }

  const r = hasRow ? (lock.row as number) : null
  return { r0: r, r1: r, c0, c1 }
}

/** Traduit une liste de verrous (les entrées non résolvables sont ignorées). */
export function lockRects(
  locks: QSpreadsheetLock[] | undefined,
  columnIndex: (name: string) => number,
): LockRect[] {
  if (!Array.isArray(locks)) return []
  const out: LockRect[] = []
  for (const lock of locks) {
    const rect = lockRect(lock, columnIndex)
    if (rect) out.push(rect)
  }
  return out
}

/** La cellule `(row, col)` tombe-t-elle dans le rectangle ? (bornes `null` = non bornées) */
export const inLockRect = (rect: LockRect, row: number, col: number): boolean =>
  (rect.r0 === null || row >= rect.r0) &&
  (rect.r1 === null || row <= rect.r1) &&
  (rect.c0 === null || col >= rect.c0) &&
  (rect.c1 === null || col <= rect.c1)

// ─────────────────────────── Préremplissage ───────────────────────────

/**
 * Une **formule** de préremplissage : une chaîne (`"SUM(B1:B2)"` ou `"=SUM(B1:B2)"` — le `=`
 * initial est ajouté s'il manque) ou une **fonction** du contexte qui renvoie cette chaîne.
 */
export type QSpreadsheetFillFormula = string | ((ctx: QSpreadsheetFillContext) => string)

/** Zone **préremplie** : mêmes coordonnées qu'un verrou, plus une `value` **et/ou** une `fx`. */
export interface QSpreadsheetFill extends QSpreadsheetLock {
  /**
   * Valeur posée dans les cellules **vides** de la zone. Une **constante** (`0`, `"todo"`, …)
   * **ou** une **fonction** du contexte — pour une valeur **dynamique** (agrégat calculé…).
   * Une chaîne commençant par `"="` est stockée comme **formule** et évaluée par le tableur.
   *
   * Si `fx` est **aussi** fourni, c'est `fx` qui gagne.
   */
  value?: any | ((ctx: QSpreadsheetFillContext) => any)
  /**
   * **Formule** de la zone, **prioritaire sur `value`** : une chaîne (`"SUM(B1:B2)"` — le `=`
   * initial est ajouté s'il manque) ou une fonction qui la renvoie. Écrit explicitement « c'est
   * une formule », sans se soucier du préfixe :
   *
   * ```ts
   * { row: 2, column: "total", fx: ({ letterOf, rowCount }) =>
   *     `SUM(${letterOf("effectif")}1:${letterOf("effectif")}${rowCount - 1})` }
   * ```
   */
  fx?: QSpreadsheetFillFormula
}

/**
 * Contexte remis à une `value` **fonction**, décrit la cellule remplie et le document
 * au moment du remplissage. Permet d'écrire des formules dont la référence dépend de la
 * position ou de la taille des données :
 *
 * ```ts
 * // somme de TOUTE la colonne « effectif » (autant de lignes qu'il y en a)
 * { row: 3, column: "net", fx: ({ letterOf, rowCount }) =>
 *     `SUM(${letterOf("effectif")}1:${letterOf("effectif")}${rowCount})` }
 * ```
 */
export interface QSpreadsheetFillContext {
  /** Index (0-based) de la ligne remplie */
  rowIndex: number
  /** La ligne ciblée (référence live sur `rows`) */
  row: Record<string, any>
  /** Nom de la colonne remplie */
  column: string
  /** Index (0-based) de la colonne remplie */
  columnIndex: number
  /** Lettre A1 de la colonne remplie (ex. `"C"`) */
  letter: string
  /** Nombre de lignes du document au moment du remplissage */
  rowCount: number
  /** Lettre A1 d'une colonne par son **nom** (ex. `letterOf("effectif")` → `"C"`) */
  letterOf: (column: string) => string
}

/** Contexte minimal fourni par le composant (ligne ciblée + taille du document). */
export interface QSpreadsheetFillEnv {
  /** La ligne ciblée (référence live sur `rows`) */
  row?: Record<string, any>
  /** Nombre de lignes du document au moment du remplissage */
  rowCount?: number
}

/**
 * Valeurs à poser dans une ligne d'index `rowIndex`, d'après les zones `prefill` :
 * chaque zone qui couvre cette ligne fournit sa valeur pour toutes ses colonnes — une `fx`
 * (formule, **prioritaire**) sinon une `value` ; les deux peuvent être des fonctions appelées
 * avec le `QSpreadsheetFillContext`. Renvoie `{}` s'il n'y a rien à poser. Pur → testable sans
 * navigateur.
 */
export function prefillForRow(
  fills: QSpreadsheetFill[] | undefined,
  rowIndex: number,
  columnNames: string[],
  env: QSpreadsheetFillEnv = {},
): Record<string, any> {
  if (!Array.isArray(fills) || !fills.length || !columnNames.length) return {}

  const columnIndex = (name: string) => columnNames.indexOf(name)
  const letterAt = (i: number) => colLetter(i)
  const letterOf = (name: string) => letterAt(columnIndex(name))
  const rowCount = env.rowCount ?? 0
  const out: Record<string, any> = {}

  for (const fill of fills) {
    const rect = lockRect(fill, columnIndex)
    if (!rect) continue
    if (rect.r0 !== null && rowIndex < rect.r0) continue
    if (rect.r1 !== null && rowIndex > rect.r1) continue

    const from = rect.c0 ?? 0
    const to = rect.c1 ?? columnNames.length - 1
    for (let c = from; c <= to; c++) {
      const name = columnNames[c]
      if (name === undefined) continue

      const ctx: QSpreadsheetFillContext = {
        rowIndex,
        row: env.row ?? {},
        column: name,
        columnIndex: c,
        letter: letterAt(c),
        rowCount,
        letterOf,
      }

      // `fx` (formule) est prioritaire ; `value` ne sert que si aucune formule n'est fournie.
      const formula = fillFormula(fill, ctx)
      if (formula !== undefined) {
        out[name] = formula
        continue
      }
      if (fill.value !== undefined) {
        out[name] = typeof fill.value === "function" ? fill.value(ctx) : fill.value
      }
      // ni `fx` ni `value` → rien à poser
    }
  }

  return out
}

/** Formule résolue d'une zone (normalisée avec un `=` initial), ou `undefined`. */
function fillFormula(
  fill: QSpreadsheetFill,
  ctx: QSpreadsheetFillContext,
): string | undefined {
  if (fill.fx === undefined || fill.fx === null) return undefined
  const raw = typeof fill.fx === "function" ? fill.fx(ctx) : fill.fx
  return normalizeFormula(raw)
}

/** `"SUM(B1:B2)"` → `"=SUM(B1:B2)"` ; `""` / non-chaîne → `undefined`. */
function normalizeFormula(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined
  const s = raw.trim()
  if (!s) return undefined
  return s.startsWith("=") ? s : "=" + s
}
