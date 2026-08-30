<script lang="ts">
// QTable — API Quasar : <q-table :rows :columns row-key="id" v-model:pagination v-model:selected selection="multiple" @request @row-click />
// Architecture type shadcn-vue data table : colonnes déclaratives, tri client, pagination, sélection.
export interface QTableColumn {
  name?: string
  label?: string
  /** Chemin dans la ligne : string, tableau de chemins, ou fonction */
  field?: string | string[] | ((row: any) => any)
  align?: "left" | "center" | "right"
  sortable?: boolean
  /** Tri custom (a, b) => nombre */
  sort?: (a: any, b: any) => number
  /** Formatteur de la valeur affichée */
  format?: (val: any, row: any) => any
  /** Colonne épinglée (sticky) : left | right — ex. colonne Actions */
  pinned?: "left" | "right"
  classes?: string
  style?: string
  headerClasses?: string
  headerStyle?: string
}

export interface QTablePagination {
  sortBy: string | null
  descending: boolean
  page: number
  rowsPerPage: number
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  /** Lignes de données */
  rows?: any[]
  /** Colonnes ({ name, label, field, align, sortable, sort, format, classes, style, headerClasses, headerStyle }) */
  columns?: QTableColumn[]
  /** Clé de ligne : string (propriété) ou fonction (défaut "id") */
  rowKey?: string | ((row: any) => any)
  /** Pagination contrôlée (v-model:pagination) */
  pagination?: QTablePagination | null
  /** Lignes sélectionnées (v-model:selected) */
  selected?: any[]
  /** Type de sélection */
  selection?: "none" | "single" | "multiple"
  /** Hauteur réduite */
  dense?: boolean
  /** Sans ombre */
  flat?: boolean
  /** Bordure */
  bordered?: boolean
  /** Séparateurs : horizontal | vertical | cell | none */
  separator?: "horizontal" | "vertical" | "cell" | "none"
  /** Overlay de chargement */
  loading?: boolean
  title?: string
  noDataLabel?: string
  dark?: boolean
  hideHeader?: boolean
  hideBottom?: boolean
  /** Options du sélecteur de lignes par page (0 = toutes) */
  rowsPerPageOptions?: number[]
  /** Hauteur max du conteneur scrollable (header fixe) — ex. "60vh", "400px" */
  maxHeight?: string
  /** Header sticky quand max-height est défini (défaut : true) */
  fixedHeader?: boolean
  /** Virtualisation (windowing) des lignes pour les gros jeux de données */
  virtualScroll?: boolean
  /** Hauteur estimée d'une ligne pour la virtualisation (px) */
  virtualScrollItemSize?: number
  /** Classe CSS appliquée à toutes les cellules d'en-tête */
  headerClass?: string
  /** Style CSS appliqué à toutes les cellules d'en-tête (ex. couleur de fond) */
  headerStyle?: string
  /** Coins arrondis : true = md, ou échelle xs|sm|md|lg (none = carré) — défaut : composantProps */
  radius?: RadiusProp
  tableClass?: string
  tableStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  columns: () => [],
  rowKey: "id",
  pagination: null,
  selected: undefined,
  selection: "none",
  dense: false,
  flat: false,
  bordered: false,
  separator: "horizontal",
  loading: false,
  noDataLabel: "No data available",
  dark: false,
  hideHeader: false,
  hideBottom: false,
  rowsPerPageOptions: () => [3, 5, 7, 10, 15, 20, 25, 50, 0],
  maxHeight: "",
  fixedHeader: true,
  virtualScroll: false,
  virtualScrollItemSize: 48,
  headerClass: "",
  headerStyle: "",
  tableClass: "",
  tableStyle: "",
})

const emit = defineEmits<{
  "update:pagination": [value: QTablePagination]
  "update:selected": [value: any[]]
  "update:sorting": [value: { column: string; descending: boolean }]
  request: [payload: { pagination: QTablePagination; getCellValue: (col: QTableColumn, row: any) => any }]
  "row-click": [event: MouseEvent, row: any, index: number]
}>()

