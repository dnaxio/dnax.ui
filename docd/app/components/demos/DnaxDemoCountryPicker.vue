<script setup lang="ts">
// Démos live de la page Country Picker (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "modes" | "sheet-options" | "basic" | "language" | "styles" | "no-dial" | "custom"
}>()

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
</script>

<template>
  <div v-if="demo === 'modes'" class="demo-col">
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

  <q-country-picker
    v-else-if="demo === 'sheet-options'"
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

  <div v-else-if="demo === 'basic'" class="demo-col">
    <q-country-picker v-model="code" label="Country" />
    <p class="demo-p demo-meta">Selected: <code>{{ code }}</code></p>
  </div>

  <div v-else-if="demo === 'language'" class="demo-col">
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

  <div v-else-if="demo === 'styles'" class="demo-col">
    <q-country-picker v-model="code" label="Country" outlined dense />
    <q-country-picker v-model="code" label="Country" filled dense />
  </div>

  <q-country-picker
    v-else-if="demo === 'no-dial'"
    v-model="codeNoDial"
    label="Country"
    :show-dial="false"
    outlined
  />

  <q-country-picker
    v-else-if="demo === 'custom'"
    v-model="code"
    :countries="shortList"
    label="Europe"
    outlined
  />
</template>

<style scoped>
.demo-modes {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}
.demo-lang-select {
  width: 180px;
  align-self: center;
}
</style>
