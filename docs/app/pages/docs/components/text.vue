<script setup lang="ts">
// Text — documentation du composant QText : texte avec troncature multi-lignes.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const text = useComponent(() => "QText")
const textSource = componentSource("QText")
const tag = componentTag("QText")

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."

const usageBasic = `<q-text text="The quick brown fox jumps over the lazy dog." />

<!-- Le slot remplace la prop text (tout contenu) -->
<q-text>
  Slots accept <b>rich content</b> — <em>markup</em>, components, anything.
</q-text>`

const usageLines = `<div class="col">
  <q-text :lines="1" :text="LONG" />
  <q-text :lines="2" :text="LONG" />
  <q-text :lines="3" :text="LONG" />
</div>
<!-- Hover a truncated line: the full text appears in the tooltip (title). -->`

const usageTag = `<q-text tag="h3" text="Rendered as an h3" />
<q-text tag="span" text="Inline span element" />
<q-text tag="p" text="Default paragraph tag" />`

const scriptLines = `import { ref } from "vue"

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Text</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A paragraph element with built-in <b>multi-line truncation</b>: set
      <code>lines</code> and the text clamps to that many lines with an ellipsis —
      the full content stays available on hover (via the <code>title</code>
      attribute). For captions overlaid on images, see
      <a class="doc-link" href="/docs/components/text-caption">QTextCaption</a>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Pass the text through the <code>text</code> prop, or use the default slot
        for rich content.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-text text="The quick brown fox jumps over the lazy dog." />
          <q-text>
            Slots accept <b>rich content</b> — <em>markup</em>, components,
            anything.
          </q-text>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Line clamping ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Line clamping</h2>
      <p class="doc-note">
        <code>lines</code> truncates to 1, 2, 3… lines with an ellipsis. Hover a
        truncated paragraph: the <code>title</code> attribute reveals the full
        text.
      </p>

      <docs-demo :code="usageLines" lang="html" filename="App.vue" :script="scriptLines">
        <div class="demo-col">
          <q-text :lines="1" :text="LONG" />
          <q-text :lines="2" :text="LONG" />
          <q-text :lines="3" :text="LONG" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Tags ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Element tag</h2>
      <p class="doc-note">
        <code>tag</code> changes the rendered element (default
        <code>p</code>) — useful for headings or inline text.
      </p>

      <docs-demo :code="usageTag" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-text tag="h3" text="Rendered as an h3" />
          <q-text tag="span" text="Inline span element" />
          <q-text tag="p" text="Default paragraph tag" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QText API</h2>
      <docs-api :comp="text" :source="textSource" />
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
.doc-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}
.doc-link:hover {
  text-decoration: underline;
}

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  margin: 0 auto;
}
</style>
