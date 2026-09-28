<script setup lang="ts">
// Démos live de la page Image Picker : avatar (simple), galerie (multiple + compteur),
// validation (taille / type), appareil photo (`capture`) et états (readonly / disable).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "avatar" | "gallery" | "validation" | "camera" | "states"
}>()

const $q = usePlugin()

/** Taille lisible d'un fichier (Ko / Mo) */
const size = (file?: File | null) => {
  if (!file) return ""
  if (file.size < 1024) return `${file.size} B`
  return file.size < 1024 * 1024
    ? `${Math.round(file.size / 1024)} KB`
    : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
}

// — Avatar : une seule image, remplacée à la sélection suivante —
const avatar = ref<File | null>(null)
const avatarUrl = ref<string | null>(null)
watch(avatar, (file) => {
  if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value)
  avatarUrl.value = file ? URL.createObjectURL(file) : null
})
onBeforeUnmount(() => {
  if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value)
})

// — Galerie : plusieurs images, journal des événements, visionneuse plein écran —
const gallery = ref<File[]>([])
const urls = ref<string[]>([])
const events = ref<string[]>([])

watch(gallery, (files) => {
  urls.value.forEach(URL.revokeObjectURL)
  urls.value = files.map((file) => URL.createObjectURL(file))
})
onBeforeUnmount(() => urls.value.forEach(URL.revokeObjectURL))

const log = (message: string) => {
  events.value = [message, ...events.value].slice(0, 4)
}
const onAdded = (file: File) => log(`+ ${file.name} · ${size(file)}`)
const onRemoved = (file: File) => log(`− ${file.name}`)
const onRejected = (file: File, reason: "size" | "type" | "count") =>
  log(
    `✕ ${file.name} · ${reason === "size" ? "too large" : reason === "type" ? "type rejected" : "too many files"}`,
  )

/** Ouvre la sélection courante en visionneuse plein écran ($q.imagePreview) */
const preview = (index: number) => {
  if (urls.value.length === 0) return
  $q.imagePreview.open({
    images: urls.value,
    index,
    transition: "up",
    closeBtn: true,
    counter: true,
  })
}

// — Validation : 1 Mo maximum, PNG ou JPEG seulement —
const limited = ref<File[]>([])
const refusals = ref<string[]>([])
const onRefused = (file: File, reason: "size" | "type" | "count") => {
  const label =
    reason === "size"
      ? `too large (${size(file)} > 1 MB)`
      : reason === "type"
        ? "type not accepted"
        : "too many files"
  refusals.value = [`${file.name} · ${label}`, ...refusals.value].slice(0, 3)
}

// — Appareil photo (`capture`) : arrière (photo) ou frontal (selfie) —
const facing = ref<"environment" | "user">("environment")
const shot = ref<File | null>(null)
const shotUrl = ref<string | null>(null)
watch(shot, (file) => {
  if (shotUrl.value) URL.revokeObjectURL(shotUrl.value)
  shotUrl.value = file ? URL.createObjectURL(file) : null
})
onBeforeUnmount(() => {
  if (shotUrl.value) URL.revokeObjectURL(shotUrl.value)
})

// — États : images déjà présentes (pré-remplissage du modèle) —
const readonlyModel = ref<File[]>([])
const disabledModel = ref<File[]>([])

/** Fichier image minimal (SVG) : sert à pré-remplir les modèles des démos d'état */
const makeFile = (name: string, color: string) =>
  new File(
    [
      new Blob(
        [
          `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">` +
            `<rect width="160" height="160" rx="20" fill="${color}"/>` +
            `<circle cx="80" cy="66" r="24" fill="#fff" opacity=".85"/>` +
            `<rect x="32" y="104" width="96" height="14" rx="7" fill="#fff" opacity=".6"/></svg>`,
        ],
        { type: "image/svg+xml" },
      ),
    ],
    name,
    { type: "image/svg+xml" },
  )

onMounted(() => {
  const desktop = makeFile("bureau.svg", "#1976d2")
  const beach = makeFile("plage.svg", "#26a69a")
  readonlyModel.value = [desktop, beach]
  disabledModel.value = [beach]
})
</script>

