<script setup lang="ts">
// Démos live de la page Interact (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "dashboard"
}>()

let uid = 0
const items = ref([
  { id: "kpi", title: "KPI Sales", x: 16, y: 16, w: 240, h: 140, color: "#dbeafe" },
  { id: "chart", title: "Revenue", x: 276, y: 16, w: 300, h: 240, color: "#dcfce7" },
  { id: "table", title: "Top products", x: 16, y: 176, w: 240, h: 240, color: "#fef9c3" },
])
const selected = ref<string | number>("kpi")
const gridDemo = ref()
const boardLog = ref("")
const gridLog = ref("")

const onItemEvent = (kind: string) => (item: any) => {
  if (kind === "drag-end" || kind === "resize-end")
    boardLog.value = `${item.title} → x:${item.x}, y:${item.y}, w:${item.w}, h:${item.h}`
}
const addTile = () => {
  uid++
  const id = "tile-" + uid
  gridDemo.value?.addItem({ id, title: "Widget " + uid, x: 30, y: 30, w: 200, h: 120, color: "#ede9fe" })
}
const removeSelected = () => {
  gridDemo.value?.removeItem(selected.value)
}
const showGrid = () => {
  gridLog.value = JSON.stringify(gridDemo.value?.toGrid(12) ?? [], null, 1)
}
</script>

<template>
  <div v-if="demo === 'dashboard'">
    <div class="demo-tools">
      <button class="demo-btn" type="button" @click="addTile">+ Tile</button>
      <button class="demo-btn" type="button" @click="removeSelected">Remove selected</button>
      <button class="demo-btn" type="button" @click="showGrid">toGrid(12) →</button>
    </div>
    <q-interact
      ref="gridDemo"
      v-model:items="items"
      v-model:selected="selected"
      height="440px"
      :snap="8"
      show-grid
      @drag-end="onItemEvent('drag-end')"
      @resize-end="onItemEvent('resize-end')"
    >
      <template #item="{ item }">
        <div class="widget" :style="{ background: item.color }">
          <strong>{{ item.title }}</strong>
          <span class="widget__pos">x{{ item.x }} · y{{ item.y }} · {{ item.w }}×{{ item.h }}</span>
        </div>
      </template>
    </q-interact>
    <p class="demo-p demo-log">Last change: {{ boardLog || "— drag or resize a tile" }}</p>
    <pre v-if="gridLog" class="demo-json">{{ gridLog }}</pre>
  </div>
</template>

<style scoped>
.demo-tools {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.demo-btn {
  padding: 5px 12px;
  border: 1px solid rgb(0 0 0 / 0.14);
  border-radius: 7px;
  background: #fff;
  color: var(--foreground);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.demo-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.demo-log {
  margin-top: 10px;
  font-size: 13px;
  color: #5b6472;
}
.demo-json {
  max-height: 200px;
  overflow: auto;
  margin: 8px 0 0;
  padding: 8px 10px;
  border: 1px dashed rgb(0 0 0 / 0.2);
  border-radius: 8px;
  background: rgb(0 0 0 / 0.03);
  font-size: 11px;
  line-height: 1.45;
}
.widget {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  height: 100%;
  padding: 10px;
  font-size: 13px;
  color: #1d1d1d;
  pointer-events: none;
}
.widget__pos {
  font-size: 11px;
  opacity: 0.75;
}
</style>
