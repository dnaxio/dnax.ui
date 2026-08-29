<script setup lang="ts">
// QChip — API Quasar : <q-chip label="Chip" icon="…" removable color="secondary" outline square dense>
// removable → bouton de retrait qui émet "remove" (pas de v-model : la visibilité est gérée par le consommateur)
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const chip = useComponent(() => "QChip")
const chipSource = componentSource("QChip")
const tag = componentTag("QChip")

// — Demos —
const basicCode = `<q-chip label="Vue" />
<q-chip label="Nuxt" icon="lucide:rocket" color="secondary" />
<q-chip label="Dnax" icon="lucide:sparkles" icon-right="lucide:arrow-up-right" color="positive" />
<q-chip label="Danger" color="negative" />`

const variantsCode = `<q-chip label="Outline" outline />
<q-chip label="Square" square />
<q-chip label="Dense" dense color="info" />
<q-chip label="Dark" color="dark" />`

const removableCode = `<q-chip
  v-for="(c, i) in chips"
  :key="c"
  :label="c"
  removable
  color="secondary"
  @remove="chips.splice(i, 1)"
/>`

const eventsCode = `<q-chip label="Click me" icon="lucide:thumbs-up" @click="count++" />
<q-chip label="Disabled" icon="lucide:lock" disable />`

const chips = ref(["Vue", "Nuxt", "Shadcn"])
const resetChips = () => {
  chips.value = ["Vue", "Nuxt", "Shadcn"]
}
const count = ref(0)

// — Scripts des démos (données + refs accompagnant le template) —
const scriptRemovable = `import { ref } from "vue"

const chips = ref(["Vue", "Nuxt", "Shadcn"])
const resetChips = () => {
  chips.value = ["Vue", "Nuxt", "Shadcn"]
}`

const scriptEvents = `import { ref } from "vue"

const count = ref(0)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Chip</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Chips are compact elements used for tags, filters or selections. They support
      icons on both sides, a removable close button, outline / square / dense variants
      and disabled state — with colors driven by the design tokens.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>
      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-chip label="Vue" />
          <q-chip label="Nuxt" icon="lucide:rocket" color="secondary" />
          <q-chip label="Dnax" icon="lucide:sparkles" icon-right="lucide:arrow-up-right" color="positive" />
          <q-chip label="Danger" color="negative" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>label</code> sets the text; <code>icon</code> and <code>icon-right</code>
        place Iconify icons on either side. Without a label, the default slot renders.
      </p>
    </section>

    <!-- ═══════ Variants ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants</h2>
      <docs-demo :code="variantsCode" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-chip label="Outline" outline />
          <q-chip label="Square" square />
          <q-chip label="Dense" dense color="info" />
          <q-chip label="Dark" color="dark" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>outline</code> keeps a border-only look, <code>square</code> removes the
        pill radius, and <code>dense</code> tightens the padding for compact lists.
      </p>
    </section>

    <!-- ═══════ Removable ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Removable</h2>
      <docs-demo :code="removableCode" lang="html" filename="App.vue" :script="scriptRemovable">
        <div class="demo-row">
          <q-chip
            v-for="(c, i) in chips"
            :key="c"
            :label="c"
            removable
            color="secondary"
            @remove="chips.splice(i, 1)"
          />
        </div>
        <div v-if="!chips.length" class="demo-row demo-gap">
          <p class="demo-p">All chips removed.</p>
          <q-btn label="Reset" size="sm" flat unelevated @click="resetChips" />
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>removable</code> shows a close button that emits <code>remove</code>.
        There is no built-in <code>v-model</code> — the consumer decides what removal
        means (here the chip is spliced out of the list).
      </p>
    </section>

    <!-- ═══════ Events & disabled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Events &amp; disabled</h2>
      <docs-demo :code="eventsCode" lang="html" filename="App.vue" :script="scriptEvents">
        <div class="demo-row">
          <q-chip label="Click me" icon="lucide:thumbs-up" @click="count++" />
          <q-chip label="Disabled" icon="lucide:lock" disable />
          <p class="demo-p">Clicks: {{ count }}</p>
        </div>
      </docs-demo>
      <p class="doc-note">
        Chips emit <code>click</code> (with the mouse event) and <code>remove</code>.
        The <code>disable</code> prop mutes the chip and blocks both events.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="chip" :source="chipSource" />
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
.demo-gap {
  margin-top: 12px;
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
