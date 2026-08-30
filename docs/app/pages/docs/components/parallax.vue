<script setup lang="ts">
// Parallax — documentation du composant QParallax : image de fond au scroll.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const parallax = useComponent(() => "QParallax")
const parallaxSource = componentSource("QParallax")
const tag = componentTag("QParallax")

const img1 =
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop"
const img2 =
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop"
const img3 =
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1600&auto=format&fit=crop"

const usageBasic = `<q-parallax :src="image" :height="300">
  <h3 class="title">Dnax UI</h3>
  <p class="subtitle">Scroll the page — the background moves slower.</p>
</q-parallax>`

const usageSpeed = `<q-parallax :src="image" :height="220" :speed="0.4">
  <p class="caption">speed = 0.4 — a subtle drift</p>
</q-parallax>`

const usageContent = `<q-parallax :src="image" :height="240">
  <q-badge color="primary" label="✦ Parallax content" class="badge" />
</q-parallax>`

const usageContainer = `<div class="scroll">
  <p>Scroll inside this box — the parallax tracks its container.</p>
  <q-parallax :src="image" :height="180" />
  <p>More content below… and the image still moves.</p>
</div>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Parallax</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A background image that scrolls <b>slower than the page</b>, creating depth.
      <b>&lt;q-parallax&gt;</b> tracks the window scroll — or the nearest scrollable
      container — and always keeps the image covering its box. Overlay any content
      with the default slot.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Set an image with <code>src</code> and a block <code>height</code>, then
        scroll the page to see the effect.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-parallax :src="img1" :height="300">
          <div class="demo-overlay">
            <h3 class="demo-overlay__title">Dnax UI</h3>
            <p class="demo-overlay__sub">Scroll the page — the background moves slower.</p>
          </div>
        </q-parallax>
      </docs-demo>
    </section>

    <!-- ═══════ Speed ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Speed</h2>
      <p class="doc-note">
        <code>speed</code> (0.1–1, default 1) tunes how much the image drifts.
      </p>

      <docs-demo :code="usageSpeed" lang="html" filename="App.vue">
        <q-parallax :src="img2" :height="220" :speed="0.4">
          <p class="demo-caption">speed = 0.4 — a subtle drift</p>
        </q-parallax>
      </docs-demo>
    </section>

    <!-- ═══════ Content ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Content overlay</h2>
      <p class="doc-note">
        The slot is centered over the image — anything goes (badges, text,
        buttons…).
      </p>

      <docs-demo :code="usageContent" lang="html" filename="App.vue">
        <q-parallax :src="img3" :height="240">
          <q-badge color="primary" label="✦ Parallax content" class="demo-badge" />
        </q-parallax>
      </docs-demo>
    </section>

    <!-- ═══════ Inside a scroll container ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Inside a scroll container</h2>
      <p class="doc-note">
        When the parallax lives in a scrollable box, it automatically tracks that
        container instead of the page.
      </p>

      <docs-demo :code="usageContainer" lang="html" filename="App.vue">
        <div class="demo-scroll">
          <p class="demo-scroll__text">
            Scroll inside this box — the parallax tracks its container.
          </p>
          <q-parallax :src="img2" :height="180" />
          <p class="demo-scroll__text">
            More content below… and the image still moves as you scroll.
          </p>
          <p class="demo-scroll__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. The parallax
            keeps working even in a nested scroller.
          </p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QParallax API</h2>
      <docs-api :comp="parallax" :source="parallaxSource" />
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

/* — overlays — */
.demo-overlay {
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 12px rgb(0 0 0 / 0.5);
}
.demo-overlay__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.demo-overlay__sub {
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.9;
}
.demo-caption {
  margin: 0;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.45);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.demo-badge {
  font-size: 13px;
}

/* — conteneur scrollable — */
.demo-scroll {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: var(--background, #fff);
}
.demo-scroll__text {
  margin: 0;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--foreground);
}
</style>