defineSlots<{
  top?: (props: Record<string, any>) => any
  bottom?: (props: Record<string, any>) => any
  noData?: (props: Record<string, any>) => any
  loading?: (props: Record<string, any>) => any
  header?: (props: Record<string, any>) => any
  body?: (props: Record<string, any>) => any
}>()

const instance = getCurrentInstance()
const hasRequestHandler = computed(() => !!instance?.vnode.props?.onRequest)

// — Pagination (interne, synchronisée avec v-model:pagination) —
const internalPagination = ref<QTablePagination>({ sortBy: null, descending: false, page: 1, rowsPerPage: 0 })
const pagination = computed(() => props.pagination ?? internalPagination.value)

watch(
  () => props.pagination,
  (v) => {
    if (v) internalPagination.value = { ...internalPagination.value, ...v }
  },
)

const setPagination = (patch: Partial<QTablePagination>) => {
  internalPagination.value = { ...pagination.value, ...patch }
  emit("update:pagination", internalPagination.value)
}

const page = computed({
  get: () => pagination.value.page,
  set: (v) => setPagination({ page: v }),
})
const rowsPerPage = computed({
  get: () => pagination.value.rowsPerPage,
  set: (v) => setPagination({ page: 1, rowsPerPage: v }),
})
const sortBy = computed(() => pagination.value.sortBy)
const descending = computed(() => pagination.value.descending)

// — Valeurs de cellule —
const getValue = (row: any, field: QTableColumn["field"]): any => {
  if (typeof field === "function") return field(row)
  if (Array.isArray(field)) return field.reduce((acc, k) => acc?.[k], row)
  return field ? row?.[field] : undefined
}
const getCellValue = (col: QTableColumn, row: any): any => {
  const val = getValue(row, col.field)
  return col.format ? col.format(val, row) : val
}

const getRowKey = (row: any, index: number): unknown => {
  if (typeof props.rowKey === "function") return props.rowKey(row)
  return row?.[props.rowKey] ?? index
}

const colName = (col: QTableColumn): string => col.name ?? (typeof col.field === "string" ? col.field : "")

// Nom de slot dynamique body-cell-<name> : cast vers l'union des noms pour satisfaire le typage VLS
const bodyCellSlot = (col: QTableColumn): "top" | "bottom" | "noData" | "loading" | "header" | "body" =>
  `body-cell-${colName(col)}` as "top" | "bottom" | "noData" | "loading" | "header" | "body"

// — Tri client (sauté si @request est branché : mode serveur) —
const sortedRows = computed(() => {
  if (hasRequestHandler.value) return props.rows
  const col = sortBy.value ? props.columns.find((c) => colName(c) === sortBy.value) : null
  if (!col?.sortable) return props.rows
  const dir = descending.value ? -1 : 1
  return [...props.rows].sort((a, b) => {
    if (col.sort) return dir * col.sort(a, b)
    const va = getValue(a, col.field)
    const vb = getValue(b, col.field)
    if (va === vb) return 0
    return (va > vb ? 1 : -1) * dir
  })
})

const pageCount = computed(() =>
  rowsPerPage.value > 0 ? Math.max(1, Math.ceil(sortedRows.value.length / rowsPerPage.value)) : 1,
)

const pagedRows = computed(() => {
  if (hasRequestHandler.value || rowsPerPage.value === 0) return sortedRows.value
  const start = (page.value - 1) * rowsPerPage.value
  return sortedRows.value.slice(start, start + rowsPerPage.value)
})

// @request (mode serveur) : émis à chaque changement de pagination/tri/lignes
watch(
  [() => pagination.value, () => props.rows],
  () => {
    if (hasRequestHandler.value) emit("request", { pagination: pagination.value, getCellValue })
  },
)

const onSort = (col: QTableColumn) => {
  const name = colName(col)
  const nextDesc = sortBy.value === name ? !descending.value : false
  setPagination({ sortBy: name, descending: nextDesc, page: 1 })
  emit("update:sorting", { column: name, descending: nextDesc })
}

