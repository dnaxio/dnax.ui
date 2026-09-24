<script setup lang="ts">
// Démos live de la page Plugin Image Preview ($q.imagePreview : visionneuse plein écran).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "live"
}>()

const $q = usePlugin()

const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1600&auto=format&fit=crop",
]

const fire = () => {
  $q.imagePreview.open({
    images,
    index: 0,
    transition: "up",
    closeBtn: true,
  })
}
</script>

<template>
  <div v-if="demo === 'live'" class="demo-row">
    <q-btn no-caps color="primary" label="Open preview" @click="fire" />
  </div>
</template>
