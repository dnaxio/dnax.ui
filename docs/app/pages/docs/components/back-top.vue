<script setup lang="ts">
// Back Top — QBackTop : bouton flottant qui apparaît au scroll et remonte en haut.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const backTop = useComponent(() => "QBackTop")
const backTopSource = componentSource("QBackTop")
const tag = componentTag("QBackTop")

// — Démo : lignes pour rendre la scène scrollable —
const lines = ref(Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`))

const usageBasic = `<q-back-top :offset="100" />

<!-- inside a scrollable container, it tracks that container's scroll -->
<div class="scroll" style="max-height: 320px; overflow-y: auto">
  <p v-for="row in rows" :key="row">{{ row }}</p>
</div>
<q-back-top :offset="100" />`

const usageCustom = `<q-back-top
  :offset="100"
  position="bottom-left"
  color="secondary"
  icon="lucide:rocket"
/>`

const usagePositions = `<q-back-top :offset="100" position="bottom-right" />
<q-back-top :offset="100" position="bottom-left" />
<q-back-top :offset="100" position="top-right" />
<q-back-top :offset="100" position="top-left" />`

const scriptData = `import { ref } from "vue"

const rows = ref(Array.from({ length: 30 }, (_, i) => "Row " + (i + 1)))`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Back Top</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A button <b>stuck to the corner of its scrollable parent</b>
      (<code>position: sticky</code> in the parent div), which appears after
      scrolling down past <code>offset</code> px and smoothly scrolls back to the
      top when clicked. It tracks the window scroll — or the nearest scrollable
      container — and never disappears while scrolling (no fixed/transform
      pitfalls).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Scroll the stage below — after <code>offset="100"</code> px the round button
        fades in at the bottom-right corner; click it to jump back to the top.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-stage">
          <p v-for="row in lines" :key="row" class="demo-row">{{ row }}</p>
          <q-back-top :offset="100" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Positions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Positions</h2>
      <p class="doc-note">
        The button is <code>position: sticky</code> in its parent container — it
        stays glued to the corner while the container scrolls (no
        <code>position: fixed</code>, so no ancestor can break it). Scroll one of
        the stages below to reveal it at its corner:
      </p>

      <docs-demo :code="usagePositions" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-stage-grid">
          <div class="demo-stage">
            <p class="demo-label">bottom-right</p>
            <p v-for="row in lines" :key="row" class="demo-row">{{ row }}</p>
            <q-back-top :offset="100" position="bottom-right" />
          </div>
          <div class="demo-stage">
            <p class="demo-label">bottom-left</p>
            <p v-for="row in lines" :key="row" class="demo-row">{{ row }}</p>
            <q-back-top :offset="100" position="bottom-left" />
          </div>
          <div class="demo-stage">
            <p class="demo-label">top-right</p>
            <p v-for="row in lines" :key="row" class="demo-row">{{ row }}</p>
            <q-back-top :offset="100" position="top-right" />
          </div>
          <div class="demo-stage">
            <p class="demo-label">top-left</p>
            <p v-for="row in lines" :key="row" class="demo-row">{{ row }}</p>
            <q-back-top :offset="100" position="top-left" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom</h2>
      <p class="doc-note">
        <code>position</code> (bottom-right default, bottom-left, top-right,
        top-left), <code>color</code>, an Iconify <code>icon</code> or a custom
        slot.
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-stage">
          <p v-for="row in lines" :key="row" class="demo-row">{{ row }}</p>
          <q-back-top :offset="100" position="bottom-left" color="secondary" icon="lucide:rocket" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBackTop API</h2>
      <docs-api :comp="backTop" :source="backTopSource" />
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

/* — Scènes scrollables : le back-top est sticky dans la scène (aucun override) — */
.demo-stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.demo-stage {
  position: relative;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  padding: 8px;
  background: #fff;
}
.demo-label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
  text-align: center;
}
.demo-row {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--foreground);
}
.demo-row:nth-child(odd) {
  background: rgb(0 0 0 / 0.03);
}
</style>
