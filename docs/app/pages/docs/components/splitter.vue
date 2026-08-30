<script setup lang="ts">
// Splitter — documentation du composant QSplitter : deux panneaux redimensionnables.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const splitter = useComponent(() => "QSplitter")
const splitterSource = componentSource("QSplitter")
const tag = componentTag("QSplitter")

// — Démos —
const split = ref(30)
const splitH = ref(60)
const sidePx = ref(180)
const splitCustom = ref(40)

const files = ["App.vue", "main.ts", "useAuth.ts", "README.md", "package.json"]

const usageBasic = `<q-splitter v-model="split" style="height: 260px">
  <template #before>
    <div class="panel panel--code">
      <p class="panel__title">Files</p>
      <div v-for="f in files" :key="f" class="file">{{ f }}</div>
    </div>
  </template>
  <template #after>
    <div class="panel panel--preview">
      <p class="panel__title">Preview</p>
      <p class="demo-p">Drag the handle — or focus it and use the arrow keys.</p>
    </div>
  </template>
</q-splitter>
<p class="demo-p demo-meta">Left panel: {{ Math.round(split) }}%</p>`

const usageHorizontal = `<q-splitter v-model="splitH" horizontal style="height: 240px">
  <template #before>
    <div class="panel panel--header">
      <p class="panel__title">Toolbar</p>
      <p class="demo-p">Top panel — drag the separator up/down.</p>
    </div>
  </template>
  <template #after>
    <div class="panel panel--body">
      <p class="panel__title">Content</p>
      <p class="demo-p">Shift + arrows step by 10% instead of 1%.</p>
    </div>
  </template>
</q-splitter>`

const usagePx = `<q-splitter v-model="sidePx" unit="px" :limits="[120, 320]" style="height: 220px">
  <template #before>
    <div class="panel panel--sidebar">Sidebar ({{ Math.round(sidePx) }}px)</div>
  </template>
  <template #after>
    <div class="panel panel--body">
      <p class="panel__title">Main content</p>
      <p class="demo-p">Clamped between 120 px and 320 px.</p>
    </div>
  </template>
</q-splitter>`

const usageCustom = `<q-splitter
  v-model="splitCustom"
  style="height: 220px"
  separator-style="background: transparent"
>
  <template #before>
    <div class="panel panel--a">A</div>
  </template>
  <template #after>
    <div class="panel panel--b">B</div>
  </template>
  <template #separator>
    <span class="knob">
      <span class="knob__dot" />
      <span class="knob__dot" />
      <span class="knob__dot" />
    </span>
  </template>
</q-splitter>`

const scriptBasic = `import { ref } from "vue"

const split = ref(30)
const files = ["App.vue", "main.ts", "useAuth.ts", "README.md", "package.json"]`

const scriptHorizontal = `import { ref } from "vue"

const splitH = ref(60)`

const scriptPx = `import { ref } from "vue"

const sidePx = ref(180)`

