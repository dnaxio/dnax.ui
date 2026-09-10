---
title: Data Grid
description: A spreadsheet-like grid with keyboard selection, in-place editing
  and formula columns.
navigation:
  icon: lucide:table
seo:
  title: Data Grid (QDataGrid)
  description: QDataGrid — a spreadsheet-like grid with keyboard navigation, in-place editing and =formulas.
---

A spreadsheet-like grid in the spirit of MUI X Data Grid: cells are selected with
the keyboard and edited in place, and columns that opt in with `allow-formulas`
evaluate `=…` values with column references (`=price * quantity`), A1 references
(`=E4 * $B$5`) and built-in functions (`=SUM(E1:E3)`).

## Basic

Click a cell to select it — then move with the arrow keys, `Tab`, or `Enter`.
Read-only unless a column is `editable`.

::prose-show-case
<dnax-demo-data-grid demo="basic"></dnax-demo-data-grid>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
])
</script>

<template>
  <q-data-grid
    :rows="rows"
    :columns="columns"
    height="260px"
    flat
    bordered
  />
</template>
```
::

## Editing

`Enter`, `F2` or double-click opens the cell editor; typing starts editing
directly. `Enter` commits, `Escape` cancels, `Delete` clears the cell, `Ctrl`+`C`
copies the displayed value. Commits are emitted through `cell-change` and
`update:rows`.

::prose-show-case
<dnax-demo-data-grid demo="editing"></dnax-demo-data-grid>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
])
</script>

<template>
  <q-data-grid
    v-model:rows="rows"
    :columns="columns"
    height="240px"
    flat
    bordered
    @cell-change="lastChange = $event.column + ' (row ' + ($event.row + 1) + '): ' + JSON.stringify($event.oldValue) + ' → ' + JSON.stringify($event.newValue)"
  />
  <p class="demo-p demo-log">Last change: {{ lastChange || "—" }}</p>
</template>
```
::

## Formulas

On an `allow-formulas` column, any value starting with `=` is parsed and
evaluated. The evaluated value is displayed, sorted and copied — the formula
source stays in the row data (hover a cell to see it). References flow through:
field names resolve on the current row, `$B$5` is an absolute A1 reference, ranges
feed `SUM` and friends, and errors (`#DIV/0!`, `#REF!`, `#CYCLE!`…) render in red.
Editing a formula cell opens the source in a monospace editor.

::prose-show-case
<dnax-demo-data-grid demo="formulas"></dnax-demo-data-grid>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
])
</script>

<template>
  <q-data-grid
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
  -->
</template>
```
::

### Formula syntax

- `=quantity * unitPrice * (1 - discount)` — field references on the current row
- `=E4 * $B$5` — positional A1 reference, absolute with `$`
- `=SUM(E1:E3)` — ranges + built-in functions
- Operators: `+ - * / ^ % & = <> < > <= >=`, parentheses, unary `-`
- Functions: `SUM AVERAGE MIN MAX COUNT COUNTA ABS ROUND ROUNDUP ROUNDDOWN FLOOR CEILING INT MOD SQRT POWER PI IF IFERROR AND OR NOT CONCAT UPPER LOWER TRIM LEN ISBLANK ISNUMBER ISTEXT VALUE`

## API

<dnax-api name="QDataGrid"></dnax-api>
