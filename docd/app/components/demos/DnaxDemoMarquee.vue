<script setup lang="ts">
// Démos live de la page Marquee (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "direction" | "pause" | "tune" | "slot"
}>()

const NEWS = "Latest news — dnax.ui 1.0 released · New components every week · Built for Vue 3 ✨"

const features = [
  { label: "Vue 3", icon: "lucide:zap" },
  { label: "TypeScript", icon: "lucide:braces" },
  { label: "Quasar API", icon: "lucide:rocket" },
  { label: "shadcn style", icon: "lucide:sparkles" },
]
</script>

<template>
  <q-marquee v-if="demo === 'basic'" :text="NEWS" />

  <q-marquee v-else-if="demo === 'direction'" :text="NEWS" direction="right" :duration="30" />

  <q-marquee v-else-if="demo === 'pause'" :text="NEWS" :pause-on-hover="true" />

  <q-marquee v-else-if="demo === 'tune'" :text="NEWS" :duration="10" gap="48px" />

  <q-marquee v-else-if="demo === 'slot'" :duration="16" :pause-on-hover="true">
    <span v-for="f in features" :key="f.label" class="demo-chip">
      <q-icon :name="f.icon" size="14px" /> {{ f.label }}
    </span>
  </q-marquee>
</template>

<style scoped>
.demo-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 12px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary, #1976d2);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
