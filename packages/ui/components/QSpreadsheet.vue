<script lang="ts">
// QSpreadsheet — tableur type Excel (grille éditable) :
// sélection de cellule + plage (clic, maj+clic, glisser, clavier),
// édition en place (Entrée / F2 / double-clic / frappe directe),
// lignes & colonnes (ajouter / insérer / supprimer),
// tri, copier/coller, undo/redo, et cellules typées
// (texte, nombre, entier, booléen, date, datetime, select avec badges colorés).
export type QSpreadsheetCellType =
  | "string"
  | "text"
  | "number"
  | "integer"
  | "email"
  | "url"
  | "boolean"
  | "date"
  | "datetime"
  | "select"

export interface QSpreadsheetCellOption {
  /** Valeur stockée dans la cellule */
  value: any
  /** Libellé affiché */
  label: string
  /** Couleur du badge (token ou hex, ex. "positive", "#22c55e") */
  color?: string
}

export interface QSpreadsheetColumn {
  /** Clé de la propriété dans la ligne */
  name: string
  label?: string
  /** Largeur de colonne (nombre px ou chaîne CSS) — défaut : defaultColWidth */
  width?: number | string
  /** Largeur minimale en px (redimensionnement) */
  minWidth?: number
  /** Largeur maximale en px */
  maxWidth?: number
  align?: "left" | "center" | "right"
  type?: QSpreadsheetCellType
  /** La cellule est éditable (Entrée / double-clic / frappe) */
  editable?: boolean
  /** Pour type "select" : options (badges colorés) */
  options?: QSpreadsheetCellOption[]
  /** Pour type "select" : rend l'option active en badge coloré (sinon texte) */
  chip?: boolean
  /** Validation à la saisie : { min, max, integer?, pattern?, message? } */
  validation?: QSpreadsheetValidation
  /** Formatteur de la valeur affichée */
  format?: (val: any, row: Record<string, any>) => any
  /** Classe CSS de la cellule (défaut : ) */
  cellClass?: (val: any, row: Record<string, any>) => string | undefined
  /** Couleur de fond de la cellule (plan) */
  cellBackground?: (val: any, row: Record<string, any>) => string | undefined
  headerClass?: string
  headerStyle?: string
}

export interface QSpreadsheetValidation {
  /** Valeur minimale (types numériques / entiers) */
  min?: number
  /** Valeur maximale (types numériques / entiers) */
  max?: number
  /** Exige un entier (si présent, valide les entiers) */
  integer?: boolean
  /** Expression régulière validée contre le texte */
  pattern?: string
  /** Message d'erreur affiché (sinon message générique) */
  message?: string
}

export interface QSpreadsheetSelection {
  /** Ligne de départ (ancre) */
  row: number
  /** Colonne de départ (ancre) */
  column: string
  /** Ligne de fin (plage ; = row si cellule seule) */
  endRow: number
  /** Colonne de fin (plage ; = column si cellule seule) */
  endColumn: string
}

/** Une feuille d'un classeur multi-onglets (rows = objets par column.name) */
export interface QSpreadsheetSheet {
  /** Clé stable de la feuille (optionnelle — générée sinon) */
  key?: string
  /** Nom affiché sur l'onglet (défaut "Sheet N") */
  name?: string
  /** Colonnes ({ name, label, type, width, … }) — sinon déduites des rows */
  columns?: QSpreadsheetColumn[]
  /** Lignes de la feuille */
  rows?: Record<string, any>[]
}

/** État complet exportable d'un classeur (JSON / sérialisation) */
export interface QSpreadsheetDocument {
  version: 1
  active: string
  sheets: (QSpreadsheetSheet & {
    formats?: Record<string, { bold?: boolean; italic?: boolean; bg?: string; color?: string }>
    widths?: Record<string, number | string>
    rowHeights?: Record<number, number>
    filters?: Record<string, string[] | null>
  })[]
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import { icons } from "../lib/icons"
import { colorValue, foregroundFor } from "../lib/colors"
import { radiusStyle, useRadius, useConfigLang } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"
import { evaluateFormula, isError, FormulaError } from "../lib/formula"
import type { FormulaValue } from "../lib/formula"
import {
  colLetter,
  colFromLetters,
  isBlankValue,
  ISO_DATE,
  isoAddDays,
  shiftFormulaRefs,
  csvEscape,
  deriveCols,
  parseCsv,
} from "../lib/spreadsheet"

interface Props {
  /** Lignes (v-model:rows) — un objet par ligne, clés = noms de colonnes */
  rows?: Record<string, any>[]
  /** Colonnes ({ name, label, width, type, editable, options, chip, format, align, … }) */
  columns?: QSpreadsheetColumn[]
  /** Hauteur du conteneur scrollable (nombre px ou chaîne CSS, défaut "360px") */
  height?: string | number
  /** Hauteur de ligne en px (défaut 32) */
  rowHeight?: number
  /** Largeur de colonne par défaut en px (défaut 160) */
  defaultColWidth?: number
  /** Affiche la barre d'outils */
  showToolbar?: boolean
  /** Affiche la barre de formule (fx) au-dessus de la grille */
  showFormulaBar?: boolean
  /** Nombre de lignes du haut gelées (freeze panes) */
  frozenRows?: number
  /** Nombre de colonnes de gauche gelées (freeze panes) */
  frozenCols?: number
  /** Virtualise les lignes (défaut true — actif au-delà de ~150 lignes) */
  virtualScroll?: boolean
  /** Classeur multi-feuilles (v-model:sheets) — remplace rows/columns */
  sheets?: QSpreadsheetSheet[]
  /** Position des onglets de feuilles : "top" (défaut) ou "bottom" (Excel) */
  sheetsPosition?: "top" | "bottom"
  /** Langue de l'interface : "en" (défaut) ou "fr" */
  lang?: "en" | "fr"
  /** Affiche le numéro de ligne (colonne de gauche) */
  showRowNumbers?: boolean
  /** Affiche l'en-tête de colonne (lettre + label) */
  showColumnHeaders?: boolean
  /** Sélection (v-model:selected) — { row, column, endRow, endColumn } */
  selected?: QSpreadsheetSelection | null
  /** Hauteur réduite */
  dense?: boolean
  /** Sans ombre */
  flat?: boolean
  /** Bordure */
  bordered?: boolean
  /** Couleur des en-têtes (icônes grisées) */
  dark?: boolean
  /** Désactive l'édition (lecture seule) */
  readonly?: boolean
  /** Désactive tout (lecture seule + grisée) */
  disable?: boolean
  /** Coins arrondis (échelle xs|sm|md|lg ou none) — défaut : composantProps */
  radius?: RadiusProp
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  columns: () => [],
  height: "360px",
  rowHeight: 32,
  defaultColWidth: 160,
  showToolbar: true,
  showFormulaBar: true,
  frozenRows: 0,
  frozenCols: 0,
  virtualScroll: true,
  sheets: undefined,
  sheetsPosition: "top",
  lang: "en",
  showRowNumbers: true,
  showColumnHeaders: true,
  selected: null,
  dense: false,
  flat: false,
  bordered: false,
  dark: false,
  readonly: false,
  disable: false,
})

// ─── i18n (en | fr) ───
const I18N = {
  en: {
    sheet: "Sheet",
    fxPlaceholder: "Value or formula (=SUM(A1:A3)…)",
    fxNoSel: "Select a cell…",
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    clearContents: "Clear contents",
    insertRowAbove: "Insert row above",
    insertRowBelow: "Insert row below",
    deleteRows: "Delete selected rows",
    insertColLeft: "Insert column left",
    insertColRight: "Insert column right",
    deleteCols: "Delete selected columns",
    sortAsc: "Sort A → Z",
    sortDesc: "Sort Z → A",
    bold: "Bold",
    italic: "Italic",
    wrapText: "Wrap text",
    mergeCells: "Merge cells",
    unmerge: "Unmerge selection",
    hideRows: "Hide selected rows",
    hideCol: "Hide column",
    showHidden: "Show all hidden",
    showCol: "Show column “{name}”",
    condFormat: "Conditional formatting…",
    fillColor: "Fill color",
    textColor: "Text color",
    clearFormat: "Clear formatting",
    rowLbl: "Row",
    colLbl: "Column",
    cellLbl: "Cell",
    findPh: "Find…",
    replacePh: "Replace…",
    replace: "Replace",
    replaceAll: "Replace all",
    close: "Close",
    prev: "Previous",
    next: "Next",
    filterTitle: "Filter column",
    selectAll: "Select all",
    noValues: "{{ t('noValues') }}",
    clearFilter: "Clear filter",
    searchValues: "Search values…",
    blanks: "(Blanks)",
    noRowsFilter: "No rows match the filter.",
    noRowsYet: "No rows yet — add one with the toolbar or right-click.",
    noColsYet: "{{ t('noColsYet') }}",
    condGreater: "greater than",
    condGe: "≥",
    condLess: "less than",
    condLe: "≤",
    condEq: "equal",
    condContains: "contains",
    condBlank: "is blank",
    condNotBlank: "not blank",
    condFormula: "formula (A1)",
    condAdd: "Add rule",
    condUpdate: "Update",
    condColumn: "Column",
    condValue: "Value",
    condClear: "Clear all rules",
    condSelection: "Selection",
    statusRowsShown: "{total} rows · {shown} shown",
    statusRows: "{total} rows",
    statusSheets: "{n} sheets",
    addSheet: "Add sheet",
    removeSheet: "Remove sheet",
    empty: "…",
  },
  fr: {
    sheet: "Feuille",
    fxPlaceholder: "Valeur ou formule (=SOMME(A1:A3)…)",
    fxNoSel: "Sélectionnez une cellule…",
    cut: "Couper",
    copy: "Copier",
    paste: "Coller",
    clearContents: "Effacer le contenu",
    insertRowAbove: "Insérer une ligne au-dessus",
    insertRowBelow: "Insérer une ligne en dessous",
    deleteRows: "Supprimer les lignes sélectionnées",
    insertColLeft: "Insérer une colonne à gauche",
    insertColRight: "Insérer une colonne à droite",
    deleteCols: "Supprimer les colonnes sélectionnées",
    sortAsc: "Trier A → Z",
    sortDesc: "Trier Z → A",
    bold: "Gras",
    italic: "Italique",
    wrapText: "Retour à la ligne",
    mergeCells: "Fusionner les cellules",
    unmerge: "Défusionner la sélection",
    hideRows: "Masquer les lignes sélectionnées",
    hideCol: "Masquer la colonne",
    showHidden: "Tout afficher",
    showCol: "Afficher la colonne «{name}»",
    condFormat: "Mise en forme conditionnelle…",
    fillColor: "Couleur de fond",
    textColor: "Couleur du texte",
    clearFormat: "Effacer la mise en forme",
    rowLbl: "Ligne",
    colLbl: "Colonne",
    cellLbl: "Cellule",
    findPh: "Rechercher…",
    replacePh: "Remplacer…",
    replace: "Remplacer",
    replaceAll: "Tout remplacer",
    close: "Fermer",
    prev: "Précédent",
    next: "Suivant",
    filterTitle: "Filtrer la colonne",
    selectAll: "Tout sélectionner",
    noValues: "Aucune valeur",
    clearFilter: "Effacer le filtre",
    searchValues: "Rechercher des valeurs…",
    blanks: "(Vides)",
    noRowsFilter: "Aucune ligne ne correspond au filtre.",
    noRowsYet: "Aucune ligne — ajoutez-en via la barre d'outils ou un clic droit.",
    noColsYet: "Ajoutez une colonne via la barre d'outils (+) ou un clic droit.",
    condGreater: "supérieur à",
    condGe: "≥",
    condLess: "inférieur à",
    condLe: "≤",
    condEq: "égal à",
    condContains: "contient",
    condBlank: "est vide",
    condNotBlank: "non vide",
    condFormula: "formule (A1)",
    condAdd: "Ajouter la règle",
    condUpdate: "Mettre à jour",
    condColumn: "Colonne",
    condValue: "Valeur",
    condClear: "Tout effacer",
    condSelection: "Sélection",
    statusRowsShown: "{total} lignes · {shown} affichées",
    statusRows: "{total} lignes",
    statusSheets: "{n} feuilles",
    addSheet: "Ajouter une feuille",
    removeSheet: "Supprimer la feuille",
    empty: "…",
  },
} as const
type UiKey = keyof (typeof I18N)["en"]
const configLang = useConfigLang()
const lang = computed(() => props.lang ?? configLang.value)
const t = (key: UiKey): string => I18N[lang.value][key] ?? I18N.en[key]
const fmt = (key: UiKey, params: Record<string, string | number>) =>
  String(t(key)).replace(/\{([a-z]+)\}/g, (_m, k: string) => String(params[k] ?? ""))
const sheetName = (n: number) => fmt("sheet", {}) + " " + n

const emit = defineEmits<{
  "update:rows": [value: Record<string, any>[]]
  "update:selected": [value: QSpreadsheetSelection | null]
  "update:columns": [value: QSpreadsheetColumn[]]
  "update:sheets": [value: QSpreadsheetSheet[]]
  "cell-click": [payload: { row: number; column: string; value: any }]
  "cell-change": [payload: { row: number; column: string; oldValue: any; newValue: any; rows: Record<string, any>[] }]
  "cell-edit-start": [payload: { row: number; column: string }]
  "cell-edit-end": [payload: { row: number; column: string; canceled: boolean }]
  "selection-change": [value: QSpreadsheetSelection | null]
  "structure-change": [payload: { rows: Record<string, any>[]; columns: QSpreadsheetColumn[]; reason: string }]
}>()

// ─── Données internes (copie éditable des rows) ───
const state = ref<Record<string, any>[]>([])
watch(
  () => props.rows,
  (v) => {
    if (v && v !== state.value) state.value = v.map((r) => ({ ...r }))
  },
  { immediate: true },
)
const pushRows = (next: Record<string, any>[]) => {
  state.value = next
  emit("update:rows", next)
}

// ─── Colonnes internes ───
const cols = ref<QSpreadsheetColumn[]>([])
watch(
  () => props.columns,
  (v) => {
    if (v && v !== cols.value) cols.value = v.map((c) => ({ ...c }))
  },
  { immediate: true },
)
const pushCols = (next: QSpreadsheetColumn[]) => {
  cols.value = next
  emit("update:columns", next)
}

const colIndex = (name: string) => cols.value.findIndex((c) => c.name === name)
const colNameAt = (i: number) => cols.value[i]?.name ?? ""
const colOf = (name: string) => cols.value.find((c) => c.name === name)

// ─── Sélection (ancre + plage) ───
const sel = ref<QSpreadsheetSelection | null>(null)
watch(
  () => props.selected,
  (v) => {
    if (v !== sel.value) sel.value = v ? { ...v } : null
  },
  { deep: true },
)
const setSel = (s: QSpreadsheetSelection | null) => {
  sel.value = s
  emit("update:selected", s)
  emit("selection-change", s)
}

const inSelection = (row: number, column: string) => {
  const s = sel.value
  if (!s) return false
  const r0 = Math.min(s.row, s.endRow)
  const r1 = Math.max(s.row, s.endRow)
  const ci = colIndex(column)
  const c0 = Math.min(colIndex(s.column), colIndex(s.endColumn))
  const c1 = Math.max(colIndex(s.column), colIndex(s.endColumn))
  return row >= r0 && row <= r1 && ci >= c0 && ci <= c1
}
const isActive = (row: number, column: string) => sel.value?.row === row && sel.value?.column === column

const selRect = computed(() => {
  const s = sel.value
  if (!s) return null
  const c0 = colIndex(s.column)
  const c1 = colIndex(s.endColumn)
  if (c0 === -1 || c1 === -1) return null
  return {
    r0: Math.min(s.row, s.endRow),
    r1: Math.max(s.row, s.endRow),
    c0: Math.min(c0, c1),
    c1: Math.max(c0, c1),
  }
})

const select = (row: number, column: string, extend = false) => {
  if (!cols.value.length) return
  row = Math.max(0, Math.min(state.value.length - 1, row))
  ensureRowVisible(row)
  const s = sel.value
  if (extend && s) {
    setSel({ ...s, endRow: row, endColumn: column })
  } else {
    setSel({ row, column, endRow: row, endColumn: column })
  }
  if (pendingFocus.value) pendingFocus.value.col = column
  nextTick(() => {
    focusCell(row, column)
    positionEditor()
  })
}

const moveSelection = (dr: number, dc: number, extend = false) => {
  if (!sel.value || !cols.value.length) return
  const { row, column } = sel.value
  const ci = colIndex(column)
  let nr = Math.max(0, Math.min(state.value.length - 1, row + dr))
  // Filtre actif : saute les lignes masquées lors des déplacements verticaux
  if (dr !== 0 && hasActiveFilters.value) {
    const dir = dr > 0 ? 1 : -1
    while (nr >= 0 && nr < state.value.length && !isRowVisible(nr)) nr += dir
    nr = Math.max(0, Math.min(state.value.length - 1, nr))
  }
  let nc = Math.max(0, Math.min(cols.value.length - 1, ci + dc))
  // Colonnes masquées : sautées en horizontal
  if (dc !== 0) {
    const dir = dc > 0 ? 1 : -1
    while (nc >= 0 && nc < cols.value.length && isColHiddenName(cols.value[nc]!.name))
      nc += dir
    nc = Math.max(0, Math.min(cols.value.length - 1, nc))
  }
  select(nr, colNameAt(nc), extend)
}

