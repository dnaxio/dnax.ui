# Spreadsheet

> An Excel-like editable grid — typed cells, A1 formulas, filters, freeze panes, multi-sheet workbooks and CSV/JSON export.

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

<prose-show-case>
<dnax-demo-spreadsheet demo="inline">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## People & colored badges

Click a cell to select it and drag to select a range (green outline on the
anchor). Double-click, `Enter` or type to edit — the Department column
(`type: "select"`, `chip`) shows a badge per option and opens a filterable
picker while editing; the Active column (`type: "boolean"`) toggles on click.
The toolbar adds rows / columns and removes the selected ones.

<prose-show-case>
<dnax-demo-spreadsheet demo="people">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

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

<prose-show-case>
<dnax-demo-spreadsheet demo="types">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

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

<prose-show-case>
<dnax-demo-spreadsheet demo="formulas">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Syntax

A cell value that starts with `=` is a formula. Row numbers in references match
the numbers shown in the row header (row 1 = first row). The raw source stays
in the row data — only the *result* is displayed (hover the cell to see the
source).

<table>
<thead>
  <tr>
    <th>
      Syntax
    </th>
    
    <th>
      Meaning
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        A1
      </code>
    </td>
    
    <td>
      Cell reference (column letter + row)
    </td>
    
    <td>
      <code>
        =B1*C1
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $A$1
      </code>
      
      , <code>
        $A1
      </code>
      
      , <code>
        A$1
      </code>
    </td>
    
    <td>
      Absolute reference — does not shift when copied / filled
    </td>
    
    <td>
      <code>
        =D1/$D$5
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        A1:C3
      </code>
    </td>
    
    <td>
      Range (rectangular block) — for aggregations
    </td>
    
    <td>
      <code>
        =SUM(D1:D4)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        name
      </code>
    </td>
    
    <td>
      Column reference on the current row
    </td>
    
    <td>
      <code>
        =price * quantity
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        "text"
      </code>
      
       / <code>
        'text'
      </code>
    </td>
    
    <td>
      String literal
    </td>
    
    <td>
      <code>
        =IF(B1>10,"big","small")
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        10%
      </code>
    </td>
    
    <td>
      Postfix percent
    </td>
    
    <td>
      <code>
        =A1*10%
      </code>
    </td>
  </tr>
</tbody>
</table>

### Operators

Arithmetic `+ - * / ^` · postfix `%` · text concatenation `&` · comparisons
`= <> < > <= >=` · parentheses · unary `+/-`. Empty cells and blank text act as
`0` in arithmetic and as `""` in text / comparisons.

### Functions

**Aggregation**

<table>
<thead>
  <tr>
    <th>
      Function
    </th>
    
    <th>
      Result
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        SUM(…)
      </code>
    </td>
    
    <td>
      Sum of the numeric arguments (ranges flatten)
    </td>
    
    <td>
      <code>
        =SUM(D1:D4)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        AVERAGE(…)
      </code>
      
       / <code>
        AVG(…)
      </code>
    </td>
    
    <td>
      Arithmetic mean of numeric values
    </td>
    
    <td>
      <code>
        =AVERAGE(A1:A3)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        MIN(…)
      </code>
      
       / <code>
        MAX(…)
      </code>
    </td>
    
    <td>
      Smallest / largest numeric value
    </td>
    
    <td>
      <code>
        =MAX(C1:C5)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        COUNT(…)
      </code>
    </td>
    
    <td>
      Count of numeric cells
    </td>
    
    <td>
      <code>
        =COUNT(B1:B10)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        COUNTA(…)
      </code>
    </td>
    
    <td>
      Count of non-empty cells
    </td>
    
    <td>
      <code>
        =COUNTA(A1:A10)
      </code>
    </td>
  </tr>
</tbody>
</table>

**Logic (lazy)**

