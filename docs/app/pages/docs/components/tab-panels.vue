<script setup lang="ts">
// Tab Panels — documentation du composant QTabPanels (simple) :
// les panneaux animés couplés à QTabs.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const tabPanels = useComponent(() => "QTabPanels")
const tabPanelsSource = componentSource("QTabPanels")
const tag = componentTag("QTabPanels")

// — Démo interactive —
const tab = ref("one")
const tabAnim = ref("a")
const animation = ref<"fade" | "slide-right" | "slide-left" | "slide-up" | "slide-down">("fade")
const animationOptions = [
  { label: "Fade", value: "fade" },
  { label: "Slide right", value: "slide-right" },
  { label: "Slide left", value: "slide-left" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide down", value: "slide-down" },
]

const usageBasic = `<q-tabs v-model="tab" align="left" no-caps active-color="primary" indicator-color="primary" class="demo-panels-tabs">
  <q-tab name="one" label="One" />
  <q-tab name="two" label="Two" />
  <q-tab name="three" label="Three" />
</q-tabs>

<q-tab-panels v-model="tab" animated class="demo-panels">
  <q-tab-panel name="one">
    <p class="demo-p">Panel “One” — fades in when selected.</p>
  </q-tab-panel>
  <q-tab-panel name="two">
    <p class="demo-p">Panel “Two” — shares the v-model with the tabs.</p>
  </q-tab-panel>
  <q-tab-panel name="three">
    <p class="demo-p">Panel “Three” — visibility is driven by v-show.</p>
  </q-tab-panel>
</q-tab-panels>`

const usageAnimations = `<q-select
  v-model="animation"
  :options="animationOptions"
  emit-value
  outlined
  dense
  label="Animation"
  class="demo-panels-select"
/>

<q-tabs v-model="tabAnim" align="left" no-caps dense active-color="primary" indicator-color="primary">
  <q-tab name="a" label="A" />
  <q-tab name="b" label="B" />
  <q-tab name="c" label="C" />
</q-tabs>

<q-tab-panels v-model="tabAnim" animated :animation="animation" swipeable class="demo-panels">
  <q-tab-panel name="a">
    <p class="demo-p">Panel A</p>
  </q-tab-panel>
  <q-tab-panel name="b">
    <p class="demo-p">Panel B</p>
  </q-tab-panel>
  <q-tab-panel name="c">
    <p class="demo-p">Panel C</p>
  </q-tab-panel>
</q-tab-panels>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Tab Panels</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Switches between panels driven by a shared <code>v-model</code>, with an
      optional transition. Pairs with <b>&lt;q-tabs&gt;</b> (same value) and
      renders <b>&lt;q-tab-panel&gt;</b> children — the panel itself is documented
      on its own page. Panels stay mounted (<code>v-show</code>) so switching is
      reliable and state is preserved.
    </p>

    <!-- ═══════ QTabPanels ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QTabPanels — the animated panels</h2>
      <p class="doc-note">
        Only the panel whose <code>name</code> matches the <code>v-model</code> is
        visible. <code>animated</code> enables the entry transition and
        <code>animation</code> picks its direction —
        <code>fade</code> (default), <code>slide-right</code>,
        <code>slide-left</code>, <code>slide-up</code> or <code>slide-down</code>.
        <code>swipeable</code> lets touch users flip panels horizontally.
      </p>

      <h3 class="doc-h3">Coupled with tabs</h3>
      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-tabs
          v-model="tab"
          align="left"
          no-caps
          active-color="primary"
          indicator-color="primary"
          class="demo-panels-tabs"
        >
          <q-tab name="one" label="One" />
          <q-tab name="two" label="Two" />
          <q-tab name="three" label="Three" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="demo-panels">
          <q-tab-panel name="one">
            <p class="demo-p">Panel “One” — fades in when selected.</p>
          </q-tab-panel>
          <q-tab-panel name="two">
            <p class="demo-p">Panel “Two” — shares the v-model with the tabs.</p>
          </q-tab-panel>
          <q-tab-panel name="three">
            <p class="demo-p">Panel “Three” — visibility is driven by v-show.</p>
          </q-tab-panel>
        </q-tab-panels>
      </docs-demo>

      <h3 class="doc-h3">Animation directions</h3>
      <docs-demo :code="usageAnimations" lang="html" filename="App.vue">
        <q-select
          v-model="animation"
          :options="animationOptions"
          emit-value
          outlined
          dense
          label="Animation"
          class="demo-panels-select"
        />

        <q-tabs
          v-model="tabAnim"
          align="left"
          no-caps
          dense
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="a" label="A" />
          <q-tab name="b" label="B" />
          <q-tab name="c" label="C" />
        </q-tabs>

        <q-tab-panels v-model="tabAnim" animated :animation="animation" swipeable class="demo-panels">
          <q-tab-panel name="a">
            <p class="demo-p">Panel A</p>
          </q-tab-panel>
          <q-tab-panel name="b">
            <p class="demo-p">Panel B</p>
          </q-tab-panel>
          <q-tab-panel name="c">
            <p class="demo-p">Panel C</p>
          </q-tab-panel>
        </q-tab-panels>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="tabPanels" :source="tabPanelsSource" />
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

/* espace entre les blocs docs-demo */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}

/* — styles des démos — */
.demo-panels-tabs {
  margin-bottom: 12px;
}
.demo-panels-select {
  max-width: 240px;
  margin-bottom: 12px;
}
.demo-panels :deep(.q-tab-panel) {
  padding: 16px;
  background: #fafbfc;
  border: 1px solid rgb(0 0 0 / 0.08);
}
</style>
