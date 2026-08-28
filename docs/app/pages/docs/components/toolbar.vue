<script setup lang="ts">
// QToolbar — API Quasar : <q-toolbar inset shrink>
// Barre d'actions avec padding horizontal par défaut (0 12px), min-height 50px.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const toolbar = useComponent(() => "QToolbar")
const toolbarSource = componentSource("QToolbar")
const tag = componentTag("QToolbar")

// — Demos —
const basicCode = `<q-toolbar>
  <span class="demo-title">Inbox</span>
  <q-space />
  <q-btn flat round dense icon="lucide:search" />
  <q-btn flat round dense icon="lucide:bell" />
  <q-btn flat round dense icon="lucide:menu" />
</q-toolbar>`

const headerCode = `<q-toolbar>
  <q-btn flat round dense icon="lucide:arrow-left" />
  <span class="demo-title">Settings</span>
  <q-space />
  <q-btn flat dense label="Save" unelevated color="primary" />
</q-toolbar>`

const insetShrinkCode = `<q-toolbar inset>
  <q-btn flat round dense icon="lucide:menu" />
  <span class="demo-title">Inset — extra left padding</span>
</q-toolbar>

<q-toolbar shrink>
  <q-btn flat round dense icon="lucide:heart" />
  <span class="demo-title">Shrink — fits content</span>
</q-toolbar>`

const headerUsage = `<q-header>
  <q-toolbar>
    <q-btn flat round dense icon="lucide:menu" />
    <span class="demo-title">App</span>
    <q-space />
  </q-toolbar>
</q-header>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Toolbar</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      The toolbar is a horizontal action bar for page headers and footers. It has a
      default padding of <code>0 12px</code> and a <code>min-height</code> of 50px,
      aligns children with flex, and exposes the Quasar <code>inset</code> and
      <code>shrink</code> modifiers.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic toolbar</h2>
      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-toolbar">
          <q-toolbar>
            <span class="demo-title">Inbox</span>
            <q-space />
            <q-btn flat round dense icon="lucide:search" />
            <q-btn flat round dense icon="lucide:bell" />
            <q-btn flat round dense icon="lucide:menu" />
          </q-toolbar>
        </div>
      </docs-demo>
      <p class="doc-note">
        Combine a title, <code>&lt;q-space /&gt;</code> to push actions to the right,
        and <code>&lt;q-btn&gt;</code> for the actions. Everything inside the default
        slot is laid out with an 8px gap.
      </p>
    </section>

    <!-- ═══════ Header pattern ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">In a header</h2>
      <docs-demo :code="headerCode" lang="html" filename="App.vue">
        <div class="demo-toolbar">
          <q-toolbar>
            <q-btn flat round dense icon="lucide:arrow-left" />
            <span class="demo-title">Settings</span>
            <q-space />
            <q-btn flat dense label="Save" unelevated color="primary" />
          </q-toolbar>
        </div>
      </docs-demo>
      <p class="doc-note">
        QToolbar is designed to live inside a <code>&lt;q-header&gt;</code> or
        <code>&lt;q-footer&gt;</code> — those wrappers apply the safe-area insets and
        optional fixed positioning.
      </p>
      <q-syntax :code="headerUsage" lang="html" filename="App.vue" copy />
    </section>

    <!-- ═══════ Inset & shrink ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Inset &amp; shrink</h2>
      <docs-demo :code="insetShrinkCode" lang="html" filename="App.vue">
        <div class="demo-col">
          <div class="demo-toolbar">
            <q-toolbar inset>
              <q-btn flat round dense icon="lucide:menu" />
              <span class="demo-title">Inset — extra left padding</span>
            </q-toolbar>
          </div>
          <div class="demo-toolbar demo-toolbar--fit">
            <q-toolbar shrink>
              <q-btn flat round dense icon="lucide:heart" />
              <span class="demo-title">Shrink — fits content</span>
            </q-toolbar>
          </div>
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>inset</code> adds extra left padding (16px) — handy under a drawer.
        <code>shrink</code> stops the toolbar from stretching: it only takes the width
        of its content.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="toolbar" :source="toolbarSource" />
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
.demo-title {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}
.demo-toolbar {
  background: #f6f7f9;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 8px;
  overflow: hidden;
}
.demo-toolbar--fit {
  display: inline-flex;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* espace entre les deux blocs docs-demo */
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
</style>
