<script setup lang="ts">
// Data Grid — documentation du composant QDataGrid :
// grille type tableur (MUI X) — sélection au clavier, édition en place, formules.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const dataGrid = useComponent(() => "QDataGrid")
const dataGridSource = componentSource("QDataGrid")
const tag = componentTag("QDataGrid")

// — Démo interactive : basic (lecture seule) —
const basicColumns = [
  { name: "product", label: "Product" },
  { name: "category", label: "Category" },
  { name: "price", label: "Price", type: "number" as const, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "stock", label: "Stock", type: "number" as const },
]

const basicRows = ref([
  { product: "Chai", category: "Tea", price: 18, stock: 39 },
  { product: "Chang", category: "Beer", price: 19, stock: 17 },
  { product: "Aniseed Syrup", category: "Condiment", price: 10, stock: 13 },
  { product: "Chef Anton's Cajun Seasoning", category: "Condiment", price: 22, stock: 53 },
])

// — Édition —
const editColumns = [
  { name: "product", label: "Product", editable: true },
  { name: "category", label: "Category" },
  { name: "price", label: "Price", type: "number" as const, editable: true, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "stock", label: "Stock", type: "number" as const, editable: true },
]

const editRows = ref([
  { product: "Chai", category: "Tea", price: 18, stock: 39 },
  { product: "Chang", category: "Beer", price: 19, stock: 17 },
  { product: "Aniseed Syrup", category: "Condiment", price: 10, stock: 13 },
])

const lastChange = ref("")

const onCellChange = (e: any) => {
  lastChange.value = `${e.column} (row ${e.row + 1}): ${JSON.stringify(e.oldValue)} → ${JSON.stringify(e.newValue)}`
}

