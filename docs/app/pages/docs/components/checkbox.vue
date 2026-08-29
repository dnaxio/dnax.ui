<script setup lang="ts">
// Checkbox — documentation for QCheckbox.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const checkbox = useComponent(() => "QCheckbox")
const checkboxSource = componentSource("QCheckbox")
const tag = componentTag("QCheckbox")

// — Interactive demo state —
const checked = ref(true)
const features = ref<string[]>(["wifi"])
const state = ref<unknown>("mixed")
const locked = ref(false)
const liked = ref(true)

const featureOptions = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "gps", label: "GPS" },
  { value: "bluetooth", label: "Bluetooth" },
]

const usageSimple = `<q-checkbox v-model="checked" label="Accept terms" color="secondary" />`

const usageArray = `<q-checkbox v-for="opt in featureOptions" :key="opt.value"
  v-model="features" :val="opt.value" :label="opt.label" />`

const usageIndeterminate = `<q-checkbox v-model="state" label="Select all"
  indeterminate-value="mixed" />`

const usageStates = `<q-checkbox v-model="locked" label="Disabled" disable />
<q-checkbox v-model="locked" label="Readonly" readonly color="secondary" />`

const usageLayout = `<q-checkbox v-model="liked" label="Left label" left-label color="teal" />
<q-checkbox v-model="liked" color="primary"
  checked-icon="lucide:thumbs-up" unchecked-icon="lucide:thumbs-down" />`

// — Scripts des démos (données + refs accompagnant le template) —
const scriptSimple = `import { ref } from "vue"

const checked = ref(true)`

const scriptArray = `import { ref } from "vue"

const features = ref(["wifi"])

const featureOptions = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "gps", label: "GPS" },
  { value: "bluetooth", label: "Bluetooth" },
]`

const scriptIndeterminate = `import { ref } from "vue"

const state = ref("mixed")`

const scriptStates = `import { ref } from "vue"

const locked = ref(false)`

const scriptLayout = `import { ref } from "vue"

const liked = ref(true)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Checkbox</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A toggle control with three model shapes: a boolean, an indeterminate state
      (via <code>indeterminate-value</code>) or an array of selected
      <code>val</code>s. <b>&lt;q-checkbox&gt;</b> is fully keyboard-accessible,
      supports Iconify icons per state and accepts any color token.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>

      <docs-demo :code="usageSimple" lang="html" filename="App.vue" :script="scriptSimple">
        <div class="demo-group">
          <q-checkbox v-model="checked" label="Accept terms" color="secondary" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Array model ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Array model (val)</h2>
      <p class="doc-note">
        When the <code>v-model</code> is an array, each checkbox adds or removes its
        <code>val</code> from the list — the classic multi-select pattern.
      </p>

      <docs-demo :code="usageArray" lang="html" filename="App.vue" :script="scriptArray">
        <div class="demo-group">
          <q-checkbox
            v-for="opt in featureOptions"
            :key="opt.value"
            v-model="features"
            :val="opt.value"
            :label="opt.label"
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Indeterminate ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Indeterminate state</h2>
      <p class="doc-note">
        Set <code>indeterminate-value</code> (default <code>null</code>) to render a
        mixed state — useful for a "select all" master checkbox.
      </p>

      <docs-demo :code="usageIndeterminate" lang="html" filename="App.vue" :script="scriptIndeterminate">
        <div class="demo-group">
          <q-checkbox v-model="state" label="Select all" indeterminate-value="mixed" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Disabled & layout ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Disabled, readonly &amp; layout</h2>

      <docs-demo :code="usageStates" lang="html" filename="App.vue" :script="scriptStates">
        <div class="demo-group">
          <q-checkbox v-model="locked" label="Disabled" disable />
          <q-checkbox v-model="locked" label="Readonly" readonly color="secondary" />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Label position &amp; icons</h3>
      <docs-demo :code="usageLayout" lang="html" filename="App.vue" :script="scriptLayout">
        <div class="demo-group">
          <q-checkbox v-model="liked" label="Left label" left-label color="teal" />
          <q-checkbox
            v-model="liked"
            color="primary"
            checked-icon="lucide:thumbs-up"
            unchecked-icon="lucide:thumbs-down"
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="checkbox" :source="checkboxSource" />
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
