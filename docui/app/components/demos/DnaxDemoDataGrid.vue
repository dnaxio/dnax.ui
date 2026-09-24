<script setup lang="ts">
// Démos live de la page Data Grid (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "editing" | "formulas"
}>()

// — Basic (read-only) —
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

// — Editing —
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

// — Formulas (invoice, MUI X style) —
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
</script>

<template>
  <q-data-grid
    v-if="demo === 'basic'"
    :rows="basicRows"
    :columns="basicColumns"
    height="260px"
    flat
    bordered
  />

  <div v-else-if="demo === 'editing'">
    <q-data-grid
      v-model:rows="editRows"
      :columns="editColumns"
      height="240px"
      flat
      bordered
      @cell-change="onCellChange"
    />
    <p class="demo-p demo-log">Last change: {{ lastChange || "—" }}</p>
  </div>

  <q-data-grid
    v-else-if="demo === 'formulas'"
    v-model:rows="formulaRows"
    :columns="formulaColumns"
    height="300px"
    flat
    bordered
  />
</template>

<style scoped>
.demo-log {
  margin-top: 10px;
  font-size: 13px;
  color: #5b6472;
}
</style>
