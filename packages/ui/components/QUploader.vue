<script setup lang="ts">
// QUploader — zone d'upload de fichiers façon Vant Uploader, design dnax :
// <q-uploader v-model="files" max-count="5" max-size="2097152" accept="image/*" />
// v-model = tableau d'UploaderFile ({ file, url, name, size, status, message }).
// Grille de tuiles d'aperçu (images via object URL, autres via icône fichier),
// clic sur une image → preview plein écran (QImagePreview), bouton × pour supprimer.
// Props : accept, multiple, max-count, max-size, deletable, preview-full-image,
// disabled, readonly, label, before-read. Events : oversize, delete, click-preview.
import { computed, onBeforeUnmount, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import QImagePreview from "./QImagePreview.vue"

/** Un fichier de la liste : fichier réel + métadonnées d'affichage */
export interface UploaderFile {
  /** Fichier réel (absent pour les items pré-remplis par url) */
  file?: File
  /** URL d'aperçu (créée pour les images, ou fournie pour les items pré-remplis) */
  url?: string
  name?: string
  size?: number
  /** Statut libre (ex. "uploading" | "done" | "failed") */
  status?: string
  /** Message affiché sous la tuile (ex. erreur) */
  message?: string
}

interface Props {
  /** Liste des fichiers (v-model) */
  modelValue?: UploaderFile[]
  /** Types acceptés par le sélecteur (défaut image/*) */
  accept?: string
  /** Sélection multiple */
  multiple?: boolean
  /** Nombre max de fichiers (0 = illimité) */
  maxCount?: number
  /** Taille max en octets (0 = illimité) — fichiers plus gros → event oversize */
  maxSize?: number
  /** Affiche le bouton supprimer sur les tuiles (défaut true) */
  deletable?: boolean
  /** Clic sur une image → preview plein écran (défaut true) */
  previewFullImage?: boolean
  /** Champ désactivé */
  disabled?: boolean
  /** Lecture seule (pas d'ajout ni de suppression) */
  readonly?: boolean
  /** Libellé sous l'icône du bouton d'ajout (défaut "Upload") — remplacé par placeholder */
  label?: string
  /** Texte du bouton d'ajout (prioritaire sur label) */
  placeholder?: string
  /** Icône du bouton d'ajout (défaut lucide:image-plus) */
  uploadIcon?: string
  /** Icône et texte du bouton d'ajout sur la même ligne */
  inlinePlaceholder?: boolean
  /** Affiche le nom et la taille du fichier sous chaque tuile (défaut false) */
  details?: boolean
  /** Hook de validation avant ajout : retourner false (ou Promise false) rejette le fichier */
  beforeRead?: (file: File) => boolean | Promise<boolean>
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: "image/*",
  multiple: false,
  maxCount: 0,
  maxSize: 0,
  deletable: true,
  previewFullImage: true,
  disabled: false,
  readonly: false,
  label: "Upload",
  placeholder: "",
  uploadIcon: icons.imagePlus,
  inlinePlaceholder: false,
  details: false,
  beforeRead: undefined,
  class: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: UploaderFile[]]
  oversize: [file: File]
  delete: [file: UploaderFile]
  "click-preview": [file: UploaderFile]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const items = computed(() => props.modelValue)

const canAdd = computed(
  () =>
    !props.disabled &&
    !props.readonly &&
    (!props.maxCount || items.value.length < props.maxCount),
)

/** Crée un UploaderFile : URL d'aperçu pour les images, icône pour les autres */
const createItem = (file: File): UploaderFile => {
  const item: UploaderFile = { file, name: file.name, size: file.size }
  if (file.type.startsWith("image/")) item.url = URL.createObjectURL(file)
  return item
}

const pickFiles = () => {
  if (!canAdd.value) return
  inputRef.value?.click()
}

const handleChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  const added: UploaderFile[] = []

  for (const file of files) {
    if (!canAdd.value && !added.length) break
    if (props.maxSize && file.size > props.maxSize) {
      emit("oversize", file)
      continue
    }
    if (props.beforeRead) {
      const ok = await props.beforeRead(file)
      if (ok === false) continue
    }
    added.push(createItem(file))
  }

  if (added.length) {
    const next = [...items.value, ...added]
    emit(
      "update:modelValue",
      props.maxCount ? next.slice(0, props.maxCount) : next,
    )
  }
  input.value = ""
}

const removeItem = (index: number) => {
  if (props.disabled || props.readonly) return
  const item = items.value[index]
  if (!item) return
  if (item.url?.startsWith("blob:")) URL.revokeObjectURL(item.url)
  const next = [...items.value]
  next.splice(index, 1)
  emit("update:modelValue", next)
  emit("delete", item)
}

// — Preview plein écran (QImagePreview) —
const previewOpen = ref(false)
const previewIndex = ref(0)
const imageItems = computed(() => items.value.filter((i) => i.url))
const previewImages = computed(() => imageItems.value.map((i) => i.url!))

const openPreview = (item: UploaderFile) => {
  emit("click-preview", item)
  if (!props.previewFullImage || !item.url) return
  previewIndex.value = Math.max(
    0,
    imageItems.value.findIndex((i) => i === item),
  )
  previewOpen.value = true
}

onBeforeUnmount(() => {
  // Libère les object URLs créées
  for (const item of items.value) {
    if (item.url?.startsWith("blob:")) URL.revokeObjectURL(item.url)
  }
})

