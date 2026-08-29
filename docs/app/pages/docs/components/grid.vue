<script setup lang="ts">
// Grid — documentation complète de la famille :
// QGrid (conteneur) + QCol (cellule) + QRow (alias sémantique) — responsive.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const grid = useComponent(() => "QGrid")
const gridSource = componentSource("QGrid")
const col = useComponent(() => "QCol")
const colSource = componentSource("QCol")
const row = useComponent(() => "QRow")
const rowSource = componentSource("QRow")

const tag = componentTag("QGrid")

const usageBasic = `<q-grid :cols="12" gap="16px">
  <q-col :span="12"><div class="cell">12</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
</q-grid>`

const usageResponsive = `<q-grid :cols="12" gap="12px">
  <!-- mobile : empilé (12) ; md : 8 + 4 ; lg : 6 + 6 -->
  <q-col :span="12" :span-md="8" :span-lg="6"><div class="cell">Main</div></q-col>
  <q-col :span="12" :span-md="4" :span-lg="6"><div class="cell">Side</div></q-col>

  <!-- 6 cartes : 2 par ligne mobile, 3 à md, 6 à lg -->
  <q-col v-for="i in 6" :key="i" :span="6" :span-md="4" :span-lg="2">
    <div class="cell">Card {{ i }}</div>
  </q-col>
</q-grid>`

const usageRow = `<q-row gap="12px">
  <q-col :span="8" :offset="2"><div class="cell">span 8, offset 2</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
</q-row>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Grid</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A responsive grid system: <b>&lt;q-grid&gt;</b> is the container (CSS Grid, 12
      columns by default), <b>&lt;q-col&gt;</b> is a cell with <code>span</code> /
      <code>offset</code> + responsive variants, and <b>&lt;q-row&gt;</b> is a
      semantic alias of <code>q-grid</code>. Breakpoints are
      <b>configurable</b> via CSS variables (<code>--q-grid-bp-sm/md/lg/xl</code>).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Spans that add up to 12 fill a row; <code>gap</code> accepts any CSS value.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="16px" class="demo-grid">
          <q-col :span="12"><div class="demo-cell">12</div></q-col>
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="3"><div class="demo-cell">3</div></q-col>
          <q-col :span="3"><div class="demo-cell">3</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ Responsive ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Responsive</h2>
      <p class="doc-note">
        Mobile-first: the base <code>span</code> applies on small screens, and
        <code>-sm / -md / -lg / -xl</code> variants override at each breakpoint.
        Resize the window to see the layout adapt.
      </p>

      <docs-demo :code="usageResponsive" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="12px" class="demo-grid">
          <q-col :span="12" :span-md="8" :span-lg="6"><div class="demo-cell demo-cell--accent">Main</div></q-col>
          <q-col :span="12" :span-md="4" :span-lg="6"><div class="demo-cell demo-cell--accent">Side</div></q-col>
          <q-col v-for="i in 6" :key="i" :span="6" :span-md="4" :span-lg="2">
            <div class="demo-cell">Card {{ i }}</div>
          </q-col>
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ QRow & offset ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QRow &amp; offset</h2>
      <p class="doc-note">
        <code>q-row</code> is a semantic alias of <code>q-grid</code> — same props.
        <code>offset</code> shifts a cell by a number of columns.
      </p>

      <docs-demo :code="usageRow" lang="html" filename="App.vue">
        <q-row gap="12px" class="demo-grid">
          <q-col :span="8" :offset="2"><div class="demo-cell">span 8, offset 2</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
        </q-row>
      </docs-demo>
    </section>

    <!-- ═══════ Breakpoints ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Configurable breakpoints</h2>
      <p class="doc-note">
        The breakpoints are CSS variables with defaults — override them anywhere
        (your CSS, <code>:root</code>, a scoped scope) to change the whole grid:
      </p>
      <q-syntax
        :code="`:root {\n  --q-grid-bp-sm: 640px;\n  --q-grid-bp-md: 1024px;\n  --q-grid-bp-lg: 1366px;\n  --q-grid-bp-xl: 1920px;\n}`"
        lang="css"
        filename="App.vue"
        copy
      />
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QGrid API</h2>
      <docs-api :comp="grid" :source="gridSource" />
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">QCol API</h2>
      <docs-api :comp="col" :source="colSource" />
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">QRow API</h2>
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
.demo-cell--accent {
  background: rgb(25 118 210 / 0.18);
}
</style>