const escAttr = (s: string) => String(s).replace(/"/g, '\\"')
const scrollEl = ref<HTMLElement | null>(null)
const rootEl = ref<HTMLElement | null>(null)
const setGridRef = (el: unknown) => {
  rootEl.value = (el as HTMLElement) ?? null
  scrollEl.value = (el as HTMLElement) ?? null
}
const focusCell = (row: number, column: string) => {
  const td = scrollEl.value?.querySelector<HTMLElement>(
    `td[data-row="${row}"][data-col="${escAttr(column)}"]`,
  )
  if (!td) {
    rootEl.value?.focus({ preventScroll: true })
    return
  }
  // Révèle la cellule DANS le viewport uniquement (jamais la page) :
  // on défile le conteneur interne si besoin, puis on focus sans scroll natif.
  const sc = scrollEl.value!
  const sr = sc.getBoundingClientRect()
  const tr = td.getBoundingClientRect()
  const topOffset = headH.value ?? 0 // barre d'en-tête sticky
  const innerTop = tr.top - sr.top + sc.scrollTop
  const innerBottom = innerTop + tr.height
  let target: number | null = null
  if (innerTop < sc.scrollTop + topOffset) target = innerTop - topOffset
  else if (innerBottom > sc.scrollTop + sc.clientHeight) {
    target = innerBottom - sc.clientHeight
  }
  if (target !== null) {
    sc.scrollTop = Math.max(0, target)
    updateRange()
  }
  td.focus({ preventScroll: true })
}

// ─── Formules A1 (évaluation mémorisée, cycle-safe) ───
// Une valeur de cellule qui commence par "=" est une formule :
//   =B2*C2, =SUM(D2:D5), =IF(A2>10,"big","small"), $B$2 (absolue)
const cellValue = (row: number, column: string) => state.value[row]?.[column]

const isFormulaRaw = (v: any) => typeof v === "string" && v.trim().startsWith("=")

const evaluated = computed<FormulaValue[][]>(() => {
  const rows = state.value
  const memo = new Map<string, FormulaValue>()
  const visiting = new Set<string>()

  const get = (r: number, c: number): FormulaValue => {
    const key = r + ":" + c
    if (memo.has(key)) return memo.get(key)!
    if (visiting.has(key)) return new FormulaError("#CYCLE!")
    const row = rows[r]
    const col = cols.value[c]
    if (!row || !col) return new FormulaError("#REF!")
    const raw = row[col.name]
    if (raw === null || raw === undefined || raw === "") {
      memo.set(key, null)
      return null
    }
    let val: FormulaValue = raw as FormulaValue
    if (isFormulaRaw(raw)) {
      visiting.add(key)
      val = evaluateFormula(raw, {
        row: r,
        resolveField: (name) => {
          const i = colIndex(name)
          return i === -1 ? undefined : get(r, i)
        },
        resolveCell: (rr, cc) => get(rr, cc),
      })
      visiting.delete(key)
    }
    memo.set(key, val)
    return val
  }

  const out: FormulaValue[][] = []
  for (let r = 0; r < rows.length; r++) {
    const line: FormulaValue[] = []
    for (let c = 0; c < cols.value.length; c++) line.push(get(r, c))
    out.push(line)
  }
  return out
})

/** Valeur affichable d'une cellule (formule évaluée, sinon valeur brute) */
const evalAt = (row: number, column: string): FormulaValue | undefined => {
  const ci = colIndex(column)
  if (ci === -1) return undefined
  return evaluated.value[row]?.[ci]
}

const isErrorCell = (row: number, column: string): boolean =>
  isError(evalAt(row, column))

const cellText = (row: number, column: string): string => {
  const col = colOf(column)
  const ev = evalAt(row, column)
  if (isError(ev)) return ev.toString()
  if (col?.type === "select") return "" // rendu via badge / label
  let out: any = ev === null || ev === undefined ? "" : ev
  if (col?.format && out !== "") out = col.format(out, state.value[row] ?? {})
  if (out === null || out === undefined || out === "") return ""
  return String(out)
}

const cellTitle = (row: number, column: string): string | undefined => {
  const col = colOf(column)
  const v = state.value[row]?.[column]
  if (isFormulaRaw(v)) return String(v)
  if (col?.type === "select") {
    const opt = col.options?.find((o) => o.value === v)
    return opt?.label ?? (v === null || v === undefined ? undefined : String(v))
  }
  return undefined
}

const cellClasses = (row: number, column: string) => {
  const col = colOf(column)
  const v = state.value[row]?.[column]
  return cn(
    "q-spreadsheet__cell",
    col?.align === "center" && "q-spreadsheet__cell--center",
    col?.align === "right" && "q-spreadsheet__cell--right",
    col?.type === "number" && "q-spreadsheet__cell--number",
    col?.type === "integer" && "q-spreadsheet__cell--number",
    col?.cellClass?.(v, state.value[row] ?? {}),
    isErrorCell(row, column) && "q-spreadsheet__cell--error",
    inSelection(row, column) && !isActive(row, column) && "q-spreadsheet__cell--in-range",
    isActive(row, column) && "q-spreadsheet__cell--active",
    editing.value?.row === row && editing.value?.column === column && "q-spreadsheet__cell--editing",
    props.readonly && "q-spreadsheet__cell--readonly",
  )
}

const cellStyle = (row: number, column: string) => {
  const col = colOf(column)
  const v = state.value[row]?.[column]
  const bg = col?.cellBackground?.(v, state.value[row] ?? {})
  return bg ? { backgroundColor: bg } : undefined
}

// ─── Édition ───
const editing = ref<{ row: number; column: string } | null>(null)
const draft = ref("")
const editorEl = ref<HTMLElement | null>(null)
const editInputEl = ref<HTMLInputElement | null>(null)
const editAreaEl = ref<HTMLTextAreaElement | null>(null)
const editorStyle = ref<Record<string, string>>({})

const columnOf = (name: string) => colOf(name)

/** L'éditeur bascule en textarea monospace dès que le draft est une formule (=…) */
const editingIsFormula = computed(() => {
  if (!editing.value) return false
  const col = colOf(editing.value.column)
  if (!col || col.type === "boolean" || col.type === "select") return false
  return draft.value.trim().startsWith("=")
})
const editingIsSelect = computed(() => {
  const col = editing.value ? colOf(editing.value.column) : undefined
  return col?.type === "select"
})
const draftLines = computed(() =>
  Math.min(5, Math.max(1, draft.value.split("\n").length)),
)

const editorInputType = computed(() => {
  const col = editing.value ? colOf(editing.value.column) : undefined
  switch (col?.type) {
    case "number":
    case "integer":
      return "number"
    case "email":
      return "email"
    case "url":
      return "url"
    case "date":
      return "date"
    case "datetime":
      return "datetime-local"
    default:
      return "text"
  }
})

/** step natif : "any" (décimales) pour number, "1" pour integer */
const editorStep = computed(() => {
  const col = editing.value ? colOf(editing.value.column) : undefined
  if (col?.type === "number") return "any"
  if (col?.type === "integer") return "1"
  return undefined
})

const startEdit = (row: number, column: string, initial?: string) => {
  if (props.readonly || props.disable) return
  const col = colOf(column)
  if (col?.editable === false || col?.type === "boolean") return
  const raw = state.value[row]?.[column]
  if (col?.type === "select") {
    const opt = col.options?.find((o) => o.value === raw)
    draft.value = initial ?? opt?.label ?? ""
  } else {
    draft.value = initial ?? String(raw ?? "")
  }
  editing.value = { row, column }
  emit("cell-edit-start", { row, column })
  nextTick(positionEditor)
}

const positionEditor = () => {
  if (!editing.value || !scrollEl.value) return
  const td = scrollEl.value.querySelector<HTMLElement>(
    `td[data-row="${editing.value.row}"][data-col="${escAttr(editing.value.column)}"]`,
  )
  if (!td) return
  const sc = scrollEl.value.getBoundingClientRect()
  const tr = td.getBoundingClientRect()
  const left = tr.left - sc.left + scrollEl.value.scrollLeft
  const top = tr.top - sc.top + scrollEl.value.scrollTop
  // Une formule élargit l'éditeur (monospace ≈ 7.6px/car), sans dépasser le bord droit
  const maxW = sc.width - (tr.left - sc.left) - 4
  const ideal = editingIsFormula.value
    ? Math.min(480, Math.max(220, draft.value.length * 7.6 + 30))
    : tr.width
  const width = Math.min(maxW, Math.max(tr.width, ideal))
  editorStyle.value = {
    left: left + "px",
    top: top + "px",
    width: width + "px",
    minHeight: tr.height + "px",
  }
  nextTick(() => {
    const el = editingIsFormula.value ? editAreaEl.value : editInputEl.value
    el?.focus({ preventScroll: true })
    if (!editingIsSelect.value) el?.select()
  })
}

// Quand le draft devient une formule (=…), l'éditeur input → textarea : refocus
watch(editingIsFormula, () => {
  if (!editing.value) return
  nextTick(() => {
    const el = editingIsFormula.value ? editAreaEl.value : editInputEl.value
    el?.focus({ preventScroll: true })
  })
})

const cancelEdit = () => {
  if (!editing.value) return
  const cell = { ...editing.value }
  editing.value = null
  emit("cell-edit-end", { ...cell, canceled: true })
  nextTick(() => focusCell(cell.row, cell.column))
}

const coerceValue = (col: QSpreadsheetColumn | undefined, text: string, old: any) => {
  const t = text.trim()
  if (t === "") return null
  // Formule A1 : conservée brute dans la cellule (booléen/select exclus)
  if (t.startsWith("=")) {
    if (col?.type === "boolean" || col?.type === "select") return old
    return text
  }
  if (col?.type === "number") {
    const n = Number(text)
    return Number.isNaN(n) ? old : n
  }
  if (col?.type === "integer") {
    const n = Number(text)
    return Number.isNaN(n) ? old : Math.trunc(n)
  }
  if (col?.type === "boolean") {
    return text === "true" ? true : text === "false" ? false : old
  }
  if (col?.type === "select") {
    const opt = col.options?.find((o) => o.label === text || String(o.value) === text)
    return opt ? opt.value : old
  }
  return text
}

const commitEdit = () => {
  if (!editing.value) return
  const { row, column } = editing.value
  const col = colOf(column)
  const old = state.value[row]?.[column]
  const text = draft.value
  const next = coerceValue(col, text, old)
  editing.value = null
  emit("cell-edit-end", { row, column, canceled: false })
  nextTick(() => focusCell(row, column))
  if (next !== old) validateAndSet(row, column, old, next)
}

const setCellValue = (row: number, column: string, old: any, next: any) => {
  const nextRow = { ...state.value[row], [column]: next }
  const nextRows = [...state.value]
  nextRows[row] = nextRow
  pushRows(nextRows)
  emit("cell-change", { row, column, oldValue: old, newValue: next, rows: nextRows })
}

const clearCell = (row: number, column: string) => {
  const col = colOf(column)
  if (col?.editable === false || props.readonly || props.disable) return
  const old = state.value[row]?.[column]
  if (old === null || old === undefined || old === "") return
  setCellValue(row, column, old, null)
}

const toggleBoolean = (row: number, column: string) => {
  if (props.readonly || props.disable) return
  const col = colOf(column)
  if (col?.editable === false) return
  const old = !!state.value[row]?.[column]
  setCellValue(row, column, old, !old)
}

const clearSelection = () => {
  const rect = selRect.value
  if (!rect) return
  const changed: { row: number; column: string }[] = []
  for (let r = rect.r0; r <= rect.r1; r++) {
    for (let c = rect.c0; c <= rect.c1; c++) {
      const col = cols.value[c]
      if (!col || col.editable === false || props.readonly || props.disable) continue
      const v = state.value[r]?.[col.name]
      if (v !== null && v !== undefined && v !== "") changed.push({ row: r, column: col.name })
    }
  }
  if (!changed.length) return
  pushHistory()
  for (const cell of changed)
    setCellValue(cell.row, cell.column, state.value[cell.row]?.[cell.column], null)
}

const selectRow = (row: number, extend = false) => {
  if (!cols.value.length || row < 0 || row >= state.value.length) return
  const s = sel.value
  if (extend && s) setSel({ ...s, endRow: row, endColumn: colNameAt(cols.value.length - 1) })
  else setSel({ row, column: colNameAt(0), endRow: row, endColumn: colNameAt(cols.value.length - 1) })
  nextTick(() => focusCell(row, colNameAt(0)))
}

const selectCol = (ci: number, extend = false) => {
  if (!state.value.length || !cols.value[ci]) return
  const name = colNameAt(ci)
  const last = state.value.length - 1
  const s = sel.value
  if (extend && s) setSel({ ...s, endRow: last, endColumn: name })
  else setSel({ row: 0, column: name, endRow: last, endColumn: name })
  nextTick(() => focusCell(0, name))
}

const selectAll = () => {
  if (!cols.value.length || !state.value.length) return
  setSel({
    row: 0,
    column: colNameAt(0),
    endRow: state.value.length - 1,
    endColumn: colNameAt(cols.value.length - 1),
  })
  nextTick(() => focusCell(0, colNameAt(0)))
}

const isFullSelection = computed(() => {
  if (!cols.value.length || !state.value.length) return false
  const rect = selRect.value
  if (!rect) return false
  return (
    rect.r0 === 0 &&
    rect.r1 === state.value.length - 1 &&
    rect.c0 === 0 &&
    rect.c1 === cols.value.length - 1
  )
})

// ─── Drag (sélection par glisser) ───
const isPointerDown = ref(false)
const onCellPointerDown = (row: number, column: string, e: PointerEvent) => {
  if (props.disable) return
  const mi = mergeInfoOf(row, colIndex(column))
  if (mi && !mi.owner) {
    const m = mergeOwner(row, colIndex(column))!
    row = m.r0
    column = colNameAt(m.c0)
  }
  isPointerDown.value = true
  select(row, column, e.shiftKey)
  emit("cell-click", { row, column, value: cellValue(row, column) })
}
const onCellPointerEnter = (row: number, column: string) => {
  if (props.disable || !isPointerDown.value) return
  const s = sel.value
  if (!s) return
  setSel({ ...s, endRow: row, endColumn: column })
}

// ─── Historique (undo / redo) ───
interface CellFormat {
  bold?: boolean
  italic?: boolean
  wrap?: boolean
  bg?: string
  color?: string
}
interface Snapshot {
  rows: Record<string, any>[]
  cols: QSpreadsheetColumn[]
  formats: Record<string, CellFormat>
  rowHeights: Record<number, number>
}
const undoStack: Snapshot[] = []
const redoStack: Snapshot[] = []

const takeSnapshot = (): Snapshot => ({
  rows: state.value.map((r) => ({ ...r })),
  cols: cols.value.map((c) => ({ ...c })),
  formats: { ...cellFmt.value },
  rowHeights: { ...rowHeights.value },
})
const pushHistory = () => {
  undoStack.push(takeSnapshot())
  if (undoStack.length > 100) undoStack.shift()
  redoStack.length = 0
}
const canUndo = computed(() => undoStack.length > 0 && !props.readonly && !props.disable)
const canRedo = computed(() => redoStack.length > 0 && !props.readonly && !props.disable)

const restoreSnapshot = (s: Snapshot) => {
  cols.value = s.cols.map((c) => ({ ...c }))
  state.value = s.rows.map((r) => ({ ...r }))
  cellFmt.value = { ...s.formats }
  rowHeights.value = { ...s.rowHeights }
  emit("update:columns", cols.value)
  pushRows(state.value)
}
const undo = () => {
  if (!canUndo.value) return
  redoStack.push(takeSnapshot())
  restoreSnapshot(undoStack.pop()!)
  emit("structure-change", { rows: state.value, columns: cols.value, reason: "undo" })
}
const redo = () => {
  if (!canRedo.value) return
  undoStack.push(takeSnapshot())
  restoreSnapshot(redoStack.pop()!)
  emit("structure-change", { rows: state.value, columns: cols.value, reason: "redo" })
}

// ─── Lignes & colonnes ───
const blankRow = (): Record<string, any> => {
  const row: Record<string, any> = {}
  for (const col of cols.value) row[col.name] = col.type === "boolean" ? false : ""
  return row
}

const addRow = (at?: number) => {
  if (props.readonly || props.disable) return
  pushHistory()
  const idx = at ?? state.value.length
  const next = [...state.value]
  next.splice(idx, 0, blankRow())
  state.value = next
  emit("update:rows", next)
  emit("structure-change", { rows: next, columns: cols.value, reason: "add-row" })
  if (cols.value.length) select(idx, colNameAt(0))
}

const removeSelectedRows = () => {
  if (props.readonly || props.disable) return
  purgeMergesAndRules()
  const rect = selRect.value
  if (!rect || !state.value.length) return
  pushHistory()
  const indexes = new Set<number>()
  for (let r = rect.r0; r <= rect.r1; r++) indexes.add(r)
  const sorted = [...indexes].sort((a, b) => b - a)
  const next = [...state.value]
  for (const i of sorted) next.splice(i, 1)
  state.value = next
  dropRowRangeKeys(rect.r0, rect.r1, indexes.size)
  emit("update:rows", next)
  emit("structure-change", { rows: next, columns: cols.value, reason: "remove-row" })
  if (next.length) {
    const target = Math.min(sorted[sorted.length - 1]!, next.length - 1)
    select(target, colNameAt(0))
  } else setSel(null)
}

const addColumn = (at?: number) => {
  if (props.readonly || props.disable) return
  pushHistory()
  let n = cols.value.length + 1
  const used = new Set(cols.value.map((c) => c.name))
  let name = "column" + n
  while (used.has(name)) name = "column" + ++n
  const col: QSpreadsheetColumn = { name, label: "Column " + n, type: "text" }
  const idx = at ?? cols.value.length
  const nextCols = [...cols.value]
  nextCols.splice(idx, 0, col)
  cols.value = nextCols
  const nextRows = state.value.map((r) => ({ ...r, [name]: "" }))
  state.value = nextRows
  emit("update:columns", nextCols)
  emit("update:rows", nextRows)
  emit("structure-change", { rows: nextRows, columns: nextCols, reason: "add-column" })
  if (state.value.length) select(0, name)
}

const removeSelectedColumns = () => {
  if (props.readonly || props.disable) return
  purgeMergesAndRules()
  const rect = selRect.value
  if (!rect || !cols.value.length) return
  pushHistory()
  const indexes = new Set<number>()
  for (let c = rect.c0; c <= rect.c1; c++) indexes.add(c)
  const removed = [...indexes].sort((a, b) => b - a)
  const removedNames = removed.map((i) => cols.value[i]!.name)
  const nextCols = cols.value.filter((_, i) => !indexes.has(i))
  cols.value = nextCols
  dropColumnKeys(removedNames)
  const nextRows = state.value.map((r) => {
    const nr = { ...r }
    for (const nm of removedNames) delete nr[nm]
    return nr
  })
  state.value = nextRows
  emit("update:columns", nextCols)
  emit("update:rows", nextRows)
  emit("structure-change", { rows: nextRows, columns: nextCols, reason: "remove-column" })
  const target = Math.min(removed[removed.length - 1]!, Math.max(0, nextCols.length - 1))
  if (nextCols.length && state.value.length) select(0, colNameAt(target))
  else setSel(null)
}

// ─── Tri ───
const sortByColumn = (column?: string, desc = false) => {
  if (props.readonly || props.disable) return
  const name = column ?? sel.value?.column ?? colNameAt(0)
  const col = colOf(name)
  if (!col || !state.value.length) return
  pushHistory()
  const ci = colIndex(name)
  const getVal = (i: number) => {
    const raw = state.value[i]?.[name]
    const ev = ci === -1 ? undefined : evalAt(i, name)
    if (ev === null || ev === undefined || isError(ev)) {
      return raw === null || raw === undefined ? "" : String(raw).toLowerCase()
    }
    if (col?.type === "number" || col?.type === "integer") return Number(ev) || 0
    if (col?.type === "boolean") return ev ? 1 : 0
    if (col?.type === "select") {
      const opt = col.options?.find((o) => o.value === raw)
      return (opt?.label ?? String(ev)).toLowerCase()
    }
    return String(ev).toLowerCase()
  }
  const sortedIdx = state.value
    .map((_, i) => i)
    .sort((a, b) => {
      const va = getVal(a)
      const vb = getVal(b)
      if (va < vb) return desc ? 1 : -1
      if (va > vb) return desc ? -1 : 1
      return 0
    })
  const sorted = sortedIdx.map((i) => state.value[i]!)
  state.value = sorted
  emit("update:rows", sorted)
  emit("structure-change", { rows: sorted, columns: cols.value, reason: "sort" })
}

// ─── Copier / coller (TSV) ───
const internalClip = ref<string[][]>([])

const copySelection = async () => {
  const rect = selRect.value
  if (!rect) return
  const lines: string[][] = []
  for (let r = rect.r0; r <= rect.r1; r++) {
    const line: string[] = []
    for (let c = rect.c0; c <= rect.c1; c++) {
      const name = colNameAt(c)
      const col = colOf(name)
      const raw = state.value[r]?.[name]
      let text: string
      if (col?.type === "select") {
        const opt = col.options?.find((o) => o.value === raw)
        text = opt
          ? opt.label
          : raw === null || raw === undefined || raw === ""
            ? ""
            : String(raw)
      } else {
        // Formules : copie la valeur AFFICHÉE (évaluée), comme Excel
        text = cellText(r, name)
      }
      line.push(text)
    }
    lines.push(line)
  }
  internalClip.value = lines
  try {
    await navigator.clipboard.writeText(lines.map((l) => l.join("\t")).join("\n"))
  } catch {
    /* presse-papiers indisponible */
  }
}

const pasteClip = async () => {
  if (props.readonly || props.disable) return
  let lines = internalClip.value
  if (!lines.length) {
    try {
      const text = await navigator.clipboard.readText()
      lines = text.split(/\r?\n/).map((l) => l.split("\t"))
    } catch {
      return
    }
  }
  const s = sel.value
  if (!lines.length || !s) return
  pushHistory()
  const startRow = s.row
  const startCol = Math.max(0, colIndex(s.column))
  lines.forEach((line, i) => {
    line.forEach((text, j) => {
      const r = startRow + i
      const c = startCol + j
      if (r >= state.value.length || c >= cols.value.length) return
      const col = cols.value[c]!
      if (col.editable === false) return
      const old = state.value[r]?.[col.name]
      const next = coerceValue(col, text, old)
      if (next !== old) setCellValue(r, col.name, old, next)
    })
  })
  internalClip.value = lines
}

// ─── Aides navigation Excel (bords, page) ───
const viewH = ref(0)
const updateViewportMetrics = () => {
  viewH.value = scrollEl.value?.clientHeight ?? 0
}

const nextVisibleIndex = (from: number, dir: 1 | -1): number => {
  const i = from + dir
  return i >= 0 && i < visibleRows.value.length ? i : -1
}
const jumpPage = (dir: 1 | -1, extend = false) => {
  if (!sel.value || !visibleRows.value.length) return
  let idx = visibleRows.value.indexOf(sel.value.row)
  if (idx < 0) idx = 0
  const page = Math.max(1, Math.floor(viewH.value / props.rowHeight))
  let target = idx
  for (let k = 0; k < page; k++) {
    const n = nextVisibleIndex(target, dir)
    if (n < 0) break
    target = n
  }
  select(visibleRows.value[target]!, sel.value.column, extend)
}
const jumpEdge = (dr: number, dc: number, extend = false) => {
  if (!sel.value) return
  const { row, column } = sel.value
  const ci = colIndex(column)
  const colHas = (r: number, c: number) => {
    const v = state.value[r]?.[colNameAt(c)]
    return !isBlankValue(v)
  }
  if (dr === 0) {
    let c = ci
    const startHas = colHas(row, c)
    while (true) {
      const nc = c + dc
      if (nc < 0 || nc >= cols.value.length) break
      const nv = colHas(row, nc)
      if (nv === startHas) c = nc
      else if (!startHas) {
        c = nc
        break
      } else break
    }
    select(row, colNameAt(c), extend)
  } else {
    let r = row
    const startHas = colHas(r, ci)
    while (true) {
      const nr = r + dr
      if (nr < 0 || nr >= state.value.length || !isRowVisible(nr)) break
      const nv = colHas(nr, ci)
      if (nv === startHas) r = nr
      else if (!startHas) {
        r = nr
        break
      } else break
    }
    select(r, column, extend)
  }
}
const jumpStart = (end = false) => {
  if (!sel.value) return
  const name = end ? colNameAt(cols.value.length - 1) : colNameAt(0)
  select(sel.value.row, name)
}
const jumpCorner = (end = false) => {
  if (!cols.value.length || !state.value.length) return
  if (!end) {
    select(0, colNameAt(0))
    return
  }
  let last = state.value.length - 1
  while (last > 0 && !Object.values(state.value[last] ?? {}).some((v) => !isBlankValue(v))) last--
  select(last, colNameAt(cols.value.length - 1))
}

// ─── Ctrl+D / Ctrl+R : recopie vers le bas / la droite ───
const fillDownKey = () => {
  const rect = selRect.value
  if (!rect || rect.r0 <= 0) return
  if (props.readonly || props.disable) return
  pushHistory()
  for (let c = rect.c0; c <= rect.c1; c++) {
    const name = colNameAt(c)
    const col = colOf(name)
    if (!col || col.editable === false) continue
    const src = rect.r0 - 1
    const sv = state.value[src]?.[name]
    for (let r = rect.r0; r <= rect.r1; r++) {
      const old = state.value[r]?.[name]
      if (old !== sv) setCellValue(r, name, old, sv)
    }
  }
  focusCell(sel.value!.row, sel.value!.column)
}
const fillRightKey = () => {
  const rect = selRect.value
  if (!rect || rect.c0 <= 0) return
  if (props.readonly || props.disable) return
  pushHistory()
  for (let r = rect.r0; r <= rect.r1; r++) {
    const src = rect.c0 - 1
    const sname = colNameAt(src)
    const col = colOf(sname)
    if (!col || col.editable === false) continue
    const sv = state.value[r]?.[sname]
    for (let c = rect.c0; c <= rect.c1; c++) {
      const name = colNameAt(c)
      const old = state.value[r]?.[name]
      if (old !== sv) setCellValue(r, name, old, sv)
    }
  }
  focusCell(sel.value!.row, sel.value!.column)
}

// ─── Clavier global (navigation / édition) ───
const onKeydown = (e: KeyboardEvent) => {
  if (editing.value) return
  if (!sel.value || !cols.value.length) return
  const mod = e.ctrlKey || e.metaKey
  const shift = e.shiftKey
  const target = e.target as HTMLElement
  if (
    target &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")
  )
    return
  if (mod && e.key.toLowerCase() === "z") {
    e.preventDefault()
    if (shift) redo()
    else undo()
    return
  }
  if (mod && e.key.toLowerCase() === "y") {
    e.preventDefault()
    redo()
    return
  }
  if (mod && e.key.toLowerCase() === "c") {
    e.preventDefault()
    copySelection()
    return
  }
  if (mod && e.key.toLowerCase() === "v") {
    e.preventDefault()
    pasteClip()
    return
  }
  if (mod && e.key.toLowerCase() === "a") {
    e.preventDefault()
    selectAll()
    return
  }
  if (mod && e.key.toLowerCase() === "d") {
    e.preventDefault()
    fillDownKey()
    return
  }
  if (mod && e.key.toLowerCase() === "r") {
    e.preventDefault()
    fillRightKey()
    return
  }
  if (mod && e.key.toLowerCase() === "f") {
    e.preventDefault()
    openFind()
    return
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault()
    clearSelection()
    return
  }
  const nav: Record<string, [number, number]> = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
  }
  const dir = nav[e.key]
  if (dir) {
    e.preventDefault()
    if (mod) jumpEdge(dir[0], dir[1], shift)
    else moveSelection(dir[0], dir[1], shift)
    return
  }
  if (e.key === "Tab") {
    e.preventDefault()
    moveSelection(0, shift ? -1 : 1)
    return
  }
  if (e.key === "Home") {
    e.preventDefault()
    if (mod) jumpCorner(false)
    else jumpStart(false)
    return
  }
  if (e.key === "End") {
    e.preventDefault()
    if (mod) jumpCorner(true)
    else jumpStart(true)
    return
  }
  if (e.key === "PageUp") {
    e.preventDefault()
    jumpPage(-1, shift)
    return
  }
  if (e.key === "PageDown") {
    e.preventDefault()
    jumpPage(1, shift)
    return
  }
  if (e.key === "Enter" || e.key === "F2") {
    e.preventDefault()
    const col = colOf(sel.value.column)
    if (col?.type === "boolean") toggleBoolean(sel.value.row, sel.value.column)
    else startEdit(sel.value.row, sel.value.column)
    return
  }
  // Frappe directe : remplace le contenu (comportement Excel)
  if (e.key.length === 1 && !mod && !e.altKey) {
    const col = colOf(sel.value.column)
    if (col && col.editable !== false && col.type !== "boolean") {
      e.preventDefault()
      startEdit(sel.value.row, sel.value.column, e.key)
    }
  }
}

