<script setup lang="ts">
// Live demos for the Separator page (per-page styles).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "vertical" | "dark"
}>()
</script>

<template>
  <div v-if="demo === 'vertical'" class="demo-vbox">
    <span>Drafts</span>
    <q-separator vertical />
    <span>Sent</span>
    <q-separator vertical spaced />
    <span>Archive</span>
  </div>

  <div v-else-if="demo === 'dark'" class="demo-dark">
    <p class="demo-p">On a dark surface the default line is barely visible.</p>
    <q-separator dark />
    <p class="demo-p">Use dark for a light-on-dark divider.</p>
  </div>
</template>

<style scoped>
.demo-vbox {
  display: flex;
  align-items: stretch;
  gap: 8px;
  height: 44px;
}
.demo-vbox span {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #5b6472;
}
.demo-dark {
  background: #1e1e2e;
  border-radius: 8px;
  padding: 14px 16px;
}
.demo-dark .demo-p {
  color: #c9d1d9;
}
</style>
