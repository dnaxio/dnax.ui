<script setup lang="ts">
// Démos live de la page Autocomplete (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "slot" | "icon" | "states" | "panel" | "swipe"
}>()

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
const iconVal = ref("")
const dense = ref("")
const loadingVal = ref("")
const disabledVal = ref("")
const errorVal = ref("")

// — Démo modes (inline / modal / sheet) —
const panelVal = ref("")
const modeDemo = ref<"inline" | "modal" | "sheet">("inline")

// — Démo swipe-to-close —
const swipeVal = ref("")
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-autocomplete">
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

  <div v-else-if="demo === 'slot'" class="demo-autocomplete">
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

  <div v-else-if="demo === 'icon'" class="demo-autocomplete">
    <q-autocomplete
      v-model="iconVal"
      :options="countries"
      option-value="code"
      option-label="name"
      label="Country"
      icon-left="lucide:map-pin"
      outlined
      clearable
    />
    <p class="demo-p demo-p--value">
      Selected: <code>{{ iconVal || "—" }}</code>
    </p>
  </div>

  <div v-else-if="demo === 'states'" class="demo-autocomplete demo-autocomplete--states">
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

  <div v-else-if="demo === 'panel'" class="demo-autocomplete">
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
      swipe-to-close
      outlined
      clearable
    />
    <p class="demo-p demo-p--value">
      Selected: <code>{{ panelVal || "—" }}</code>
    </p>
  </div>

  <div v-else-if="demo === 'swipe'" class="demo-autocomplete">
    <q-autocomplete
      v-model="swipeVal"
      :options="countries"
      option-value="code"
      option-label="name"
      label="Country"
      mode="sheet"
      swipe-to-close
      title="Pick a country"
      outlined
      clearable
    />
    <p class="demo-p demo-p--value">
      Selected: <code>{{ swipeVal || "—" }}</code>
    </p>
  </div>
</template>

<style scoped>
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
  background: rgb(25 118 210 / 0.08);
  padding: 1px 6px;
  border-radius: 5px;
}
</style>
