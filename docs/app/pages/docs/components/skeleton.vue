<script setup lang="ts">
// Skeleton — documentation du composant QSkeleton : placeholders de chargement.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const skeleton = useComponent(() => "QSkeleton")
const skeletonSource = componentSource("QSkeleton")
const tag = componentTag("QSkeleton")

const usageShapes = `<q-skeleton type="text" width="100%" />
<q-skeleton type="text" width="80%" />
<q-skeleton type="text" width="55%" />
<q-skeleton type="rect" width="100%" height="120px" />
<q-skeleton type="circle" size="64px" />`

const usageTypes = `<q-skeleton type="QBtn" />
<q-skeleton type="QAvatar" />
<q-skeleton type="QBadge" />
<q-skeleton type="QChip" />
<q-skeleton type="QInput" />
<q-skeleton type="QToggle" />
<q-skeleton type="QCheckbox" />
<q-skeleton type="QRadio" />
<q-skeleton type="QSlider" />`

const usageCard = `<div class="card">
  <div class="card__row">
    <q-skeleton type="QAvatar" />
    <div class="card__lines">
      <q-skeleton type="text" width="60%" />
      <q-skeleton type="text" width="40%" />
    </div>
  </div>
  <q-skeleton type="text" />
  <q-skeleton type="text" width="90%" />
  <div class="card__row card__row--end">
    <q-skeleton type="QBtn" />
    <q-skeleton type="QBtn" />
  </div>
</div>`

const usageAnims = `<div class="row">
  <q-skeleton type="text" width="110px" animation="wave" />
  <q-skeleton type="text" width="110px" animation="pulse" />
  <q-skeleton type="text" width="110px" animation="blink" />
  <q-skeleton type="text" width="110px" animation="fade" />
  <q-skeleton type="text" width="110px" animation="none" />
</div>
<!-- wave (défaut) · pulse · pulse-x · pulse-y · blink · fade · none -->`

const usageDark = `<div class="panel-dark">
  <q-skeleton type="QAvatar" dark />
  <div class="lines">
    <q-skeleton type="text" width="100%" dark />
    <q-skeleton type="text" width="70%" dark />
  </div>
</div>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Skeleton</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Loading placeholders that mimic the final layout. <b>&lt;q-skeleton&gt;</b>
      offers simple shapes (<code>text</code>, <code>rect</code>,
      <code>circle</code>), whole component shapes (<code>QBtn</code>,
      <code>QInput</code>, <code>QAvatar</code>…) and seven animations — the
      equivalent of the shadcn-vue Skeleton with a Quasar API.
    </p>

    <!-- ═══════ Basic shapes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic shapes</h2>
      <p class="doc-note">
        <code>text</code> (one line of text, <code>size</code> = font-size),
        <code>rect</code> (image/block, <code>width</code>/<code>height</code>)
        and <code>circle</code> (<code>size</code> = diameter).
      </p>

      <docs-demo :code="usageShapes" lang="html" filename="App.vue">
        <div class="demo-col demo-col--wide">
          <q-skeleton type="text" width="100%" />
          <q-skeleton type="text" width="80%" />
          <q-skeleton type="text" width="55%" />
          <q-skeleton type="rect" width="100%" height="120px" />
          <q-skeleton type="circle" size="64px" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Component types ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Component shapes</h2>
      <p class="doc-note">
        The <code>type</code> mimics the silhouette of a whole component —
        handy to skeleton a form, a toolbar or a list.
      </p>

      <docs-demo :code="usageTypes" lang="html" filename="App.vue">
        <div class="demo-grid">
          <q-skeleton type="QBtn" />
          <q-skeleton type="QAvatar" />
          <q-skeleton type="QBadge" />
          <q-skeleton type="QChip" />
          <q-skeleton type="QInput" />
          <q-skeleton type="QToggle" />
          <q-skeleton type="QCheckbox" />
          <q-skeleton type="QRadio" />
          <q-skeleton type="QSlider" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Composed layout ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Composed layout</h2>
      <p class="doc-note">
        Combine skeletons to reproduce the real page structure — here a profile
        card (avatar + lines + actions).
      </p>

      <docs-demo :code="usageCard" lang="html" filename="App.vue">
        <div class="demo-card">
          <div class="demo-card__row">
            <q-skeleton type="QAvatar" />
            <div class="demo-card__lines">
              <q-skeleton type="text" width="60%" />
              <q-skeleton type="text" width="40%" />
            </div>
          </div>
          <q-skeleton type="text" />
          <q-skeleton type="text" width="90%" />
          <div class="demo-card__row demo-card__row--end">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Animations ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Animations</h2>
      <p class="doc-note">
        <code>animation</code>: <code>wave</code> (default, sweeping highlight),
        <code>pulse</code> / <code>pulse-x</code> / <code>pulse-y</code>,
        <code>blink</code>, <code>fade</code> or <code>none</code>.
      </p>

      <docs-demo :code="usageAnims" lang="html" filename="App.vue">
        <div class="demo-row">
          <q-skeleton type="text" width="110px" animation="wave" />
          <q-skeleton type="text" width="110px" animation="pulse" />
          <q-skeleton type="text" width="110px" animation="blink" />
          <q-skeleton type="text" width="110px" animation="fade" />
          <q-skeleton type="text" width="110px" animation="none" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Dark ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Dark</h2>
      <p class="doc-note">
        <code>dark</code> switches to light-on-dark colors — for skeletons inside
        dark panels, cards or images.
      </p>

      <docs-demo :code="usageDark" lang="html" filename="App.vue">
        <div class="demo-dark">
          <q-skeleton type="QAvatar" dark />
          <div class="demo-dark__lines">
            <q-skeleton type="text" width="100%" dark />
            <q-skeleton type="text" width="70%" dark />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSkeleton API</h2>
      <docs-api :comp="skeleton" :source="skeletonSource" />
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

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
.demo-col--wide {
  align-items: stretch;
}
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 18px;
  align-items: center;
  max-width: 560px;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* — carte composée — */
.demo-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 420px;
  margin: 0 auto;
  padding: 18px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: #fff;
}
.demo-card__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-card__row--end {
  justify-content: flex-end;
}
.demo-card__lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

/* — panneau sombre — */
.demo-dark {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 420px;
  margin: 0 auto;
  padding: 18px;
  border-radius: 12px;
  background: #1d1d1d;
}
.demo-dark__lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
</style>