const sortIcon = (col: QTableColumn) => {
  if (colName(col) !== sortBy.value) return icons.arrowUpDown
  return descending.value ? icons.arrowDown : icons.arrowUp
}

// — Sélection —
const selectedRows = computed(() => props.selected ?? [])
const isSelected = (row: any, index: number) =>
  selectedRows.value.some((r) => getRowKey(r, index) === getRowKey(row, index))

const toggleSelect = (row: any, index: number) => {
  if (props.selection === "single") {
    emit("update:selected", isSelected(row, index) ? [] : [row])
    return
  }
  const next = isSelected(row, index)
    ? selectedRows.value.filter((r) => getRowKey(r, index) !== getRowKey(row, index))
    : [...selectedRows.value, row]
  emit("update:selected", next)
}

const allSelected = computed(
  () => pagedRows.value.length > 0 && pagedRows.value.every((r, i) => isSelected(r, i)),
)

// Sélection partielle (header en état indéterminé)
const someSelected = computed(() => {
  if (allSelected.value) return false
  return pagedRows.value.some((r, i) => isSelected(r, i))
})

const toggleAll = () => {
  if (allSelected.value) {
    const keys = new Set(pagedRows.value.map((r, i) => String(getRowKey(r, i))))
    emit("update:selected", selectedRows.value.filter((r, i) => !keys.has(String(getRowKey(r, i)))))
  }
  else {
    const seen = new Set(selectedRows.value.map((r, i) => String(getRowKey(r, i))))
    emit("update:selected", [...selectedRows.value, ...pagedRows.value.filter((r, i) => !seen.has(String(getRowKey(r, i))))])
  }
}

const onRowClick = (e: MouseEvent, row: any, index: number) => {
  if (props.selection === "single" && !isSelected(row, index)) {
    emit("update:selected", [row])
  }
  emit("row-click", e, row, index)
}

// — Rendu —
const alignClass = (col: QTableColumn) =>
  col.align && col.align !== "left" ? `q-table__cell--align-${col.align}` : ""

// Une colonne épinglee à gauche → la colonne de sélection s'épingle aussi (offset 0)
const hasPinnedLeft = computed(() => props.columns.some((c) => c.pinned === "left"))
const pinnedLeftOffset = computed(() => (props.selection !== "none" ? 36 : 0))

const colspan = computed(() => props.columns.length + (props.selection !== "none" ? 1 : 0))

const rangeLabel = computed(() => {
  const total = sortedRows.value.length
  if (rowsPerPage.value === 0 || total === 0) return `1-${total} of ${total}`
  const first = (page.value - 1) * rowsPerPage.value + 1
  const last = Math.min(page.value * rowsPerPage.value, total)
  return `${first}-${last} of ${total}`
})

const tableClasses = computed(() =>
  cn(
    "q-table",
    props.dense && "q-table--dense",
    props.flat && "q-table--flat",
    props.bordered && "q-table--bordered",
    props.dark && "q-table--dark",
    `q-table--separator-${props.separator}`,
  ),
)

// radius : prop explicite > composantProps.QTable.radius > composantProps.default.radius
const effectiveRadius = useRadius("QTable", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const sortThClass = computed(() => "q-table__sort")

// — Header fixe & virtual scroll —
const scrollEl = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewportH = ref(0)

const onScroll = () => {
  const el = scrollEl.value
  if (!el) return
  scrollTop.value = el.scrollTop
  viewportH.value = el.clientHeight
}

onMounted(() => {
  onScroll()
  if (typeof window !== "undefined") window.addEventListener("resize", onScroll)
})
onBeforeUnmount(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", onScroll)
})

