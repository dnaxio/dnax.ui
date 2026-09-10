<script setup lang="ts">
// Démos live de la page Avatar (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "sizes" | "photos" | "colors" | "icons" | "shapes" | "fallback"
}>()

// — Photos de démonstration (Unsplash) —
const photo1 =
  "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const photo2 =
  "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
</script>

<template>
  <div v-if="demo === 'sizes'" class="demo-row demo-row--avatars">
    <q-avatar size="xs" :src="photo1" alt="Alex" />
    <q-avatar size="sm" :src="photo1" alt="Alex" />
    <q-avatar size="md" :src="photo1" alt="Alex" />
    <q-avatar size="lg" :src="photo1" alt="Alex" />
    <q-avatar size="xl" :src="photo1" alt="Alex" />
    <q-avatar size="7rem" :src="photo1" alt="Alex" />
  </div>

  <div v-else-if="demo === 'photos'" class="demo-row demo-row--avatars">
    <q-avatar size="xl" :src="photo1" alt="Alex" />
    <q-avatar size="xl" :src="photo2" alt="Sam" />
  </div>

  <div v-else-if="demo === 'colors'" class="demo-row demo-row--avatars">
    <q-avatar color="primary" alt="Jean Dupont" />
    <q-avatar color="secondary" alt="Marie Curie" />
    <q-avatar color="positive" alt="Paul Martin" />
    <q-avatar color="warning" text-color="dark" alt="Sara Lee" />
    <q-avatar color="#7c3aed" alt="Ada Lovelace" />
  </div>

  <div v-else-if="demo === 'icons'" class="demo-row demo-row--avatars">
    <q-avatar icon="lucide:user" color="primary" />
    <q-avatar icon="lucide:rocket" color="secondary" />
    <q-avatar icon="lucide:zap" color="warning" />
    <q-avatar icon="lucide:star" color="positive" />
  </div>

  <div v-else-if="demo === 'shapes'" class="demo-row demo-row--avatars">
    <q-avatar size="lg" :src="photo2" alt="Sam" />
    <q-avatar size="lg" :src="photo2" alt="Sam" rounded />
    <q-avatar size="lg" :src="photo2" alt="Sam" square />
  </div>

  <div v-else-if="demo === 'fallback'" class="demo-row demo-row--avatars">
    <q-avatar size="lg" src="broken.jpg" alt="Jean Dupont" />
    <q-avatar size="lg" src="broken.jpg" icon="lucide:user" color="secondary" />
    <q-avatar size="lg" src="broken.jpg" color="positive">
      <q-icon name="lucide:heart" color="white" size="28px" />
    </q-avatar>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}
.demo-row--avatars {
  padding: 12px 0;
}
</style>
