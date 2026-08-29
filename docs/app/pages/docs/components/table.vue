<script setup lang="ts">
// Table — documentation complète de QTable.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const table = useComponent(() => "QTable")

const tableSource = componentSource("QTable")

const tag = componentTag("QTable")

// — Démo interactive : lignes / colonnes / sélection / pagination —
const columns = ref([
  { name: "name", label: "Name", field: "name", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email", align: "right" as const },
  { name: "status", label: "Status", field: "status" },
])

// — Toutes les colonnes triables (démo sorting) —
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

// — Gros jeu de données (démo virtual scroll) —
const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: `user${i + 1}@dnax.dev`,
  status: i % 4 === 0 ? "Inactive" : "Active",
}))

const selected = ref<any[]>([])
const virtualSelected = ref<any[]>([])

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

const usageBasic = `<q-table
  :rows="rows"
  :columns="columns"
  title="Team members"
  flat
  bordered
  v-model:pagination="pagination"
  :rows-per-page-options="[3, 5, 10]"
/>`

const usageSelection = `<q-table
  v-model:selected="selected"
  selection="multiple"
  :rows="rows"
  :columns="columns"
  dense
  flat
  bordered
  separator="cell"
/>
<p class="demo-p demo-table-count">{{ selected.length }} row(s) selected.</p>`

const usageSlot = `<q-table :rows="rows" :columns="columns" flat bordered>
  <template #body-cell-status="{ row }">
    <q-badge
      :color="row.status === 'Active' ? 'positive' : 'warning'"
      :label="row.status"
    />
  </template>
</q-table>`

const usageVirtual = `<q-table
  :rows="bigRows"
  :columns="columns"
  max-height="320px"
  virtual-scroll
  dense
  flat
  bordered
/>
<!-- 1000 rows: the header stays fixed, only the visible window is rendered -->`

const usageScroll = `<q-table
  :rows="bigRows"
  :columns="columns"
  max-height="280px"
  dense
  flat
  bordered
/>
<!-- no virtual-scroll: the body scrolls, the header stays fixed -->`

const usageNoFixedHeader = `<q-table
  :rows="bigRows"
  :columns="columns"
  max-height="280px"
  :fixed-header="false"
  dense
  flat
  bordered
/>
<!-- fixed-header=false: the header scrolls away with the content -->`

const usageVirtualSelection = `<q-table
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
<p class="demo-p demo-table-count">{{ selected.length }} row(s) selected.</p>`

const usageSort = `<q-table
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
</p>`

const usageHeaderStyle = `<q-table
  :rows="rows"
  :columns="columns"
  flat
  bordered
  dense
  header-style="background: rgb(25 118 210 / 0.12); font-weight: 700;"
/>

<!-- per-column override with header-style / header-class -->
<q-table :rows="rows" :columns="columns" flat bordered />`

const usageSeparators = `<q-table :rows="rows" :columns="columns" flat bordered separator="horizontal" />
<q-table :rows="rows" :columns="columns" flat bordered separator="vertical" />
<q-table :rows="rows" :columns="columns" flat bordered separator="cell" />
<q-table :rows="rows" :columns="columns" flat bordered separator="none" />`

const usagePinned = `<q-table
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
<!-- name pinned left, actions pinned right — they stay visible while the table scrolls horizontally -->`

const usagePinnedVirtual = `<q-table
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
<!-- pins work with virtual scroll + selection over 1000 rows -->`

// — API des colonnes (QTableColumn) —
const columnApi = [
  { name: "name", type: "string", def: "—", desc: "Column key — used for body-cell-<name> slots and sorting." },
  { name: "label", type: "string", def: "—", desc: "Header label." },
  { name: "field", type: "string | string[] | (row) => any", def: "—", desc: "Path (string/array) or function to the cell value." },
  { name: "align", type: "left | center | right", def: "left", desc: "Cell alignment." },
  { name: "sortable", type: "boolean", def: "false", desc: "Enables sorting on this column." },
  { name: "sort", type: "(a, b) => number", def: "—", desc: "Custom comparator for sorting." },
  { name: "format", type: "(val, row) => any", def: "—", desc: "Formats the displayed value." },
  { name: "pinned", type: "left | right", def: "—", desc: "Pins (sticky) the column to its side while the table scrolls horizontally." },
  { name: "classes", type: "string", def: "—", desc: "Classes applied to every cell of the column." },
  { name: "style", type: "string", def: "—", desc: "Inline style applied to every cell of the column." },
  { name: "headerClasses", type: "string", def: "—", desc: "Classes applied to the header cell." },
  { name: "headerStyle", type: "string", def: "—", desc: "Inline style applied to the header cell (e.g. a background color)." },
]