// ─── Clavier de l'éditeur ───
const onEditKeydown = (e: KeyboardEvent) => {
  // Dans une formule, Shift+Enter insère un retour ligne (textarea multi-lignes)
  if (editingIsFormula.value && e.key === "Enter" && e.shiftKey) return
  // Autocomplétion de fonction ouverte : Tab / flèches / Échap la pilotent
  if (fxOpen.value) {
    if (e.key === "Tab") {
      e.preventDefault()
      e.stopPropagation()
      acceptFx()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      e.stopPropagation()
      stepFx(1)
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      e.stopPropagation()
      stepFx(-1)
      return
    }
    if (e.key === "Escape") {
      e.preventDefault()
      e.stopPropagation()
      fxHide.value = true
      return
    }
  }
  if (e.key === "Enter") {
    e.preventDefault()
    e.stopPropagation()
    if (editingIsSelect.value && selectOptions.value.length && activeOption.value) {
      pickOption(activeOption.value)
    } else {
      commitEdit()
      moveSelection(1, 0)
    }
    return
  }
  if (e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()
    cancelEdit()
    return
  }
  if (e.key === "Tab") {
    e.preventDefault()
    e.stopPropagation()
    commitEdit()
    moveSelection(0, e.shiftKey ? -1 : 1)
    return
  }
  if (editingIsSelect.value && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
    e.preventDefault()
    e.stopPropagation()
    const opts = selectOptions.value
    if (!opts.length) return
    const cur = activeOption.value ? opts.indexOf(activeOption.value) : -1
    const delta = e.key === "ArrowDown" ? 1 : -1
    const next = (cur + delta + opts.length) % opts.length
    activeOption.value = opts[next]!
  }
}

// ─── Éditeur "select" (liste d'options) ───
const activeOption = ref<QSpreadsheetCellOption | null>(null)
const selectOptions = computed<QSpreadsheetCellOption[]>(() => {
  if (!editing.value) return []
  const col = colOf(editing.value.column)
  if (col?.type !== "select") return []
  const q = draft.value.trim().toLowerCase()
  return (col.options ?? []).filter(
    (o) => !q || (o.label ?? String(o.value)).toLowerCase().includes(q),
  )
})
watch(selectOptions, () => {
  if (editing.value && colOf(editing.value.column)?.type === "select") {
    activeOption.value = selectOptions.value[0] ?? null
  }
})
const pickOption = (opt: QSpreadsheetCellOption) => {
  draft.value = opt.label
  commitEdit()
}

// ─── Barre de formule (fx) ───
const fxDraft = ref("")
const fxInputEl = ref<HTMLInputElement | null>(null)

const syncFx = () => {
  const s = sel.value
  const raw =
    s && s.row >= 0 && s.row < state.value.length
      ? state.value[s.row]?.[s.column]
      : undefined
  fxDraft.value = raw === null || raw === undefined ? "" : String(raw)
}
watch([sel, state], syncFx)

const fxCanEdit = computed(() => {
  if (props.readonly || props.disable || !sel.value) return false
  const col = colOf(sel.value.column)
  return !!col && col.editable !== false && col.type !== "boolean" && col.type !== "select"
})

const commitFx = () => {
  if (!sel.value) return
  if (!fxCanEdit.value) {
    syncFx()
    return
  }
  const s = sel.value
  const col = colOf(s.column)!
  const old = state.value[s.row]?.[s.column]
  const next = coerceValue(col, fxDraft.value, old)
  if (next !== old) validateAndSet(s.row, s.column, old, next)
  nextTick(() => focusCell(s.row, s.column))
}

const onFxInput = (e: Event) => {
  fxDraft.value = (e.target as HTMLInputElement).value
}

const onFxKeydown = (e: KeyboardEvent) => {
  if (fxOpen.value) {
    if (e.key === "Tab") {
      e.preventDefault()
      acceptFx()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      stepFx(1)
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      stepFx(-1)
      return
    }
    if (e.key === "Escape") {
      e.preventDefault()
      fxHide.value = true
      return
    }
  }
  if (e.key === "Enter") {
    e.preventDefault()
    commitFx()
    moveSelection(1, 0)
    return
  }
  if (e.key === "Escape") {
    e.preventDefault()
    syncFx()
  }
  if (e.key === "Tab") {
    e.preventDefault()
    commitFx()
    moveSelection(0, e.shiftKey ? -1 : 1)
  }
}

// ─── Autocomplétion des fonctions (barre fx + éditeur formule) ───
const FORMULA_FNS: { name: string; sig: string }[] = [
  { name: "SUM", sig: "a, b, …" },
  { name: "AVERAGE", sig: "a, b, …" },
  { name: "MIN", sig: "a, b, …" },
  { name: "MAX", sig: "a, b, …" },
  { name: "COUNT", sig: "a, b, …" },
  { name: "COUNTA", sig: "a, b, …" },
  { name: "IF", sig: "cond, yes, no" },
  { name: "IFS", sig: "cond1, v1, cond2, v2…" },
  { name: "IFERROR", sig: "value, fallback" },
  { name: "IFNA", sig: "value, fallback" },
  { name: "SWITCH", sig: "expr, v1, r1…, [default]" },
  { name: "AND", sig: "a, b…" },
  { name: "OR", sig: "a, b…" },
  { name: "NOT", sig: "v" },
  { name: "VLOOKUP", sig: "key, range, col, [approx]" },
  { name: "ABS", sig: "n" },
  { name: "ROUND", sig: "n, [digits]" },
  { name: "ROUNDUP", sig: "n, [digits]" },
  { name: "ROUNDDOWN", sig: "n, [digits]" },
  { name: "FLOOR", sig: "n" },
  { name: "CEILING", sig: "n" },
  { name: "INT", sig: "n" },
  { name: "MOD", sig: "a, b" },
  { name: "SQRT", sig: "n" },
  { name: "POWER", sig: "n, exp" },
  { name: "PI", sig: "" },
  { name: "RAND", sig: "" },
  { name: "CONCAT", sig: "a, b…" },
  { name: "CONCATENATE", sig: "a, b…" },
  { name: "UPPER", sig: "text" },
  { name: "LOWER", sig: "text" },
  { name: "TRIM", sig: "text" },
  { name: "LEN", sig: "text" },
  { name: "LEFT", sig: "text, [n]" },
  { name: "RIGHT", sig: "text, [n]" },
  { name: "MID", sig: "text, start, n" },
  { name: "FIND", sig: "find, text, [start]" },
  { name: "SUBSTITUTE", sig: "text, old, new, [n]" },
  { name: "REPLACE", sig: "text, start, n, new" },
  { name: "VALUE", sig: "text" },
  { name: "N", sig: "v" },
  { name: "ISBLANK", sig: "v" },
  { name: "ISNUMBER", sig: "v" },
  { name: "ISTEXT", sig: "v" },
  { name: "TODAY", sig: "" },
  { name: "NOW", sig: "" },
  { name: "DATE", sig: "y, m, d" },
  { name: "YEAR", sig: "date" },
  { name: "MONTH", sig: "date" },
  { name: "DAY", sig: "date" },
  { name: "EDATE", sig: "date, months" },
]
const fxSource = computed(() => (editing.value ? draft.value : fxDraft.value))
const fxQuery = computed(() => {
  const s = fxSource.value
  if (!s.trim().startsWith("=")) return ""
  const m = s.match(/[A-Za-z]{1,}$/)
  return m ? m[0].toLowerCase() : ""
})
const fxSuggestions = computed(() => {
  const q = fxQuery.value
  if (!q) return []
  return FORMULA_FNS.filter((f) => f.name.toLowerCase().startsWith(q)).slice(0, 12)
})
const fxHide = ref(false)
const fxActive = ref(0)
const fxOpen = computed(() => !fxHide.value && fxSuggestions.value.length > 0)
watch(fxQuery, () => {
  fxActive.value = 0
  fxHide.value = false
})
const fxPopStyle = ref<Record<string, string>>({})
const refreshFxPop = () => {
  if (!fxOpen.value || !fxInputEl.value) return
  const r = fxInputEl.value.getBoundingClientRect()
  fxPopStyle.value = {
    position: "fixed",
    left: r.left + "px",
    top: r.bottom + 4 + "px",
    width: Math.max(240, r.width) + "px",
  }
}
watch(fxOpen, (v) => {
  if (v) nextTick(refreshFxPop)
})
const stepFx = (d: number) => {
  const n = fxSuggestions.value.length
  fxActive.value = (fxActive.value + d + n) % n
}
const acceptFx = () => {
  const f = fxSuggestions.value[fxActive.value]
  if (!f) return
  const replaceTail = (s: string) => s.replace(/[A-Za-z]+$/, f.name + "(")
  if (editing.value) draft.value = replaceTail(draft.value)
  else fxDraft.value = replaceTail(fxDraft.value)
  fxActive.value = 0
  nextTick(() => {
    const el = editing.value
      ? editingIsFormula.value
        ? editAreaEl.value
        : editInputEl.value
      : fxInputEl.value
    el?.focus({ preventScroll: true })
  })
}
const acceptFxAt = (i: number) => {
  fxActive.value = i
  acceptFx()
}

// ════════ Hauteurs de lignes (resize au drag sur le numéro) ════════
const rowHeights = ref<Record<number, number>>({})
const rowH = (r: number) => rowHeights.value[r] ?? props.rowHeight

const rowResizing = ref<{ r: number; y: number; h: number } | null>(null)
const startRowResize = (e: PointerEvent, r: number) => {
  if (props.disable) return
  e.preventDefault()
  e.stopPropagation()
  rowResizing.value = { r, y: e.clientY, h: rowH(r) }
  window.addEventListener("pointermove", onRowResizeMove)
  window.addEventListener("pointerup", endRowResize)
}
const onRowResizeMove = (e: PointerEvent) => {
  if (!rowResizing.value) return
  const h = Math.max(24, Math.min(200, rowResizing.value.h + (e.clientY - rowResizing.value.y)))
  rowHeights.value = { ...rowHeights.value, [rowResizing.value.r]: h }
}
const endRowResize = () => {
  rowResizing.value = null
  window.removeEventListener("pointermove", onRowResizeMove)
  window.removeEventListener("pointerup", endRowResize)
}

// ─── Re-index des clés indexées par ligne (formats / hauteurs) ───
const shiftRowKeys = (at: number, delta: number) => {
  if (delta === 0) return
  const nf: Record<string, CellFormat> = {}
  for (const [k, v] of Object.entries(cellFmt.value)) {
    const i = k.indexOf(":")
    const r = Number(k.slice(0, i))
    nf[r >= at ? r + delta + k.slice(i) : k] = v
  }
  cellFmt.value = nf
  const nh: Record<number, number> = {}
  for (const [rk, rv] of Object.entries(rowHeights.value)) {
    const rr = Number(rk)
    nh[rr >= at ? rr + delta : rr] = rv
  }
  rowHeights.value = nh
}
const dropRowRangeKeys = (r0: number, r1: number, count: number) => {
  const nf: Record<string, CellFormat> = {}
  for (const [k, v] of Object.entries(cellFmt.value)) {
    const i = k.indexOf(":")
    const r = Number(k.slice(0, i))
    if (r >= r0 && r <= r1) continue
    nf[r > r1 ? r - count + k.slice(i) : k] = v
  }
  cellFmt.value = nf
  const nh: Record<number, number> = {}
  for (const [rk, rv] of Object.entries(rowHeights.value)) {
    const rr = Number(rk)
    if (rr >= r0 && rr <= r1) continue
    nh[rr > r1 ? rr - count : rr] = rv
  }
  rowHeights.value = nh
}
const dropColumnKeys = (names: string[]) => {
  const nf: Record<string, CellFormat> = {}
  for (const [k, v] of Object.entries(cellFmt.value)) {
    const i = k.indexOf(":")
    const nm = k.slice(i + 1)
    if (!names.includes(nm)) nf[k] = v
  }
  cellFmt.value = nf
  for (const nm of names) {
    delete colWidths.value[nm]
    delete filters.value[nm]
  }
}

// ════════ Formatage des cellules (interne, non sérialisé) ════════
const cellFmt = ref<Record<string, CellFormat>>({})
const fmtKey = (r: number, name: string) => r + ":" + name
const cellFmtOf = (r: number, name: string): CellFormat | undefined => cellFmt.value[fmtKey(r, name)]

const FORMAT_COLORS: string[] = [
  "", "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#fee2e2", "#fecaca", "#ffedd5",
  "#fef9c3", "#fef08a", "#dcfce7", "#bbf7d0", "#dbeafe", "#bfdbfe", "#ede9fe",
  "#e9d5ff", "#fce7f3", "#cffafe", "#f97316", "#ef4444", "#22c55e", "#3b82f6",
  "#8b5cf6", "#ec4899",
]
const TEXT_COLORS: string[] = [
  "", "#0f172a", "#1e293b", "#475569", "#64748b", "#94a3b8", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff",
]
const swatchInline = (c: string) =>
  c ? { backgroundColor: c } : { backgroundColor: "transparent", boxShadow: "inset 0 0 0 1px var(--q-spreadsheet-border)" }

