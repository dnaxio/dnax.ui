<script setup lang="ts">
// Démos live de la page directive v-close (état par page).
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic"
}>()

const openDialog = ref(false)
const openSheet = ref(false)
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-close">
    <div class="guide-row">
      <q-btn no-caps color="primary" label="Open dialog" @click="openDialog = true" />
      <q-btn no-caps color="secondary" label="Open bottom sheet" @click="openSheet = true" />
    </div>

    <q-dialog v-model="openDialog">
      <q-dialog-header title="Delete file?" description="v-close closes this dialog from anywhere inside it." />
      <div class="demo-body">
        <p class="demo-p">
          Both buttons live inside the dialog. The flat one is disabled through
          <code>v-close="false"</code> — clicking it keeps the dialog open.
        </p>
        <div class="guide-row">
          <q-btn color="negative" label="Close (v-close)" v-close />
          <q-btn flat label="Stays open (v-close=false)" v-close="false" />
        </div>
      </div>
    </q-dialog>

    <q-bottom-sheet v-model="openSheet">
      <q-bottom-sheet-header title="Sheet actions" description="v-close works the same inside a bottom sheet" />
      <div class="demo-body">
        <div class="guide-row">
          <q-btn color="primary" label="Close sheet (v-close)" v-close />
        </div>
      </div>
    </q-bottom-sheet>
  </div>
</template>

<style scoped>
.guide-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.demo-body {
  padding: 4px 0;
}
.demo-body .demo-p {
  margin: 0 0 14px;
  text-align: center;
}
</style>
