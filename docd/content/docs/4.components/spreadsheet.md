---
title: Spreadsheet
description: An Excel-like editable grid — typed cells, A1 formulas, filters,
  freeze panes, multi-sheet workbooks and CSV/JSON export.
navigation:
  icon: lucide:table
seo:
  title: Spreadsheet (QSpreadsheet)
  description: QSpreadsheet — an Excel-like editable grid with A1 formulas, typed cells, filters and multi-sheet workbooks.
---

An Excel-like editable grid: cells are selected (click, `Shift`+click, drag),
navigated with the keyboard and edited in place
(`Enter`/`F2`/double-click/type-to-replace). Rows and columns can be added or
removed from the toolbar, columns sorted and resized, and the content copied /
pasted with `Ctrl`+`C` / `Ctrl`+`V` (with undo / redo). Cells are typed:
`string` / `text`, `number`, `integer`, `email`, `url`, `date`, `datetime`,
`boolean` (checkbox) and `select` — the latter renders as **colored badges** and
edits through a filterable option list. Cells also support **A1 formulas**
(`=SUM(D1:D4)`, `=B1*C1`, `$D$5` absolutes) with a live-recalculated value, an
in-cell monospace formula editor and an **fx bar** above the grid. Pass
`v-model:sheets` for a **multi-sheet workbook** (tabs, rename, per-sheet state)
and use `toJSON()` / `exportCsv()` to serialize it.

## Inline editing

Click a cell (e.g. **First name**) and start typing to replace its content, or
press `Enter` / `F2` / double-click to edit it. `Enter` commits and moves down,
`Esc` cancels, clicking elsewhere commits. Every change is written back into
`v-model:rows` and emitted through `cell-change` (old → new).

::prose-show-case
:dnax-demo-spreadsheet{demo="inline"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const columns = [
  { name: "firstName", label: "First name", editable: true },
  { name: "lastName", label: "Last name", editable: true },
  { name: "age", label: "Age", type: "integer", editable: true },
]

const rows = ref([
  { firstName: "Ada", lastName: "Lovelace", age: 36 },
  { firstName: "Grace", lastName: "Hopper", age: 85 },
])
</script>

<template>
  <q-spreadsheet
    v-model:rows="rows"
    :columns="columns"
    height="200px"
    bordered
    @cell-change="log = …"
  />
</template>
```
::

## People & colored badges

Click a cell to select it and drag to select a range (green outline on the
anchor). Double-click, `Enter` or type to edit — the Department column
(`type: "select"`, `chip`) shows a badge per option and opens a filterable
picker while editing; the Active column (`type: "boolean"`) toggles on click.
The toolbar adds rows / columns and removes the selected ones.

::prose-show-case
:dnax-demo-spreadsheet{demo="people"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
])
</script>

<template>
  <q-spreadsheet
    v-model:rows="rows"
    :columns="columns"
    height="320px"
    bordered
  />
</template>
```
::

## Cell types

The editor adapts to the column `type`: `string` / `text` and `email` / `url`
open dedicated inputs (mobile keyboards, native hints), `number` (decimals,
`step="any"`) and `integer` (whole numbers, coerced with `Math.trunc`) use a
numeric input and align right, `date` opens the native date picker, `datetime`
the native `datetime-local` picker, `boolean` renders a checkbox and
`select` + `chip` shows colored badges (pass `options` with `label` / `value` /
`color` — a token like `"positive"` or any CSS color). `format` customizes the
displayed value without touching the stored one (here: prices as `$`,
timestamps localized). For real validation (required / regex / range) add
`validation` on the column.

::prose-show-case
:dnax-demo-spreadsheet{demo="types"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
])
</script>

<template>
  <q-spreadsheet
    v-model:rows="rows"
    :columns="columns"
    height="250px"
    bordered
    default-col-width="120"
  />
</template>
```
::

## Formulas (A1)

Any editable text / number cell accepts an Excel-style formula: type
`=B1*C1`, `=SUM(D1:D4)`, `=D1/$D$5` (absolute), `=IF(C1>10,"big","small")`…
Formulas are stored as-is in the row data, **recalculate live** on every change
(memoized, cycle-safe) and errors render in red
(`#DIV/0!`, `#REF!`, `#CYCLE!`…). While editing, the cell opens a **monospace
editor** that grows with the source (`Shift`+`Enter` for a new line); the
**fx bar** above the grid shows the active cell's raw value and lets you commit
one (here: `Total`, `Share` with `$D$5` absolute reference). `Ctrl`+`C` copies
the *displayed* value.

