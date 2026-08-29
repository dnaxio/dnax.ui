<script lang="ts">
// QDataGrid — grille type tableur (inspirée de MUI X Data Grid) :
// sélection de cellule au clavier (flèches, Tab), édition en place (Entrée/F2,
// double-clic, ou frappe directe), et formules style spreadsheet sur les colonnes
// allow-formulas : =price * quantity, =SUM(E1:E3), =E4 * $B$5 …
export interface QDataGridColumn {
  /** Clé de la propriété dans la ligne */
  name: string
  label?: string
  type?: "string" | "number" | "boolean"
  /** Largeur de colonne (nombre px ou chaîne CSS) */
  width?: number | string
  align?: "left" | "center" | "right"
  /** La cellule est éditable (Entrée / double-clic / frappe) */
  editable?: boolean
  /** Les valeurs "=…" sont évaluées comme formules (sinon chaîne littérale) */
  allowFormulas?: boolean
  /** Formatteur de la valeur affichée (après évaluation) */
  format?: (val: any) => any
  headerClass?: string
  headerStyle?: string
}

export interface QDataGridCell {
  row: number
  column: string
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import { cn } from "../lib/utils"
import { evaluateFormula, FormulaError, isError } from "../lib/formula"
import type { FormulaValue } from "../lib/formula"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  /** Lignes (v-model:rows) */
  rows?: Record<string, any>[]
  /** Colonnes ({ name, label, type, width, align, editable, allowFormulas, format, headerClass, headerStyle }) */
  columns?: QDataGridColumn[]
  /** Hauteur du conteneur scrollable (nombre px ou chaîne CSS, défaut "320px") */
  height?: string | number
  /** Hauteur réduite */
  dense?: boolean
  /** Sans ombre */
  flat?: boolean
  /** Bordure */
  bordered?: boolean
  /** Séparateurs : horizontal | vertical | cell | none */
  separator?: "horizontal" | "vertical" | "cell" | "none"
  dark?: boolean
  /** Désactive l'édition (lecture seule) */
  readonly?: boolean
  /** Cellules sélectionnées (v-model:selected) */
  selected?: QDataGridCell[]
  /** Classe CSS appliquée à toutes les cellules d'en-tête */
  headerClass?: string
  /** Style CSS appliqué à toutes les cellules d'en-tête */
  headerStyle?: string
  /** Coins arrondis (échelle xs|sm|md|lg ou none) — défaut : composantProps */
  radius?: RadiusProp
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  columns: () => [],
  height: "320px",
  dense: false,
  flat: false,
  bordered: false,
  separator: "horizontal",
  dark: false,
  readonly: false,
  selected: undefined,
  headerClass: "",
  headerStyle: "",
})

