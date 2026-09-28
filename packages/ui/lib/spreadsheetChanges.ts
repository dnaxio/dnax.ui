// spreadsheetChanges — suivi des modifications d'un tableur : delta entre un **état de
// référence** (« ce qui a été chargé / enregistré ») et l'état courant.
//
// Le delta est organisé par **niveau**, comme le modèle de données :
//   • `rows`   — lignes **ajoutées / modifiées / supprimées** (identité = clé stable `_key`) ;
//   • `sheets` — feuilles **ajoutées / modifiées / supprimées** (identité = `key`) ;
//   • `extras` — autres parties du document (mise en forme, largeurs, filtres, fusions…).
//
// Décision d'architecture : on **compare deux photographies** au lieu de journaliser les
// opérations. Conséquences recherchées :
//   • le résultat est juste quels que soient les chemins de mutation traversés (édition, collage,
//     recopie, tri, réordonnancement, import CSV, undo/redo…) — aucun chemin à ne pas oublier ;
//   • c'est l'état **net** qui est rapporté, pas l'historique : modifier puis annuler ⇒ rien ;
//   • « modifié » a un sens fort et vérifiable : le document (`toJSON()`) diffère de la référence.
//
// Pur (aucun DOM, aucun Vue) → testable, comme `lib/spreadsheet.ts`.

import { isBlankValue } from "./spreadsheet"

/** Propriété d'identité des lignes (injectée par `QSpreadsheet`) */
export const DEFAULT_ROW_KEY = "_key"

/**
 * Parties d'une feuille comparées en plus des lignes et des colonnes — une modification de mise
 * en forme, de largeur, de filtre… rend le document « modifié » sans toucher aux lignes.
 */
export const DOC_EXTRA_PARTS = [
  "formats",
  "widths",
  "rowHeights",
  "filters",
  "rules",
  "merges",
  "hiddenRows",
  "hiddenCols",
] as const

export type QSpreadsheetExtraPart = (typeof DOC_EXTRA_PARTS)[number]

/** Feuille telle qu'elle circule dans un document (`QSpreadsheetSheet` sérialisée) */
export interface QSpreadsheetSheetPayload {
  /** Clé stable de la feuille */
  key?: string
  /** Nom affiché sur l'onglet */
  name?: string
  /** Lignes de la feuille */
  rows?: Record<string, any>[]
  /** Schéma de la feuille (noms ou descripteurs complets) */
  columns?: (string | { name: string })[]
  [extra: string]: any
}

/** Document minimal manipulé par le diff (`QSpreadsheetDocument`) */
export interface QSpreadsheetDocumentPayload {
  version?: number
  active?: string
  sheets?: QSpreadsheetSheetPayload[]
}

const isRecord = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

/**
 * Égalité profonde (objets simples, tableaux, primitives). L'**ordre des clés** est ignoré — les
 * records de mise en forme / largeurs sont reconstruits dans un ordre variable selon le chemin.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
    return a.every((v, i) => deepEqual(v, b[i]))
  }
  if (isRecord(a) && isRecord(b)) {
    const ka = Object.keys(a)
    if (ka.length !== Object.keys(b).length) return false
    return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]))
  }
  return false
}

/**
 * Même valeur de cellule ?
 *
 * `null`, `undefined` et `""` sont **équivalents** (« vide ») : ajouter une colonne vide, ou vider
 * une cellule, ne marque donc aucune ligne comme modifiée. Les tableaux (`multiselect`) sont
 * comparés élément par élément, les objets en profondeur.
 */
export function sameCellValue(a: unknown, b: unknown): boolean {
  if (isBlankValue(a) || isBlankValue(b)) return isBlankValue(a) && isBlankValue(b)
  if (Object.is(a, b)) return true
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
    return a.every((v, i) => sameCellValue(v, b[i]))
  }
  if (isRecord(a) && isRecord(b)) return deepEqual(a, b)
  return false
}

/** Une ligne du delta : sa feuille, sa clé stable et ses valeurs */
export interface QSpreadsheetRowRef {
  /** Clé de la feuille d'appartenance (`sheet-1` quand le classeur n'a qu'une feuille) */
  sheet: string
  /** Clé stable de la ligne (`_key`), normalisée en chaîne */
  key: string
  /** La ligne (valeurs stockées, `_key` compris) */
  row: Record<string, any>
}

