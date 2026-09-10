<script setup lang="ts">
// Démos live de la page Pagination (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { computed, ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "list" | "basic" | "window" | "variants"
}>()

// — Démo 1 : liste paginée (cas réel) —
const allItems = ref(Array.from({ length: 23 }, (_, i) => `Row ${i + 1}`))
const page = ref(1)
const perPage = 5
const pageItems = computed(() => allItems.value.slice((page.value - 1) * perPage, page.value * perPage))
const maxPage = computed(() => Math.ceil(allItems.value.length / perPage))

// — Autres démos —
const pageBasic = ref(4)
const pageWindow = ref(7)
const pageVariants = ref(3)
const pageColor = ref(2)
</script>

<template>
  <div v-if="demo === 'list'">
    <div class="demo-list">
      <div v-for="it in pageItems" :key="it" class="demo-row">{{ it }}</div>
    </div>
    <q-pagination v-model="page" :max="maxPage" boundary-links direction-links />
    <p class="demo-p demo-meta">
      Page {{ page }} / {{ maxPage }} — {{ allItems.length }} rows, {{ perPage }} per page.
    </p>
  </div>

  <div v-else-if="demo === 'basic'">
    <q-pagination v-model="pageBasic" :max="10" />
    <p class="demo-p demo-meta">Current page: {{ pageBasic }}</p>
  </div>

  <div v-else-if="demo === 'window'">
    <q-pagination v-model="pageWindow" :max="20" :max-pages="5" boundary-links />
  </div>

  <div v-else-if="demo === 'variants'" class="demo-col">
    <q-pagination
      v-model="pageVariants"
      :max="8"
      rounded
      outline
      dense
      active-color="secondary"
    />
    <q-pagination v-model="pageColor" :max="8" unelevated size="lg" active-color="teal" />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

/* — liste paginée — */
.demo-list {
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 14px;
}
.demo-list .demo-row {
  display: block;
  padding: 10px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-size: 14px;
  color: var(--foreground);
}
.demo-list .demo-row:last-child {
  border-bottom: none;
}
.demo-list .demo-row:nth-child(odd) {
  background: rgb(0 0 0 / 0.02);
}
</style>