const emit = defineEmits<{
  "update:rows": [value: Record<string, any>[]]
  "update:selected": [value: QDataGridCell[]]
  "cell-click": [payload: { row: number; column: string; value: any }]
  "cell-change": [payload: { row: number; column: string; oldValue: any; newValue: any; rows: Record<string, any>[] }]
  "cell-edit-start": [payload: { row: number; column: string }]
  "cell-edit-end": [payload: { row: number; column: string; canceled: boolean }]
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

// ─── Sélection ───
const sel = ref<QDataGridCell[]>([])
watch(
  () => props.selected,
  (v) => {
    if (v) sel.value = v
  },
  { immediate: true, deep: true },
)

const isSelected = (row: number, column: string) =>
  sel.value.some((c) => c.row === row && c.column === column)

const select = (row: number, column: string) => {
  sel.value = [{ row, column }]
  emit("update:selected", sel.value)
  nextTick(focusCell)
}

const moveSelection = (dr: number, dc: number) => {
  if (!sel.value.length || !props.columns.length) return
  const { row, column } = sel.value[0]!
  const ci = props.columns.findIndex((c) => c.name === column)
  const nr = Math.max(0, Math.min(state.value.length - 1, row + dr))
  const nc = Math.max(0, Math.min(props.columns.length - 1, ci + dc))
  select(nr, props.columns[nc]!.name)
}

const escAttr = (s: string) => String(s).replace(/"/g, '\\"')
const focusCell = () => {
  if (!sel.value.length) return
  const { row, column } = sel.value[0]!
  const td = scrollEl.value?.querySelector<HTMLElement>(
    `td[data-row="${row}"][data-col="${escAttr(column)}"]`,
  )
  td?.focus()
}

// ─── Évaluation des cellules (formules + graphe de dépendances) ───
const colIndex = (name: string) =>
  props.columns.findIndex((c) => c.name.toLowerCase() === name.toLowerCase())

const evaluated = computed<FormulaValue[][]>(() => {
  const memo = new Map<string, FormulaValue>()
  const visiting = new Set<string>()

  const get = (r: number, c: number): FormulaValue => {
    const key = r + ":" + c
    if (memo.has(key)) return memo.get(key)!
    if (visiting.has(key)) return new FormulaError("#CYCLE!")
    const col = props.columns[c]
    const row = state.value[r]
    if (!col || !row) return new FormulaError("#REF!")
    const raw = row[col.name]
    let val: FormulaValue = raw ?? null
    if (typeof raw === "string" && raw.startsWith("=") && col.allowFormulas) {
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

  return state.value.map((_, r) => props.columns.map((_, c) => get(r, c)))
})

const cellValue = (r: number, c: number) => evaluated.value[r]?.[c]
const cellText = (r: number, c: number): string => {
  const v = cellValue(r, c)
  const col = props.columns[c]
  if (isError(v)) return v.toString()
  let out = v
  if (col?.format) out = col.format(v)
  if (out === null || out === undefined || out === "") return ""
  return String(out)
}

const cellTitle = (r: number, c: number): string | undefined => {
  const col = props.columns[c]
  if (!col) return undefined
  const raw = state.value[r]?.[col.name]
  return typeof raw === "string" && raw.startsWith("=") && col.allowFormulas ? raw : undefined
}

// ─── Édition ───
const editing = ref<{ row: number; column: string } | null>(null)
const draft = ref("")
const scrollEl = ref<HTMLElement | null>(null)
const editorEl = ref<HTMLElement | null>(null)
const editInputEl = ref<HTMLInputElement | null>(null)
const editAreaEl = ref<HTMLTextAreaElement | null>(null)
const editorStyle = ref<Record<string, string>>({})

const columnOf = (name: string) => props.columns.find((c) => c.name === name)
const isFormulaDraft = computed(() => {
  const col = editing.value ? columnOf(editing.value.column) : undefined
  return !!col?.allowFormulas && draft.value.startsWith("=")
})
const draftLines = computed(() => Math.min(5, Math.max(1, draft.value.split("\n").length)))
const editorInputType = computed(() => {
  const col = editing.value ? columnOf(editing.value.column) : undefined
  return col?.type === "number" ? "number" : "text"
})

const startEdit = (row: number, column: string, initial?: string) => {
  if (props.readonly) return
  const col = columnOf(column)
  if (!col?.editable) return
  const raw = state.value[row]?.[column]
  draft.value =
    initial ??
    (typeof raw === "string" && raw.startsWith("=") ? raw : String(raw ?? ""))
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
  // L'éditeur de formule s'élargit avec le draft (monospace ≈ 7.6px/car),
  // sans dépasser le bord droit du conteneur.
  const formulaW = isFormulaDraft.value
    ? Math.min(480, Math.max(180, draft.value.length * 7.6 + 30))
    : 0
  const left = tr.left - sc.left + scrollEl.value.scrollLeft
  const maxW = sc.width - (tr.left - sc.left) - 4
  editorStyle.value = {
    left: left + "px",
    top: tr.top - sc.top + scrollEl.value.scrollTop + "px",
    width: Math.min(maxW, Math.max(tr.width, formulaW)) + "px",
    minHeight: tr.height + "px",
  }
  nextTick(() => {
    ;(isFormulaDraft.value ? editAreaEl.value : editInputEl.value)?.focus()
  })
}

const cancelEdit = () => {
  if (!editing.value) return
  const cell = { ...editing.value }
  editing.value = null
  emit("cell-edit-end", { ...cell, canceled: true })
  nextTick(focusCell)
}

const commitEdit = () => {
  if (!editing.value) return
  const { row, column } = editing.value
  const col = columnOf(column)
  const old = state.value[row]?.[column]
  const text = draft.value
  let next: any
  if (text.trim() === "") next = null
  else if (text.startsWith("=") && col?.allowFormulas) next = text
  else if (col?.type === "number") {
    const n = Number(text)
    next = Number.isNaN(n) ? old : n
  } else if (col?.type === "boolean") {
    next = text === "true" ? true : text === "false" ? false : old
  } else next = text

  editing.value = null
  emit("cell-edit-end", { row, column, canceled: false })
  nextTick(focusCell)

  if (next !== old) {
    const nextRow = { ...state.value[row], [column]: next }
    const nextRows = [...state.value]
    nextRows[row] = nextRow
    state.value = nextRows
    emit("update:rows", nextRows)
    emit("cell-change", { row, column, oldValue: old, newValue: next, rows: nextRows })
  }
}

const clearCell = (row: number, column: string) => {
  const col = columnOf(column)
  if (!col?.editable || props.readonly) return
  const old = state.value[row]?.[column]
  if (old === null || old === undefined || old === "") return
  const nextRow = { ...state.value[row], [column]: null }
  const nextRows = [...state.value]
  nextRows[row] = nextRow
  state.value = nextRows
  emit("update:rows", nextRows)
  emit("cell-change", { row, column, oldValue: old, newValue: null, rows: nextRows })
}

// ─── Clavier ───
const onKeydown = (e: KeyboardEvent) => {
  if (editing.value || e.defaultPrevented) return
  if (!sel.value.length) return
  const { row, column } = sel.value[0]!
  const col = columnOf(column)
  const colIdx = props.columns.findIndex((c) => c.name === column)

  if (e.key === "ArrowUp") return moveSelection(-1, 0)
  if (e.key === "ArrowDown") return moveSelection(1, 0)
  if (e.key === "ArrowLeft") return moveSelection(0, -1)
  if (e.key === "ArrowRight") return moveSelection(0, 1)
  if (e.key === "Enter" || e.key === "F2") {
    e.preventDefault()
    if (col?.editable && !props.readonly) startEdit(row, column)
    return
  }
  if (e.key === "Tab") {
    e.preventDefault()
    moveSelection(0, 1)
    return
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault()
    clearCell(row, column)
    return
  }
  if ((e.key === "c" || e.key === "C") && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    copySelected()
    return
  }
  // Frappe directe : démarre l'édition
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (col?.editable && !props.readonly) {
      e.preventDefault()
      startEdit(row, column, e.key)
    }
  }
}

const onEditKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    if (isFormulaDraft.value && e.shiftKey) return // retour ligne dans la formule
    e.preventDefault()
    commitEdit()
    moveSelection(1, 0) // Entrée commit puis descend (convention tableur)
  } else if (e.key === "Escape") {
    e.preventDefault()
    cancelEdit()
  } else if (e.key === "Tab") {
    e.preventDefault()
    commitEdit()
    moveSelection(0, 1)
  }
}

// Quand le draft devient une formule (=…), l'éditeur bascule input → textarea :
// le nouveau champ doit reprendre le focus.
watch(isFormulaDraft, () => {
  if (!editing.value) return
  nextTick(() => {
    ;(isFormulaDraft.value ? editAreaEl.value : editInputEl.value)?.focus()
  })
})

const copySelected = async () => {
  if (!sel.value.length) return
  const { row, column } = sel.value[0]!
  const ci = props.columns.findIndex((c) => c.name === column)
  const text = cellText(row, ci)
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* presse-papiers indisponible */
  }
}

