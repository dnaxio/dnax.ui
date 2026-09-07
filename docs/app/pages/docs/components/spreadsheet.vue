<script setup lang="ts">
// Spreadsheet — documentation du composant QSpreadsheet :
// tableur type Excel (grille éditable) — sélection, édition, lignes/colonnes,
// tri, copier/coller, undo/redo, cellules typées avec badges colorés.
import { computed, onMounted, ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const spreadsheet = useComponent(() => "QSpreadsheet")
const spreadsheetSource = componentSource("QSpreadsheet")
const tag = componentTag("QSpreadsheet")

// — Démo « People » : select chips + booléen (modify records) —
const peopleColumns = [
  { name: "firstName", label: "First name", width: 110 },
  { name: "lastName", label: "Last name", width: 120 },
  {
    name: "department",
    label: "Department",
    type: "select" as const,
    chip: true,
    width: 150,
    options: [
      { value: "management", label: "Management", color: "#fee2e2" },
      { value: "sales", label: "Sales", color: "#dbeafe" },
      { value: "operations", label: "Operations", color: "#dcfce7" },
      { value: "it", label: "IT", color: "#ede9fe" },
      { value: "finance", label: "Finance", color: "#fef9c3" },
    ],
  },
  { name: "active", label: "Active", type: "boolean" as const, width: 90 },
]

const peopleRows = ref([
  { firstName: "John", lastName: "Doe", department: "management", active: true },
  { firstName: "Jane", lastName: "Smith", department: "sales", active: true },
  { firstName: "Bob", lastName: "Johnson", department: "operations", active: false },
  { firstName: "Alice", lastName: "Brown", department: "it", active: true },
  { firstName: "Charlie", lastName: "Davis", department: "finance", active: false },
  { firstName: "Emma", lastName: "Wilson", department: "sales", active: true },
  { firstName: "David", lastName: "Lee", department: "operations", active: true },
  { firstName: "Grace", lastName: "Martin", department: "management", active: false },
  { firstName: "Hank", lastName: "Garcia", department: "it", active: true },
  { firstName: "Ivy", lastName: "Clark", department: "finance", active: true },
  { firstName: "Jack", lastName: "Rodriguez", department: "sales", active: false },
])

const usagePeople = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="320px"
  bordered
/>`

const scriptPeople = `import { ref } from "vue"

const columns = [
  { name: "firstName", label: "First name", width: 110 },
  { name: "lastName", label: "Last name", width: 120 },
  {
    name: "department",
    label: "Department",
    type: "select",
    chip: true,
    width: 150,
    options: [
      { value: "management", label: "Management", color: "#fee2e2" },
      { value: "sales", label: "Sales", color: "#dbeafe" },
      { value: "operations", label: "Operations", color: "#dcfce7" },
      { value: "it", label: "IT", color: "#ede9fe" },
      { value: "finance", label: "Finance", color: "#fef9c3" },
    ],
  },
  { name: "active", label: "Active", type: "boolean", width: 90 },
]

const rows = ref([
  { firstName: "John", lastName: "Doe", department: "management", active: true },
  // …
])`

// — Exemple n°1 : édition inline —
const inlineColumns = [
  { name: "firstName", label: "First name", width: 130, editable: true },
  { name: "lastName", label: "Last name", width: 140, editable: true },
  { name: "age", label: "Age", type: "integer" as const, width: 90, editable: true },
]
const inlineRows = ref([
  { firstName: "Ada", lastName: "Lovelace", age: 36 },
  { firstName: "Grace", lastName: "Hopper", age: 85 },
  { firstName: "Alan", lastName: "Turing", age: 41 },
])
const inlineLog = ref("")
const onInlineChange = (e: any) => {
  inlineLog.value =
    e.column + " (row " + (e.row + 1) + "): " + JSON.stringify(e.oldValue) + " → " + JSON.stringify(e.newValue)
}
const usageInline = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="200px"
  bordered
  @cell-change="log = …"
/>`
const scriptInline = `import { ref } from "vue"

const columns = [
  { name: "firstName", label: "First name", editable: true },
  { name: "lastName", label: "Last name", editable: true },
  { name: "age", label: "Age", type: "integer", editable: true },
]

const rows = ref([
  { firstName: "Ada", lastName: "Lovelace", age: 36 },
  { firstName: "Grace", lastName: "Hopper", age: 85 },
])`

// — Démo types : nombre, date, booléen, textes —
const typesColumns = [
  { name: "product", label: "Product", width: 150 },
  {
    name: "category",
    label: "Category",
    type: "select" as const,
    chip: true,
    width: 140,
    options: [
      { value: "tea", label: "Tea", color: "positive" },
      { value: "beer", label: "Beer", color: "warning" },
      { value: "condiment", label: "Condiment", color: "info" },
      { value: "seafood", label: "Seafood", color: "accent" },
    ],
  },
  {
    name: "price",
    label: "Price",
    type: "number" as const,
    width: 110,
    format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)),
  },
  {
    name: "stock",
    label: "Stock",
    type: "integer" as const,
    width: 90,
  },
  { name: "inStock", label: "In stock", type: "boolean" as const, width: 90 },
  {
    name: "email",
    label: "Email",
    type: "email" as const,
    width: 220,
  },
  {
    name: "website",
    label: "Website",
    type: "url" as const,
    width: 210,
  },
  {
    name: "bestBefore",
    label: "Best before",
    type: "date" as const,
    width: 150,
  },
  {
    name: "lastCheck",
    label: "Last check",
    type: "datetime" as const,
    width: 170,
    format: (v: any) =>
      v == null || v === ""
        ? ""
        : new Date(v).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          }),
  },
]

const typesRows = ref([
  { product: "Chai", category: "tea", price: 18, stock: 39, inStock: true, email: "hello@dnax.dev", website: "https://dnax.dev", bestBefore: "2026-12-31", lastCheck: "2026-09-07T09:30" },
  { product: "Chang", category: "beer", price: 19, stock: 17, inStock: true, email: "beer@dnax.dev", website: "https://example.com", bestBefore: "2026-09-30", lastCheck: "2026-09-06T14:05" },
  { product: "Aniseed Syrup", category: "condiment", price: 10, stock: 13, inStock: false, email: "sales@dnax.dev", website: "https://example.org", bestBefore: "2027-06-30", lastCheck: "2026-09-01T08:45" },
  { product: "Ikura", category: "seafood", price: 31, stock: 0, inStock: false, email: "fish@dnax.dev", website: "https://example.net", bestBefore: "2026-11-15", lastCheck: "2026-08-28T16:20" },
  { product: "Mishi Kobe Niku", category: "seafood", price: 97, stock: 29, inStock: true, email: "mishi@dnax.dev", website: "https://dnax.dev/blog", bestBefore: "2026-08-20", lastCheck: "2026-08-20T11:10" },
])

const usageTypes = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="250px"
  bordered
  default-col-width="120"
/>`

const scriptTypes = `import { ref } from "vue"