::prose-show-case
:dnax-demo-spreadsheet{demo="formulas"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
])
</script>

<template>
  <q-spreadsheet
    v-model:rows="rows"
    :columns="columns"
    height="260px"
    bordered
  />

  <!--
    Type a formula in the Total / Share columns (or the fx bar above the grid):
    =B1*C1, =SUM(D1:D4), =D1/$D$5, =IF(C1>10,"big","small")…
    Formulas recalculate live; hover a cell to see its source.
  -->
</template>
```
::

### Syntax

A cell value that starts with `=` is a formula. Row numbers in references match
the numbers shown in the row header (row 1 = first row). The raw source stays
in the row data — only the *result* is displayed (hover the cell to see the
source).

| Syntax | Meaning | Example |
| --- | --- | --- |
| `A1` | Cell reference (column letter + row) | `=B1*C1` |
| `$A$1`, `$A1`, `A$1` | Absolute reference — does not shift when copied / filled | `=D1/$D$5` |
| `A1:C3` | Range (rectangular block) — for aggregations | `=SUM(D1:D4)` |
| `name` | Column reference on the current row | `=price * quantity` |
| `"text"` / `'text'` | String literal | `=IF(B1>10,"big","small")` |
| `10%` | Postfix percent | `=A1*10%` |

### Operators

Arithmetic `+ - * / ^` · postfix `%` · text concatenation `&` · comparisons
`= <> < > <= >=` · parentheses · unary `+/-`. Empty cells and blank text act as
`0` in arithmetic and as `""` in text / comparisons.

### Functions

**Aggregation**

| Function | Result | Example |
| --- | --- | --- |
| `SUM(…)` | Sum of the numeric arguments (ranges flatten) | `=SUM(D1:D4)` |
| `AVERAGE(…)` / `AVG(…)` | Arithmetic mean of numeric values | `=AVERAGE(A1:A3)` |
| `MIN(…)` / `MAX(…)` | Smallest / largest numeric value | `=MAX(C1:C5)` |
| `COUNT(…)` | Count of numeric cells | `=COUNT(B1:B10)` |
| `COUNTA(…)` | Count of non-empty cells | `=COUNTA(A1:A10)` |

**Logic (lazy)**

| Function | Result | Example |
| --- | --- | --- |
| `IF(cond, a, b)` | `a` if true, `b` (or FALSE) otherwise — only the taken branch is evaluated | `=IF(B1>10,"big","small")` |
| `IFERROR(v, fallback)` | `v`, or `fallback` when `v` is an error | `=IFERROR(A1/B1,0)` |
| `AND(…)` / `OR(…)` | Logical AND / OR (short-circuit) | `=IF(AND(B1>0,C1>0),"ok","ko")` |
| `NOT(v)` | Logical negation | `=NOT(A1>5)` |
| `IFS(c1,v1,c2,v2…)` | First true condition wins (lazy) | `=IFS(A1>10,"big",A1>5,"mid",TRUE,"small")` |
| `SWITCH(e,v1,r1,…,d)` | First matching value → result (lazy) | `=SWITCH(B1,"a",1,"b",2,0)` |
| `IFNA(v, fallback)` | Fallback on `#N/A` only | `=IFNA(VLOOKUP(A1,D1:F9,2),"?")` |
| `VLOOKUP(key, range, col, [approx])` | Exact match in the 1st column of a range, returns the `col`-th cell | `=VLOOKUP(A1,D1:F9,2)` |
| `XLOOKUP(key, table, ret, [fallback])` | Exact match in `table`, returns the cell from `ret` on the same row | `=XLOOKUP(A1,D1:D9,F1:F9,"?")` |

**Math**

