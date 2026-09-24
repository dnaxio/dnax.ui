<script setup lang="ts">
// Live demos for the Uploader page (page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "limit" | "placeholder" | "accept" | "details" | "disabled" | "slots"
}>()

const IMG = (id: string) => `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`

const PRESET = [
  { url: IMG("photo-1786057425168-1f326d4f47b1"), name: "Peaks.jpg", size: 128_000 },
  { url: IMG("photo-1783628376510-0de24d5b18a5"), name: "Coast.jpg", size: 210_000 },
  { url: IMG("photo-1567095761054-7a02e69e5c43"), name: "Forest.jpg", size: 96_000 },
]

const files = ref<any[]>([])
const limited = ref<any[]>(PRESET.map((p) => ({ ...p })))
const oversize = ref(0)
const docs = ref<any[]>([])
const locked = ref<any[]>(PRESET.map((p) => ({ ...p })))
</script>

<template>
  <template v-if="demo === 'basic'">
    <q-uploader v-model="files" multiple label="Add photos" />
    <p class="demo-p demo-meta">{{ files.length }} file(s)</p>
  </template>

  <template v-else-if="demo === 'limit'">
    <q-uploader
      v-model="limited"
      multiple
      :max-count="3"
      :max-size="2_000_000"
      @oversize="oversize++"
    />
    <p class="demo-p demo-meta">{{ limited.length }} / 3 · oversize: {{ oversize }}</p>
  </template>

  <div v-else-if="demo === 'placeholder'" class="demo-col">
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

  <q-uploader
    v-else-if="demo === 'accept'"
    v-model="docs"
    accept=".pdf,image/*"
    multiple
    label="Photos & PDFs"
  />

  <q-uploader v-else-if="demo === 'details'" v-model="limited" details multiple />

  <q-uploader v-else-if="demo === 'disabled'" v-model="locked" disabled />

  <q-uploader v-else-if="demo === 'slots'" v-model="files" multiple>
    <template #default>
      <q-btn flat no-caps icon="lucide:image-plus" label="Choose files" />
    </template>
    <template #file="{ index }">
      <div class="demo-badge">{{ index + 1 }}</div>
    </template>
  </q-uploader>
</template>

<style scoped>
.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.demo-col {
  align-items: flex-start;
}

/* Custom `#file` slot badge */
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