const anchorCell = computed(() => {
  if (!sel.value) return null
  return { r: sel.value.row, name: sel.value.column }
})
const anchorFmt = computed(() =>
  anchorCell.value ? cellFmtOf(anchorCell.value.r, anchorCell.value.name) : undefined,
)
const isBoldSel = computed(() => !!anchorFmt.value?.bold)
const isItalicSel = computed(() => !!anchorFmt.value?.italic)
const currentBg = computed(() => anchorFmt.value?.bg ?? "")
const currentColor = computed(() => anchorFmt.value?.color ?? "")

const patchFormatSelection = (patch: Record<string, string | boolean | undefined>) => {
  const rect = selRect.value
  if (!rect || props.readonly || props.disable) return
  pushHistory()
  const nf = { ...cellFmt.value }
  for (let r = rect.r0; r <= rect.r1; r++) {
    for (let c = rect.c0; c <= rect.c1; c++) {
      const col = cols.value[c]
      if (!col) continue
      const k = fmtKey(r, col.name)
      const cur: Record<string, string | boolean | undefined> = { ...(nf[k] ?? {}) }
      for (const [key, val] of Object.entries(patch)) {
        if (val === undefined || val === "") delete cur[key]
        else cur[key] = val
      }
      if (Object.keys(cur).length) nf[k] = cur as CellFormat
      else delete nf[k]
    }
  }
  cellFmt.value = nf
}
const toggleBoldSelection = () => {
  patchFormatSelection({ bold: !isBoldSel.value })
}
const toggleItalicSelection = () => {
  patchFormatSelection({ italic: !isItalicSel.value })
}
const setBgColorSelection = (c: string) => {
  patchFormatSelection({ bg: c || undefined })
}
const setTextColorSelection = (c: string) => {
  patchFormatSelection({ color: c || undefined })
}
const clearFormatSelection = () => {
  const rect = selRect.value
  if (!rect || props.readonly || props.disable) return
  pushHistory()
  const nf = { ...cellFmt.value }
  for (let r = rect.r0; r <= rect.r1; r++) {
    for (let c = rect.c0; c <= rect.c1; c++) {
      const col = cols.value[c]
      if (!col) continue
      delete nf[fmtKey(r, col.name)]
    }
  }
  cellFmt.value = nf
}

// ════════ Freeze panes (gel lignes / colonnes) ════════
const frozenRowsN = computed(() => Math.max(0, Math.min(props.frozenRows ?? 0, state.value.length)))
const frozenColsN = computed(() => Math.max(0, Math.min(props.frozenCols ?? 0, cols.value.length)))
const gutterW = computed(() => (props.showRowNumbers ? 34 : 0))
const headH = computed(() => (props.showColumnHeaders ? 28 : 0))
const colWNum = (ci: number) => {
  const c = cols.value[ci]
  if (!c) return props.defaultColWidth
  const w = colWidths.value[c.name] ?? c.width ?? props.defaultColWidth
  return typeof w === "number" ? w : parseFloat(w) || props.defaultColWidth
}
const frozenLeftOf = (ci: number) => {
  let l = gutterW.value
  for (let j = 0; j < ci; j++) l += colWNum(j)
  return l
}
const frozenTopOf = (ri: number) => {
  let t = headH.value
  for (let i = 0; i < ri; i++) t += rowH(i)
  return t
}
const isFrozenRow = (ri: number) => ri < frozenRowsN.value
const isFrozenCol = (ci: number) => ci < frozenColsN.value

const cellInlineStyle = (ri: number, ci: number, name: string) => {
  const st: Record<string, string> = {}
  const fmt = cellFmtOf(ri, name)
  const col = colOf(name)
  const colBg = col?.cellBackground?.(state.value[ri]?.[name], state.value[ri] ?? {})
  const selected = inSelection(ri, name)
  let bg: string | undefined
  if (fmt?.bg) bg = fmt.bg
  else if (selected) bg = "var(--q-spreadsheet-range)"
  else if (colBg) bg = colBg
  else if (isFrozenRow(ri) || isFrozenCol(ci)) bg = "var(--q-spreadsheet-bg)"
  if (bg) st.backgroundColor = bg
  if (fmt?.color) st.color = fmt.color
  if (fmt?.bold) st.fontWeight = "700"
  if (fmt?.italic) st.fontStyle = "italic"
  if (isFrozenCol(ci)) st.left = frozenLeftOf(ci) + "px"
  if (isFrozenRow(ri)) st.top = frozenTopOf(ri) + "px"
  return Object.keys(st).length ? st : undefined
}
const cellFreezeClass = (ri: number, ci: number) =>
  cn(
    isFrozenRow(ri) && isFrozenCol(ci) && "q-spreadsheet__cell--frozen-both",
    isFrozenRow(ri) && !isFrozenCol(ci) && "q-spreadsheet__cell--frozen-row",
    !isFrozenRow(ri) && isFrozenCol(ci) && "q-spreadsheet__cell--frozen-col",
  )
const colheadInline = (ci: number) => (isFrozenCol(ci) ? { left: frozenLeftOf(ci) + "px" } : undefined)
const rownumInline = (ri: number) => (isFrozenRow(ri) ? { top: frozenTopOf(ri) + "px" } : undefined)

// ════════ Filtres par colonne ════════
const FILTER_BLANK = "__q_spreadsheet_blank__"
const filters = ref<Record<string, string[] | null>>({})
const activeFilterOf = (name: string) => filters.value[name] ?? null
const hasFilterFor = (name: string) => {
  const v = filters.value[name]
  return !!v && v.length > 0
}
const hasActiveFilters = computed(() =>
  Object.values(filters.value).some((v) => v !== null && v.length > 0),
)
const rowFilteredOut = (r: number) => {
  for (const [name, allowed] of Object.entries(filters.value)) {
    if (!allowed || !allowed.length) continue
    const raw = state.value[r]?.[name]
    const key = isBlankValue(raw) ? FILTER_BLANK : String(raw)
    if (!allowed.includes(key)) return true
  }
  return false
}
// Lignes / colonnes masquées (Hide) + règles conditionnelles + fusions
const hiddenRows = ref<number[]>([])
const hiddenCols = ref<string[]>([])
const hiddenRowSet = computed(() => new Set(hiddenRows.value))
const isRowHidden = (r: number) => hiddenRowSet.value.has(r)
const isColHiddenName = (name: string) => hiddenCols.value.includes(name)
const visibleColsCount = computed(
  () => cols.value.length - hiddenCols.value.filter((n) => colOf(n)).length,
)
interface MergeRange {
  r0: number
  c0: number
  r1: number
  c1: number
}
const merges = ref<MergeRange[]>([])
interface CondRule {
  id: string
  r0: number
  c0: number
  r1: number
  c1: number
  kind: "gt" | "lt" | "eq" | "gte" | "lte" | "contains" | "blank" | "notblank" | "formula"
  value?: string | number
  /** Si défini : la règle s'applique à TOUTE la colonne (r0..r1 ignorés) */
  colName?: string
  /** Condition par formule A1 (kind: "formula") — ex. "=A1>10" */
  formula?: string
  bg?: string
  color?: string
  bold?: boolean
}
const condRules = ref<CondRule[]>([])
const evalRuleFormula = (expr: string, r: number): boolean => {
  try {
    const v = evaluateFormula(expr, {
      row: r,
      resolveField: () => undefined,
      resolveCell: (rr, cc) => {
        const ev = evaluated.value[rr]?.[cc]
        if (ev === undefined || ev === null) return null
        return ev as FormulaValue
      },
    })
    if (isError(v)) return false
    if (typeof v === "boolean") return v
    if (typeof v === "number") return v !== 0
    return String(v).trim().toUpperCase() === "TRUE"
  } catch {
    return false
  }
}
const condRuleOf = (r: number, c: number, name?: string): CondRule | undefined =>
  condRules.value.find((rule) => {
    if (rule.colName !== undefined) {
      if (name === undefined || rule.colName !== name) return false
      return true
    }
    return r >= rule.r0 && r <= rule.r1 && c >= rule.c0 && c <= rule.c1
  })

const visibleRows = computed<number[]>(() => {
  const out: number[] = []
  for (let r = 0; r < state.value.length; r++) {
    if (isRowHidden(r)) continue
    if (hasActiveFilters.value && rowFilteredOut(r)) continue
    out.push(r)
  }
  return out
})
const visibleSet = computed(() => new Set(visibleRows.value))
const isRowVisible = (r: number) => !hasActiveFilters.value || visibleSet.value.has(r)

// ════════ Virtualisation des lignes (grandes grilles) ════════
const VIRTUAL_MIN = 150
const VIRTUAL_OVERSCAN = 12
const virtualOn = computed(
  () =>
    (props.virtualScroll ?? true) &&
    visibleRows.value.length > VIRTUAL_MIN &&
    frozenRowsN.value === 0 &&
    merges.value.length === 0,
)
interface VisRow {
  top: number
  h: number
  bottom: number
}
const visInfo = computed<{ rows: VisRow[]; total: number }>(() => {
  const vr = visibleRows.value
  let top = headH.value
  const rows: VisRow[] = vr.map((ri) => {
    const h = rowH(ri)
    const info = { top, h, bottom: top + h }
    top += h
    return info
  })
  return { rows, total: top }
})
const renderRange = ref<{ start: number; end: number }>({ start: 0, end: -1 })
const topPad = ref(0)
const bottomPad = ref(0)
const pendingFocus = ref<{ row: number; col: string } | null>(null)
const flushPendingFocus = () => {
  if (!pendingFocus.value) return
  const pf = pendingFocus.value
  const idx = visibleRows.value.indexOf(pf.row)
  const { start, end } = renderRange.value
  if (idx < 0 || idx < start || idx > end) return
  pendingFocus.value = null
  focusCell(pf.row, pf.col)
}
const renderRows = computed<number[]>(() => {
  if (!virtualOn.value) return visibleRows.value
  const { start, end } = renderRange.value
  return end >= start ? visibleRows.value.slice(start, end + 1) : []
})
const updateRange = () => {
  const info = visInfo.value
  const n = info.rows.length
  const el = scrollEl.value
  if (!virtualOn.value || !n || !el) {
    renderRange.value = { start: 0, end: n - 1 }
    topPad.value = 0
    bottomPad.value = 0
    return
  }
  const top = Math.max(0, el.scrollTop)
  const bottom = top + Math.max(el.clientHeight || 60, 60)
  let lo = 0
  let hi = n - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (info.rows[mid]!.bottom > top) hi = mid
    else lo = mid + 1
  }
  const start = Math.max(0, lo - VIRTUAL_OVERSCAN)
  let end = start
  while (end < n && info.rows[end]!.top < bottom + VIRTUAL_OVERSCAN * props.rowHeight) end++
  end = Math.min(n - 1, end + VIRTUAL_OVERSCAN)
  renderRange.value = { start, end }
  topPad.value = Math.max(0, info.rows[start]!.top - headH.value)
  bottomPad.value = Math.max(0, info.total - info.rows[end]!.bottom)
  // La ligne cible est maintenant rendue : on peut la focuser
  if (pendingFocus.value) nextTick(flushPendingFocus)
}
watch([visibleRows, rowHeights], () => {
  if (virtualOn.value) nextTick(updateRange)
  else updateRange()
})
const ensureRowVisible = (realRow: number) => {
  if (!virtualOn.value) return
  const idx = visibleRows.value.indexOf(realRow)
  const el = scrollEl.value
  if (idx < 0 || !el) return
  const { start, end } = renderRange.value
  if (idx >= start && idx <= end) return
  const info = visInfo.value.rows[idx]
  if (!info) return
  // scroll-behavior: smooth (CSS) anime la remontée / descente ; le focus est
  // différé jusqu'à ce que la ligne soit effectivement rendue par la fenêtre
  pendingFocus.value = { row: realRow, col: cols.value[sel.value?.column ? colIndex(sel.value.column) : 0]?.name ?? "" }
  el.scrollTop = Math.max(0, info.top - headH.value - VIRTUAL_OVERSCAN * props.rowHeight)
  updateRange()
}

interface FilterValueItem {
  key: string
  blank: boolean
  label: string
  count: number
  active: boolean
}
const filterValueItems = (name: string): FilterValueItem[] => {
  const col = colOf(name)
  const map = new Map<string, { blank: boolean; raw: any; count: number }>()
  for (const row of state.value) {
    const raw = row?.[name]
    const key = isBlankValue(raw) ? FILTER_BLANK : String(raw)
    const found = map.get(key)
    if (found) found.count++
    else map.set(key, { blank: isBlankValue(raw), raw, count: 1 })
  }
  const allowed = activeFilterOf(name)
  const items: FilterValueItem[] = [...map.entries()].map(([key, info]) => {
    let label: string
    if (info.blank) label = t("blanks")
    else if (col?.type === "select") {
      const opt = col.options?.find((o) => o.value === info.raw)
      label = opt?.label ?? String(info.raw)
    } else label = String(info.raw)
    return { key, blank: info.blank, label, count: info.count, active: allowed ? allowed.includes(key) : true }
  })
  items.sort((a, b) => a.label.localeCompare(b.label))
  return items
}
const setFilterAll = (name: string) => {
  filters.value = { ...filters.value, [name]: null }
}
const setFilterOnly = (name: string, keys: string[]) => {
  filters.value = { ...filters.value, [name]: keys.length ? keys : null }
}
const toggleFilterValue = (name: string, key: string) => {
  const cur = activeFilterOf(name)
  const arr = cur ? [...cur] : []
  const i = arr.indexOf(key)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(key)
  filters.value = { ...filters.value, [name]: arr.length ? arr : null }
}

// ════════ Menus (clic droit + filtre colonne) ════════
type CtxKind = "cell" | "row" | "col"
const ctxMenu = ref<{ kind: CtxKind; x: number; y: number } | null>(null)
const ctxRoot = ref<HTMLElement | null>(null)
const filterMenu = ref<{ ci: number; x: number; y: number } | null>(null)
const filterRoot = ref<HTMLElement | null>(null)
const filterSearch = ref("")

const placePop = (el: HTMLElement, x: number, y: number) => {
  const mw = el.offsetWidth
  const mh = el.offsetHeight
  let lx = x
  let ty = y
  if (x + mw > window.innerWidth - 8) lx = Math.max(8, window.innerWidth - mw - 8)
  if (y + mh > window.innerHeight - 8) ty = Math.max(8, window.innerHeight - mh - 8)
  el.style.left = lx + "px"
  el.style.top = ty + "px"
}
const openCtx = (kind: CtxKind, e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (props.disable) return
  ctxMenu.value = { kind, x: e.clientX, y: e.clientY }
  nextTick(() => {
    if (ctxRoot.value) placePop(ctxRoot.value, e.clientX, e.clientY)
  })
}
const closeCtx = () => {
  ctxMenu.value = null
}
const openFilter = (ci: number, e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  filterSearch.value = ""
  filterMenu.value = { ci, x: e.clientX, y: e.clientY }
  nextTick(() => {
    if (filterRoot.value) placePop(filterRoot.value, e.clientX, e.clientY)
  })
}
const closeFilter = () => {
  filterMenu.value = null
}
const closePops = () => {
  closeCtx()
  closeFilter()
}
const onCellContext = (ri: number, name: string, e: MouseEvent) => {
  if (props.disable) return
  select(ri, name)
  openCtx("cell", e)
}
const onRowContext = (ri: number, e: MouseEvent) => {
  if (props.disable) return
  selectRow(ri, e.shiftKey)
  openCtx("row", e)
}
const onColContext = (ci: number, e: MouseEvent) => {
  if (props.disable) return
  selectCol(ci, e.shiftKey)
  openCtx("col", e)
}
const onDocPointerDown = (e: PointerEvent) => {
  const t = e.target as HTMLElement
  if (!t || !t.closest) return
  if (
    (ctxMenu.value && !t.closest(".q-spreadsheet__ctx")) ||
    (filterMenu.value && !t.closest(".q-spreadsheet__fpop") && !t.closest(".q-spreadsheet__fbtn"))
  ) {
    closePops()
  }
}

// actions du menu contextuel
const canEdit = computed(() => !props.readonly && !props.disable)
const doCut = async () => {
  await copySelection()
  clearSelection()
  closeCtx()
}
const doCopy = async () => {
  await copySelection()
  closeCtx()
}
const doPaste = async () => {
  await pasteClip()
  closeCtx()
}
const doClearCells = () => {
  clearSelection()
  closeCtx()
}
const activeColName = computed(() => sel.value?.column ?? colNameAt(0))
const doSortBy = (desc = false) => {
  sortByColumn(activeColName.value, desc)
  closeCtx()
}

// ─── Insertion au curseur (lignes / colonnes) ───
const insertRowAt = (pos: "above" | "below") => {
  if (!canEdit.value) return
  purgeMergesAndRules()
  if (!state.value.length) {
    addRow()
    closeCtx()
    return
  }
  const rect = selRect.value
  const anchor = sel.value
  const at = rect
    ? pos === "above"
      ? rect.r0
      : rect.r1 + 1
    : anchor
      ? pos === "above"
        ? anchor.row
        : anchor.row + 1
      : state.value.length
  const idx = Math.max(0, Math.min(state.value.length, at))
  pushHistory()
  const next = [...state.value]
  next.splice(idx, 0, blankRow())
  state.value = next
  shiftRowKeys(idx, 1)
  emit("update:rows", next)
  emit("structure-change", { rows: next, columns: cols.value, reason: "add-row" })
  if (cols.value.length) select(idx, anchor?.column ?? colNameAt(0))
  closeCtx()
}
const insertColumnAt = (pos: "left" | "right") => {
  if (!canEdit.value) return
  purgeMergesAndRules()
  const rect = selRect.value
  const anchor = sel.value
  const fromIdx = anchor ? colIndex(anchor.column) : 0
  const at = rect
    ? pos === "left"
      ? rect.c0
      : rect.c1 + 1
    : fromIdx + (pos === "left" ? 0 : 1)
  const idx = Math.max(0, Math.min(cols.value.length, at))
  pushHistory()
  let n = cols.value.length + 1
  const used = new Set(cols.value.map((c) => c.name))
  let name = "column" + n
  while (used.has(name)) name = "column" + ++n
  const col: QSpreadsheetColumn = { name, label: "Column " + n, type: "text" }
  const nextCols = [...cols.value]
  nextCols.splice(idx, 0, col)
  cols.value = nextCols
  colWidths.value = { ...colWidths.value, [name]: props.defaultColWidth }
  const nextRows = state.value.map((r) => ({ ...r, [name]: "" }))
  state.value = nextRows
  emit("update:columns", nextCols)
  emit("update:rows", nextRows)
  emit("structure-change", { rows: nextRows, columns: nextCols, reason: "add-column" })
  if (state.value.length) select(anchor?.row ?? 0, name)
  closeCtx()
}

// ─── Rendu badge (option select) ───
const badgeStyle = (opt: QSpreadsheetCellOption) => {
  if (opt.color) {
    return { backgroundColor: colorValue(opt.color), color: foregroundFor(opt.color) }
  }
  return undefined // style par défaut via CSS
}

const badgeOf = (col: QSpreadsheetColumn | undefined, val: any) => {
  if (col?.type !== "select" || !col.chip) return undefined
  const opt = col.options?.find((o) => o.value === val)
  if (!opt) return undefined
  return { label: opt.label, style: badgeStyle(opt) }
}

// ════════ Autofill (poignée de recopie en bas-droite) ════════
interface FillRect {
  r0: number
  r1: number
  c0: number
  c1: number
}
const showFill = computed(
  () =>
    !props.readonly &&
    !props.disable &&
    !!sel.value &&
    !!selRect.value &&
    !editing.value &&
    cols.value.length > 0 &&
    state.value.length > 0,
)
const fillHandleStyle = ref<Record<string, string>>({})
const fillBase = ref<FillRect | null>(null)
const fillTarget = ref<FillRect | null>(null)
const fillDragging = ref(false)
const fillCopy = ref(false)