| Function | Result | Example |
| --- | --- | --- |
| `ABS(n)` | Absolute value | `=ABS(A1)` |
| `ROUND(n, d)` | Round to `d` decimals | `=ROUND(A1,2)` |
| `ROUNDUP(n, d)` / `ROUNDDOWN(n, d)` | Round away / toward zero | `=ROUNDUP(A1,0)` |
| `FLOOR(n)` / `CEILING(n)` / `CEIL(n)` | Round down / up to integer | `=CEILING(A1)` |
| `INT(n)` | Integer part (truncate) | `=INT(A1)` |
| `MOD(a, b)` | Remainder of `a / b` | `=MOD(A1,2)` |
| `SQRT(n)` | Square root | `=SQRT(A1)` |
| `POWER(n, e)` / `POW(n, e)` | `n` to the power `e` | `=POWER(A1,2)` |
| `PI()` | π | `=PI()` |
| `RAND()` | Random number in [0, 1) | `=RAND()` |

**Text**

| Function | Result | Example |
| --- | --- | --- |
| `CONCAT(…)` | Joins the arguments as text | `=CONCAT("ID-",B1)` |
| `UPPER(t)` / `LOWER(t)` / `TRIM(t)` | Uppercase / lowercase / trim spaces | `=UPPER(A1)` |
| `LEN(t)` | Length in characters | `=LEN(A1)` |
| `LEFT(t,n)` / `RIGHT(t,n)` | First / last `n` characters | `=LEFT(A1,3)` |
| `MID(t,start,n)` | Substring from `start` (1-based) | `=MID(A1,2,4)` |
| `FIND(what, t, [start])` | Position (1-based) of `what` in `t` | `=FIND("-",A1)` |
| `SUBSTITUTE(t,old,new,[n])` | Replaces all — or the `n`-th — occurrence | `=SUBSTITUTE(A1,"-"," ")` |
| `REPLACE(t,start,n,new)` | Replaces `n` chars at `start` | `=REPLACE(A1,1,3,"X")` |

**Dates & time (ISO)**

| Function | Result | Example |
| --- | --- | --- |
| `TODAY()` / `NOW()` | Current date / date+time (ISO) | `=TODAY()` |
| `DATE(y,m,d)` | Date from year / month / day | `=DATE(2026,9,7)` |
| `YEAR(d)` / `MONTH(d)` / `DAY(d)` | Part of a date | `=MONTH(A1)` |
| `EDATE(d, months)` | Date shifted by months | `=EDATE(A1,3)` |
| `WEEKDAY(d, [type])` | 1=Sun…7=Sat (type 1) · 1=Mon…7=Sun (2) · 0=Mon…6=Sun (3) | `=WEEKDAY(A1,2)` |
| `EOMONTH(d, months)` | Last day of the month shifted by `months` | `=EOMONTH(A1,1)` |
| `DATEDIF(a, b, unit)` | Days / months / years between dates (D, M, Y, MD, YD) | `=DATEDIF(A1,B1,"D")` |
| `TEXT(v, format)` | Format a number (`0.00`, `0%`) or ISO date (`YYYY-MM-DD HH:mm`…) | `=TEXT(A1,"DD/MM/YYYY")` |

**Conversion & info**

| Function | Result | Example |
| --- | --- | --- |
| `VALUE(t)` / `N(v)` | Coerce to a number | `=VALUE(A1)` |
| `ISBLANK(v)` / `ISNUMBER(v)` / `ISTEXT(v)` | Type checks | `=IF(ISBLANK(A1),"—",A1)` |

### Errors

| Error | Cause |
| --- | --- |
| `#DIV/0!` | Division by zero |
| `#NAME?` | Unknown function or column name |
| `#VALUE!` | Wrong type (text where a number is expected, array in a scalar context) |
| `#REF!` | Reference outside the grid |
| `#CYCLE!` | Circular reference (a formula that refers to itself) |
| `#ERROR!` | Syntax error / unparsable formula |

Errors are displayed in **red**; wrap a risky formula in `IFERROR` to provide a
fallback. As you type inside the cell or the **fx bar**, a **suggestion list**
of functions appears (`↑`/`↓` navigate, `Tab` accepts, `Esc` dismisses). Still
not implemented: `XLOOKUP`, array formulas and cross-sheet references.

## Context menu, formatting & autofill

**Right-click** a cell, a row number or a column letter to open the context
menu: cut / copy / paste, insert rows above / below and columns left / right,
delete the selected rows or columns, sort, toggle **bold** / **italic**, pick a
**fill** or **text color** from the swatches, or clear the formatting. Cell
formatting is stored on the sheet (not in the row data) and joins the undo
history.

