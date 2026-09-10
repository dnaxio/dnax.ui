<script setup lang="ts">
// Live demos for the Inner Loading page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { reactive } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "label" | "dark" | "icon"
}>()

const state = reactive({ basic: false, label: false, dark: false, icon: false })

const run = (key: "basic" | "label" | "dark" | "icon") => {
  state[key] = true
  setTimeout(() => (state[key] = false), 1800)
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-col">
    <div class="demo-panel">
      <h3 class="demo-panel__title">Orders</h3>
      <p class="demo-p">Recent orders will appear here…</p>
      <q-inner-loading :showing="state.basic" />
    </div>
    <div class="demo-actions">
      <q-btn unelevated color="primary" no-caps label="Reload" @click="run('basic')" />
    </div>
  </div>

  <div v-else-if="demo === 'label'" class="demo-col">
    <div class="demo-panel">
      <h3 class="demo-panel__title">Exporting report</h3>
      <p class="demo-p">Generating the PDF file…</p>
      <q-inner-loading :showing="state.label" label="Exporting…" color="secondary" size="lg" />
    </div>
    <div class="demo-actions">
      <q-btn unelevated color="secondary" no-caps label="Export" @click="run('label')" />
    </div>
  </div>

  <div v-else-if="demo === 'dark'" class="demo-col">
    <div class="demo-panel">
      <h3 class="demo-panel__title">Syncing data</h3>
      <p class="demo-p">Waiting for the server…</p>
      <q-inner-loading :showing="state.dark" label="Syncing…" dark size="sm" />
    </div>
    <div class="demo-actions">
      <q-btn unelevated color="dark" no-caps label="Sync" @click="run('dark')" />
    </div>
  </div>

  <div v-else-if="demo === 'icon'" class="demo-col">
    <div class="demo-panel">
      <h3 class="demo-panel__title">Refreshing feed</h3>
      <p class="demo-p">Fetching the latest posts…</p>
      <q-inner-loading :showing="state.icon" icon="lucide:loader-circle" label="Refreshing…" color="positive" />
    </div>
    <div class="demo-actions">
      <q-btn unelevated color="positive" no-caps label="Refresh" @click="run('icon')" />
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  gap: 14px;
  max-width: 420px;
  margin: 0 auto;
}
.demo-panel {
  position: relative; /* required by q-inner-loading */
  min-height: 160px;
  padding: 20px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: #fff;
}
.demo-panel__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-actions {
  display: flex;
  justify-content: center;
}
</style>
