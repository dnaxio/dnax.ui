<script setup lang="ts">
// Live demos for the Table page (state kept per page).
// One component per page — the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo:
    | "basic"
    | "selection"
    | "sort"
    | "header"
    | "pinned"
    | "pinnedVirtual"
    | "separators"
    | "slot"
    | "virtual"
    | "scroll"
    | "noFixedHeader"
    | "virtualSelection"
    | "reorder"
}>()

// — Columns / rows —
const columns = ref([
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" as const },
  { name: "status", label: "Status", field: "status" },
])

const sortColumns = ref([
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role", sortable: true },
  { name: "email", label: "Email", field: "email", sortable: true },
  { name: "status", label: "Status", field: "status", sortable: true },
])

const rows = ref([
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
])

const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: `user${i + 1}@dnax.dev`,
  status: i % 4 === 0 ? "Inactive" : "Active",
}))

// — Selection / pagination state —
const selected = ref<any[]>([])
const virtualSelected = ref<any[]>([])

// — Réordonnancement : tableau `rows` PROPRE à la démo (les autres démos gardent l'ordre de `rows`)
const reorderRows = ref([...rows.value])

const pagination = ref({
  sortBy: null as string | null,
  descending: false,
  page: 1,
  rowsPerPage: 3,
})

const sortPagination = ref({
  sortBy: null as string | null,
  descending: false,
  page: 1,
  rowsPerPage: 5,
})

// — Pinned columns —
const pinnedColumns = ref([
  { name: "name", label: "Name", field: "name", pinned: "left" as const, sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email" },
  { name: "status", label: "Status", field: "status" },
  { name: "joined", label: "Joined", field: "joined" },
  { name: "lastLogin", label: "Last login", field: "lastLogin" },
  { name: "actions", label: "Actions", field: "actions", pinned: "right" as const },
])

const pinnedRows = ref([
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active", joined: "2024-01-12", lastLogin: "2h ago" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active", joined: "2023-11-03", lastLogin: "15m ago" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive", joined: "2024-04-20", lastLogin: "3d ago" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active", joined: "2022-09-15", lastLogin: "1h ago" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive", joined: "2023-06-30", lastLogin: "1w ago" },
])

const pinnedBigColumns = ref([
  { name: "name", label: "Name", field: "name", pinned: "left" as const, sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email" },
  { name: "status", label: "Status", field: "status" },
  { name: "actions", label: "Actions", field: "actions", pinned: "right" as const },
])
</script>

<template>
  <div v-if="demo === 'basic'">
    <q-table
      :rows="rows"
      :columns="columns"
      title="Team members"
      flat
      bordered
      v-model:pagination="pagination"
      :rows-per-page-options="[3, 5, 10]"
    />
  </div>

  <div v-else-if="demo === 'selection'">
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
  </div>

  <div v-else-if="demo === 'sort'">
    <q-table
      v-model:pagination="sortPagination"
      :rows="rows"
      :columns="sortColumns"
      flat
      bordered
      dense
    />
    <p class="demo-p demo-table-count">
      Sorted by <code>{{ sortPagination.sortBy || "—" }}</code>
      {{ sortPagination.descending ? "↓" : "↑" }}
    </p>
  </div>

  <div v-else-if="demo === 'header'">
    <q-table
      :rows="rows"
      :columns="columns"
      flat
      bordered
      dense
      header-style="background: rgb(25 118 210 / 0.12); font-weight: 700;"
    />
    <p class="demo-p demo-table-count">With a solid primary header:</p>
    <q-table
      :rows="rows"
      :columns="columns"
      flat
      bordered
      dense
      header-style="background: #1976d2; color: #fff;"
    />
  </div>

  <div v-else-if="demo === 'pinned'">
    <q-table
      :rows="pinnedRows"
      :columns="pinnedColumns"
      max-height="320px"
      flat
      bordered
      dense
    >
      <template #body-cell-actions="{ row }">
        <div class="demo-actions-cell">
          <q-btn flat dense round icon="lucide:pencil" aria-label="Edit" />
          <q-btn flat dense round icon="lucide:trash-2" color="negative" aria-label="Delete" />
        </div>
      </template>
    </q-table>
  </div>

  <div v-else-if="demo === 'pinnedVirtual'">
    <q-table
      v-model:selected="virtualSelected"
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
        <div class="demo-actions-cell">
          <q-btn flat dense round icon="lucide:eye" aria-label="View" />
          <q-btn flat dense round icon="lucide:trash-2" color="negative" aria-label="Delete" />
        </div>
      </template>
    </q-table>
    <p class="demo-p demo-table-count">{{ virtualSelected.length }} row(s) selected.</p>
  </div>

  <div v-else-if="demo === 'separators'" class="demo-stack">
    <div>
      <p class="demo-p demo-table-count">horizontal (default)</p>
      <q-table :rows="rows" :columns="columns" flat bordered separator="horizontal" dense />
    </div>
    <div>
      <p class="demo-p demo-table-count">vertical</p>
      <q-table :rows="rows" :columns="columns" flat bordered separator="vertical" dense />
    </div>
    <div>
      <p class="demo-p demo-table-count">cell</p>
      <q-table :rows="rows" :columns="columns" flat bordered separator="cell" dense />
    </div>
    <div>
      <p class="demo-p demo-table-count">none</p>
      <q-table :rows="rows" :columns="columns" flat bordered separator="none" dense />
    </div>
  </div>

  <div v-else-if="demo === 'slot'">
    <q-table :rows="rows" :columns="columns" flat bordered>
      <template #body-cell-status="{ row }">
        <q-badge
          :color="row.status === 'Active' ? 'positive' : 'warning'"
          :label="row.status"
        />
      </template>
    </q-table>
  </div>

  <div v-else-if="demo === 'virtual'">
    <q-table
      :rows="bigRows"
      :columns="columns"
      max-height="320px"
      virtual-scroll
      dense
      flat
      bordered
    />
  </div>

  <div v-else-if="demo === 'scroll'">
    <q-table
      :rows="bigRows"
      :columns="columns"
      max-height="280px"
      dense
      flat
      bordered
    />
  </div>

  <div v-else-if="demo === 'noFixedHeader'">
    <q-table
      :rows="bigRows"
      :columns="columns"
      max-height="280px"
      :fixed-header="false"
      dense
      flat
      bordered
    />
  </div>

  <div v-else-if="demo === 'virtualSelection'">
    <q-table
      v-model:selected="virtualSelected"
      selection="multiple"
      :rows="bigRows"
      :columns="columns"
      max-height="320px"
      virtual-scroll
      dense
      flat
      bordered
    />
    <p class="demo-p demo-table-count">{{ virtualSelected.length }} row(s) selected.</p>
  </div>

  <div v-else-if="demo === 'reorder'" class="demo-stack">
    <q-table
      v-model:rows="reorderRows"
      :columns="columns"
      row-key="id"
      reorderable-rows
      dense
      flat
      bordered
    />
    <p class="demo-p demo-table-count">
      Drag the handle (or Alt + ↑/↓) — order:
      <code>{{ reorderRows.map((r) => r.id).join(" · ") }}</code>
    </p>
  </div>
</template>

<style scoped>
.demo-table-count {
  margin-top: 10px;
}

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-actions-cell {
  display: inline-flex;
  gap: 4px;
}
</style>
