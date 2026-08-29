<script setup lang="ts">
// Row — documentation du composant QRow : alias sémantique de QGrid.
// Même API que q-grid (cols, gap, rowGap, columnGap, cols-*, align).
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const row = useComponent(() => "QRow")
const rowSource = componentSource("QRow")
const tag = componentTag("QRow")

const usageBasic = `<q-row gap="12px">
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
</q-row>`

const usageGap = `<q-row gap="8px" column-gap="28px">
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
</q-row>`

const usageResponsive = `<q-row :cols="12" :cols-md="6" :cols-lg="4" gap="12px">
  <q-col v-for="i in 6" :key="i"><div class="cell">Item {{ i }}</div></q-col>
</q-row>
<!-- 6 items : 6 par ligne mobile, 3 à md, 2 à lg (cols change le total) -->`

const usageAlign = `<q-row gap="12px" align="center" style="height: 140px">
  <q-col :span="4"><div class="cell">center</div></q-col>
  <q-col :span="4" align-self="end"><div class="cell">end (per cell)</div></q-col>
</q-row>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Row</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A semantic alias of <b>&lt;q-grid&gt;</b> — same props, same 12-column
      system, reads better in markup: <code>&lt;q-row&gt;</code> wraps
      <b>&lt;q-col&gt;</b> cells. Perfect when the container is a row in your
      mental model; use <code>q-grid</code> when it's a generic grid area.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Identical usage to <code>q-grid</code>: <code>cols</code> (12 by default),
        <code>gap</code> and <code>q-col</code> children.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-row gap="12px" class="demo-grid">
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
        </q-row>
      </docs-demo>
    </section>

    <!-- ═══════ Gaps ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Row &amp; column gaps</h2>
      <p class="doc-note">
        <code>gap</code> sets both directions; <code>row-gap</code> and
        <code>column-gap</code> override each axis independently.
      </p>

      <docs-demo :code="usageGap" lang="html" filename="App.vue">
        <q-row gap="8px" column-gap="28px" class="demo-grid">
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="3"><div class="demo-cell">3</div></q-col>
          <q-col :span="3"><div class="demo-cell">3</div></q-col>
        </q-row>
      </docs-demo>
    </section>

    <!-- ═══════ Responsive cols ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Responsive column count</h2>
      <p class="doc-note">
        <code>cols-sm / -md / -lg / -xl</code> change the <em>total</em> number of
        columns at each breakpoint — combined with plain cells (no span), items
        flow into fewer/more per row automatically.
      </p>

      <docs-demo :code="usageResponsive" lang="html" filename="App.vue">
        <q-row :cols="12" :cols-md="6" :cols-lg="4" gap="12px" class="demo-grid">
          <q-col v-for="i in 6" :key="i"><div class="demo-cell">Item {{ i }}</div></q-col>
        </q-row>
      </docs-demo>
    </section>

    <!-- ═══════ Align ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Vertical alignment</h2>
      <p class="doc-note">
        <code>align</code> (start, center, end, stretch) aligns every cell in the
        row; a cell can override with <code>align-self</code>.
      </p>

      <docs-demo :code="usageAlign" lang="html" filename="App.vue">
        <q-row gap="12px" align="center" style="height: 140px" class="demo-grid">
          <q-col :span="4"><div class="demo-cell">center</div></q-col>
          <q-col :span="4" align-self="end"><div class="demo-cell">end (per cell)</div></q-col>
        </q-row>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QRow API</h2>
      <p class="doc-note">
        QRow is a thin wrapper around QGrid — the API below is the same as
        <a class="doc-link" href="/docs/components/grid">QGrid</a>.
      </p>
      <docs-api :comp="row" :source="rowSource" />
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
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.doc-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}
.doc-link:hover {
  text-decoration: underline;
}

.demo-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border-radius: 8px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
}
</style>