const updateFillHandle = () => {
  if (!showFill.value || !scrollEl.value) {
    fillHandleStyle.value = {}
    return
  }
  const s = sel.value!
  const td = scrollEl.value.querySelector<HTMLElement>(
    `td[data-row="${s.row}"][data-col="${escAttr(s.column)}"]`,
  )
  if (!td) {
    fillHandleStyle.value = {}
    return
  }
  const sc = scrollEl.value.getBoundingClientRect()
  const tr = td.getBoundingClientRect()
  fillHandleStyle.value = {
    left: tr.right - sc.left + scrollEl.value.scrollLeft - 4 + "px",
    top: tr.bottom - sc.top + scrollEl.value.scrollTop - 4 + "px",
  }
}
watch([sel, state], () => nextTick(updateFillHandle))

const inFillTargetCell = (r: number, c: number) => {
  const t = fillTarget.value
  return !!t && r >= t.r0 && r <= t.r1 && c >= t.c0 && c <= t.c1
}
const inFillBaseCell = (r: number, c: number) => {
  const b = fillBase.value
  return !!b && r >= b.r0 && r <= b.r1 && c >= b.c0 && c <= b.c1
}
const fillCellClass = (r: number, c: number) =>
  cn(
    fillDragging.value &&
      !inFillBaseCell(r, c) &&
      inFillTargetCell(r, c) &&
      "q-spreadsheet__cell--fill",
  )

const startFill = (e: PointerEvent) => {
  if (!showFill.value || !selRect.value) return
  e.preventDefault()
  e.stopPropagation()
  const rect = selRect.value!
  fillBase.value = { r0: rect.r0, r1: rect.r1, c0: rect.c0, c1: rect.c1 }
  fillTarget.value = { ...fillBase.value }
  fillDragging.value = true
  fillCopy.value = e.ctrlKey || e.metaKey
  window.addEventListener("pointermove", onFillMove)
  window.addEventListener("pointerup", endFill)
}
const cellAtPoint = (e: PointerEvent): { r: number; c: number } | null => {
  const el = document.elementFromPoint(e.clientX, e.clientY)
  const td = el && el.closest ? (el.closest("td[data-row][data-col]") as HTMLElement | null) : null
  if (!td) return null
  const r = Number(td.dataset.row)
  const c = colIndex(td.dataset.col ?? "")
  if (!Number.isInteger(r) || r < 0 || c < 0 || c >= cols.value.length) return null
  return { r, c }
}
const onFillMove = (e: PointerEvent) => {
  const at = cellAtPoint(e)
  const b = fillBase.value
  if (!at || !b) return
  const t: FillRect = { ...b }
  if (at.r < t.r0) t.r0 = at.r
  if (at.r > t.r1) t.r1 = at.r
  if (at.c < t.c0) t.c0 = at.c
  if (at.c > t.c1) t.c1 = at.c
  fillTarget.value = t
  fillCopy.value = e.ctrlKey || e.metaKey
}
const endFill = () => {
  window.removeEventListener("pointermove", onFillMove)
  window.removeEventListener("pointerup", endFill)
  fillDragging.value = false
  applyFill()
  fillBase.value = null
  fillTarget.value = null
}

const applyFill = () => {
  const b = fillBase.value
  const t = fillTarget.value
  if (!b || !t || props.readonly || props.disable) return
  const same =
    t.r0 === b.r0 && t.r1 === b.r1 && t.c0 === b.c0 && t.c1 === b.c1
  if (same) return
  pushHistory()
  const h = b.r1 - b.r0 + 1
  const w = b.c1 - b.c0 + 1
  const vertDown = t.r1 > b.r1 && t.r0 === b.r0
  const vertUp = t.r0 < b.r0 && t.r1 === b.r1
  const horizRight = t.c1 > b.c1 && t.c0 === b.c0
  const horizLeft = t.c0 < b.c0 && t.c1 === b.c1
  const vertOnly = t.c0 === b.c0 && t.c1 === b.c1
  const horizOnly = t.r0 === b.r0 && t.r1 === b.r1
  const series = (vertDown && vertOnly) || (horizRight && horizOnly)

  for (let rr = t.r0; rr <= t.r1; rr++) {
    for (let cc = t.c0; cc <= t.c1; cc++) {
      if (rr >= b.r0 && rr <= b.r1 && cc >= b.c0 && cc <= b.c1) continue
      if (rr < 0 || rr >= state.value.length || cc < 0 || cc >= cols.value.length) continue
      const name = colNameAt(cc)
      const col = colOf(name)
      if (!col || col.editable === false) continue

      let val: any
      // Série numérique / dates (2 graines) vers le bas ou la droite (Ctrl = copie)
      if (
        !fillCopy.value &&
        vertDown &&
        vertOnly &&
        cc >= b.c0 &&
        cc <= b.c1 &&
        rr > b.r1
      ) {
        const s0 = state.value[b.r0]?.[name]
        const s1 = state.value[b.r1]?.[name]
        if (b.r1 > b.r0 && typeof s0 === "number" && typeof s1 === "number" && s1 !== s0) {
          const step = (s1 - s0) / (b.r1 - b.r0)
          val = s1 + step * (rr - b.r1)
        } else if (
          b.r1 > b.r0 &&
          typeof s0 === "string" &&
          typeof s1 === "string" &&
          ISO_DATE.test(s0) &&
          ISO_DATE.test(s1)
        ) {
          const d0 = +new Date(s0 + "T00:00:00Z")
          const d1 = +new Date(s1 + "T00:00:00Z")
          const step = Math.round((d1 - d0) / 86400000)
          if (step !== 0) val = isoAddDays(s1, step * (rr - b.r1))
        }
      } else if (
        !fillCopy.value &&
        horizRight &&
        horizOnly &&
        rr >= b.r0 &&
        rr <= b.r1 &&
        cc > b.c1
      ) {
        const cA = colNameAt(b.c0)
        const cB = colNameAt(b.c1)
        const s0 = state.value[rr]?.[cA]
        const s1 = state.value[rr]?.[cB]
        if (b.c1 > b.c0 && typeof s0 === "number" && typeof s1 === "number" && s1 !== s0) {
          const step = (s1 - s0) / (b.c1 - b.c0)
          val = s1 + step * (cc - b.c1)
        }
      }
      // Recopie du motif (source cyclique) — vers le bas, la droite, le haut,
      // la gauche, les formules étant décalées
      if (val === undefined) {
        const sr = b.r0 + (((rr - b.r0) % h) + h) % h
        const sc = b.c0 + (((cc - b.c0) % w) + w) % w
        let raw = state.value[sr]?.[colNameAt(sc)]
        if (typeof raw === "string" && raw.startsWith("=")) {
          raw = shiftFormulaRefs(raw, rr - sr, cc - sc)
        }
        val = raw
      }
      const old = state.value[rr]?.[name]
      if (val !== old && !(val === undefined && (old === null || old === undefined || old === "")))
        setCellValue(rr, name, old, val)
    }
  }
  // Sélectionne la zone remplie (Excel garde la plage étendue)
  setSel({ row: t.r0, column: colNameAt(t.c0), endRow: t.r1, endColumn: colNameAt(t.c1) })
  nextTick(() => focusCell(b.r0, colNameAt(b.c0)))
}

const isActiveCol = (c: number) => {
  const rect = selRect.value
  if (!rect) return false
  return rect.c0 === c && rect.c1 === c && rect.r0 === 0 && rect.r1 === state.value.length - 1
}
const isActiveRow = (r: number) => {
  const rect = selRect.value
  if (!rect) return false
  return rect.r0 === r && rect.r1 === r && rect.c0 === 0 && rect.c1 === cols.value.length - 1
}

// ─── Largeur / resize des colonnes ───
const colWidths = ref<Record<string, string | number>>({})
const syncColWidths = () => {
  const next: Record<string, string | number> = {}
  for (const c of cols.value) next[c.name] = c.width ?? props.defaultColWidth
  colWidths.value = next
}
watch(cols, syncColWidths, { immediate: true, deep: true })

const widthStyle = (col: QSpreadsheetColumn) => {
  const w = colWidths.value[col.name] ?? col.width ?? props.defaultColWidth
  return typeof w === "number" ? w + "px" : w
}
const minW = (col: QSpreadsheetColumn) => (col.minWidth ?? 60) + "px"
const maxW = (col: QSpreadsheetColumn) => (col.maxWidth ?? 600) + "px"

const resizing = ref<{ col: QSpreadsheetColumn; x: number; w: number } | null>(null)
const startResize = (e: PointerEvent, col: QSpreadsheetColumn) => {
  if (props.disable) return
  e.preventDefault()
  e.stopPropagation()
  const current = colWidths.value[col.name]
  resizing.value = {
    col,
    x: e.clientX,
    w: typeof current === "number" ? current : props.defaultColWidth,
  }
  window.addEventListener("pointermove", onResizeMove)
  window.addEventListener("pointerup", endResize)
}
const onResizeMove = (e: PointerEvent) => {
  if (!resizing.value) return
  const { col, x, w } = resizing.value
  const next = Math.max(col.minWidth ?? 60, Math.min(col.maxWidth ?? 600, w + (e.clientX - x)))
  colWidths.value = { ...colWidths.value, [col.name]: next }
}
const endResize = () => {
  resizing.value = null
  window.removeEventListener("pointermove", onResizeMove)
  window.removeEventListener("pointerup", endResize)
}

const onPointerUpGlobal = () => {
  isPointerDown.value = false
  endResize()
  endRowResize()
  const s = sel.value
  if (s) focusCell(s.row, s.column)
}
const onViewportScroll = () => {
  positionEditor()
  updateFillHandle()
  updateViewportMetrics()
  updateRange()
}

/** Double-clic sur la poignée : étend la série jusqu'à la fin des données */
const fillHandleDbl = () => {
  if (!showFill.value) return
  const b = selRect.value
  if (!b) return
  const ends: number[] = []
  for (let c = b.c0; c <= b.c1; c++) {
    const name = colNameAt(c)
    if (!colOf(name)) continue
    let r = b.r1 + 1
    while (r < state.value.length && !isBlankValue(state.value[r]?.[name])) r++
    if (r - 1 > b.r1) ends.push(r - 1)
  }
  if (!ends.length) return
  const endRow = Math.min(...ends)
  fillBase.value = { r0: b.r0, r1: b.r1, c0: b.c0, c1: b.c1 }
  fillTarget.value = { r0: b.r0, r1: endRow, c0: b.c0, c1: b.c1 }
  applyFill()
  fillBase.value = null
  fillTarget.value = null
  nextTick(() => focusCell(b.r0, colNameAt(b.c0)))
}
const filterCol = computed(() => (filterMenu.value ? (cols.value[filterMenu.value.ci] ?? null) : null))
const filterName = computed(() => filterCol.value?.name ?? "")
const filterIsAll = computed(() => {
  const n = filterName.value
  if (!n) return true
  const v = filters.value[n]
  return !v || !v.length
})
const filterItemsFor = computed(() => {
  if (!filterMenu.value) return []
  const col = cols.value[filterMenu.value.ci]
  if (!col) return []
  const q = filterSearch.value.trim().toLowerCase()
  return filterValueItems(col.name).filter(
    (i) => !q || i.label.toLowerCase().includes(q),
  )
})
const filterToggleKey = (key: string) => toggleFilterValue(filterName.value, key)
const filterSelectAll = () => setFilterAll(filterName.value)
const filterClear = () => setFilterOnly(filterName.value, [])
const onFilterSearch = (e: Event) => {
  filterSearch.value = (e.target as HTMLInputElement).value
}

onMounted(() => {
  window.addEventListener("pointerup", onPointerUpGlobal)
  window.addEventListener("pointerdown", onDocPointerDown)
  window.addEventListener("resize", onResize)
  nextTick(() => {
    updateViewportMetrics()
    updateRange()
  })
})
onBeforeUnmount(() => {
  window.removeEventListener("pointerup", onPointerUpGlobal)
  window.removeEventListener("pointerdown", onDocPointerDown)
  window.removeEventListener("resize", onResize)
  endResize()
  endRowResize()
})
const onResize = () => {
  updateViewportMetrics()
  updateRange()
}

const heightStyle = computed(() =>
  typeof props.height === "number" ? props.height + "px" : props.height,
)

const effectiveRadius = useRadius("QSpreadsheet", () => props.radius)
const rootClasses = computed(() =>
  cn(
    "q-spreadsheet",
    props.dense && "q-spreadsheet--dense",
    props.flat && "q-spreadsheet--flat",
    props.bordered && "q-spreadsheet--bordered",
    props.dark && "q-spreadsheet--dark",
    props.readonly && "q-spreadsheet--readonly",
    props.disable && "q-spreadsheet--disable",
  ),
)

const cellContent = (row: number, col: QSpreadsheetColumn) => {
  const v = state.value[row]?.[col.name]
  if (col.type === "select") {
    const opt = col.options?.find((o) => o.value === v)
    if (opt) return opt.label
  }
  return cellText(row, col.name)
}

const editingCol = computed(() => (editing.value ? colOf(editing.value.column) : undefined))

const selLabel = computed(() => {
  if (!sel.value) return ""
  const ci = colIndex(sel.value.column)
  if (ci === -1) return ""
  return colLetter(ci) + (sel.value.row + 1)
})

const optionIsActive = (opt: QSpreadsheetCellOption) => activeOption.value === opt

const focus = () => rootEl.value?.focus()

// ════════ Multi-feuilles (classeur) ════════
interface SheetExtras {
  cols: QSpreadsheetColumn[]
  widths: Record<string, number | string>
  filters: Record<string, string[] | null>
  formats: Record<string, CellFormat>
  rowHeights: Record<number, number>
  rules: CondRule[]
}
const sheetsMode = computed(() => Array.isArray(props.sheets))
const multiMode = computed(() => sheetsMode.value && (props.sheets?.length ?? 0) > 0)
const localSheets = ref<QSpreadsheetSheet[]>([])
const sheetIdx = ref(0)
const sheetMeta = ref<Record<string, SheetExtras>>({})
const switching = ref(false)

const makeExtras = (cols: QSpreadsheetColumn[]): SheetExtras => {
  const widths: Record<string, number | string> = {}
  for (const c of cols) widths[c.name] = c.width ?? props.defaultColWidth
  return {
    cols: cols.map((c) => ({ ...c })),
    widths,
    filters: {},
    formats: {},
    rowHeights: {},
    rules: [],
  }
}
const persistCurrent = () => {
  const s = localSheets.value[sheetIdx.value]
  if (!s) return
  const key = s.key!
  s.rows = state.value.map((r) => ({ ...r }))
  s.columns = cols.value.map((c) => ({ ...c }))
  const ext = sheetMeta.value[key] ?? makeExtras(cols.value)
  ext.cols = cols.value.map((c) => ({ ...c }))
  ext.widths = { ...colWidths.value }
  ext.filters = JSON.parse(JSON.stringify(filters.value))
  ext.formats = { ...cellFmt.value }
  ext.rowHeights = { ...rowHeights.value }
  ext.rules = condRules.value.map((r) => ({ ...r }))
  sheetMeta.value = { ...sheetMeta.value, [key]: ext }
}
const loadSheetIntoEngine = (idx: number) => {
  const s = localSheets.value[idx]
  if (!s) return
  const key = s.key!
  let ext = sheetMeta.value[key]
  if (!ext) {
    const colsArr = s.columns && s.columns.length ? s.columns : deriveCols(s.rows ?? [])
    const fresh = makeExtras(colsArr)
    // Le watcher de colonnes recale les largeurs depuis col.width : on les y grave
    fresh.cols = fresh.cols.map((c) => ({
      ...c,
      width: fresh.widths[c.name] ?? c.width,
    }))
    ext = fresh
    sheetMeta.value = { ...sheetMeta.value, [key]: ext }
  }
  cols.value = ext.cols.map((c) => ({ ...c, type: c.type ?? "text", options: c.options ?? [] }))
  state.value = (s.rows ?? []).map((r) => ({ ...r }))
  cellFmt.value = { ...ext.formats }
  rowHeights.value = { ...ext.rowHeights }
  filters.value = JSON.parse(JSON.stringify(ext.filters))
  condRules.value = (ext.rules ?? []).map((r) => ({ ...r }))
  colWidths.value = { ...ext.widths }
  setSel(null)
  editing.value = null
  undoStack.length = 0
  redoStack.length = 0
  if (scrollEl.value) scrollEl.value.scrollTop = 0
}
watch(
  () => props.sheets,
  (v) => {
    if (!Array.isArray(v)) {
      localSheets.value = []
      return
    }
    if (v === localSheets.value) return
    const prevKey = localSheets.value[sheetIdx.value]?.key
    let n = 1
    localSheets.value = v.map((s) => {
      const key = s.key ?? "sheet-" + n
      n++
      return {
        ...s,
        key,
        name: s.name ?? sheetName(n),
        rows: (s.rows ?? []).map((r) => ({ ...r })),
        columns: s.columns ? s.columns.map((c) => ({ ...c })) : undefined,
      }
    })
    let idx = localSheets.value.findIndex((s) => s.key === prevKey)
    if (idx < 0) idx = 0
    sheetIdx.value = idx
    switching.value = true
    loadSheetIntoEngine(idx)
    switching.value = false
  },
  { immediate: true },
)
// Synchronise le record courant à chaque mutation de données / colonnes
watch([state, cols], () => {
  if (!multiMode.value || switching.value) return
  persistCurrent()
  emit("update:sheets", localSheets.value)
})

const activeSheetName = computed(() => {
  const s = localSheets.value[sheetIdx.value]
  if (s) return s.name ?? "Sheet " + (sheetIdx.value + 1)
  return props.sheets?.[0]?.name ?? sheetName(1)
})
const sheetRename = ref<{ idx: number; val: string } | null>(null)
const startSheetRename = (idx: number) => {
  sheetRename.value = { idx, val: localSheets.value[idx]?.name ?? "" }
}
const commitSheetRename = () => {
  if (sheetRename.value) {
    const s = localSheets.value[sheetRename.value.idx]
    if (s) {
      s.name = sheetRename.value.val.trim() || s.name
      emit("update:sheets", localSheets.value)
    }
    sheetRename.value = null
  }
}
const goSheet = (idx: number) => {
  if (idx === sheetIdx.value || !multiMode.value) return
  persistCurrent()
  sheetIdx.value = idx
  switching.value = true
  loadSheetIntoEngine(idx)
  switching.value = false
}
const addSheet = () => {
  if (!sheetsMode.value) return
  if (!multiMode.value) {
    // premier onglet (propriété sheets vide) — devient multi
    const first: QSpreadsheetSheet = {
      key: "sheet-1",
      name: "Sheet 1",
      columns: cols.value.map((c) => ({ ...c })),
      rows: state.value.map((r) => ({ ...r })),
    }
    localSheets.value = [first]
    sheetMeta.value = { "sheet-1": makeExtras(cols.value) }
    sheetIdx.value = 0
  }
  const num = localSheets.value.length + 1
  const key = "sheet-" + num + "-" + Date.now().toString(36)
  const sheet: QSpreadsheetSheet = { key, name: sheetName(num), rows: [], columns: [] }
  localSheets.value = [...localSheets.value, sheet]
  sheetMeta.value = { ...sheetMeta.value, [key]: makeExtras([]) }
  persistCurrent()
  sheetIdx.value = localSheets.value.length - 1
  switching.value = true
  loadSheetIntoEngine(sheetIdx.value)
  switching.value = false
  emit("update:sheets", localSheets.value)
}
const removeSheet = (idx: number) => {
  if (!multiMode.value || localSheets.value.length <= 1) return
  persistCurrent()
  const key = localSheets.value[idx]?.key
  const next = localSheets.value.filter((_, i) => i !== idx)
  localSheets.value = next
  if (key) {
    const meta = { ...sheetMeta.value }
    delete meta[key]
    sheetMeta.value = meta
  }
  const ni = Math.min(idx, next.length - 1)
  sheetIdx.value = ni
  switching.value = true
  loadSheetIntoEngine(ni)
  switching.value = false
  emit("update:sheets", localSheets.value)
}