// Window sur les lignes visibles (spacers haut/bas + buffer)
const VIRTUAL_OVERSCAN = 6
const virtual = computed(() => {
  const total = pagedRows.value.length
  if (!props.virtualScroll || total === 0)
    return { start: 0, rows: pagedRows.value, top: 0, bottom: 0 }
  const rowH = Math.max(1, props.virtualScrollItemSize)
  const start = Math.max(0, Math.floor(scrollTop.value / rowH) - VIRTUAL_OVERSCAN)
  const end = Math.min(
    total,
    Math.ceil((scrollTop.value + Math.max(viewportH.value, 1)) / rowH) + VIRTUAL_OVERSCAN,
  )
  return {
    start,
    rows: pagedRows.value.slice(start, end),
    top: start * rowH,
    bottom: (total - end) * rowH,
  }
})
</script>

<template>
  <div class="q-table" :class="tableClasses" :style="roundedStyle">
    <div v-if="title || $slots.top" class="q-table__top">
      <slot name="top">
        <h3 v-if="title" class="q-table__title">{{ title }}</h3>
      </slot>
    </div>

    <div
      ref="scrollEl"
      class="q-table__scroll"
      :class="{ 'q-table__scroll--fixed-header': !!maxHeight && fixedHeader }"
      :style="maxHeight ? { maxHeight } : undefined"
      @scroll.passive="onScroll"
    >
      <table class="q-table__table" :class="tableClass" :style="tableStyle">
        <thead v-if="!hideHeader">
          <slot name="header">
            <tr>
              <th
                v-if="selection === 'multiple'"
                class="q-table__selection-col"
                :class="{ 'q-table__cell--pinned-left': hasPinnedLeft }"
              >
                <q-checkbox
                  :model-value="allSelected ? true : someSelected ? 'mixed' : false"
                  indeterminate-value="mixed"
                  dense
                  aria-label="Tout sélectionner"
                  @update:model-value="toggleAll"
                />
              </th>
              <th
                v-for="col in columns"
                :key="colName(col)"
                :class="[
                  alignClass(col),
                  col.sortable && sortThClass,
                  headerClass,
                  col.headerClasses,
                  col.pinned === 'left' && 'q-table__cell--pinned-left',
                  col.pinned === 'right' && 'q-table__cell--pinned-right',
                ]"
                :style="[
                  col.headerStyle,
                  headerStyle,
                  col.pinned === 'left' ? { left: `${pinnedLeftOffset}px` } : null,
                ]"
              >
                <button
                  v-if="col.sortable"
                  type="button"
                  class="q-table__sort-btn"
                  @click="onSort(col)"
                >
                  <span>{{ col.label }}</span>
                  <Icon :icon="sortIcon(col)" class="q-table__sort-icon" aria-hidden="true" />
                </button>
                <span v-else>{{ col.label }}</span>
              </th>
            </tr>
          </slot>
        </thead>

        <!-- Virtual scroll : spacers + fenêtre de lignes visibles -->
        <tbody v-if="virtualScroll && !$slots.body">
          <tr class="q-table__spacer" aria-hidden="true" :style="{ height: `${virtual.top}px` }">
            <td :colspan="colspan" />
          </tr>
          <tr
            v-for="(row, vi) in virtual.rows"
            :key="String(getRowKey(row, virtual.start + vi))"
            @click="(e: MouseEvent) => onRowClick(e, row, virtual.start + vi)"
          >
            <td
              v-if="selection === 'multiple'"
              class="q-table__selection-col"
              :class="{ 'q-table__cell--pinned-left': hasPinnedLeft }"
              @click.stop
            >
              <q-checkbox
                :model-value="isSelected(row, virtual.start + vi)"
                dense
                :aria-label="'Sélectionner la ligne ' + (virtual.start + vi + 1)"
                @update:model-value="() => toggleSelect(row, virtual.start + vi)"
              />
            </td>
            <td
              v-else-if="selection === 'single'"
              class="q-table__selection-col"
              :class="{ 'q-table__cell--pinned-left': hasPinnedLeft }"
              @click.stop
            >
              <q-radio
                :model-value="isSelected(row, virtual.start + vi)"
                dense
                :aria-label="'Sélectionner la ligne ' + (virtual.start + vi + 1)"
                @update:model-value="() => toggleSelect(row, virtual.start + vi)"
              />
            </td>
            <td
              v-for="col in columns"
              :key="colName(col)"
              :class="[
                alignClass(col),
                col.classes,
                col.pinned === 'left' && 'q-table__cell--pinned-left',
                col.pinned === 'right' && 'q-table__cell--pinned-right',
              ]"
              :style="[col.style, col.pinned === 'left' ? { left: `${pinnedLeftOffset}px` } : null]"
            >
              <slot
                :name="bodyCellSlot(col)"
                :col="col"
                :row="row"
                :index="virtual.start + vi"
                :value="getCellValue(col, row)"
              >
                {{ getCellValue(col, row) }}
              </slot>
            </td>
          </tr>
          <tr class="q-table__spacer" aria-hidden="true" :style="{ height: `${virtual.bottom}px` }">
            <td :colspan="colspan" />
          </tr>
        </tbody>

        <tbody v-else-if="!$slots.body">
        <tr
          v-for="(row, rIdx) in pagedRows"
          :key="String(getRowKey(row, rIdx))"
          @click="(e: MouseEvent) => onRowClick(e, row, rIdx)"
        >
          <td
            v-if="selection === 'multiple'"
            class="q-table__selection-col"
            :class="{ 'q-table__cell--pinned-left': hasPinnedLeft }"
            @click.stop
          >
            <q-checkbox
              :model-value="isSelected(row, rIdx)"
              dense
              :aria-label="'Sélectionner la ligne ' + (rIdx + 1)"
              @update:model-value="() => toggleSelect(row, rIdx)"
            />
          </td>
          <td
            v-else-if="selection === 'single'"
            class="q-table__selection-col"
            :class="{ 'q-table__cell--pinned-left': hasPinnedLeft }"
            @click.stop
          >
            <q-radio
              :model-value="isSelected(row, rIdx)"
              dense
              :aria-label="'Sélectionner la ligne ' + (rIdx + 1)"
              @update:model-value="() => toggleSelect(row, rIdx)"
            />
          </td>
          <td
            v-for="col in columns"
            :key="colName(col)"
            :class="[
              alignClass(col),
              col.classes,
              col.pinned === 'left' && 'q-table__cell--pinned-left',
              col.pinned === 'right' && 'q-table__cell--pinned-right',
            ]"
            :style="[col.style, col.pinned === 'left' ? { left: `${pinnedLeftOffset}px` } : null]"
          >
            <slot :name="bodyCellSlot(col)" :col="col" :row="row" :index="rIdx" :value="getCellValue(col, row)">
              {{ getCellValue(col, row) }}
            </slot>
          </td>
        </tr>
        <tr v-if="pagedRows.length === 0" class="q-table__no-data">
          <td :colspan="colspan">
            <slot name="noData">{{ noDataLabel }}</slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <slot name="body" :rows="pagedRows" />
      </tbody>
      </table>
    </div>

    <div v-if="loading" class="q-table__loading">
      <slot name="loading">
        <span class="q-spinner-ring" aria-hidden="true" />
      </slot>
    </div>

    <div v-if="!hideBottom" class="q-table__bottom">
      <slot name="bottom" />
      <div class="q-table__pagination">
        <span class="q-table__range">{{ rangeLabel }}</span>
        <label class="q-table__rows-select">
          Rows per page
          <select :value="rowsPerPage" @change="(e) => (rowsPerPage = Number((e.target as HTMLSelectElement).value))">
            <option v-for="n in rowsPerPageOptions" :key="n" :value="n">{{ n === 0 ? 'All' : n }}</option>
          </select>
        </label>
        <div class="q-table__page-nav">
          <button
            type="button"
            class="q-table__nav-btn"
            :disabled="page <= 1"
            aria-label="Page précédente"
            @click="page--"
          >
            ‹
          </button>
          <span class="q-table__page">{{ page }} / {{ pageCount }}</span>
          <button
            type="button"
            class="q-table__nav-btn"
            :disabled="page >= pageCount"
            aria-label="Page suivante"
            @click="page++"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
