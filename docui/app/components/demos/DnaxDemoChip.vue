<script setup lang="ts">
// Démos live de la page Chip (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "removable" | "events"
}>()

const chips = ref(["Vue", "Nuxt", "Shadcn"])
const resetChips = () => {
  chips.value = ["Vue", "Nuxt", "Shadcn"]
}
const count = ref(0)
</script>

<template>
  <template v-if="demo === 'removable'">
    <div class="demo-row">
      <q-chip
        v-for="(c, i) in chips"
        :key="c"
        :label="c"
        removable
        color="secondary"
        @remove="chips.splice(i, 1)"
      />
    </div>
    <div v-if="!chips.length" class="demo-row demo-gap">
      <p class="demo-p">All chips removed.</p>
      <q-btn label="Reset" size="sm" flat unelevated @click="resetChips" />
    </div>
  </template>

  <div v-else-if="demo === 'events'" class="demo-row">
    <q-chip label="Click me" icon="lucide:thumbs-up" @click="count++" />
    <q-chip label="Disabled" icon="lucide:lock" disable />
    <p class="demo-p">Clicks: {{ count }}</p>
  </div>
</template>

<style scoped>
.demo-gap {
  margin-top: 12px;
}
</style>
