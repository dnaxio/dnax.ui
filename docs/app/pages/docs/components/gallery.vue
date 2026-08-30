<script setup lang="ts">
// Gallery — documentation du composant QGallery : grille d'images avec sélection.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const gallery = useComponent(() => "QGallery")
const gallerySource = componentSource("QGallery")
const tag = componentTag("QGallery")

const IMAGES = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1287&auto=format&fit=crop",
]

const LABELED = [
  { src: IMAGES[0]!, label: "Alpine sunrise", description: "Golden light over the peaks" },
  { src: IMAGES[1]!, label: "Coastal cliffs", description: "Wild ocean views" },
  { src: IMAGES[2]!, label: "Forest trail", description: "Morning mist between the pines" },
  { src: IMAGES[3]!, label: "Desert dunes", description: "Endless sand at dusk" },
]

const PHOTOS = [
  { id: 1, url: IMAGES[0]!, name: "Alpine sunrise", desc: "Golden light over the peaks" },
  { id: 2, url: IMAGES[1]!, name: "Coastal cliffs", desc: "Wild ocean views" },
  { id: 3, url: IMAGES[2]!, name: "Forest trail", desc: "Morning mist between the pines" },
  { id: 4, url: IMAGES[3]!, name: "Desert dunes", desc: "Endless sand at dusk" },
]

// — États des démos —
const single = ref<string | null>(null)
const many = ref<string[]>([])
const labeled = ref<any | null>(null)
const labeledMany = ref<any[]>([])
const customMany = ref<any[]>([])
const lastSelect = ref<any>(null)

const usageBasic = `<q-gallery v-model="selected" :images="IMAGES" hover />
<p class="demo-p demo-meta">Selected: <code>{{ selected }}</code></p>`

const usageMultiple = `<q-gallery v-model="selected" :images="IMAGES" multiple :max-selected="4" />
<p class="demo-p demo-meta">{{ selected.length }} selected (max 4)</p>`

const usageLabels = `<q-gallery
  v-model="selected"
  :images="LABELED"
  labels
  :cols="2"
  multiple
/>
<p class="demo-p demo-meta">{{ selected.length }} selected</p>`

const usageCustom = `<q-gallery
  v-model="selected"
  :images="photos"
  src-key="url"
  label-key="name"
  description-key="desc"
  labels
  multiple
  @select="last = $event"
/>
<p class="demo-p demo-meta">Last select: {{ JSON.stringify(last?.image) }}</p>`

const usageViewer = `<q-gallery :images="IMAGES" :cols="8" dense :selectable="false" />`

const scriptBasic = `import { ref } from "vue"

const IMAGES = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1287&auto=format&fit=crop",
]

const selected = ref<string | null>(null)`

const scriptMultiple = `import { ref } from "vue"

const IMAGES = [/* … */]
const selected = ref<string[]>([])`

const scriptLabels = `import { ref } from "vue"

const LABELED = [
  { src: "img-1.jpg", label: "Alpine sunrise", description: "Golden light over the peaks" },
  { src: "img-2.jpg", label: "Coastal cliffs", description: "Wild ocean views" },
  { src: "img-3.jpg", label: "Forest trail", description: "Morning mist between the pines" },
  { src: "img-4.jpg", label: "Desert dunes", description: "Endless sand at dusk" },
]
const selected = ref<any[]>([])`

const scriptCustom = `import { ref } from "vue"

const photos = [
  { id: 1, url: "img-1.jpg", name: "Alpine sunrise", desc: "Golden light over the peaks" },
  { id: 2, url: "img-2.jpg", name: "Coastal cliffs", desc: "Wild ocean views" },
  { id: 3, url: "img-3.jpg", name: "Forest trail", desc: "Morning mist between the pines" },
  { id: 4, url: "img-4.jpg", name: "Desert dunes", desc: "Endless sand at dusk" },
]
const selected = ref<any[]>([])
const last = ref<any>(null)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Gallery</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A responsive grid of images with built-in selection:
      <b>&lt;q-gallery&gt;</b> takes URLs or <code>{ src, label, description }</code>
      objects, supports <b>single or multiple</b> selection
      (<code>v-model</code> returns the raw items), optional <code>labels</code>
      under each image, a <code>max-selected</code> limit, a <code>hover</code>
      zoom animation and a pure <code>viewer</code> mode — no images selected,
      nothing to pick.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Click an image to select it (single), click again to deselect — the
        <code>v-model</code> receives the URL. <code>hover</code> adds a subtle
        zoom + shadow on mouse-over (respects
        <code>prefers-reduced-motion</code>).
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-gallery v-model="single" :images="IMAGES" hover />
        <p class="demo-p demo-meta">Selected: <code>{{ single ?? "—" }}</code></p>
      </docs-demo>
    </section>

    <!-- ═══════ Multiple ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Multiple selection</h2>
      <p class="doc-note">
        <code>multiple</code> toggles items in an array; <code>max-selected</code>
        caps the count (here 4) and dims the rest.
      </p>

      <docs-demo :code="usageMultiple" lang="html" filename="App.vue" :script="scriptMultiple">
        <q-gallery v-model="many" :images="IMAGES" multiple :max-selected="4" />
        <p class="demo-p demo-meta">{{ many.length }} selected (max 4)</p>
      </docs-demo>
    </section>

    <!-- ═══════ Labels ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Labels &amp; descriptions</h2>
      <p class="doc-note">
        Pass objects with <code>label</code> and <code>description</code>, add
        <code>labels</code> — the caption fades in over the bottom of each image.
      </p>

      <docs-demo :code="usageLabels" lang="html" filename="App.vue" :script="scriptLabels">
        <q-gallery v-model="labeledMany" :images="LABELED" labels :cols="2" multiple />
        <p class="demo-p demo-meta">{{ labeledMany.length }} selected</p>
      </docs-demo>
    </section>

    <!-- ═══════ Custom data ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom data</h2>
      <p class="doc-note">
        Pass any JSON array and point to your own fields with
        <code>src-key</code>, <code>label-key</code> and
        <code>description-key</code> — <code>@select</code> and the
        <code>v-model</code> return the <b>full original object</b>.
      </p>

      <docs-demo :code="usageCustom" lang="html" filename="App.vue" :script="scriptCustom">
        <q-gallery
          v-model="customMany"
          :images="PHOTOS"
          src-key="url"
          label-key="name"
          description-key="desc"
          labels
          multiple
          @select="lastSelect = $event"
        />
        <p class="demo-p demo-meta">
          Last select: <code>{{ JSON.stringify(lastSelect?.image) }}</code>
        </p>
      </docs-demo>
    </section>

    <!-- ═══════ Viewer ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Viewer mode</h2>
      <p class="doc-note">
        <code>:selectable="false"</code> turns the gallery into a plain picture
        grid — no selection state, no cursor.
      </p>

      <docs-demo :code="usageViewer" lang="html" filename="App.vue" :script="scriptBasic">
        <q-gallery :images="IMAGES" :cols="8" dense :selectable="false" />
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QGallery API</h2>
      <docs-api :comp="gallery" :source="gallerySource" />
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

.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
  font-variant-numeric: tabular-nums;
}
</style>
