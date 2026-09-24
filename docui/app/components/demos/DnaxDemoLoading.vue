<script setup lang="ts">
// Démos live de la page Loading (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "custom" | "boxed"
}>()

// — Démos —
const busyBasic = ref(false)
const busyCustom = ref(false)
const busyBoxed = ref(false)

const run = (key: "basic" | "custom" | "boxed") => {
  const refs = { basic: busyBasic, custom: busyCustom, boxed: busyBoxed }
  const target = refs[key]
  if (target.value) return
  target.value = true
  setTimeout(() => (target.value = false), 1800)
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-actions">
    <q-loading v-model="busyBasic" message="Loading…" />
    <q-btn unelevated color="primary" no-caps label="Show loading" :loading="busyBasic" @click="run('basic')" />
  </div>

  <div v-else-if="demo === 'custom'" class="demo-actions">
    <q-loading
      v-model="busyCustom"
      message="Uploading files…"
      icon="lucide:loader-circle"
      spinner-color="primary"
      background-color="rgb(0 0 0 / 0.45)"
    />
    <q-btn unelevated color="secondary" no-caps label="Upload (custom)" :loading="busyCustom" @click="run('custom')" />
  </div>

  <div v-else-if="demo === 'boxed'" class="demo-actions">
    <q-loading
      v-model="busyBoxed"
      message="Saving settings…"
      icon="lucide:loader-circle"
      spinner-color="primary"
      boxed
    />
    <q-btn unelevated color="dark" no-caps label="Save (boxed icon)" :loading="busyBoxed" @click="run('boxed')" />
  </div>
</template>

<style scoped>
.demo-actions {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
</style>
