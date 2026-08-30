<script setup lang="ts">
// Rolling Text — documentation du composant QRollingText : compteurs à rouleaux animés.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const rollingText = useComponent(() => "QRollingText")
const rollingTextSource = componentSource("QRollingText")
const tag = componentTag("QRollingText")

// — Réfs de démos —
const basicRef = ref()
const controlRef = ref()

const usageBasic = `<q-rolling-text :start-num="0" :target-num="123" />
<q-btn flat no-caps icon="replay" label="Replay" @click="rt.reset()" />`

const usageDirection = `<q-rolling-text :start-num="0" :target-num="432" direction="up" :duration="1.5" />
<q-rolling-text :start-num="0" :target-num="432" :duration="1.5" />`

const usageStopOrder = `<q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="ltr" />
<q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="rtl" />`

const usageText = `<q-rolling-text :text-list="textList" :duration="1" :height="36" />`

const usageStyle = `<q-rolling-text
  class="my-rolling"
  :start-num="12345"
  :target-num="54321"
  :height="54"
  :duration="1.5"
/>`

const usageControl = `<q-rolling-text
  ref="rt"
  :start-num="0"
  :target-num="54321"
  :auto-start="false"
/>
<q-btn flat no-caps icon="play" label="Start" @click="rt.start()" />
<q-btn flat no-caps icon="replay" label="Reset" @click="rt.reset()" />`

const scriptBasic = `import { ref } from "vue"

const rt = ref()`

const scriptText = `const textList = [
  "aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee", "fffff", "ggggg",
]`

const scriptControl = scriptBasic
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Rolling Text</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Slot-machine style counters: <b>&lt;q-rolling-text&gt;</b> rolls each digit
      on a vertical wheel from <code>start-num</code> to <code>target-num</code>
      — <code>direction</code> up or down, a staggered <code>stop-order</code>
      cascade, any <code>height</code> and <code>duration</code>, custom
      <code>text-list</code> wheels, and exposed
      <code>start()</code> / <code>reset()</code> methods for manual control.
      Styled through the <code>--q-rolling-text-*</code> CSS variables.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Rolls from <code>0</code> to <code>123</code> on mount — hit
        <b>Replay</b> to run the animation again.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-col">
          <q-rolling-text ref="basicRef" :start-num="0" :target-num="123" />
          <q-btn flat no-caps icon="replay" label="Replay" @click="basicRef?.reset()" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Direction ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Direction</h2>
      <p class="doc-note">
        <code>direction="up"</code> counts upwards, <code>down</code> (default)
        counts downwards.
      </p>

      <docs-demo :code="usageDirection" lang="html" filename="App.vue">
        <div class="demo-row">
          <div class="demo-label">
            <code>up</code>
            <q-rolling-text :start-num="0" :target-num="432" direction="up" :duration="1.5" />
          </div>
          <div class="demo-label">
            <code>down</code>
            <q-rolling-text :start-num="0" :target-num="432" :duration="1.5" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Stop order ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Stop order</h2>
      <p class="doc-note">
        <code>stop-order="ltr"</code> stops the left-most wheel first (cascade
        from the highest digit); <code>rtl</code> starts from the units.
      </p>

      <docs-demo :code="usageStopOrder" lang="html" filename="App.vue">
        <div class="demo-row">
          <div class="demo-label">
            <code>ltr</code>
            <q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="ltr" />
          </div>
          <div class="demo-label">
            <code>rtl</code>
            <q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="rtl" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom text ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom text</h2>
      <p class="doc-note">
        <code>text-list</code> rolls non-numeric content: pass an array of
        strings with the <b>same length</b> — the wheel runs from the first
        element to the last.
      </p>

      <docs-demo :code="usageText" lang="html" filename="App.vue" :script="scriptText">
        <q-rolling-text
          :text-list="['aaaaa', 'bbbbb', 'ccccc', 'ddddd', 'eeeee', 'fffff', 'ggggg']"
          :duration="1"
          :height="36"
        />
      </docs-demo>
    </section>

    <!-- ═══════ Styling ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom style</h2>
      <p class="doc-note">
        Tune <code>height</code>, then restyle through the CSS variables:
        <code>--q-rolling-text-background</code>, <code>-color</code>,
        <code>-font-size</code>, <code>-gap</code>, <code>-item-width</code> and
        <code>-item-border-radius</code>.
      </p>

      <docs-demo :code="usageStyle" lang="html" filename="App.vue">
        <q-rolling-text
          class="demo-rolling--custom"
          :start-num="12345"
          :target-num="54321"
          :height="54"
          :duration="1.5"
        />
      </docs-demo>
    </section>

    <!-- ═══════ Manual control ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Manual control</h2>
      <p class="doc-note">
        With <code>:auto-start="false"</code> nothing happens until you call the
        exposed <code>start()</code> method; <code>reset()</code> replays the
        whole animation from <code>start-num</code>.
      </p>

      <docs-demo :code="usageControl" lang="html" filename="App.vue" :script="scriptControl">
        <div class="demo-col">
          <q-rolling-text
            ref="controlRef"
            :start-num="0"
            :target-num="54321"
            :auto-start="false"
          />
          <div class="demo-row demo-row--btns">
            <q-btn flat no-caps icon="play" label="Start" @click="controlRef?.start()" />
            <q-btn flat no-caps icon="replay" label="Reset" @click="controlRef?.reset()" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QRollingText API</h2>
      <docs-api :comp="rollingText" :source="rollingTextSource" />
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
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 42px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 0;
}
.demo-row--btns {
  gap: 10px;
}
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.demo-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.demo-label code {
  font-size: 12px;
  color: #8b93a1;
}

/* — style personnalisé : badge primary — */
.demo-rolling--custom {
  --q-rolling-text-background: var(--primary);
  --q-rolling-text-color: #fff;
  --q-rolling-text-font-size: 24px;
  --q-rolling-text-item-width: 42px;
  --q-rolling-text-gap: 5px;
  --q-rolling-text-item-border-radius: 8px;
  padding: 8px 14px;
  border-radius: 12px;
  background: rgb(25 118 210 / 0.08);
}
</style>
