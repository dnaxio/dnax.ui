<script setup lang="ts">
// Col — documentation du composant QCol : la cellule de la grille.
// span / offset + variantes responsive span-sm/md/lg/xl et offset-*.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const col = useComponent(() => "QCol")
const colSource = componentSource("QCol")
const tag = componentTag("QCol")

const usageSpan = `<q-grid :cols="12" gap="12px">
  <q-col :span="12"><div class="cell">12</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
</q-grid>`

const usageAuto = `<q-grid :cols="12" gap="12px">
  <q-col><div class="cell">auto</div></q-col>
  <q-col><div class="cell">auto</div></q-col>
  <q-col :span="8"><div class="cell">span 8</div></q-col>
</q-grid>`

const usageOffset = `<q-grid :cols="12" gap="12px">
  <q-col :span="6" :offset="3"><div class="cell">span 6, offset 3</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="2" :offset="2"><div class="cell">2, offset 2</div></q-col>
</q-grid>`

const usageResponsive = `<q-grid :cols="12" gap="12px">
  <!-- mobile : empilé (12) ; md : 8 + 4 ; lg : 6 + 6 -->
  <q-col :span="12" :span-md="8" :span-lg="6"><div class="cell">Main</div></q-col>
  <q-col :span="12" :span-md="4" :span-lg="6"><div class="cell">Side</div></q-col>

  <!-- 6 cartes : 2 par ligne mobile, 3 à md, 6 à lg -->
  <q-col v-for="i in 6" :key="i" :span="6" :span-md="4" :span-lg="2">
    <div class="cell">Card {{ i }}</div>
  </q-col>
</q-grid>`

const usageAlignSelf = `<q-grid :cols="12" gap="12px" align="center" style="height: 140px">
  <q-col :span="4"><div class="cell">default (center)</div></q-col>
  <q-col :span="4" align-self="start"><div class="cell">start</div></q-col>
  <q-col :span="4" align-self="end"><div class="cell">end</div></q-col>
</q-grid>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Col</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      The grid cell. <b>&lt;q-col&gt;</b> lives inside
      <b>&lt;q-grid&gt;</b> (or <b>&lt;q-row&gt;</b>) and takes
      <code>span</code> columns out of the total (12 by default), with an optional
      <code>offset</code>. Every span/offset has a responsive variant —
      <code>-sm / -md / -lg / -xl</code> — applied at each breakpoint.
    </p>

    <!-- ═══════ Spans ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Spans</h2>
      <p class="doc-note">
        <code>span</code> is a number of columns (1–12). Spans that add up to 12
        fill a row; a cell without <code>span</code> defaults to
        <code>auto</code> (shares the free space).
      </p>

      <docs-demo :code="usageSpan" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="12px" class="demo-grid">
          <q-col :span="12"><div class="demo-cell">12</div></q-col>
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="3"><div class="demo-cell">3</div></q-col>
          <q-col :span="3"><div class="demo-cell">3</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
          <q-col :span="2"><div class="demo-cell">2</div></q-col>
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">Auto</h3>
      <p class="doc-note">
        Without <code>span</code>, the cell sizes to its content and the remaining
        space is split equally among <code>auto</code> cells.
      </p>
      <docs-demo :code="usageAuto" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="12px" class="demo-grid">
          <q-col><div class="demo-cell">auto</div></q-col>
          <q-col><div class="demo-cell">auto</div></q-col>
          <q-col :span="8"><div class="demo-cell">span 8</div></q-col>
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ Offset ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Offset</h2>
      <p class="doc-note">
        <code>offset</code> shifts the cell to the right by a number of columns —
        handy to center a block or leave an empty gutter.
      </p>

      <docs-demo :code="usageOffset" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="12px" class="demo-grid">
          <q-col :span="6" :offset="3"><div class="demo-cell">span 6, offset 3</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="2" :offset="2"><div class="demo-cell">2, offset 2</div></q-col>
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ Responsive ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Responsive spans</h2>
      <p class="doc-note">
        Mobile-first: the base <code>span</code> applies on small screens, and
        <code>span-md</code> / <code>span-lg</code> (etc.) override at each
        breakpoint. Offsets follow the same pattern
        (<code>offset-md</code>, <code>offset-lg</code>…). Resize the window to
        see the layout adapt.
      </p>

      <docs-demo :code="usageResponsive" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="12px" class="demo-grid">
          <q-col :span="12" :span-md="8" :span-lg="6"><div class="demo-cell demo-cell--accent">Main</div></q-col>
          <q-col :span="12" :span-md="4" :span-lg="6"><div class="demo-cell demo-cell--accent">Side</div></q-col>
          <q-col v-for="i in 6" :key="i" :span="6" :span-md="4" :span-lg="2">
            <div class="demo-cell">Card {{ i }}</div>
          </q-col>
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ Align-self ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Align self</h2>
      <p class="doc-note">
        <code>align-self</code> overrides the row's vertical
        <code>align</code> for a single cell (<code>start</code>,
        <code>center</code>, <code>end</code>, <code>stretch</code>).
      </p>

      <docs-demo :code="usageAlignSelf" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="12px" align="center" style="height: 140px" class="demo-grid">
          <q-col :span="4"><div class="demo-cell">default (center)</div></q-col>
          <q-col :span="4" align-self="start"><div class="demo-cell">start</div></q-col>
          <q-col :span="4" align-self="end"><div class="demo-cell">end</div></q-col>
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCol API</h2>
      <docs-api :comp="col" :source="colSource" />
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
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.docs-demo + h3 {
  margin-top: 32px;
}

.demo-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border-radius: 8px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
}
.demo-cell--accent {
  background: rgb(25 118 210 / 0.18);
}
</style>
