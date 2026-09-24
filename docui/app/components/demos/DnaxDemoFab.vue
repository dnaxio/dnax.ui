<script setup lang="ts">
// Démos live de la page Fab (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "positions" | "colors" | "actions"
}>()

const openBasic = ref(false)
const openPositions = ref(false)
const openLeft = ref(false)
const openColors = ref(false)
const openActions = ref(false)
const lastAction = ref("")
</script>

<template>
  <template v-if="demo === 'basic'">
    <div class="demo-fab-stage">
      <q-fab v-model="openBasic" color="primary">
        <q-fab-action label="Share" icon="lucide:share-2" color="secondary" @click="lastAction = 'Share'" />
        <q-fab-action label="Camera" icon="lucide:camera" color="positive" @click="lastAction = 'Camera'" />
        <q-fab-action label="Mail" icon="lucide:mail" @click="lastAction = 'Mail'" />
      </q-fab>
      <span class="demo-fab-stage__hint">Click the + button</span>
    </div>
    <p class="demo-p demo-p--value">Last action: <code>{{ lastAction || "—" }}</code></p>
  </template>

  <div v-else-if="demo === 'positions'" class="demo-fab-row">
    <div class="demo-fab-stage">
      <q-fab v-model="openLeft" position="bottom-left" />
      <span class="demo-fab-stage__hint">bottom-left</span>
    </div>
    <div class="demo-fab-stage">
      <q-fab v-model="openPositions" position="top-right" />
      <span class="demo-fab-stage__hint">top-right</span>
    </div>
  </div>

  <div v-else-if="demo === 'colors'" class="demo-fab-stage">
    <q-fab v-model="openColors" color="negative" icon="lucide:message-circle">
      <q-fab-action label="New message" icon="lucide:message-square-plus" />
      <q-fab-action label="Voice note" icon="lucide:mic" color="positive" />
    </q-fab>
    <span class="demo-fab-stage__hint">Custom icon &amp; color</span>
  </div>

  <template v-else-if="demo === 'actions'">
    <div class="demo-fab-stage">
      <q-fab v-model="openActions">
        <q-fab-action label="Edit" icon="lucide:pencil" @click="lastAction = 'Edit'" />
        <q-fab-action label="Archive" icon="lucide:archive" color="warning" @click="lastAction = 'Archive'" />
        <q-fab-action label="Delete" icon="lucide:trash-2" color="negative" disable />
      </q-fab>
      <span class="demo-fab-stage__hint">One action is disabled</span>
    </div>
    <p class="demo-p demo-p--value">Last action: <code>{{ lastAction || "—" }}</code></p>
  </template>
</template>

<style scoped>
/* — Scène de démo : le FAB est fixed à l'écran → on l'absolutise dans un cadre — */
.demo-fab-stage {
  position: relative;
  height: 260px;
  border-radius: 12px;
  border: 1px solid rgb(0 0 0 / 0.08);
  background: linear-gradient(160deg, #eef4ff, #f6f1ff);
  overflow: hidden;
}
.demo-fab-stage :deep(.q-fab) {
  position: absolute;
}
.demo-fab-stage__hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #8b93a1;
  pointer-events: none;
}
.demo-fab-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.demo-fab-row .demo-fab-stage {
  flex: 1 1 240px;
}
.demo-p--value {
  margin: 12px 0 0;
  text-align: center;
  font-size: 14px;
  color: #5b6472;
}
</style>
