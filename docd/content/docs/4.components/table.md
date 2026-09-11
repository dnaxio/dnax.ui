---
title: Table
description: Tabular data with client-side sorting, pagination and row selection
  — virtual scroll, pinned columns and cell slots.
navigation:
  icon: lucide:table
seo:
  title: Table (QTable)
  description: QTable — a data table (columns, sorting, pagination, selection,
    virtual scroll, pinned columns) with a Quasar-like API.
---

**`<q-table>`** displays tabular data with client-side sorting, pagination and
row selection — a shadcn-style data table with a Quasar-like API. Columns are
declared declaratively (`name`, `label`, `field`, `sortable`), rows are plain
objects, and each cell can be overridden with a `body-cell-<name>` slot. Wiring
`@request` switches to server-side pagination and sorting.

## QTable — data table

::prose-show-case
:dnax-demo-table{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

const pagination = ref({ sortBy: null, descending: false, page: 1, rowsPerPage: 3 })
</script>

<template>
  <q-table
    :rows="rows"
    :columns="columns"
    title="Team members"
    flat
    bordered
    v-model:pagination="pagination"
    :rows-per-page-options="[3, 5, 10]"
  />
</template>
```
::

### Dense & selection

::prose-show-case
:dnax-demo-table{demo="selection"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

const selected = ref([])
</script>

<template>
  <q-table
    v-model:selected="selected"
    selection="multiple"
    :rows="rows"
    :columns="columns"
    dense
    flat
    bordered
    separator="cell"
  />
  <p class="demo-p demo-table-count">{{ selected.length }} row(s) selected.</p>
</template>
```
::

### Sorting

Mark a column `sortable` to enable sorting — click the header to sort, click
again to reverse. The state is exposed through `v-model:pagination` (`sortBy` /
`descending`) and `@update:sorting`; wiring `@request` delegates it to the server.

::prose-show-case
:dnax-demo-table{demo="sort"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const sortColumns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role", sortable: true },
  { name: "email", label: "Email", field: "email", sortable: true },
  { name: "status", label: "Status", field: "status", sortable: true },
]

const pagination = ref({ sortBy: null, descending: false, page: 1, rowsPerPage: 5 })
</script>

<template>
  <q-table
    v-model:pagination="pagination"
    :rows="rows"
    :columns="sortColumns"
    flat
    bordered
    dense
  />
  <p class="demo-p demo-table-count">
    Sorted by <code>{{ pagination.sortBy || "—" }}</code>
    {{ pagination.descending ? "↓" : "↑" }}
  </p>
</template>
```
::

### Colored headers

Style all headers with `header-style` / `header-class` (solid colors are needed
when the header is sticky, so rows don't show through), or override a single
column with its own `header-style` / `header-class`.

::prose-show-case
:dnax-demo-table{demo="header"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]
</script>

<template>
  <q-table
    :rows="rows"
    :columns="columns"
    flat
    bordered
    dense
    header-style="background: rgb(25 118 210 / 0.12); font-weight: 700;"
  />

  <!-- per-column override with header-style / header-class -->
  <q-table :rows="rows" :columns="columns" flat bordered />
</template>
```
::

### Pinned columns

Set `pinned: "left" | "right"` on a column to keep it visible while the table
scrolls horizontally — the classic fixed **Actions** column on the right (with an
opaque background so rows don't show through). When a column is pinned left, the
**selection column** pins too. Combine with `max-height` for a scrollable
container.

::prose-show-case
:dnax-demo-table{demo="pinned"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const pinnedRows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active", joined: "2024-01-12", lastLogin: "2h ago" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active", joined: "2023-11-03", lastLogin: "15m ago" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive", joined: "2024-04-20", lastLogin: "3d ago" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active", joined: "2022-09-15", lastLogin: "1h ago" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive", joined: "2023-06-30", lastLogin: "1w ago" },
]

const pinnedColumns = [
  { name: "name", label: "Name", field: "name", pinned: "left", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email" },
  { name: "status", label: "Status", field: "status" },
  { name: "joined", label: "Joined", field: "joined" },
  { name: "lastLogin", label: "Last login", field: "lastLogin" },
  { name: "actions", label: "Actions", field: "actions", pinned: "right" },
]
</script>

<template>
  <q-table
    :rows="pinnedRows"
    :columns="pinnedColumns"
    max-height="320px"
    flat
    bordered
    dense
  >
    <template #body-cell-actions="{ row }">
      <q-btn flat dense round icon="lucide:pencil" aria-label="Edit" />
      <q-btn flat dense round icon="lucide:trash-2" color="negative" aria-label="Delete" />
    </template>
  </q-table>
  <!-- name pinned left, actions pinned right — they stay visible while the table scrolls horizontally -->
</template>
```
::

### Pins + virtual scroll + selection

Pins compose with `virtual-scroll` and `selection`: here the selection column and
Name are pinned left, Actions is pinned right, over **1000 virtualized rows**.

::prose-show-case
:dnax-demo-table{demo="pinnedVirtual"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

// 1000 rows for the virtual-scroll demos
const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: "User " + (i + 1),
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: "user" + (i + 1) + "@dnax.dev",
  status: i % 4 === 0 ? "Inactive" : "Active",
}))

const pinnedBigColumns = [
  { name: "name", label: "Name", field: "name", pinned: "left", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email" },
  { name: "status", label: "Status", field: "status" },
  { name: "actions", label: "Actions", field: "actions", pinned: "right" },
]

const selected = ref([])
</script>

<template>
  <q-table
    v-model:selected="selected"
    selection="multiple"
    :rows="bigRows"
    :columns="pinnedBigColumns"
    max-height="320px"
    virtual-scroll
    dense
    flat
    bordered
  >
    <template #body-cell-actions="{ row }">
      <q-btn flat dense round icon="lucide:eye" aria-label="View" />
      <q-btn flat dense round icon="lucide:trash-2" color="negative" aria-label="Delete" />
    </template>
  </q-table>
  <!-- pins work with virtual scroll + selection over 1000 rows -->
</template>
```
::

### Separators

`separator` controls the row/column lines: `horizontal` (default), `vertical`,
`cell` (both) or `none`.

::prose-show-case
:dnax-demo-table{demo="separators"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]
</script>

<template>
  <q-table :rows="rows" :columns="columns" flat bordered separator="horizontal" />
  <q-table :rows="rows" :columns="columns" flat bordered separator="vertical" />
  <q-table :rows="rows" :columns="columns" flat bordered separator="cell" />
  <q-table :rows="rows" :columns="columns" flat bordered separator="none" />
</template>
```
::

### Custom cell slot

::prose-show-case
:dnax-demo-table{demo="slot"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]
</script>

<template>
  <q-table :rows="rows" :columns="columns" flat bordered>
    <template #body-cell-status="{ row }">
      <q-badge
        :color="row.status === 'Active' ? 'positive' : 'warning'"
        :label="row.status"
      />
    </template>
  </q-table>
</template>
```
::

### Fixed header & virtual scroll

`max-height` makes the table scroll inside a bounded container with the **header
sticky**; `virtual-scroll` renders only the visible rows (windowing) — here over
**1000 rows**.

::prose-show-case
:dnax-demo-table{demo="virtual"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

// 1000 rows for the virtual-scroll demos
const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: "User " + (i + 1),
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: "user" + (i + 1) + "@dnax.dev",
  status: i % 4 === 0 ? "Inactive" : "Active",
}))
</script>

<template>
  <q-table
    :rows="bigRows"
    :columns="columns"
    max-height="320px"
    virtual-scroll
    dense
    flat
    bordered
  />
  <!-- 1000 rows: the header stays fixed, only the visible window is rendered -->
</template>
```
::

### Scroll — fixed header only

Without `virtual-scroll`, the whole body scrolls under the fixed header — ideal
up to a few hundred rows.

::prose-show-case
:dnax-demo-table{demo="scroll"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

// 1000 rows for the virtual-scroll demos
const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: "User " + (i + 1),
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: "user" + (i + 1) + "@dnax.dev",
  status: i % 4 === 0 ? "Inactive" : "Active",
}))
</script>

<template>
  <q-table
    :rows="bigRows"
    :columns="columns"
    max-height="280px"
    dense
    flat
    bordered
  />
  <!-- no virtual-scroll: the body scrolls, the header stays fixed -->
</template>
```
::

### Without fixed header

`:fixed-header="false"` disables the sticky header — the header scrolls away with
the content (default is `true` when `max-height` is set).

::prose-show-case
:dnax-demo-table{demo="noFixedHeader"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

// 1000 rows for the virtual-scroll demos
const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: "User " + (i + 1),
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: "user" + (i + 1) + "@dnax.dev",
  status: i % 4 === 0 ? "Inactive" : "Active",
}))
</script>

