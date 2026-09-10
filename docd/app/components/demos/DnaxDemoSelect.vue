<script setup lang="ts">
// Live demos for the Select page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "customKeys" | "outlined" | "multiple" | "primitives"
}>()

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

const color = ref<{ value: string; label: string } | null>(null)
const country = ref<string | null>(null)
const framework = ref<string | null>(null)
const size = ref<string | null>(null)
const level = ref<number | null>(null)
const multi = ref<string[]>([])
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-field">
    <q-select
      v-model="color"
      :options="colors"
      label="Color"
      placeholder="Pick a color"
    />
  </div>

  <div v-else-if="demo === 'customKeys'" class="demo-field">
    <q-select
      v-model="country"
      :options="countries"
      option-label="name"
      option-value="id"
      label="Country"
      emit-value
    />
  </div>

  <div v-else-if="demo === 'outlined'" class="demo-field">
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

  <div v-else-if="demo === 'multiple'" class="demo-field">
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

  <div v-else-if="demo === 'primitives'" class="demo-field demo-col">
    <q-select v-model="size" :options="['S', 'M', 'L', 'XL']" label="Size" />
    <q-select v-model="level" :options="[1, 2, 3, 4, 5]" label="Level" />
    <p class="demo-p">size = <code>{{ size }}</code> · level = <code>{{ level }}</code></p>
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 520px;
}
.demo-field.demo-col {
  gap: 14px;
  align-items: stretch;
  max-width: 520px;
}
</style>
