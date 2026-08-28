<script setup lang="ts">
// QBadge — API Quasar : <q-badge label="3" color="negative" floating multi-line transparent outline>
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const badge = useComponent(() => "QBadge")
const badgeSource = componentSource("QBadge")
const tag = componentTag("QBadge")

// — Demos —
const colorsCode = `<q-badge label="Primary" color="primary" />
<q-badge label="Secondary" color="secondary" />
<q-badge label="Positive" color="positive" />
<q-badge label="Negative" color="negative" />
<q-badge label="Warning" color="warning" />
<q-badge label="Info" color="info" />
<q-badge label="Custom" color="#7c3aed" />`

const variantsCode = `<q-badge label="Outline" outline />
<q-badge label="Transparent" transparent />
<q-badge :label="42" color="negative" />

<q-badge label="A long label that wraps on two lines" multi-line class="demo-wide" />`

const floatingCode = `<q-btn round icon="lucide:bell" color="primary">
  <q-badge floating color="negative" label="3" />
</q-btn>

<span class="badge-host">
  <q-icon name="lucide:shopping-cart" size="lg" />
  <q-badge floating color="positive" label="9" />
</span>`

const slotCode = `<q-badge color="dark">
  <q-icon name="lucide:star" size="sm" left /> New
</q-badge>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Badge</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Badges are small labels for counts, states or notifications. They inherit the
      design tokens of the theme and support <code>floating</code> positioning on top
      of other elements, <code>outline</code>, <code>transparent</code> and
      <code>multi-line</code> variants.
    </p>

    <!-- ═══════ Colors ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors</h2>
      <docs-demo :code="colorsCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-badge label="Primary" color="primary" />
          <q-badge label="Secondary" color="secondary" />
          <q-badge label="Positive" color="positive" />
          <q-badge label="Negative" color="negative" />
          <q-badge label="Warning" color="warning" />
          <q-badge label="Info" color="info" />
          <q-badge label="Custom" color="#7c3aed" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>color</code> accepts a design token or a hex value; the text color is
        derived automatically for contrast and can be overridden with
        <code>text-color</code>.
      </p>
    </section>

    <!-- ═══════ Variants ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants</h2>
      <docs-demo :code="variantsCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-badge label="Outline" outline />
          <q-badge label="Transparent" transparent />
          <q-badge :label="42" color="negative" />
        </div>
        <div class="demo-col">
          <q-badge label="A long label that wraps on two lines" multi-line class="demo-wide" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>label</code> accepts strings or numbers. <code>outline</code> keeps only
        a border, <code>transparent</code> lowers the opacity, and
        <code>multi-line</code> lets long labels wrap (use it with a constrained width).
      </p>
    </section>

    <!-- ═══════ Floating ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Floating</h2>
      <docs-demo :code="floatingCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn round icon="lucide:bell" color="primary">
            <q-badge floating color="negative" label="3" />
          </q-btn>
          <span class="badge-host">
            <q-icon name="lucide:shopping-cart" size="lg" />
            <q-badge floating color="positive" label="9" />
          </span>
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>floating</code> positions the badge absolutely in the top-right corner
        of its parent — the parent must be positioned (<code>position: relative</code>).
        <code>q-btn</code> already is; wrap other elements in a relative container.
      </p>
    </section>

    <!-- ═══════ Custom content ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom content</h2>
      <docs-demo :code="slotCode" lang="html" filename="App.vue">
        <q-badge color="dark">
          <q-icon name="lucide:star" size="sm" left /> New
        </q-badge>
      </docs-demo>
      <p class="doc-note">
        The default slot overrides <code>label</code> — useful to embed an icon or
        any markup inside the badge.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="badge" :source="badgeSource" />
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
  gap: 10px;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}
.demo-wide {
  max-width: 160px;
}
.badge-host {
  position: relative;
  display: inline-flex;
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