<template>
  <q-table
    :rows="bigRows"
    :columns="columns"
    max-height="280px"
    :fixed-header="false"
    dense
    flat
    bordered
  />
  <!-- fixed-header=false: the header scrolls away with the content -->
</template>
```
::

### Virtual scroll + selection

Selection works with virtualization — the header select-all (with indeterminate
state) and per-row `q-checkbox`es operate on the real row indexes across the whole
dataset.

::prose-show-case
:dnax-demo-table{demo="virtualSelection"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const rows = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
]

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

// 1000 rows for the virtual-scroll demos
const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: "User " + (i + 1),
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: "user" + (i + 1) + "@dnax.dev",
  status: i % 4 === 0 ? "Inactive" : "Active",
}))

const selected = ref([])
</script>

<template>
  <q-table
    v-model:selected="selected"
    selection="multiple"
    :rows="bigRows"
    :columns="columns"
    max-height="320px"
    virtual-scroll
    dense
    flat
    bordered
  />
  <p class="demo-p demo-table-count">{{ selected.length }} row(s) selected.</p>
</template>
```
::

### Reorderable rows

`reorderable-rows` adds a drag gutter on the left: grab the handle and drop the row
where you want it — a line shows the insertion point. The reorder **acts on the
data**: the component emits `update:rows` (bind it with `v-model:rows`) plus a
`row-reorder` event `{ rows, row, from, to }`.

