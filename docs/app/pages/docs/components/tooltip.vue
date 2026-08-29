<script setup lang="ts">
// Tooltip — documentation du composant QTooltip : infobulle au survol/focus.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const tooltip = useComponent(() => "QTooltip")
const tooltipSource = componentSource("QTooltip")
const tag = componentTag("QTooltip")

// — Démos —
const enabled = ref(true)
const tipOpen = ref(false)

const usageBasic = `<q-btn label="Hover me" color="primary">
  <q-tooltip>Hello! I'm a tooltip.</q-tooltip>
</q-btn>

<!-- Le tooltip est un ENFANT de l'élément cible -->
<div class="target">
  Hover this text
  <q-tooltip>…and I appear here</q-tooltip>
</div>`

const usageAnchors = `<q-btn label="Top (default)" color="secondary">
  <q-tooltip>Anchored on top</q-tooltip>
</q-btn>

<q-btn label="Bottom" color="secondary">
  <q-tooltip anchor="bottom middle">Anchored on bottom</q-tooltip>
</q-btn>

<q-btn label="Left" color="secondary">
  <q-tooltip anchor="left middle">Anchored on the left</q-tooltip>
</q-btn>

<q-btn label="Right + offset" color="secondary">
  <q-tooltip anchor="right middle" :offset="[16, 0]">Pushed 16px right</q-tooltip>
</q-btn>`

const usageSideAlign = `<q-btn label="Top · start" outline>
  <q-tooltip side="top" align="start" show-arrow>Top start</q-tooltip>
</q-btn>

<q-btn label="Bottom · center" outline>
  <q-tooltip side="bottom" align="center" show-arrow>Bottom center</q-tooltip>
</q-btn>

<q-btn label="Left · end" outline>
  <q-tooltip side="left" align="end" show-arrow>Left end</q-tooltip>
</q-btn>

<q-btn label="Right · center" outline>
  <q-tooltip side="right" align="center" show-arrow>Right center</q-tooltip>
</q-btn>
<!-- Pas assez de place sur le côté demandé ? Le tooltip FLIP automatiquement. -->`

const usageDelay = `<q-btn label="Hover and wait…" color="primary">
  <q-tooltip :delay="800">I appear after 800 ms (default: 300).</q-tooltip>
</q-btn>`

const usageDisable = `<q-checkbox v-model="enabled" label="Tooltips enabled" />

<q-btn label="First" outline>
  <q-tooltip :disable="!enabled">Enabled</q-tooltip>
</q-btn>
<q-btn label="Second" outline>
  <q-tooltip :disable="!enabled">Also enabled</q-tooltip>
</q-btn>`

const usageControlled = `<q-btn label="Toggle the tooltip" color="primary" @click="tipOpen = !tipOpen">
  <q-tooltip v-model="tipOpen">Controlled by v-model (hover also opens it).</q-tooltip>
</q-btn>
<p class="demo-p demo-meta">Open: {{ tipOpen }}</p>`

const usageTypes = `<q-btn label="Positive" outline>
  <q-tooltip type="positive" show-arrow>All good!</q-tooltip>
</q-btn>

<q-btn label="Info" outline>
  <q-tooltip type="info" show-arrow icon="lucide:info">More details</q-tooltip>
</q-btn>

<q-btn label="Warning" outline>
  <q-tooltip type="warning" show-arrow icon="lucide:triangle-alert">Careful!</q-tooltip>
</q-btn>

<q-btn label="Error" outline>
  <q-tooltip type="error" show-arrow icon="lucide:circle-x">Something failed</q-tooltip>
</q-btn>

<q-btn label="Custom" outline>
  <q-tooltip color="#7c3aed" icon="lucide:sparkles" icon-position="right">Custom color, icon right</q-tooltip>
</q-btn>`

