<script setup lang="ts">
// Header — QHeader : barre haute (flux normal ou fixée), safe-area top/left/right intégrée.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const header = useComponent(() => "QHeader")
const headerSource = componentSource("QHeader")
const tag = componentTag("QHeader")

const basicCode = `<q-header>
  <q-toolbar>
    <q-icon name="lucide:box" color="primary" size="24px" />
    <span class="q-header__title">Dnax UI</span>
    <q-space />
    <q-btn flat dense no-caps icon="lucide:search" aria-label="Search" />
    <q-btn flat dense no-caps icon="lucide:bell" aria-label="Notifications" />
  </q-toolbar>
</q-header>`

const translucentCode = `<q-header translucent>
  <q-toolbar>
    <q-icon name="lucide:map" color="primary" size="22px" />
    <span class="q-header__title">Discover</span>
    <q-space />
    <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
  </q-toolbar>
</q-header>`

const glassCode = `<q-header glass>
  <q-toolbar>
    <q-icon name="lucide:map" color="primary" size="22px" />
    <span class="q-header__title">Discover</span>
    <q-space />
    <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
  </q-toolbar>
</q-header>`

const fixedCode = `<q-header fixed>
  <q-toolbar>
    <q-icon name="lucide:arrow-left" color="primary" size="22px" />
    <span class="q-header__title">Details</span>
    <q-space />
    <q-btn flat dense round icon="lucide:more-vertical" aria-label="More" />
  </q-toolbar>
</q-header>`

const bestPracticeCode = `<q-header fixed>
  <q-toolbar>
    <q-icon name="lucide:arrow-left" color="primary" size="22px" />
    <span class="title">Page title</span>
    <q-space />
    <q-btn flat round dense icon="lucide:more-vertical" aria-label="More" />
  </q-toolbar>
</q-header>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Header</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A top bar for titles and actions.
      <b>&lt;q-header&gt;</b> sits in the page flow by default, or pins to the top of
      the viewport with <code>fixed</code> — the iOS safe-area insets (top, left,
      right) are applied automatically. Backgrounds: <code>translucent</code>
      (frosted) or <code>glass</code> (marked glassmorphism). Always pair it with
      <b>&lt;q-toolbar&gt;</b> inside (see the best practice below).
    </p>

    <!-- ═══════ Best practice ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Best practice — always use a toolbar</h2>
      <p class="doc-note">
        <b>&lt;q-header&gt;</b> is a bare bar — wrap its content in a
        <b>&lt;q-toolbar&gt;</b> to get the standard height and padding, the
        <code>q-space</code> layout helper and consistent alignment. Every header
        in this page follows that pattern:
      </p>
      <q-syntax :code="bestPracticeCode" lang="html" filename="App.vue" copy />
      <p class="doc-note">
        See the <a class="doc-link" href="/docs/components/toolbar">Toolbar</a>
        page for the toolbar's own API and options.
      </p>
    </section>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        In-flow header with a <code>q-toolbar</code>: brand icon, title and
        icon-only actions.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-stage">
          <q-header>
            <q-toolbar>
              <q-icon name="lucide:box" color="primary" size="24px" />
              <span class="q-header__title">Dnax UI</span>
              <q-space />
              <q-btn flat dense no-caps icon="lucide:search" aria-label="Search" />
              <q-btn flat dense no-caps icon="lucide:bell" aria-label="Notifications" />
            </q-toolbar>
          </q-header>
          <div class="demo-stage__content">
            <p class="demo-p">Page content…</p>
          </div>
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
          <q-header translucent>
            <q-toolbar>
              <q-icon name="lucide:map" color="primary" size="22px" />
              <span class="q-header__title">Discover</span>
              <q-space />
              <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
            </q-toolbar>
          </q-header>
          <div class="demo-stage__content">
            <p class="demo-p">The colorful background shows through the blurred bar.</p>
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Glassmorphism ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Glassmorphism</h2>
      <p class="doc-note">
        <code>glass</code> goes further than translucent: a very translucent
        background with a stronger blur + saturation and a light bottom border
        — the classic frosted look over colorful content. Tune it with
        <code>--q-glass-bg</code> and <code>--q-glass-blur</code>.
      </p>

      <docs-demo :code="glassCode" lang="html" filename="App.vue">
        <div class="demo-stage demo-stage--gradient">
          <q-header glass>
            <q-toolbar>
              <q-icon name="lucide:map" color="primary" size="22px" />
              <span class="q-header__title">Discover</span>
              <q-space />
              <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
            </q-toolbar>
          </q-header>
          <div class="demo-stage__content">
            <p class="demo-p">The colorful background shows through the blurred glass bar.</p>
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Fixed ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Fixed</h2>
      <p class="doc-note">
        <code>fixed</code> pins the header to the top of the viewport
        (<code>position: fixed</code>), out of the page flow — content scrolls
        underneath.
      </p>

      <docs-demo :code="fixedCode" lang="html" filename="App.vue">
        <div class="demo-stage">
          <q-header fixed>
            <q-toolbar>
              <q-icon name="lucide:arrow-left" color="primary" size="22px" />
              <span class="q-header__title">Details</span>
              <q-space />
              <q-btn flat dense round icon="lucide:more-vertical" aria-label="More" />
            </q-toolbar>
          </q-header>
          <div class="demo-stage__content">
            <p class="demo-p">In the real app the bar floats above the page top.</p>
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QHeader</h2>
      <docs-api :comp="header" :source="headerSource" />
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
.doc-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}
.doc-link:hover {
  text-decoration: underline;
}

/* — Scène simulant une page avec le header en haut — */
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
.demo-stage :deep(.q-header--fixed) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.q-header__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