- Works with the mouse and on touch (the handle has `touch-action: none`, so the
gesture doesn't turn into a scroll). The drop side is the half of the hovered row
(before / after).
- Keyboard: focus the handle and press **Alt + ↑ / ↓** to move the row one step.
- Sorting and pagination don't get in the way: the move is applied to the source
  `rows` array **by object identity**, so the row simply becomes a neighbour of the
  hovered row (the array order is what changes, not the view order).
- The exposed `reorderRows(from, to)` method reorders by **source** indices — handy
  for “move up / move down” buttons.

::prose-show-case
:dnax-demo-table{demo="reorder"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" },
  { name: "status", label: "Status", field: "status" },
]

const rows = ref([
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
])
</script>

<template>
  <q-table
    v-model:rows="rows"
    :columns="columns"
    row-key="id"
    reorderable-rows
    dense
    flat
    bordered
    @row-reorder="({ from, to }) => console.log(`row ${from} → ${to}`)"
  />

  <p>Order: <code>{{ rows.map((r) => r.id).join(" · ") }}</code></p>
</template>
```
::

## API

:dnax-api{name="QTable"}

Beyond the default, `top`, `bottom`, `noData`, `loading`, `header` and `body`
slots are available — see the Slots tab above.

## QTableColumn — column properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `—` | Column key — used for `body-cell-<name>` slots and sorting. |
| `label` | `string` | `—` | Header label. |
| `field` | `string \| string[] \| (row) => any` | `—` | Path (string/array) or function to the cell value. |
| `align` | `left \| center \| right` | `left` | Cell alignment. |
| `sortable` | `boolean` | `false` | Enables sorting on this column. |
| `sort` | `(a, b) => number` | `—` | Custom comparator for sorting. |
| `format` | `(val, row) => any` | `—` | Formats the displayed value. |
| `pinned` | `left \| right` | `—` | Pins (sticky) the column to its side while the table scrolls horizontally. |
| `classes` | `string` | `—` | Classes applied to every cell of the column. |
| `style` | `string` | `—` | Inline style applied to every cell of the column. |
| `headerClasses` | `string` | `—` | Classes applied to the header cell. |
| `headerStyle` | `string` | `—` | Inline style applied to the header cell (e.g. a background color). |
