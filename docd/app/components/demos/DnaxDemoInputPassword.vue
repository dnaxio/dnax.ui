<script setup lang="ts">
// Live demos for the Input Password page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "variants" | "states" | "confirm"
}>()

const password = ref("")
const confirm = ref("")
const densePwd = ref("")
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-field">
    <q-input-password v-model="password" label="Password" outlined />
  </div>

  <div v-else-if="demo === 'variants'" class="demo-col">
    <q-input-password v-model="densePwd" label="Password" outlined dense clearable />
    <q-input-password v-model="densePwd" label="Password" filled />
    <q-input-password v-model="densePwd" label="Password" borderless />
  </div>

  <div v-else-if="demo === 'states'" class="demo-col">
    <q-input-password v-model="densePwd" label="Password" hint="8+ characters, 1 number" outlined />
    <q-input-password v-model="densePwd" label="Password" error error-message="Too weak" outlined />
    <q-input-password v-model="densePwd" label="Password" disable outlined />
  </div>

  <div v-else-if="demo === 'confirm'" class="demo-col">
    <q-input-password v-model="password" label="Password" outlined />
    <q-input-password v-model="confirm" label="Confirm password" outlined />
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.demo-col {
  gap: 16px;
  max-width: 420px;
  margin: 0 auto;
}
</style>