// ════════ Sérialisation / export ════════
const currentKeyOf = () => {
  const s = localSheets.value[sheetIdx.value]
  return s?.key ?? props.sheets?.[sheetIdx.value]?.key ?? "sheet-1"
}
const buildDocument = (): QSpreadsheetDocument => {
  persistCurrent()
  if (!multiMode.value) {
    // Persiste aussi les extras de la feuille unique (règles comprises)
    const ext = makeExtras(cols.value)
    ext.widths = { ...colWidths.value }
    ext.filters = JSON.parse(JSON.stringify(filters.value))
    ext.formats = { ...cellFmt.value }
    ext.rowHeights = { ...rowHeights.value }
    ext.rules = condRules.value.map((r) => ({ ...r }))
    sheetMeta.value = { ...sheetMeta.value, "sheet-1": ext }
  }
  const all =
    multiMode.value
      ? localSheets.value
      : [
          {
            key: "sheet-1",
            name: "Sheet 1",
            columns: cols.value.map((c) => ({ ...c })),
            rows: state.value.map((r) => ({ ...r })),
          } as QSpreadsheetSheet,
        ]
  const sheets = all.map((s) => {
    const ext =
      sheetMeta.value[s.key!] ?? makeExtras(s.columns ?? deriveCols(s.rows ?? []))
    return {
      ...s,
      rows: (s.rows ?? []).map((r) => ({ ...r })),
      columns: (s.columns ?? ext.cols).map((c) => ({ ...c })),
      formats: { ...ext.formats },
      widths: { ...ext.widths },
      rowHeights: { ...ext.rowHeights },
      filters: JSON.parse(JSON.stringify(ext.filters)),
      rules: ext.rules.map((r) => ({ ...r })),
    }
  })
  return { version: 1, active: currentKeyOf(), sheets }
}
const toJSON = (): string => JSON.stringify(buildDocument())
const exportJson = () => {
  const doc = buildDocument()
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" })
  downloadBlob(blob, (activeSheetName.value || "sheet").replace(/\s+/g, "-").toLowerCase() + ".json")
}
const loadDocument = (doc: QSpreadsheetDocument | string) => {
  const d = typeof doc === "string" ? (JSON.parse(doc) as QSpreadsheetDocument) : doc
  if (!Array.isArray(d.sheets) || !d.sheets.length) return
  let n = 1
  const local: QSpreadsheetSheet[] = []
  const meta: Record<string, SheetExtras> = {}
  for (const s of d.sheets) {
    const key = s.key ?? "sheet-" + n
    n++
    local.push({
      key,
      name: s.name ?? sheetName(n),
      columns: s.columns ? s.columns.map((c) => ({ ...c })) : undefined,
      rows: (s.rows ?? []).map((r) => ({ ...r })),
    })
    meta[key] = {
      cols: (s.columns ?? deriveCols(s.rows ?? [])).map((c) => ({ ...c })),
      widths: s.widths ?? {},
      filters: s.filters ?? {},
      formats: s.formats ?? {},
      rowHeights: s.rowHeights ?? {},
      rules: ((s as any).rules ?? []).map((r: CondRule) => ({ ...r })),
    }
  }
  localSheets.value = local
  sheetMeta.value = meta
  const idx = Math.max(0, localSheets.value.findIndex((s) => s.key === d.active))
  sheetIdx.value = idx
  switching.value = true
  loadSheetIntoEngine(idx)
  switching.value = false
  emit("update:sheets", localSheets.value)
}
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
const getCsv = (opts: { delimiter?: string; includeHeaders?: boolean } = {}): string => {
  const delim = opts.delimiter ?? ","
  const lines: string[] = []
  if (opts.includeHeaders !== false)
    lines.push(cols.value.map((c) => csvEscape(c.label ?? c.name, delim)).join(delim))
  for (let r = 0; r < state.value.length; r++) {
    lines.push(
      cols.value
        .map((c) => {
          if (c.type === "select") {
            const opt = c.options?.find((o) => o.value === state.value[r]?.[c.name])
            const raw = state.value[r]?.[c.name]
            return csvEscape(
              opt?.label ?? (raw === null || raw === undefined ? "" : String(raw)),
              delim,
            )
          }
          return csvEscape(cellText(r, c.name), delim)
        })
        .join(delim),
    )
  }
  return lines.join("\r\n")
}
const exportCsv = (opts: { delimiter?: string; includeHeaders?: boolean } = {}) => {
  const blob = new Blob(["\uFEFF" + getCsv(opts)], { type: "text/csv;charset=utf-8" })
  downloadBlob(blob, (activeSheetName.value || "sheet").replace(/\s+/g, "-").toLowerCase() + ".csv")
}

// ════════ Find & Replace (barre de recherche) ════════
const findOpen = ref(false)
const findQuery = ref("")
const findReplaceText = ref("")
const findCase = ref(false)
const findMatches = ref<{ r: number; ci: number; name: string }[]>([])
const findIdx = ref(-1)
const findInputEl = ref<HTMLInputElement | null>(null)

const findTextOf = (r: number, ci: number): string => {
  const col = cols.value[ci]
  const raw = state.value[r]?.[col?.name ?? ""]
  if (!col) return ""
  if (col.type === "select") {
    const opt = col.options?.find((o) => o.value === raw)
    return opt?.label ?? (raw === null || raw === undefined ? "" : String(raw))
  }
  return raw === null || raw === undefined ? "" : String(raw)
}
const findScan = () => {
  const q = findQuery.value
  if (!q) {
    findMatches.value = []
    findIdx.value = -1
    return
  }
  const needle = findCase.value ? q : q.toLowerCase()
  const out: { r: number; ci: number; name: string }[] = []
  for (const ri of visibleRows.value) {
    for (let ci = 0; ci < cols.value.length; ci++) {
      const hay = findCase.value ? findTextOf(ri, ci) : findTextOf(ri, ci).toLowerCase()
      if (hay.includes(needle)) out.push({ r: ri, ci, name: colNameAt(ci) })
    }
  }
  findMatches.value = out
  findIdx.value = out.length ? Math.min(Math.max(0, findIdx.value), out.length - 1) : -1
}
const findNext = (dir = 1) => {
  findScan()
  const n = findMatches.value.length
  if (!n) return
  findIdx.value = (findIdx.value + dir + n) % n
  const m = findMatches.value[findIdx.value]!
  select(m.r, m.name)
}
const isFindCell = (r: number, ci: number) =>
  findOpen.value &&
  findQuery.value &&
  findMatches.value.some((m) => m.r === r && m.ci === ci)
const isFindCurrent = (r: number, ci: number) =>
  findIdx.value >= 0 &&
  findMatches.value[findIdx.value]?.r === r &&
  findMatches.value[findIdx.value]?.ci === ci
const findMarkClass = (r: number, ci: number) =>
  cn(
    findOpen.value &&
      findQuery.value &&
      isFindCell(r, ci) &&
      (isFindCurrent(r, ci)
        ? "q-spreadsheet__cell--find-cur"
        : "q-spreadsheet__cell--find"),
  )
const findReplaceCurrent = () => {
  const m = findMatches.value[findIdx.value]
  if (!m || props.readonly || props.disable) return
  const col = cols.value[m.ci]
  const raw = state.value[m.r]?.[m.name]
  if (typeof raw !== "string" || !findQuery.value) return
  const next = findCase.value
    ? raw.split(findQuery.value).join(findReplaceText.value)
    : raw.replace(new RegExp(escapeRegExp(findQuery.value), "gi"), findReplaceText.value)
  if (next !== raw) setCellValue(m.r, m.name, raw, next)
  findScan()
  findNext(1)
}
const findReplaceAll = () => {
  if (props.readonly || props.disable || !findQuery.value) return
  pushHistory()
  const changed: { r: number; name: string; old: string; next: string }[] = []
  for (const m of findMatches.value) {
    const raw = state.value[m.r]?.[m.name]
    if (typeof raw !== "string") continue
    const next = findCase.value
      ? raw.split(findQuery.value).join(findReplaceText.value)
      : raw.replace(new RegExp(escapeRegExp(findQuery.value), "gi"), findReplaceText.value)
    if (next !== raw) changed.push({ r: m.r, name: m.name, old: raw, next })
  }
  for (const c of changed) setCellValue(c.r, c.name, c.old, c.next)
  findScan()
}
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const openFind = () => {
  findOpen.value = !findOpen.value
  if (findOpen.value) {
    findQuery.value = findQuery.value || (sel.value ? String(state.value[sel.value.row]?.[sel.value.column] ?? "") : "")
    nextTick(() => {
      findScan()
      findInputEl.value?.focus()
      findInputEl.value?.select()
    })
  }
}
const closeFind = () => {
  findOpen.value = false
  findMatches.value = []
  findIdx.value = -1
}
const onFindInput = (e: Event) => {
  findQuery.value = (e.target as HTMLInputElement).value
  findScan()
  findIdx.value = -1
  findNext(1)
}
const onFindKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault()
    findNext(e.shiftKey ? -1 : 1)
  } else if (e.key === "Escape") {
    e.preventDefault()
    closeFind()
  }
}

// ════════ Import CSV + presse-papiers avancé ════════
const importCsv = (text: string, opts: { delimiter?: string; headers?: boolean } = {}) => {
  if (props.readonly || props.disable) return
  const rows = parseCsv(text, opts.delimiter ?? ",")
  if (!rows.length || (rows.length === 1 && rows[0]!.length === 1 && rows[0]![0] === "")) return
  let colsArr: QSpreadsheetColumn[]
  let data: string[][]
  if (opts.headers) {
    colsArr = rows[0]!.map((h, i) => ({
      name: "col" + (i + 1),
      label: h.trim() || "Column " + (i + 1),
      type: "text" as const,
    }))
    data = rows.slice(1)
  } else if (cols.value.length) {
    colsArr = cols.value.map((c) => ({ ...c }))
    data = rows
  } else {
    const width = Math.max(...rows.map((row) => row.length))
    colsArr = Array.from({ length: width }, (_, i) => ({
      name: "col" + (i + 1),
      label: "Column " + (i + 1),
      type: "text" as const,
    }))
    data = rows
  }
  const rowObjs = data.map((row) => {
    const obj: Record<string, any> = {}
    colsArr.forEach((c, ci) => {
      obj[c.name] = ci < row.length && row[ci]!.trim() !== "" ? row[ci]! : null
    })
    return obj
  })
  pushHistory()
  cols.value = colsArr
  state.value = rowObjs
  cellFmt.value = {}
  rowHeights.value = {}
  filters.value = {}
  condRules.value = []
  emit("update:columns", colsArr)
  emit("update:rows", state.value)
  setSel(null)
  if (colsArr.length && state.value.length) select(0, colsArr[0]!.name)
}
const copyFormulas = async () => {
  const rect = selRect.value
  if (!rect) return
  const lines: string[][] = []
  for (let r = rect.r0; r <= rect.r1; r++) {
    const line: string[] = []
    for (let c = rect.c0; c <= rect.c1; c++) {
      const name = colNameAt(c)
      const raw = state.value[r]?.[name]
      line.push(raw === null || raw === undefined ? "" : String(raw))
    }
    lines.push(line)
  }
  internalClip.value = lines
  try {
    await navigator.clipboard.writeText(lines.map((l) => l.join("\t")).join("\n"))
  } catch {
    /* presse-papiers indisponible */
  }
}
const pasteTransposed = async () => {
  if (props.readonly || props.disable) return
  let lines = internalClip.value
  if (!lines.length) {
    try {
      const text = await navigator.clipboard.readText()
      lines = text.split(/\r?\n/).map((l) => l.split("\t"))
    } catch {
      return
    }
  }
  const s = sel.value
  if (!lines.length || !s) return
  pushHistory()
  const r0 = s.row
  const c0 = Math.max(0, colIndex(s.column))
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < (lines[i]?.length ?? 0); j++) {
      const r = r0 + j
      const c = c0 + i
      if (r >= state.value.length || c >= cols.value.length) continue
      const col = cols.value[c]!
      if (col.editable === false) continue
      const old = state.value[r]?.[col.name]
      const next = coerceValue(col, lines[i]![j] ?? "", old)
      if (next !== old) setCellValue(r, col.name, old, next)
    }
  }
}

// ════════ Mise en page : wrap + hauteur auto, masquage, fusions ════════
const anchorWrap = computed(() => !!anchorFmt.value?.wrap)
const toggleWrapSelection = () => {
  patchFormatSelection({ wrap: !anchorWrap.value })
}
const isWrappedAt = (r: number, name: string) => !!cellFmtOf(r, name)?.wrap
const rowContentHeight = (r: number): number => {
  let maxLines = 1
  for (let c = 0; c < cols.value.length; c++) {
    const col = cols.value[c]!
    if (isColHiddenName(col.name)) continue
    if (!isWrappedAt(r, col.name)) continue
    const raw = state.value[r]?.[col.name]
    if (raw === null || raw === undefined) continue
    const text = String(raw)
    const w = Math.max(40, colWNum(c) - 14)
    const perLine = Math.max(1, Math.floor(w / 7.2))
    let lines = 0
    for (const seg of text.split("\n")) lines += Math.max(1, Math.ceil(seg.length / perLine))
    maxLines = Math.max(maxLines, lines)
  }
  return maxLines * 17 + 6
}
const rowDisplayH = (r: number) => Math.max(rowH(r), rowContentHeight(r))
const cellTextWrapClass = (r: number, name: string) =>
  isWrappedAt(r, name) ? "q-spreadsheet__cell-text--wrap" : undefined

const hideSelectedRows = () => {
  const rect = selRect.value
  if (!rect) return
  const set = new Set(hiddenRows.value)
  for (let r = rect.r0; r <= rect.r1; r++) set.add(r)
  hiddenRows.value = [...set]
  setSel(null)
}
const hideRowAt = (r: number) => {
  if (!hiddenRowSet.value.has(r)) hiddenRows.value = [...hiddenRows.value, r]
  setSel(null)
}
const showAllRows = () => {
  hiddenRows.value = []
}
const hideColumnName = (name: string) => {
  if (!isColHiddenName(name)) hiddenCols.value = [...hiddenCols.value, name]
  setSel(null)
}
const hideColumnAt = (ci: number) => hideColumnName(colNameAt(ci))
const showColumnName = (name: string) => {
  hiddenCols.value = hiddenCols.value.filter((n) => n !== name)
}
const showAllHidden = () => {
  hiddenRows.value = []
  hiddenCols.value = []
}
const hiddenColEntries = computed(
  () =>
    hiddenCols.value
      .map((name) => ({ name, ci: colIndex(name) }))
      .filter((e) => e.ci >= 0),
)
const hasHiddenRows = computed(() => hiddenRows.value.length > 0)
const hasHiddenCols = computed(() => hiddenColEntries.value.length > 0)

const mergeOwner = (r: number, c: number) =>
  merges.value.find((m) => r >= m.r0 && r <= m.r1 && c >= m.c0 && c <= m.c1)
const mergeInfoOf = (r: number, c: number) => {
  const m = mergeOwner(r, c)
  if (!m) return null
  return {
    owner: r === m.r0 && c === m.c0,
    rows: m.r1 - m.r0 + 1,
    cols: m.c1 - m.c0 + 1,
  }
}
const mergeCells = () => {
  const rect = selRect.value
  if (!rect || (rect.r0 === rect.r1 && rect.c0 === rect.c1)) return
  merges.value = [...merges.value, { r0: rect.r0, c0: rect.c0, r1: rect.r1, c1: rect.c1 }]
  const owner = colNameAt(rect.c0)
  select(rect.r0, owner)
}
const canMergeSel = computed(() => {
  const rect = selRect.value
  return !!rect && (rect.r0 !== rect.r1 || rect.c0 !== rect.c1)
})
const unmergeCells = () => {
  const rect = selRect.value
  if (!rect) return
  merges.value = merges.value.filter(
    (m) => !(m.r0 >= rect.r0 && m.r1 <= rect.r1 && m.c0 >= rect.c0 && m.c1 <= rect.c1),
  )
}
const inAnyMerge = (r: number, c: number) => !!mergeOwner(r, c)
const purgeMergesAndRules = () => {
  merges.value = []
  condRules.value = []
}

// ════════ Conditional formatting (règles par plage) ════════
const cfOpen = ref(false)
const cfDraft = ref<CondRule>({
  id: "",
  r0: 0,
  c0: 0,
  r1: 0,
  c1: 0,
  kind: "gt",
  value: 0,
  bg: "#fee2e2",
})
const openCf = () => {
  const rect = selRect.value
  cfOpen.value = !cfOpen.value
  if (cfOpen.value) {
    if (rect) {
      cfDraft.value = {
        ...cfDraft.value,
        r0: rect.r0,
        c0: rect.c0,
        r1: rect.r1,
        c1: rect.c1,
      }
    }
    if (cfDraft.value.id === "") cfDraft.value = { ...cfDraft.value, id: "cf-" + Date.now().toString(36) }
  }
}
const openCfFromMenu = () => {
  openCf()
  closeCtx()
}
const cfColScope = computed({
  get: () => !!cfDraft.value.colName,
  set: (v: boolean) => {
    if (v) cfDraft.value = { ...cfDraft.value, colName: colNameAt(cfDraft.value.c0) || undefined }
    else cfDraft.value = { ...cfDraft.value, colName: undefined }
  },
})
const editCondRule = (rule: CondRule) => {
  cfDraft.value = { ...rule }
}
const addCondRule = () => {
  const d = cfDraft.value
  condRules.value = [
    ...condRules.value.filter((r) => r.id !== d.id),
    { ...d },
  ]
}
const removeCondRule = (id: string) => {
  condRules.value = condRules.value.filter((r) => r.id !== id)
}
const clearCondRules = () => {
  condRules.value = []
}
const condStyleOf = (r: number, c: number, name: string) => {
  if (cellFmtOf(r, name)?.bg) return undefined // formatage manuel prioritaire
  const rule = condRuleOf(r, c, name)
  if (!rule) return undefined
  const col = colOf(name)
  const val: any = state.value[r]?.[name]
  const num = col?.type === "number" || col?.type === "integer"
  const n = num ? Number(val) : NaN
  const s = val === null || val === undefined ? "" : String(val)
  const hit =
    rule.kind === "formula"
      ? evalRuleFormula(rule.formula ?? "FALSE", r)
      : rule.kind === "blank"
        ? val === null || val === undefined || s === ""
        : rule.kind === "notblank"
          ? !(val === null || val === undefined || s === "")
          : rule.kind === "contains"
            ? s.toLowerCase().includes(String(rule.value ?? "").toLowerCase())
            : num && !Number.isNaN(n)
              ? rule.kind === "gt"
                ? n > Number(rule.value)
                : rule.kind === "gte"
                  ? n >= Number(rule.value)
                  : rule.kind === "lt"
                    ? n < Number(rule.value)
                    : rule.kind === "lte"
                      ? n <= Number(rule.value)
                      : rule.kind === "eq" && n === Number(rule.value)
              : false
  if (!hit) return undefined
  const st: Record<string, string> = {}
  if (rule.bg) st.backgroundColor = rule.bg
  if (rule.color) st.color = rule.color
  if (rule.bold) st.fontWeight = "700"
  return Object.keys(st).length ? st : undefined
}

