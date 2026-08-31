<script setup lang="ts">
// Autocomplete — QAutocomplete : champ de saisie avec suggestions filtrées (Combobox).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const autocomplete = useComponent(() => "QAutocomplete")
const autocompleteSource = componentSource("QAutocomplete")
const tag = componentTag("QAutocomplete")

// — 20 pays de test —
const countries = [
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Portugal", code: "PT" },
  { name: "Netherlands", code: "NL" },
  { name: "Belgium", code: "BE" },
  { name: "Switzerland", code: "CH" },
  { name: "Austria", code: "AT" },
  { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
  { name: "Finland", code: "FI" },
  { name: "Poland", code: "PL" },
  { name: "Czechia", code: "CZ" },
  { name: "Greece", code: "GR" },
  { name: "Ireland", code: "IE" },
  { name: "United Kingdom", code: "GB" },
  { name: "Japan", code: "JP" },
  { name: "Canada", code: "CA" },
]

// — Démos —
const selected = ref("")
const selectedSlot = ref("")
const dense = ref("")
const loadingVal = ref("")
const disabledVal = ref("")
const errorVal = ref("")

// — Démo modes (inline / modal / sheet) —
const panelVal = ref("")
const modeDemo = ref<"inline" | "modal" | "sheet">("inline")

const basicCode = `const countries = [
  { name: "France", code: "FR" },
  // … 20 countries in total …
  { name: "Canada", code: "CA" },
]

<q-autocomplete
  v-model="selected"
  :options="countries"
  option-value="code"
  option-label="name"
  label="Country"
  placeholder="Type to search…"
  outlined
  clearable
/>`

const slotCode = `<q-autocomplete
  v-model="selected"
  :options="countries"
  option-value="code"
  option-label="name"
  label="Pick a country"
  outlined
>
  <template #default="{ option }">
    <q-icon name="lucide:map-pin" color="primary" size="16px" />
    <span class="opt-label">{{ option.name }}</span>
    <span class="opt-code">{{ option.code }}</span>
  </template>
</q-autocomplete>`

const statesCode = `<q-autocomplete v-model="dense" :options="countries" option-value="code" option-label="name" label="Dense & filled" filled dense />
<q-autocomplete v-model="loading" :options="countries" option-value="code" option-label="name" label="Loading" loading outlined />
<q-autocomplete v-model="disabled" :options="countries" option-value="code" option-label="name" label="Disabled" disable outlined />
<q-autocomplete v-model="error" :options="countries" option-value="code" option-label="name" label="Invalid code" error error-message="Choose a valid country" outlined />`

const panelCode = `<q-autocomplete
  v-model="selected"
  :options="countries"
  option-value="code"
  option-label="name"
  label="Country"
  :mode="mode"
  :sheet-options="{ title: 'Pick a country', width: '100%', searchPlaceholder: 'Search countries…' }"
  :modal-options="{ title: 'Pick a country', height: '400px' }"
  outlined
/>
<!-- mode : inline (dropdown) | modal (boîte centrée) | sheet (bottom sheet) -->`

const scriptPanel = `import { ref } from "vue"

const selected = ref("")
const mode = ref("inline")`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Autocomplete</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A text field with a filtered suggestion list. <b>&lt;q-autocomplete&gt;</b> binds
      the selected value with <code>v-model</code> and the typed text with
      <code>v-model:input-value</code>. Filtering is client-side by default —
      pass <code>@filter</code> to switch to server-side mode (the parent updates
      <code>:options</code>).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>
      <p class="doc-note">
        Search among <code>20 countries</code>. <code>option-value</code> and
        <code>option-label</code> pick the value / label of each option; type to
        filter, use arrows + <code>Enter</code> to select, <code>Escape</code> to close.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-autocomplete">
          <q-autocomplete
            v-model="selected"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Country"
            placeholder="Type to search…"
            outlined
            clearable
          />
          <p class="demo-p demo-p--value">
            Selected: <code>{{ selected || "—" }}</code>
          </p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom option slot ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom option slot</h2>
      <p class="doc-note">
        The default slot receives <code>{ option, index, selected, active }</code> —
        render any content per suggestion (icon, badge, description…).
      </p>

      <docs-demo :code="slotCode" lang="html" filename="App.vue">
        <div class="demo-autocomplete">
          <q-autocomplete
            v-model="selectedSlot"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Pick a country"
            outlined
          >
            <template #default="{ option }">
              <q-icon name="lucide:map-pin" color="primary" size="16px" />
              <span class="demo-opt-label">{{ option.name }}</span>
              <span class="demo-opt-code">{{ option.code }}</span>
            </template>
          </q-autocomplete>
          <p class="demo-p demo-p--value">
            Selected: <code>{{ selectedSlot || "—" }}</code>
          </p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Variants & states ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants &amp; states</h2>
      <p class="doc-note">
        Same field variants as <code>q-input</code> (<code>outlined</code>,
        <code>filled</code>, <code>borderless</code>, <code>dense</code>,
        <code>radius</code>) plus <code>loading</code>, <code>disable</code> and
        <code>error</code> / <code>error-message</code>.
      </p>

      <docs-demo :code="statesCode" lang="html" filename="App.vue">
        <div class="demo-autocomplete demo-autocomplete--states">
          <q-autocomplete
            v-model="dense"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Dense & filled"
            filled
            dense
          />
          <q-autocomplete
            v-model="loadingVal"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Loading"
            loading
            outlined
          />
          <q-autocomplete
            v-model="disabledVal"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Disabled"
            disable
            outlined
          />
          <q-autocomplete
            v-model="errorVal"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Invalid code"
            error
            error-message="Choose a valid country"
            outlined
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Sheet & modal ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sheet &amp; modal modes</h2>
      <p class="doc-note">
        <code>mode</code> switches the suggestion panel: <code>inline</code>
        (default dropdown), <code>modal</code> (centered box) or
        <code>sheet</code> (bottom sheet, iOS safe-area built in). The panel has
        a <code>title</code> header, its own search field (the typed text is
        shared with the field), and closes on backdrop / × / Esc / browser
        back. Per-mode tuning goes in <code>sheet-options</code> /
        <code>modal-options</code> (<code>width</code>, <code>height</code>,
        <code>title</code>, <code>style</code>, <code>class</code>,
        <code>search-placeholder</code> — they override the direct props) —
        e.g. <code>sheet-options="{ width: '100%' }"</code> for a full-width
        sheet.
      </p>

      <docs-demo :code="panelCode" lang="html" filename="App.vue" :script="scriptPanel">
        <div class="demo-autocomplete">
          <div class="demo-row">
            <q-select
              v-model="modeDemo"
              :options="['inline', 'modal', 'sheet']"
              label="mode"
              outlined
              dense
              class="demo-mode-select"
            />
          </div>
          <q-autocomplete
            v-model="panelVal"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Country"
            :mode="modeDemo"
            title="Pick a country"
            outlined
            clearable
          />
          <p class="demo-p demo-p--value">
            Selected: <code>{{ panelVal || "—" }}</code>
          </p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QAutocomplete</h2>
      <docs-api :comp="autocomplete" :source="autocompleteSource" />
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

/* — Preview agrandi : le popup du combobox est en position absolute,
     il faut de la hauteur pour qu'il ne soit pas coupé par le bloc démo — */
.demo-autocomplete {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 32px;
}
.demo-autocomplete--states {
  gap: 18px;
  max-width: 460px;
}
.demo-p--value {
  margin: 14px 0 0;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.demo-mode-select {
  width: 160px;
}
.demo-opt-label {
  flex: 1;
}
.demo-opt-code {
  font-size: 12px;
  color: #8b93a1;
  background: rgba(25, 118, 210, 0.08);
  padding: 1px 6px;
  border-radius: 5px;
}
</style>