const columns = [
  { name: "product", label: "Product", width: 150 },
  { name: "category", label: "Category", type: "select", chip: true, options: [ /* … */ ] },
  { name: "price", label: "Price", type: "number", format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "stock", label: "Stock", type: "integer" },
  { name: "inStock", label: "In stock", type: "boolean" },
  { name: "bestBefore", label: "Best before", type: "date" },
  { name: "lastCheck", label: "Last check", type: "datetime", format: (v) => (v ? new Date(v).toLocaleString() : "") },
]

const rows = ref([
  { product: "Chai", category: "tea", price: 18, stock: 39, inStock: true, bestBefore: "2026-12-31", lastCheck: "2026-09-07T09:30" },
  // …
])`

// — Formules A1 (calculs en cellule + barre fx) —
const formulaColumns = [
  { name: "item", label: "Item", width: 140 },
  { name: "qty", label: "Qty", type: "integer" as const, width: 80 },
  { name: "price", label: "Price", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "total", label: "Total", type: "number" as const, width: 130, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "share", label: "Share", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : Math.round(Number(v) * 100) + "%") },
]

const formulaRows = ref([
  { item: "Apples", qty: 6, price: 1.5, total: "=B1*C1", share: "=D1/$D$5" },
  { item: "Bananas", qty: 12, price: 0.4, total: "=B2*C2", share: "=D2/$D$5" },
  { item: "Cherries", qty: 30, price: 0.25, total: "=B3*C3", share: "=D3/$D$5" },
  { item: "Dates", qty: 8, price: 3, total: "=B4*C4", share: "=D4/$D$5" },
  { item: "Total", qty: null, price: null, total: "=SUM(D1:D4)", share: "=SUM(E1:E4)" },
])

const usageFormulas = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="260px"
  bordered
/>

<!--
  Type a formula in the Total / Share columns (or the fx bar above the grid):
  =B1*C1, =SUM(D1:D4), =D1/$D$5, =IF(C1>10,"big","small")…
  Formulas recalculate live; hover a cell to see its source.
-->`

const scriptFormulas = `import { ref } from "vue"

const columns = [
  { name: "item", label: "Item", width: 140 },
  { name: "qty", label: "Qty", type: "integer", width: 80 },
  { name: "price", label: "Price", type: "number", format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "total", label: "Total", type: "number", format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "share", label: "Share", type: "number", format: (v) => (v == null ? "" : Math.round(Number(v) * 100) + "%") },
]

const rows = ref([
  { item: "Apples", qty: 6, price: 1.5, total: "=B1*C1", share: "=D1/$D$5" },
  // …
])`

// — Menu contextuel, formatage & autofill —
const opsColumns = [
  { name: "item", label: "Item", width: 140 },
  { name: "qty", label: "Qty", type: "integer" as const, width: 80 },
  { name: "price", label: "Price", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "start", label: "Start", type: "date" as const, width: 140 },
]
const opsRows = ref([
  { item: "Design", qty: 1, price: 1200, start: "2026-09-01" },
  { item: "Build", qty: 2, price: 800, start: "2026-09-02" },
  { item: "Ship", qty: 3, price: 300, start: "2026-09-03" },
  { item: "", qty: null, price: null, start: null },
  { item: "", qty: null, price: null, start: null },
])
const usagePower = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="240px"
  bordered
/>

<!--
  • Right-click a cell / row number / column letter for the context menu:
    cut/copy/paste, insert & delete rows/columns, sort, bold/italic, fill and
    text colors, clear formatting.
  • Drag the small square at the bottom-right of the selection to fill
    down/right: numbers and dates with two seed cells create a series
    (1, 2, 3…), anything else is copied (formulas shift their A1 refs).
  • Drag a row number's bottom edge to resize the row height.
-->`

// — Filtres & freeze panes —
const filterCols = [
  { name: "name", label: "Employee", width: 140 },
  {
    name: "dept",
    label: "Department",
    type: "select" as const,
    chip: true,
    width: 150,
    options: [
      { value: "management", label: "Management", color: "#fee2e2" },
      { value: "sales", label: "Sales", color: "#dbeafe" },
      { value: "operations", label: "Operations", color: "#dcfce7" },
      { value: "it", label: "IT", color: "#ede9fe" },
      { value: "finance", label: "Finance", color: "#fef9c3" },
    ],
  },
  { name: "level", label: "Level", type: "integer" as const, width: 80 },
  { name: "active", label: "Active", type: "boolean" as const, width: 90 },
]
const filterDepts = ["management", "sales", "operations", "it", "finance"]
const filterRows = ref(
  Array.from({ length: 34 }, (_, i) => ({
    name: "Employee " + (i + 1),
    dept: filterDepts[i % filterDepts.length]!,
    level: (i % 6) + 1,
    active: i % 3 !== 0,
  })),
)
const usageFilter = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="260px"
  bordered
/>`

// La démo filtre démarre pré-appliquée (IT) pour montrer l'effet immédiatement
const filterDemo = ref()
const opsDemo = ref()
onMounted(() => {
  filterDemo.value?.setFilterOnly?.("dept", ["it"])
  // Pré-formatage visible sur la 1re ligne de la démo clic-droit
  const ops = opsDemo.value
  if (ops && typeof ops.select === "function" && typeof ops.setBgColorSelection === "function") {
    ops.select(0, "item")
    ops.setBgColorSelection("#dbeafe")
    ops.select(0, "qty")
    ops.setBgColorSelection("#fef9c3")
    ops.select(1, "item")
    ops.setBgColorSelection("#dcfce7")
    ops.select(0, "item")
  }
})
const usageFreeze = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="240px"
  :frozen-rows="1"
  :frozen-cols="1"
  bordered
/>

<!--
  Click the funnel icon in a column header to filter (auto-applied,
  keyboard-safe). With :frozen-rows / :frozen-cols the first rows / columns
  stay pinned while you scroll.
-->`

// — Gros volume (virtualisation) —
const bigCols = [
  { name: "id", label: "ID", type: "integer" as const, width: 80 },
  { name: "label", label: "Label", width: 190 },
  { name: "value", label: "Value", type: "number" as const, width: 120, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "on", label: "On", type: "boolean" as const, width: 90 },
]
const bigRows = ref(
  Array.from({ length: 2000 }, (_, i) => ({
    id: i + 1,
    label: "Row " + (i + 1),
    value: (i % 97) * 1.5,
    on: i % 2 === 0,
  })),
)
const usageBig = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="40vh"
  bordered
/>

<!-- 2 000 records → seules les lignes visibles sont rendues (virtualisation) -->`

// — Find & Replace + import CSV —
const findDemo = ref()
const importCols = [
  { name: "code", label: "Code", width: 100 },
  { name: "label", label: "Label", width: 240 },
]
const importRows = ref([
  { code: "X1", label: "Nothing imported yet — click the button." },
  { code: "X2", label: "…" },
])
const CSV_SAMPLE = `code,label\nA1,Alpha\nB2,Beta\nC3,Gamma`
const usageFindImport = `<q-spreadsheet
  ref="grid"
  v-model:rows="rows"
  :columns="columns"
  height="200px"
  bordered
/>

<q-btn label="Import sample CSV" @click="grid.importCsv(CSV_SAMPLE, { headers: true })" />

<!--
  • Ctrl+F ou l'icône loupe de la toolbar : Find & Replace (suivant / précédent,
    remplacer un / tout, sensible à la casse non inclus ici).
  • grid.importCsv(text, { delimiter, headers }) remplace la feuille active.
  • grid.copyFormulas() copie les sources, grid.pasteTransposed() colle en
    transposant (lignes ↔ colonnes).
-->`

