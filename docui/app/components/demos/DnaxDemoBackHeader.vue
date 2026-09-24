<script setup lang="ts">
// Démos live de la page Back Header (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "custom" | "noBack" | "styles" | "slot"
}>()

// — Démo interactive —
const backLog = ref("")
</script>

<template>
  <div v-if="demo === 'basic'">
    <q-back-header title="Settings" @back="backLog = 'back pressed'" />
    <p class="demo-p demo-meta">Last event: <code>{{ backLog || "—" }}</code></p>
  </div>

  <div v-else-if="demo === 'custom'">
    <q-back-header
      title="Product details"
      back-icon="lucide:arrow-left"
      back-label="Go back"
      @back="backLog = 'back pressed'"
    />
    <p class="demo-p demo-meta">Last event: <code>{{ backLog || "—" }}</code></p>
  </div>

  <div v-else-if="demo === 'noBack'">
    <q-back-header title="Home" :show-back="false" />
  </div>

  <div v-else-if="demo === 'styles'" class="demo-stack">
    <q-back-header title="Dark" dark />
    <q-back-header title="Translucent 50" :translucent="50" />
    <div class="demo-stage">
      <q-back-header title="Fixed inside a stage" fixed dark />
      <div class="demo-stage__body">
        <p class="demo-p">The bar is pinned to the top of this stage.</p>
      </div>
    </div>
  </div>

  <div v-else-if="demo === 'slot'">
    <q-back-header>
      <template #title>
        <span class="demo-custom-title">✦ Custom title</span>
      </template>
      <q-btn flat round dense icon="lucide:share" aria-label="Share" />
    </q-back-header>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
/* scène pour la barre fixed : la barre se cale en haut de la scène au lieu du viewport */
.demo-stage {
  position: relative;
  border: 1px dashed rgb(0 0 0 / 0.18);
  border-radius: 10px;
  overflow: hidden;
  background: var(--muted);
}
.demo-stage :deep(.q-back-header--fixed) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.demo-stage__body {
  padding: 64px 16px 16px;
}
.demo-custom-title {
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>
