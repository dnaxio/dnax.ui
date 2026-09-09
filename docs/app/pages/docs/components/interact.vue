<script setup lang="ts">
// Interact — QInteract : conteneur de widgets drag & resize (dashboards type Power BI).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const interact = useComponent(() => "QInteract")
const interactSource = componentSource("QInteract")
const tag = componentTag("QInteract")

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

const usage = `<q-interact
  v-model:items="items"
  v-model:selected="selected"
  height="440px"
  :snap="8"
  show-grid
>
  <template #item="{ item }">
    <div class="widget" :style="{ background: item.color }">
      <strong>{{ item.title }}</strong>
      <span>x{{ item.x }} · y{{ item.y }}</span>
    </div>
  </template>
</q-interact>`

const script = `import { ref } from "vue"

const items = ref([
  { id: "kpi", title: "KPI Sales", x: 16, y: 16, w: 240, h: 140 },
  { id: "chart", title: "Revenue", x: 276, y: 16, w: 300, h: 240 },
])

// events : drag-start/move/end, resize-start/move/end, select
// methods : addItem, removeItem, clear, bringToFront, toGrid(columns), realPos
// toGrid(12) → [{ x, y, column, row, spanColumns, spanRows }] pour reconstruire
// le dashboard sur d'autres écrans (Power BI-like).`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Interact</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      <b>&lt;q-interact&gt;</b> est un conteneur de <b>widgets positionnables</b> :
      chaque élément (<code>v-model:items</code>) est déplaçable à la souris /
      au doigt et <b>redimensionnable</b> (poignée bas-droite), avec
      <b>snap sur une grille</b>. Les positions <code>x / y / w / h</code> sont
      exposées et synchronisées, et <code>toGrid(columns)</code> les traduit en
      tuiles (colonne / rangée / portée) pour construire des <b>dashboards type
      Power BI</b>.
    </p>

    <section class="doc-section">
      <h2 class="doc-h2">Dashboard demo</h2>
      <p class="doc-note">
        Drag a tile (anywhere, or its top handle with <code>handle</code>),
        resize with the bottom-right grip, click to select (brings to front).
        Positions update on <code>drag-end</code> / <code>resize-end</code> and
        are written back through <code>update:items</code>.
      </p>

      <docs-demo :code="usage" lang="html" filename="App.vue" :script="script">
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
      </docs-demo>
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">Notes</h2>
      <p class="doc-note">
        Naming: <code>QInteract</code> is the generic interactive container; if
        the intent is dashboard tiles only, <code>QBoard</code> would be more
        explicit (an alias can be added). Items carry any extra payload
        (title, type, color…). A dashboard can be persisted as JSON
        (<code>toGrid()</code>) and re-created on any screen size.
        With <code>collision</code>, drag &amp; resize are blocked on occupied
        zones so items can’t overlap (<code>QBoard</code> enables it by
        default). <code>readonly</code> (ou <code>:interactive="false"</code>)
        désactive le drag &amp; masque les poignées de resize.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QInteract API</h2>
      <docs-api :comp="interact" :source="interactSource" />
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
