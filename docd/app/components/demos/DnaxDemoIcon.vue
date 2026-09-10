<script setup lang="ts">
// Démos live de la page Icon (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "spacing"
}>()
</script>

<template>
  <div v-if="demo === 'spacing'" class="demo-row">
    <span class="demo-inline"><q-icon name="lucide:mail" left /> Inbox</span>
    <span class="demo-inline">Drafts <q-icon name="lucide:chevron-right" right /></span>
    <q-icon name="lucide:refresh-cw" size="lg" class="demo-spin" />
  </div>
</template>

<style scoped>
.demo-inline {
  display: inline-flex;
  align-items: center;
}
.demo-spin {
  transform: rotate(45deg);
}
</style>
