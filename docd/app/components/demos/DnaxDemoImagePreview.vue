<script setup lang="ts">
// Démos live de la page Image Preview (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "fade" | "zoom" | "programmatic"
}>()

const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1600&auto=format&fit=crop",
]

const open = ref(false)
const index = ref(0)
const openFade = ref(false)
const indexFade = ref(0)
const dismissed = ref(0)
const openZoom = ref(false)
const indexZoom = ref(0)

const openProgrammatic = () => {
  usePlugin().imagePreview.open({
    images,
    index: 0,
    transition: "up",
    closeBtn: true,
  })
}
</script>

<template>
  <template v-if="demo === 'basic'">
    <div class="demo-grid">
      <img
        v-for="(img, i) in images"
        :key="i"
        :src="img"
        class="demo-thumb"
        :alt="'Image ' + (i + 1)"
        @click="index = i; open = true"
      />
    </div>

    <q-image-preview v-model="open" :images="images" v-model:index="index" transition="up" />
  </template>

  <template v-else-if="demo === 'fade'">
    <q-btn color="primary" no-caps label="Open gallery (fade)" @click="openFade = true" />
    <p class="demo-p demo-meta">Dismissed {{ dismissed }}×</p>

    <q-image-preview
      v-model="openFade"
      :images="images"
      v-model:index="indexFade"
      transition="fade"
      close-btn
      @dismiss="dismissed++"
    />
  </template>

  <template v-else-if="demo === 'zoom'">
    <q-btn color="secondary" no-caps label="Open with zoom" @click="openZoom = true" />

    <q-image-preview
      v-model="openZoom"
      :images="images"
      v-model:index="indexZoom"
      transition="zoom"
      close-btn
      :counter="false"
    />
  </template>

  <q-btn
    v-else-if="demo === 'programmatic'"
    color="primary"
    outline
    no-caps
    label="Open programmatically"
    @click="openProgrammatic()"
  />
</template>

<style scoped>
.demo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 560px;
  margin: 0 auto;
}
.demo-thumb {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.demo-thumb:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.2);
}
</style>
