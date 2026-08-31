<script setup lang="ts">
// Grid Item — documentation du composant QGridItem : cellule de la grille Vant-style.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const gridItem = useComponent(() => "QGridItem")
const gridItemSource = componentSource("QGridItem")
const tag = componentTag("QGridItem")

const usageBasic = `<q-grid :column-num="4" gutter="8" border clickable>
  <q-grid-item icon="lucide:image" text="Photos" badge="3" />
  <q-grid-item icon="lucide:video" text="Videos" />
  <q-grid-item icon="lucide:music" text="Music" dot />
  <q-grid-item icon="lucide:settings" text="Settings" />
</q-grid>`

const usageSix = `<q-grid :column-num="4" gutter="8" border clickable>
  <q-grid-item icon="lucide:image" text="Photos" />
  <q-grid-item icon="lucide:video" text="Videos" />
  <q-grid-item icon="lucide:music" text="Music" />
  <q-grid-item icon="lucide:map" text="Maps" />
  <q-grid-item icon="lucide:book" text="Books" />
  <q-grid-item icon="lucide:settings" text="Settings" />
</q-grid>`

const usageSquare = `<q-grid :column-num="3" gutter="10" square border clickable>
  <q-grid-item icon="lucide:camera" text="Camera" />
  <q-grid-item icon="lucide:map" text="Maps" />
  <q-grid-item icon="lucide:book" text="Books" badge="12" />
</q-grid>`

const usageHorizontal = `<q-grid :column-num="2" gutter="10" border clickable direction="horizontal">
  <q-grid-item icon="lucide:phone" text="Call" />
  <q-grid-item icon="lucide:mail" text="Email" />
</q-grid>`

const usageCustom = `<q-grid :column-num="4" gutter="8" border clickable>
  <q-grid-item href="/docs" icon="lucide:book-open" text="Docs" />
  <q-grid-item
    icon="lucide:heart"
    text="Favorites"
    icon-color="#e91e63"
    badge="99+"
  />
  <q-grid-item disable icon="lucide:lock" text="Locked" />
  <q-grid-item>
    <template #icon>
      <q-spinner size="24px" color="primary" />
    </template>
    <template #default>Loading</template>
  </q-grid-item>
</q-grid>`

const scriptBasic = `import { ref } from "vue"

const active = ref("")`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Grid Item</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A Vant-style grid cell: <b>&lt;q-grid-item&gt;</b> lives inside a
      <b>&lt;q-grid :column-num="…"&gt;</b> and renders an <code>icon</code> + a
      <code>text</code> (or custom slots), with an optional <code>badge</code>,
      notification <code>dot</code>, <code>href</code> link, disabled state and
      color per icon. The grid handles columns, gutters, borders and the clickable
      effect — see the <a class="doc-link" href="/docs/components/grid">Grid</a>
      page for the layout grid (<code>QCol</code>).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        A 4-column app menu: icons, texts, a numeric <code>badge</code> and a
        notification <code>dot</code>. <code>border</code> draws the cell
        separators and <code>clickable</code> adds the press effect.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-grid :column-num="4" gutter="8" border clickable>
          <q-grid-item icon="lucide:image" text="Photos" badge="3" />
          <q-grid-item icon="lucide:video" text="Videos" />
          <q-grid-item icon="lucide:music" text="Music" dot />
          <q-grid-item icon="lucide:settings" text="Settings" />
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">6 items in a 4-column grid</h3>
      <p class="doc-note">
        The grid wraps automatically — a <b>last partial row</b> is fine: with
        6 items on 4 columns, the second row keeps only 2 cells and the borders
        still close the frame (Vant-style).
      </p>
      <docs-demo :code="usageSix" lang="html" filename="App.vue" :script="scriptBasic">
        <q-grid :column-num="4" gutter="8" border clickable>
          <q-grid-item icon="lucide:image" text="Photos" />
          <q-grid-item icon="lucide:video" text="Videos" />
          <q-grid-item icon="lucide:music" text="Music" />
          <q-grid-item icon="lucide:map" text="Maps" />
          <q-grid-item icon="lucide:book" text="Books" />
          <q-grid-item icon="lucide:settings" text="Settings" />
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ Square ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Square cells</h2>
      <p class="doc-note">
        <code>square</code> forces a 1:1 aspect ratio per cell — a classic icon
        launcher look.
      </p>

      <docs-demo :code="usageSquare" lang="html" filename="App.vue" :script="scriptBasic">
        <q-grid :column-num="3" gutter="10" square border clickable>
          <q-grid-item icon="lucide:camera" text="Camera" />
          <q-grid-item icon="lucide:map" text="Maps" />
          <q-grid-item icon="lucide:book" text="Books" badge="12" />
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ Horizontal ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Horizontal items</h2>
      <p class="doc-note">
        <code>direction="horizontal"</code> puts the icon beside the text instead
        of above it; <code>reverse</code> swaps icon/text order.
      </p>

      <docs-demo :code="usageHorizontal" lang="html" filename="App.vue" :script="scriptBasic">
        <q-grid :column-num="2" gutter="10" border clickable direction="horizontal">
          <q-grid-item icon="lucide:phone" text="Call" />
          <q-grid-item icon="lucide:mail" text="Email" />
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ Custom ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Links, colors &amp; slots</h2>
      <p class="doc-note">
        <code>href</code> renders the cell as a link, <code>icon-color</code>
        overrides the grid-wide color, <code>disable</code> greys it out, and the
        <code>#icon</code> / <code>#default</code> slots replace icon and text.
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptBasic">
        <q-grid :column-num="4" gutter="8" border clickable>
          <q-grid-item href="/docs" icon="lucide:book-open" text="Docs" />
          <q-grid-item
            icon="lucide:heart"
            text="Favorites"
            icon-color="#e91e63"
            badge="99+"
          />
          <q-grid-item disable icon="lucide:lock" text="Locked" />
          <q-grid-item>
            <template #icon>
              <q-spinner size="24px" color="primary" />
            </template>
            <template #default>Loading</template>
          </q-grid-item>
        </q-grid>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QGridItem API</h2>
      <docs-api :comp="gridItem" :source="gridItemSource" />
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
.doc-link {
  color: var(--primary);
  text-decoration: none;
}
.doc-link:hover {
  text-decoration: underline;
}
</style>