<template>
  <!-- 1. Avatar : une image, remplacée à la sélection suivante -->
  <div v-if="demo === 'avatar'" class="demo-stack">
    <div class="demo-row">
      <q-image-picker
        v-model="avatar"
        label="Avatar"
        accept="image/png,image/jpeg"
        add-label="Choose an image"
        hint="PNG or JPEG — a single image: a new pick replaces the previous one"
      />

      <div class="demo-avatar-preview">
        <q-avatar v-if="avatarUrl" size="72px" rounded>
          <img :src="avatarUrl" :alt="avatar?.name" />
        </q-avatar>
        <div v-else class="demo-avatar-empty">
          <q-icon name="lucide:user-round" size="28px" />
        </div>

        <div class="demo-avatar-info">
          <p class="demo-label">v-model value</p>
          <p class="demo-meta">
            {{ avatar ? `${avatar.name} · ${size(avatar)}` : "null — nothing picked yet" }}
          </p>
          <q-btn
            v-if="avatar"
            flat
            dense
            no-caps
            color="negative"
            label="Clear"
            @click="avatar = null"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 2. Galerie : plusieurs images, compteur, événements, plein écran -->
  <div v-else-if="demo === 'gallery'" class="demo-stack">
    <q-image-picker
      v-model="gallery"
      multiple
      :max-files="5"
      label="Listing photos"
      hint="Up to 5 images · 10 MB max each"
      :max-file-size="10 * 1024 * 1024"
      @add="onAdded"
      @remove="onRemoved"
      @rejected="onRejected"
    />

    <div class="demo-row demo-row--between">
      <span class="demo-meta">{{ gallery.length }}/5 selected</span>
      <q-btn
        v-if="urls.length"
        flat
        dense
        no-caps
        icon="lucide:maximize-2"
        label="Open full screen"
        @click="preview(0)"
      />
    </div>

    <p v-if="urls.length" class="demo-p">
      Click a thumbnail below to open it full screen — the <code>q-image-picker</code> tiles
      are not clickable, so the file list is kept aside to build the viewer.
    </p>
    <div v-if="urls.length" class="demo-row">
      <button
        v-for="(url, index) in urls"
        :key="url"
        type="button"
        class="demo-thumb-button"
        :aria-label="`Ouvrir l'image ${index + 1}`"
        @click="preview(index)"
      >
        <img :src="url" :alt="gallery[index]?.name" />
      </button>
    </div>

    <ul v-if="events.length" class="demo-log">
      <li v-for="(event, index) in events" :key="`${event}-${index}`">{{ event }}</li>
    </ul>
  </div>

  <!-- 3. Validation : taille et type -->
  <div v-else-if="demo === 'validation'" class="demo-stack">
    <q-image-picker
      v-model="limited"
      multiple
      accept="image/png,image/jpeg"
      :max-file-size="1024 * 1024"
      :max-files="3"
      label="Attachments"
      hint="PNG or JPEG · 1 MB max · 3 files max"
      @rejected="onRefused"
    />

    <div v-if="refusals.length" class="demo-stack demo-stack--tight">
      <p class="demo-label">@rejected</p>
      <ul class="demo-log">
        <li v-for="(refusal, index) in refusals" :key="`${refusal}-${index}`">{{ refusal }}</li>
      </ul>
      <q-btn flat dense no-caps label="Clear the log" @click="refusals = []" />
    </div>
  </div>

  <!-- 4. Appareil photo (mobile) -->
  <div v-else-if="demo === 'camera'" class="demo-stack">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          flat
          no-caps
          icon="lucide:camera"
          label="Back (photo)"
          :color="facing === 'environment' ? 'primary' : ''"
          @click="facing = 'environment'"
        />
        <q-btn
          flat
          no-caps
          icon="lucide:user-round"
          label="Front (selfie)"
          :color="facing === 'user' ? 'primary' : ''"
          @click="facing = 'user'"
        />
      </q-btn-group>
    </div>

    <q-image-picker
      v-model="shot"
      :capture="facing"
      label="Photo"
      add-label="Take a photo"
      hint="On mobile, capture opens the camera right away; on desktop, the usual file picker."
    />

    <div v-if="shotUrl" class="demo-row">
      <img class="demo-photo" :src="shotUrl" :alt="shot?.name" />
      <p class="demo-meta">{{ shot?.name }} · {{ size(shot) }}</p>
    </div>
  </div>

  <!-- 5. États : readonly et disable avec des images déjà présentes -->
  <div v-else class="demo-stack">
    <q-image-picker
      v-model="readonlyModel"
      multiple
      readonly
      label="readonly — images already saved"
      hint="The grid renders, but nothing can be picked or removed"
    />

    <q-image-picker
      v-model="disabledModel"
      multiple
      disable
      label="disable — inactive field"
      hint="Same rendering, with the field muted"
    />

    <p class="demo-p">
      The model is pre-filled with <code>File</code> objects: the field only knows files. To
      show images that are **already online** (URLs), render them next to the field (a gallery,
      a <code>q-img</code>…) and keep the picker for the new uploads.
    </p>
  </div>
</template>

<style scoped>
.demo-stack--tight {
  gap: 8px;
}
.demo-row--between {
  justify-content: space-between;
}

/* — avatar — */
.demo-avatar-preview {
  display: flex;
  align-items: center;
  gap: 14px;
}
.demo-avatar-empty {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--muted);
  color: var(--muted-foreground);
}
.demo-avatar-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* — galerie — */
.demo-thumb-button {
  padding: 0;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border: 1px solid var(--border, rgb(0 0 0 / 0.1));
  border-radius: 10px;
  background: none;
  cursor: zoom-in;
}
.demo-thumb-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* — photo — */
.demo-photo {
  max-height: 160px;
  max-width: 100%;
  border-radius: 12px;
}

/* — journal d'événements — */
.demo-log {
  margin: 0;
  padding: 10px 12px 10px 26px;
  border: 1px dashed var(--border, rgb(0 0 0 / 0.14));
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted-foreground);
}
</style>
