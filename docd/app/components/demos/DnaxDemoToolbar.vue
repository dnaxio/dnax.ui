<script setup lang="ts">
// Live demos for the Toolbar page (page styling).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "header" | "inset-shrink"
}>()
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-toolbar">
    <q-toolbar>
      <span class="demo-title">Inbox</span>
      <q-space />
      <q-btn flat round dense icon="lucide:search" />
      <q-btn flat round dense icon="lucide:bell" />
      <q-btn flat round dense icon="lucide:menu" />
    </q-toolbar>
  </div>

  <div v-else-if="demo === 'header'" class="demo-toolbar">
    <q-toolbar>
      <q-btn flat round dense icon="lucide:arrow-left" />
      <span class="demo-title">Settings</span>
      <q-space />
      <q-btn flat dense label="Save" unelevated color="primary" />
    </q-toolbar>
  </div>

  <div v-else-if="demo === 'inset-shrink'" class="demo-col">
    <div class="demo-toolbar">
      <q-toolbar inset>
        <q-btn flat round dense icon="lucide:menu" />
        <span class="demo-title">Inset — extra left padding</span>
      </q-toolbar>
    </div>
    <div class="demo-toolbar demo-toolbar--fit">
      <q-toolbar shrink>
        <q-btn flat round dense icon="lucide:heart" />
        <span class="demo-title">Shrink — fits content</span>
      </q-toolbar>
    </div>
  </div>
</template>

<style scoped>
.demo-title {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}
.demo-toolbar {
  width: 100%;
  background: #f6f7f9;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 8px;
  overflow: hidden;
}
.demo-toolbar--fit {
  display: inline-flex;
  width: auto;
}
</style>
