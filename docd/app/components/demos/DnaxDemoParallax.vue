<script setup lang="ts">
// Démos live de la page Parallax (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "speed" | "content" | "container"
}>()

const img1 =
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop"
const img2 =
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop"
const img3 =
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1600&auto=format&fit=crop"
</script>

<template>
  <q-parallax v-if="demo === 'basic'" :src="img1" :height="300">
    <div class="demo-overlay">
      <h3 class="demo-overlay__title">Dnax UI</h3>
      <p class="demo-overlay__sub">Scroll the page — the background moves slower.</p>
    </div>
  </q-parallax>

  <q-parallax v-else-if="demo === 'speed'" :src="img2" :height="220" :speed="0.4">
    <p class="demo-caption">speed = 0.4 — a subtle drift</p>
  </q-parallax>

  <q-parallax v-else-if="demo === 'content'" :src="img3" :height="240">
    <q-badge color="primary" label="✦ Parallax content" class="demo-badge" />
  </q-parallax>

  <div v-else-if="demo === 'container'" class="demo-scroll">
    <p class="demo-scroll__text">
      Scroll inside this box — the parallax tracks its container.
    </p>
    <q-parallax :src="img2" :height="180" />
    <p class="demo-scroll__text">
      More content below… and the image still moves as you scroll.
    </p>
    <p class="demo-scroll__text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. The parallax
      keeps working even in a nested scroller.
    </p>
  </div>
</template>

<style scoped>
/* — overlays — */
.demo-overlay {
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 12px rgb(0 0 0 / 0.5);
}
.demo-overlay__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.demo-overlay__sub {
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.9;
}
.demo-caption {
  margin: 0;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.45);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.demo-badge {
  font-size: 13px;
}

/* — conteneur scrollable — */
.demo-scroll {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: var(--background, #fff);
}
.demo-scroll__text {
  margin: 0;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--foreground);
}
</style>
