<script setup lang="ts">
// Image Preview — documentation du composant QImagePreview : visionneuse plein écran.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const imagePreview = useComponent(() => "QImagePreview")
const imagePreviewSource = componentSource("QImagePreview")
const tag = componentTag("QImagePreview")

const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1600&auto=format&fit=crop",
]

// — Démos —
const open = ref(false)
const index = ref(0)
const openFade = ref(false)
const indexFade = ref(0)
const dismissed = ref(0)
const openZoom = ref(false)
const indexZoom = ref(0)

const usageBasic = `<div class="grid">
  <img v-for="(img, i) in images" :key="i" :src="img" class="thumb" @click="index = i; open = true" />
</div>

<q-image-preview v-model="open" :images="images" v-model:index="index" transition="up" />`

const usageFade = `<q-btn color="primary" no-caps label="Open gallery (fade)" @click="openFade = true" />
<p class="demo-p demo-meta">Dismissed {{ dismissed }}×</p>

<q-image-preview
  v-model="openFade"
  :images="images"
  v-model:index="indexFade"
  transition="fade"
  close-btn
  @dismiss="dismissed++"
/>`

const usageZoom = `<q-btn color="secondary" no-caps label="Open with zoom" @click="openZoom = true" />

<q-image-preview
  v-model="openZoom"
  :images="images"
  v-model:index="indexZoom"
  transition="zoom"
  close-btn
  :counter="false"
/>`

const usageProgrammatic = `import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

$q.imagePreview.open({
  images,
  index: 0,
  transition: "up",
  closeBtn: true,
  onDismiss: () => console.log("closed"),
})`

const scriptBasic = `import { ref } from "vue"

const images = ["url-1.jpg", "url-2.jpg", "url-3.jpg", "url-4.jpg"]

const open = ref(false)
const index = ref(0)`

const scriptFade = `import { ref } from "vue"

const images = ["url-1.jpg", "url-2.jpg", "url-3.jpg", "url-4.jpg"]

const open = ref(false)
const index = ref(0)
const dismissed = ref(0)`

const scriptZoom = scriptFade

// — Démo programmatique —
const openProgrammatic = () => {
  usePlugin().imagePreview.open({
    images,
    index: 0,
    transition: "up",
    closeBtn: true,
  })
}
import { usePlugin } from "@dnax/ui/runtime"
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Image Preview</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A fullscreen image viewer (lightbox) for a list of URLs.
      <b>&lt;q-image-preview&gt;</b> opens with a <code>transition</code>
      (fade / up / down / zoom), navigates with a horizontal <b>swipe</b>, arrow
      buttons or the keyboard, shows the position (<code>2 / 5</code>) and closes
      by swiping <b>down</b>, clicking the backdrop or the optional
      <code>close-btn</code> — firing <code>@dismiss</code> on close.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic (transition up)</h2>
      <p class="doc-note">
        Click a thumbnail to open the viewer at that image — swipe horizontally to
        navigate, swipe down to close.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-grid">
          <img
            v-for="(img, i) in images"
            :key="i"
            :src="img"
            class="demo-thumb"
            :alt="'Image ' + (i + 1)"
            @click="index = i; open = true"
          />
        </div>

        <q-image-preview v-model="open" :images="images" v-model:index="index" transition="up" />
      </docs-demo>
    </section>

    <!-- ═══════ Fade + close button ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Fade &amp; close button</h2>
      <p class="doc-note">
        <code>transition="fade"</code> and <code>close-btn</code> adds a × in the
        top-right corner.
      </p>

      <docs-demo :code="usageFade" lang="html" filename="App.vue" :script="scriptFade">
        <q-btn color="primary" no-caps label="Open gallery (fade)" @click="openFade = true" />
        <p class="demo-p demo-meta">Dismissed {{ dismissed }}×</p>

        <q-image-preview
          v-model="openFade"
          :images="images"
          v-model:index="indexFade"
          transition="fade"
          close-btn
          @dismiss="dismissed++"
        />
      </docs-demo>
    </section>

    <!-- ═══════ Zoom & no counter ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Zoom &amp; no counter</h2>
      <p class="doc-note">
        <code>transition="zoom"</code> scales in; <code>:counter="false"</code>
        hides the position badge.
      </p>

      <docs-demo :code="usageZoom" lang="html" filename="App.vue" :script="scriptZoom">
        <q-btn color="secondary" no-caps label="Open with zoom" @click="openZoom = true" />

        <q-image-preview
          v-model="openZoom"
          :images="images"
          v-model:index="indexZoom"
          transition="zoom"
          close-btn
          :counter="false"
        />
      </docs-demo>
    </section>

    <!-- ═══════ Programmatic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Programmatic ($q.imagePreview)</h2>
      <p class="doc-note">
        Open the viewer from anywhere with <code>$q.imagePreview.open()</code> —
        rendered by the automatically mounted <code>QImagePreviewProvider</code>.
        The returned controller exposes <code>goTo(index)</code>.
      </p>

      <docs-demo :code="usageProgrammatic" lang="ts" filename="gallery.ts">
        <q-btn color="primary" outline no-caps label="Open programmatically" @click="openProgrammatic()" />
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QImagePreview API</h2>
      <docs-api :comp="imagePreview" :source="imagePreviewSource" />
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

.demo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 560px;
  margin: 0 auto;
}
.demo-thumb {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.demo-thumb:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.2);
}
</style>
