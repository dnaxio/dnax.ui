<script setup lang="ts">
// Uploader — documentation du composant QUploader : zone d'upload de fichiers.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const uploader = useComponent(() => "QUploader")
const uploaderSource = componentSource("QUploader")
const tag = componentTag("QUploader")

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`

const PRESET = [
  { url: IMG("photo-1786057425168-1f326d4f47b1"), name: "Peaks.jpg", size: 128_000 },
  { url: IMG("photo-1783628376510-0de24d5b18a5"), name: "Coast.jpg", size: 210_000 },
  { url: IMG("photo-1567095761054-7a02e69e5c43"), name: "Forest.jpg", size: 96_000 },
]

// — États des démos —
const files = ref<any[]>([])
const limited = ref<any[]>(PRESET.map((p) => ({ ...p })))
const oversize = ref(0)
const docs = ref<any[]>([])
const locked = ref<any[]>(PRESET.map((p) => ({ ...p })))

const usageBasic = `<q-uploader v-model="files" multiple label="Add photos" />
<p class="demo-p demo-meta">{{ files.length }} file(s)</p>`

const usageLimit = `<q-uploader v-model="files" multiple max-count="3" :max-size="2097152" @oversize="oversize++" />
<p class="demo-p demo-meta">{{ files.length }} / 3 · oversize: {{ oversize }}</p>`

const usagePlaceholder = `<q-uploader v-model="files" placeholder="Add photos" />
<q-uploader v-model="files" placeholder="Choose files" upload-icon="lucide:upload" inline-placeholder />
<q-uploader v-model="files" placeholder="Attach" upload-icon="lucide:paperclip" />`

const usageAccept = `<q-uploader v-model="files" accept=".pdf,image/*" multiple label="Photos & PDFs" />`

const usageDetails = `<q-uploader v-model="files" details multiple />
<!-- Chaque tuile affiche le nom et la taille du fichier en dessous. -->`

const usageDisabled = `<q-uploader v-model="files" disabled />`

const usageSlots = `<q-uploader v-model="files" multiple>
  <template #default>
    <q-btn flat no-caps icon="lucide:image-plus" label="Choose files" />
  </template>
  <template #file="{ item, index }">
    <div class="badge">{{ index + 1 }}</div>
  </template>
</q-uploader>`

const scriptBasic = `import { ref } from "vue"

const files = ref<any[]>([])`

const scriptLimit = `import { ref } from "vue"

const files = ref<any[]>([])
const oversize = ref(0)`

const scriptPreset = `const PRESET = [
  { url: "img-1.jpg", name: "Peaks.jpg", size: 128000 },
  { url: "img-2.jpg", name: "Coast.jpg", size: 210000 },
  { url: "img-3.jpg", name: "Forest.jpg", size: 96000 },
]`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Uploader</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A file upload zone (Vant-style, dnax-designed): <b>&lt;q-uploader&gt;</b>
      binds a list of files (<code>v-model</code>), shows image thumbnails (or a
      shows image thumbnails (or a
      file icon for other types), removes them with a × button, opens a
      fullscreen <b>preview on click</b>, and supports <code>multiple</code>,
      <code>max-count</code>, <code>max-size</code> (with
      <code>@oversize</code>), <code>accept</code>, a <code>before-read</code>
      hook, a custom <code>placeholder</code> / <code>upload-icon</code> /
      <code>inline-placeholder</code> add tile, <code>details</code> (name +
      size under each tile), and custom
      <code>#default</code> / <code>#file</code> slots.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Pick images (or any file), see the thumbnails, click one for a
        fullscreen preview, × to remove.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-uploader v-model="files" multiple label="Add photos" />
        <p class="demo-p demo-meta">{{ files.length }} file(s)</p>
      </docs-demo>
    </section>

    <!-- ═══════ Limits ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Max count &amp; size</h2>
      <p class="doc-note">
        <code>max-count</code> caps the list, <code>max-size</code> rejects
        oversized files and fires <code>@oversize</code>.
      </p>

      <docs-demo :code="usageLimit" lang="html" filename="App.vue" :script="scriptLimit">
        <q-uploader
          v-model="limited"
          multiple
          :max-count="3"
          :max-size="2_000_000"
          @oversize="oversize++"
        />
        <p class="demo-p demo-meta">{{ limited.length }} / 3 · oversize: {{ oversize }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ Placeholder & icon ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Placeholder &amp; icon</h2>
      <p class="doc-note">
        <code>placeholder</code> sets the add-tile text (overrides
        <code>label</code>), <code>upload-icon</code> swaps the icon, and
        <code>inline-placeholder</code> puts icon and text on the same line.
      </p>

      <docs-demo :code="usagePlaceholder" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-col">
          <q-uploader v-model="files" placeholder="Add photos" />
          <q-uploader
            v-model="files"
            placeholder="Choose files"
            upload-icon="lucide:upload"
            inline-placeholder
          />
          <q-uploader
            v-model="files"
            placeholder="Attach"
            upload-icon="lucide:paperclip"
            inline-placeholder
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Accept ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Accept &amp; non-image files</h2>
      <p class="doc-note">
        <code>accept</code> filters the picker; non-image files render as a file
        tile with the name.
      </p>

      <docs-demo :code="usageAccept" lang="html" filename="App.vue" :script="scriptBasic">
        <q-uploader v-model="docs" accept=".pdf,image/*" multiple label="Photos &amp; PDFs" />
      </docs-demo>
    </section>

    <!-- ═══════ File details ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">File details</h2>
      <p class="doc-note">
        <code>details</code> (off by default) shows each file's name and
        formatted size under its tile.
      </p>

      <docs-demo :code="usageDetails" lang="html" filename="App.vue" :script="scriptPreset">
        <q-uploader v-model="limited" details multiple />
      </docs-demo>
    </section>

    <!-- ═══════ Disabled ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Disabled</h2>
      <p class="doc-note">
        <code>disabled</code> dims the zone: no add button, no remove, no
        preview click.
      </p>

      <docs-demo :code="usageDisabled" lang="html" filename="App.vue" :script="scriptPreset">
        <q-uploader v-model="locked" disabled />
      </docs-demo>
    </section>

    <!-- ═══════ Custom slots ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom slots</h2>
      <p class="doc-note">
        <code>#default</code> replaces the add tile, <code>#file</code> replaces
        each thumbnail (<code>{ item, index }</code>).
      </p>

      <docs-demo :code="usageSlots" lang="html" filename="App.vue" :script="scriptBasic">
        <q-uploader v-model="files" multiple>
          <template #default>
            <q-btn flat no-caps icon="lucide:image-plus" label="Choose files" />
          </template>
          <template #file="{ item, index }">
            <div class="demo-badge">{{ index + 1 }}</div>
          </template>
        </q-uploader>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QUploader API</h2>
      <docs-api :comp="uploader" :source="uploaderSource" />
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
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

/* badge du slot file custom */
.demo-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
</style>