const scriptCustom = `import { ref } from "vue"

const splitCustom = ref(40)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Splitter</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Splits a region into two resizable panels (<code>#before</code> /
      <code>#after</code>) around a draggable separator — the equivalent of the
      shadcn-vue Resizable, with a Quasar API. The handle is draggable with the
      pointer and keyboard-accessible (arrows, <kbd>Shift</kbd> = 10% steps).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic (vertical)</h2>
      <p class="doc-note">
        The <code>v-model</code> holds the size of the <code>#before</code> panel
        in <code>unit</code> (<code>%</code> by default). A fixed
        <code>height</code> on the container keeps the splitter visible.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-splitter v-model="split" style="height: 260px">
          <template #before>
            <div class="demo-panel demo-panel--code">
              <p class="demo-panel__title">Files</p>
              <div v-for="f in files" :key="f" class="demo-file">{{ f }}</div>
            </div>
          </template>
          <template #after>
            <div class="demo-panel demo-panel--preview">
              <p class="demo-panel__title">Preview</p>
              <p class="demo-p">Drag the handle — or focus it and use the arrow keys.</p>
            </div>
          </template>
        </q-splitter>
        <p class="demo-p demo-meta">Left panel: {{ Math.round(split) }}%</p>
      </docs-demo>
    </section>

    <!-- ═══════ Horizontal ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Horizontal</h2>
      <p class="doc-note">
        <code>horizontal</code> stacks the panels vertically (top / bottom) — the
        separator becomes a row-resize handle.
      </p>

      <docs-demo :code="usageHorizontal" lang="html" filename="App.vue" :script="scriptHorizontal">
        <q-splitter v-model="splitH" horizontal style="height: 240px">
          <template #before>
            <div class="demo-panel demo-panel--header">
              <p class="demo-panel__title">Toolbar</p>
              <p class="demo-p">Top panel — drag the separator up/down.</p>
            </div>
          </template>
          <template #after>
            <div class="demo-panel demo-panel--body">
              <p class="demo-panel__title">Content</p>
              <p class="demo-p">Shift + arrows step by 10% instead of 1%.</p>
            </div>
          </template>
        </q-splitter>
      </docs-demo>
    </section>

    <!-- ═══════ Fixed sidebar (px) ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Fixed sidebar (px &amp; limits)</h2>
      <p class="doc-note">
        <code>unit="px"</code> sizes the first panel in pixels (real layouts:
        sidebar + content), and <code>limits</code> clamps the drag between
        <code>[min, max]</code>.
      </p>

      <docs-demo :code="usagePx" lang="html" filename="App.vue" :script="scriptPx">
        <q-splitter v-model="sidePx" unit="px" :limits="[120, 320]" style="height: 220px">
          <template #before>
            <div class="demo-panel demo-panel--sidebar">
              Sidebar ({{ Math.round(sidePx) }}px)
            </div>
          </template>
          <template #after>
            <div class="demo-panel demo-panel--body">
              <p class="demo-panel__title">Main content</p>
              <p class="demo-p">Clamped between 120 px and 320 px.</p>
            </div>
          </template>
        </q-splitter>
      </docs-demo>
    </section>

    <!-- ═══════ Custom separator ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom separator</h2>
      <p class="doc-note">
        The <code>#separator</code> slot replaces the default handle — combine it
        with <code>separator-style</code> (transparent track, colored knob…) for a
        custom look.
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptCustom">
        <q-splitter
          v-model="splitCustom"
          style="height: 220px"
          separator-style="background: transparent"
        >
          <template #before>
            <div class="demo-panel demo-panel--a">A</div>
          </template>
          <template #after>
            <div class="demo-panel demo-panel--b">B</div>
          </template>
          <template #separator>
            <span class="demo-knob">
              <span class="demo-knob__dot" />
              <span class="demo-knob__dot" />
              <span class="demo-knob__dot" />
            </span>
          </template>
        </q-splitter>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSplitter API</h2>
      <docs-api :comp="splitter" :source="splitterSource" />
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
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}

/* — panneaux de démo — */
.demo-panel {
  height: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  overflow: hidden;
}
.demo-panel__title {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
}
.demo-panel--code {
  background: #0d1117;
  color: #e6edf3;
}
.demo-panel--code .demo-panel__title {
  color: #8b949e;
}
.demo-file {
  padding: 5px 8px;
  margin-bottom: 2px;
  border-radius: 6px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 13px;
  color: #e6edf3;
}
.demo-file:nth-child(odd) {
  background: rgb(255 255 255 / 0.05);
}
.demo-panel--preview {
  background: #fafbfc;
}
.demo-panel--header {
  background: #f3f4f6;
  border-bottom: 1px solid rgb(0 0 0 / 0.08);
}
.demo-panel--body {
  background: #fff;
}
.demo-panel--sidebar {
  background: #f3f4f6;
  border-right: 1px solid rgb(0 0 0 / 0.08);
  font-size: 14px;
  color: var(--foreground);
}
.demo-panel--a {
  background: rgb(25 118 210 / 0.12);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}
.demo-panel--b {
  background: rgb(0 150 136 / 0.12);
  color: #00796b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

/* — poignée personnalisée — */
.demo-knob {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 6px 4px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgb(0 0 0 / 0.15);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.12);
}
.demo-knob__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.4);
}
kbd {
  background: rgb(0 0 0 / 0.06);
  border: 1px solid rgb(0 0 0 / 0.12);
  border-bottom-width: 2px;
  border-radius: 5px;
  padding: 1px 5px;
  font-size: 0.85em;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  color: var(--foreground);
}
</style>
