<script setup lang="ts">
// Démos live de la page Breadcrumbs (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "change"
}>()

// — Change event (clic sur une miette) —
const lastCrumb = ref("—")
const onCrumbChange = (index: number) => {
  lastCrumb.value = `crumb #${index + 1}`
}
</script>

<template>
  <div v-if="demo === 'change'" class="demo-breadcrumbs-change">
    <q-breadcrumbs separator="›" @change="onCrumbChange" class="demo-change">
      <q-breadcrumbs-el icon="lucide:home" label="Home" />
      <q-breadcrumbs-el label="Design system" />
      <q-breadcrumbs-el label="Components" />
      <q-breadcrumbs-el label="Breadcrumbs" />
    </q-breadcrumbs>
    <p class="demo-meta">Clicked: <code>{{ lastCrumb }}</code></p>
  </div>
</template>

<style scoped>
.demo-breadcrumbs-change {
  width: 100%;
}
</style>
