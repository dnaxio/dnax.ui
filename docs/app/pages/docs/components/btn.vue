<script setup lang="ts">
// QBtn — API Quasar : <q-btn label="…" icon="…" color="primary" unelevated outline flat radius round dense no-caps />
// Implémentation shadcn-vue : cva (variants) + cn() ; styles dans styles/main.css
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const btn = useComponent(() => "QBtn")
const btnSource = componentSource("QBtn")
const tag = componentTag("QBtn")

// — Demos —
const variantsCode = `<q-btn label="Default" />
<q-btn label="Unelevated" unelevated />
<q-btn label="Outline" outline />
<q-btn label="Flat" flat />
<q-btn label="Rounded" radius />`

const colorsCode = `<q-btn label="Primary" color="primary" />
<q-btn label="Secondary" color="secondary" />
<q-btn label="Positive" color="positive" />
<q-btn label="Negative" color="negative" />
<q-btn label="Warning" color="warning" />
<q-btn label="Info" color="info" />
<q-btn label="Custom" color="#7c3aed" />`

const iconsCode = `<q-btn label="Download" icon="lucide:download" />
<q-btn label="Send" icon="lucide:send" icon-right="lucide:arrow-right" />
<q-btn icon="lucide:plus" round color="secondary" />
<q-btn icon="lucide:search" round outline />
<q-btn label="Settings" icon="lucide:settings" flat />`

const sizesCode = `<q-btn label="Small" size="sm" />
<q-btn label="Medium" size="md" />
<q-btn label="Large" size="lg" />
<q-btn label="X-Large" size="xl" />
<q-btn label="Custom" size="2.25rem" />`

const statesCode = `<q-btn label="Loading" loading />
<q-btn label="Disabled" disable />
<q-btn label="Stretch" stretch unelevated />`

const loadingCode = `<q-btn label="Simulate loading" :loading="loadingState" @click="startLoading" />`

const linksCode = `<q-btn label="Internal link" href="/docs/components/btn" />
<q-btn label="External link" icon="lucide:external-link" href="https://nuxt.com" outline />`

const clickCode = `<q-btn label="Click me" @click="clicks++" />
<p class="demo-p">Clicked {{ clicks }} times.</p>`

const loadingState = ref(false)
const startLoading = () => {
  loadingState.value = true
  setTimeout(() => (loadingState.value = false), 2200)
}

const clicks = ref(0)
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Button</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Buttons trigger actions. <b>&lt;q-btn&gt;</b> renders a native
      <code>&lt;button&gt;</code> — or an <code>&lt;a&gt;</code> when
      <code>href</code> is set — and exposes the Quasar API: variants such as
      <code>unelevated</code>, <code>outline</code> and <code>flat</code>,
      Iconify icons, theme colors, sizes, and <code>loading</code> /
      <code>disable</code> states.
    </p>

    <!-- ═══════ Variants ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants</h2>
      <docs-demo :code="variantsCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Default" />
          <q-btn label="Unelevated" unelevated />
          <q-btn label="Outline" outline />
          <q-btn label="Flat" flat />
          <q-btn label="Rounded" radius />
        </div>
      </docs-demo>
      <p class="doc-note">
        The default button has an elevation shadow. <code>unelevated</code> removes it,
        <code>outline</code> keeps a transparent background with a border,
        <code>flat</code> drops the border too, and <code>radius</code> (or
        <code>radius="sm|md|lg"</code> for a finer scale) rounds the corners into a
        pill. <code>no-caps</code> disables any text transformation applied by the
        theme, <code>dense</code> reduces the height.
      </p>
    </section>

    <!-- ═══════ Colors ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors</h2>
      <docs-demo :code="colorsCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Primary" color="primary" />
          <q-btn label="Secondary" color="secondary" />
          <q-btn label="Positive" color="positive" />
          <q-btn label="Negative" color="negative" />
          <q-btn label="Warning" color="warning" />
          <q-btn label="Info" color="info" />
          <q-btn label="Custom" color="#7c3aed" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>color</code> accepts any design token (<code>primary</code>,
        <code>secondary</code>, <code>accent</code>, <code>dark</code>,
        <code>positive</code>, <code>negative</code>, <code>info</code>,
        <code>warning</code>) or a raw hex value such as <code>#7c3aed</code>.
        Use <code>text-color</code> to override the foreground.
      </p>
    </section>

    <!-- ═══════ Icons ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Icons</h2>
      <docs-demo :code="iconsCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Download" icon="lucide:download" />
          <q-btn label="Send" icon="lucide:send" icon-right="lucide:arrow-right" />
          <q-btn icon="lucide:plus" round color="secondary" />
          <q-btn icon="lucide:search" round outline />
          <q-btn label="Settings" icon="lucide:settings" flat />
        </div>
      </docs-demo>
      <p class="doc-note">
        Icons use Iconify names — <code>icon="lucide:download"</code>.
        <code>icon-right</code> places an icon on the trailing edge, and
        <code>round</code> turns the button into a perfect circle, ideal for
        icon-only buttons.
      </p>
    </section>

    <!-- ═══════ Sizes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sizes</h2>
      <docs-demo :code="sizesCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Small" size="sm" />
          <q-btn label="Medium" size="md" />
          <q-btn label="Large" size="lg" />
          <q-btn label="X-Large" size="xl" />
          <q-btn label="Custom" size="2.25rem" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>size</code> accepts the tokens <code>sm</code>, <code>md</code>,
        <code>lg</code>, <code>xl</code> or any CSS length (<code>"2.25rem"</code>).
        Combine with <code>dense</code> for a compact form factor.
      </p>
    </section>

    <!-- ═══════ States ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">States</h2>
      <docs-demo :code="statesCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Loading" loading />
          <q-btn label="Disabled" disable />
          <q-btn label="Stretch" stretch unelevated />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Interactive loading</h3>
      <docs-demo :code="loadingCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Simulate loading" :loading="loadingState" @click="startLoading" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>loading</code> swaps the content for a spinner and blocks clicks.
        A <code>disable</code>d button is visually muted and ignores pointer
        events. <code>stretch</code> makes the button fill the width of its
        container.
      </p>
    </section>

    <!-- ═══════ Links & events ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Links &amp; events</h2>
      <docs-demo :code="linksCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Internal link" href="/docs/components/btn" />
          <q-btn label="External link" icon="lucide:external-link" href="https://nuxt.com" outline />
        </div>
      </docs-demo>
      <p class="doc-note">
        Passing <code>href</code> renders a native <code>&lt;a&gt;</code> with the
        same look. QBtn declares no custom events — attach native listeners such as
        <code>@click</code> directly.
      </p>

      <h3 class="doc-h3">Click event</h3>
      <docs-demo :code="clickCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-btn label="Click me" @click="clicks++" />
          <p class="demo-p">Clicked {{ clicks }} times.</p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="btn" :source="btnSource" />
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
