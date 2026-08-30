<script setup lang="ts">
// Pull To Refresh — documentation du composant QPullToRefresh : tirer pour rafraîchir.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const pullToRefresh = useComponent(() => "QPullToRefresh")
const pullToRefreshSource = componentSource("QPullToRefresh")
const tag = componentTag("QPullToRefresh")

// — Démos interactives —
const items = ref(Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`))
const refreshed = ref(0)
const refreshing = ref(false)

const onRefresh = (done: () => void) => {
  setTimeout(() => {
    refreshed.value++
    items.value = [`Fresh item ${refreshed.value}`, ...items.value].slice(0, 12)
    done()
  }, 1200)
}

const onRefreshControlled = (done: () => void) => {
  setTimeout(() => {
    refreshed.value++
    items.value = [`Fresh item ${refreshed.value}`, ...items.value].slice(0, 12)
    done()
  }, 1000)
}

const trigger = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    refreshed.value++
    items.value = [`Fresh item ${refreshed.value}`, ...items.value].slice(0, 12)
  }, 1000)
}

const usageBasic = `<q-pull-to-refresh @refresh="onRefresh" style="height: 320px">
  <div v-for="it in items" :key="it" class="row">{{ it }}</div>
</q-pull-to-refresh>
<p class="demo-p demo-meta">Refreshed {{ refreshed }}× — pull down (mouse or touch) to trigger.</p>

<script setup>
import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)

const onRefresh = (done) => {
  setTimeout(() => {
    refreshed.value++
    items.value = ["Fresh item " + refreshed.value, ...items.value].slice(0, 12)
    done() // done() termine le refresh et masque l'indicateur
  }, 1200)
}
<\/script>`

const usageCustom = `<q-pull-to-refresh
  @refresh="onRefresh"
  color="secondary"
  :pull-back="70"
  size="20px"
  style="height: 260px"
>
  <div v-for="it in items" :key="it" class="row">{{ it }}</div>
</q-pull-to-refresh>
<!-- pull-back : distance de traction avant déclenchement (défaut 40 px).
     size : taille de l'icône / du spinner (défaut 28 px). -->`

const usageSlots = `<q-pull-to-refresh @refresh="onRefresh" style="height: 260px">
  <template #pulling="{ position }">
    <span class="pull-label">↓ Pull to refresh ({{ Math.round(position) }}px)</span>
  </template>
  <template #refreshing>
    <span class="refresh-label">Syncing…</span>
  </template>
  <div v-for="it in items" :key="it" class="row">{{ it }}</div>
</q-pull-to-refresh>`

const usageControlled = `<q-btn label="Trigger refresh" color="primary" @click="trigger" />
<q-pull-to-refresh v-model="refreshing" @refresh="onRefresh" style="height: 240px">
  <div v-for="it in items" :key="it" class="row">{{ it }}</div>
</q-pull-to-refresh>
<!-- v-model pilote l'indicateur : pull OU bouton déclenchent le refresh. -->`

const scriptBasic = `import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)

const onRefresh = (done) => {
  setTimeout(() => {
    refreshed.value++
    items.value = ["Fresh item " + refreshed.value, ...items.value].slice(0, 12)
    done()
  }, 1200)
}`

const scriptCustom = `import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)

const onRefresh = (done) => {
  setTimeout(() => {
    refreshed.value++
    items.value = ["Fresh item " + refreshed.value, ...items.value].slice(0, 12)
    done()
  }, 1200)
}`

const scriptSlots = scriptCustom

const scriptControlled = `import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)
const refreshing = ref(false)

const onRefresh = (done) => {
  setTimeout(() => { refreshed.value++; items.value = ["Fresh " + refreshed.value, ...items.value].slice(0, 12); done() }, 1000)
}

const trigger = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    refreshed.value++
    items.value = ["Fresh " + refreshed.value, ...items.value].slice(0, 12)
  }, 1000)
}`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Pull To Refresh</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Pull down from the top of a scrollable container to refresh — the gesture
      works with <b>mouse and touch</b> (pointer events). <b>&lt;q-pull-to-refresh&gt;</b>
      shows a rotating indicator while pulling and a spinner while
      <code>refresh(done)</code> runs; call <code>done()</code> when the fetch
      finishes.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Drag down from the top (mouse or touch), release past the threshold: the
        spinner shows, <code>refresh(done)</code> fires and a fresh item is
        prepended once <code>done()</code> is called.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-pull-to-refresh @refresh="onRefresh" style="height: 320px">
          <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
        </q-pull-to-refresh>
        <p class="demo-p demo-meta">Refreshed {{ refreshed }}× — pull down (mouse or touch) to trigger.</p>
      </docs-demo>
    </section>

    <!-- ═══════ Custom color & threshold ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Color &amp; threshold</h2>
      <p class="doc-note">
        <code>color</code> styles the indicator (token or hex);
        <code>pull-back</code> sets the drag distance before triggering
        (default 40 px) and <code>size</code> the icon/spinner size
        (default 28 px).
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptCustom">
        <q-pull-to-refresh
          @refresh="onRefresh"
          color="secondary"
          :pull-back="70"
          size="20px"
          style="height: 260px"
        >
          <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
        </q-pull-to-refresh>
      </docs-demo>
    </section>

    <!-- ═══════ Custom slots ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom indicators</h2>
      <p class="doc-note">
        <code>#pulling</code> (receives <code>position</code> — the drag distance)
        replaces the rotating icon while dragging; <code>#refreshing</code>
        replaces the spinner while loading.
      </p>

      <docs-demo :code="usageSlots" lang="html" filename="App.vue" :script="scriptSlots">
        <q-pull-to-refresh @refresh="onRefresh" style="height: 260px">
          <template #pulling="{ position }">
            <span class="demo-pull-label">↓ Pull to refresh ({{ Math.round(position) }}px)</span>
          </template>
          <template #refreshing>
            <span class="demo-refresh-label">Syncing…</span>
          </template>
          <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
        </q-pull-to-refresh>
      </docs-demo>
    </section>

    <!-- ═══════ Controlled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Controlled (v-model)</h2>
      <p class="doc-note">
        With <code>v-model</code> the parent owns the refreshing state — the pull
        gesture still works, and the indicator can also be triggered
        programmatically (here via the button).
      </p>

      <docs-demo :code="usageControlled" lang="html" filename="App.vue" :script="scriptControlled">
        <div class="demo-col">
          <q-btn label="Trigger refresh" color="primary" @click="trigger" />
          <q-pull-to-refresh v-model="refreshing" @refresh="onRefreshControlled" style="height: 240px">
            <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
          </q-pull-to-refresh>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QPullToRefresh API</h2>
      <docs-api :comp="pullToRefresh" :source="pullToRefreshSource" />
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
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-row {
  padding: 10px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-size: 14px;
  color: var(--foreground);
  background: #fff;
}
.demo-pull-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}
.demo-refresh-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}
</style>