// ════════ Validation de colonne (min / max / entier / pattern) ════════
const valErrors = ref<Record<string, string>>({})
const valKey = (r: number, name: string) => r + ":" + name
const guardValidation = (col: QSpreadsheetColumn | undefined, value: any): string | null => {
  if (!col?.validation) return null
  const v = col.validation
  if (value === null || value === undefined || value === "") return null // vide autorisé
  if (v.integer && typeof value === "number" && !Number.isInteger(value))
    return v.message ?? "Integer required"
  if (typeof value === "number") {
    if (v.min !== undefined && value < v.min) return v.message ?? "Value below minimum (" + v.min + ")"
    if (v.max !== undefined && value > v.max) return v.message ?? "Value above maximum (" + v.max + ")"
  }
  if (v.pattern && typeof value === "string" && !new RegExp(v.pattern).test(value))
    return v.message ?? "Value does not match the required format"
  return null
}
const clearValError = (r: number, name: string) => {
  const k = valKey(r, name)
  if (valErrors.value[k]) {
    const n = { ...valErrors.value }
    delete n[k]
    valErrors.value = n
  }
}
const valErrorOf = (r: number, name: string) => valErrors.value[valKey(r, name)]
const validateAndSet = (r: number, name: string, old: any, next: any): boolean => {
  const err = guardValidation(colOf(name), next)
  if (err) {
    valErrors.value = { ...valErrors.value, [valKey(r, name)]: err }
    return false
  }
  clearValError(r, name)
  setCellValue(r, name, old, next)
  return true
}

// Helpers de rendu (template) : erreurs, merge, wrap, style conditionnel
const errCellClass = (r: number, name: string) =>
  valErrorOf(r, name) ? "q-spreadsheet__cell--invalid" : undefined
const tdTitle = (r: number, col: QSpreadsheetColumn): string => {
  const err = valErrorOf(r, col.name)
  if (err) return "⚠ " + err
  const t = cellTitle(r, col.name)
  if (t) return t
  const raw = cellValue(r, col.name)
  return col.type === "select" && raw !== null && raw !== undefined ? String(raw) : ""
}
const extraCellStyle = (r: number, c: number, name: string) => {
  const st: Record<string, string> = {}
  if (isWrappedAt(r, name)) st.whiteSpace = "normal"
  const cond = condStyleOf(r, c, name)
  if (cond) Object.assign(st, cond)
  return Object.keys(st).length ? st : undefined
}
const skipMergedCell = (r: number, c: number) => {
  const info = mergeInfoOf(r, c)
  return !!info && !info.owner
}
const mergeRowSpan = (r: number, c: number): number | undefined => {
  const info = mergeInfoOf(r, c)
  return info && info.owner && info.rows > 1 ? info.rows : undefined
}
const mergeColSpan = (r: number, c: number): number | undefined => {
  const info = mergeInfoOf(r, c)
  return info && info.owner && info.cols > 1 ? info.cols : undefined
}
const hasMergeAt = (r: number, c: number) => !!mergeInfoOf(r, c)

// ════════ Zoom & barre d'état ════════
const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const zoomLevel = ref(1)
const zoomIn = () => {
  zoomLevel.value = Math.min(ZOOM_MAX, Math.round((zoomLevel.value + 0.1) * 100) / 100)
}
const zoomOut = () => {
  zoomLevel.value = Math.max(ZOOM_MIN, Math.round((zoomLevel.value - 0.1) * 100) / 100)
}
const resetZoom = () => {
  zoomLevel.value = 1
}
const getZoom = () => zoomLevel.value
const zoomTableStyle = computed(() => ({ zoom: String(zoomLevel.value) }))
const zoomPct = computed(() => Math.round(zoomLevel.value * 100) + "%")

const selectionStats = computed(() => {
  const rect = selRect.value
  let count = 0
  let sum = 0
  if (rect) {
    for (let r = rect.r0; r <= rect.r1; r++) {
      for (let c = rect.c0; c <= rect.c1; c++) {
        const ev = evalAt(r, colNameAt(c))
        if (typeof ev === "number" && !Number.isNaN(ev)) {
          sum += ev
          count++
        }
      }
    }
  }
  return { count, sum, avg: count ? sum / count : 0 }
})
const statText = (n: number) => {
  if (!Number.isFinite(n)) return "—"
  const s = Math.abs(n) >= 1000 ? n.toLocaleString("en-US", { maximumFractionDigits: 1 }) : String(Math.round(n * 100) / 100)
  return s
}
const statusDims = computed(() => {
  const rect = selRect.value
  return rect ? (rect.r1 - rect.r0 + 1) + " × " + (rect.c1 - rect.c0 + 1) : null
})
const statusSheets = computed(() => (multiMode.value ? fmt("statusSheets", { n: localSheets.value.length }) : ""))
const statusRowInfo = computed(() =>
  (hasActiveFilters.value || hiddenRows.value.length
    ? fmt("statusRowsShown", { total: state.value.length, shown: visibleRows.value.length })
    : fmt("statusRows", { total: state.value.length })),
)

// ════════ Fill formats only (bas de la sélection) ════════
const fillFormatsDown = () => {
  const rect = selRect.value
  if (!rect || props.readonly || props.disable) return
  pushHistory()
  const nf = { ...cellFmt.value }
  for (let c = rect.c0; c <= rect.c1; c++) {
    const name = colNameAt(c)
    const srcKey = fmtKey(rect.r0, name)
    const src = nf[srcKey]
    if (!src) continue
    for (let r = rect.r0 + 1; r <= rect.r1; r++) {
      nf[fmtKey(r, name)] = { ...src }
    }
  }
  cellFmt.value = nf
}

defineExpose({
  select,
  selectRow,
  selectCol,
  selectAll,
  moveSelection,
  startEdit,
  commitEdit,
  cancelEdit,
  addRow,
  insertRowAt,
  removeSelectedRows,
  addColumn,
  insertColumnAt,
  removeSelectedColumns,
  sortByColumn,
  clearSelection,
  copySelection,
  pasteClip,
  undo,
  redo,
  toggleBoldSelection,
  toggleItalicSelection,
  setBgColorSelection,
  setTextColorSelection,
  clearFormatSelection,
  setFilterAll,
  setFilterOnly,
  toggleFilterValue,
  visibleRows,
  goSheet,
  addSheet,
  removeSheet,
  activeSheetName,
  toJSON,
  loadDocument,
  exportJson,
  exportCsv,
  getCsv,
  openFind,
  closeFind,
  importCsv,
  copyFormulas,
  pasteTransposed,
  toggleWrapSelection,
  mergeCells,
  unmergeCells,
  hideSelectedRows,
  hideRowAt,
  showAllRows,
  hideColumnAt,
  showColumnName,
  openCf,
  addCondRule,
  removeCondRule,
  clearCondRules,
  zoomIn,
  zoomOut,
  resetZoom,
  getZoom,
  fillFormatsDown,
  focus,
})
</script>

