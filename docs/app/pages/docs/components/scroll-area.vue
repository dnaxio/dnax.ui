<script setup lang="ts">
// Scroll Area — documentation du composant QScrollArea : zone scrollable
// avec barre de défilement personnalisée (native masquée, thumb draggable).
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const scrollArea = useComponent(() => "QScrollArea")
const scrollAreaSource = componentSource("QScrollArea")
const tag = componentTag("QScrollArea")

const usageBasic = `<q-scroll-area style="height: 240px">
  <div v-for="i in 30" :key="i" class="log">
    Log entry {{ i }} — scrolling hides the native bar and shows a custom thumb.
  </div>
</q-scroll-area>
<!-- La barre custom apparaît au scroll et se masque après delay (350 ms). -->`

const usageVisible = `<q-scroll-area style="height: 200px" visible>
  <div v-for="i in 20" :key="i" class="row">{{ i }}. Visible scrollbar — no need to scroll to see it.</div>
</q-scroll-area>`

const usageCustom = `<q-scroll-area
  style="height: 200px"
  bar-style="width: 10px; right: 4px"
  thumb-style="background: #1976d2; border-radius: 5px; opacity: 0.9"
>
  <div v-for="i in 20" :key="i" class="row">Custom thumb — {{ i }}.</div>
</q-scroll-area>`

const usagePadding = `<q-scroll-area
  style="height: 220px"
  content-style="padding: 16px 20px"
>
  <p v-for="i in 6" :key="i" class="paragraph">
    Paragraph {{ i }} — the padding is applied to the scrolling content
    (content-style / content-class), so the thumb reflects the full scrollable area.
  </p>
</q-scroll-area>`

const usageChat = `<q-scroll-area style="height: 260px">
  <div v-for="m in 14" :key="m" class="msg" :class="{ 'msg--me': m % 2 === 0 }">
    <div class="msg__bubble">{{ m % 2 === 0 ? 'You' : 'Ada' }} — message {{ m }}: a scrollable chat-like list.</div>
  </div>
</q-scroll-area>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Scroll Area</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A scrollable region with a custom scrollbar: the native one is hidden and a
      slim, <b>draggable thumb</b> appears on scroll. <b>&lt;q-scroll-area&gt;</b>
      takes a constrained <code>height</code> (any CSS value) and exposes
      <code>visible</code>, <code>delay</code> and per-part styles
      (<code>bar-style</code>, <code>thumb-style</code>,
      <code>content-style</code>).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        The content scrolls natively, the custom thumb appears while scrolling and
        fades out after <code>delay</code> ms. Scroll with the wheel, drag the
        thumb, or use the keyboard.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-scroll-area style="height: 240px">
          <div v-for="i in 30" :key="i" class="demo-log">
            Log entry {{ i }} — scrolling hides the native bar and shows a custom thumb.
          </div>
        </q-scroll-area>
      </docs-demo>
    </section>

    <!-- ═══════ Visible ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Always visible</h2>
      <p class="doc-note">
        <code>visible</code> keeps the bar on screen at all times (no auto-hide) —
        useful when the scrollable region isn't obvious.
      </p>

      <docs-demo :code="usageVisible" lang="html" filename="App.vue">
        <q-scroll-area style="height: 200px" visible>
          <div v-for="i in 20" :key="i" class="demo-row">
            {{ i }}. Visible scrollbar — no need to scroll to see it.
          </div>
        </q-scroll-area>
      </docs-demo>
    </section>

    <!-- ═══════ Custom thumb ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom styling</h2>
      <p class="doc-note">
        <code>bar-style</code> / <code>bar-class</code> style the track,
        <code>thumb-style</code> / <code>thumb-class</code> the thumb — width,
        color, radius, anything.
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue">
        <q-scroll-area
          style="height: 200px"
          bar-style="width: 10px; right: 4px"
          thumb-style="background: #1976d2; border-radius: 5px; opacity: 0.9"
        >
          <div v-for="i in 20" :key="i" class="demo-row">Custom thumb — {{ i }}.</div>
        </q-scroll-area>
      </docs-demo>
    </section>

    <!-- ═══════ Content padding ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Content padding</h2>
      <p class="doc-note">
        <code>content-style</code> / <code>content-class</code> style the
        scrollable content itself — padding included in the scrollable area.
      </p>

      <docs-demo :code="usagePadding" lang="html" filename="App.vue">
        <q-scroll-area style="height: 220px" content-style="padding: 16px 20px">
          <p v-for="i in 6" :key="i" class="demo-paragraph">
            Paragraph {{ i }} — the padding is applied to the scrolling content
            (content-style / content-class), so the thumb reflects the full
            scrollable area.
          </p>
        </q-scroll-area>
      </docs-demo>
    </section>

    <!-- ═══════ Chat-like ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Chat-like list</h2>
      <p class="doc-note">
        A realistic use: a message list with alternating bubbles — the custom
        scrollbar keeps the UI clean.
      </p>

      <docs-demo :code="usageChat" lang="html" filename="App.vue">
        <q-scroll-area style="height: 260px">
          <div v-for="m in 14" :key="m" class="demo-msg" :class="{ 'demo-msg--me': m % 2 === 0 }">
            <div class="demo-msg__bubble">
              {{ m % 2 === 0 ? "You" : "Ada" }} — message {{ m }}: a scrollable
              chat-like list.
            </div>
          </div>
        </q-scroll-area>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QScrollArea API</h2>
      <docs-api :comp="scrollArea" :source="scrollAreaSource" />
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

.demo-log {
  padding: 8px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12.5px;
  color: #4b5563;
}
.demo-log:nth-child(odd) {
  background: rgb(0 0 0 / 0.02);
}
.demo-row {
  padding: 10px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-size: 14px;
  color: var(--foreground);
}
.demo-paragraph {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-paragraph:last-child {
  margin-bottom: 0;
}

/* — chat — */
.demo-msg {
  display: flex;
  padding: 4px 14px;
}
.demo-msg--me {
  justify-content: flex-end;
}
.demo-msg__bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px 12px 12px 4px;
  background: rgb(0 0 0 / 0.06);
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--foreground);
}
.demo-msg--me .demo-msg__bubble {
  border-radius: 12px 12px 4px 12px;
  background: rgb(25 118 210 / 0.12);
  color: var(--primary);
}
</style>
