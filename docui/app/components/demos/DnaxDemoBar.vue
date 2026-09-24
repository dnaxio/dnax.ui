<script setup lang="ts">
// Démos live de la page Bar (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "macos" | "dark" | "props"
}>()
</script>

<template>
  <div v-if="demo === 'macos'" class="demo-bar-group">
    <q-bar class="demo-bar demo-bar--light">
      <span class="demo-dot demo-dot--red" />
      <span class="demo-dot demo-dot--yellow" />
      <span class="demo-dot demo-dot--green" />
      <span class="demo-space" />
      <b>untitled.txt</b>
    </q-bar>
    <q-bar dense class="demo-bar demo-bar--light demo-gap">
      <b>File</b> · Edit · View · Window · Help
    </q-bar>
  </div>

  <q-bar v-else-if="demo === 'dark'" dark class="demo-bar">
    <q-icon name="lucide:terminal" size="15px" />
    <b>bash — 80×24</b>
    <span class="demo-space" />
    <span class="demo-win">─</span>
    <span class="demo-win">□</span>
    <span class="demo-win demo-win--close">✕</span>
  </q-bar>

  <div v-else-if="demo === 'props'" class="demo-bar-group">
    <q-bar as="header" role="toolbar" label="App bar" class="demo-bar demo-bar--light">
      <b class="demo-title">App</b>
    </q-bar>
    <q-bar dense dark role="toolbar" label="Status bar" class="demo-bar demo-gap">
      <span>Ready</span>
      <span class="demo-space" />
      <span>Ln 1, Col 1</span>
    </q-bar>
  </div>
</template>

<style scoped>
.demo-bar-group {
  width: 100%;
}
.demo-bar {
  border-radius: 10px;
}
.demo-bar--light {
  background: #f2f3f5;
}
.demo-gap {
  margin-top: 10px;
}
.demo-space {
  flex: 1;
}
.demo-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.demo-dot--red {
  background: #ff5f57;
}
.demo-dot--yellow {
  background: #febc2e;
}
.demo-dot--green {
  background: #28c840;
}
.demo-win {
  color: #a0a5ad;
  cursor: default;
  padding: 0 2px;
}
.demo-win--close {
  color: #e0614d;
}
.demo-title {
  font-size: 13px;
}
</style>
