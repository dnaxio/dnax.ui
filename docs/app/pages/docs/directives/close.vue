<script setup lang="ts">
// Docs — directive v-close : ferme l'overlay (dialog, bottom sheet…) le plus
// proche au clic (équivalent Quasar v-close-popup).
import { ref } from "vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const setupCode = `// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <q-btn v-close /> fonctionne dans toutes les pages.

// Sans le module Nuxt (ou enregistrement manuel) :
import { vClose } from "@dnax/ui"

app.directive("close", vClose)`

const usageDialog = `<q-dialog v-model="open">
  <q-dialog-header title="Delete file?" description="This action cannot be undone." />
  <div class="demo-body">
    <p class="demo-p">
      No @click handler needed — <code>v-close</code> closes the closest
      marked overlay (QDialog, QBottomSheet…).
    </p>
    <div class="guide-row">
      <q-btn color="negative" label="Close (v-close)" v-close />
      <q-btn flat label="Stays open (v-close=false)" v-close="false" />
    </div>
  </div>
</q-dialog>`

const usageSheet = `<q-bottom-sheet v-model="openSheet">
  <q-bottom-sheet-header title="Sheet actions" description="v-close works the same inside a bottom sheet" />
  <div class="demo-body">
    <div class="guide-row">
      <q-btn color="primary" label="Close sheet (v-close)" v-close />
    </div>
  </div>
</q-bottom-sheet>`

const usageDemo = `<div class="guide-row">
  <q-btn no-caps color="primary" label="Open dialog" @click="openDialog = true" />
  <q-btn no-caps color="secondary" label="Open bottom sheet" @click="openSheet = true" />
</div>

<q-dialog v-model="openDialog">
  <q-dialog-header title="Delete file?" description="v-close closes this dialog from anywhere inside it." />
  <div class="demo-body">
    <p class="demo-p">
      Both buttons live inside the dialog. The flat one is disabled through
      <code>v-close="false"</code> — clicking it keeps the dialog open.
    </p>
    <div class="guide-row">
      <q-btn color="negative" label="Close (v-close)" v-close />
      <q-btn flat label="Stays open (v-close=false)" v-close="false" />
    </div>
  </div>
</q-dialog>

<q-bottom-sheet v-model="openSheet">
  <q-bottom-sheet-header title="Sheet actions" description="v-close works the same inside a bottom sheet" />
  <div class="demo-body">
    <div class="guide-row">
      <q-btn color="primary" label="Close sheet (v-close)" v-close />
    </div>
  </div>
</q-bottom-sheet>`

const scriptDemo = `import { ref } from "vue"

const openDialog = ref(false)
const openSheet = ref(false)`

// — Live demo —
const openDialog = ref(false)
const openSheet = ref(false)

// — Tableau des variantes —
const valueRows: { usage: string; effect: string }[] = [
  {
    usage: "<q-btn v-close />",
    effect:
      "On click, closes the closest marked overlay (dialog, bottom sheet…). Works on any element, not only buttons.",
  },
  {
    usage: "<q-btn v-close=\"false\" />",
    effect:
      "Directive disabled: the click is ignored (only an explicit false disables).",
  },
  {
    usage: "<q-btn v-close=\"true\" />",
    effect: "Same as a bare v-close.",
  },
]

const apiRows: { path: string; type: string; meaning: string }[] = [
  { path: "markOverlayClose(el, close)", type: "function", meaning: "Internal: marks an element as a closeable overlay (used by QDialog, QBottomSheet)." },
  { path: "closeParentOverlay(el)", type: "function", meaning: "Closes the closest overlay above el — what v-close calls on click." },
  { path: "vClose", type: "directive", meaning: "The v-close directive object (mounted/unmounted click handling)." },
]
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">v-close</h1>
    <p class="guide__lead">
      <code>v-close</code> closes the closest <b>overlay</b> (dialog, bottom
      sheet…) when the element is clicked — the Quasar
      <code>v-close-popup</code> equivalent. No
      <code>@click</code>, no <code>v-model</code> ref to reach for: put it on
      any button or row inside the overlay content.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Setup</h2>
      <p class="guide__note">
        The <code>@dnax/ui</code> Nuxt module registers the directive
        automatically (client-side only — overlays don't exist during SSR):
      </p>
      <q-syntax :code="setupCode" lang="ts" filename="plugins/directives.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Usage</h2>
      <p class="guide__note">
        Inside a <code>q-dialog</code> — header, content or footer:
      </p>
      <q-syntax :code="usageDialog" lang="html" filename="App.vue" copy />
      <p class="guide__note">
        And identically inside a <code>q-bottom-sheet</code>:
      </p>
      <q-syntax :code="usageSheet" lang="html" filename="App.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue" :script="scriptDemo">
        <div class="guide-row">
          <q-btn no-caps color="primary" label="Open dialog" @click="openDialog = true" />
          <q-btn no-caps color="secondary" label="Open bottom sheet" @click="openSheet = true" />
        </div>

        <q-dialog v-model="openDialog">
          <q-dialog-header title="Delete file?" description="v-close closes this dialog from anywhere inside it." />
          <div class="demo-body">
            <p class="demo-p">
              Both buttons live inside the dialog. The flat one is disabled
              through <code>v-close="false"</code> — clicking it keeps the
              dialog open.
            </p>
            <div class="guide-row">
              <q-btn color="negative" label="Close (v-close)" v-close />
              <q-btn flat label="Stays open (v-close=false)" v-close="false" />
            </div>
          </div>
        </q-dialog>

        <q-bottom-sheet v-model="openSheet">
          <q-bottom-sheet-header title="Sheet actions" description="v-close works the same inside a bottom sheet" />
          <div class="demo-body">
            <div class="guide-row">
              <q-btn color="primary" label="Close sheet (v-close)" v-close />
            </div>
          </div>
        </q-bottom-sheet>
      </docs-demo>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Directive value</h2>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Usage</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in valueRows" :key="row.usage">
              <td><code>{{ row.usage }}</code></td>
              <td>{{ row.effect }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">How it works</h2>
      <p class="guide__note">
        Overlays register themselves by marking their root element
        (<code>markOverlayClose</code>) — currently <code>q-dialog</code> and
        <code>q-bottom-sheet</code> (including their <code>$q.dialog</code> /
        <code>$q.bottomSheet</code> hosts). On click,
        <code>v-close</code> walks up from the clicked element to the closest
        marker and calls its close handler — so with nested overlays, the
        <b>innermost</b> one closes. The click listener is removed when the
        element unmounts.
      </p>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Export</th>
              <th>Type</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in apiRows" :key="row.path">
              <td><code>{{ row.path }}</code></td>
              <td>{{ row.type }}</td>
              <td>{{ row.meaning }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.guide__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.guide__lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.guide__section {
  margin-bottom: 44px;
}
.guide__h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.guide__note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.guide__note code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.guide-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.demo-body {
  padding: 4px 0;
}
.demo-p {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  text-align: center;
}
.demo-p code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.api-table-wrap {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
}
.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.api-table th,
.api-table td {
  text-align: left;
  padding: 8px 14px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.api-table th {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
  background: rgba(148, 163, 184, 0.06);
}
.api-table tr:last-child td {
  border-bottom: none;
}
.api-table code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
  white-space: nowrap;
}
</style>
