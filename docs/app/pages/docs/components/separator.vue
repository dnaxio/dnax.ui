<script setup lang="ts">
// QSeparator — API Quasar : <q-separator vertical inset spaced dark decorative>
// Équivalent du Separator shadcn-vue (reka-ui) : div role="separator".
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const separator = useComponent(() => "QSeparator")
const separatorSource = componentSource("QSeparator")
const tag = componentTag("QSeparator")

// — Demos —
const horizontalCode = `<p class="demo-p">A paragraph before the separator.</p>
<q-separator />
<p class="demo-p">A paragraph after it.</p>

<q-separator spaced />

<p class="demo-p">Spaced adds 8px above and below the line.</p>

<q-separator inset />

<p class="demo-p">Inset indents the line by 16px on each side.</p>`

const verticalCode = `<div class="demo-vbox">
  <span>Drafts</span>
  <q-separator vertical />
  <span>Sent</span>
  <q-separator vertical spaced />
  <span>Archive</span>
</div>`

const darkCode = `<div class="demo-dark">
  <p class="demo-p">On a dark surface the default line is barely visible.</p>
  <q-separator dark />
  <p class="demo-p">Use dark for a light-on-dark divider.</p>
</div>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Separator</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A thin divider used to visually group content. It renders a
      <code>role="separator"</code> element, supports horizontal and vertical
      orientations, and offers <code>spaced</code>, <code>inset</code> and
      <code>dark</code> modifiers.
    </p>

    <!-- ═══════ Horizontal ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Horizontal</h2>
      <docs-demo :code="horizontalCode" lang="html" filename="App.vue">
        <p class="demo-p">A paragraph before the separator.</p>
        <q-separator />
        <p class="demo-p">A paragraph after it.</p>

        <q-separator spaced />

        <p class="demo-p">Spaced adds 8px above and below the line.</p>

        <q-separator inset />

        <p class="demo-p">Inset indents the line by 16px on each side.</p>
      </docs-demo>
      <p class="doc-note">
        Horizontal is the default orientation: a full-width 1px line.
        <code>spaced</code> adds vertical breathing room,
        <code>inset</code> pulls the line away from the edges.
      </p>
    </section>

    <!-- ═══════ Vertical ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Vertical</h2>
      <docs-demo :code="verticalCode" lang="html" filename="App.vue">
        <div class="demo-vbox">
          <span>Drafts</span>
          <q-separator vertical />
          <span>Sent</span>
          <q-separator vertical spaced />
          <span>Archive</span>
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>vertical</code> renders a 1px column that stretches to the height of its
        flex container — give the parent a fixed height or let
        <code>align-items: stretch</code> do the work.
      </p>
    </section>

    <!-- ═══════ Dark & decorative ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Dark &amp; decorative</h2>
      <docs-demo :code="darkCode" lang="html" filename="App.vue">
        <div class="demo-dark">
          <p class="demo-p">On a dark surface the default line is barely visible.</p>
          <q-separator dark />
          <p class="demo-p">Use dark for a light-on-dark divider.</p>
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>dark</code> switches to a light line for dark surfaces.
        <code>decorative</code> removes the ARIA separator role
        (<code>role="none"</code>) when the divider is purely visual.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="separator" :source="separatorSource" />
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
.demo-vbox {
  display: flex;
  align-items: stretch;
  gap: 8px;
  height: 44px;
}
.demo-vbox span {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #5b6472;
}
.demo-dark {
  background: #1e1e2e;
  border-radius: 8px;
  padding: 14px 16px;
}
.demo-dark .demo-p {
  color: #c9d1d9;
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
