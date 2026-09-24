<script setup lang="ts">
// Démos live de la page Gallery (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "multiple" | "labels" | "custom" | "viewer"
}>()

const IMAGES = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1287&auto=format&fit=crop",
]

const LABELED = [
  { src: IMAGES[0]!, label: "Alpine sunrise", description: "Golden light over the peaks" },
  { src: IMAGES[1]!, label: "Coastal cliffs", description: "Wild ocean views" },
  { src: IMAGES[2]!, label: "Forest trail", description: "Morning mist between the pines" },
  { src: IMAGES[3]!, label: "Desert dunes", description: "Endless sand at dusk" },
]

const PHOTOS = [
  { id: 1, url: IMAGES[0]!, name: "Alpine sunrise", desc: "Golden light over the peaks" },
  { id: 2, url: IMAGES[1]!, name: "Coastal cliffs", desc: "Wild ocean views" },
  { id: 3, url: IMAGES[2]!, name: "Forest trail", desc: "Morning mist between the pines" },
  { id: 4, url: IMAGES[3]!, name: "Desert dunes", desc: "Endless sand at dusk" },
]

const single = ref<string | null>(null)
const many = ref<string[]>([])
const labeledMany = ref<any[]>([])
const customMany = ref<any[]>([])
const lastSelect = ref<any>(null)
</script>

<template>
  <template v-if="demo === 'basic'">
    <q-gallery v-model="single" :images="IMAGES" hover />
    <p class="demo-p demo-meta">Selected: <code>{{ single ?? "—" }}</code></p>
  </template>

  <template v-else-if="demo === 'multiple'">
    <q-gallery v-model="many" :images="IMAGES" multiple :max-selected="4" />
    <p class="demo-p demo-meta">{{ many.length }} selected (max 4)</p>
  </template>

  <template v-else-if="demo === 'labels'">
    <q-gallery v-model="labeledMany" :images="LABELED" labels :cols="2" multiple />
    <p class="demo-p demo-meta">{{ labeledMany.length }} selected</p>
  </template>

  <template v-else-if="demo === 'custom'">
    <q-gallery
      v-model="customMany"
      :images="PHOTOS"
      src-key="url"
      label-key="name"
      description-key="desc"
      labels
      multiple
      @select="lastSelect = $event"
    />
    <p class="demo-p demo-meta">
      Last select: <code>{{ JSON.stringify(lastSelect?.image) }}</code>
    </p>
  </template>

  <q-gallery
    v-else-if="demo === 'viewer'"
    :images="IMAGES"
    :cols="8"
    dense
    :selectable="false"
  />
</template>

<style scoped>
.demo-p.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
</style>
