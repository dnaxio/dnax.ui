<script setup lang="ts">
// Démos live de la page Button (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "loading" | "click"
}>()

// — loading —
const loadingState = ref(false)
const startLoading = () => {
  loadingState.value = true
  setTimeout(() => (loadingState.value = false), 2200)
}

// — click —
const clicks = ref(0)
</script>

<template>
  <div v-if="demo === 'loading'" class="demo-row">
    <q-btn label="Simulate loading" :loading="loadingState" @click="startLoading" />
  </div>

  <div v-else-if="demo === 'click'" class="demo-row">
    <q-btn label="Click me" @click="clicks++" />
    <p class="demo-p">Clicked {{ clicks }} times.</p>
  </div>
</template>