Select one or two cells and drag the **small square** at the bottom-right
corner of the selection to **fill** in any direction (up / down / left / right):
two numeric or date seeds create a series (1, 2, 3… / day steps) toward the
bottom / right, other values are copied and **formula references shift** with
the destination. Hold **Ctrl** while dragging to force a plain copy (no series);
`fillFormatsDown()` duplicates the first row's formatting across the selection.
Drag the bottom edge of a **row number** to resize the row.

The **status bar** at the bottom shows the active cell, the selection size and
the live **Σ / mean / count** of the selected numeric values, plus **zoom**
controls (− , `%` , +, reset on click of the percentage).

::prose-show-case
:dnax-demo-spreadsheet{demo="power"}

#code

```vue
<q-spreadsheet
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
-->
```
::

## Filters & freeze panes

Click the **funnel icon** in a column header to filter rows by value (search
box, checkboxes, per-value counts — auto-applied, and the arrows keys skip
hidden rows). Values typed in `select` columns are shown as their badge label.
Filtering works together with selection, editing, formulas and undo. This demo
starts pre-filtered to **IT** — open the funnel on the Department column to
change it.

::prose-show-case
:dnax-demo-spreadsheet{demo="filter"}

#code

```vue
<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="260px"
  bordered
/>
```
::

`frozen-rows` and `frozen-cols` pin the first rows / columns while scrolling
(freeze panes) — useful for wide datasets where headers or the first column
must stay visible.

::prose-show-case
:dnax-demo-spreadsheet{demo="freeze"}

#code

```vue
<q-spreadsheet
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
-->
```
::

## Workbook (sheets) & export

Pass `v-model:sheets` (array of `{ key, name, columns?, rows? }`) to turn the
component into a **multi-sheet workbook**: click a tab to switch, double-click
to rename, `+` to add a sheet, `×` to remove one (keeps at least one). Tabs sit
at the **top** by default; use `sheets-position="bottom"` to put them under the
grid (Excel-style). The whole UI (context menu, find, filters, conditional
formatting, status bar…) is localized with `lang="en"` (default) or
`lang="fr"`. Each sheet keeps its own rows, columns, formatting, column widths,
row heights and filters; undo history resets when switching.