<table>
<thead>
  <tr>
    <th>
      Function
    </th>
    
    <th>
      Result
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IF(cond, a, b)
      </code>
    </td>
    
    <td>
      <code>
        a
      </code>
      
       if true, <code>
        b
      </code>
      
       (or FALSE) otherwise — only the taken branch is evaluated
    </td>
    
    <td>
      <code>
        =IF(B1>10,"big","small")
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IFERROR(v, fallback)
      </code>
    </td>
    
    <td>
      <code>
        v
      </code>
      
      , or <code>
        fallback
      </code>
      
       when <code>
        v
      </code>
      
       is an error
    </td>
    
    <td>
      <code>
        =IFERROR(A1/B1,0)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        AND(…)
      </code>
      
       / <code>
        OR(…)
      </code>
    </td>
    
    <td>
      Logical AND / OR (short-circuit)
    </td>
    
    <td>
      <code>
        =IF(AND(B1>0,C1>0),"ok","ko")
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        NOT(v)
      </code>
    </td>
    
    <td>
      Logical negation
    </td>
    
    <td>
      <code>
        =NOT(A1>5)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IFS(c1,v1,c2,v2…)
      </code>
    </td>
    
    <td>
      First true condition wins (lazy)
    </td>
    
    <td>
      <code>
        =IFS(A1>10,"big",A1>5,"mid",TRUE,"small")
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        SWITCH(e,v1,r1,…,d)
      </code>
    </td>
    
    <td>
      First matching value → result (lazy)
    </td>
    
    <td>
      <code>
        =SWITCH(B1,"a",1,"b",2,0)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IFNA(v, fallback)
      </code>
    </td>
    
    <td>
      Fallback on <code>
        #N/A
      </code>
      
       only
    </td>
    
    <td>
      <code>
        =IFNA(VLOOKUP(A1,D1:F9,2),"?")
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        VLOOKUP(key, range, col, [approx])
      </code>
    </td>
    
    <td>
      Exact match in the 1st column of a range, returns the <code>
        col
      </code>
      
      -th cell
    </td>
    
    <td>
      <code>
        =VLOOKUP(A1,D1:F9,2)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        XLOOKUP(key, table, ret, [fallback])
      </code>
    </td>
    
    <td>
      Exact match in <code>
        table
      </code>
      
      , returns the cell from <code>
        ret
      </code>
      
       on the same row
    </td>
    
    <td>
      <code>
        =XLOOKUP(A1,D1:D9,F1:F9,"?")
      </code>
    </td>
  </tr>
</tbody>
</table>

**Math**

