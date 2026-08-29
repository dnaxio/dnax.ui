<script setup lang="ts">
// Collapse — QCollapse : panneau repliable (pattern QExpansionItem) avec header cliquable.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const collapse = useComponent(() => "QCollapse")
const collapseSource = componentSource("QCollapse")
const tag = componentTag("QCollapse")

// — Démos —
const openBasic = ref(true)
const openIcons = ref(false)
const openDense = ref(true)
const openCustom = ref(false)

const basicCode = `<q-collapse v-model="openBasic" label="Account" caption="Profile, security and preferences">
  <p class="demo-p">
    The content is animated with a measured height (0 → auto) and stays
    mounted in the DOM — hidden with CSS, not unmounted.
  </p>
</q-collapse>`

const iconsCode = `<q-collapse
  v-model="openIcons"
  label="Security"
  caption="Two-factor authentication"
  icon-left="lucide:shield"
  icon-right="lucide:badge-check"
>
  <p class="demo-p">Iconify icons on both sides of the header.</p>
</q-collapse>`

const uncontrolledCode = `<q-collapse label="FAQ — What is Dnax UI?" default-opened>
  <p class="demo-p">
    Without a <code>v-model</code>, the collapse keeps its own internal state,
    initialized by <code>default-opened</code>.
  </p>
</q-collapse>`

const statesCode = `<q-collapse label="Dense" caption="Compact header" dense>
  <p class="demo-p">A smaller header with <code>dense</code>.</p>
</q-collapse>

<q-collapse label="Disabled" disable>
  <p class="demo-p">Clicking the header does nothing.</p>
</q-collapse>`

const customCode = `<q-collapse v-model="openCustom" header-class="q-collapse__header--custom">
  <template #header>
    <q-icon name="lucide:sparkles" color="primary" />
    <span class="q-collapse__label">Custom header</span>
  </template>
  <p class="demo-p">Anything goes inside the <code>#header</code> slot.</p>
</q-collapse>`

// — Scripts des démos (refs accompagnant les templates) —
const scriptBasic = `import { ref } from "vue"

const openBasic = ref(true)`

const scriptIcons = `import { ref } from "vue"

const openIcons = ref(false)`

const scriptCustom = `import { ref } from "vue"

const openCustom = ref(false)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Collapse</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A clickable header that expands or collapses its content with a smooth height
      animation. <b>&lt;q-collapse&gt;</b> supports a controlled
      <code>v-model</code> (or internal state via <code>default-opened</code>),
      Iconify icons on the left and right of the header, and a custom
      <code>#header</code> slot.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>label</code> + optional <code>caption</code>; the chevron rotates when
        open. The content stays mounted and animates via a measured height.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-collapse">
          <q-collapse v-model="openBasic" label="Account" caption="Profile, security and preferences">
            <p class="demo-p">
              The content is animated with a measured height (0 → auto) and stays
              mounted in the DOM — hidden with CSS, not unmounted.
            </p>
          </q-collapse>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Icons ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Icons</h2>
      <p class="doc-note">
        <code>icon-left</code> sits before the title, <code>icon-right</code> before
        the chevron — any Iconify name.
      </p>

      <docs-demo :code="iconsCode" lang="html" filename="App.vue" :script="scriptIcons">
        <div class="demo-collapse">
          <q-collapse
            v-model="openIcons"
            label="Security"
            caption="Two-factor authentication"
            icon-left="lucide:shield"
            icon-right="lucide:badge-check"
          >
            <p class="demo-p">Iconify icons on both sides of the header.</p>
          </q-collapse>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Uncontrolled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Uncontrolled</h2>
      <p class="doc-note">
        Without a <code>v-model</code>, the collapse manages its own state —
        initialized with <code>default-opened</code>.
      </p>

      <docs-demo :code="uncontrolledCode" lang="html" filename="App.vue">
        <div class="demo-collapse">
          <q-collapse label="FAQ — What is Dnax UI?" default-opened>
            <p class="demo-p">
              Without a <code>v-model</code>, the collapse keeps its own internal state,
              initialized by <code>default-opened</code>.
            </p>
          </q-collapse>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ States ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Dense &amp; disabled</h2>
      <p class="doc-note">
        <code>dense</code> shrinks the header; <code>disable</code> blocks the toggle.
      </p>

      <docs-demo :code="statesCode" lang="html" filename="App.vue">
        <div class="demo-collapse demo-collapse--stack">
          <q-collapse label="Dense" caption="Compact header" dense>
            <p class="demo-p">A smaller header with <code>dense</code>.</p>
          </q-collapse>
          <q-collapse label="Disabled" disable>
            <p class="demo-p">Clicking the header does nothing.</p>
          </q-collapse>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom header ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom header</h2>
      <p class="doc-note">
        Use the <code>#header</code> slot (and optional <code>header-class</code>)
        to build your own header content — the chevron stays managed by the
        component.
      </p>

      <docs-demo :code="customCode" lang="html" filename="App.vue" :script="scriptCustom">
        <div class="demo-collapse">
          <q-collapse v-model="openCustom" header-class="q-collapse__header--custom">
            <template #header>
              <q-icon name="lucide:sparkles" color="primary" />
              <span class="q-collapse__label">Custom header</span>
            </template>
            <p class="demo-p">Anything goes inside the <code>#header</code> slot.</p>
          </q-collapse>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCollapse</h2>
      <docs-api :comp="collapse" :source="collapseSource" />
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

.demo-collapse {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}
.demo-collapse--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
