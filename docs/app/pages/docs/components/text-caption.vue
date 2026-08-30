<script setup lang="ts">
// Text Caption — documentation du composant QTextCaption : légende superposée aux images.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const textCaption = useComponent(() => "QTextCaption")
const textCaptionSource = componentSource("QTextCaption")
const tag = componentTag("QTextCaption")

const IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"

const usageBasic = `<div class="stage">
  <img :src="IMG" class="img" alt="Mountain landscape" />
  <q-text-caption absolute title="Alpine sunrise" subtitle="Golden light over the peaks" />
</div>`

const usageBreathing = `<div class="stage">
  <img :src="IMG" class="img" alt="Mountain landscape" />
  <q-text-caption absolute breathing title="Alpine sunrise" subtitle="Golden light over the peaks" />
</div>`

const usageGenerate = `<div class="stage">
  <img :src="IMG" class="img" alt="Mountain landscape" />
  <q-text-caption absolute generate title="Alpine sunrise" subtitle="Golden light over the peaks" />
</div>`

const usageHighlight = `<div class="stage">
  <img :src="IMG" class="img" alt="Mountain landscape" />
  <q-text-caption absolute highlight="sunrise" title="Alpine sunrise" subtitle="Golden light over the peaks" />
</div>`

const usagePositions = `<div class="row">
  <div class="stage stage--sm">
    <img :src="IMG" class="img" alt="Position top" />
    <q-text-caption absolute position="top" title="Top" />
  </div>
  <div class="stage stage--sm">
    <img :src="IMG" class="img" alt="Position left" />
    <q-text-caption absolute position="left" title="Left" />
  </div>
</div>`

const scriptBasic = `const IMG = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Text Caption</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A caption overlaid on an image (or any positioned container):
      <b>&lt;q-text-caption&gt;</b> anchors a bold <code>title</code> and a
      <code>subtitle</code> to any edge (<code>position</code>), with a dark
      gradient by default (<code>gradient</code>), an <code>absolute</code>
      anchor, and optional <code>breathing</code>, <code>generate</code> or
      <code>highlight</code> text animations.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>absolute</code> pins the caption to the bottom of the image over a
        dark gradient.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-stage">
          <img :src="IMG" class="demo-img" alt="Mountain landscape" />
          <q-text-caption absolute title="Alpine sunrise" subtitle="Golden light over the peaks" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Breathing ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Breathing</h2>
      <p class="doc-note">
        <code>breathing</code> makes the title and subtitle words fade in a
        gentle cascade loop — tune it with
        <code>--q-breathe-duration</code>; respects
        <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageBreathing" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-stage">
          <img :src="IMG" class="demo-img" alt="Mountain landscape" />
          <q-text-caption absolute breathing title="Alpine sunrise" subtitle="Golden light over the peaks" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Generate ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Generate</h2>
      <p class="doc-note">
        <code>generate</code> reveals the title and subtitle word by word
        (blur + fade + rise) — Inspira text-generate style.
      </p>

      <docs-demo :code="usageGenerate" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-stage">
          <img :src="IMG" class="demo-img" alt="Mountain landscape" />
          <q-text-caption
            absolute
            generate
            title="Alpine sunrise"
            subtitle="Golden light over the peaks"
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Highlight ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Highlight</h2>
      <p class="doc-note">
        <code>highlight</code> draws a marker over a substring of the title
        (Inspira highlight-text style) — tune the color with
        <code>--q-highlight-color</code>.
      </p>

      <docs-demo :code="usageHighlight" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-stage">
          <img :src="IMG" class="demo-img" alt="Mountain landscape" />
          <q-text-caption
            absolute
            highlight="sunrise"
            title="Alpine sunrise"
            subtitle="Golden light over the peaks"
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Positions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Positions</h2>
      <p class="doc-note">
        <code>position</code> moves the caption to <code>top</code>,
        <code>left</code> or <code>right</code> (default
        <code>bottom</code>).
      </p>

      <docs-demo :code="usagePositions" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-row">
          <div class="demo-stage demo-stage--sm">
            <img :src="IMG" class="demo-img" alt="Position top" />
            <q-text-caption absolute position="top" title="Top" />
          </div>
          <div class="demo-stage demo-stage--sm">
            <img :src="IMG" class="demo-img" alt="Position left" />
            <q-text-caption absolute position="left" title="Left" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QTextCaption API</h2>
      <docs-api :comp="textCaption" :source="textCaptionSource" />
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

.demo-stage {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}
.demo-stage--sm {
  width: 46%;
  aspect-ratio: 4 / 3;
  flex: 1 1 46%;
}
.demo-img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.demo-stage--sm .demo-img {
  aspect-ratio: 4 / 3;
}
.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