const onCellClick = (row: number, column: string) => {
  select(row, column)
  emit("cell-click", { row, column, value: state.value[row]?.[column] })
}

const onScroll = () => {
  if (editing.value) positionEditor()
}

// ─── Styles ───
const effectiveRadius = useRadius("QDataGrid", () => props.radius)

const rootClasses = computed(() =>
  cn(
    "q-data-grid",
    props.flat && "q-data-grid--flat",
    props.bordered && "q-data-grid--bordered",
    props.dark && "q-data-grid--dark",
    props.dense && "q-data-grid--dense",
    `q-data-grid--separator-${props.separator}`,
  ),
)

const cellClasses = (r: number, col: QDataGridColumn, c: number) =>
  cn(
    "q-data-grid__cell",
    col.type === "number" && "q-data-grid__cell--number",
    col.align === "center" && "q-table__cell--align-center",
    col.align === "right" && "q-table__cell--align-right",
    isError(cellValue(r, c)) && "q-data-grid__cell--error",
    isSelected(r, col.name) && "q-data-grid__cell--selected",
    editing.value?.row === r && editing.value?.column === col.name && "q-data-grid__cell--editing",
  )

const colWidth = (col: QDataGridColumn) =>
  col.width === undefined ? undefined : typeof col.width === "number" ? col.width + "px" : col.width

const heightCss = computed(() =>
  typeof props.height === "number" ? props.height + "px" : props.height,
)
</script>

<template>
  <div class="q-data-grid" :class="rootClasses" :style="radiusStyle(effectiveRadius)">
    <div
      ref="scrollEl"
      class="q-data-grid__scroll"
      :style="{ height: heightCss }"
      @scroll="onScroll"
      @keydown="onKeydown"
    >
      <table class="q-table__table q-data-grid__table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.name"
              :class="[col.headerClass, headerClass]"
              :style="[{ width: colWidth(col) }, col.headerStyle, headerStyle]"
            >
              {{ col.label ?? col.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, r) in state" :key="r">
            <td
              v-for="(col, c) in columns"
              :key="col.name"
              :data-row="r"
              :data-col="col.name"
              :tabindex="isSelected(r, col.name) ? 0 : -1"
              :class="cellClasses(r, col, c)"
              :title="cellTitle(r, c)"
              @click="onCellClick(r, col.name)"
              @dblclick="startEdit(r, col.name)"
            >
              {{ cellText(r, c) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="editing"
        ref="editorEl"
        class="q-data-grid__editor"
        :class="{ 'q-data-grid__editor--formula': isFormulaDraft }"
        :style="editorStyle"
        @mousedown.stop
      >
        <textarea
          v-if="isFormulaDraft"
          ref="editAreaEl"
          v-model="draft"
          :rows="draftLines"
          spellcheck="false"
          @keydown.stop="onEditKeydown"
          @blur="commitEdit"
        />
        <input
          v-else
          ref="editInputEl"
          v-model="draft"
          :type="editorInputType"
          @keydown.stop="onEditKeydown"
          @blur="commitEdit"
        />
      </div>
    </div>
  </div>
</template>
