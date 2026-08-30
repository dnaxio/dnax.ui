<script setup lang="ts">
// Country Picker — documentation du composant préfait QCountryPicker.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const countryPicker = useComponent(() => "QCountryPicker")
const countryPickerSource = componentSource("QCountryPicker")
const tag = componentTag("QCountryPicker")

// — Démo —
const code = ref("FR")
const codeNoDial = ref("JP")
const mode = ref<"inline" | "modal" | "sheet" | "dialog">("inline")
const modes = [
  { label: "Inline", value: "inline" },
  { label: "Modal", value: "modal" },
  { label: "Sheet", value: "sheet" },
  { label: "Dialog", value: "dialog" },
] as const
const lang = ref<"en" | "fr">("en")
const langOptions = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
]
const shortList = [
  { code: "FR", name: "France", nameFr: "France", dial: "+33" },
  { code: "DE", name: "Germany", nameFr: "Allemagne", dial: "+49" },
  { code: "ES", name: "Spain", nameFr: "Espagne", dial: "+34" },
  { code: "IT", name: "Italy", nameFr: "Italie", dial: "+39" },
  { code: "PT", name: "Portugal", nameFr: "Portugal", dial: "+351" },
  { code: "NL", name: "Netherlands", nameFr: "Pays-Bas", dial: "+31" },
]

const usageModes = `<q-btn
  v-for="m in modes"
  :key="m.value"
  flat
  no-caps
  :color="mode === m.value ? 'primary' : undefined"
  :label="m.label"
  @click="mode = m.value"
/>
<q-country-picker v-model="code" :mode="mode" label="Country" outlined title="Select a country" />`

const usageModeOptions = `<q-country-picker
  v-model="code"
  mode="sheet"
  label="Country"
  outlined
  title="Select a country"
  :sheet-options="{ height: '45vh', searchPlaceholder: 'Find a country…' }"
  :height="'80vh'"
  translucent
  persistent
/>

<!-- modalOptions accepte les mêmes clés : height, width, style, class, searchPlaceholder -->`

const usageBasic = `<q-country-picker v-model="code" label="Country" />
<p class="demo-p demo-meta">Selected: <code>{{ code }}</code></p>`

const usageLang = `<q-select
  v-model="lang"
  :options="langOptions"
  emit-value
  option-label="label"
  option-value="value"
  outlined
  dense
  label="Language"
/>
<q-country-picker v-model="code" :language="lang" label="Country" outlined />`

const usageStyled = `<q-country-picker v-model="code" label="Country" outlined dense />
<q-country-picker v-model="code" label="Country" filled dense />`

const usageNoDial = `<q-country-picker v-model="code" label="Country" :show-dial="false" outlined />`

const usageCustom = `<q-country-picker v-model="code" :countries="shortList" label="Europe" outlined />`

const scriptModes = `import { ref } from "vue"

const code = ref("FR")
const mode = ref("inline")
const modes = [
  { label: "Inline", value: "inline" },
  { label: "Modal", value: "modal" },
  { label: "Sheet", value: "sheet" },
  { label: "Dialog", value: "dialog" },
]`

const scriptBasic = `import { ref } from "vue"

const code = ref("FR")`

const scriptLang = `import { ref } from "vue"

const code = ref("FR")
const lang = ref("en")
const langOptions = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
]`

