<script setup lang="ts">
// Démos live de la page Timeline (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "heading" | "icons"
}>()

// — Démos —
const avatar =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
</script>

<template>
  <!-- Entrées alternées gauche / droite + corps -->
  <q-timeline v-if="demo === 'basic'" class="demo-timeline">
    <q-timeline-entry title="Project kickoff" subtitle="Jan 12 · 09:30">
      <p class="demo-p">The team meets to scope the first milestone.</p>
    </q-timeline-entry>
    <q-timeline-entry title="Design review" subtitle="Jan 19 · 14:00">
      <p class="demo-p">Wireframes are approved with two adjustments.</p>
    </q-timeline-entry>
    <q-timeline-entry title="First release" subtitle="Feb 02 · 10:15" color="positive">
      <p class="demo-p">Version 1.0 is published to production.</p>
    </q-timeline-entry>
  </q-timeline>

  <!-- Titres de période centrés -->
  <q-timeline v-else-if="demo === 'heading'" color="secondary" class="demo-timeline">
    <q-timeline-entry heading title="2024"></q-timeline-entry>
    <q-timeline-entry title="v2.4" subtitle="Q1">
      <p class="demo-p">New timeline, board and chart components.</p>
    </q-timeline-entry>
    <q-timeline-entry title="v2.5" subtitle="Q2">
      <p class="demo-p">Spreadsheet cell types and change tracking.</p>
    </q-timeline-entry>
    <q-timeline-entry heading title="2025"></q-timeline-entry>
    <q-timeline-entry title="v3.0" subtitle="Q1">
      <p class="demo-p">Theming rework and dark mode everywhere.</p>
    </q-timeline-entry>
  </q-timeline>

  <!-- Icônes, avatar et couleurs de pastille -->
  <q-timeline v-else-if="demo === 'icons'" class="demo-timeline">
    <q-timeline-entry
      title="Order placed"
      subtitle="09:12"
      icon="lucide:shopping-cart"
      color="primary"
    ></q-timeline-entry>
    <q-timeline-entry
      title="Payment received"
      subtitle="09:18"
      icon="lucide:credit-card"
      color="positive"
    ></q-timeline-entry>
    <q-timeline-entry title="Handed to courier" subtitle="11:40" :avatar="avatar" color="secondary"></q-timeline-entry>
    <q-timeline-entry
      title="Out for delivery"
      subtitle="Tomorrow · 08:00"
      icon="lucide:truck"
      color="warning"
    ></q-timeline-entry>
  </q-timeline>
</template>

<style scoped>
.demo-timeline {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}
</style>
