<script setup lang="ts">
// Live demos for the Spreadsheet page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { computed, onMounted, ref } from "vue"

const props = defineProps<{
  /** Identifier of the demo to render */
  demo:
    | "inline"
    | "people"
    | "types"
    | "formulas"
    | "power"
    | "filter"
    | "freeze"
    | "sheets"
    | "export"
    | "findImport"
    | "layout"
    | "events"
    | "big"
    | "variants"
}>()

// — Demos —
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

const columnsSummary = computed(() => peopleColumns)

// — Inline editing example —
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

// — Cell types demo —
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
  {
    // Labels NUMÉRIQUES : le brouillon d'édition doit rester une string
    // (sinon `.trim()` casse — cf. correctif `draft` / `fxSource` dans QSpreadsheet).
    name: "rating",
    label: "Rating",
    type: "select" as const,
    width: 100,
    options: [
      { value: 1, label: 1 },
      { value: 2, label: 2 },
      { value: 3, label: 3 },
      { value: 4, label: 4 },
      { value: 5, label: 5 },
    ],
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
  { product: "Chai", category: "tea", price: 18, stock: 39, rating: 4, inStock: true, email: "hello@dnax.dev", website: "https://dnax.dev", bestBefore: "2026-12-31", lastCheck: "2026-09-07T09:30" },
  { product: "Chang", category: "beer", price: 19, stock: 17, rating: 3, inStock: true, email: "beer@dnax.dev", website: "https://example.com", bestBefore: "2026-09-30", lastCheck: "2026-09-06T14:05" },
  { product: "Aniseed Syrup", category: "condiment", price: 10, stock: 13, rating: 5, inStock: false, email: "sales@dnax.dev", website: "https://example.org", bestBefore: "2027-06-30", lastCheck: "2026-09-01T08:45" },
  { product: "Ikura", category: "seafood", price: 31, stock: 0, rating: 2, inStock: false, email: "fish@dnax.dev", website: "https://example.net", bestBefore: "2026-11-15", lastCheck: "2026-08-28T16:20" },
  { product: "Mishi Kobe Niku", category: "seafood", price: 97, stock: 29, rating: 5, inStock: true, email: "mishi@dnax.dev", website: "https://dnax.dev/blog", bestBefore: "2026-08-20", lastCheck: "2026-08-20T11:10" },
])

// — A1 formulas demo —
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

// — Context menu, formatting & autofill demo —
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

// — Filters & freeze panes —
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

// — Large dataset (virtualization) —
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

// — Find & Replace + CSV import —
const importCols = [
  { name: "code", label: "Code", width: 100 },
  { name: "label", label: "Label", width: 240 },
]
const importRows = ref([
  { code: "X1", label: "Nothing imported yet — click the button." },
  { code: "X2", label: "…" },
])
const CSV_SAMPLE = `code,label\nA1,Alpha\nB2,Beta\nC3,Gamma`

// — Layout, conditional formatting & validation —
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

// — Multi-sheet workbook & export —
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
const wbJson = ref("")
const copyWbJson = () => {
  wbJson.value = wbRef.value?.toJSON() ?? ""
}

// — Events demo —
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

// — Grid refs (pre-setup of the filter / formatting demos) —
const filterDemo = ref()
const opsDemo = ref()
const wbRef = ref()
const findDemo = ref()
const layoutDemo = ref()

onMounted(() => {
  if (props.demo === "filter") {
    filterDemo.value?.setFilterOnly?.("dept", ["it"])
  }
  if (props.demo === "power") {
    // Pre-formatting applied to the first row of the context-menu demo
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
  }
})
</script>

<template>
  <div v-if="demo === 'inline'">
    <q-spreadsheet
      v-model:rows="inlineRows"
      :columns="inlineColumns"
      height="200px"
      bordered
      @cell-change="onInlineChange"
    />
    <p class="demo-p demo-log">Last change: {{ inlineLog || "— double-click Ada's first name" }}</p>
    <!-- `ClientOnly` : les `_key` sont générés à l'exécution (uuid) → éviter un
         écart de texte entre le HTML prérendu et l'hydratation. -->
    <ClientOnly>
      <p class="demo-p demo-log">
        Injected row key: <code>{{ inlineRows[0]?._key ?? "—" }}</code>
      </p>
    </ClientOnly>
  </div>

  <q-spreadsheet
    v-else-if="demo === 'people'"
    v-model:rows="peopleRows"
    :columns="columnsSummary"
    height="340px"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'types'"
    v-model:rows="typesRows"
    :columns="typesColumns"
    height="250px"
    bordered
    :default-col-width="120"
  />

  <q-spreadsheet
    v-else-if="demo === 'formulas'"
    v-model:rows="formulaRows"
    :columns="formulaColumns"
    height="260px"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'power'"
    ref="opsDemo"
    v-model:rows="opsRows"
    :columns="opsColumns"
    height="250px"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'filter'"
    ref="filterDemo"
    v-model:rows="filterRows"
    :columns="filterCols"
    height="260px"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'freeze'"
    v-model:rows="filterRows"
    :columns="filterCols"
    height="240px"
    :frozen-rows="1"
    :frozen-cols="1"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'sheets'"
    ref="wbRef"
    v-model:sheets="wbSheets"
    height="250px"
    bordered
  />

  <div v-else-if="demo === 'export'">
    <q-spreadsheet ref="wbRef" v-model:sheets="wbSheets" height="250px" bordered />
    <div class="demo-tools">
      <button class="demo-btn" type="button" @click="copyWbJson">Show JSON</button>
      <button class="demo-btn" type="button" @click="wbRef?.exportJson()">Download JSON</button>
      <button class="demo-btn" type="button" @click="wbRef?.exportCsv()">Download CSV</button>
    </div>
    <pre v-if="wbJson" class="demo-json">{{ wbJson }}</pre>
  </div>

  <div v-else-if="demo === 'findImport'">
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
  </div>

  <div v-else-if="demo === 'layout'">
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
  </div>

  <div v-else-if="demo === 'events'">
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
  </div>

  <q-spreadsheet
    v-else-if="demo === 'big'"
    v-model:rows="bigRows"
    :columns="bigCols"
    height="40vh"
    bordered
  />

  <div v-else-if="demo === 'variants'">
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
  </div>
</template>

<style scoped>
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
</style>