// — Mise en page, conditional formatting & validation —
const layoutCols = [
  { name: "task", label: "Task", width: 240 },
  { name: "score", label: "Score (0–100)", type: "integer" as const, width: 130, validation: { min: 0, max: 100, integer: true, message: "Score must be an integer between 0 and 100" } },
  { name: "owner", label: "Owner", width: 130 },
]
const layoutRows = ref([
  { task: "Write the release notes (long text to wrap on several lines when Wrap text is on)", score: 92, owner: "Ada" },
  { task: "Run the regression suite", score: 78, owner: "Grace" },
  { task: "Review pull requests", score: 101, owner: "Katherine" },
  { task: "Update the changelog", score: 64, owner: "Margaret" },
  { task: "Plan next sprint", score: 88, owner: "Ada" },
])
const layoutDemo = ref()
const usageLayout = `<q-spreadsheet
  ref="grid"
  v-model:rows="rows"
  :columns="columns"
  height="230px"
  bordered
/>

<!--
  • Right-click a cell → Wrap text, Merge cells, Unmerge, Hide rows/columns.
  • Toolbar icône surligneur → Conditional formatting (règle sur la sélection).
  • colonnes.validation = { min, max, integer, pattern, message } : la saisie
    invalide est refusée et la cellule est marquée en rouge (title = message).
-->`