/** Une ligne modifiée : valeurs avant / après + noms des colonnes touchées */
export interface QSpreadsheetRowUpdate extends QSpreadsheetRowRef {
  /** La ligne telle qu'elle était dans la référence */
  before: Record<string, any>
  /** Noms des colonnes dont la valeur a changé */
  columns: string[]
}

export interface QSpreadsheetRowsDelta {
  added: QSpreadsheetRowRef[]
  updated: QSpreadsheetRowUpdate[]
  deleted: QSpreadsheetRowRef[]
}

/** Une feuille modifiée (nom et/ou schéma) */
export interface QSpreadsheetSheetUpdate {
  key: string
  /** La feuille dans la référence */
  before: QSpreadsheetSheetPayload
  /** La feuille maintenant */
  sheet: QSpreadsheetSheetPayload
  /** Parties de la feuille qui ont changé : `"name"`, `"columns"` */
  changed: string[]
}

export interface QSpreadsheetSheetsDelta {
  added: QSpreadsheetSheetPayload[]
  updated: QSpreadsheetSheetUpdate[]
  deleted: QSpreadsheetSheetPayload[]
}

/** Delta complet entre une référence et l'état courant */
export interface QSpreadsheetChanges {
  /** Vrai dès qu'une ligne, une feuille ou une autre partie du document diffère */
  dirty: boolean
  /**
   * Nombre d'éléments touchés : lignes + feuilles, plus **1** si d'autres parties du document
   * ont changé (mise en forme, largeur, filtre…) — pratique pour un badge.
   */
  count: number
  /** Niveau **lignes** (feuilles présentes avant **et** après) */
  rows: QSpreadsheetRowsDelta
  /** Niveau **feuilles** */
  sheets: QSpreadsheetSheetsDelta
  /** Parties du document touchées hors lignes / feuilles (`"formats"`, `"widths"`…) */
  extras: QSpreadsheetExtraPart[]
}

const emptyDelta = (): QSpreadsheetChanges => ({
  dirty: false,
  count: 0,
  rows: { added: [], updated: [], deleted: [] },
  sheets: { added: [], updated: [], deleted: [] },
  extras: [],
})

/** Identité d'une ligne, ou `undefined` si elle n'est pas identifiable (pas de clé) */
const identity = (row: Record<string, any> | undefined, key: string): string | undefined => {
  const v = row?.[key]
  return v === undefined || v === null || v === "" ? undefined : String(v)
}

const indexByKey = (
  rows: Record<string, any>[] | undefined,
  key: string,
): Map<string, Record<string, any>> => {
  const map = new Map<string, Record<string, any>>()
  for (const row of rows ?? []) {
    const id = identity(row, key)
    if (id !== undefined) map.set(id, row)
  }
  return map
}

const namesOf = (
  columns: (string | { name: string })[] | undefined,
  before: Record<string, any>,
  after: Record<string, any>,
  key: string,
): string[] => {
  if (columns?.length) return columns.map((c) => (typeof c === "string" ? c : c.name))
  // Pas de schéma déclaré : on compare les clés présentes, `_key` exclue
  const names = new Set(Object.keys(before))
  for (const k of Object.keys(after)) names.add(k)
  names.delete(key)
  return [...names]
}

export interface DiffRowsOptions {
  /** Colonnes comparées (le schéma de la feuille) — sinon les clés des lignes elles-mêmes */
  columns?: (string | { name: string })[]
  /** Propriété d'identité (défaut : `_key`) */
  key?: string
  /** Clé de la feuille reportée sur chaque entrée du delta */
  sheet?: string
}

/**
 * Delta des **lignes** entre deux états, par identité (`_key`).
 *
 * Seules les colonnes du schéma courant sont comparées : supprimer une colonne ne déclenche donc
 * pas une modification sur chacune des lignes (le changement de schéma est rapporté au niveau
 * feuille). Les lignes sans clé ne sont pas suivies.
 */
