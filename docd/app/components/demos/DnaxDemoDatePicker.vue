<script setup lang="ts">
// Démos live de la page Date Picker (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "inline" | "sheet" | "modal" | "dialog" | "restrictions" | "custom-format"
}>()

const dateInline = ref<Date | null>(null)
const dateSheet = ref<Date | null>(null)
const dateModal = ref<Date | null>(null)
const dateDialog = ref<Date | null>(null)
const dateRange = ref<Date | null>(null)
const dateFormat = ref<Date | null>(new Date(1990, 4, 12))

const fmt = (d: Date | null) => (d ? d.toLocaleDateString("en-GB") : "—")
</script>

<template>
  <div v-if="demo === 'inline'" class="demo-cal">
    <q-date-picker v-model="dateInline" mode="inline" />
    <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateInline) }}</code></p>
  </div>

  <div v-else-if="demo === 'sheet'" class="demo-field">
    <q-date-picker
      v-model="dateSheet"
      mode="sheet"
      label="Due date"
      placeholder="Pick a date"
      outlined
      clearable
    />
    <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateSheet) }}</code></p>
  </div>

  <div v-else-if="demo === 'modal'" class="demo-field">
    <q-date-picker
      v-model="dateModal"
      mode="modal"
      label="Appointment"
      title="Select a date"
      outlined
    />
    <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateModal) }}</code></p>
  </div>

  <div v-else-if="demo === 'dialog'" class="demo-field">
    <q-date-picker
      v-model="dateDialog"
      mode="dialog"
      label="Departure"
      title="When do you leave?"
      outlined
    />
    <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateDialog) }}</code></p>
  </div>

  <div v-else-if="demo === 'restrictions'" class="demo-cal">
    <q-date-picker
      v-model="dateRange"
      mode="inline"
      :min-date="new Date(2026, 7, 1)"
      :max-date="new Date(2026, 7, 28)"
      :disabled-dates="(d) => d.getDay() === 0 || d.getDay() === 6"
    />
    <p class="demo-p demo-p--value">Selected: <code>{{ fmt(dateRange) }}</code></p>
  </div>

  <div v-else-if="demo === 'custom-format'" class="demo-field">
    <q-date-picker
      v-model="dateFormat"
      mode="sheet"
      label="Birthday"
      :format="(d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })"
      outlined
    />
  </div>
</template>

<style scoped>
.demo-cal {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}
.demo-field {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.demo-p--value {
  margin: 14px 0 0;
  text-align: center;
}
</style>
