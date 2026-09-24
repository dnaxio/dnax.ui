<script setup lang="ts">
// Démos live de la page Checkbox (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "simple" | "array" | "indeterminate" | "states" | "layout"
}>()

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
</script>

<template>
  <div v-if="demo === 'simple'" class="demo-group">
    <q-checkbox v-model="checked" label="Accept terms" color="secondary" />
  </div>

  <div v-else-if="demo === 'array'" class="demo-group">
    <q-checkbox
      v-for="opt in featureOptions"
      :key="opt.value"
      v-model="features"
      :val="opt.value"
      :label="opt.label"
    />
  </div>

  <div v-else-if="demo === 'indeterminate'" class="demo-group">
    <q-checkbox v-model="state" label="Select all" indeterminate-value="mixed" />
  </div>

  <div v-else-if="demo === 'states'" class="demo-group">
    <q-checkbox v-model="locked" label="Disabled" disable />
    <q-checkbox v-model="locked" label="Readonly" readonly color="secondary" />
  </div>

  <div v-else-if="demo === 'layout'" class="demo-group">
    <q-checkbox v-model="liked" label="Left label" left-label color="teal" />
    <q-checkbox
      v-model="liked"
      color="primary"
      checked-icon="lucide:thumbs-up"
      unchecked-icon="lucide:thumbs-down"
    />
  </div>
</template>

<style scoped>
.demo-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
</style>
