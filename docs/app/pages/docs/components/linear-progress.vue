<script setup lang="ts">
// Linear Progress — documentation du composant QLinearProgress : barre de progression.
import { onBeforeUnmount, ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const linearProgress = useComponent(() => "QLinearProgress")
const linearProgressSource = componentSource("QLinearProgress")
const tag = componentTag("QLinearProgress")

// — Démo interactive : téléchargement simulé —
const download = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const startDownload = () => {
  if (timer) return
  download.value = 0
  timer = setInterval(() => {
    download.value += Math.random() * 0.12
    if (download.value >= 1) {
      download.value = 1
      if (timer) clearInterval(timer)
      timer = null
    }
  }, 180)
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const usageBasic = `<q-linear-progress :value="0.25" />
<q-linear-progress :value="0.5" color="secondary" />
<q-linear-progress :value="0.75" color="positive" />
<q-linear-progress :value="1" color="teal" />`

const usageDownload = `<q-linear-progress :value="progress" color="positive" size="8px" rounded />
<p class="demo-p demo-meta">{{ Math.round(progress * 100) }}% — press Start to simulate a download.</p>
<q-btn label="Start download" color="primary" @click="startDownload" />`

const usageColors = `<q-linear-progress :value="0.7" color="primary" stripe />
<q-linear-progress :value="0.6" color="secondary" stripe />
<q-linear-progress :value="0.8" color="negative" />
<q-linear-progress :value="0.9" color="warning" />
<q-linear-progress :value="0.5" color="#7c3aed" />`

const usageSizes = `<q-linear-progress :value="0.5" size="2px" />
<q-linear-progress :value="0.5" size="4px" color="secondary" />
<q-linear-progress :value="0.5" size="8px" color="positive" />
<q-linear-progress :value="0.5" size="12px" color="warning" rounded />
<q-linear-progress :value="0.5" size="16px" color="teal" rounded />`

const usageStates = `<div class="group">
  <p class="demo-p demo-label">Indeterminate — loading…</p>
  <q-linear-progress indeterminate />
  <p class="demo-p demo-label">Query — search…</p>
  <q-linear-progress query color="secondary" />
</div>`

const usageRange = `<q-linear-progress :value="60" :min="0" :max="100" color="secondary" />
<p class="demo-p demo-meta">value = 60 (min 0, max 100)</p>
<q-linear-progress :value="0.7" reverse color="teal" stripe />
<p class="demo-p demo-meta">reverse — fills from the right</p>`

const scriptDownload = `import { onBeforeUnmount, ref } from "vue"

const progress = ref(0)
let timer = null

const startDownload = () => {
  if (timer) return
  progress.value = 0
  timer = setInterval(() => {
    progress.value += Math.random() * 0.12
    if (progress.value >= 1) {
      progress.value = 1
      clearInterval(timer)
      timer = null
    }
  }, 180)
}

onBeforeUnmount(() => { if (timer) clearInterval(timer) })`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Linear Progress</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A linear progress bar. <b>&lt;q-linear-progress&gt;</b> takes a
      <code>value</code> (default range 0–1, custom with <code>min</code> /
      <code>max</code>), a <code>color</code> and <code>track-color</code>, a
      thickness (<code>size</code>), plus <code>stripe</code>,
      <code>reverse</code>, <code>rounded</code> and the indeterminate / query
      loading modes.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic values</h2>
      <p class="doc-note">
        The <code>value</code> is a ratio (0–1 by default); the bar fills from
        left to right.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-linear-progress :value="0.25" />
          <q-linear-progress :value="0.5" color="secondary" />
          <q-linear-progress :value="0.75" color="positive" />
          <q-linear-progress :value="1" color="teal" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Download ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Simulated download</h2>
      <p class="doc-note">
        Drive the <code>value</code> with a timer for a live progress — rounded
        and thicker for a UI bar.
      </p>

      <docs-demo :code="usageDownload" lang="html" filename="App.vue" :script="scriptDownload">
        <div class="demo-col">
          <q-linear-progress :value="download" color="positive" size="8px" rounded />
          <p class="demo-p demo-meta">
            {{ Math.round(download * 100) }}% — press Start to simulate a download.
          </p>
          <q-btn label="Start download" color="primary" @click="startDownload" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Colors & stripe ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors &amp; stripe</h2>
      <p class="doc-note">
        <code>color</code> accepts any token or hex; <code>stripe</code> adds
        animated stripes.
      </p>

      <docs-demo :code="usageColors" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-linear-progress :value="0.7" color="primary" stripe />
          <q-linear-progress :value="0.6" color="secondary" stripe />
          <q-linear-progress :value="0.8" color="negative" />
          <q-linear-progress :value="0.9" color="warning" />
          <q-linear-progress :value="0.5" color="#7c3aed" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Sizes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sizes</h2>
      <p class="doc-note">
        <code>size</code> sets the thickness (default 4 px) — from a hairline to
        a chunky bar; <code>rounded</code> softens the ends.
      </p>

      <docs-demo :code="usageSizes" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-linear-progress :value="0.5" size="2px" />
          <q-linear-progress :value="0.5" size="4px" color="secondary" />
          <q-linear-progress :value="0.5" size="8px" color="positive" />
          <q-linear-progress :value="0.5" size="12px" color="warning" rounded />
          <q-linear-progress :value="0.5" size="16px" color="teal" rounded />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Indeterminate & query ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Loading modes</h2>
      <p class="doc-note">
        <code>indeterminate</code> sweeps a band across the track (loading…);
        <code>query</code> is the reverse sweep (search…).
      </p>

      <docs-demo :code="usageStates" lang="html" filename="App.vue">
        <div class="demo-col">
          <p class="demo-p demo-label">Indeterminate — loading…</p>
          <q-linear-progress indeterminate />
          <p class="demo-p demo-label">Query — search…</p>
          <q-linear-progress query color="secondary" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Range & reverse ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom range &amp; reverse</h2>
      <p class="doc-note">
        <code>min</code>/<code>max</code> remap the value (e.g. 0–100);
        <code>reverse</code> fills from the right.
      </p>

      <docs-demo :code="usageRange" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-linear-progress :value="60" :min="0" :max="100" color="secondary" />
          <p class="demo-p demo-meta">value = 60 (min 0, max 100)</p>
          <q-linear-progress :value="0.7" reverse color="teal" stripe />
          <p class="demo-p demo-meta">reverse — fills from the right</p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QLinearProgress API</h2>
      <docs-api :comp="linearProgress" :source="linearProgressSource" />
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
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
.demo-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
  margin-bottom: -4px;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 520px;
  margin: 0 auto;
}
</style>
