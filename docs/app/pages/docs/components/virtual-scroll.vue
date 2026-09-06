<script setup lang="ts">
// Virtual Scroll — QVirtualScroll : rendu fenêtré de longues listes.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const vs = useComponent(() => "QVirtualScroll")
const vsSource = componentSource("QVirtualScroll")
const tag = componentTag("QVirtualScroll")

// — Données de test —
const rows = Array.from({ length: 50000 }, (_, i) => `Row ${i + 1}`)

const mixedRows = Array.from({ length: 20000 }, (_, i) => ({
  id: i,
  title: `Row ${i + 1}`,
  desc: `Description ${(i % 3) + 1}: ${["Short.", "Medium length text, a bit longer to wrap.", "A much longer description with enough words to wrap onto several lines and demonstrate real measured heights."][i % 3]}`,
}))

const usageBasic = `<q-virtual-scroll :items="rows" item-key="id" style="height: 320px">
  <template #default="{ item, index, ref }">
    <div :ref="ref" class="item">{{ item }}</div>
  </template>
</q-virtual-scroll>`

const scriptBasic = `const rows = Array.from({ length: 50000 }, (_, i) => "Row " + (i + 1))`

const usageMixed = `<q-virtual-scroll :items="mixed" item-key="id" style="height: 320px">
  <template #default="{ item, ref }">
    <div :ref="ref" class="card">
      <b>{{ item.title }}</b>
      <p>{{ item.desc }}</p>
    </div>
  </template>
</q-virtual-scroll>`

const scriptMixed = `const mixed = Array.from({ length: 20000 }, (_, i) => ({
  id: i,
  title: "Row " + (i + 1),
  desc: "Description " + ((i % 3) + 1) + ": …",
}))`

const usageTuning = `<q-virtual-scroll
  :items="rows"
  item-key="id"
  virtual-scroll-slice-size="20"
  virtual-scroll-item-size="48"
  style="height: 320px"
>
  <template #default="{ item, ref }">
    <div :ref="ref" class="item">{{ item }}</div>
  </template>
</q-virtual-scroll>
<!-- slice-size : items rendus autour de la fenêtre · item-size : hauteur estimée -->`

const usagePage = `<q-page virtual :items="rows" item-key="id" style="height: 400px">
  <template #default="{ item }">
    <div class="item">{{ item }}</div>
  </template>
</q-page>
<!-- QPage virtual = q-virtual-scroll avec l'offset auto des barres fixed -->
`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Virtual Scroll</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A windowed list renderer: <b>&lt;q-virtual-scroll&gt;</b> only mounts the
      items around the visible area (plus margins), measuring real heights with
      a <code>ResizeObserver</code> — scroll smoothly through hundreds of
      thousands of rows with a handful of DOM nodes.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>
      <p class="doc-note">
        Pass <code>:items</code> and render each row through the scoped default
        slot — bind the slot's <code>ref</code> to your element so heights can
        be measured. <code>50 000 rows</code> below, only a window is mounted.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-virtual-scroll :items="rows" class="demo-vs">
          <template #default="{ item, ref }">
            <div :ref="ref" class="demo-vs-item">{{ item }}</div>
          </template>
        </q-virtual-scroll>
      </docs-demo>
    </section>

    <!-- ═══════ Variable heights ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variable heights</h2>
      <p class="doc-note">
        Items don't need a fixed height: each mounted row is measured by a
        <code>ResizeObserver</code> and the prefix offsets rebuild — rows of
        different lengths stay perfectly aligned while scrolling.
      </p>

      <docs-demo :code="usageMixed" lang="html" filename="App.vue" :script="scriptMixed">
        <q-virtual-scroll :items="mixedRows" item-key="id" class="demo-vs">
          <template #default="{ item, ref }">
            <div :ref="ref" class="demo-vs-card">
              <b>{{ item.title }}</b>
              <p>{{ item.desc }}</p>
            </div>
          </template>
        </q-virtual-scroll>
      </docs-demo>
    </section>

    <!-- ═══════ Tuning ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Tuning</h2>
      <p class="doc-note">
        <code>virtual-scroll-slice-size</code> is the number of items rendered
        around the visible window (default 14); <code>-ratio-before / -after</code>
        multiply it on each side. <code>virtual-scroll-item-size</code> is the
        initial estimated height (px) used until a row is measured.
      </p>

      <docs-demo :code="usageTuning" lang="html" filename="App.vue">
        <q-virtual-scroll
          :items="rows"
          :virtual-scroll-slice-size="20"
          :virtual-scroll-item-size="40"
          class="demo-vs"
        >
          <template #default="{ item, ref }">
            <div :ref="ref" class="demo-vs-item">{{ item }}</div>
          </template>
        </q-virtual-scroll>
      </docs-demo>
    </section>

    <!-- ═══════ QPage virtual ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Inside QPage</h2>
      <p class="doc-note">
        <code>q-page</code> has a <code>virtual</code> mode that wraps this
        component — windowed list plus the automatic offset under fixed bars
        (<code>q-header</code> / <code>q-footer</code>).
      </p>

      <q-syntax :code="usagePage" lang="html" filename="App.vue" copy />
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QVirtualScroll</h2>
      <docs-api :comp="vs" :source="vsSource" />
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

/* — zone scrollable des démos — */
.demo-vs {
  height: 300px;
  border: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 10px;
  background: #fff;
}
.demo-vs-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
  font-size: 13px;
  color: var(--foreground);
}
.demo-vs-card {
  padding: 8px 16px;
  border-bottom: 1px solid rgb(0 0 0 / 0.08);
  font-size: 13px;
}
.demo-vs-card b {
  color: var(--foreground);
}
.demo-vs-card p {
  margin: 2px 0 0;
  color: #5b6472;
  line-height: 1.5;
}
</style>