// — Formules (facture façon MUI X) —
const formulaColumns = [
  { name: "item", label: "Item" },
  { name: "quantity", label: "Quantity", type: "number" as const, editable: true },
  { name: "unitPrice", label: "Unit price", type: "number" as const, editable: true, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "discount", label: "Discount", type: "number" as const, editable: true, format: (v: any) => (v == null ? "" : Math.round(v * 100) + "%") },
  { name: "amount", label: "Amount", type: "number" as const, editable: true, allowFormulas: true, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
]

const formulaRows = ref([
  { item: "Apples", quantity: 6, unitPrice: 1.5, discount: 0.1, amount: "=quantity * unitPrice * (1 - discount)" },
  { item: "Bananas", quantity: 12, unitPrice: 0.4, discount: 0.05, amount: "=quantity * unitPrice * (1 - discount)" },
  { item: "Cherries", quantity: 30, unitPrice: 0.25, discount: 0, amount: "=quantity * unitPrice * (1 - discount)" },
  { item: "Subtotal", amount: "=SUM(E1:E3)" },
  { item: "Tax rate", quantity: 0.1, amount: "=E4 * $B$5" },
  { item: "Total", amount: "=E4 + E5" },
])

const usageBasic = `<q-data-grid
  :rows="rows"
  :columns="columns"
  height="260px"
  flat
  bordered
/>`

const usageEditable = `<q-data-grid
  v-model:rows="rows"
  :columns="columns"
  height="240px"
  flat
  bordered
  @cell-change="lastChange = $event.column + ' (row ' + ($event.row + 1) + '): ' + JSON.stringify($event.oldValue) + ' → ' + JSON.stringify($event.newValue)"
/>
<p class="demo-p demo-log">Last change: {{ lastChange || "—" }}</p>`

const usageFormulas = `<q-data-grid
  v-model:rows="rows"
  :columns="columns"
  height="300px"
  flat
  bordered
/>

<!--
  Edit a Quantity, a Unit price, a Discount — or the Tax rate (0.1 in B5) —
  and watch the Amount, the Subtotal, the Tax and the Total update in order.
  Double-click an Amount cell: the editor shows the formula source.
-->`

const scriptBasic = `import { ref } from "vue"

const columns = [
  { name: "product", label: "Product" },
  { name: "category", label: "Category" },
  { name: "price", label: "Price", type: "number", format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "stock", label: "Stock", type: "number" },
]

const rows = ref([
  { product: "Chai", category: "Tea", price: 18, stock: 39 },
  { product: "Chang", category: "Beer", price: 19, stock: 17 },
  { product: "Aniseed Syrup", category: "Condiment", price: 10, stock: 13 },
])`

const scriptEditable = `import { ref } from "vue"

const columns = [
  { name: "product", label: "Product", editable: true },
  { name: "category", label: "Category" },
  { name: "price", label: "Price", type: "number", editable: true, format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "stock", label: "Stock", type: "number", editable: true },
]

const rows = ref([
  { product: "Chai", category: "Tea", price: 18, stock: 39 },
  { product: "Chang", category: "Beer", price: 19, stock: 17 },
  { product: "Aniseed Syrup", category: "Condiment", price: 10, stock: 13 },
])`

const scriptFormulas = `import { ref } from "vue"

const columns = [
  { name: "item", label: "Item" },
  { name: "quantity", label: "Quantity", type: "number", editable: true },
  { name: "unitPrice", label: "Unit price", type: "number", editable: true, format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "discount", label: "Discount", type: "number", editable: true, format: (v) => (v == null ? "" : Math.round(v * 100) + "%") },
  { name: "amount", label: "Amount", type: "number", editable: true, allowFormulas: true, format: (v) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
]

const rows = ref([
  { item: "Apples", quantity: 6, unitPrice: 1.5, discount: 0.1, amount: "=quantity * unitPrice * (1 - discount)" },
  { item: "Bananas", quantity: 12, unitPrice: 0.4, discount: 0.05, amount: "=quantity * unitPrice * (1 - discount)" },
  { item: "Cherries", quantity: 30, unitPrice: 0.25, discount: 0, amount: "=quantity * unitPrice * (1 - discount)" },
  { item: "Subtotal", amount: "=SUM(E1:E3)" },
  { item: "Tax rate", quantity: 0.1, amount: "=E4 * $B$5" },
  { item: "Total", amount: "=E4 + E5" },
])`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Data Grid</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A spreadsheet-like grid in the spirit of MUI X Data Grid: cells are
      selected with the keyboard and edited in place, and columns that opt in
      with <code>allow-formulas</code> evaluate <code>=…</code> values with
      column references (<code>=price * quantity</code>), A1 references
      (<code>=E4 * $B$5</code>) and built-in functions (<code>=SUM(E1:E3)</code>).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Click a cell to select it — then move with the arrow keys, <kbd>Tab</kbd>,
        or <kbd>Enter</kbd>. Read-only unless a column is <code>editable</code>.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-data-grid :rows="basicRows" :columns="basicColumns" height="260px" flat bordered />
      </docs-demo>
    </section>

    <!-- ═══════ Editing ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Editing</h2>
      <p class="doc-note">
        <kbd>Enter</kbd>, <kbd>F2</kbd> or double-click opens the cell editor;
        typing starts editing directly. <kbd>Enter</kbd> commits,
        <kbd>Escape</kbd> cancels, <kbd>Delete</kbd> clears the cell,
        <kbd>Ctrl</kbd>+<kbd>C</kbd> copies the displayed value. Commits are
        emitted through <code>cell-change</code> and <code>update:rows</code>.
      </p>

      <docs-demo :code="usageEditable" lang="html" filename="App.vue" :script="scriptEditable">
        <q-data-grid
          v-model:rows="editRows"
          :columns="editColumns"
          height="240px"
          flat
          bordered
          @cell-change="onCellChange"
        />
        <p class="demo-p demo-log">Last change: {{ lastChange || "—" }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ Formulas ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Formulas</h2>
      <p class="doc-note">
        On an <code>allow-formulas</code> column, any value starting with
        <code>=</code> is parsed and evaluated. The evaluated value is displayed,
        sorted and copied — the formula source stays in the row data (hover a
        cell to see it). References flow through: field names resolve on the
        current row, <code>$B$5</code> is an absolute A1 reference, ranges feed
        <code>SUM</code> and friends, and errors (<code>#DIV/0!</code>,
        <code>#REF!</code>, <code>#CYCLE!</code>…) render in red. Editing a
        formula cell opens the source in a monospace editor.
      </p>

      <docs-demo :code="usageFormulas" lang="html" filename="App.vue" :script="scriptFormulas">
        <q-data-grid v-model:rows="formulaRows" :columns="formulaColumns" height="300px" flat bordered />
      </docs-demo>

      <h3 class="doc-h3">Formula syntax</h3>
      <ul class="demo-list">
        <li><code>=quantity * unitPrice * (1 - discount)</code> — field references on the current row</li>
        <li><code>=E4 * $B$5</code> — positional A1 reference, absolute with <code>$</code></li>
        <li><code>=SUM(E1:E3)</code> — ranges + built-in functions</li>
        <li>Operators: <code>+ - * / ^ % &amp; = &lt;&gt; &lt; &gt; &lt;= &gt;=</code>, parentheses, unary <code>-</code></li>
        <li>Functions: <code>SUM AVERAGE MIN MAX COUNT COUNTA ABS ROUND ROUNDUP ROUNDDOWN FLOOR CEILING INT MOD SQRT POWER PI IF IFERROR AND OR NOT CONCAT UPPER LOWER TRIM LEN ISBLANK ISNUMBER ISTEXT VALUE</code></li>
      </ul>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QDataGrid API</h2>
      <docs-api :comp="dataGrid" :source="dataGridSource" />
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
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-p code,
.doc-lead code,
.demo-list code {
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
.demo-list {
  margin: 0 0 0 18px;
  padding: 0;
  font-size: 13.5px;
  line-height: 1.9;
  color: #5b6472;
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
</style>