const scriptBasic = `import { ref } from "vue"

const enabled = ref(true)
const tipOpen = ref(false)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Tooltip</h1>

      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A small label that appears on <b>hover or keyboard focus</b> of its parent
      element. <b>&lt;q-tooltip&gt;</b> is placed <em>as a child</em> of the
      target, is positioned automatically (fixed) and supports sides &amp;
      alignment, an arrow, <b>auto-flip</b> when there is no room, open/close
      delays, <code>disable</code> and controlled <code>v-model</code>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        The tooltip lives inside the target element — hover it (or focus it with
        the keyboard) to reveal the tip after <code>delay</code> ms.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-row">
          <q-btn label="Hover me" color="primary">
            <q-tooltip>Hello! I'm a tooltip.</q-tooltip>
          </q-btn>
          <span class="demo-target">
            Hover this text
            <q-tooltip>…and I appear here</q-tooltip>
          </span>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Anchors ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Anchors &amp; offset</h2>
      <p class="doc-note">
        <code>anchor</code> takes an edge (<code>top</code>, <code>bottom</code>,
        <code>left</code>, <code>right</code>) plus an alignment
        (<code>middle</code>, <code>left</code>, <code>right</code> /
        <code>top</code>, <code>bottom</code>) — e.g. <code>top middle</code>.
        <code>offset</code> shifts the tip by <code>[x, y]</code> pixels.
      </p>

      <docs-demo :code="usageAnchors" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-grid">
          <q-btn label="Top (default)" color="secondary">
            <q-tooltip>Anchored on top</q-tooltip>
          </q-btn>
          <q-btn label="Bottom" color="secondary">
            <q-tooltip anchor="bottom middle">Anchored on bottom</q-tooltip>
          </q-btn>
          <q-btn label="Left" color="secondary">
            <q-tooltip anchor="left middle">Anchored on the left</q-tooltip>
          </q-btn>
          <q-btn label="Right + offset" color="secondary">
            <q-tooltip anchor="right middle" :offset="[16, 0]">Pushed 16px right</q-tooltip>
          </q-btn>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Side / align / arrow ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Side, align &amp; arrow</h2>
      <p class="doc-note">
        The modern API: <code>side</code> (top / bottom / left / right),
        <code>align</code> (start / center / end), <code>side-offset</code> and
        <code>align-offset</code>. <code>show-arrow</code> renders a small arrow
        pointing at the target. When there is not enough room on the requested
        side, the tooltip <b>flips</b> to the opposite side automatically.
      </p>

      <docs-demo :code="usageSideAlign" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-grid">
          <q-btn label="Top · start" outline>
            <q-tooltip side="top" align="start" show-arrow>Top start</q-tooltip>
          </q-btn>
          <q-btn label="Bottom · center" outline>
            <q-tooltip side="bottom" align="center" show-arrow>Bottom center</q-tooltip>
          </q-btn>
          <q-btn label="Left · end" outline>
            <q-tooltip side="left" align="end" show-arrow>Left end</q-tooltip>
          </q-btn>
          <q-btn label="Right · center" outline>
            <q-tooltip side="right" align="center" show-arrow>Right center</q-tooltip>
          </q-btn>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Delay ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Delay</h2>
      <p class="doc-note">
        <code>delay</code> waits before showing the tip (default
        <code>300</code> ms) — useful to avoid tooltips flashing while the mouse
        passes over.
      </p>

      <docs-demo :code="usageDelay" lang="html" filename="App.vue" :script="scriptBasic">
        <q-btn label="Hover and wait…" color="primary">
          <q-tooltip :delay="800">I appear after 800 ms (default: 300).</q-tooltip>
        </q-btn>
      </docs-demo>
    </section>

    <!-- ═══════ Disable & controlled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Disable &amp; v-model</h2>
      <p class="doc-note">
        <code>disable</code> turns a tooltip off (reactively). With
        <code>v-model</code>, the tooltip becomes controlled — the parent events
        still open it, so both hover and the bound value work together.
      </p>

      <docs-demo :code="usageDisable" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-col">
          <q-checkbox v-model="enabled" label="Tooltips enabled" />
          <div class="demo-row">
            <q-btn label="First" outline>
              <q-tooltip :disable="!enabled">Enabled</q-tooltip>
            </q-btn>
            <q-btn label="Second" outline>
              <q-tooltip :disable="!enabled">Also enabled</q-tooltip>
            </q-btn>
          </div>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Controlled</h3>
      <docs-demo :code="usageControlled" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-col">
          <q-btn label="Toggle the tooltip" color="primary" @click="tipOpen = !tipOpen">
            <q-tooltip v-model="tipOpen">Controlled by v-model (hover also opens it).</q-tooltip>
          </q-btn>
          <p class="demo-p demo-meta">Open: {{ tipOpen }}</p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Types & icons ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Types &amp; icons</h2>
      <p class="doc-note">
        <code>type</code> applies a semantic background
        (<code>positive</code>/<code>success</code>, <code>negative</code>/<code>error</code>,
        <code>info</code>, <code>warning</code>); <code>color</code> overrides it (token or hex)
        and <code>text-color</code> the text. <code>icon</code> renders an Iconify icon
        (<code>icon-position</code> left or right).
      </p>

      <docs-demo :code="usageTypes" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-grid">
          <q-btn label="Positive" outline>
            <q-tooltip type="positive" show-arrow>All good!</q-tooltip>
          </q-btn>
          <q-btn label="Info" outline>
            <q-tooltip type="info" show-arrow icon="lucide:info">More details</q-tooltip>
          </q-btn>
          <q-btn label="Warning" outline>
            <q-tooltip type="warning" show-arrow icon="lucide:triangle-alert">Careful!</q-tooltip>
          </q-btn>
          <q-btn label="Error" outline>
            <q-tooltip type="error" show-arrow icon="lucide:circle-x">Something failed</q-tooltip>
          </q-btn>
          <q-btn label="Custom" outline>
            <q-tooltip color="#7c3aed" icon="lucide:sparkles" icon-position="right">Custom color, icon right</q-tooltip>
          </q-btn>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QTooltip API</h2>
      <docs-api :comp="tooltip" :source="tooltipSource" />
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
.demo-p code,
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
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  max-width: 560px;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.demo-meta {
  font-size: 13px;
  color: #8b93a1;
}
.demo-target {
  padding: 8px 14px;
  border: 1px dashed rgb(0 0 0 / 0.2);
  border-radius: 8px;
  font-size: 14px;
  color: var(--foreground);
}
</style>
