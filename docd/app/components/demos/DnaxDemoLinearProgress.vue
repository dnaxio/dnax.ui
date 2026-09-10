<script setup lang="ts">
// Démos live de la page Linear Progress (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { onBeforeUnmount, ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "download"
}>()

// — Démo interactive : téléchargement simulé —
const download = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const startDownload = () => {
  if (timer) return
  download.value = 0
  timer = setInterval(() => {
    download.value += Math.random() * 0.12
    if (download.value >= 1) {
      download.value = 1
      if (timer) clearInterval(timer)
      timer = null
    }
  }, 180)
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div v-if="demo === 'download'" class="demo-col">
    <q-linear-progress :value="download" color="positive" size="8px" rounded />
    <p class="demo-p demo-meta">
      {{ Math.round(download * 100) }}% — press Start to simulate a download.
    </p>
    <q-btn label="Start download" color="primary" @click="startDownload" />
  </div>
</template>

<style scoped>
.demo-col {
  gap: 14px;
  max-width: 520px;
  margin: 0 auto;
  align-items: stretch;
}

.demo-meta {
  margin: 0;
  text-align: center;
  color: #8b93a1;
}
</style>
