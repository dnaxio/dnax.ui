<script setup lang="ts">
// Reorder — documentation du composant QReorder : liste réordonnable par glisser-déposer.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const reorder = useComponent(() => "QReorder")
const reorderSource = componentSource("QReorder")
const tag = componentTag("QReorder")

// — Démo 1 : liste simple —
const names = ref(["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra"])

// — Démo 2 : items custom (cartes) —
const tracks = ref([
  { id: "m83", title: "Midnight City", artist: "M83" },
  { id: "daft", title: "Instant Crush", artist: "Daft Punk" },
  { id: "fm", title: "Feels Like We Only Go Backwards", artist: "Tame Impala" },
  { id: "blond", title: "Pink + White", artist: "Frank Ocean" },
  { id: "ocean", title: "Bohemian Rhapsody", artist: "Queen" },
])

// — Démo 3 : mode poignée —
const queue = ref(["Now playing", "Next up", "Later", "Last"])

// — Démo 4 : désactivé —
const locked = ref(["Locked A", "Locked B", "Locked C"])

const lastEvent = ref("")

const onReorder = (e: { from: number; to: number }) => {
  lastEvent.value = `moved ${e.from + 1} → ${e.to + 1}`
}

const usageBasic = `<q-reorder v-model="items" @reorder="onReorder">
  <template #item="{ item, index, dragging }">
    <div class="row" :class="{ 'row--dragging': dragging }">
      <span class="row__index">{{ index + 1 }}</span>
      <span>{{ item }}</span>
    </div>
  </template>
</q-reorder>`

const usageCustom = `<q-reorder v-model="tracks" row-key="id">
  <template #item="{ item, dragging }">
    <div class="track" :class="{ 'track--dragging': dragging }">
      <span class="track__art">🎵</span>
      <div class="track__meta">
        <b>{{ item.title }}</b>
        <span>{{ item.artist }}</span>
      </div>
    </div>
  </template>
</q-reorder>`

const usageHandle = `<q-reorder v-model="queue" handle>
  <template #item="{ item, index }">
    <span class="row">{{ index + 1 }}. {{ item }}</span>
  </template>
</q-reorder>
<!-- handle : le drag ne démarre que depuis la poignée (grip) -->`

const usageLocked = `<q-reorder v-model="locked" disable>
  <template #item="{ item }">
    <span class="row">{{ item }}</span>
  </template>
</q-reorder>`

const scriptBasic = `import { ref } from "vue"

const items = ref(["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra"])`

const scriptCustom = `import { ref } from "vue"

const tracks = ref([
  { id: "m83", title: "Midnight City", artist: "M83" },
  { id: "daft", title: "Instant Crush", artist: "Daft Punk" },
  { id: "fm", title: "Feels Like We Only Go Backwards", artist: "Tame Impala" },
  { id: "blond", title: "Pink + White", artist: "Frank Ocean" },
])`

const scriptHandle = `import { ref } from "vue"

const queue = ref(["Now playing", "Next up", "Later", "Last"])`

const scriptLocked = `import { ref } from "vue"

const locked = ref(["Locked A", "Locked B", "Locked C"])`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Reorder</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A draggable list: reorder items with the mouse or touch, or with the
      keyboard (<kbd>↑</kbd>/<kbd>↓</kbd> when an item is focused).
      <b>&lt;q-reorder&gt;</b> updates the <code>v-model</code> on drop and emits
      <code>reorder</code> with <code>{ from, to }</code>. The <code>#item</code>
      slot receives <code>{ item, index, dragging }</code>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Drag any row (the whole line is draggable by default). Items slide smoothly
        as you move; release to commit.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-reorder v-model="names" class="demo-list" @reorder="onReorder">
          <template #item="{ item, index, dragging }">
            <div class="demo-row" :class="{ 'demo-row--dragging': dragging }">
              <span class="demo-row__index">{{ index + 1 }}</span>
              <span>{{ item }}</span>
            </div>
          </template>
        </q-reorder>
      </docs-demo>
    </section>

    <!-- ═══════ Custom items ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom items</h2>
      <p class="doc-note">
        The <code>#item</code> slot renders anything; pass
        <code>row-key</code> for stable keys with object items.
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptCustom">
        <q-reorder v-model="tracks" row-key="id" class="demo-list">
          <template #item="{ item, dragging }">
            <div class="demo-track" :class="{ 'demo-track--dragging': dragging }">
              <span class="demo-track__art">
                <q-icon name="lucide:music-2" size="16px" />
              </span>
              <div class="demo-track__meta">
                <b>{{ item.title }}</b>
                <span>{{ item.artist }}</span>
              </div>
            </div>
          </template>
        </q-reorder>
      </docs-demo>
    </section>

    <!-- ═══════ Handle ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Handle mode</h2>
      <p class="doc-note">
        <code>handle</code> restricts the drag to the grip — ideal when rows
        contain interactive content (buttons, inputs).
      </p>

      <docs-demo :code="usageHandle" lang="html" filename="App.vue" :script="scriptHandle">
        <q-reorder v-model="queue" handle class="demo-list">
          <template #item="{ item, index }">
            <span class="demo-row">{{ index + 1 }}. {{ item }}</span>
          </template>
        </q-reorder>
      </docs-demo>
    </section>

    <!-- ═══════ Disabled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Disabled</h2>
      <p class="doc-note">
        <code>disable</code> locks the list (no drag, no keyboard move).
      </p>

      <docs-demo :code="usageLocked" lang="html" filename="App.vue" :script="scriptLocked">
        <q-reorder v-model="locked" disable class="demo-list">
          <template #item="{ item }">
            <span class="demo-row">{{ item }}</span>
          </template>
        </q-reorder>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QReorder API</h2>
      <p class="doc-note">
        Slots: <code>#item</code> (receives <code>{ item, index, dragging }</code>)
        and <code>#handle</code> (default: grip icon). Events:
        <code>update:modelValue</code> and <code>reorder</code>
        (<code>{ from, to }</code>).
      </p>
      <docs-api :comp="reorder" :source="reorderSource" />
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

/* — listes démo — */
.demo-list {
  max-width: 460px;
  margin: 0 auto;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  background: var(--background, #fff);
  font-size: 14px;
  color: var(--foreground);
}
.demo-row + .demo-row {
  margin-top: 6px;
}
.demo-row__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 7px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
}
.demo-row--dragging {
  border-color: var(--primary);
  box-shadow: 0 10px 24px rgb(25 118 210 / 0.18);
}

/* — carte piste — */
.demo-track {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  background: var(--background, #fff);
}
.demo-track + .demo-track {
  margin-top: 6px;
}
.demo-track__art {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: #fff;
  flex-shrink: 0;
}
.demo-track__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
}
.demo-track__meta b {
  font-size: 14px;
  color: var(--foreground);
}
.demo-track__meta span {
  font-size: 12px;
  color: #8b93a1;
}
.demo-track--dragging {
  border-color: var(--primary);
  box-shadow: 0 10px 24px rgb(124 58 237 / 0.2);
}
</style>
