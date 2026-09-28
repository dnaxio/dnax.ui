<script setup lang="ts">
// Démos live de la page Time (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "twelve-hour" | "seconds" | "disabled"
}>()

const basic = ref("09:30")
const twelve = ref("17:45")
const precise = ref("08:15:40")
const frozen = ref("12:00")
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-time">
    <q-time v-model="basic" label="Start time" hint="24-hour value, HH:MM" />
    <p class="demo-p demo-p--value">Value: <code>{{ basic }}</code></p>
  </div>

  <div v-else-if="demo === 'twelve-hour'" class="demo-time">
    <q-time v-model="twelve" :format24h="false" label="Meeting" now-btn />
    <p class="demo-p demo-p--value">Value: <code>{{ twelve }}</code></p>
  </div>

  <div v-else-if="demo === 'seconds'" class="demo-time">
    <q-time v-model="precise" with-seconds :minute-step="5" label="Lap time" />
    <p class="demo-p demo-p--value">Value: <code>{{ precise }}</code></p>
  </div>

  <div v-else-if="demo === 'disabled'" class="demo-time">
    <q-time v-model="frozen" label="Locked" disable />
    <q-time v-model="frozen" label="Read-only" readonly />
  </div>
</template>

<style scoped>
.demo-time {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}
.demo-p--value {
  margin: 0;
  text-align: center;
}
</style>
