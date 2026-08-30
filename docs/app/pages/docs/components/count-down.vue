<script setup lang="ts">
// Count Down — documentation du composant QCountDown : compte à rebours.
import { onBeforeUnmount, ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const countDown = useComponent(() => "QCountDown")
const countDownSource = componentSource("QCountDown")
const tag = componentTag("QCountDown")

// — Démo interactive —
const done = ref(false)
const ended = ref(false)
const target = ref(Date.now() + 15 * 60 * 1000)
const cd = ref<any>(null)

onBeforeUnmount(() => {
  cd.value?.pause()
})

const usageBasic = `<q-count-down :time="90" @end="done = true" />
<p class="demo-p demo-meta">{{ done ? 'Done!' : 'Counting down…' }}</p>`

const usageFormat = `<q-count-down :time="90061" format="DD:HH:mm:ss" />
<q-count-down :time="3661" format="mm:ss" color? class="sub" />`

const usageTarget = `<q-count-down :to="target" format="HH:mm:ss" />
<!-- Compte jusqu'à une date cible (Date, timestamp ou ISO). -->`

const usageSlot = `<q-count-down :time="30" class="block">
  <template #default="{ formatted, progress, remaining }">
    <div class="bar"><div class="bar__fill" :style="{ width: progress * 100 + '%' }" /></div>
    <span class="text">{{ formatted }} · {{ remaining }} ms left</span>
  </template>
</q-count-down>`

const usageControls = `<q-count-down ref="cd" :time="10" format="ss" @end="ended = true" />
<div class="row">
  <q-btn dense outline no-caps label="Pause" @click="cd?.pause()" />
  <q-btn dense outline no-caps label="Resume" @click="cd?.start()" />
  <q-btn dense outline no-caps label="Reset" @click="cd?.reset()" />
</div>`

const scriptBasic = `import { ref } from "vue"

const done = ref(false)`

const scriptTarget = `import { ref } from "vue"

const target = ref(Date.now() + 15 * 60 * 1000)`

const scriptSlot = `import { ref } from "vue"

const done = ref(false)`

const scriptControls = `import { ref } from "vue"

const cd = ref(null)
const ended = ref(false)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Count Down</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A countdown timer: <b>&lt;q-count-down&gt;</b> counts down from a duration
      (<code>time</code>, in seconds) or to a target date (<code>to</code>),
      formatted with <code>DD / HH / mm / ss / SSS</code> tokens. It supports
      pause/resume/reset (via <code>pause</code> or exposed methods), an
      <code>end</code> event and a raw-data slot for custom renders.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>:time="90"</code> starts automatically (default
        <code>auto-start</code>) and fires <code>@end</code> at zero.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-count-down :time="90" class="demo-time" @end="done = true" />
        <p class="demo-p demo-meta">{{ done ? "Done!" : "Counting down…" }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ Formats ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Formats</h2>
      <p class="doc-note">
        <code>format</code> accepts <code>DD</code> (days), <code>HH</code> /
        <code>mm</code> / <code>ss</code> (zero-padded) or single letters, plus
        <code>SSS</code> for milliseconds.
      </p>

      <docs-demo :code="usageFormat" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-count-down :time="90061" format="DD:HH:mm:ss" class="demo-time" />
          <q-count-down :time="3661" format="mm:ss" class="demo-time demo-time--sub" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Target date ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Target date</h2>
      <p class="doc-note">
        <code>:to</code> accepts a <code>Date</code>, a timestamp or an ISO string
        — the countdown runs until that instant.
      </p>

      <docs-demo :code="usageTarget" lang="html" filename="App.vue" :script="scriptTarget">
        <q-count-down :to="target" format="HH:mm:ss" class="demo-time" />
      </docs-demo>
    </section>

    <!-- ═══════ Custom slot ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom render</h2>
      <p class="doc-note">
        The slot exposes <code>days / hours / minutes / seconds / ms / remaining /
        progress / running / formatted</code> — build your own layout, here a
        progress bar.
      </p>

      <docs-demo :code="usageSlot" lang="html" filename="App.vue" :script="scriptSlot">
        <q-count-down :time="30" class="demo-block">
          <template #default="{ formatted, progress, remaining }">
            <div class="demo-bar">
              <div class="demo-bar__fill" :style="{ width: progress * 100 + '%' }" />
            </div>
            <span class="demo-text">{{ formatted }} · {{ remaining }} ms left</span>
          </template>
        </q-count-down>
      </docs-demo>
    </section>

    <!-- ═══════ Controls ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Controls</h2>
      <p class="doc-note">
        The instance exposes <code>start()</code>, <code>pause()</code>,
        <code>reset()</code>, <code>getRemaining()</code> and
        <code>getProgress()</code> — plus the reactive <code>pause</code> prop.
      </p>

      <docs-demo :code="usageControls" lang="html" filename="App.vue" :script="scriptControls">
        <q-count-down ref="cd" :time="10" format="ss" class="demo-time" @end="ended = true" />
        <div class="demo-row">
          <q-btn dense outline no-caps label="Pause" @click="cd?.pause()" />
          <q-btn dense outline no-caps label="Resume" @click="cd?.start()" />
          <q-btn dense outline no-caps label="Reset" @click="cd?.reset()" />
        </div>
        <p class="demo-p demo-meta">{{ ended ? "Finished!" : "—" }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCountDown API</h2>
      <docs-api :comp="countDown" :source="countDownSource" />
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

.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
.demo-time {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--foreground);
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.demo-time--sub {
  font-size: 22px;
  color: #8b93a1;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.demo-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

/* — slot custom — */
.demo-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 320px;
  margin: 0 auto;
}
.demo-bar {
  height: 8px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.08);
  overflow: hidden;
}
.demo-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #1976d2, #7c3aed);
  transition: width 0.25s linear;
}
.demo-text {
  text-align: center;
  font-size: 14px;
  color: var(--foreground);
  font-variant-numeric: tabular-nums;
}
</style>
