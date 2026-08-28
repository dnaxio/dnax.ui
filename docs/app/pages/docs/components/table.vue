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

const rows = ref([
  { id: 1, name: "Ada Lovelace", role: "Engineer", email: "ada@dnax.dev", status: "Active" },
  { id: 2, name: "Grace Hopper", role: "Architect", email: "grace@dnax.dev", status: "Active" },
  { id: 3, name: "Alan Turing", role: "Researcher", email: "alan@dnax.dev", status: "Inactive" },
  { id: 4, name: "Katherine Johnson", role: "Analyst", email: "katherine@dnax.dev", status: "Active" },
  { id: 5, name: "Edsger Dijkstra", role: "Engineer", email: "edsger@dnax.dev", status: "Inactive" },
])

const selected = ref<any[]>([])

const pagination = ref({
  sortBy: null as string | null,
  descending: false,
  page: 1,
  rowsPerPage: 3,
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

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
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
      <docs-demo :code="usageSelection" lang="html" filename="App.vue">
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

      <h3 class="doc-h3">Custom cell slot</h3>
      <docs-demo :code="usageSlot" lang="html" filename="App.vue">
        <q-table :rows="rows" :columns="columns" flat bordered>
          <template #body-cell-status="{ row }">
            <q-badge
              :color="row.status === 'Active' ? 'positive' : 'warning'"
              :label="row.status"
            />
          </template>
        </q-table>
      </docs-demo>

      <p class="doc-note">
        Beyond the default, <code>top</code>, <code>bottom</code>,
        <code>noData</code>, <code>loading</code>, <code>header</code> and
        <code>body</code> slots are available — see the Slots tab below.
      </p>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="table" :source="tableSource" />
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
</style>
