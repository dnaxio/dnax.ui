<script setup lang="ts">
// QFilePicker — API Quasar : <q-file-picker v-model="files" multiple label="Pièces jointes" />
// Sélection de fichiers (input masqué) : aperçu vignette pour les images,
// icône typée + nom + taille sinon ; validation (type, taille, nombre).
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { fileIconKind, formatFileSize, selectFiles } from "../lib/fileList"
import type { FileIconKind } from "../lib/fileList"

interface Props {
  /** Fichier(s) sélectionné(s) — File (simple) ou File[] (multiple) */
  modelValue?: File | File[] | null
  /** Autorise plusieurs fichiers */
  multiple?: boolean
  /** Types acceptés (mêmes règles qu'un input file ; vide = tout) */
  accept?: string
  /** Taille max en octets (0 = illimité) */
  maxFileSize?: number
  /** Nombre max de fichiers (0 = illimité) */
  maxFiles?: number
  /** Label du champ */
  label?: string
  /** Texte du bouton d'ajout (défaut : "Ajouter un fichier" / "Ajouter des fichiers") */
  addLabel?: string
  /** Aide affichée sous la liste */
  hint?: string
  /** État d'erreur externe */
  error?: boolean
  /** Message d'erreur (surcharge l'erreur interne de validation) */
  errorMessage?: string
  disable?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  multiple: false,
  accept: "",
  maxFileSize: 0,
  maxFiles: 0,
  label: "",
  addLabel: "",
  hint: "",
  error: false,
  errorMessage: "",
  disable: false,
  readonly: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: File | File[] | null]
  add: [file: File]
  remove: [file: File]
  rejected: [file: File, reason: "size" | "type" | "count"]
}>()

const files = computed<File[]>(() => {
  const v = props.modelValue
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
})

// — Aperçus (images) : object URL par fichier, révoqué à la suppression / au remplacement —
const previewUrls = reactive(new Map<File, string>())

const previewUrl = (file: File): string => {
  if (!previewUrls.has(file)) previewUrls.set(file, URL.createObjectURL(file))
  return previewUrls.get(file)!
}

const revoke = (file: File) => {
  const url = previewUrls.get(file)
  if (url) {
    URL.revokeObjectURL(url)
    previewUrls.delete(file)
  }
}

watch(files, (current) => {
  for (const file of [...previewUrls.keys()]) {
    if (!current.includes(file)) revoke(file)
  }
})

onBeforeUnmount(() => {
  for (const file of [...previewUrls.keys()]) revoke(file)
})

const isImage = (file: File) => file.type.startsWith("image/")

// — Clé de rendu stable par instance de File (un File n'a pas d'id natif) —
const fileIds = new WeakMap<File, number>()
let fileIdCounter = 0
const fileKey = (file: File): number => {
  let id = fileIds.get(file)
  if (id === undefined) {
    id = ++fileIdCounter
    fileIds.set(file, id)
  }
  return id
}

// — Icône par type de fichier (règles partagées avec QSpreadsheet `attachment`) —
const ICON_BY_KIND: Record<FileIconKind, string> = {
  image: icons.fileImage,
  video: icons.fileVideo,
  audio: icons.fileAudio,
  archive: icons.fileArchive,
  spreadsheet: icons.fileSpreadsheet,
  code: icons.fileCode,
  file: icons.fileText,
}

const iconFor = (file: File): string => ICON_BY_KIND[fileIconKind(file)]

const formatSize = formatFileSize

const formatMaxSize = () => {
  const bytes = props.maxFileSize
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} Mo`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${bytes} octets`
}

const internalError = ref("")

const showError = computed(() => props.error || internalError.value !== "")
const effectiveErrorMessage = computed(() => props.errorMessage || internalError.value)

// — Sélection —
const inputEl = ref<HTMLInputElement | null>(null)

const pick = () => {
  if (props.disable || props.readonly) return
  inputEl.value?.click()
}

const onInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const selected = Array.from(input.files ?? [])
  input.value = "" // permet de re-sélectionner le même fichier
  internalError.value = ""
  if (selected.length > 0) addFiles(selected)
}

const addFiles = (incoming: File[]) => {
  const current = files.value
  const { accepted, rejected } = selectFiles(incoming, {
    accept: props.accept,
    maxSize: props.maxFileSize,
    maxFiles: props.maxFiles,
    current: current.length,
  })

  if (accepted.length > 0) {
    const next = props.multiple ? [...current, ...accepted] : accepted[0]!
    emit("update:modelValue", next)
    for (const file of accepted) emit("add", file)
  }

  if (rejected.length > 0) {
    const reasons = [...new Set(rejected.map((r) => r.reason))]
    const parts: string[] = []
    if (reasons.includes("size")) parts.push(`Fichier trop lourd (max ${formatMaxSize()})`)
    if (reasons.includes("type")) parts.push("Type de fichier non accepté")
    if (reasons.includes("count")) parts.push(`Nombre maximum : ${props.maxFiles}`)
    internalError.value = parts.join(" · ")
    for (const r of rejected) emit("rejected", r.file, r.reason)
  }
}

const removeFile = (file: File) => {
  if (props.disable || props.readonly) return
  revoke(file)
  const next = files.value.filter((f) => f !== file)
  emit("update:modelValue", props.multiple ? next : (next[0] ?? null))
  emit("remove", file)
}

const canAdd = computed(() => {
  if (props.disable || props.readonly) return false
  if (!props.multiple && files.value.length > 0) return true // remplacement
  if (props.maxFiles > 0 && files.value.length >= props.maxFiles) return false
  return true
})

const defaultAddLabel = computed(() =>
  props.addLabel || (props.multiple ? "Ajouter des fichiers" : "Ajouter un fichier"),
)

const containerClasses = computed(() => cn("q-file-picker", props.disable && "q-field--disabled"))
</script>

<template>
  <div class="q-file-picker" :class="containerClasses">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>

    <div class="q-file-picker__list">
      <div v-for="file in files" :key="fileKey(file)" class="q-file-picker__row">
        <div class="q-file-picker__preview">
          <img v-if="isImage(file)" class="q-file-picker__thumb" :src="previewUrl(file)" :alt="file.name" />
          <Icon :icon="iconFor(file)" v-else class="q-file-picker__file-icon" />
        </div>
        <div class="q-file-picker__info">
          <span class="q-file-picker__name">{{ file.name }}</span>
          <span class="q-file-picker__size">{{ formatSize(file.size) }}</span>
        </div>
        <button
          v-if="!disable && !readonly"
          type="button"
          class="q-file-picker__remove"
          aria-label="Retirer le fichier"
          @click="removeFile(file)"
        >
          <Icon :icon="icons.x" aria-hidden="true" />
        </button>
      </div>

      <button
        v-if="canAdd"
        type="button"
        class="q-file-picker__add"
        :disabled="disable"
        @click="pick"
      >
        <Icon :icon="icons.filePlus" class="q-file-picker__add-icon" />
        <span class="q-file-picker__add-label">{{ defaultAddLabel }}</span>
      </button>
    </div>

    <div class="q-field__bottom">
      <div v-if="showError" class="q-field__error">
        <slot name="error">{{ effectiveErrorMessage }}</slot>
      </div>
      <div v-else-if="hint || $slots.hint" class="q-field__hint">
        <slot name="hint">{{ hint }}</slot>
      </div>
    </div>

    <input
      ref="inputEl"
      type="file"
      class="q-file-picker__input"
      :accept="accept"
      :multiple="multiple"
      @change="onInputChange"
    />
  </div>
</template>