<table>
<thead>
  <tr>
    <th>
      Function
    </th>
    
    <th>
      Result
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        ABS(n)
      </code>
    </td>
    
    <td>
      Absolute value
    </td>
    
    <td>
      <code>
        =ABS(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ROUND(n, d)
      </code>
    </td>
    
    <td>
      Round to <code>
        d
      </code>
      
       decimals
    </td>
    
    <td>
      <code>
        =ROUND(A1,2)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ROUNDUP(n, d)
      </code>
      
       / <code>
        ROUNDDOWN(n, d)
      </code>
    </td>
    
    <td>
      Round away / toward zero
    </td>
    
    <td>
      <code>
        =ROUNDUP(A1,0)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        FLOOR(n)
      </code>
      
       / <code>
        CEILING(n)
      </code>
      
       / <code>
        CEIL(n)
      </code>
    </td>
    
    <td>
      Round down / up to integer
    </td>
    
    <td>
      <code>
        =CEILING(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        INT(n)
      </code>
    </td>
    
    <td>
      Integer part (truncate)
    </td>
    
    <td>
      <code>
        =INT(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        MOD(a, b)
      </code>
    </td>
    
    <td>
      Remainder of <code>
        a / b
      </code>
    </td>
    
    <td>
      <code>
        =MOD(A1,2)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        SQRT(n)
      </code>
    </td>
    
    <td>
      Square root
    </td>
    
    <td>
      <code>
        =SQRT(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        POWER(n, e)
      </code>
      
       / <code>
        POW(n, e)
      </code>
    </td>
    
    <td>
      <code>
        n
      </code>
      
       to the power <code>
        e
      </code>
    </td>
    
    <td>
      <code>
        =POWER(A1,2)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        PI()
      </code>
    </td>
    
    <td>
      π
    </td>
    
    <td>
      <code>
        =PI()
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        RAND()
      </code>
    </td>
    
    <td>
      Random number in [0, 1)
    </td>
    
    <td>
      <code>
        =RAND()
      </code>
    </td>
  </tr>
</tbody>
</table>

**Text**

<table>
<thead>
  <tr>
    <th>
      Function
    </th>
    
    <th>
      Result
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        CONCAT(…)
      </code>
    </td>
    
    <td>
      Joins the arguments as text
    </td>
    
    <td>
      <code>
        =CONCAT("ID-",B1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        UPPER(t)
      </code>
      
       / <code>
        LOWER(t)
      </code>
      
       / <code>
        TRIM(t)
      </code>
    </td>
    
    <td>
      Uppercase / lowercase / trim spaces
    </td>
    
    <td>
      <code>
        =UPPER(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        LEN(t)
      </code>
    </td>
    
    <td>
      Length in characters
    </td>
    
    <td>
      <code>
        =LEN(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        LEFT(t,n)
      </code>
      
       / <code>
        RIGHT(t,n)
      </code>
    </td>
    
    <td>
      First / last <code>
        n
      </code>
      
       characters
    </td>
    
    <td>
      <code>
        =LEFT(A1,3)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        MID(t,start,n)
      </code>
    </td>
    
    <td>
      Substring from <code>
        start
      </code>
      
       (1-based)
    </td>
    
    <td>
      <code>
        =MID(A1,2,4)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        FIND(what, t, [start])
      </code>
    </td>
    
    <td>
      Position (1-based) of <code>
        what
      </code>
      
       in <code>
        t
      </code>
    </td>
    
    <td>
      <code>
        =FIND("-",A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        SUBSTITUTE(t,old,new,[n])
      </code>
    </td>
    
    <td>
      Replaces all — or the <code>
        n
      </code>
      
      -th — occurrence
    </td>
    
    <td>
      <code>
        =SUBSTITUTE(A1,"-"," ")
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        REPLACE(t,start,n,new)
      </code>
    </td>
    
    <td>
      Replaces <code>
        n
      </code>
      
       chars at <code>
        start
      </code>
    </td>
    
    <td>
      <code>
        =REPLACE(A1,1,3,"X")
      </code>
    </td>
  </tr>
</tbody>
</table>

**Dates & time (ISO)**

<table>
<thead>
  <tr>
    <th>
      Function
    </th>
    
    <th>
      Result
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        TODAY()
      </code>
      
       / <code>
        NOW()
      </code>
    </td>
    
    <td>
      Current date / date+time (ISO)
    </td>
    
    <td>
      <code>
        =TODAY()
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DATE(y,m,d)
      </code>
    </td>
    
    <td>
      Date from year / month / day
    </td>
    
    <td>
      <code>
        =DATE(2026,9,7)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        YEAR(d)
      </code>
      
       / <code>
        MONTH(d)
      </code>
      
       / <code>
        DAY(d)
      </code>
    </td>
    
    <td>
      Part of a date
    </td>
    
    <td>
      <code>
        =MONTH(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        EDATE(d, months)
      </code>
    </td>
    
    <td>
      Date shifted by months
    </td>
    
    <td>
      <code>
        =EDATE(A1,3)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        WEEKDAY(d, [type])
      </code>
    </td>
    
    <td>
      1=Sun…7=Sat (type 1) · 1=Mon…7=Sun (2) · 0=Mon…6=Sun (3)
    </td>
    
    <td>
      <code>
        =WEEKDAY(A1,2)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        EOMONTH(d, months)
      </code>
    </td>
    
    <td>
      Last day of the month shifted by <code>
        months
      </code>
    </td>
    
    <td>
      <code>
        =EOMONTH(A1,1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DATEDIF(a, b, unit)
      </code>
    </td>
    
    <td>
      Days / months / years between dates (D, M, Y, MD, YD)
    </td>
    
    <td>
      <code>
        =DATEDIF(A1,B1,"D")
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TEXT(v, format)
      </code>
    </td>
    
    <td>
      Format a number (<code>
        0.00
      </code>
      
      , <code>
        0%
      </code>
      
      ) or ISO date (<code>
        YYYY-MM-DD HH:mm
      </code>
      
      …)
    </td>
    
    <td>
      <code>
        =TEXT(A1,"DD/MM/YYYY")
      </code>
    </td>
  </tr>
</tbody>
</table>

**Conversion & info**

<table>
<thead>
  <tr>
    <th>
      Function
    </th>
    
    <th>
      Result
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        VALUE(t)
      </code>
      
       / <code>
        N(v)
      </code>
    </td>
    
    <td>
      Coerce to a number
    </td>
    
    <td>
      <code>
        =VALUE(A1)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISBLANK(v)
      </code>
      
       / <code>
        ISNUMBER(v)
      </code>
      
       / <code>
        ISTEXT(v)
      </code>
    </td>
    
    <td>
      Type checks
    </td>
    
    <td>
      <code>
        =IF(ISBLANK(A1),"—",A1)
      </code>
    </td>
  </tr>
</tbody>
</table>

### Errors

<table>
<thead>
  <tr>
    <th>
      Error
    </th>
    
    <th>
      Cause
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        #DIV/0!
      </code>
    </td>
    
    <td>
      Division by zero
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #NAME?
      </code>
    </td>
    
    <td>
      Unknown function or column name
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #VALUE!
      </code>
    </td>
    
    <td>
      Wrong type (text where a number is expected, array in a scalar context)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #REF!
      </code>
    </td>
    
    <td>
      Reference outside the grid
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #CYCLE!
      </code>
    </td>
    
    <td>
      Circular reference (a formula that refers to itself)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #ERROR!
      </code>
    </td>
    
    <td>
      Syntax error / unparsable formula
    </td>
  </tr>
</tbody>
</table>

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

<prose-show-case>
<dnax-demo-spreadsheet demo="power">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Filters & freeze panes

Click the **funnel icon** in a column header to filter rows by value (search
box, checkboxes, per-value counts — auto-applied, and the arrows keys skip
hidden rows). Values typed in `select` columns are shown as their badge label.
Filtering works together with selection, editing, formulas and undo. This demo
starts pre-filtered to **IT** — open the funnel on the Department column to
change it.

<prose-show-case>
<dnax-demo-spreadsheet demo="filter">



</dnax-demo-spreadsheet>

<template v-slot:code="">

```vue
<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="260px"
  bordered
/>
```

</template>
</prose-show-case>

`frozen-rows` and `frozen-cols` pin the first rows / columns while scrolling
(freeze panes) — useful for wide datasets where headers or the first column
must stay visible.

<prose-show-case>
<dnax-demo-spreadsheet demo="freeze">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Workbook (sheets) & export

Pass `v-model:sheets` (array of `{ key, name, columns?, rows? }`) to turn the
component into a **multi-sheet workbook**: click a tab to switch, double-click
to rename, `+` to add a sheet, `×` to remove one (keeps at least one). Tabs sit
at the **top** by default; use `sheets-position="bottom"` to put them under the
grid (Excel-style). The whole UI (context menu, find, filters, conditional
formatting, status bar…) is localized with `lang="en"` (default) or
`lang="fr"`. Each sheet keeps its own rows, columns, formatting, column widths,
row heights and filters; undo history resets when switching.

<prose-show-case>
<dnax-demo-spreadsheet demo="sheets">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

**Serialization**: `toJSON()` returns the whole workbook (rows + columns +
formats + widths + filters), `loadDocument()` restores it, `exportCsv()` /
`exportJson()` download the current sheet / the workbook, `getCsv()` returns
the CSV string (values as displayed, quoted when needed).

<prose-show-case>
<dnax-demo-spreadsheet demo="export">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Find & Replace, CSV import, clipboard

Press `Ctrl`+`F` (or the magnifier icon in the toolbar) to open **Find &
Replace**: next / previous match, replace one or all — matches are highlighted
in the grid. Methods: `importCsv(text, { headers })` replaces the active sheet
from a CSV (first row = column names when `headers: true`), `copyFormulas()`
copies the raw cell sources (formulas kept) and `pasteTransposed()` pastes the
clipboard transposed (rows ↔ columns).

<prose-show-case>
<dnax-demo-spreadsheet demo="findImport">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Cell layout, conditional formatting & validation

**Layout** (right-click menu) : `Wrap text` wraps on several lines and grows
the row height; `Merge cells` merges the selection (top-left value is shown),
`Unmerge` splits it back; `Hide rows / columns` hides (keyboard navigation
skips them) — “Show all hidden” and the list of hidden columns live in the
menu. Drag a **row number** or a **column header** to reorder.

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

<prose-show-case>
<dnax-demo-spreadsheet demo="layout">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Events

`cell-change` fires on every committed edit (with `oldValue`/`newValue`),
`selection-change` on every move (with the range size) and `structure-change`
when rows or columns are added / removed / sorted (reason + `update:rows`). Try
the undo / redo buttons.

<prose-show-case>
<dnax-demo-spreadsheet demo="events">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Keyboard & large datasets

<table>
<thead>
  <tr>
    <th>
      Shortcut
    </th>
    
    <th>
      Action
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        Home
      </code>
      
       / <code>
        End
      </code>
    </td>
    
    <td>
      First / last column of the current row
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        Ctrl
      </code>
      
      +<code>
        Home
      </code>
      
       / <code>
        Ctrl
      </code>
      
      +<code>
        End
      </code>
    </td>
    
    <td>
      Top-left corner / last used cell
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        PageUp
      </code>
      
       / <code>
        PageDown
      </code>
    </td>
    
    <td>
      One viewport of rows up / down
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        Ctrl
      </code>
      
      +<code>
        ←↑→↓
      </code>
    </td>
    
    <td>
      Jump to the edge of the current data block
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        Ctrl
      </code>
      
      +<code>
        D
      </code>
    </td>
    
    <td>
      Fill the selection with the row above
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        Ctrl
      </code>
      
      +<code>
        R
      </code>
    </td>
    
    <td>
      Fill the selection with the column on the left
    </td>
  </tr>
  
  <tr>
    <td>
      Double-click the fill handle
    </td>
    
    <td>
      Fill down until the end of the neighbouring data
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        Tab
      </code>
      
       in a formula
    </td>
    
    <td>
      Accept the highlighted function suggestion
    </td>
  </tr>
</tbody>
</table>

Rows are **virtualized by default** (`virtual-scroll` is always on): beyond
~150 visible rows only the on-screen slice is rendered (with top / bottom
spacers), so tens of thousands of rows scroll smoothly. Virtualization is set
aside automatically only when the grid requires it (frozen rows or merged
cells).

<prose-show-case>
<dnax-demo-spreadsheet demo="big">



</dnax-demo-spreadsheet>

<template v-slot:code="">

```vue
<q-spreadsheet
  v-model:rows="rows"
  :columns="columns"
  height="40vh"
  bordered
/>

<!-- 2 000 records → seules les lignes visibles sont rendues (virtualisation) -->
```

</template>
</prose-show-case>

## Variants & states

`toolbar`, `row-numbers` and `column-headers` toggle chrome parts; `dense`
tightens paddings; `readonly` keeps the text selectable / copyable but blocks
editing; `disable` additionally greys everything and blocks pointer events.

<prose-show-case>
<dnax-demo-spreadsheet demo="variants">



</dnax-demo-spreadsheet>

<template v-slot:code="">

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

</template>
</prose-show-case>

## Data model — rows · columns · sheets

### Rows — how values are stored

`rows` is an array of plain objects, one per row. Keys are the **column
names**; the value shape depends on the column `type`:

<table>
<thead>
  <tr>
    <th>
      Column type
    </th>
    
    <th>
      Stored value
    </th>
    
    <th>
      Example
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        string
      </code>
      
       / <code>
        text
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      <code>
        "Ada"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      number
    </td>
    
    <td>
      <code>
        18.5
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        integer
      </code>
    </td>
    
    <td>
      whole number (truncated on input)
    </td>
    
    <td>
      <code>
        39
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        email
      </code>
      
       / <code>
        url
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      <code>
        "ada@dnax.dev"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      true / false
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        date
      </code>
    </td>
    
    <td>
      ISO <code>
        YYYY-MM-DD
      </code>
    </td>
    
    <td>
      <code>
        "2026-12-31"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        datetime
      </code>
    </td>
    
    <td>
      ISO <code>
        YYYY-MM-DDTHH:mm
      </code>
    </td>
    
    <td>
      <code>
        "2026-09-07T09:30"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        select
      </code>
    </td>
    
    <td>
      the option <code>
        value
      </code>
      
       (not its label)
    </td>
    
    <td>
      <code>
        "tea"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      any
    </td>
    
    <td>
      formula source when it starts with <code>
        =
      </code>
      
       (displayed = result)
    </td>
    
    <td>
      <code>
        "=B1*C1"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      empty
    </td>
    
    <td>
      <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        null
      </code>
    </td>
  </tr>
</tbody>
</table>

```ts
const rows = [
  { firstName: "Ada", age: 36, email: "ada@dnax.dev", hired: "2020-03-01", dept: "it", total: "=B1*C1" },
  { firstName: "Grace", age: 85, email: "grace@dnax.dev", hired: "1945-01-01", dept: "finance", total: null },
]
```

### Columns — the schema

`columns` is an array of column descriptors (the header letters A, B, C…
follow the array order).

<table>
<thead>
  <tr>
    <th>
      Column key
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Purpose
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        name
      </code>
    </td>
    
    <td>
      string · required
    </td>
    
    <td>
      Key of the property in each row
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        label
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      Header text (defaults to <code>
        name
      </code>
      
      )
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        width
      </code>
    </td>
    
    <td>
      number · string
    </td>
    
    <td>
      Column width (px or CSS) — draggable on the header
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        minWidth
      </code>
      
       / <code>
        maxWidth
      </code>
    </td>
    
    <td>
      number
    </td>
    
    <td>
      Resize bounds (60 / 600 default)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        type
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
      
      , <code>
        text
      </code>
      
      , <code>
        number
      </code>
      
      , <code>
        integer
      </code>
      
      , <code>
        email
      </code>
      
      , <code>
        url
      </code>
      
      , <code>
        date
      </code>
      
      , <code>
        datetime
      </code>
      
      , <code>
        boolean
      </code>
      
      , <code>
        select
      </code>
    </td>
    
    <td>
      Editor & stored format (see table above)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        editable
      </code>
    </td>
    
    <td>
      boolean · default <code>
        true
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
      
       locks the column
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        align
      </code>
    </td>
    
    <td>
      <code>
        left
      </code>
      
       / <code>
        center
      </code>
      
       / <code>
        right
      </code>
    </td>
    
    <td>
      Text alignment (numbers right by default)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        options
      </code>
    </td>
    
    <td>
      <code>
        { value, label, color? }[]
      </code>
    </td>
    
    <td>
      For <code>
        select
      </code>
      
       — chips with <code>
        chip: true
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        chip
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Renders <code>
        select
      </code>
      
       values as colored badges
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        validation
      </code>
    </td>
    
    <td>
      <code>
        { min?, max?, integer?, pattern?, message? }
      </code>
    </td>
    
    <td>
      Input validation (rejects & marks the cell red)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        format
      </code>
    </td>
    
    <td>
      <code>
        (value, row) => any
      </code>
    </td>
    
    <td>
      Display formatter (stored value untouched)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cellClass
      </code>
      
       / <code>
        cellBackground
      </code>
    </td>
    
    <td>
      <code>
        (value, row) => …
      </code>
    </td>
    
    <td>
      Per-cell class / background
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        headerClass
      </code>
      
       / <code>
        headerStyle
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      Header styling
    </td>
  </tr>
</tbody>
</table>

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

<dnax-api name="QSpreadsheet">



</dnax-api>
