<script setup lang="ts">
// Démos live de la page Board (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "dashboard"
}>()

let uid = 0
const tiles = ref([
  { id: "kpi", title: "KPI Sales", column: 0, row: 0, spanColumns: 4, spanRows: 3, color: "#dbeafe" },
  { id: "chart", title: "Revenue", column: 4, row: 0, spanColumns: 5, spanRows: 5, color: "#dcfce7" },
  { id: "table", title: "Top products", column: 0, row: 3, spanColumns: 4, spanRows: 4, color: "#fef9c3" },
  { id: "map", title: "Map", column: 9, row: 0, spanColumns: 3, spanRows: 4, color: "#fce7f3" },
  { id: "gauge", title: "Gauge", column: 9, row: 4, spanColumns: 3, spanRows: 3, color: "#ede9fe" },
])
const selected = ref<string | number>("chart")
const collision = ref(true)
const readonlyDemo = ref(false)
const boardRef = ref()
const log = ref("")
const gridLog = ref("")

const onMove = (item: any) => {
  log.value = `${item.title} → col ${item.column} · row ${item.row} · ${item.spanColumns}×${item.spanRows}`
}
const addTile = () => {
  uid++
  boardRef.value?.addItem({
    id: "tile-" + uid,
    title: "Widget " + uid,
    column: 0,
    row: 0,
    spanColumns: 3,
    spanRows: 2,
    color: "#cffafe",
  })
}
const showLayout = () => {
  gridLog.value = JSON.stringify(boardRef.value?.layout() ?? [], null, 1)
}
</script>

<template>
  <div v-if="demo === 'dashboard'">
    <div class="demo-tools">
      <button class="demo-btn" type="button" @click="addTile">+ Tile</button>
      <button class="demo-btn" type="button" @click="showLayout">layout() →</button>
      <button class="demo-btn" type="button" @click="collision = !collision">
        Collision: {{ collision ? "on" : "off" }}
      </button>
      <button class="demo-btn" type="button" @click="readonlyDemo = !readonlyDemo">
        Read-only: {{ readonlyDemo ? "on" : "off" }}
      </button>
    </div>
    <q-board
      ref="boardRef"
      v-model:items="tiles"
      v-model:selected="selected"
      :columns="12"
      :row-height="56"
      :collision="collision"
      :readonly="readonlyDemo"
      :gap="6"
      show-labels
      @drag-end="onMove"
      @resize-end="onMove"
    >
      <template #item="{ item }">
        <div class="tile" :style="{ background: item.color }">
          <strong>{{ item.title }}</strong>
          <span class="tile__pos">
            col {{ item.column }} · row {{ item.row }} · {{ item.spanColumns }}×{{ item.spanRows }}
          </span>
        </div>
      </template>
    </q-board>
    <p class="demo-p demo-log">Last tile: {{ log || "— drag or resize a tile" }}</p>
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
.tile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  height: 100%;
  padding: 8px;
  font-size: 13px;
  color: #1d1d1d;
  pointer-events: none;
}
.tile__pos {
  font-size: 11px;
  opacity: 0.7;
}
</style>
