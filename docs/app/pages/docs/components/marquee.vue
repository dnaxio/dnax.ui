<script setup lang="ts">
// Marquee — documentation du composant QMarquee : bandeau défilant infini.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const marquee = useComponent(() => "QMarquee")
const marqueeSource = componentSource("QMarquee")
const tag = componentTag("QMarquee")

const NEWS = "Latest news — dnax.ui 1.0 released · New components every week · Built for Vue 3 ✨"

const features = [
  { label: "Vue 3", icon: "lucide:zap" },
  { label: "TypeScript", icon: "lucide:braces" },
  { label: "Quasar API", icon: "lucide:rocket" },
  { label: "shadcn style", icon: "lucide:sparkles" },
]

const usageBasic = `<q-marquee :text="NEWS" />`

const usageDirection = `<q-marquee :text="NEWS" direction="right" :duration="30" />`

const usagePause = `<q-marquee :text="NEWS" :pause-on-hover="true" />
<!-- Hover the band to pause it — resume on mouse leave. -->`

const usageTune = `<q-marquee :text="NEWS" :duration="10" gap="48px" />`

const usageSlot = `<q-marquee :duration="16" :pause-on-hover="true">
  <span v-for="f in features" :key="f" class="chip">
    <q-icon :name="f.icon" size="14px" /> {{ f.label }}
  </span>
</q-marquee>`

const scriptBasic = `const NEWS = "Latest news — dnax.ui 1.0 released · New components every week · Built for Vue 3 ✨"`

const scriptSlot = `const features = [
  { label: "Vue 3", icon: "lucide:zap" },
  { label: "TypeScript", icon: "lucide:braces" },
  { label: "Quasar API", icon: "lucide:rocket" },
  { label: "shadcn style", icon: "lucide:sparkles" },
]`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Marquee</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      An infinite scrolling band: <b>&lt;q-marquee&gt;</b> loops any content
      (a <code>text</code> prop or a rich slot) with a seamless CSS animation —
      <code>direction</code> left or right, tunable <code>duration</code> and
      <code>gap</code>, and optional <code>pause-on-hover</code>. Animations
      respect <code>prefers-reduced-motion</code>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        The simplest usage: a <code>text</code> scrolling to the left, looping
        seamlessly.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-marquee :text="NEWS" />
      </docs-demo>
    </section>

    <!-- ═══════ Direction ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Direction</h2>
      <p class="doc-note">
        <code>direction="right"</code> scrolls the other way.
      </p>

      <docs-demo :code="usageDirection" lang="html" filename="App.vue" :script="scriptBasic">
        <q-marquee :text="NEWS" direction="right" :duration="30" />
      </docs-demo>
    </section>

    <!-- ═══════ Pause on hover ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Pause on hover</h2>
      <p class="doc-note">
        <code>pause-on-hover</code> freezes the band while the mouse is over it
        and resumes on leave — handy for readable tickers.
      </p>

      <docs-demo :code="usagePause" lang="html" filename="App.vue" :script="scriptBasic">
        <q-marquee :text="NEWS" :pause-on-hover="true" />
      </docs-demo>
    </section>

    <!-- ═══════ Speed & gap ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Speed &amp; gap</h2>
      <p class="doc-note">
        <code>duration</code> is the time of one full cycle in seconds (lower =
        faster), <code>gap</code> the space between the two copies.
      </p>

      <docs-demo :code="usageTune" lang="html" filename="App.vue" :script="scriptBasic">
        <q-marquee :text="NEWS" :duration="10" gap="48px" />
      </docs-demo>
    </section>

    <!-- ═══════ Rich slot ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Rich content</h2>
      <p class="doc-note">
        The default slot accepts anything (the content is rendered twice for the
        seamless loop — the second copy is hidden from screen readers).
      </p>

      <docs-demo :code="usageSlot" lang="html" filename="App.vue" :script="scriptSlot">
        <q-marquee :duration="16" :pause-on-hover="true">
          <span v-for="f in features" :key="f.label" class="demo-chip">
            <q-icon :name="f.icon" size="14px" /> {{ f.label }}
          </span>
        </q-marquee>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QMarquee API</h2>
      <docs-api :comp="marquee" :source="marqueeSource" />
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

.demo-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 12px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
