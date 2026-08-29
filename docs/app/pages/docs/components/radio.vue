<script setup lang="ts">
// Radio — documentation for QRadio.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const radio = useComponent(() => "QRadio")
const radioSource = componentSource("QRadio")
const tag = componentTag("QRadio")

// — Interactive demo state —
const transport = ref("car")
const theme = ref("dark")

const usageGroup = `<q-radio v-model="transport" val="car" label="Car" />
<q-radio v-model="transport" val="bike" label="Bike" />
<q-radio v-model="transport" val="walk" label="Walk" />`

const usageColors = `<q-radio v-model="theme" val="dark" label="Dark" color="primary" />
<q-radio v-model="theme" val="system" label="System" color="secondary" />
<q-radio v-model="theme" val="light" label="Light" color="teal" />`

const usageLayout = `<q-radio v-model="transport" val="car" label="Left label" left-label />
<q-radio v-model="transport" val="bike" label="Dense" dense color="secondary" />`

const usageDisabled = `<q-radio v-model="transport" val="car" label="Car (disabled)" disable />
<q-radio v-model="transport" val="walk" label="Walk (readonly)" readonly />`

// — Scripts des démos (données + refs accompagnant le template) —
const scriptData = `import { ref } from "vue"

const transport = ref("car")`

const scriptColors = `import { ref } from "vue"

const theme = ref("dark")`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Radio</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A radio option for single-choice groups. <b>&lt;q-radio&gt;</b> is selected
      when its <code>val</code> matches the shared <code>v-model</code> — radios
      bound to the same model form a mutually exclusive group. Colors,
      <code>left-label</code> and <code>dense</code> follow the Quasar conventions.
    </p>

    <!-- ═══════ Group ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Radio group</h2>

      <docs-demo :code="usageGroup" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-group">
          <q-radio v-model="transport" val="car" label="Car" />
          <q-radio v-model="transport" val="bike" label="Bike" />
          <q-radio v-model="transport" val="walk" label="Walk" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Colors ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors</h2>

      <docs-demo :code="usageColors" lang="html" filename="App.vue" :script="scriptColors">
        <div class="demo-group">
          <q-radio v-model="theme" val="dark" label="Dark" color="primary" />
          <q-radio v-model="theme" val="system" label="System" color="secondary" />
          <q-radio v-model="theme" val="light" label="Light" color="teal" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Layout ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Layout</h2>
      <p class="doc-note">
        <code>left-label</code> moves the label to the left of the control, and
        <code>dense</code> reduces the spacing.
      </p>

      <docs-demo :code="usageLayout" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-group">
          <q-radio v-model="transport" val="car" label="Left label" left-label />
          <q-radio v-model="transport" val="bike" label="Dense" dense color="secondary" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Disabled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Disabled &amp; readonly</h2>

      <docs-demo :code="usageDisabled" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-group">
          <q-radio v-model="transport" val="car" label="Car (disabled)" disable />
          <q-radio v-model="transport" val="walk" label="Walk (readonly)" readonly />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="radio" :source="radioSource" />
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
.demo-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
