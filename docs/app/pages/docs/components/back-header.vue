<script setup lang="ts">
// Back Header — documentation du composant QBackHeader :
// barre de retour (bouton retour + titre + actions à droite), safe-area top intégrée.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const backHeader = useComponent(() => "QBackHeader")
const backHeaderSource = componentSource("QBackHeader")
const tag = componentTag("QBackHeader")

// — Démo interactive —
const backLog = ref("")

const usageBasic = `<q-back-header title="Settings" @back="router.back()" />`

const usageActions = `<q-back-header title="Chat · Emma">
  <q-btn flat round dense icon="lucide:phone" aria-label="Call" />
  <q-btn flat round dense icon="lucide:video" aria-label="Video call" />
  <q-btn flat round dense icon="lucide:more-vertical" aria-label="More" />
</q-back-header>`

const usageCustom = `<q-back-header
  title="Product details"
  back-icon="lucide:arrow-left"
  back-label="Go back"
  @back="router.back()"
/>`

const usageNoBack = `<q-back-header title="Home" :show-back="false" />`

const usageStyles = `<q-back-header title="Fixed translucent" fixed translucent />

<q-back-header title="Dark" dark />

<q-back-header title="Translucent 50" fixed :translucent="50" />`

const usageSlot = `<q-back-header>
  <template #title>
    <span class="custom-title">✦ Custom title</span>
  </template>
  <q-btn flat round dense icon="lucide:share" aria-label="Share" />
</q-back-header>`

// — Scripts des démos — //
const scriptBasic = `import { ref } from "vue"

const backLog = ref("")`

const scriptCustom = `import { ref } from "vue"

const backLog = ref("")`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Back Header</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A navigation bar for detail screens: a <b>back button</b> on the left, the
      page <code>title</code>, and any actions on the right. It stacks under
      other fixed bars automatically and always applies the iOS safe-area top
      inset.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>title</code> renders the page name; the back button emits
        <code>@back</code> — wire it to <code>router.back()</code> or any custom
        handler.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-back-header title="Settings" @back="backLog = 'back pressed'" />
        <p class="demo-p demo-meta">Last event: <code>{{ backLog || "—" }}</code></p>
      </docs-demo>
    </section>

    <!-- ═══════ Actions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Actions</h2>
      <p class="doc-note">
        The default slot renders <b>on the right</b>, after the title — the
        natural spot for context actions (call, share, more…).
      </p>

      <docs-demo :code="usageActions" lang="html" filename="App.vue">
        <q-back-header title="Chat · Emma">
          <q-btn flat round dense icon="lucide:phone" aria-label="Call" />
          <q-btn flat round dense icon="lucide:video" aria-label="Video call" />
          <q-btn flat round dense icon="lucide:more-vertical" aria-label="More" />
        </q-back-header>
      </docs-demo>
    </section>

    <!-- ═══════ Custom back ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Back button</h2>
      <p class="doc-note">
        <code>back-icon</code> swaps the default chevron for any Iconify name and
        <code>back-label</code> sets the accessible label; <code>show-back</code>
        removes the button entirely (e.g. a root/home bar).
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptCustom">
        <q-back-header
          title="Product details"
          back-icon="lucide:arrow-left"
          back-label="Go back"
          @back="backLog = 'back pressed'"
        />
        <p class="demo-p demo-meta">Last event: <code>{{ backLog || "—" }}</code></p>
      </docs-demo>

      <docs-demo :code="usageNoBack" lang="html" filename="App.vue">
        <q-back-header title="Home" :show-back="false" />
      </docs-demo>
    </section>

    <!-- ═══════ Styles ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Styles</h2>
      <p class="doc-note">
        <code>dark</code> inverts the bar (for dark screens),
        <code>translucent</code> adds a frosted-glass background (true = 70%, or
        a percentage), and <code>fixed</code> pins the bar to the top of the
        viewport — stacking below any previous fixed bar, with the following
        page automatically offset.
      </p>

      <docs-demo :code="usageStyles" lang="html" filename="App.vue">
        <div class="demo-stack">
          <q-back-header title="Dark" dark />
          <q-back-header title="Translucent 50" :translucent="50" />
          <div class="demo-stage">
            <q-back-header title="Fixed inside a stage" fixed dark />
            <div class="demo-stage__body">
              <p class="demo-p">The bar is pinned to the top of this stage.</p>
            </div>
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Title slot ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Title slot</h2>
      <p class="doc-note">
        For a richer title (icon + text, badge…), use the <code>#title</code>
        slot instead of the <code>title</code> prop.
      </p>

      <docs-demo :code="usageSlot" lang="html" filename="App.vue">
        <q-back-header>
          <template #title>
            <span class="demo-custom-title">✦ Custom title</span>
          </template>
          <q-btn flat round dense icon="lucide:share" aria-label="Share" />
        </q-back-header>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="backHeader" :source="backHeaderSource" />
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

/* espace entre les blocs docs-demo */
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
.demo-meta {
  margin-top: 10px;
}
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-custom-title {
  font-weight: 700;
  letter-spacing: 0.02em;
}
/* scène pour la barre fixed : la barre se cale en haut de la scène au lieu du viewport */
.demo-stage {
  position: relative;
  border: 1px dashed rgb(0 0 0 / 0.18);
  border-radius: 10px;
  overflow: hidden;
  background: var(--muted);
}
.demo-stage :deep(.q-back-header--fixed) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.demo-stage__body {
  padding: 64px 16px 16px;
}
</style>