::prose-show-case
:dnax-demo-spreadsheet{demo="sheets"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
// des clés des rows, et l'ajout via l'onglet « + » crée une feuille vide.
</script>

<template>
  <q-spreadsheet
    v-model:sheets="sheets"
    height="240px"
    bordered
  />

  <!--
    • Click a tab to switch sheets; double-click to rename; + adds one.
    • sheets-position="bottom" place les onglets sous la grille (style Excel).
    • Each sheet keeps its own rows, columns, formatting, widths, filters and
      row heights. Switching is live and undo history resets per sheet.
  -->
</template>
```
::

**Serialization**: `toJSON()` returns the whole workbook (rows + columns +
formats + widths + filters), `loadDocument()` restores it, `exportCsv()` /
`exportJson()` download the current sheet / the workbook, `getCsv()` returns
the CSV string (values as displayed, quoted when needed).

::prose-show-case
:dnax-demo-spreadsheet{demo="export"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const sheets = ref([ /* … comme ci-dessus … */ ])
const grid = ref()
const json = ref("")

const onLoad = () => grid.value?.loadDocument(json.value)

// toJSON() → chaîne JSON du classeur ; exportCsv()/exportJson() téléchargent ;
// getCsv() renvoie le CSV de la feuille active.
</script>

<template>
  <q-spreadsheet ref="grid" v-model:sheets="sheets" />
  <q-btn label="JSON" @click="json = grid.toJSON()" />
  <q-btn label="Download CSV" @click="grid.exportCsv()" />
  <q-btn label="Download JSON" @click="grid.exportJson()" />
  <q-btn label="Reload" @click="grid.loadDocument(json)" />
</template>

<!-- expose aussi : getCsv(), activeSheetName (computed via ref) -->
```
::

## Find & Replace, CSV import, clipboard

Press `Ctrl`+`F` (or the magnifier icon in the toolbar) to open **Find &
Replace**: next / previous match, replace one or all — matches are highlighted
in the grid. Methods: `importCsv(text, { headers })` replaces the active sheet
from a CSV (first row = column names when `headers: true`), `copyFormulas()`
copies the raw cell sources (formulas kept) and `pasteTransposed()` pastes the
clipboard transposed (rows ↔ columns).

::prose-show-case
:dnax-demo-spreadsheet{demo="findImport"}

#code

```vue
<q-spreadsheet
  ref="grid"
  v-model:rows="rows"
  :columns="columns"
  height="200px"
  bordered
/>

<q-btn label="Import sample CSV" @click="grid.importCsv(CSV_SAMPLE, { headers: true })" />

<!--
  • Ctrl+F or the toolbar magnifier: Find & Replace (next / previous, replace one / all).
  • grid.importFile() / grid.importCsv(text, { delimiter, headers }) replace the
    active sheet (CSV / TSV / JSON).
  • grid.copyFormulas() copies sources; grid.pasteValues() pastes VALUES
    ("=…" as literal text); grid.pasteTransposed() transposes rows ↔ columns.
-->
```
::

## Cell layout, conditional formatting & validation

**Layout** (right-click menu) : `Wrap text` wraps on several lines and grows
the row height; `Merge cells` merges the selection (top-left value is shown),
`Unmerge` splits it back; `Hide rows / columns` hides (keyboard navigation
skips them) — “Show all hidden” and the list of hidden columns live in the
menu. Drag a **row number** or a **column header** to reorder.

**Widths** — the row-number gutter is a fixed **34px** (sized for integers), and
column widths (`columns[].width`, `default-col-width`, or dragging the edge of a
column header) are respected **exactly**: the grid is only as wide as its columns,
so a narrow sheet no longer stretches to fill the frame — the leftover area on the
right stays empty, like a spreadsheet.

**Conditional formatting** (highlighter icon in the toolbar): rule on the
selection or a **whole column** (“Column” checkbox), with conditions
`greater than / ≥ / < / ≤ / equal / contains / blank / not blank / formula (A1) / always`.
Three renders: **fill** (background), **data bar** (bar proportional to the
column min/max), **color scale** (gradient between two colors). Rules
recalculate live, can be edited by clicking a chip and are part of `toJSON()`.

**Validation** — `columns.validation`: `min`, `max`, `integer`, `pattern`,
`required` (empty rejected), `list` (allowed values), `message`; plus the
`validators` prop for **cell ranges**: `[{ r0, c0, r1, c1, validation }]`.
Invalid input is rejected, the cell turns red and the message shows as a
tooltip. Try typing `150` in Score here.

::prose-show-case
:dnax-demo-spreadsheet{demo="layout"}

#code

```vue
<q-spreadsheet
  ref="grid"
  v-model:rows="rows"
  :columns="columns"
  height="230px"
  bordered
/>

<!--
  • Right-click a cell → Wrap text, Merge cells, Unmerge, Hide rows/columns,
    drag a row number / column header to reorder.
  • Toolbar highlighter → Conditional formatting (fill / data bar / color scale,
    whole-column or formula rules).
  • columns.validation + validators prop (ranges): min, max, integer, pattern,
    required, list — invalid input is rejected and the cell turns red.
-->
```
::

## Events

`cell-change` fires on every committed edit (with `oldValue`/`newValue`),
`selection-change` on every move (with the range size) and `structure-change`
when rows or columns are added / removed / sorted (reason + `update:rows`). Try
the undo / redo buttons.

::prose-show-case
:dnax-demo-spreadsheet{demo="events"}

#code

```vue
<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="230px"
  flat
  @cell-change="log = 'cell-change …'"
  @selection-change="log = 'selection …'"
  @structure-change="log = 'structure …'"
/>
```
::

## Keyboard & large datasets

| Shortcut | Action |
| --- | --- |
| `Home` / `End` | First / last column of the current row |
| `Ctrl`+`Home` / `Ctrl`+`End` | Top-left corner / last used cell |
| `PageUp` / `PageDown` | One viewport of rows up / down |
| `Ctrl`+`←↑→↓` | Jump to the edge of the current data block |
| `Ctrl`+`D` | Fill the selection with the row above |
| `Ctrl`+`R` | Fill the selection with the column on the left |
| Double-click the fill handle | Fill down until the end of the neighbouring data |
| `Tab` in a formula | Accept the highlighted function suggestion |

Rows are **virtualized by default** (`virtual-scroll` is always on): beyond
~150 visible rows only the on-screen slice is rendered (with top / bottom
spacers), so tens of thousands of rows scroll smoothly. Virtualization is set
aside automatically only when the grid requires it (frozen rows or merged
cells).

::prose-show-case
:dnax-demo-spreadsheet{demo="big"}

#code

```vue
<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="40vh"
  bordered
/>

<!-- 2 000 records → seules les lignes visibles sont rendues (virtualisation) -->
```
::

## Variants & states

`toolbar`, `row-numbers` and `column-headers` toggle chrome parts; `dense`
tightens paddings; `readonly` keeps the text selectable / copyable but blocks
editing; `disable` additionally greys everything and blocks pointer events.

::prose-show-case
:dnax-demo-spreadsheet{demo="variants"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

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
])
</script>

