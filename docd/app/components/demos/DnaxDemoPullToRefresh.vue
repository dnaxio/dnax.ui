<script setup lang="ts">
// Démos live de la page Pull To Refresh (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "custom" | "slots" | "controlled"
}>()

const items = ref(Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`))
const refreshed = ref(0)
const refreshing = ref(false)

const onRefresh = (done: () => void) => {
  setTimeout(() => {
    refreshed.value++
    items.value = [`Fresh item ${refreshed.value}`, ...items.value].slice(0, 12)
    done()
  }, 1200)
}

const onRefreshControlled = (done: () => void) => {
  setTimeout(() => {
    refreshed.value++
    items.value = [`Fresh item ${refreshed.value}`, ...items.value].slice(0, 12)
    done()
  }, 1000)
}

const trigger = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    refreshed.value++
    items.value = [`Fresh item ${refreshed.value}`, ...items.value].slice(0, 12)
  }, 1000)
}
</script>

<template>
  <div v-if="demo === 'basic'">
    <q-pull-to-refresh @refresh="onRefresh" style="height: 320px">
      <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
    </q-pull-to-refresh>
    <p class="demo-p demo-meta">Refreshed {{ refreshed }}× — pull down (mouse or touch) to trigger.</p>
  </div>

  <q-pull-to-refresh
    v-else-if="demo === 'custom'"
    @refresh="onRefresh"
    color="secondary"
    :pull-back="70"
    size="20px"
    style="height: 260px"
  >
    <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
  </q-pull-to-refresh>

  <q-pull-to-refresh v-else-if="demo === 'slots'" @refresh="onRefresh" style="height: 260px">
    <template #pulling="{ position }">
      <span class="demo-pull-label">↓ Pull to refresh ({{ Math.round(position) }}px)</span>
    </template>
    <template #refreshing>
      <span class="demo-refresh-label">Syncing…</span>
    </template>
    <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
  </q-pull-to-refresh>

  <div v-else-if="demo === 'controlled'" class="demo-col">
    <q-btn label="Trigger refresh" color="primary" @click="trigger" />
    <q-pull-to-refresh v-model="refreshing" @refresh="onRefreshControlled" style="height: 240px">
      <div v-for="it in items" :key="it" class="demo-row">{{ it }}</div>
    </q-pull-to-refresh>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}
.demo-row {
  display: block;
  padding: 10px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-size: 14px;
  color: var(--foreground);
  background: #fff;
}
.demo-pull-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary, #1976d2);
}
.demo-refresh-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary, #1976d2);
}
</style>
