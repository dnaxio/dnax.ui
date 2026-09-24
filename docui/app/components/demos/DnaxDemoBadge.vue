<script setup lang="ts">
// Démos live de la page Badge (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "variants" | "floating"
}>()
</script>

<template>
  <div v-if="demo === 'variants'" class="demo-badge-variants">
    <div class="demo-row">
      <q-badge label="Outline" outline />
      <q-badge label="Transparent" transparent />
      <q-badge :label="42" color="negative" />
    </div>
    <div class="demo-col">
      <q-badge label="A long label that wraps on two lines" multi-line class="demo-wide" />
    </div>
  </div>

  <div v-else-if="demo === 'floating'" class="demo-row">
    <q-btn round icon="lucide:bell" color="primary">
      <q-badge floating color="negative" label="3" />
    </q-btn>
    <span class="badge-host">
      <q-icon name="lucide:shopping-cart" size="lg" />
      <q-badge floating color="positive" label="9" />
    </span>
  </div>
</template>

<style scoped>
.demo-badge-variants {
  width: 100%;
}
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-top: 12px;
  max-width: 680px;
}
.demo-wide {
  max-width: 160px;
}
.badge-host {
  position: relative;
  display: inline-flex;
}
</style>
