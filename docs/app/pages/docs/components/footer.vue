<script setup lang="ts">
// Footer — QFooter : barre basse (flux normal ou fixée), safe-area bottom intégrée.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const footer = useComponent(() => "QFooter")
const footerSource = componentSource("QFooter")
const tag = componentTag("QFooter")

const basicCode = `<q-footer bordered>
  <q-icon name="lucide:box" color="primary" size="20px" />
  <span>Dnax UI</span>
  <q-space />
  <q-btn flat dense no-caps label="Help" />
  <q-btn flat dense no-caps label="Terms" />
</q-footer>`

const elevatedCode = `<q-footer elevated>
  <span>Elevated footer — shadow cast upward</span>
  <q-space />
  <q-btn flat dense no-caps icon="lucide:heart" aria-label="Like" />
</q-footer>`

const translucentCode = `<q-footer translucent>
  <span>Frosted glass — blur behind the bar</span>
  <q-space />
  <q-btn flat dense no-caps label="Close" />
</q-footer>

<!-- Opacité personnalisée -->
<q-footer :translucent="40">
  <span>Custom opacity (40%)</span>
</q-footer>`

const glassCode = `<q-footer glass>
  <span>Glassmorphism — strong blur + light border</span>
  <q-space />
  <q-btn flat dense no-caps label="Close" />
</q-footer>`

const fixedCode = `<q-footer fixed bordered>
  <span>Fixed to the viewport bottom</span>
  <q-space />
  <q-btn color="primary" unelevated no-caps dense label="OK" />
</q-footer>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Footer</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A bottom bar for actions and secondary navigation.
      <b>&lt;q-footer&gt;</b> sits in the page flow by default, or pins to the
      viewport bottom with <code>fixed</code> — the iOS safe-area bottom padding is
      built in. Backgrounds: <code>translucent</code> (frosted) or
      <code>glass</code> (marked glassmorphism).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        In-flow footer with a toolbar inside: brand icon, <code>q-space</code> and
        flat action buttons.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-stage">
          <div class="demo-stage__content">
            <p class="demo-p">Page content…</p>
          </div>
          <q-footer bordered>
            <q-icon name="lucide:box" color="primary" size="20px" />
            <span>Dnax UI</span>
            <q-space />
            <q-btn flat dense no-caps label="Help" />
            <q-btn flat dense no-caps label="Terms" />
          </q-footer>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Elevated ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Elevated</h2>
      <p class="doc-note">
        <code>elevated</code> casts a soft shadow upward, separating the bar from
        the content above it.
      </p>

      <docs-demo :code="elevatedCode" lang="html" filename="App.vue">
        <div class="demo-stage">
          <div class="demo-stage__content">
            <p class="demo-p">Page content…</p>
          </div>
          <q-footer elevated>
            <span>Elevated footer — shadow cast upward</span>
            <q-space />
            <q-btn flat dense no-caps icon="lucide:heart" aria-label="Like" />
          </q-footer>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Translucent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Translucent</h2>
      <p class="doc-note">
        <code>translucent</code> applies a frosted-glass background
        (<code>backdrop-filter: blur</code>) — pass a number for a custom opacity
        (<code>:translucent="40"</code>).
      </p>

      <docs-demo :code="translucentCode" lang="html" filename="App.vue">
        <div class="demo-stage demo-stage--gradient">
          <div class="demo-stage__content">
            <p class="demo-p">The colorful background shows through the blurred bar.</p>
          </div>
          <q-footer translucent>
            <span>Frosted glass — blur behind the bar</span>
            <q-space />
            <q-btn flat dense no-caps label="Close" />
          </q-footer>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Glassmorphism ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Glassmorphism</h2>
      <p class="doc-note">
        <code>glass</code> goes further than translucent: a very translucent
        background with a stronger blur + saturation and a light top border.
        Tune it with <code>--q-glass-bg</code> and <code>--q-glass-blur</code>.
      </p>

      <docs-demo :code="glassCode" lang="html" filename="App.vue">
        <div class="demo-stage demo-stage--gradient">
          <div class="demo-stage__content">
            <p class="demo-p">The colorful background shows through the blurred glass bar.</p>
          </div>
          <q-footer glass>
            <span>Glassmorphism — strong blur + light border</span>
            <q-space />
            <q-btn flat dense no-caps label="Close" />
          </q-footer>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Fixed ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Fixed</h2>
      <p class="doc-note">
        <code>fixed</code> pins the footer to the bottom of the viewport
        (<code>position: fixed</code>), out of the page flow. Combined with
        <code>reveal</code>, it hides when scrolling down and reappears scrolling up.
      </p>

      <docs-demo :code="fixedCode" lang="html" filename="App.vue">
        <div class="demo-stage">
          <div class="demo-stage__content">
            <p class="demo-p">In the real app the bar floats above the page bottom.</p>
          </div>
          <q-footer fixed bordered>
            <span>Fixed to the viewport bottom</span>
            <q-space />
            <q-btn color="primary" unelevated no-caps dense label="OK" />
          </q-footer>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QFooter</h2>
      <docs-api :comp="footer" :source="footerSource" />
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

/* — Scène simulant une page avec le footer en bas — */
.demo-stage {
  position: relative;
  height: 240px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.demo-stage__content {
  flex: 1;
  padding: 16px;
}
.demo-stage--gradient .demo-stage__content {
  background: linear-gradient(135deg, #4fc3f7, #7e9bff, #b39ddb);
}
.demo-stage--gradient .demo-p {
  color: rgba(255, 255, 255, 0.92);
}
.demo-stage :deep(.q-footer) {
  margin-top: auto; /* footer en flux, plaqué en bas de la scène */
}
.demo-stage :deep(.q-footer--fixed) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
