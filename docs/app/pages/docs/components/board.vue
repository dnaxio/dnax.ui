<script setup lang="ts">
// Board — QBoard : tableau de bord type Power BI (tuiles sur grille de fond),
// piloté à l'intérieur par QInteract (drag & resize en pixels).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const board = useComponent(() => "QBoard")
const boardSource = componentSource("QBoard")
const tag = componentTag("QBoard")

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
  boardRef.value?.addItem({ id: "tile-" + uid, title: "Widget " + uid, column: 0, row: 0, spanColumns: 3, spanRows: 2, color: "#cffafe" })
}
const showLayout = () => {
  gridLog.value = JSON.stringify(boardRef.value?.layout() ?? [], null, 1)
}

const usage = `<q-board
  v-model:items="tiles"
  v-model:selected="selected"
  :columns="12"
  :row-height="56"
  :gap="6"
  show-labels
>
  <template #item="{ item }">
    <div class="tile" :style="{ background: item.color }">
      <strong>{{ item.title }}</strong>
      <span>col {{ item.column }} · row {{ item.row }} · {{ item.spanColumns }}×{{ item.spanRows }}</span>
    </div>
  </template>
</q-board>

<!--
  • :gap="6" (default 6) spaces the tiles.
  • collision (default true) blocks drag/resize on an occupied zone:
    :collision="false" allows free stacking.
  • show-labels numbers the background grid columns/rows.
  • readonly: frozen dashboard — drag disabled, resize handles hidden.
-->`

const script = `import { ref } from "vue"

// Tiles in GRID units (Power BI-like)
const tiles = ref([
  { id: "kpi",   title: "KPI Sales", column: 0, row: 0, spanColumns: 4, spanRows: 3 },
  { id: "chart", title: "Revenue",   column: 4, row: 0, spanColumns: 5, spanRows: 5 },
])

// Drag / resize are handled INTERNALLY by QInteract (pixels), converted back
// to tiles: v-model:items receives rounded column/row/spanColumns/spanRows.
// layout() returns the current tiles (persistence / rebuild).
`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Board</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      <b>&lt;q-board&gt;</b> construit des <b>dashboards type Power BI</b> : une
      <b>grille de tuiles en arrière-plan</b> (colonnes × rangées, optionnellement
      numérotée) et, <b>à l’intérieur</b>, <b>QInteract</b> qui gère le
      <b>drag &amp; resize</b>. Les widgets sont exprimés en
      <b>unités de grille</b> (<code>column, row, spanColumns, spanRows</code>)
      — idéal pour un layout persistant, responsive et reconstituable.
    </p>

    <section class="doc-section">
      <h2 class="doc-h2">Dashboard demo</h2>
      <p class="doc-note">
        Déplacez une tuile ou redimensionnez-la (poignée bas-droite) : la grille
        de fond reste fixe et la tuile se recolle aux cellules
        (<code>column / row / spanColumns / spanRows</code>).
      </p>

      <docs-demo :code="usage" lang="html" filename="App.vue" :script="script">
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
              <span class="tile__pos">col {{ item.column }} · row {{ item.row }} · {{ item.spanColumns }}×{{ item.spanRows }}</span>
            </div>
          </template>
        </q-board>
        <p class="demo-p demo-log">Last tile: {{ log || "— drag or resize a tile" }}</p>
        <pre v-if="gridLog" class="demo-json">{{ gridLog }}</pre>
      </docs-demo>
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">Notes</h2>
      <p class="doc-note">
        <code>QBoard</code> est la couche « tableau de bord » ; il délègue le
        drag &amp; resize à <code>QInteract</code> (voir sa page). La largeur de
        cellule est <b>adaptative</b> (la grille suit la largeur du conteneur via
        ResizeObserver) ; la hauteur est automatique selon les tuiles (ou
        <code>rows</code>/<code>height</code> explicites). Un espacement
        <code>gap</code> (défaut 6) évite des tuiles collées, et
        <code>collision</code> (défaut true) bloque tout chevauchement.
        <code>readonly</code> désactive le drag &amp; masque les poignées
        (dashboard figé).
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBoard API</h2>
      <docs-api :comp="board" :source="boardSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 720px;
}
.doc-note code,
.demo-log code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
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
