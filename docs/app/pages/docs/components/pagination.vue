<script setup lang="ts">
// Pagination — documentation du composant QPagination : navigation par pages.
import { computed, ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const pagination = useComponent(() => "QPagination")
const paginationSource = componentSource("QPagination")
const tag = componentTag("QPagination")

// — Démo 1 : liste paginée (cas réel) —
const allItems = ref(Array.from({ length: 23 }, (_, i) => `Row ${i + 1}`))
const page = ref(1)
const perPage = 5
const pageItems = computed(() => allItems.value.slice((page.value - 1) * perPage, page.value * perPage))
const maxPage = computed(() => Math.ceil(allItems.value.length / perPage))

// — Autres démos —
const pageBasic = ref(4)
const pageWindow = ref(7)
const pageVariants = ref(3)
const pageColor = ref(2)

const usageList = `<div class="list">
  <div v-for="it in pageItems" :key="it" class="row">{{ it }}</div>
</div>
<q-pagination v-model="page" :max="maxPage" boundary-links direction-links />
<p class="demo-p demo-meta">Page {{ page }} / {{ maxPage }} — {{ allItems.length }} rows, {{ perPage }} per page.</p>`

const usageBasic = `<q-pagination v-model="page" :max="10" />
<p class="demo-p demo-meta">Current page: {{ page }}</p>`

const usageWindow = `<q-pagination v-model="page" :max="20" :max-pages="5" boundary-links />
<!-- max-pages = fenêtre de boutons : 1 … 5 6 7 … 20 (ellipses sur les trous) -->`

const usageVariants = `<q-pagination v-model="page" :max="8" rounded outline dense active-color="secondary" />
<q-pagination v-model="page" :max="8" unelevated size="lg" active-color="teal" />`

const scriptList = `import { computed, ref } from "vue"

const allItems = ref(Array.from({ length: 23 }, (_, i) => "Row " + (i + 1)))
const page = ref(1)
const perPage = 5
const pageItems = computed(() => allItems.value.slice((page.value - 1) * perPage, page.value * perPage))
const maxPage = computed(() => Math.ceil(allItems.value.length / perPage))`

const scriptBasic = `import { ref } from "vue"

const page = ref(4)`

const scriptWindow = `import { ref } from "vue"

const page = ref(7)`

const scriptVariants = `import { ref } from "vue"

const page = ref(3)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Pagination</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Page navigation with a Quasar API: <code>v-model</code> holds the current
      page, <code>max</code> the last one. <b>&lt;q-pagination&gt;</b> supports
      first/last (<code>boundary-links</code>) and prev/next
      (<code>direction-links</code>) buttons, a collapsible window with ellipses
      (<code>max-pages</code>), sizes and color variants.
    </p>

    <!-- ═══════ With a list ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Paginated list</h2>
      <p class="doc-note">
        The real-world use: slice a collection by page and wire the pagination
        below it.
      </p>

      <docs-demo :code="usageList" lang="html" filename="App.vue" :script="scriptList">
        <div class="demo-list">
          <div v-for="it in pageItems" :key="it" class="demo-row">{{ it }}</div>
        </div>
        <q-pagination v-model="page" :max="maxPage" boundary-links direction-links />
        <p class="demo-p demo-meta">
          Page {{ page }} / {{ maxPage }} — {{ allItems.length }} rows, {{ perPage }} per page.
        </p>
      </docs-demo>
    </section>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        The simplest form: all pages as buttons, the active one highlighted with
        <code>active-color</code> (default primary).
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-pagination v-model="pageBasic" :max="10" />
        <p class="demo-p demo-meta">Current page: {{ pageBasic }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ Window & ellipses ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Window &amp; ellipses</h2>
      <p class="doc-note">
        <code>max-pages</code> caps the number of page buttons around the current
        one — gaps collapse into ellipses: <code>1 … 5 6 7 … 20</code>.
      </p>

      <docs-demo :code="usageWindow" lang="html" filename="App.vue" :script="scriptWindow">
        <q-pagination v-model="pageWindow" :max="20" :max-pages="5" boundary-links />
      </docs-demo>
    </section>

    <!-- ═══════ Variants ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants &amp; sizes</h2>
      <p class="doc-note">
        Same button vocabulary as <code>q-btn</code>: <code>flat</code>,
        <code>outline</code>, <code>unelevated</code>, <code>rounded</code>,
        <code>square</code>, <code>dense</code> — plus <code>size</code>
        (xs → xl or a CSS value) and <code>active-color</code>.
      </p>

      <docs-demo :code="usageVariants" lang="html" filename="App.vue" :script="scriptVariants">
        <div class="demo-col">
          <q-pagination
            v-model="pageVariants"
            :max="8"
            rounded
            outline
            dense
            active-color="secondary"
          />
          <q-pagination v-model="pageColor" :max="8" unelevated size="lg" active-color="teal" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QPagination API</h2>
      <docs-api :comp="pagination" :source="paginationSource" />
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

.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

/* — liste paginée — */
.demo-list {
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 14px;
}
.demo-row {
  padding: 10px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-size: 14px;
  color: var(--foreground);
}
.demo-row:last-child {
  border-bottom: none;
}
.demo-row:nth-child(odd) {
  background: rgb(0 0 0 / 0.02);
}
</style>