export function diffRows(
  before: Record<string, any>[] | undefined,
  after: Record<string, any>[] | undefined,
  options: DiffRowsOptions = {},
): QSpreadsheetRowsDelta {
  const key = options.key ?? DEFAULT_ROW_KEY
  const sheet = options.sheet ?? ""
  const reference = indexByKey(before, key)

  const added: QSpreadsheetRowRef[] = []
  const updated: QSpreadsheetRowUpdate[] = []
  const seen = new Set<string>()

  for (const row of after ?? []) {
    const id = identity(row, key)
    if (id === undefined) continue
    seen.add(id)
    const prev = reference.get(id)
    if (!prev) {
      added.push({ sheet, key: id, row })
      continue
    }
    const names = namesOf(options.columns, prev, row, key)
    const columns = names.filter((name) => !sameCellValue(prev[name], row[name]))
    if (columns.length) updated.push({ sheet, key: id, before: prev, row, columns })
  }

  const deleted: QSpreadsheetRowRef[] = []
  for (const [id, row] of reference) if (!seen.has(id)) deleted.push({ sheet, key: id, row })

  return { added, updated, deleted }
}

/** Delta des **feuilles** entre deux états, par `key` (nom et schéma) */
export function diffSheets(
  before: QSpreadsheetSheetPayload[] | undefined,
  after: QSpreadsheetSheetPayload[] | undefined,
): QSpreadsheetSheetsDelta {
  const reference = new Map<string, QSpreadsheetSheetPayload>()
  for (const sheet of before ?? []) reference.set(String(sheet.key ?? ""), sheet)

  const added: QSpreadsheetSheetPayload[] = []
  const updated: QSpreadsheetSheetUpdate[] = []
  const seen = new Set<string>()

  for (const sheet of after ?? []) {
    const key = String(sheet.key ?? "")
    seen.add(key)
    const prev = reference.get(key)
    if (!prev) {
      added.push(sheet)
      continue
    }
    const changed: string[] = []
    if (String(sheet.name ?? "") !== String(prev.name ?? "")) changed.push("name")
    if (!deepEqual(sheet.columns ?? [], prev.columns ?? [])) changed.push("columns")
    if (changed.length) updated.push({ key, before: prev, sheet, changed })
  }

  const deleted = (before ?? []).filter((s) => !seen.has(String(s.key ?? "")))
  return { added, updated, deleted }
}

/**
 * Delta complet entre une **référence** et l'**état courant** (deux documents de la forme de
 * `toJSON()`). Une feuille ajoutée emporte ses lignes dans `sheets.added` (elles ne sont pas
 * répétées dans `rows`) — et inversement pour une feuille supprimée ; `rows` ne décrit donc que
 * l'évolution des feuilles présentes des deux côtés.
 *
 * `active` (onglet courant) et `version` sont **ignorés** : changer d'onglet n'est pas une
 * modification de données.
 */
export function diffDocuments(
  reference: QSpreadsheetDocumentPayload | null | undefined,
  current: QSpreadsheetDocumentPayload | null | undefined,
): QSpreadsheetChanges {
  if (!reference || !current) return emptyDelta()

  const sheets = diffSheets(reference.sheets, current.sheets)
  const beforeSheets = new Map<string, QSpreadsheetSheetPayload>()
  for (const sheet of reference.sheets ?? []) beforeSheets.set(String(sheet.key ?? ""), sheet)

  const rows: QSpreadsheetRowsDelta = { added: [], updated: [], deleted: [] }
  const extras = new Set<QSpreadsheetExtraPart>()

  for (const sheet of current.sheets ?? []) {
    const key = String(sheet.key ?? "")
    const prev = beforeSheets.get(key)
    if (!prev) continue // feuille ajoutée : ses lignes sont portées par `sheets.added`

    const delta = diffRows(prev.rows, sheet.rows, { columns: sheet.columns, sheet: key })
    rows.added.push(...delta.added)
    rows.updated.push(...delta.updated)
    rows.deleted.push(...delta.deleted)

    for (const part of DOC_EXTRA_PARTS) {
      if (!deepEqual(sheet[part], prev[part])) extras.add(part)
    }
  }

  const count =
    rows.added.length +
    rows.updated.length +
    rows.deleted.length +
    sheets.added.length +
    sheets.updated.length +
    sheets.deleted.length +
    // Une modification « autre » (mise en forme, largeur, filtre…) compte pour **un** élément :
    // l'indicateur doit rester parlant même sans ligne ni feuille touchée.
    (extras.size ? 1 : 0)

  return {
    dirty: count > 0,
    count,
    rows,
    sheets,
    extras: DOC_EXTRA_PARTS.filter((part) => extras.has(part)),
  }
}
