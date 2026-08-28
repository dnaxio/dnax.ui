<script setup lang="ts">
// Bouton de bascule clair/sombre/system (cycle au clic).
import { computed } from "vue"
import { useThemeMode } from "~/composables/useThemeMode"

const { mode, cycleMode } = useThemeMode()

const icon = computed(() =>
  mode.value === "dark" ? "lucide:moon" : mode.value === "light" ? "lucide:sun" : "lucide:monitor",
)
const label = computed(() => `Theme: ${mode.value}`)
</script>

<template>
  <q-btn flat round dense :icon="icon" :aria-label="label" @click="cycleMode" />
</template>
