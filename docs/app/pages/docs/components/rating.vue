<script setup lang="ts">
// Rating — documentation for QRating.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const rating = useComponent(() => "QRating")
const ratingSource = componentSource("QRating")
const tag = componentTag("QRating")

// — Interactive demo state —
const note = ref(3)
const review = ref(4)
const hearts = ref(5)
const fixed = ref(5)

const usageBasic = `<q-rating v-model="note" :max="5" />`

const usageSizes = `<q-rating v-model="review" :max="5" color="secondary" size="sm" />
<q-rating v-model="review" :max="5" color="warning" size="md" />
<q-rating v-model="review" :max="5" color="primary" size="xl" />`

const usageIcons = `<q-rating v-model="hearts" :max="5" icon="lucide:heart"
  color="red" no-dimming />`

const usageReadonly = `<q-rating v-model="fixed" :max="5" readonly />
<q-rating v-model="fixed" :max="5" color="teal" disable />`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Rating</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A star rating with <code>v-model</code> on the current value. <b>&lt;q-rating&gt;</b>
      supports a custom <code>max</code>, any Iconify <code>icon</code>, color and
      <code>size</code> tokens, hover preview on desktop, and dims unselected stars
      unless <code>no-dimming</code> is set.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <div class="demo-rating">
          <q-rating v-model="note" :max="5" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Sizes & colors ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sizes &amp; colors</h2>
      <p class="doc-note">
        <code>size</code> accepts <code>sm</code> | <code>md</code> | <code>lg</code> |
        <code>xl</code> or any CSS value; <code>color</code> takes a design token or
        hex (default <code>warning</code>).
      </p>

      <docs-demo :code="usageSizes" lang="html" filename="App.vue">
        <div class="demo-rating">
          <q-rating v-model="review" :max="5" color="secondary" size="sm" />
          <q-rating v-model="review" :max="5" color="warning" size="md" />
          <q-rating v-model="review" :max="5" color="primary" size="xl" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom icon ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom icon</h2>
      <p class="doc-note">
        Any Iconify icon can replace the default star, and
        <code>no-dimming</code> keeps unselected icons at full opacity.
      </p>

      <docs-demo :code="usageIcons" lang="html" filename="App.vue">
        <div class="demo-rating">
          <q-rating v-model="hearts" :max="5" icon="lucide:heart" color="red" no-dimming />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Readonly & disabled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Readonly &amp; disabled</h2>

      <docs-demo :code="usageReadonly" lang="html" filename="App.vue">
        <div class="demo-rating">
          <q-rating v-model="fixed" :max="5" readonly />
          <q-rating v-model="fixed" :max="5" color="teal" disable />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="rating" :source="ratingSource" />
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
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
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
.demo-rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
}

/* espace entre les deux blocs docs-demo */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
