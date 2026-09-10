# Table

> Tabular data with client-side sorting, pagination and row selection — virtual scroll, pinned columns and cell slots.

**<q-table>** displays tabular data with client-side sorting, pagination and
row selection — a shadcn-style data table with a Quasar-like API. Columns are
declared declaratively (`name`, `label`, `field`, `sortable`), rows are plain
objects, and each cell can be overridden with a `body-cell-<name>` slot. Wiring
`@request` switches to server-side pagination and sorting.

## QTable — data table

<prose-show-case>
<dnax-demo-table demo="basic">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Dense & selection

<prose-show-case>
<dnax-demo-table demo="selection">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Sorting

Mark a column `sortable` to enable sorting — click the header to sort, click
again to reverse. The state is exposed through `v-model:pagination` (`sortBy` /
`descending`) and `@update:sorting`; wiring `@request` delegates it to the server.

<prose-show-case>
<dnax-demo-table demo="sort">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Colored headers

Style all headers with `header-style` / `header-class` (solid colors are needed
when the header is sticky, so rows don't show through), or override a single
column with its own `header-style` / `header-class`.

<prose-show-case>
<dnax-demo-table demo="header">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Pinned columns

Set `pinned: "left" | "right"` on a column to keep it visible while the table
scrolls horizontally — the classic fixed **Actions** column on the right (with an
opaque background so rows don't show through). When a column is pinned left, the
**selection column** pins too. Combine with `max-height` for a scrollable
container.

<prose-show-case>
<dnax-demo-table demo="pinned">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Pins + virtual scroll + selection

Pins compose with `virtual-scroll` and `selection`: here the selection column and
Name are pinned left, Actions is pinned right, over **1000 virtualized rows**.

<prose-show-case>
<dnax-demo-table demo="pinnedVirtual">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Separators

`separator` controls the row/column lines: `horizontal` (default), `vertical`,
`cell` (both) or `none`.

<prose-show-case>
<dnax-demo-table demo="separators">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Custom cell slot

<prose-show-case>
<dnax-demo-table demo="slot">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Fixed header & virtual scroll

`max-height` makes the table scroll inside a bounded container with the **header
sticky**; `virtual-scroll` renders only the visible rows (windowing) — here over
**1000 rows**.

<prose-show-case>
<dnax-demo-table demo="virtual">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Scroll — fixed header only

Without `virtual-scroll`, the whole body scrolls under the fixed header — ideal
up to a few hundred rows.

<prose-show-case>
<dnax-demo-table demo="scroll">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Without fixed header

`:fixed-header="false"` disables the sticky header — the header scrolls away with
the content (default is `true` when `max-height` is set).

<prose-show-case>
<dnax-demo-table demo="noFixedHeader">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

### Virtual scroll + selection

Selection works with virtualization — the header select-all (with indeterminate
state) and per-row `q-checkbox`es operate on the real row indexes across the whole
dataset.

<prose-show-case>
<dnax-demo-table demo="virtualSelection">



</dnax-demo-table>

<template v-slot:code="">

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

</template>
</prose-show-case>

## API

<dnax-api name="QTable">



</dnax-api>

Beyond the default, `top`, `bottom`, `noData`, `loading`, `header` and `body`
slots are available — see the Slots tab above.

## QTableColumn — column properties

<table>
<thead>
  <tr>
    <th>
      Name
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Description
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
      <code>
        string
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Column key — used for <code>
        body-cell-<name>
      </code>
      
       slots and sorting.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        label
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Header label.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        field
      </code>
    </td>
    
    <td>
      <code>
        string | string[] | (row) => any
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Path (string/array) or function to the cell value.
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
        left | center | right
      </code>
    </td>
    
    <td>
      <code>
        left
      </code>
    </td>
    
    <td>
      Cell alignment.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sortable
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Enables sorting on this column.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sort
      </code>
    </td>
    
    <td>
      <code>
        (a, b) => number
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Custom comparator for sorting.
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
        (val, row) => any
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Formats the displayed value.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pinned
      </code>
    </td>
    
    <td>
      <code>
        left | right
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Pins (sticky) the column to its side while the table scrolls horizontally.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        classes
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Classes applied to every cell of the column.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        style
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Inline style applied to every cell of the column.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        headerClasses
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Classes applied to the header cell.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        headerStyle
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      <code>
        —
      </code>
    </td>
    
    <td>
      Inline style applied to the header cell (e.g. a background color).
    </td>
  </tr>
</tbody>
</table>
