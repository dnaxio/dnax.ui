<script setup lang="ts">
// Button Group — QBtnGroup : groupe de QBtn soudés (bords fusionnés, rayons aux extrémités).
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const btnGroup = useComponent(() => "QBtnGroup")
const btnGroupSource = componentSource("QBtnGroup")
const tag = componentTag("QBtnGroup")

const basicCode = `<q-btn-group unelevated>
  <q-btn icon="lucide:bold" aria-label="Bold" />
  <q-btn icon="lucide:italic" aria-label="Italic" />
  <q-btn icon="lucide:underline" aria-label="Underline" />
</q-btn-group>`

const labeledCode = `<q-btn-group unelevated>
  <q-btn label="Save" icon="lucide:save" />
  <q-btn label="Cancel" flat />
  <q-btn label="Delete" icon="lucide:trash-2" color="negative" />
</q-btn-group>`

const outlineCode = `<q-btn-group outline>
  <q-btn label="Day" />
  <q-btn label="Week" />
  <q-btn label="Month" />
</q-btn-group>`

const stretchCode = `<q-btn-group unelevated stretch>
  <q-btn label="Accept" color="positive" />
  <q-btn label="Decline" color="negative" />
</q-btn-group>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Button Group</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Groups <b>&lt;q-btn&gt;</b> into a single visual unit: borders are fused
      between siblings and the radius is applied only to the outer corners.
      Useful for toolbars, toggles and segmented controls.
    </p>

    <!-- ═══════ Icon-only ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Icon-only buttons</h2>
      <p class="doc-note">
        A classic toolbar pattern — three icon buttons welded together with
        <code>unelevated</code>.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn-group unelevated>
            <q-btn icon="lucide:bold" aria-label="Bold" />
            <q-btn icon="lucide:italic" aria-label="Italic" />
            <q-btn icon="lucide:underline" aria-label="Underline" />
          </q-btn-group>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ With labels ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">With labels</h2>
      <p class="doc-note">
        Each button keeps its own props — color, <code>flat</code> or
        <code>icon</code> mix freely inside the group.
      </p>

      <docs-demo :code="labeledCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn-group unelevated>
            <q-btn label="Save" icon="lucide:save" />
            <q-btn label="Cancel" flat />
            <q-btn label="Delete" icon="lucide:trash-2" color="negative" />
          </q-btn-group>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Outline ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Outline</h2>
      <p class="doc-note">
        The <code>outline</code> prop draws a single contour around the whole
        group — a segmented control look.
      </p>

      <docs-demo :code="outlineCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn-group outline>
            <q-btn label="Day" />
            <q-btn label="Week" />
            <q-btn label="Month" />
          </q-btn-group>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Stretch ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Stretch</h2>
      <p class="doc-note">
        <code>stretch</code> makes every button share the full width of the group —
        great for split actions.
      </p>

      <docs-demo :code="stretchCode" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-btn-group unelevated stretch>
            <q-btn label="Accept" color="positive" />
            <q-btn label="Decline" color="negative" />
          </q-btn-group>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBtnGroup</h2>
      <docs-api :comp="btnGroup" :source="btnGroupSource" />
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
</style>
