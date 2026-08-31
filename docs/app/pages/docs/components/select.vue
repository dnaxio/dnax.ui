<script setup lang="ts">
// Select — documentation for QSelect.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const select = useComponent(() => "QSelect")
const selectSource = componentSource("QSelect")
const tag = componentTag("QSelect")

// — Interactive demo state —
const color = ref<{ value: string; label: string } | null>(null)
const country = ref<string | null>(null)
const framework = ref<string | null>(null)
const size = ref<string | null>(null)
const level = ref<number | null>(null)
const multi = ref<string[]>([])

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
]

const countries = [
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "us", name: "United States" },
]

const frameworks = [
  { id: "vue", name: "Vue" },
  { id: "react", name: "React" },
  { id: "svelte", name: "Svelte" },
]

const usageBasic = `<q-select
  v-model="color"
  :options="colors"
  label="Color"
  placeholder="Pick a color"
/>`

const usageCustomKeys = `<q-select
  v-model="country"
  :options="countries"
  option-label="name"
  option-value="id"
  label="Country"
  emit-value
/>`

const usageOutlined = `<q-select
  v-model="framework"
  :options="frameworks"
  option-label="name"
  option-value="id"
  label="Framework"
  placeholder="Select…"
  outlined
  clearable
  dense
/>`

const usageMultiple = `<q-select
  v-model="multi"
  :options="colors"
  label="Favorite colors"
  multiple
  use-chips
  emit-value
  clearable
/>`

const usagePrimitives = `<q-select
  v-model="size"
  :options="['S', 'M', 'L', 'XL']"
  label="Size"
/>

<q-select
  v-model="level"
  :options="[1, 2, 3, 4, 5]"
  label="Level"
/>
<!-- Les options string/number sont normalisées automatiquement en
     { value: x, label: x } — le v-model garde la valeur d'origine. -->`

// — Scripts des démos (données + refs accompagnant le template) —
const scriptData = `import { ref } from "vue"

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
]`

const scriptBasic = `${scriptData}

const color = ref(null)`

const scriptMultiple = `${scriptData}

const multi = ref([])`

const scriptPrimitives = `import { ref } from "vue"

const size = ref("")
const level = ref(0)`

const scriptCustomKeys = `import { ref } from "vue"

const country = ref(null)

const countries = [
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "us", name: "United States" },
]`

const scriptOutlined = `import { ref } from "vue"

const framework = ref(null)

const frameworks = [
  { id: "vue", name: "Vue" },
  { id: "react", name: "React" },
  { id: "svelte", name: "Svelte" },
]`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Select</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A dropdown selector for single or multiple values. <b>&lt;q-select&gt;</b>
      renders an inline dropdown by default, with <code>modal</code>,
      <code>sheet</code> and <code>dialog</code> modes for mobile, plus client-side
      fuzzy search (<code>use-search</code>), selected chips
      (<code>use-chips</code>) and <code>emit-value</code> to bind the option value
      instead of the whole object.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-field">
          <q-select
            v-model="color"
            :options="colors"
            label="Color"
            placeholder="Pick a color"
          />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Custom option keys</h3>
      <p class="doc-note">
        By default the option <code>label</code> and <code>value</code> keys are
        used. With <code>option-label</code> / <code>option-value</code> you can map
        any object shape, and <code>emit-value</code> binds the raw value instead of
        the option object.
      </p>
      <docs-demo :code="usageCustomKeys" lang="html" filename="App.vue" :script="scriptCustomKeys">
        <div class="demo-field">
          <q-select
            v-model="country"
            :options="countries"
            option-label="name"
            option-value="id"
            label="Country"
            emit-value
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Outlined & clearable ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Outlined &amp; clearable</h2>

      <docs-demo :code="usageOutlined" lang="html" filename="App.vue" :script="scriptOutlined">
        <div class="demo-field">
          <q-select
            v-model="framework"
            :options="frameworks"
            option-label="name"
            option-value="id"
            label="Framework"
            placeholder="Select…"
            outlined
            clearable
            dense
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Multiple ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Multiple selection</h2>
      <p class="doc-note">
        With <code>multiple</code> the <code>v-model</code> becomes an array;
        <code>use-chips</code> displays each selection as a removable chip.
      </p>

      <docs-demo :code="usageMultiple" lang="html" filename="App.vue" :script="scriptMultiple">
        <div class="demo-field">
          <q-select
            v-model="multi"
            :options="colors"
            label="Favorite colors"
            multiple
            use-chips
            emit-value
            clearable
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Primitive options ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Primitive options</h2>
      <p class="doc-note">
        Passing plain strings or numbers as <code>options</code> works out of the
        box: each value is automatically normalized into <code>{ value, label }</code>
        (same value, stringified label), and the <code>v-model</code> keeps the
        original value.
      </p>

      <docs-demo :code="usagePrimitives" lang="html" filename="App.vue" :script="scriptPrimitives">
        <div class="demo-field demo-col">
          <q-select v-model="size" :options="['S', 'M', 'L', 'XL']" label="Size" />
          <q-select v-model="level" :options="[1, 2, 3, 4, 5]" label="Level" />
          <p class="demo-p">size = <code>{{ size }}</code> · level = <code>{{ level }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="select" :source="selectSource" />
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
.demo-field {
  width: 100%;
  max-width: 520px;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
