<script setup lang="ts">
// Démos live de la page Plugin Loading ($q.loading : overlay plein écran compté).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "live"
}>()

const $q = usePlugin()

const fire = () => {
  $q.loading.show({ message: "Loading…", spinnerColor: "primary" })
  setTimeout(() => $q.loading.hide(), 2000)
}
</script>

<template>
  <div v-if="demo === 'live'" class="demo-row">
    <q-btn no-caps color="primary" label="Show for 2s" @click="fire" />
  </div>
</template>
