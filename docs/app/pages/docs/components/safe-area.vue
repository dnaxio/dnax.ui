<script setup lang="ts">
// Safe Area — documentation du composant QSafeArea : insets iOS (encoche, barre d'accueil).
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const safeArea = useComponent(() => "QSafeArea")
const safeAreaSource = componentSource("QSafeArea")
const tag = componentTag("QSafeArea")

const usageTopBottom = `<div class="phone">
  <q-safe-area top class="phone__status">
    <span class="phone__time">9:41</span>
    <span class="phone__notch" />
  </q-safe-area>

  <div class="phone__content">
    <div class="card" />
    <div class="card" />
    <div class="card" />
  </div>

  <q-safe-area bottom class="phone__home">
    <span class="phone__home-indicator" />
  </q-safe-area>
</div>
<!-- padding-top: env(safe-area-inset-top) pousse le contenu sous l'encoche ;
     padding-bottom: env(safe-area-inset-bottom) au-dessus de la barre d'accueil. -->`

const usageLeftRight = `<div class="phone phone--landscape">
  <q-safe-area left class="phone__side">
    <span class="phone__notch-side" />
  </q-safe-area>

  <div class="phone__content">
    <div class="card" />
    <div class="card" />
  </div>
</div>
<!-- En paysage, l'encoche est sur le côté : inset-left l'évite. -->`

const usageMeta = `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`

const usageAll = `<div class="phone">
  <q-safe-area all class="phone__full">
    <p class="title">Fullscreen</p>
    <p class="text">This content avoids every edge — top, right, bottom and left.</p>
  </q-safe-area>
</div>
<!-- all = top + right + bottom + left (contenu plein écran : modal, page d'accueil…) -->`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Safe Area</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Applies the iOS <b>safe-area insets</b> (notch, home indicator) as padding on
      the requested sides. <b>&lt;q-safe-area top bottom&gt;</b> wraps content that
      must not slide under the notch or the home bar — with the mandatory
      fallback chain <code>0</code> → <code>constant()</code> →
      <code>env()</code>. On desktop the insets are <code>0</code>: nothing
      changes. The phone mockups below simulate the insets so you can see the
      effect.
    </p>

    <!-- ═══════ Top & bottom ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Top &amp; bottom (portrait)</h2>
      <p class="doc-note">
        <code>top</code> pads below the notch (status bar area),
        <code>bottom</code> pads above the home indicator — the two most common
        sides.
      </p>

      <docs-demo :code="usageTopBottom" lang="html" filename="App.vue">
        <div class="demo-phone">
          <q-safe-area top class="demo-phone__status">
            <span class="demo-phone__time">9:41</span>
            <span class="demo-phone__notch" />
          </q-safe-area>

          <div class="demo-phone__content">
            <div class="demo-card" />
            <div class="demo-card" />
            <div class="demo-card" />
          </div>

          <q-safe-area bottom class="demo-phone__home">
            <span class="demo-phone__home-indicator" />
          </q-safe-area>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Left & right ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Left &amp; right (landscape)</h2>
      <p class="doc-note">
        In landscape the notch sits on a side — <code>left</code> /
        <code>right</code> avoid it for side rails, drawers or full-bleed content.
      </p>

      <docs-demo :code="usageLeftRight" lang="html" filename="App.vue">
        <div class="demo-phone demo-phone--landscape">
          <q-safe-area left class="demo-phone__side">
            <span class="demo-phone__notch-side" />
          </q-safe-area>

          <div class="demo-phone__content">
            <div class="demo-card" />
            <div class="demo-card" />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ All ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">All sides</h2>
      <p class="doc-note">
        <code>all</code> is a shortcut for <code>top + right + bottom + left</code>
        — for full-bleed content (modals, splash screens, home pages) that must
        clear every edge.
      </p>

      <docs-demo :code="usageAll" lang="html" filename="App.vue">
        <div class="demo-phone">
          <q-safe-area all class="demo-phone__full">
            <p class="demo-full__title">Fullscreen</p>
            <p class="demo-full__text">
              This content avoids every edge — top, right, bottom and left.
            </p>
          </q-safe-area>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Prérequis ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Prerequisite: viewport-fit=cover</h2>
      <p class="doc-note">
        <code>env(safe-area-inset-*)</code> is only non-zero when the viewport
        opts in with <code>viewport-fit=cover</code> — make sure the meta tag is
        present (it already is in the mobile app config):
      </p>
      <q-syntax :code="usageMeta" lang="html" filename="index.html" copy />
      <p class="doc-note">
        Each side emits the full fallback chain, so old iOS versions fall back to
        <code>constant()</code> and ancient browsers to <code>0</code>.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSafeArea API</h2>
      <docs-api :comp="safeArea" :source="safeAreaSource" />
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

/* — mockup téléphone — */
.demo-phone {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 500px;
  margin: 0 auto;
  border-radius: 36px;
  border: 10px solid #1d1d1d;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 14px 36px rgb(0 0 0 / 0.22);
}
.demo-phone--landscape {
  flex-direction: row;
  width: 520px;
  height: 250px;
}

/* Simulation desktop des insets (env() vaut 0 hors iOS) */
.demo-phone :deep(.q-safe-area--top) {
  padding-top: 44px;
}
.demo-phone :deep(.q-safe-area--right) {
  padding-right: 24px;
}
.demo-phone :deep(.q-safe-area--bottom) {
  padding-bottom: 34px;
}
.demo-phone :deep(.q-safe-area--left) {
  padding-left: 24px;
}
.demo-phone--landscape :deep(.q-safe-area--left) {
  padding-left: 40px;
}

.demo-phone__status {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
}
.demo-phone__time {
  font-size: 12px;
  font-weight: 700;
  color: #111;
}
.demo-phone__notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 92px;
  height: 24px;
  border-radius: 999px;
  background: #111;
}

.demo-phone__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  background: #fafbfc;
  overflow: hidden;
}
.demo-card {
  height: 46px;
  border-radius: 10px;
  background: rgb(0 0 0 / 0.06);
}

.demo-phone__home {
  display: flex;
  justify-content: center;
  background: #f3f4f6;
  border-top: 1px solid rgb(0 0 0 / 0.06);
}
.demo-phone__home-indicator {
  width: 110px;
  height: 5px;
  border-radius: 999px;
  background: #111;
}

.demo-phone__side {
  position: relative;
  background: #f3f4f6;
  border-right: 1px solid rgb(0 0 0 / 0.06);
}
.demo-phone__notch-side {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 72px;
  border-radius: 999px;
  background: #111;
}

/* — démo all (plein écran) — */
.demo-phone__full {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(160deg, #1976d2, #7c3aed);
  color: #fff;
}
.demo-full__title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.demo-full__text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  opacity: 0.9;
}
</style>