<template>
  <q-spreadsheet
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
  />
</template>
```
::

## Data model — rows · columns · sheets

### Rows — how values are stored

`rows` is an array of plain objects, one per row. Keys are the **column
names**; the value shape depends on the column `type`:

| Column type | Stored value | Example |
| --- | --- | --- |
| `string` / `text` | string | `"Ada"` |
| `number` | number | `18.5` |
| `integer` | whole number (truncated on input) | `39` |
| `email` / `url` | string | `"ada@dnax.dev"` |
| `boolean` | true / false | `true` |
| `date` | ISO `YYYY-MM-DD` | `"2026-12-31"` |
| `datetime` | ISO `YYYY-MM-DDTHH:mm` | `"2026-09-07T09:30"` |
| `select` | the option `value` (not its label) | `"tea"` |
| any | formula source when it starts with `=` (displayed = result) | `"=B1*C1"` |
| empty | `null` | `null` |

```ts
const rows = [
  { firstName: "Ada", age: 36, email: "ada@dnax.dev", hired: "2020-03-01", dept: "it", total: "=B1*C1" },
  { firstName: "Grace", age: 85, email: "grace@dnax.dev", hired: "1945-01-01", dept: "finance", total: null },
]
```

### Columns — the schema

`columns` is an array of column descriptors (the header letters A, B, C…
follow the array order).

| Column key | Type | Purpose |
| --- | --- | --- |
| `name` | string · required | Key of the property in each row |
| `label` | string | Header text (defaults to `name`) |
| `width` | number · string | Column width (px or CSS) — draggable on the header |
| `minWidth` / `maxWidth` | number | Resize bounds (60 / 600 default) |
| `type` | `string`, `text`, `number`, `integer`, `email`, `url`, `date`, `datetime`, `boolean`, `select` | Editor & stored format (see table above) |
| `editable` | boolean · default `true` | `false` locks the column |
| `align` | `left` / `center` / `right` | Text alignment (numbers right by default) |
| `options` | `{ value, label, color? }[]` | For `select` — chips with `chip: true` |
| `chip` | boolean | Renders `select` values as colored badges |
| `validation` | `{ min?, max?, integer?, pattern?, message? }` | Input validation (rejects & marks the cell red) |
| `format` | `(value, row) => any` | Display formatter (stored value untouched) |
| `cellClass` / `cellBackground` | `(value, row) => …` | Per-cell class / background |
| `headerClass` / `headerStyle` | string | Header styling |

```ts
const columns = [
  { name: "firstName", label: "First name", type: "string", width: 130 },
  { name: "age", label: "Age", type: "integer", validation: { min: 0, max: 120 } },
  { name: "email", label: "Email", type: "email" },
  { name: "dept", label: "Department", type: "select", chip: true,
    options: [
      { value: "it", label: "IT", color: "#ede9fe" },
      { value: "finance", label: "Finance", color: "#fef9c3" },
    ] },
  { name: "total", label: "Total", type: "number", format: (v) => (v == null ? "" : "$" + v) },
]
```

### Selection · validation · sheets

**Selection** (`v-model:selected`) is `{ row, column, endRow, endColumn }` —
rows are 0-based, columns are names. **Validation by range**: the `validators`
prop takes `{ r0, c0, r1, c1, validation }[]` (same rules as column validation,
plus `required` / `list`). **Sheets** (`v-model:sheets`) is an array of
`{ key?, name?, columns?, rows? }`; the serialized document (`toJSON()`) adds
`version: 1`, `active` and per-sheet `formats` / `widths` / `rowHeights` /
`filters` / `rules` (conditional formatting) / `merges` / `hiddenRows` /
`hiddenCols`.

## API

:dnax-api{name="QSpreadsheet"}