// — Classeur multi-feuilles & export —
const wbSheets = ref([
  {
    key: "staff",
    name: "Staff",
    columns: [
      { name: "name", label: "Employee", width: 160 },
      {
        name: "dept",
        label: "Department",
        type: "select" as const,
        chip: true,
        width: 140,
        options: [
          { value: "sales", label: "Sales", color: "#dbeafe" },
          { value: "it", label: "IT", color: "#ede9fe" },
          { value: "finance", label: "Finance", color: "#fef9c3" },
        ],
      },
      { name: "score", label: "Score", type: "integer" as const, width: 90 },
    ],
    rows: [
      { name: "Ada Lovelace", dept: "it", score: 9 },
      { name: "Grace Hopper", dept: "it", score: 10 },
      { name: "Katherine J.", dept: "finance", score: 7 },
      { name: "Margaret H.", dept: "sales", score: 8 },
    ],
  },
  {
    key: "budget",
    name: "Budget",
    columns: [
      { name: "item", label: "Item", width: 150 },
      { name: "qty", label: "Qty", type: "integer" as const, width: 80 },
      { name: "price", label: "Price", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
      { name: "total", label: "Total", type: "number" as const, width: 120, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
    ],
    rows: [
      { item: "Servers", qty: 2, price: 1200, total: "=B1*C1" },
      { item: "Licences", qty: 12, price: 90, total: "=B2*C2" },
      { item: "Hosting", qty: 12, price: 30, total: "=B3*C3" },
      { item: "Total", qty: null, price: null, total: "=SUM(D1:D3)" },
    ],
  },
])
const wbRef = ref()
const wbJson = ref("")
const copyWbJson = () => {
  wbJson.value = wbRef.value?.toJSON() ?? ""
}
const usageSheets = `<q-spreadsheet
  v-model:sheets="sheets"
  height="240px"
  bordered
/>

<!--
  • Click a tab to switch sheets; double-click to rename; + adds one.
  • sheets-position="bottom" place les onglets sous la grille (style Excel).
  • Each sheet keeps its own rows, columns, formatting, widths, filters and
    row heights. Switching is live and undo history resets per sheet.
-->`
const usageExport = `<template>
  <q-spreadsheet ref="grid" v-model:sheets="sheets" />
  <q-btn label="JSON" @click="json = grid.toJSON()" />
  <q-btn label="Download CSV" @click="grid.exportCsv()" />
  <q-btn label="Download JSON" @click="grid.exportJson()" />
  <q-btn label="Reload" @click="grid.loadDocument(json)" />
</template>

<!-- expose aussi : getCsv(), activeSheetName (computed via ref) -->`

const scriptSheets = `import { ref } from "vue"

// v-model:sheets — un objet par feuille
const sheets = ref([
  {
    key: "staff",
    name: "Staff",
    columns: [
      { name: "name", label: "Employee", width: 160 },
      {
        name: "dept",
        label: "Department",
        type: "select",
        chip: true,
        options: [
          { value: "sales", label: "Sales", color: "#dbeafe" },
          { value: "it", label: "IT", color: "#ede9fe" },
        ],
      },
      { name: "score", label: "Score", type: "integer" },
    ],
    rows: [
      { name: "Ada Lovelace", dept: "it", score: 9 },
      { name: "Grace Hopper", dept: "it", score: 10 },
    ],
  },
  {
    key: "budget",
    name: "Budget",
    columns: [
      { name: "item", label: "Item" },
      { name: "qty", label: "Qty", type: "integer" },
      { name: "total", label: "Total", type: "number", format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
    ],
    rows: [
      { item: "Servers", qty: 2, total: "=B1*C1" },
    ],
  },
])

// Colonnes et lignes peuvent être omises : la 1re colonne est alors déduite
// des clés des rows, et l'ajout via l'onglet « + » crée une feuille vide.`
const scriptExport = `import { ref } from "vue"

const sheets = ref([ /* … comme ci-dessus … */ ])
const grid = ref()
const json = ref("")

const onLoad = () => grid.value?.loadDocument(json.value)

// toJSON() → chaîne JSON du classeur ; exportCsv()/exportJson() téléchargent ;
// getCsv() renvoie le CSV de la feuille active.`
const eventsCols = [
  { name: "task", label: "Task", width: 220, editable: true },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    chip: true,
    width: 140,
    options: [
      { value: "todo", label: "To do", color: "#e2e8f0" },
      { value: "doing", label: "In progress", color: "#bfdbfe" },
      { value: "done", label: "Done", color: "#bbf7d0" },
    ],
  },
]

const eventsRows = ref([
  { task: "Design the spreadsheet API", status: "done" },
  { task: "Implement cell editing", status: "done" },
  { task: "Write the docs page", status: "doing" },
  { task: "Ship the release", status: "todo" },
])

const log = ref("")
const onCellChange = (e: any) => {
  log.value = `cell-change  ${e.column} (row ${e.row + 1}): ${JSON.stringify(e.oldValue)} → ${JSON.stringify(e.newValue)}`
}
const onSelectionChange = (e: any) => {
  if (!e) return
  log.value = `selection    ${e.rows}×${e.cols} @ row ${e.row + 1} / col ${e.column}`
}
const onStructureChange = (e: any) => {
  log.value = `structure    ${e.reason} — ${e.rows.length} row(s)`
}

const usageEvents = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="230px"
  flat
  @cell-change="log = 'cell-change …'"
  @selection-change="log = 'selection …'"
  @structure-change="log = 'structure …'"
/>`

// — Variantes (toolbar / numéros / en-têtes / dense / readonly) —
const usageVariants = `<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="200px"
  :show-toolbar="false"
  :show-row-numbers="false"
  dense
  flat
  bordered
/>

<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="200px"
  :show-toolbar="false"
  :show-column-headers="false"
  readonly
/>`

const columnsSummary = computed(() => peopleColumns)
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Spreadsheet</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      An Excel-like editable grid: cells are selected (click, <kbd>Shift</kbd>+click,
      drag), navigated with the keyboard and edited in place
      (<kbd>Enter</kbd>/<kbd>F2</kbd>/double-click/type-to-replace). Rows and
      columns can be added or removed from the toolbar, columns sorted and
      resized, and the content copied / pasted with <kbd>Ctrl</kbd>+<kbd>C</kbd> /
      <kbd>Ctrl</kbd>+<kbd>V</kbd> (with undo / redo). Cells are typed:
      <code>string</code> / <code>text</code>, <code>number</code>,
      <code>integer</code>, <code>email</code>, <code>url</code>,
      <code>date</code>, <code>datetime</code>,
      <code>boolean</code> (checkbox) and <code>select</code> — the latter
      renders as <b>colored badges</b> and edits through a filterable option
      list. Cells also support <b>A1 formulas</b> (<code>=SUM(D1:D4)</code>,
      <code>=B1*C1</code>, <code>$D$5</code> absolutes) with a live-recalculated
      value, an in-cell monospace formula editor and an <b>fx bar</b> above the
      grid. Pass <code>v-model:sheets</code> for a <b>multi-sheet workbook</b>
      (tabs, rename, per-sheet state) and use <code>toJSON()</code> /
      <code>exportCsv()</code> to serialize it.
    </p>

    <!-- ═══════ Édition inline (1er exemple) ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Inline editing</h2>
      <p class="doc-note">
        Click a cell (e.g. <b>First name</b>) and start typing to replace its
        content, or press <kbd>Enter</kbd> / <kbd>F2</kbd> / double-click to
        edit it. <kbd>Enter</kbd> commits and moves down, <kbd>Esc</kbd>
        cancels, clicking elsewhere commits. Every change is written back into
        <code>v-model:rows</code> and emitted through
        <code>cell-change</code> (old → new).
      </p>

      <docs-demo :code="usageInline" lang="html" filename="App.vue" :script="scriptInline">
        <q-spreadsheet
          v-model:rows="inlineRows"
          :columns="inlineColumns"
          height="200px"
          bordered
          @cell-change="onInlineChange"
        />
        <p class="demo-p demo-log">Last change: {{ inlineLog || "— double-click Ada's first name" }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ People (badges + booléens) ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">People &amp; colored badges</h2>
      <p class="doc-note">
        Click a cell to select it and drag to select a range (green outline on
        the anchor). Double-click, <kbd>Enter</kbd> or type to edit — the
        Department column (<code>type: "select"</code>, <code>chip</code>) shows
        a badge per option and opens a filterable picker while editing; the
        Active column (<code>type: "boolean"</code>) toggles on click.
        The toolbar adds rows / columns and removes the selected ones.
      </p>

      <docs-demo :code="usagePeople" lang="html" filename="App.vue" :script="scriptPeople">
        <q-spreadsheet
          v-model:rows="peopleRows"
          :columns="columnsSummary"
          height="340px"
          bordered
        />
      </docs-demo>
    </section>

    <!-- ═══════ Types de cellule ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Cell types</h2>
      <p class="doc-note">
        The editor adapts to the column <code>type</code>: <code>string</code>
        / <code>text</code> and <code>email</code> / <code>url</code> open
        dedicated inputs (mobile keyboards, native hints),
        <code>number</code> (decimals, <code>step="any"</code>) and
        <code>integer</code> (whole numbers, coerced with
        <code>Math.trunc</code>) use a numeric input and align right,
        <code>date</code> opens the native date picker,
        <code>datetime</code> the native <code>datetime-local</code> picker,
        <code>boolean</code> renders a checkbox and <code>select</code> +
        <code>chip</code> shows colored badges (pass <code>options</code> with
        <code>label</code> / <code>value</code> / <code>color</code> — a token
        like <code>"positive"</code> or any CSS color). <code>format</code>
        customizes the displayed value without touching the stored one (here:
        prices as <code>$</code>, timestamps localized). For real validation
        (required / regex / range) add <code>validation</code> on the column.
      </p>

      <docs-demo :code="usageTypes" lang="html" filename="App.vue" :script="scriptTypes">
        <q-spreadsheet
          v-model:rows="typesRows"
          :columns="typesColumns"
          height="250px"
          bordered
          :default-col-width="120"
        />
      </docs-demo>
    </section>

    <!-- ═══════ Formules A1 ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Formulas (A1)</h2>
      <p class="doc-note">
        Any editable text / number cell accepts an Excel-style formula: type
        <code>=B1*C1</code>, <code>=SUM(D1:D4)</code>, <code>=D1/$D$5</code>
        (absolute), <code>=IF(C1&gt;10,"big","small")</code>… Formulas are
        stored as-is in the row data, <b>recalculate live</b> on every change
        (memoized, cycle-safe) and errors render in red
        (<code>#DIV/0!</code>, <code>#REF!</code>, <code>#CYCLE!</code>…).
        While editing, the cell opens a <b>monospace editor</b> that grows with
        the source (<kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line); the
        <b>fx bar</b> above the grid shows the active cell's raw value and lets
        you commit one (here: <code>Total</code>, <code>Share</code> with
        <code>$D$5</code> absolute reference).
        <code>Ctrl</code>+<code>C</code> copies the <i>displayed</i> value.
      </p>

      <docs-demo :code="usageFormulas" lang="html" filename="App.vue" :script="scriptFormulas">
        <q-spreadsheet
          v-model:rows="formulaRows"
          :columns="formulaColumns"
          height="260px"
          bordered
        />
      </docs-demo>

      <!-- ═══════ Référence formules ═══════ -->
      <h3 class="doc-h3">Syntax</h3>
      <p class="doc-note">
        A cell value that starts with <code>=</code> is a formula. Row numbers
        in references match the numbers shown in the row header (row 1 = first
        row). The raw source stays in the row data — only the <i>result</i> is
        displayed (hover the cell to see the source).
      </p>
      <table class="doc-table">
        <thead>
          <tr><th>Syntax</th><th>Meaning</th><th>Example</th></tr>
        </thead>
        <tbody>
          <tr><td><code>A1</code></td><td>Cell reference (column letter + row)</td><td><code>=B1*C1</code></td></tr>
          <tr><td><code>$A$1</code>, <code>$A1</code>, <code>A$1</code></td><td>Absolute reference — does not shift when copied / filled</td><td><code>=D1/$D$5</code></td></tr>
          <tr><td><code>A1:C3</code></td><td>Range (rectangular block) — for aggregations</td><td><code>=SUM(D1:D4)</code></td></tr>
          <tr><td><code>name</code></td><td>Column reference on the current row</td><td><code>=price * quantity</code></td></tr>
          <tr><td><code>"text"</code> / <code>'text'</code></td><td>String literal</td><td><code>=IF(B1&gt;10,"big","small")</code></td></tr>
          <tr><td><code>10%</code></td><td>Postfix percent</td><td><code>=A1*10%</code></td></tr>
        </tbody>
      </table>

      <h3 class="doc-h3">Operators</h3>
      <p class="doc-note">
        Arithmetic <code>+ - * / ^</code> · postfix <code>%</code> · text
        concatenation <code>&amp;</code> · comparisons
        <code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code> · parentheses · unary
        <code>+/-</code>. Empty cells and blank text act as <code>0</code> in
        arithmetic and as <code>""</code> in text / comparisons.
      </p>

      <h3 class="doc-h3">Functions</h3>
      <table class="doc-table">
        <thead>
          <tr><th>Function</th><th>Result</th><th>Example</th></tr>
        </thead>
        <tbody>
          <tr><th colspan="3" class="doc-table-group">Aggregation</th></tr>
          <tr><td><code>SUM(…)</code></td><td>Sum of the numeric arguments (ranges flatten)</td><td><code>=SUM(D1:D4)</code></td></tr>
          <tr><td><code>AVERAGE(…)</code> / <code>AVG(…)</code></td><td>Arithmetic mean of numeric values</td><td><code>=AVERAGE(A1:A3)</code></td></tr>
          <tr><td><code>MIN(…)</code> / <code>MAX(…)</code></td><td>Smallest / largest numeric value</td><td><code>=MAX(C1:C5)</code></td></tr>
          <tr><td><code>COUNT(…)</code></td><td>Count of numeric cells</td><td><code>=COUNT(B1:B10)</code></td></tr>
          <tr><td><code>COUNTA(…)</code></td><td>Count of non-empty cells</td><td><code>=COUNTA(A1:A10)</code></td></tr>
          <tr><th colspan="3" class="doc-table-group">Logic (lazy)</th></tr>
          <tr><td><code>IF(cond, a, b)</code></td><td><code>a</code> if true, <code>b</code> (or FALSE) otherwise — only the taken branch is evaluated</td><td><code>=IF(B1&gt;10,"big","small")</code></td></tr>
          <tr><td><code>IFERROR(v, fallback)</code></td><td><code>v</code>, or <code>fallback</code> when <code>v</code> is an error</td><td><code>=IFERROR(A1/B1,0)</code></td></tr>
          <tr><td><code>AND(…)</code> / <code>OR(…)</code></td><td>Logical AND / OR (short-circuit)</td><td><code>=IF(AND(B1&gt;0,C1&gt;0),"ok","ko")</code></td></tr>
          <tr><td><code>NOT(v)</code></td><td>Logical negation</td><td><code>=NOT(A1&gt;5)</code></td></tr>
          <tr><td><code>IFS(c1,v1,c2,v2…)</code></td><td>First true condition wins (lazy)</td><td><code>=IFS(A1&gt;10,"big",A1&gt;5,"mid",TRUE,"small")</code></td></tr>
          <tr><td><code>SWITCH(e,v1,r1,…,d)</code></td><td>First matching value → result (lazy)</td><td><code>=SWITCH(B1,"a",1,"b",2,0)</code></td></tr>
          <tr><td><code>IFNA(v, fallback)</code></td><td>Fallback on <code>#N/A</code> only</td><td><code>=IFNA(VLOOKUP(A1,D1:F9,2),"?")</code></td></tr>
          <tr><td><code>VLOOKUP(key, range, col, [approx])</code></td><td>Exact match in the 1st column of a range, returns the <code>col</code>-th cell</td><td><code>=VLOOKUP(A1,D1:F9,2)</code></td></tr>
          <tr><th colspan="3" class="doc-table-group">Math</th></tr>
          <tr><td><code>ABS(n)</code></td><td>Absolute value</td><td><code>=ABS(A1)</code></td></tr>
          <tr><td><code>ROUND(n, d)</code></td><td>Round to <code>d</code> decimals</td><td><code>=ROUND(A1,2)</code></td></tr>
          <tr><td><code>ROUNDUP(n, d)</code> / <code>ROUNDDOWN(n, d)</code></td><td>Round away / toward zero</td><td><code>=ROUNDUP(A1,0)</code></td></tr>
          <tr><td><code>FLOOR(n)</code> / <code>CEILING(n)</code> / <code>CEIL(n)</code></td><td>Round down / up to integer</td><td><code>=CEILING(A1)</code></td></tr>
          <tr><td><code>INT(n)</code></td><td>Integer part (truncate)</td><td><code>=INT(A1)</code></td></tr>
          <tr><td><code>MOD(a, b)</code></td><td>Remainder of <code>a / b</code></td><td><code>=MOD(A1,2)</code></td></tr>
          <tr><td><code>SQRT(n)</code></td><td>Square root</td><td><code>=SQRT(A1)</code></td></tr>
          <tr><td><code>POWER(n, e)</code> / <code>POW(n, e)</code></td><td><code>n</code> to the power <code>e</code></td><td><code>=POWER(A1,2)</code></td></tr>
          <tr><td><code>PI()</code></td><td>π</td><td><code>=PI()</code></td></tr>
          <tr><td><code>RAND()</code></td><td>Random number in [0, 1)</td><td><code>=RAND()</code></td></tr>
          <tr><th colspan="3" class="doc-table-group">Text</th></tr>
          <tr><td><code>CONCAT(…)</code></td><td>Joins the arguments as text</td><td><code>=CONCAT("ID-",B1)</code></td></tr>
          <tr><td><code>UPPER(t)</code> / <code>LOWER(t)</code> / <code>TRIM(t)</code></td><td>Uppercase / lowercase / trim spaces</td><td><code>=UPPER(A1)</code></td></tr>
          <tr><td><code>LEN(t)</code></td><td>Length in characters</td><td><code>=LEN(A1)</code></td></tr>
          <tr><td><code>LEFT(t,n)</code> / <code>RIGHT(t,n)</code></td><td>First / last <code>n</code> characters</td><td><code>=LEFT(A1,3)</code></td></tr>
          <tr><td><code>MID(t,start,n)</code></td><td>Substring from <code>start</code> (1-based)</td><td><code>=MID(A1,2,4)</code></td></tr>
          <tr><td><code>FIND(what, t, [start])</code></td><td>Position (1-based) of <code>what</code> in <code>t</code></td><td><code>=FIND("-",A1)</code></td></tr>
          <tr><td><code>SUBSTITUTE(t,old,new,[n])</code></td><td>Replaces all — or the <code>n</code>-th — occurrence</td><td><code>=SUBSTITUTE(A1,"-"," ")</code></td></tr>
          <tr><td><code>REPLACE(t,start,n,new)</code></td><td>Replaces <code>n</code> chars at <code>start</code></td><td><code>=REPLACE(A1,1,3,"X")</code></td></tr>
          <tr><th colspan="3" class="doc-table-group">Dates &amp; time (ISO)</th></tr>
          <tr><td><code>TODAY()</code> / <code>NOW()</code></td><td>Current date / date+time (ISO)</td><td><code>=TODAY()</code></td></tr>
          <tr><td><code>DATE(y,m,d)</code></td><td>Date from year / month / day</td><td><code>=DATE(2026,9,7)</code></td></tr>
          <tr><td><code>YEAR(d)</code> / <code>MONTH(d)</code> / <code>DAY(d)</code></td><td>Part of a date</td><td><code>=MONTH(A1)</code></td></tr>
          <tr><td><code>EDATE(d, months)</code></td><td>Date shifted by months</td><td><code>=EDATE(A1,3)</code></td></tr>
          <tr><th colspan="3" class="doc-table-group">Conversion &amp; info</th></tr>
          <tr><td><code>VALUE(t)</code> / <code>N(v)</code></td><td>Coerce to a number</td><td><code>=VALUE(A1)</code></td></tr>
          <tr><td><code>ISBLANK(v)</code> / <code>ISNUMBER(v)</code> / <code>ISTEXT(v)</code></td><td>Type checks</td><td><code>=IF(ISBLANK(A1),"—",A1)</code></td></tr>
        </tbody>
      </table>

      <h3 class="doc-h3">Errors</h3>
      <table class="doc-table">
        <thead>
          <tr><th>Error</th><th>Cause</th></tr>
        </thead>
        <tbody>
          <tr><td><code>#DIV/0!</code></td><td>Division by zero</td></tr>
          <tr><td><code>#NAME?</code></td><td>Unknown function or column name</td></tr>
          <tr><td><code>#VALUE!</code></td><td>Wrong type (text where a number is expected, array in a scalar context)</td></tr>
          <tr><td><code>#REF!</code></td><td>Reference outside the grid</td></tr>
          <tr><td><code>#CYCLE!</code></td><td>Circular reference (a formula that refers to itself)</td></tr>
          <tr><td><code>#ERROR!</code></td><td>Syntax error / unparsable formula</td></tr>
        </tbody>
      </table>
      <p class="doc-note">
        Errors are displayed in <b>red</b>; wrap a risky formula in
        <code>IFERROR</code> to provide a fallback. As you type inside the cell
        or the <b>fx bar</b>, a <b>suggestion list</b> of functions appears
        (<kbd>↑</kbd>/<kbd>↓</kbd> navigate, <kbd>Tab</kbd> accepts,
        <kbd>Esc</kbd> dismisses). Still not implemented:
        <code>XLOOKUP</code>, array formulas and cross-sheet references.
      </p>
    </section>

    <!-- ═══════ Clic droit, formatage & autofill ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Context menu, formatting &amp; autofill</h2>
      <p class="doc-note">
        <b>Right-click</b> a cell, a row number or a column letter to open the
        context menu: cut / copy / paste, insert rows above / below and columns
        left / right, delete the selected rows or columns, sort, toggle
        <b>bold</b> / <b>italic</b>, pick a <b>fill</b> or <b>text color</b>
        from the swatches, or clear the formatting. Cell formatting is stored
        on the sheet (not in the row data) and joins the undo history.
      </p>
      <p class="doc-note">
        Select one or two cells and drag the <b>small square</b> at the
        bottom-right corner of the selection to <b>fill</b> in any direction
        (up / down / left / right): two numeric or date seeds create a series
        (1, 2, 3… / day steps) toward the bottom / right, other values are
        copied and <b>formula references shift</b> with the destination.
        Hold <b>Ctrl</b> while dragging to force a plain copy (no series);
        <code>fillFormatsDown()</code> duplicates the first row's formatting
        across the selection. Drag the bottom edge of a <b>row number</b> to
        resize the row.
      </p>
      <p class="doc-note">
        The <b>status bar</b> at the bottom shows the active cell, the
        selection size and the live <b>Σ / mean / count</b> of the selected
        numeric values, plus <b>zoom</b> controls (− , <code>%</code> , +,
        reset on click of the percentage).
      </p>

      <docs-demo :code="usagePower" lang="html" filename="App.vue">
        <q-spreadsheet ref="opsDemo" v-model:rows="opsRows" :columns="opsColumns" height="250px" bordered />
      </docs-demo>
    </section>

    <!-- ═══════ Filtres & freeze ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Filters &amp; freeze panes</h2>
      <p class="doc-note">
        Click the <b>funnel icon</b> in a column header to filter rows by
        value (search box, checkboxes, per-value counts — auto-applied, and the
        arrows keys skip hidden rows). Values typed in <code>select</code>
        columns are shown as their badge label. Filtering works together with
        selection, editing, formulas and undo. This demo starts pre-filtered to
        <b>IT</b> — open the funnel on the Department column to change it.
      </p>

      <docs-demo :code="usageFilter" lang="html" filename="App.vue">
        <q-spreadsheet
          ref="filterDemo"
          v-model:rows="filterRows"
          :columns="filterCols"
          height="260px"
          bordered
        />
      </docs-demo>

      <p class="doc-note">
        <code>frozen-rows</code> and <code>frozen-cols</code> pin the first
        rows / columns while scrolling (freeze panes) — useful for wide
        datasets where headers or the first column must stay visible.
      </p>

      <docs-demo :code="usageFreeze" lang="html" filename="App.vue">
        <q-spreadsheet
          v-model:rows="filterRows"
          :columns="filterCols"
          height="240px"
          :frozen-rows="1"
          :frozen-cols="1"
          bordered
        />
      </docs-demo>
    </section>

    <!-- ═══════ Classeur (feuilles) & export ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Workbook (sheets) &amp; export</h2>
      <p class="doc-note">
        Pass <code>v-model:sheets</code> (array of <code>{ key, name,
        columns?, rows? }</code>) to turn the component into a <b>multi-sheet
        workbook</b>: click a tab to switch, double-click to rename,
        <code>+</code> to add a sheet, <code>×</code> to remove one (keeps at
        least one). Tabs sit at the <b>top</b> by default; use
        <code>sheets-position="bottom"</code> to put them under the grid
        (Excel-style). Each sheet keeps its own rows, columns, formatting,
        column widths, row heights and filters; undo history resets when
        switching.
      </p>

      <docs-demo :code="usageSheets" lang="html" filename="App.vue" :script="scriptSheets">
        <q-spreadsheet ref="wbRef" v-model:sheets="wbSheets" height="250px" bordered />
      </docs-demo>

      <p class="doc-note">
        <b>Serialization</b>: <code>toJSON()</code> returns the whole workbook
        (rows + columns + formats + widths + filters), <code>loadDocument()</code>
        restores it, <code>exportCsv()</code> / <code>exportJson()</code>
        download the current sheet / the workbook, <code>getCsv()</code> returns
        the CSV string (values as displayed, quoted when needed).
      </p>

      <docs-demo :code="usageExport" lang="html" filename="App.vue" :script="scriptExport">
        <div class="demo-tools">
          <button class="demo-btn" type="button" @click="copyWbJson">Show JSON</button>
          <button class="demo-btn" type="button" @click="wbRef?.exportJson()">Download JSON</button>
          <button class="demo-btn" type="button" @click="wbRef?.exportCsv()">Download CSV</button>
        </div>
        <pre v-if="wbJson" class="demo-json">{{ wbJson }}</pre>
      </docs-demo>
    </section>

    <!-- ═══════ Find, import & clipboard ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Find &amp; Replace, CSV import, clipboard</h2>
      <p class="doc-note">
        Press <kbd>Ctrl</kbd>+<kbd>F</kbd> (or the magnifier icon in the toolbar)
        to open <b>Find &amp; Replace</b>: next / previous match, replace one or
        all — matches are highlighted in the grid. Methods:
        <code>importCsv(text, { headers })</code> replaces the active sheet from
        a CSV (first row = column names when <code>headers: true</code>),
        <code>copyFormulas()</code> copies the raw cell sources (formulas kept)
        and <code>pasteTransposed()</code> pastes the clipboard transposed
        (rows ↔ columns).
      </p>

      <docs-demo :code="usageFindImport" lang="html" filename="App.vue">
        <q-spreadsheet
          ref="findDemo"
          v-model:rows="importRows"
          :columns="importCols"
          height="200px"
          bordered
        />
        <div class="demo-tools">
          <button class="demo-btn" type="button" @click="findDemo?.openFind()">
            Open Find (Ctrl+F)
          </button>
          <button
            class="demo-btn"
            type="button"
            @click="findDemo?.importCsv(CSV_SAMPLE, { headers: true })"
          >
            Import sample CSV
          </button>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Layout, CF & validation ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Cell layout, conditional formatting &amp; validation</h2>
      <p class="doc-note">
        <b>Layout</b> (clic droit) : <code>Wrap text</code> affiche le texte sur
        plusieurs lignes et fait pousser la hauteur de la ligne ;
        <code>Merge cells</code> fusionne la sélection (le contenu affiché est
        celui de la cellule en haut à gauche), <code>Unmerge</code> les sépare ;
        <code>Hide rows / columns</code> masque (la navigation clavier les
        saute) — « Show all hidden » / liste des colonnes masquées dans le menu.
      </p>
      <p class="doc-note">
        <b>Conditional formatting</b> (icône surligneur de la toolbar) : ajoute
        une règle sur la sélection (comparaison / contient / vide) avec fond et
        gras ; les règles sont réévaluées en direct.
      </p>
      <p class="doc-note">
        <b>Validation</b> par colonne (<code>columns.validation</code> :
        <code>min</code>, <code>max</code>, <code>integer</code>,
        <code>pattern</code>, <code>message</code>) : la saisie invalide est
        refusée, la cellule est cerclée de rouge et le message apparaît en
        infobulle. Ici, essayez de saisir <code>150</code> dans Score.
      </p>

      <docs-demo :code="usageLayout" lang="html" filename="App.vue">
        <q-spreadsheet
          ref="layoutDemo"
          v-model:rows="layoutRows"
          :columns="layoutCols"
          height="230px"
          bordered
        />
        <div class="demo-tools">
          <button class="demo-btn" type="button" @click="layoutDemo?.toggleWrapSelection()">
            Wrap text (selection)
          </button>
          <button class="demo-btn" type="button" @click="layoutDemo?.mergeCells()">
            Merge selection
          </button>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Événements ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Events</h2>
      <p class="doc-note">
        <code>cell-change</code> fires on every committed edit (with
        <code>oldValue</code>/<code>newValue</code>), <code>selection-change</code>
        on every move (with the range size) and <code>structure-change</code>
        when rows or columns are added / removed / sorted (reason +
        <code>update:rows</code>). Try the undo / redo buttons.
      </p>

      <docs-demo :code="usageEvents" lang="html" filename="App.vue">
        <q-spreadsheet
          v-model:rows="eventsRows"
          :columns="eventsCols"
          height="230px"
          flat
          @cell-change="onCellChange"
          @selection-change="onSelectionChange"
          @structure-change="onStructureChange"
        />
        <p class="demo-p demo-log">Last event: {{ log || "— click a cell" }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ Clavier & volumes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Keyboard &amp; large datasets</h2>
      <table class="doc-table">
        <thead>
          <tr><th>Shortcut</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>First / last column of the current row</td></tr>
          <tr><td><kbd>Ctrl</kbd>+<kbd>Home</kbd> / <kbd>Ctrl</kbd>+<kbd>End</kbd></td><td>Top-left corner / last used cell</td></tr>
          <tr><td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td><td>One viewport of rows up / down</td></tr>
          <tr><td><kbd>Ctrl</kbd>+<kbd>←↑→↓</kbd></td><td>Jump to the edge of the current data block</td></tr>
          <tr><td><kbd>Ctrl</kbd>+<kbd>D</kbd></td><td>Fill the selection with the row above</td></tr>
          <tr><td><kbd>Ctrl</kbd>+<kbd>R</kbd></td><td>Fill the selection with the column on the left</td></tr>
          <tr><td>Double-click the fill handle</td><td>Fill down until the end of the neighbouring data</td></tr>
          <tr><td><kbd>Tab</kbd> in a formula</td><td>Accept the highlighted function suggestion</td></tr>
        </tbody>
      </table>
      <p class="doc-note">
        Rows are <b>virtualized by default</b> (<code>virtual-scroll</code> is
        always on): beyond ~150 visible rows only the on-screen slice is
        rendered (with top / bottom spacers), so tens of thousands of rows
        scroll smoothly. Virtualization is set aside automatically only when
        the grid requires it (frozen rows or merged cells).
      </p>
      <docs-demo lang="html" filename="App.vue" :code="usageBig">
        <q-spreadsheet v-model:rows="bigRows" :columns="bigCols" height="40vh" bordered />
      </docs-demo>
    </section>

    <!-- ═══════ Variantes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants &amp; states</h2>
      <p class="doc-note">
        <code>toolbar</code>, <code>row-numbers</code> and
        <code>column-headers</code> toggle chrome parts; <code>dense</code>
        tightens paddings; <code>readonly</code> keeps the text selectable /
        copyable but blocks editing; <code>disable</code> additionally greys
        everything and blocks pointer events.
      </p>

      <docs-demo :code="usageVariants" lang="html" filename="App.vue" :script="scriptPeople">
        <q-spreadsheet
          v-model:rows="peopleRows"
          :columns="columnsSummary"
          height="200px"
          :show-toolbar="false"
          :show-row-numbers="false"
          dense
          flat
          bordered
        />
        <div class="demo-col-spacer" />
        <q-spreadsheet
          v-model:rows="peopleRows"
          :columns="columnsSummary"
          height="200px"
          :show-toolbar="false"
          :show-column-headers="false"
          readonly
        />
      </docs-demo>
    </section>

    <!-- ══════ Data model (rows · columns · sheets) ══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Data model — rows · columns · sheets</h2>

      <h3 class="doc-h3">Rows — how values are stored</h3>
      <p class="doc-note">
        <code>rows</code> is an array of plain objects, one per row. Keys are
        the <b>column names</b>; the value shape depends on the column
        <code>type</code>:
      </p>
      <table class="doc-table">
        <thead>
          <tr><th>Column type</th><th>Stored value</th><th>Example</th></tr>
        </thead>
        <tbody>
          <tr><td><code>string</code> / <code>text</code></td><td>string</td><td><code>"Ada"</code></td></tr>
          <tr><td><code>number</code></td><td>number</td><td><code>18.5</code></td></tr>
          <tr><td><code>integer</code></td><td>whole number (truncated on input)</td><td><code>39</code></td></tr>
          <tr><td><code>email</code> / <code>url</code></td><td>string</td><td><code>"ada@dnax.dev"</code></td></tr>
          <tr><td><code>boolean</code></td><td>true / false</td><td><code>true</code></td></tr>
          <tr><td><code>date</code></td><td>ISO <code>YYYY-MM-DD</code></td><td><code>"2026-12-31"</code></td></tr>
          <tr><td><code>datetime</code></td><td>ISO <code>YYYY-MM-DDTHH:mm</code></td><td><code>"2026-09-07T09:30"</code></td></tr>
          <tr><td><code>select</code></td><td>the option <code>value</code> (not its label)</td><td><code>"tea"</code></td></tr>
          <tr><td>any</td><td>formula source when it starts with <code>=</code> (displayed = result)</td><td><code>"=B1*C1"</code></td></tr>
          <tr><td>empty</td><td><code>null</code></td><td><code>null</code></td></tr>
        </tbody>
      </table>
      <pre class="demo-json">const rows = [
  { firstName: "Ada", age: 36, email: "ada@dnax.dev", hired: "2020-03-01", dept: "it", total: "=B1*C1" },
  { firstName: "Grace", age: 85, email: "grace@dnax.dev", hired: "1945-01-01", dept: "finance", total: null },
]</pre>

      <h3 class="doc-h3">Columns — the schema</h3>
      <p class="doc-note">
        <code>columns</code> is an array of column descriptors (the header
        letters A, B, C… follow the array order).
      </p>
      <table class="doc-table">
        <thead>
          <tr><th>Column key</th><th>Type</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>name</code></td><td>string · required</td><td>Key of the property in each row</td></tr>
          <tr><td><code>label</code></td><td>string</td><td>Header text (defaults to <code>name</code>)</td></tr>
          <tr><td><code>width</code></td><td>number · string</td><td>Column width (px or CSS) — draggable on the header</td></tr>
          <tr><td><code>minWidth</code> / <code>maxWidth</code></td><td>number</td><td>Resize bounds (60 / 600 default)</td></tr>
          <tr><td><code>type</code></td><td><code>string | text | number | integer | email | url | date | datetime | boolean | select</code></td><td>Editor &amp; stored format (see table above)</td></tr>
          <tr><td><code>editable</code></td><td>boolean · default <code>true</code></td><td><code>false</code> locks the column</td></tr>
          <tr><td><code>align</code></td><td><code>left | center | right</code></td><td>Text alignment (numbers right by default)</td></tr>
          <tr><td><code>options</code></td><td><code>{ value, label, color? }[]</code></td><td>For <code>select</code> — chips with <code>chip: true</code></td></tr>
          <tr><td><code>chip</code></td><td>boolean</td><td>Renders <code>select</code> values as colored badges</td></tr>
          <tr><td><code>validation</code></td><td><code>{ min?, max?, integer?, pattern?, message? }</code></td><td>Input validation (rejects &amp; marks the cell red)</td></tr>
          <tr><td><code>format</code></td><td><code>(value, row) =&gt; any</code></td><td>Display formatter (stored value untouched)</td></tr>
          <tr><td><code>cellClass</code> / <code>cellBackground</code></td><td><code>(value, row) =&gt; …</code></td><td>Per-cell class / background</td></tr>
          <tr><td><code>headerClass</code> / <code>headerStyle</code></td><td>string</td><td>Header styling</td></tr>
        </tbody>
      </table>
      <pre class="demo-json">const columns = [
  { name: "firstName", label: "First name", type: "string", width: 130 },
  { name: "age", label: "Age", type: "integer", validation: { min: 0, max: 120 } },
  { name: "email", label: "Email", type: "email" },
  { name: "dept", label: "Department", type: "select", chip: true,
    options: [
      { value: "it", label: "IT", color: "#ede9fe" },
      { value: "finance", label: "Finance", color: "#fef9c3" },
    ] },
  { name: "total", label: "Total", type: "number", format: (v) => (v == null ? "" : "$" + v) },
]</pre>

      <h3 class="doc-h3">Selection · validation · sheets</h3>
      <p class="doc-note">
        <b>Selection</b> (<code>v-model:selected</code>) is
        <code>{ row, column, endRow, endColumn }</code> — rows are 0-based,
        columns are names. <b>Sheets</b> (<code>v-model:sheets</code>) is an
        array of <code>{ key?, name?, columns?, rows? }</code>; the serialized
        document (<code>toJSON()</code>) adds <code>version: 1</code>,
        <code>active</code> and per-sheet <code>formats</code> /
        <code>widths</code> / <code>rowHeights</code> / <code>filters</code>.
      </p>

    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSpreadsheet API</h2>
      <docs-api :comp="spreadsheet" :source="spreadsheetSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-log code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.demo-log {
  margin-top: 10px;
  font-size: 13px;
  color: #5b6472;
}
.demo-col-spacer {
  height: 14px;
}
.demo-tools {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.demo-btn {
  padding: 5px 12px;
  border: 1px solid rgb(0 0 0 / 0.14);
  border-radius: 7px;
  background: #fff;
  color: var(--foreground);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.demo-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.demo-json {
  max-height: 220px;
  overflow: auto;
  margin: 0;
  padding: 10px 12px;
  border: 1px dashed var(--border, rgb(0 0 0 / 0.2));
  border-radius: 8px;
  background: rgb(0 0 0 / 0.03);
  font-size: 11.5px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
kbd {
  background: rgb(0 0 0 / 0.06);
  border: 1px solid rgb(0 0 0 / 0.12);
  border-bottom-width: 2px;
  border-radius: 5px;
  padding: 1px 5px;
  font-size: 0.85em;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  color: var(--foreground);
}
.doc-table {
  width: 100%;
  max-width: 720px;
  margin: 0 0 18px;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 1.55;
}
.doc-table th,
.doc-table td {
  padding: 6px 10px;
  border: 1px solid rgb(0 0 0 / 0.1);
  text-align: left;
  vertical-align: top;
}
.doc-table th {
  font-weight: 600;
  color: var(--foreground);
  background: rgb(0 0 0 / 0.03);
}
.doc-table code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.92em;
  white-space: nowrap;
}
.doc-table-group {
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
  background: transparent !important;
}
:deep(.dark) .doc-table th,
:deep(.dark) .doc-table td {
  border-color: rgb(255 255 255 / 0.12);
}
:deep(.dark) .doc-table th {
  background: rgb(255 255 255 / 0.05);
}
</style>
