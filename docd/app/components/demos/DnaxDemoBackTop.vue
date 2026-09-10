<script setup lang="ts">
// Démos live de la page Back Top (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "positions" | "custom"
}>()

// — Scènes scrollables : lignes pour rendre la scène scrollable —
const rows = ref(Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`))
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-stage">
    <p v-for="row in rows" :key="row" class="demo-row">{{ row }}</p>
    <q-back-top :offset="100" />
  </div>

  <div v-else-if="demo === 'positions'" class="demo-stage-grid">
    <div class="demo-stage">
      <p class="demo-label">bottom-right</p>
      <p v-for="row in rows" :key="row" class="demo-row">{{ row }}</p>
      <q-back-top :offset="100" position="bottom-right" />
    </div>
    <div class="demo-stage">
      <p class="demo-label">bottom-left</p>
      <p v-for="row in rows" :key="row" class="demo-row">{{ row }}</p>
      <q-back-top :offset="100" position="bottom-left" />
    </div>
    <div class="demo-stage">
      <p class="demo-label">top-right</p>
      <p v-for="row in rows" :key="row" class="demo-row">{{ row }}</p>
      <q-back-top :offset="100" position="top-right" />
    </div>
    <div class="demo-stage">
      <p class="demo-label">top-left</p>
      <p v-for="row in rows" :key="row" class="demo-row">{{ row }}</p>
      <q-back-top :offset="100" position="top-left" />
    </div>
  </div>

  <div v-else-if="demo === 'custom'" class="demo-stage">
    <p v-for="row in rows" :key="row" class="demo-row">{{ row }}</p>
    <q-back-top :offset="100" position="bottom-left" color="secondary" icon="lucide:rocket" />
  </div>
</template>

<style scoped>
/* — Scènes scrollables : le back-top est sticky dans la scène — */
.demo-stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.demo-stage {
  position: relative;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  padding: 8px;
  background: #fff;
}
.demo-label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
  text-align: center;
}
.demo-row {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--foreground);
}
.demo-row:nth-child(odd) {
  background: rgb(0 0 0 / 0.03);
}
</style>
