<script setup lang="ts">
// Grid — documentation de la famille : QGrid (conteneur responsive + mode
// cellules Vant) et QGridItem (cellule icône + texte). QCol (cellule du layout)
// et QRow (alias sémantique) ont leurs propres pages.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const grid = useComponent(() => "QGrid")
const gridSource = componentSource("QGrid")
const gridItem = useComponent(() => "QGridItem")
const gridItemSource = componentSource("QGridItem")
const tag = componentTag("QGrid")

// — Démos layout (QCol) —
const usageBasic = `<q-grid :cols="12" gap="16px">
  <q-col :span="12"><div class="cell">12</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
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

const usageColsResponsive = `<q-grid :cols="12" :cols-md="6" :cols-lg="4" gap="12px">
  <q-col v-for="i in 6" :key="i"><div class="cell">Item {{ i }}</div></q-col>
</q-grid>
<!-- 6 items : 6 par ligne mobile, 3 à md, 2 à lg (cols change le total) -->`

// — Démos cellules (QGridItem) —
const usageCells = `<q-grid :column-num="4" gutter="8" border clickable>
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
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Grid</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Two grids in one family: a responsive <b>&lt;q-grid&gt;</b> with
      <b>&lt;q-col&gt;</b> spans (12-track layout, configurable breakpoints), and a
      <b>Vant-style cell grid</b> — <code>:column-num</code> switches the container
      to equal cells filled by <b>&lt;q-grid-item&gt;</b> (icon + text, badges,
      links). See also the <a class="doc-link" href="/docs/components/col">QCol</a>
      page for the layout cell and
      <a class="doc-link" href="/docs/components/row">QRow</a> for the semantic alias.
    </p>

    <!-- ═══════ Layout grid ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Layout grid</h2>
      <p class="doc-note">
        Spans that add up to 12 fill a row; <code>gap</code> accepts any CSS value.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-grid :cols="12" gap="16px" class="demo-grid">
          <q-col :span="12"><div class="demo-cell">12</div></q-col>
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="6"><div class="demo-cell">6</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
          <q-col :span="4"><div class="demo-cell">4</div></q-col>
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">Responsive</h3>
      <p class="doc-note">
        Mobile-first: the base <code>span</code> applies on small screens, and
        <code>-sm / -md / -lg / -xl</code> variants override at each breakpoint.
        Resize the window to see the layout adapt.
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

      <h3 class="doc-h3">Responsive column count</h3>
      <p class="doc-note">
        <code>cols-md / -lg / -xl</code> change the <em>total</em> number of
        columns at a breakpoint — combined with plain cells (no span), items flow
        into fewer/more per row automatically.
      </p>
      <docs-demo :code="usageColsResponsive" lang="html" filename="App.vue">
        <q-grid :cols="12" :cols-md="6" :cols-lg="4" gap="12px" class="demo-grid">
          <q-col v-for="i in 6" :key="i"><div class="demo-cell">Item {{ i }}</div></q-col>
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">Configurable breakpoints</h3>
      <p class="doc-note">
        The breakpoints are CSS variables with defaults — override them anywhere
        (your CSS, <code>:root</code>, a scoped scope) to change the whole grid:
      </p>
      <q-syntax
        :code="`:root {\n  --q-grid-bp-sm: 640px;\n  --q-grid-bp-md: 1024px;\n  --q-grid-bp-lg: 1366px;\n  --q-grid-bp-xl: 1920px;\n}`"
        lang="css"
        filename="App.vue"
        copy
      />
    </section>

    <!-- ═══════ Cell grid ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Cell grid (Vant-style)</h2>
      <p class="doc-note">
        Passing <code>column-num</code> switches QGrid to the <b>cell mode</b>: the
        <code>gutter</code>, <code>border</code>, <code>square</code>,
        <code>center</code> and <code>clickable</code> options are applied to the
        <b>&lt;q-grid-item&gt;</b> children — icon + text, numeric <code>badge</code>
        or notification <code>dot</code>, optional <code>href</code> link.
      </p>

      <docs-demo :code="usageCells" lang="html" filename="App.vue">
        <q-grid :column-num="4" gutter="8" border clickable class="demo-grid">
          <q-grid-item icon="lucide:image" text="Photos" badge="3" />
          <q-grid-item icon="lucide:video" text="Videos" />
          <q-grid-item icon="lucide:music" text="Music" dot />
          <q-grid-item icon="lucide:settings" text="Settings" />
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">Partial last row</h3>
      <p class="doc-note">
        The grid wraps automatically — a <b>last partial row</b> is fine: with
        6 items on 4 columns, the second row keeps only 2 cells and the borders
        still close the frame.
      </p>
      <docs-demo :code="usageSix" lang="html" filename="App.vue">
        <q-grid :column-num="4" gutter="8" border clickable class="demo-grid">
          <q-grid-item icon="lucide:image" text="Photos" />
          <q-grid-item icon="lucide:video" text="Videos" />
          <q-grid-item icon="lucide:music" text="Music" />
          <q-grid-item icon="lucide:map" text="Maps" />
          <q-grid-item icon="lucide:book" text="Books" />
          <q-grid-item icon="lucide:settings" text="Settings" />
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">Square cells</h3>
      <p class="doc-note">
        <code>square</code> forces a 1:1 aspect ratio per cell — a classic icon
        launcher look.
      </p>
      <docs-demo :code="usageSquare" lang="html" filename="App.vue">
        <q-grid :column-num="3" gutter="10" square border clickable class="demo-grid">
          <q-grid-item icon="lucide:camera" text="Camera" />
          <q-grid-item icon="lucide:map" text="Maps" />
          <q-grid-item icon="lucide:book" text="Books" badge="12" />
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">Horizontal items</h3>
      <p class="doc-note">
        <code>direction="horizontal"</code> puts the icon beside the text instead
        of above it; <code>reverse</code> swaps icon/text order.
      </p>
      <docs-demo :code="usageHorizontal" lang="html" filename="App.vue">
        <q-grid :column-num="2" gutter="10" border clickable direction="horizontal" class="demo-grid">
          <q-grid-item icon="lucide:phone" text="Call" />
          <q-grid-item icon="lucide:mail" text="Email" />
        </q-grid>
      </docs-demo>

      <h3 class="doc-h3">Links, colors &amp; slots</h3>
      <p class="doc-note">
        <code>href</code> renders the cell as a link, <code>icon-color</code>
        overrides the grid-wide color, <code>disable</code> greys it out, and the
        <code>#icon</code> / <code>#default</code> slots replace icon and text.
      </p>
      <docs-demo :code="usageCustom" lang="html" filename="App.vue">
        <q-grid :column-num="4" gutter="8" border clickable class="demo-grid">
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
      <h2 class="doc-h2">QGrid API</h2>
      <docs-api :comp="grid" :source="gridSource" />
    </section>

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
.doc-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}
.doc-link:hover {
  text-decoration: underline;
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
