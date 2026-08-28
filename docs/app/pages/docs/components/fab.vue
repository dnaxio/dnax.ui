<script setup lang="ts">
// Fab — documentation complète de la famille :
// QFab (bouton d'action flottant) + QFabAction (action dépliable).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const fab = useComponent(() => "QFab")
const fabSource = componentSource("QFab")
const fabAction = useComponent(() => "QFabAction")
const fabActionSource = componentSource("QFabAction")

const tag = componentTag("QFab")

// — Démos —
const openBasic = ref(false)
const openPositions = ref(false)
const openLeft = ref(false)
const openColors = ref(false)
const openActions = ref(false)
const lastAction = ref("")

const basicCode = `<q-fab v-model="open" color="primary">
  <q-fab-action label="Share" icon="lucide:share-2" color="secondary" />
  <q-fab-action label="Camera" icon="lucide:camera" color="positive" />
  <q-fab-action label="Mail" icon="lucide:mail" />
</q-fab>`

const positionsCode = `<q-fab v-model="open" position="bottom-left" />
<q-fab v-model="open" position="top-right" />`

const colorsCode = `<q-fab v-model="open" color="negative" icon="lucide:message-circle">
  <q-fab-action label="New message" icon="lucide:message-square-plus" />
  <q-fab-action label="Voice note" icon="lucide:mic" color="positive" />
</q-fab>`

const actionsCode = `<q-fab v-model="open">
  <q-fab-action label="Edit" icon="lucide:pencil" />
  <q-fab-action label="Archive" icon="lucide:archive" color="warning" />
  <q-fab-action label="Delete" icon="lucide:trash-2" color="negative" disable />
</q-fab>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Fab</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A floating action button (<b>&lt;q-fab&gt;</b>) that expands a stack of actions
      (<b>&lt;q-fab-action&gt;</b>). Fixed to the screen edge with iOS safe-areas
      built in — perfect for mobile-first apps.
    </p>

    <!-- ═══════ QFab ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QFab — floating action button</h2>
      <p class="doc-note">
        The main button toggles the actions (<code>v-model</code>), rotates its icon
        45° when open, and exposes <code>position</code> (corners),
        <code>icon</code> and <code>color</code>. Clicking an action closes it.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-fab-stage">
          <q-fab v-model="openBasic" color="primary">
            <q-fab-action label="Share" icon="lucide:share-2" color="secondary" @click="lastAction = 'Share'" />
            <q-fab-action label="Camera" icon="lucide:camera" color="positive" @click="lastAction = 'Camera'" />
            <q-fab-action label="Mail" icon="lucide:mail" @click="lastAction = 'Mail'" />
          </q-fab>
          <span class="demo-fab-stage__hint">Click the + button</span>
        </div>
      </docs-demo>
      <p class="demo-p demo-p--value">
        Last action: <code>{{ lastAction || "—" }}</code>
      </p>
    </section>

    <!-- ═══════ Positions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Positions</h2>
      <p class="doc-note">
        <code>top-left</code> | <code>top-right</code> | <code>bottom-left</code> |
        <code>bottom-right</code> (default) — offsets include the safe-areas.
      </p>

      <docs-demo :code="positionsCode" lang="html" filename="App.vue">
        <div class="demo-fab-row">
          <div class="demo-fab-stage">
            <q-fab v-model="openLeft" position="bottom-left" />
            <span class="demo-fab-stage__hint">bottom-left</span>
          </div>
          <div class="demo-fab-stage">
            <q-fab v-model="openPositions" position="top-right" />
            <span class="demo-fab-stage__hint">top-right</span>
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Color & custom icon ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Color &amp; custom icon</h2>
      <p class="doc-note">
        The main button accepts any token or hex color and an Iconify
        <code>icon</code> (default <code>lucide:plus</code>).
      </p>

      <docs-demo :code="colorsCode" lang="html" filename="App.vue">
        <div class="demo-fab-stage">
          <q-fab v-model="openColors" color="negative" icon="lucide:message-circle">
            <q-fab-action label="New message" icon="lucide:message-square-plus" />
            <q-fab-action label="Voice note" icon="lucide:mic" color="positive" />
          </q-fab>
          <span class="demo-fab-stage__hint">Custom icon &amp; color</span>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ QFabAction ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QFabAction — individual action</h2>
      <p class="doc-note">
        Each action shows an optional <code>label</code> pill, a round
        <code>icon</code> button and a <code>color</code>. Clicking it emits
        <code>click</code> and closes the parent fab; <code>disable</code> greys it
        out.
      </p>

      <docs-demo :code="actionsCode" lang="html" filename="App.vue">
        <div class="demo-fab-stage">
          <q-fab v-model="openActions">
            <q-fab-action label="Edit" icon="lucide:pencil" @click="lastAction = 'Edit'" />
            <q-fab-action label="Archive" icon="lucide:archive" color="warning" @click="lastAction = 'Archive'" />
            <q-fab-action label="Delete" icon="lucide:trash-2" color="negative" disable />
          </q-fab>
          <span class="demo-fab-stage__hint">One action is disabled</span>
        </div>
      </docs-demo>
      <p class="demo-p demo-p--value">
        Last action: <code>{{ lastAction || "—" }}</code>
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QFab</h2>
      <docs-api :comp="fab" :source="fabSource" />
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">QFabAction</h2>
      <docs-api :comp="fabAction" :source="fabActionSource" />
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

/* — Scène de démo : le FAB est fixed à l'écran → on l'absolutise dans un cadre — */
.demo-fab-stage {
  position: relative;
  height: 260px;
  border-radius: 12px;
  border: 1px solid rgb(0 0 0 / 0.08);
  background: linear-gradient(160deg, #eef4ff, #f6f1ff);
  overflow: hidden;
}
.demo-fab-stage :deep(.q-fab) {
  position: absolute;
}
.demo-fab-stage__hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #8b93a1;
  pointer-events: none;
}
.demo-fab-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.demo-fab-row .demo-fab-stage {
  flex: 1 1 240px;
}
.demo-p--value {
  margin: 12px 0 0;
  text-align: center;
  font-size: 14px;
  color: #5b6472;
}
</style>
