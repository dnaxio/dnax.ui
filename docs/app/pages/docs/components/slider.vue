<script setup lang="ts">
// Slider — documentation for QSlider.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const slider = useComponent(() => "QSlider")
const sliderSource = componentSource("QSlider")
const tag = componentTag("QSlider")

// — Interactive demo state —
const val = ref(40)
const price = ref(120)
const volume = ref(60)
const locked = ref(50)
const vertical = ref(70)

const usageBasic = `<q-slider v-model="val" :min="0" :max="100" :step="5" label />`

const usageMarkers = `<q-slider v-model="price" :min="0" :max="300" :step="30"
  label label-always markers color="teal" />`

const usageColors = `<q-slider v-model="volume" :min="0" :max="100" :step="5"
  label snap color="secondary" />`

const usageStates = `<q-slider v-model="locked" label disable />
<q-slider v-model="locked" label readonly color="teal" />`

const usageVertical = `<q-slider v-model="vertical" :min="0" :max="100"
  vertical label markers color="primary" />`

// — Scripts des démos (données + refs accompagnant le template) —
const scriptBasic = `import { ref } from "vue"

const val = ref(40)`

const scriptMarkers = `import { ref } from "vue"

const price = ref(120)`

const scriptColors = `import { ref } from "vue"

const volume = ref(60)`

const scriptStates = `import { ref } from "vue"

const locked = ref(50)`

const scriptVertical = `import { ref } from "vue"

const vertical = ref(70)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Slider</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A draggable range input with pointer and keyboard support (arrows, Home/End).
      <b>&lt;q-slider&gt;</b> snaps to <code>step</code>, shows a value bubble
      (<code>label</code> / <code>label-always</code>), step <code>markers</code>,
      custom <code>color</code> / <code>track-color</code> / <code>thumb-color</code>
      and a <code>vertical</code> orientation.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-slider">
          <q-slider v-model="val" :min="0" :max="100" :step="5" label />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Steps & markers ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Steps &amp; markers</h2>
      <p class="doc-note">
        <code>markers</code> draws a dot on every step; <code>label-always</code>
        keeps the value bubble visible instead of only while dragging.
      </p>

      <docs-demo :code="usageMarkers" lang="html" filename="App.vue" :script="scriptMarkers">
        <div class="demo-slider">
          <q-slider v-model="price" :min="0" :max="300" :step="30" label label-always markers color="teal" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Colors & snap ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors &amp; snap</h2>
      <p class="doc-note">
        <code>snap</code> makes the thumb jump directly to the nearest step while
        dragging instead of rounding on release.
      </p>

      <docs-demo :code="usageColors" lang="html" filename="App.vue" :script="scriptColors">
        <div class="demo-slider">
          <q-slider v-model="volume" :min="0" :max="100" :step="5" label snap color="secondary" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ States & orientation ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Disabled, readonly &amp; vertical</h2>

      <docs-demo :code="usageStates" lang="html" filename="App.vue" :script="scriptStates">
        <div class="demo-row">
          <div class="demo-slider">
            <q-slider v-model="locked" label disable />
          </div>
          <div class="demo-slider">
            <q-slider v-model="locked" label readonly color="teal" />
          </div>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Vertical</h3>
      <docs-demo :code="usageVertical" lang="html" filename="App.vue" :script="scriptVertical">
        <div class="demo-slider-v">
          <q-slider v-model="vertical" :min="0" :max="100" vertical label markers color="primary" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="slider" :source="sliderSource" />
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
.demo-slider {
  width: 100%;
  max-width: 480px;
}
.demo-slider-v {
  width: 48px;
  height: 200px;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
}

/* espace entre les deux blocs docs-demo */
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
</style>