const scriptCustom = `import { ref } from "vue"

const code = ref("FR")
const shortList = [
  { code: "FR", name: "France", nameFr: "France", dial: "+33" },
  { code: "DE", name: "Germany", nameFr: "Allemagne", dial: "+49" },
  { code: "ES", name: "Spain", nameFr: "Espagne", dial: "+34" },
  { code: "IT", name: "Italy", nameFr: "Italie", dial: "+39" },
  { code: "PT", name: "Portugal", nameFr: "Portugal", dial: "+351" },
  { code: "NL", name: "Netherlands", nameFr: "Pays-Bas", dial: "+31" },
]`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Country Picker</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A ready-made <b>country selector</b>: <b>&lt;q-country-picker&gt;</b>
      binds a <code>v-model</code> to an ISO 3166-1 alpha-2 code (e.g.
      <code>"FR"</code>), shows the flag, name and dialing code, and ships with
      a built-in search (name, code or dial), keyboard navigation and a full
      country dataset in <b>English or French</b> (<code>language</code>). Four
      display <code>mode</code>s: <code>inline</code> dropdown,
      <code>modal</code>, <code>sheet</code> and fullscreen <code>dialog</code>
      — no flags assets needed (emoji flags).
    </p>

    <!-- ═══════ Modes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Modes</h2>
      <p class="doc-note">
        <code>mode</code> switches how the list opens:
        <code>inline</code> (dropdown under the field), <code>modal</code>
        (centered panel), <code>sheet</code> (bottom sheet) or
        <code>dialog</code> (fullscreen). A <code>title</code> and a
        <code>width</code> tune the panel. In <code>sheet</code> mode, drag the
        handle (or swipe) <b>down</b> to dismiss — tune the threshold with
        <code>drag-threshold</code>. Per-mode options (<code>sheet-options</code>,
        <code>modal-options</code>) override <code>height</code> of the list,
        <code>width</code>, <code>style</code>, <code>class</code> and
        <code>search-placeholder</code>.
      </p>

      <docs-demo :code="usageModes" lang="html" filename="App.vue" :script="scriptModes">
        <div class="demo-col">
          <div class="demo-modes">
            <q-btn
              v-for="m in modes"
              :key="m.value"
              flat
              no-caps
              :color="mode === m.value ? 'primary' : undefined"
              :label="m.label"
              @click="mode = m.value"
            />
          </div>
          <q-country-picker
            v-model="code"
            :mode="mode"
            label="Country"
            outlined
            title="Select a country"
          />
          <p class="demo-p demo-meta">Selected: <code>{{ code }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Mode options ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sheet &amp; modal options</h2>
      <p class="doc-note">
        <code>sheet-options</code> and <code>modal-options</code> override the
        panel per mode: <code>height</code> (scrollable list),
        <code>width</code>, <code>style</code>, <code>class</code> and
        <code>search-placeholder</code>. Bottom-sheet extras: <code>height</code>
        (panel), <code>translucent</code> (frosted glass),
        <code>rounded</code>, <code>persistent</code> and
        <code>content-style</code>.
      </p>

      <docs-demo :code="usageModeOptions" lang="html" filename="App.vue" :script="scriptBasic">
        <q-country-picker
          v-model="code"
          mode="sheet"
          label="Country"
          outlined
          title="Select a country"
          :sheet-options="{ height: '45vh', searchPlaceholder: 'Find a country…' }"
          :height="'80vh'"
          translucent
          persistent
        />
      </docs-demo>
    </section>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Click the field, type to filter, pick a country — the
        <code>v-model</code> receives the ISO code.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-col">
          <q-country-picker v-model="code" label="Country" />
          <p class="demo-p demo-meta">Selected: <code>{{ code }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Language ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Language</h2>
      <p class="doc-note">
        <code>language</code> switches the country names between
        <code>"en"</code> and <code>"fr"</code> — the search matches both
        languages.
      </p>

      <docs-demo :code="usageLang" lang="html" filename="App.vue" :script="scriptLang">
        <div class="demo-col">
          <q-select
            v-model="lang"
            :options="langOptions"
            emit-value
            option-label="label"
            option-value="value"
            outlined
            dense
            label="Language"
            class="demo-lang-select"
          />
          <q-country-picker v-model="code" :language="lang" label="Country" outlined />
          <p class="demo-p demo-meta">Selected: <code>{{ code }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Styling ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Field styles</h2>
      <p class="doc-note">
        The field reuses the design-system input styles: <code>outlined</code>,
        <code>filled</code>, <code>borderless</code>, <code>dense</code> and a
        <code>label</code>.
      </p>

      <docs-demo :code="usageStyled" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-col">
          <q-country-picker v-model="code" label="Country" outlined dense />
          <q-country-picker v-model="code" label="Country" filled dense />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ No dial ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Hide dialing code</h2>
      <p class="doc-note">
        <code>:show-dial="false"</code> hides the phone prefix — flag and name
        only.
      </p>

      <docs-demo :code="usageNoDial" lang="html" filename="App.vue" :script="scriptBasic">
        <q-country-picker v-model="codeNoDial" label="Country" :show-dial="false" outlined />
      </docs-demo>
    </section>

    <!-- ═══════ Custom list ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom country list</h2>
      <p class="doc-note">
        Pass your own <code>countries</code> (objects with <code>code</code>,
        <code>name</code> and <code>dial</code>) to restrict the choices.
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptCustom">
        <q-country-picker v-model="code" :countries="shortList" label="Europe" outlined />
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCountryPicker API</h2>
      <docs-api :comp="countryPicker" :source="countryPickerSource" />
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

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
  margin: 0 auto;
}
.demo-lang-select {
  width: 180px;
  align-self: center;
}
.demo-modes {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
</style>
