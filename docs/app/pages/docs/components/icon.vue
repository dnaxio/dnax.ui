<script setup lang="ts">
// QIcon — API Quasar : <q-icon name="lucide:star" size="24px" color="primary" left right>
// name : icône Iconify par son nom (https://iconify.design/docs/icon-components/vue/)
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const icon = useComponent(() => "QIcon")
const iconSource = componentSource("QIcon")
const tag = componentTag("QIcon")

// — Demos —
const sizesCode = `<q-icon name="lucide:star" size="sm" />
<q-icon name="lucide:star" size="md" />
<q-icon name="lucide:star" size="lg" />
<q-icon name="lucide:star" size="xl" />`

const colorsCode = `<q-icon name="lucide:heart" color="primary" />
<q-icon name="lucide:heart" color="positive" />
<q-icon name="lucide:heart" color="negative" />
<q-icon name="lucide:heart" color="warning" />
<q-icon name="lucide:heart" color="#7c3aed" />`

const customCode = `<q-icon name="lucide:rocket" size="2rem" />
<q-icon name="lucide:rocket" size="40px" color="info" />
<q-icon name="lucide:rocket" size="lg" color="secondary" />`

const spacingCode = `<span class="demo-inline"><q-icon name="lucide:mail" left /> Inbox</span>
<span class="demo-inline">Drafts <q-icon name="lucide:chevron-right" right /></span>
<q-icon name="lucide:refresh-cw" size="lg" class="demo-spin" />`

const rotationCode = `/* rotation : classe CSS personnalisée */
.demo-spin {
  transform: rotate(45deg);
}`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Icon</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Icons render any Iconify icon by name — <code>name="lucide:star"</code> — with
      token-based colors and size tokens or raw CSS lengths. They are used everywhere
      in the design system (buttons, chips, badges, accordions…).
    </p>

    <!-- ═══════ Sizes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sizes</h2>
      <docs-demo :code="sizesCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-icon name="lucide:star" size="sm" />
          <q-icon name="lucide:star" size="md" />
          <q-icon name="lucide:star" size="lg" />
          <q-icon name="lucide:star" size="xl" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>size</code> maps the tokens <code>sm</code> (16px), <code>md</code>
        (24px), <code>lg</code> (32px) and <code>xl</code> (48px), or accepts any CSS
        length such as <code>"1.5rem"</code>.
      </p>
    </section>

    <!-- ═══════ Colors ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors</h2>
      <docs-demo :code="colorsCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-icon name="lucide:heart" color="primary" />
          <q-icon name="lucide:heart" color="positive" />
          <q-icon name="lucide:heart" color="negative" />
          <q-icon name="lucide:heart" color="warning" />
          <q-icon name="lucide:heart" color="#7c3aed" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>color</code> accepts any design token (<code>primary</code>,
        <code>positive</code>, <code>negative</code>…) or a hex value. Without a color
        the icon inherits the current text color.
      </p>
    </section>

    <!-- ═══════ Custom sizes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom CSS sizes</h2>
      <docs-demo :code="customCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-icon name="lucide:rocket" size="2rem" />
          <q-icon name="lucide:rocket" size="40px" color="info" />
          <q-icon name="lucide:rocket" size="lg" color="secondary" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Spacing & rotation ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Spacing &amp; rotation</h2>
      <docs-demo :code="spacingCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <span class="demo-inline"><q-icon name="lucide:mail" left /> Inbox</span>
          <span class="demo-inline">Drafts <q-icon name="lucide:chevron-right" right /></span>
          <q-icon name="lucide:refresh-cw" size="lg" class="demo-spin" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>left</code> and <code>right</code> add inline margins for in-text usage.
        There is no rotation prop — apply a CSS transform class instead (see the
        rotated refresh icon).
      </p>
      <q-syntax :code="rotationCode" lang="css" filename="styles.css" copy />
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="icon" :source="iconSource" />
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
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.demo-inline {
  display: inline-flex;
  align-items: center;
}
.demo-spin {
  transform: rotate(45deg);
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
