<script setup lang="ts">
// Spinner — documentation du composant QSpinner : indicateurs de chargement SVG.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const spinner = useComponent(() => "QSpinner")
const spinnerSource = componentSource("QSpinner")
const tag = componentTag("QSpinner")

// — Démo types interactifs —
const type = ref<
  | "tail" | "oval" | "bars" | "dots" | "grid" | "rings" | "puff" | "audio"
  | "ios" | "radio" | "gear" | "gears" | "cube"
>("tail")
const types = [
  "tail", "oval", "bars", "dots", "grid", "rings", "puff", "audio",
  "ios", "radio", "gear", "gears", "cube",
]

const usageBasic = `<q-spinner size="40px" color="primary" />
<q-spinner type="ios" size="40px" color="secondary" />
<q-spinner type="audio" size="40px" color="positive" />
<q-spinner type="radio" size="40px" color="warning" />
<q-spinner type="gear" size="40px" color="info" />
<q-spinner type="gears" size="40px" color="teal" />
<q-spinner type="cube" size="40px" color="#7c3aed" />`

const usageTypes = `<q-select v-model="type" :options="types" outlined dense label="Type" />
<q-spinner :type="type" size="44px" color="primary" />`

const usageSizes = `<q-spinner size="16px" />
<q-spinner size="24px" color="secondary" />
<q-spinner size="36px" color="positive" />
<q-spinner size="48px" color="warning" />
<q-spinner size="64px" color="teal" />`

const usageColors = `<q-spinner :thickness="3" color="primary" />
<q-spinner :thickness="3" color="secondary" />
<q-spinner :thickness="3" color="#7c3aed" />
<q-spinner type="dots" color="negative" />
<q-spinner type="audio" color="warning" />
<q-spinner type="bars" color="positive" />`

const scriptTypes = `import { ref } from "vue"

const type = ref("tail")
const types = ["tail", "oval", "bars", "dots", "grid", "rings", "puff", "audio", "ios", "radio", "gear", "gears", "cube"]`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Spinner</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Loading indicators as crisp SVGs. <b>&lt;q-spinner&gt;</b> offers thirteen
      variants via <code>type</code> (tail, oval, bars, dots, grid, rings, puff,
      audio, ios, radio, gear, gears, cube), any <code>size</code>, any
      <code>color</code> and a <code>thickness</code> for the ring variants.
      Animations respect <code>prefers-reduced-motion</code>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        The classic <code>tail</code> by default — a faint track with a rotating
        arc.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-spinner size="40px" color="primary" />
          <q-spinner type="ios" size="40px" color="secondary" />
          <q-spinner type="audio" size="40px" color="positive" />
          <q-spinner type="radio" size="40px" color="warning" />
          <q-spinner type="gear" size="40px" color="info" />
          <q-spinner type="gears" size="40px" color="teal" />
          <q-spinner type="cube" size="40px" color="#7c3aed" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Types ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">All types</h2>
      <p class="doc-note">
        Switch <code>type</code> live: <code>tail</code>, <code>oval</code>,
        <code>bars</code>, <code>dots</code>, <code>grid</code>,
        <code>rings</code>, <code>puff</code>, <code>audio</code>,
        <code>ios</code>, <code>radio</code>, <code>gear</code>, <code>gears</code>, <code>cube</code>.
      </p>

      <docs-demo :code="usageTypes" lang="html" filename="App.vue" :script="scriptTypes">
        <div class="demo-col">
          <q-select v-model="type" :options="types" outlined dense label="Type" class="demo-select" />
          <q-spinner :type="type" size="44px" color="primary" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Sizes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sizes</h2>
      <p class="doc-note">
        <code>size</code> accepts px or any CSS value.
      </p>

      <docs-demo :code="usageSizes" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-spinner size="16px" />
          <q-spinner size="24px" color="secondary" />
          <q-spinner size="36px" color="positive" />
          <q-spinner size="48px" color="warning" />
          <q-spinner size="64px" color="teal" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Colors ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors &amp; thickness</h2>
      <p class="doc-note">
        Any token or hex; <code>thickness</code> tunes the stroke of the ring
        variants.
      </p>

      <docs-demo :code="usageColors" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-spinner :thickness="3" color="primary" />
          <q-spinner :thickness="3" color="secondary" />
          <q-spinner :thickness="3" color="#7c3aed" />
          <q-spinner type="dots" color="negative" />
          <q-spinner type="audio" color="warning" />
          <q-spinner type="bars" color="positive" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSpinner API</h2>
      <docs-api :comp="spinner" :source="spinnerSource" />
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

.demo-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 0;
}
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.demo-select {
  width: 200px;
}
</style>