// — Scripts des démos (données + refs accompagnant le template) —
const scriptData = `import { ref } from "vue"

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
]`

const scriptBasic = `${scriptData}

const pagination = ref({ sortBy: null, descending: false, page: 1, rowsPerPage: 3 })`

const scriptSelection = `${scriptData}

const selected = ref([])`

const scriptSort = `import { ref } from "vue"

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

const pagination = ref({ sortBy: null, descending: false, page: 1, rowsPerPage: 5 })`

const scriptBig = `${scriptData}

// 1000 rows for the virtual-scroll demos
const bigRows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: "User " + (i + 1),
  role: ["Engineer", "Designer", "Analyst"][i % 3],
  email: "user" + (i + 1) + "@dnax.dev",
  status: i % 4 === 0 ? "Inactive" : "Active",
}))`

const scriptBigSelection = `${scriptBig}

const selected = ref([])`

// — Démo pinned columns —
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

// Colonnes épinglées pour le big dataset (pin + virtual scroll + sélection)
const pinnedBigColumns = ref([
  { name: "name", label: "Name", field: "name", pinned: "left" as const, sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email" },
  { name: "status", label: "Status", field: "status" },
  { name: "actions", label: "Actions", field: "actions", pinned: "right" as const },
])

const scriptPinned = `import { ref } from "vue"

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
]`

const scriptPinnedVirtual = `${scriptBig}

const pinnedBigColumns = [
  { name: "name", label: "Name", field: "name", pinned: "left", sortable: true },
  { name: "role", label: "Role", field: "role" },
  { name: "email", label: "Email", field: "email" },
  { name: "status", label: "Status", field: "status" },
  { name: "actions", label: "Actions", field: "actions", pinned: "right" },
]

const selected = ref([])`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Table</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      <b>&lt;q-table&gt;</b> displays tabular data with client-side sorting,
      pagination and row selection — a shadcn-style data table with a Quasar-like
      API. Columns are declared declaratively (<code>name</code>,
      <code>label</code>, <code>field</code>, <code>sortable</code>), rows are
      plain objects, and each cell can be overridden with a
      <code>body-cell-&lt;name&gt;</code> slot. Wiring <code>@request</code>
      switches to server-side pagination and sorting.
    </p>

    <!-- ═══════ QTable ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QTable — data table</h2>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-table
          :rows="rows"
          :columns="columns"
          title="Team members"
          flat
          bordered
          v-model:pagination="pagination"
          :rows-per-page-options="[3, 5, 10]"
        />
      </docs-demo>

      <h3 class="doc-h3">Dense &amp; selection</h3>
      <docs-demo :code="usageSelection" lang="html" filename="App.vue" :script="scriptSelection">
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
      </docs-demo>

      <h3 class="doc-h3">Sorting</h3>
      <p class="doc-note">
        Mark a column <code>sortable</code> to enable sorting — click the header to
        sort, click again to reverse. The state is exposed through
        <code>v-model:pagination</code> (<code>sortBy</code> / <code>descending</code>)
        and <code>@update:sorting</code>; wiring <code>@request</code> delegates it
        to the server.
      </p>
      <docs-demo :code="usageSort" lang="html" filename="App.vue" :script="scriptSort">
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
      </docs-demo>

      <h3 class="doc-h3">Colored headers</h3>
      <p class="doc-note">
        Style all headers with <code>header-style</code> / <code>header-class</code>
        (solid colors are needed when the header is sticky, so rows don't show
        through), or override a single column with its own
        <code>header-style</code> / <code>header-class</code>.
      </p>
      <docs-demo :code="usageHeaderStyle" lang="html" filename="App.vue" :script="scriptData">
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
      </docs-demo>

      <h3 class="doc-h3">Pinned columns</h3>
      <p class="doc-note">
        Set <code>pinned: "left" | "right"</code> on a column to keep it visible
        while the table scrolls horizontally — the classic fixed <b>Actions</b>
        column on the right (with an opaque background so rows don't show through).
        When a column is pinned left, the <b>selection column</b> pins too.
        Combine with <code>max-height</code> for a scrollable container.
      </p>
      <docs-demo :code="usagePinned" lang="html" filename="App.vue" :script="scriptPinned">
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
      </docs-demo>

      <h3 class="doc-h3">Pins + virtual scroll + selection</h3>
      <p class="doc-note">
        Pins compose with <code>virtual-scroll</code> and <code>selection</code>:
        here the selection column and Name are pinned left, Actions is pinned right,
        over <b>1000 virtualized rows</b>.
      </p>
      <docs-demo :code="usagePinnedVirtual" lang="html" filename="App.vue" :script="scriptPinnedVirtual">
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
      </docs-demo>

      <h3 class="doc-h3">Separators</h3>
      <p class="doc-note">
        <code>separator</code> controls the row/column lines:
        <code>horizontal</code> (default), <code>vertical</code>, <code>cell</code>
        (both) or <code>none</code>.
      </p>
      <docs-demo :code="usageSeparators" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-stack">
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
      </docs-demo>

      <h3 class="doc-h3">Custom cell slot</h3>
      <docs-demo :code="usageSlot" lang="html" filename="App.vue" :script="scriptData">
        <q-table :rows="rows" :columns="columns" flat bordered>
          <template #body-cell-status="{ row }">
            <q-badge
              :color="row.status === 'Active' ? 'positive' : 'warning'"
              :label="row.status"
            />
          </template>
        </q-table>
      </docs-demo>

      <h3 class="doc-h3">Fixed header &amp; virtual scroll</h3>
      <p class="doc-note">
        <code>max-height</code> makes the table scroll inside a bounded container
        with the <b>header sticky</b>; <code>virtual-scroll</code> renders only the
        visible rows (windowing) — here over <b>1000 rows</b>.
      </p>
      <docs-demo :code="usageVirtual" lang="html" filename="App.vue" :script="scriptBig">
        <q-table
          :rows="bigRows"
          :columns="columns"
          max-height="320px"
          virtual-scroll
          dense
          flat
          bordered
        />
      </docs-demo>

      <h3 class="doc-h3">Scroll — fixed header only</h3>
      <p class="doc-note">
        Without <code>virtual-scroll</code>, the whole body scrolls under the fixed
        header — ideal up to a few hundred rows.
      </p>
      <docs-demo :code="usageScroll" lang="html" filename="App.vue" :script="scriptBig">
        <q-table
          :rows="bigRows"
          :columns="columns"
          max-height="280px"
          dense
          flat
          bordered
        />
      </docs-demo>

      <h3 class="doc-h3">Without fixed header</h3>
      <p class="doc-note">
        <code>:fixed-header="false"</code> disables the sticky header — the header
        scrolls away with the content (default is <code>true</code> when
        <code>max-height</code> is set).
      </p>
      <docs-demo :code="usageNoFixedHeader" lang="html" filename="App.vue" :script="scriptBig">
        <q-table
          :rows="bigRows"
          :columns="columns"
          max-height="280px"
          :fixed-header="false"
          dense
          flat
          bordered
        />
      </docs-demo>

      <h3 class="doc-h3">Virtual scroll + selection</h3>
      <p class="doc-note">
        Selection works with virtualization — the header select-all (with
        indeterminate state) and per-row <code>q-checkbox</code>es operate on the
        real row indexes across the whole dataset.
      </p>
      <docs-demo :code="usageVirtualSelection" lang="html" filename="App.vue" :script="scriptBigSelection">
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
      </docs-demo>

      <h3 class="doc-h3">QTable API</h3>
      <docs-api :comp="table" :source="tableSource" />

      <h3 class="doc-h3">QTableColumn — column properties</h3>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in columnApi" :key="c.name">
              <td><code>{{ c.name }}</code></td>
              <td><code>{{ c.type }}</code></td>
              <td><code>{{ c.def }}</code></td>
              <td>{{ c.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="doc-note">
        Beyond the default, <code>top</code>, <code>bottom</code>,
        <code>noData</code>, <code>loading</code>, <code>header</code> and
        <code>body</code> slots are available — see the Slots tab below.
      </p>
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
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

/* espace entre les deux blocs docs-demo (single / multiple) */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}

/* — démos Table — */
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