/** Taille lisible (octets → "1.4 MB") */
const formatSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null || Number.isNaN(bytes)) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <div class="q-uploader" :class="cn(disabled && 'q-uploader--disabled', props.class)">
    <div class="q-uploader__grid">
      <!-- Tuiles des fichiers -->
      <div
        v-for="(item, i) in items"
        :key="item.url ?? item.file?.name ?? i"
        class="q-uploader__item"
        :class="{
          'q-uploader__item--failed': item.status === 'failed',
          'q-uploader__item--details': details,
        }"
      >
        <slot v-if="$slots.file" name="file" :item="item" :index="i" />
        <template v-else>
          <button
            v-if="item.url"
            type="button"
            class="q-uploader__preview"
            :aria-label="`Preview ${item.name ?? i + 1}`"
            @click="openPreview(item)"
          >
            <img class="q-uploader__img" :src="item.url" :alt="item.name ?? `File ${i + 1}`" />
          </button>
          <div v-else class="q-uploader__file">
            <Icon :icon="icons.file" class="q-uploader__file-icon" aria-hidden="true" />
            <span class="q-uploader__file-name">{{ item.name ?? `File ${i + 1}` }}</span>
          </div>
        </template>

        <span v-if="item.message" class="q-uploader__message">{{ item.message }}</span>

        <button
          v-if="deletable && !disabled && !readonly"
          type="button"
          class="q-uploader__remove"
          :aria-label="`Remove ${item.name ?? i + 1}`"
          @click.stop="removeItem(i)"
        >
          <Icon :icon="icons.x" aria-hidden="true" />
        </button>

        <!-- Nom + taille sous la tuile (prop details) -->
        <div v-if="details" class="q-uploader__details">
          <span class="q-uploader__details-name">{{ item.name ?? `File ${i + 1}` }}</span>
          <span v-if="item.size != null" class="q-uploader__details-size">
            {{ formatSize(item.size) }}
          </span>
        </div>
      </div>

      <!-- Bouton d'ajout -->
      <div
        v-if="canAdd"
        class="q-uploader__add"
        :class="{ 'q-uploader__add--inline': inlinePlaceholder }"
        role="button"
        tabindex="0"
        @click="pickFiles"
        @keydown.enter.prevent="pickFiles"
      >
        <slot v-if="$slots.default" />
        <template v-else>
          <Icon :icon="uploadIcon" class="q-uploader__add-icon" aria-hidden="true" />
          <span class="q-uploader__add-label">{{ placeholder || label }}</span>
        </template>
      </div>
    </div>

    <input
      ref="inputRef"
      class="q-uploader__input"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />
    <q-image-preview
      v-model="previewOpen"
      :images="previewImages"
      v-model:index="previewIndex"
      transition="up"
      close-btn
      :counter="true"
    />
  </div>
</template>

<style scoped>
.q-uploader {
  display: inline-block;
  max-width: 100%;
}
.q-uploader--disabled {
  opacity: 0.55;
}

.q-uploader__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.q-uploader__item {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgb(0 0 0 / 0.1);
  background: var(--muted);
}
.dark .q-uploader__item {
  border-color: var(--border);
}

.q-uploader__preview {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  cursor: pointer;
  background: transparent;
}
.q-uploader__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* mode details : la tuile devient une colonne (aperçu + nom/taille) */
.q-uploader__item--details {
  display: flex;
  flex-direction: column;
  height: auto;
  border: none;
  background: transparent;
  overflow: visible;
}
.q-uploader__item--details .q-uploader__preview,
.q-uploader__item--details .q-uploader__file {
  height: 88px;
  border-radius: 10px;
  overflow: hidden;
}
.q-uploader__item--details .q-uploader__file {
  background: var(--muted);
  border: 1px solid rgb(0 0 0 / 0.1);
}
.q-uploader__details {
  width: 100%;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.q-uploader__details-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.q-uploader__details-size {
  font-size: 10.5px;
  color: #8b93a1;
}

/* fichier non-image : icône + nom */
.q-uploader__file {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 100%;
  padding: 8px;
  color: var(--foreground);
}
.q-uploader__file-icon {
  font-size: 26px;
  color: var(--primary);
}
.q-uploader__file-name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10.5px;
  color: #8b93a1;
}

/* message d'état (erreur…) */
.q-uploader__message {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 3px 6px;
  background: rgb(198 40 40 / 0.9);
  color: #fff;
  font-size: 10px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.q-uploader__item--failed {
  border-color: var(--negative);
}

/* bouton supprimer */
.q-uploader__remove {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.55);
  color: #fff;
  cursor: pointer;
}
.q-uploader__remove:hover {
  background: rgb(0 0 0 / 0.75);
}
.q-uploader__remove svg {
  width: 11px;
  height: 11px;
}

/* bouton d'ajout : tuile en pointillés */
.q-uploader__add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 88px;
  height: 88px;
  border: 1.5px dashed rgb(0 0 0 / 0.25);
  border-radius: 10px;
  color: #8b93a1;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background-color 0.15s ease;
}
.dark .q-uploader__add {
  border-color: var(--border);
}
.q-uploader__add:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgb(25 118 210 / 0.06);
}
.q-uploader__add-icon {
  font-size: 24px;
}
.q-uploader__add-label {
  font-size: 11.5px;
  font-weight: 600;
}

/* mode inline : icône et texte sur la même ligne */
.q-uploader__add--inline {
  flex-direction: row;
  gap: 8px;
  width: auto;
  height: 44px;
  padding: 0 18px;
  border-radius: 10px;
}
.q-uploader__add--inline .q-uploader__add-icon {
  font-size: 18px;
}

/* input caché */
.q-uploader__input {
  display: none;
}
</style>