<template>
  <div class="q-spreadsheet" :class="rootClasses" :style="radiusStyle(effectiveRadius)">
    <!-- ═══════ Onglets de feuilles (classeur, haut) ═══════ -->
    <div
      v-if="sheetsMode && sheetsPosition === 'top'"
      class="q-spreadsheet__sheets"
      role="tablist"
      aria-label="Sheets"
    >
      <div
        v-for="(s, i) in localSheets"
        :key="s.key"
        class="q-spreadsheet__sheet-tab"
        :class="{ 'q-spreadsheet__sheet-tab--on': i === sheetIdx }"
        role="tab"
        :aria-selected="i === sheetIdx ? 'true' : 'false'"
        @click="goSheet(i)"
        @dblclick.stop="startSheetRename(i)"
      >
        <input
          v-if="sheetRename && sheetRename.idx === i"
          v-model="sheetRename.val"
          class="q-spreadsheet__sheet-rename"
          @click.stop
          @blur="commitSheetRename"
          @keydown.enter.prevent="commitSheetRename"
          @keydown.esc.prevent="sheetRename = null"
        />
        <template v-else>
          <span class="q-spreadsheet__sheet-name-label">{{ s.name }}</span>
          <button
            v-if="localSheets.length > 1"
            type="button"
            class="q-spreadsheet__sheet-close"
            aria-label="Remove sheet"
            @click.stop="removeSheet(i)"
          >
            <Icon :icon="icons.x" aria-hidden="true" />
          </button>
        </template>
      </div>
      <button
        type="button"
        class="q-spreadsheet__sheet-add"
        title="Add sheet"
        aria-label="Add sheet"
        @click="addSheet"
      >
        <Icon :icon="icons.plus" aria-hidden="true" />
      </button>
    </div>

    <!-- ═══════ Barre d'outils ═══════ -->
    <div v-if="showToolbar" class="q-spreadsheet__toolbar" role="toolbar" aria-label="Spreadsheet">
      <span class="q-spreadsheet__sheet-name" :title="selLabel || 'Sheet'">
        <Icon :icon="icons.fileSpreadsheet" aria-hidden="true" />
        <span v-if="selLabel">{{ selLabel }}</span>
        <span v-else>{{ t('sheet') }}</span>
      </span>

      <span class="q-spreadsheet__tb-group">
        <button class="q-spreadsheet__tool" type="button" :disabled="!canUndo" title="Undo (Ctrl+Z)" aria-label="Undo" @click="undo">
          <Icon :icon="icons.undo2" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="!canRedo" title="Redo (Ctrl+Y)" aria-label="Redo" @click="redo">
          <Icon :icon="icons.redo2" aria-hidden="true" />
        </button>
      </span>

      <span class="q-spreadsheet__tb-group">
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable" title="Add row" aria-label="Add row" @click="addRow()">
          <Icon :icon="icons.rows3" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable || !selRect" title="Remove selected row(s)" aria-label="Remove rows" @click="removeSelectedRows">
          <Icon :icon="icons.minus" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable" title="Add column" aria-label="Add column" @click="addColumn()">
          <Icon :icon="icons.columns3" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable || !selRect" title="Remove selected column(s)" aria-label="Remove columns" @click="removeSelectedColumns">
          <Icon :icon="icons.x" aria-hidden="true" />
        </button>
      </span>

      <span class="q-spreadsheet__tb-group">
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable || !sel" title="Clear selected cells" aria-label="Clear cells" @click="clearSelection">
          <Icon :icon="icons.eraser" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable || !sel" title="Sort A→Z by active column" aria-label="Sort ascending" @click="sortByColumn(sel?.column, false)">
          <Icon :icon="icons.sortAsc" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable || !sel" title="Sort Z→A by active column" aria-label="Sort descending" @click="sortByColumn(sel?.column, true)">
          <Icon :icon="icons.sortDesc" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="!sel" title="Copy (Ctrl+C)" aria-label="Copy" @click="copySelection">
          <Icon :icon="icons.copy" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__tool" type="button" :disabled="readonly || disable" title="Paste (Ctrl+V)" aria-label="Paste" @click="pasteClip">
          <Icon :icon="icons.clipboardPaste" aria-hidden="true" />
        </button>
        <button
          class="q-spreadsheet__tool"
          type="button"
          title="Find & Replace (Ctrl+F)"
          aria-label="Find"
          @click="openFind"
        >
          <Icon :icon="icons.search" aria-hidden="true" />
        </button>
        <button
          class="q-spreadsheet__tool"
          type="button"
          :class="{ 'q-spreadsheet__tool--on': cfOpen }"
          title="Conditional formatting"
          aria-label="Conditional formatting"
          @click="openCf"
        >
          <Icon :icon="icons.highlighter" aria-hidden="true" />
        </button>
      </span>
    </div>

    <!-- ═══════ Barre de formule (fx) ═══════ -->
    <div v-if="showFormulaBar && cols.length" class="q-spreadsheet__fx">
      <span class="q-spreadsheet__fx-ref">{{ selLabel || "—" }}</span>
      <span class="q-spreadsheet__fx-badge" title="Formula bar">fx</span>
      <input
        ref="fxInputEl"
        class="q-spreadsheet__fx-input"
        :value="fxDraft"
        :disabled="readonly || disable"
        :placeholder="fxCanEdit ? t('fxPlaceholder') : t('fxNoSel')"
        spellcheck="false"
        @input="onFxInput"
        @keydown="onFxKeydown"
        @blur="commitFx"
      />
    </div>

    <!-- ═══════ Barre Find & Replace ═══════ -->
    <div v-if="findOpen" class="q-spreadsheet__find">
      <Icon :icon="icons.search" class="q-spreadsheet__find-icon" aria-hidden="true" />
      <input
        ref="findInputEl"
        class="q-spreadsheet__find-input"
        :value="findQuery"
        :placeholder="t('findPh')"
        spellcheck="false"
        @input="onFindInput"
        @keydown="onFindKeydown"
      />
      <input
        class="q-spreadsheet__find-input q-spreadsheet__find-input--repl"
        v-model="findReplaceText"
        :placeholder="t('replacePh')"
        spellcheck="false"
        @keydown.enter.prevent="findReplaceCurrent"
        @keydown.esc="closeFind"
      />
      <span class="q-spreadsheet__find-count">
        {{ findQuery && findMatches.length ? (findIdx + 1) + " / " + findMatches.length : "0" }}
      </span>
      <button class="q-spreadsheet__tool" type="button" :title="t('prev')" :aria-label="t('prev')" :disabled="!findMatches.length" @click="findNext(-1)">
        <Icon :icon="icons.chevronUp" aria-hidden="true" />
      </button>
      <button class="q-spreadsheet__tool" type="button" :title="t('next')" :aria-label="t('next')" :disabled="!findMatches.length" @click="findNext(1)">
        <Icon :icon="icons.chevronDown" aria-hidden="true" />
      </button>
      <button class="q-spreadsheet__tool" type="button" :title="t('replace')" :aria-label="t('replace')" :disabled="!findMatches.length || readonly || disable" @click="findReplaceCurrent">
        <Icon :icon="icons.refreshCw" aria-hidden="true" />
      </button>
      <button class="q-spreadsheet__tool" type="button" :title="t('replaceAll')" :aria-label="t('replaceAll')" :disabled="!findMatches.length || readonly || disable" @click="findReplaceAll">
        <Icon :icon="icons.eraser" aria-hidden="true" />
      </button>
      <button class="q-spreadsheet__tool q-spreadsheet__find-close" type="button" :title="t('close')" aria-label="Close find" @click="closeFind">
        <Icon :icon="icons.x" aria-hidden="true" />
      </button>
    </div>

    <!-- ═══════ Panneau Conditional formatting ═══════ -->
    <div v-if="cfOpen" class="q-spreadsheet__cf">
      <Icon :icon="icons.highlighter" aria-hidden="true" />
      <span class="q-spreadsheet__cf-title">
        {{ cfDraft.c0 !== cfDraft.c1 || cfDraft.r0 !== cfDraft.r1
          ? colLetter(cfDraft.c0) + (cfDraft.r0 + 1) + ':' + colLetter(cfDraft.c1) + (cfDraft.r1 + 1)
          : t('condSelection') }}
      </span>
      <select v-model="cfDraft.kind" class="q-spreadsheet__cf-kind" title="Condition">
        <option value="gt">{{ t('condGreater') }}</option>
        <option value="gte">{{ t('condGe') }}</option>
        <option value="lt">{{ t('condLess') }}</option>
        <option value="lte">{{ t('condLe') }}</option>
        <option value="eq">{{ t('condEq') }}</option>
        <option value="contains">{{ t('condContains') }}</option>
        <option value="blank">{{ t('condBlank') }}</option>
        <option value="notblank">{{ t('condNotBlank') }}</option>
        <option value="formula">{{ t('condFormula') }}</option>
      </select>
      <input
        v-model="cfDraft.value"
        class="q-spreadsheet__find-input"
        type="text"
        style="width: 90px"
        :placeholder="cfDraft.kind === 'formula' ? '=A1>10' : t('condValue')"
        spellcheck="false"
      />
      <label class="q-spreadsheet__cf-col" title="Apply to the whole column">
        <input v-model="cfColScope" type="checkbox" />
        Column
      </label>
      <div class="q-spreadsheet__swatches q-spreadsheet__swatches--mini">
        <button
          v-for="c in ['#fee2e2', '#fef9c3', '#dcfce7', '#dbeafe', '#ede9fe', '#ffffff']"
          :key="c"
          type="button"
          class="q-spreadsheet__swatch"
          :class="{ 'q-spreadsheet__swatch--on': cfDraft.bg === c }"
          :style="swatchInline(c)"
          @click="cfDraft.bg = c"
        />
      </div>
      <button
        class="q-spreadsheet__tool"
        type="button"
        :class="{ 'q-spreadsheet__tool--on': cfDraft.bold }"
        title="Bold"
        aria-label="Bold"
        @click="cfDraft.bold = !cfDraft.bold"
      >
        <Icon :icon="icons.bold" aria-hidden="true" />
      </button>
      <button class="demo-btn q-spreadsheet__cf-apply" type="button" @click="addCondRule">
        {{ condRules.some((r) => r.id === cfDraft.id) ? t('condUpdate') : t('condAdd') }}
      </button>
      <button class="q-spreadsheet__tool" type="button" :title="t('condClear')" :aria-label="t('condClear')" @click="clearCondRules">
        <Icon :icon="icons.trash2" aria-hidden="true" />
      </button>
      <button class="q-spreadsheet__tool" type="button" :title="t('close')" aria-label="Close conditional" @click="openCf">
        <Icon :icon="icons.x" aria-hidden="true" />
      </button>

      <div v-if="condRules.length" class="q-spreadsheet__cf-list">
        <span
          v-for="rule in condRules"
          :key="rule.id"
          class="q-spreadsheet__cf-chip"
          :class="{ 'q-spreadsheet__cf-chip--on': rule.id === cfDraft.id }"
          :style="rule.bg ? { backgroundColor: rule.bg } : undefined"
          title="Click to edit this rule"
          @click="editCondRule(rule)"
        >
          {{ rule.colName
            ? 'Col ' + rule.colName
            : colLetter(rule.c0) + (rule.r0 + 1) + (rule.c0 !== rule.c1 || rule.r0 !== rule.r1 ? ':' + colLetter(rule.c1) + (rule.r1 + 1) : '') }}
          · {{ rule.kind }}
          <button
            type="button"
            class="q-spreadsheet__sheet-close"
            aria-label="Remove rule"
            @click.stop="removeCondRule(rule.id)"
          >
            <Icon :icon="icons.x" aria-hidden="true" />
          </button>
        </span>
      </div>
    </div>

    <!-- ═══════ Grille ═══════ -->
    <div
      :ref="setGridRef"
      class="q-spreadsheet__viewport"
      :style="{ height: heightStyle }"
      tabindex="0"
      @keydown="onKeydown"
      @scroll="onViewportScroll"
      @contextmenu.prevent
    >
      <table class="q-spreadsheet__table" cellspacing="0" :style="zoomTableStyle">
        <thead v-if="showColumnHeaders">
          <tr class="q-spreadsheet__head-row">
            <th
              class="q-spreadsheet__corner"
              aria-label="Select all"
              @click="selectAll"
              @contextmenu="selectAll"
            >
              <Icon v-if="isFullSelection" :icon="icons.check" aria-hidden="true" />
            </th>
            <th
              v-for="(col, ci) in cols"
              :key="col.name"
              class="q-spreadsheet__colhead"
              :class="[
                col.headerClass,
                { 'q-spreadsheet__colhead--sel': isActiveCol(ci) },
                isFrozenCol(ci) && 'q-spreadsheet__colhead--frozen',
                isColHiddenName(col.name) && 'q-spreadsheet__colhead--hide',
              ]"
              :style="[
                { width: widthStyle(col), minWidth: minW(col), maxWidth: maxW(col) },
                col.headerStyle,
                colheadInline(ci),
              ]"
              @click="selectCol(ci, $event.shiftKey)"
              @contextmenu="onColContext(ci, $event)"
            >
              <span class="q-spreadsheet__colhead-inner">
                <span class="q-spreadsheet__colhead-letter">{{ colLetter(ci) }}</span>
                <span class="q-spreadsheet__colhead-label">{{ col.label || col.name }}</span>
              </span>
              <button
                class="q-spreadsheet__fbtn"
                :class="{ 'q-spreadsheet__fbtn--on': hasFilterFor(col.name) }"
                type="button"
                tabindex="-1"
                title="Filter column"
                aria-label="Filter column"
                @pointerdown.stop
                @click.stop="openFilter(ci, $event)"
              >
                <Icon :icon="icons.filter" aria-hidden="true" />
              </button>
              <span
                class="q-spreadsheet__resize"
                title="Resize column"
                @pointerdown.stop.prevent="startResize($event, col)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cols.length === 0">
            <td :colspan="(showRowNumbers ? 1 : 0) || 1" class="q-spreadsheet__no-rows">
              Add a column with the toolbar (+) or right-click to start.
            </td>
          </tr>
          <template v-if="virtualOn && topPad > 0">
            <tr class="q-spreadsheet__vpad" aria-hidden="true">
              <td
                :colspan="(showRowNumbers ? 1 : 0) + visibleColsCount"
                :style="{ height: topPad + 'px' }"
              />
            </tr>
          </template>
          <tr
            v-for="ri in renderRows"
            :key="ri"
            :style="{ height: rowDisplayH(ri) + 'px' }"
          >
            <th
              v-if="showRowNumbers"
              class="q-spreadsheet__rownum"
              :class="[
                { 'q-spreadsheet__rownum--sel': isActiveRow(ri) },
                isFrozenRow(ri) && 'q-spreadsheet__rownum--frozen',
              ]"
              :style="rownumInline(ri)"
              @click="selectRow(ri, $event.shiftKey)"
              @contextmenu="onRowContext(ri, $event)"
            >
              {{ ri + 1 }}
              <span
                class="q-spreadsheet__row-resize"
                title="Resize row"
                @pointerdown.stop.prevent="startRowResize($event, ri)"
              />
            </th>
            <td
              v-for="(col, ci) in cols"
              :key="col.name"
              class="q-spreadsheet__cell"
              :class="[
                cellClasses(ri, col.name),
                cellFreezeClass(ri, ci),
                fillCellClass(ri, ci),
                findMarkClass(ri, ci),
                errCellClass(ri, col.name),
                hasMergeAt(ri, ci) && 'q-spreadsheet__cell--merged',
                (isColHiddenName(col.name) || skipMergedCell(ri, ci)) && 'q-spreadsheet__cell--hide',
              ]"
              :rowspan="mergeRowSpan(ri, ci)"
              :colspan="mergeColSpan(ri, ci)"
              :style="[
                { width: widthStyle(col), minWidth: minW(col), maxWidth: maxW(col) },
                cellInlineStyle(ri, ci, col.name),
                extraCellStyle(ri, ci, col.name),
              ]"
              :data-row="ri"
              :data-col="col.name"
              :title="tdTitle(ri, col)"
              tabindex="-1"
              @pointerdown="onCellPointerDown(ri, col.name, $event)"
              @pointerenter="onCellPointerEnter(ri, col.name)"
              @dblclick="startEdit(ri, col.name)"
              @contextmenu="onCellContext(ri, col.name, $event)"
            >
              <!-- booléen -->
              <button
                v-if="col.type === 'boolean'"
                type="button"
                class="q-spreadsheet__checkbox"
                :class="{ 'q-spreadsheet__checkbox--on': !!cellValue(ri, col.name) }"
                :disabled="readonly || disable || col.editable === false"
                aria-label="Toggle"
                @click.stop="toggleBoolean(ri, col.name)"
              >
                <Icon v-if="cellValue(ri, col.name)" :icon="icons.check" aria-hidden="true" />
              </button>

              <!-- select : badge coloré -->
              <span
                v-else-if="col.type === 'select' && badgeOf(col, cellValue(ri, col.name))"
                class="q-spreadsheet__badge"
                :style="badgeOf(col, cellValue(ri, col.name))!.style"
              >
                {{ badgeOf(col, cellValue(ri, col.name))!.label }}
              </span>

              <!-- valeur -->
              <span
                v-else
                class="q-spreadsheet__cell-text"
                :class="cellTextWrapClass(ri, col.name)"
              >{{ cellContent(ri, col) }}</span>
            </td>
          </tr>
          <template v-if="virtualOn && bottomPad > 0">
            <tr class="q-spreadsheet__vpad" aria-hidden="true">
              <td
                :colspan="(showRowNumbers ? 1 : 0) + visibleColsCount"
                :style="{ height: bottomPad + 'px' }"
              />
            </tr>
          </template>
          <tr v-if="cols.length > 0 && visibleRows.length === 0">
            <td
              :colspan="(showRowNumbers ? 1 : 0) + visibleColsCount"
              class="q-spreadsheet__no-rows"
            >
              <template v-if="hasActiveFilters">{{ t('noRowsFilter') }}</template>
              <template v-else>{{ t('noRowsYet') }}</template>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ═══════ Poignée d'autofill ═══════ -->
      <span
        v-if="showFill"
        class="q-spreadsheet__fill"
        :style="fillHandleStyle"
        @pointerdown.stop.prevent="startFill($event)"
        @dblclick.stop.prevent="fillHandleDbl"
      />

      <!-- ═══════ Éditeur overlay ═══════ -->
      <div
        v-if="editing && editingCol"
        class="q-spreadsheet__editor"
        :class="{
          'q-spreadsheet__editor--select': editingCol.type === 'select',
          'q-spreadsheet__editor--formula': editingIsFormula,
        }"
        :style="editorStyle"
        @mousedown.stop
      >
        <textarea
          v-if="editingIsFormula"
          ref="editAreaEl"
          v-model="draft"
          class="q-spreadsheet__editor-input q-spreadsheet__editor-area"
          :rows="draftLines"
          spellcheck="false"
          @keydown="onEditKeydown"
          @blur="commitEdit"
        />
        <input
          v-else
          ref="editInputEl"
          v-model="draft"
          class="q-spreadsheet__editor-input"
          :type="editorInputType"
          :step="editorStep"
          :placeholder="editingCol.type === 'select' ? 'Type to filter…' : ''"
          @keydown="onEditKeydown"
          @blur="commitEdit"
        />
        <div v-if="editingCol.type === 'select' && selectOptions.length" class="q-spreadsheet__options">
          <button
            v-for="opt in selectOptions"
            :key="String(opt.value)"
            type="button"
            class="q-spreadsheet__option"
            :class="{ 'q-spreadsheet__option--active': optionIsActive(opt) }"
            @mousedown.prevent
            @click="pickOption(opt)"
          >
            <span class="q-spreadsheet__option-swatch" :style="badgeStyle(opt)" />
            {{ opt.label }}
          </button>
        </div>
        <div v-if="editingIsFormula && fxOpen" class="q-spreadsheet__fnsug">
          <button
            v-for="(f, fi) in fxSuggestions"
            :key="f.name"
            type="button"
            class="q-spreadsheet__fnsug-item"
            :class="{ 'q-spreadsheet__fnsug-item--on': fxActive === fi }"
            @mousedown.prevent
            @click="acceptFxAt(fi)"
          >
            <code>{{ f.name }}</code>
            <span>({{ f.sig }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════ Onglets de feuilles (classeur, bas — Excel) ═══════ -->
    <div
      v-if="sheetsMode && sheetsPosition === 'bottom'"
      class="q-spreadsheet__sheets q-spreadsheet__sheets--bottom"
      role="tablist"
      aria-label="Sheets"
    >
      <div
        v-for="(s, i) in localSheets"
        :key="s.key"
        class="q-spreadsheet__sheet-tab"
        :class="{ 'q-spreadsheet__sheet-tab--on': i === sheetIdx }"
        role="tab"
        :aria-selected="i === sheetIdx ? 'true' : 'false'"
        @click="goSheet(i)"
        @dblclick.stop="startSheetRename(i)"
      >
        <input
          v-if="sheetRename && sheetRename.idx === i"
          v-model="sheetRename.val"
          class="q-spreadsheet__sheet-rename"
          @click.stop
          @blur="commitSheetRename"
          @keydown.enter.prevent="commitSheetRename"
          @keydown.esc.prevent="sheetRename = null"
        />
        <template v-else>
          <span class="q-spreadsheet__sheet-name-label">{{ s.name }}</span>
          <button
            v-if="localSheets.length > 1"
            type="button"
            class="q-spreadsheet__sheet-close"
            aria-label="Remove sheet"
            @click.stop="removeSheet(i)"
          >
            <Icon :icon="icons.x" aria-hidden="true" />
          </button>
        </template>
      </div>
      <button
        type="button"
        class="q-spreadsheet__sheet-add"
        title="Add sheet"
        aria-label="Add sheet"
        @click="addSheet"
      >
        <Icon :icon="icons.plus" aria-hidden="true" />
      </button>
    </div>

    <!-- ═══════ Barre d'état ═══════ -->
    <div class="q-spreadsheet__status">
      <span class="q-spreadsheet__status-cell" :title="selLabel || 'Sheet'">
        <Icon :icon="icons.fileSpreadsheet" aria-hidden="true" />
        {{ selLabel || t('sheet') }}
      </span>
      <span v-if="statusDims" class="q-spreadsheet__status-item">{{ statusDims }}</span>
      <span v-if="selectionStats.count" class="q-spreadsheet__status-item q-spreadsheet__status-stats">
        Σ {{ statText(selectionStats.sum) }} · x̄ {{ statText(selectionStats.avg) }} · n {{ selectionStats.count }}
      </span>
      <span v-if="hasActiveFilters || hiddenRows.length" class="q-spreadsheet__status-chip">
        {{ statusRowInfo }}
      </span>
      <span class="q-spreadsheet__status-spacer" />
      <span v-if="multiMode" class="q-spreadsheet__status-item">{{ statusSheets }}</span>
      <span class="q-spreadsheet__status-zoom">
        <button class="q-spreadsheet__tool" type="button" title="Zoom out" aria-label="Zoom out" @click="zoomOut">
          <Icon :icon="icons.minus" aria-hidden="true" />
        </button>
        <button class="q-spreadsheet__status-zoom-pct" type="button" title="Reset zoom" @click="resetZoom">
          {{ zoomPct }}
        </button>
        <button class="q-spreadsheet__tool" type="button" title="Zoom in" aria-label="Zoom in" @click="zoomIn">
          <Icon :icon="icons.plus" aria-hidden="true" />
        </button>
      </span>
    </div>

    <!-- ═══════ Menu contextuel (clic droit) ═══════ -->
    <Teleport to="body">
      <div
        v-if="ctxMenu"
        ref="ctxRoot"
        class="q-spreadsheet__ctx"
        style="position: fixed; left: 0; top: 0"
        @contextmenu.prevent
      >
        <div class="q-spreadsheet__ctx-title">
          <span v-if="ctxMenu.kind === 'row' && sel">{{ t('rowLbl') }} {{ sel.row + 1 }}</span>
          <span v-else-if="ctxMenu.kind === 'col' && sel">{{ t('colLbl') }} {{ colLetter(colIndex(sel.column)) }}</span>
          <span v-else>{{ selLabel || t('cellLbl') }}</span>
        </div>

        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="doCut">
          <Icon :icon="icons.scissors" aria-hidden="true" /> {{ t('cut') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!sel" @click="doCopy">
          <Icon :icon="icons.copy" aria-hidden="true" /> {{ t('copy') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="doPaste">
          <Icon :icon="icons.clipboardPaste" aria-hidden="true" /> {{ t('paste') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit || !sel" @click="doClearCells">
          <Icon :icon="icons.eraser" aria-hidden="true" /> {{ t('clearContents') }}
        </button>

        <div class="q-spreadsheet__sep" />
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="insertRowAt('above')">
          <Icon :icon="icons.arrowUp" aria-hidden="true" /> {{ t('insertRowAbove') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="insertRowAt('below')">
          <Icon :icon="icons.arrowDown" aria-hidden="true" /> {{ t('insertRowBelow') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit || !selRect" @click="removeSelectedRows">
          <Icon :icon="icons.trash2" aria-hidden="true" /> {{ t('deleteRows') }}
        </button>
        <div class="q-spreadsheet__sep" />
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="insertColumnAt('left')">
          <Icon :icon="icons.chevronLeft" aria-hidden="true" /> {{ t('insertColLeft') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="insertColumnAt('right')">
          <Icon :icon="icons.chevronRight" aria-hidden="true" /> {{ t('insertColRight') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit || !selRect" @click="removeSelectedColumns">
          <Icon :icon="icons.x" aria-hidden="true" /> {{ t('deleteCols') }}
        </button>
        <div class="q-spreadsheet__sep" />
        <button type="button" class="q-spreadsheet__mi" :disabled="!sel" @click="doSortBy(false)">
          <Icon :icon="icons.sortAsc" aria-hidden="true" /> {{ t('sortAsc') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!sel" @click="doSortBy(true)">
          <Icon :icon="icons.sortDesc" aria-hidden="true" /> {{ t('sortDesc') }}
        </button>
        <div class="q-spreadsheet__sep" />
        <button type="button" class="q-spreadsheet__mi" :class="{ 'q-spreadsheet__mi--on': isBoldSel }" :disabled="!canEdit" @click="toggleBoldSelection">
          <Icon :icon="icons.bold" aria-hidden="true" /> {{ t('bold') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :class="{ 'q-spreadsheet__mi--on': isItalicSel }" :disabled="!canEdit" @click="toggleItalicSelection">
          <Icon :icon="icons.italic" aria-hidden="true" /> {{ t('italic') }}
        </button>

        <div class="q-spreadsheet__ctx-label">{{ t('fillColor') }}</div>
        <div class="q-spreadsheet__swatches">
          <button
            v-for="c in FORMAT_COLORS"
            :key="'bg' + c"
            type="button"
            class="q-spreadsheet__swatch"
            :class="{ 'q-spreadsheet__swatch--on': currentBg === c }"
            :style="swatchInline(c)"
            :title="c || 'No fill'"
            :disabled="!canEdit"
            @click="setBgColorSelection(c)"
          />
        </div>
        <div class="q-spreadsheet__ctx-label">{{ t('textColor') }}</div>
        <div class="q-spreadsheet__swatches">
          <button
            v-for="c in TEXT_COLORS"
            :key="'fg' + c"
            type="button"
            class="q-spreadsheet__swatch"
            :class="{ 'q-spreadsheet__swatch--on': currentColor === c }"
            :style="swatchInline(c)"
            :title="c || 'Automatic'"
            :disabled="!canEdit"
            @click="setTextColorSelection(c)"
          />
        </div>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit || !sel" @click="clearFormatSelection">
          <Icon :icon="icons.eraser" aria-hidden="true" /> {{ t('clearFormat') }}
        </button>
        <div class="q-spreadsheet__sep" />
        <button type="button" class="q-spreadsheet__mi" :class="{ 'q-spreadsheet__mi--on': anchorWrap }" :disabled="!canEdit || !sel" @click="toggleWrapSelection">
          <Icon :icon="icons.alignLeft" aria-hidden="true" /> {{ t('wrapText') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit || !canMergeSel" @click="mergeCells">
          <Icon :icon="icons.tableCellsMerge" aria-hidden="true" /> {{ t('mergeCells') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="unmergeCells">
          <Icon :icon="icons.x" aria-hidden="true" /> {{ t('unmerge') }}
        </button>
        <div class="q-spreadsheet__sep" />
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit || !sel" @click="hideSelectedRows">
          <Icon :icon="icons.eyeOff" aria-hidden="true" /> {{ t('hideRows') }}
        </button>
        <button type="button" class="q-spreadsheet__mi" :disabled="!canEdit || !sel" @click="hideColumnName(activeColName)">
          <Icon :icon="icons.eyeOff" aria-hidden="true" /> {{ t('hideCol') }}
        </button>
        <button v-if="hasHiddenRows || hasHiddenCols" type="button" class="q-spreadsheet__mi" :disabled="!canEdit" @click="showAllHidden">
          <Icon :icon="icons.eye" aria-hidden="true" /> {{ t('showHidden') }}
        </button>
        <template v-for="entry in hiddenColEntries" :key="entry.name">
          <button type="button" class="q-spreadsheet__mi" @click="showColumnName(entry.name)">
            <Icon :icon="icons.eye" aria-hidden="true" /> {{ fmt('showCol', { name: entry.name }) }}
          </button>
        </template>
        <div class="q-spreadsheet__sep" />
        <button type="button" class="q-spreadsheet__mi" :disabled="!sel" @click="openCfFromMenu">
          <Icon :icon="icons.highlighter" aria-hidden="true" /> {{ t('condFormat') }}
        </button>
      </div>
    </Teleport>

    <!-- ═══════ Popup filtre de colonne ═══════ -->
    <Teleport to="body">
      <div
        v-if="filterMenu && filterCol"
        ref="filterRoot"
        class="q-spreadsheet__fpop"
        style="position: fixed; left: 0; top: 0"
        @click.stop
        @contextmenu.prevent
      >
        <div class="q-spreadsheet__fpop-head">
          <Icon :icon="icons.filter" aria-hidden="true" />
          <span class="q-spreadsheet__fpop-name">{{ filterCol.label || filterCol.name }}</span>
          <button type="button" class="q-spreadsheet__fpop-close" aria-label="Close" @click="closeFilter">
            <Icon :icon="icons.x" aria-hidden="true" />
          </button>
        </div>
        <input
          v-model="filterSearch"
          class="q-spreadsheet__fpop-search"
          :placeholder="t('searchValues')"
          spellcheck="false"
        />
        <div class="q-spreadsheet__fpop-list">
          <button
            type="button"
            class="q-spreadsheet__fpop-row q-spreadsheet__fpop-row--all"
            :class="{ 'q-spreadsheet__fpop-row--on': filterIsAll }"
            @click="filterSelectAll"
          >
            <span class="q-spreadsheet__fpop-check">
              <Icon v-if="filterIsAll" :icon="icons.check" aria-hidden="true" />
            </span>
            <span class="q-spreadsheet__fpop-label">{{ t('selectAll') }}</span>
          </button>
          <button
            type="button"
            class="q-spreadsheet__fpop-row"
            :class="{ 'q-spreadsheet__fpop-row--on': !item.active }"
            v-for="item in filterItemsFor"
            :key="item.key"
            @click="filterToggleKey(item.key)"
          >
            <span class="q-spreadsheet__fpop-check">
              <Icon v-if="item.active" :icon="icons.check" aria-hidden="true" />
            </span>
            <span class="q-spreadsheet__fpop-label" :class="{ 'q-spreadsheet__fpop-label--blank': item.blank }">
              {{ item.label }}
            </span>
            <span class="q-spreadsheet__fpop-count">{{ item.count }}</span>
          </button>
          <div v-if="filterItemsFor.length === 0" class="q-spreadsheet__fpop-empty">
            {{ t('noValues') }}
          </div>
        </div>
        <button
          v-if="!filterIsAll"
          type="button"
          class="q-spreadsheet__mi"
          @click="filterClear"
        >
          <Icon :icon="icons.eraser" aria-hidden="true" /> {{ t('clearFilter') }}
        </button>
      </div>
    </Teleport>

    <!-- ═══════ Suggestions de fonctions (barre fx) ═══════ -->
    <Teleport to="body">
      <div
        v-if="fxOpen && !editing"
        class="q-spreadsheet__fpop q-spreadsheet__fnsug q-spreadsheet__fnsug--fx"
        :style="fxPopStyle"
        @click.stop
        @contextmenu.prevent
      >
        <button
          v-for="(f, fi) in fxSuggestions"
          :key="f.name"
          type="button"
          class="q-spreadsheet__fnsug-item"
          :class="{ 'q-spreadsheet__fnsug-item--on': fxActive === fi }"
          @mousedown.prevent
          @click="acceptFxAt(fi)"
        >
          <code>{{ f.name }}</code>
          <span>({{ f.sig }})</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>
