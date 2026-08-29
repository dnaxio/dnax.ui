<script setup lang="ts">
// Inner Loading — QInnerLoading : overlay de chargement dans un conteneur position: relative.
import { reactive } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const innerLoading = useComponent(() => "QInnerLoading")
const innerLoadingSource = componentSource("QInnerLoading")
const tag = componentTag("QInnerLoading")

// — Démos —
const demo = reactive({ basic: false, label: false, dark: false, icon: false })

const run = (key: "basic" | "label" | "dark" | "icon") => {
  demo[key] = true
  setTimeout(() => (demo[key] = false), 1800)
}

const basicCode = `<div class="panel">
  <h3>Orders</h3>
  <p>Recent orders will appear here…</p>
  <q-inner-loading :showing="demo.basic" />
</div>

<q-btn unelevated color="primary" no-caps label="Reload" @click="run('basic')" />`

const labelCode = `<div class="panel">
  <h3>Exporting report</h3>
  <p>Generating the PDF file…</p>
  <q-inner-loading :showing="demo.label" label="Exporting…" color="secondary" size="lg" />
</div>`

const darkCode = `<div class="panel panel--dark">
  <h3>Syncing data</h3>
  <p>Waiting for the server…</p>
  <q-inner-loading :showing="demo.dark" label="Syncing…" dark size="sm" />
</div>`

const iconCode = `<div class="panel">
  <h3>Refreshing feed</h3>
  <p>Fetching the latest posts…</p>
  <q-inner-loading :showing="demo.icon" icon="lucide:loader-circle" label="Refreshing…" color="positive" />
</div>`

// — Script des démos (état partagé : reactive + run) —
const scriptData = `import { reactive } from "vue"

const demo = reactive({ basic: false, label: false, dark: false, icon: false })

const run = (key) => {
  demo[key] = true
  setTimeout(() => (demo[key] = false), 1800)
}`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Inner Loading</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      An overlay spinner shown inside a container while it loads.
      <b>&lt;q-inner-loading&gt;</b> covers its parent (which must be
      <code>position: relative</code>) with a fading overlay — ideal for tables,
      cards and panels that fetch data.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        A simple spinner centered over the panel — toggle it with
        <code>showing</code> (boolean).
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-col">
          <div class="demo-panel">
            <h3 class="demo-panel__title">Orders</h3>
            <p class="demo-p">Recent orders will appear here…</p>
            <q-inner-loading :showing="demo.basic" />
          </div>
          <div class="demo-actions">
            <q-btn unelevated color="primary" no-caps label="Reload" @click="run('basic')" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Label & size ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Label &amp; size</h2>
      <p class="doc-note">
        <code>label</code> adds a caption under the spinner; <code>size</code> is
        <code>sm | md | lg</code> or any CSS size; <code>color</code> accepts a
        token or hex.
      </p>

      <docs-demo :code="labelCode" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-col">
          <div class="demo-panel">
            <h3 class="demo-panel__title">Exporting report</h3>
            <p class="demo-p">Generating the PDF file…</p>
            <q-inner-loading :showing="demo.label" label="Exporting…" color="secondary" size="lg" />
          </div>
          <div class="demo-actions">
            <q-btn unelevated color="secondary" no-caps label="Export" @click="run('label')" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Dark ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Dark overlay</h2>
      <p class="doc-note">
        <code>dark</code> dims the overlay background — handy on light panels.
      </p>

      <docs-demo :code="darkCode" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-col">
          <div class="demo-panel">
            <h3 class="demo-panel__title">Syncing data</h3>
            <p class="demo-p">Waiting for the server…</p>
            <q-inner-loading :showing="demo.dark" label="Syncing…" dark size="sm" />
          </div>
          <div class="demo-actions">
            <q-btn unelevated color="dark" no-caps label="Sync" @click="run('dark')" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Icon spinner ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Icon spinner</h2>
      <p class="doc-note">
        <code>icon</code> replaces the CSS spinner with an Iconify icon in
        rotation — any icon works (loader, refresh, hourglass…).
      </p>

      <docs-demo :code="iconCode" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-col">
          <div class="demo-panel">
            <h3 class="demo-panel__title">Refreshing feed</h3>
            <p class="demo-p">Fetching the latest posts…</p>
            <q-inner-loading :showing="demo.icon" icon="lucide:loader-circle" label="Refreshing…" color="positive" />
          </div>
          <div class="demo-actions">
            <q-btn unelevated color="positive" no-caps label="Refresh" @click="run('icon')" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QInnerLoading</h2>
      <docs-api :comp="innerLoading" :source="innerLoadingSource" />
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

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 420px;
  margin: 0 auto;
}
.demo-panel {
  position: relative; /* requis par q-inner-loading */
  min-height: 160px;
  padding: 20px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: #fff;
}
.demo-panel__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-actions {
  display: flex;
  justify-content: center;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
