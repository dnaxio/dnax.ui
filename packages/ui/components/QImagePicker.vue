<script setup lang="ts">
// QImagePicker — API Quasar : <q-image-picker v-model="files" multiple label="Photos" max-file-size="5242880" />
// Sélection d'images via input file masqué, avec aperçu en grille (object URLs),
// suppression par tuile et validation (type, taille, nombre).
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"

interface Props {
  /** Fichier(s) sélectionné(s) — File (simple) ou File[] (multiple) */
  modelValue?: File | File[] | null
  /** Autorise plusieurs fichiers */
  multiple?: boolean
  /** Types acceptés (mêmes règles qu'un input file) */
  accept?: string
  /** Taille max en octets (0 = illimité) */
  maxFileSize?: number
  /** Nombre max de fichiers (0 = illimité) */
  maxFiles?: number
  /** Label du champ */
  label?: string
  /** Texte de la tuile d'ajout (défaut : "Ajouter une image" / "Ajouter des images") */
  addLabel?: string
  /** Aide affichée sous la grille */
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
  accept: "image/*",
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

// — Aperçus : un object URL par fichier, révoqué à la suppression / au remplacement —
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

// modelValue remplacé de l'extérieur → nettoie les aperçus des fichiers disparus
watch(files, (current) => {
  for (const file of [...previewUrls.keys()]) {
    if (!current.includes(file)) revoke(file)
  }
})

onBeforeUnmount(() => {
  for (const file of [...previewUrls.keys()]) revoke(file)
})

// — Validation —
const acceptsFile = (file: File): boolean => {
  const accept = props.accept.trim()
  if (!accept) return true
  const patterns = accept
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
  if (patterns.length === 0) return true
  const name = file.name.toLowerCase()
  return patterns.some((p) => {
    if (p === "image/*") return file.type.startsWith("image/")
    if (p === "video/*") return file.type.startsWith("video/")
    if (p === "audio/*") return file.type.startsWith("audio/")
    if (p.startsWith(".")) return name.endsWith(p)
    if (p.includes("/")) return file.type.toLowerCase() === p
    return false
  })
}

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
  const valid: File[] = []
  const rejections: { file: File; reason: "size" | "type" | "count" }[] = []

  for (const file of incoming) {
    if (props.maxFileSize > 0 && file.size > props.maxFileSize) {
      rejections.push({ file, reason: "size" })
      continue
    }
    if (!acceptsFile(file)) {
      rejections.push({ file, reason: "type" })
      continue
    }
    valid.push(file)
  }

  const quota = props.maxFiles > 0 ? props.maxFiles : Infinity
  const remaining = quota === Infinity ? Infinity : Math.max(0, quota - current.length)
  const accepted = remaining === Infinity ? valid : valid.slice(0, remaining)
  const overflow = remaining === Infinity ? [] : valid.slice(remaining)
  for (const file of overflow) rejections.push({ file, reason: "count" })

  if (accepted.length > 0) {
    const next = props.multiple ? [...current, ...accepted] : accepted[0]!
    emit("update:modelValue", next)
    for (const file of accepted) emit("add", file)
  }

  if (rejections.length > 0) {
    const reasons = [...new Set(rejections.map((r) => r.reason))]
    const parts: string[] = []
    if (reasons.includes("size")) parts.push(`Fichier trop lourd (max ${formatMaxSize()})`)
    if (reasons.includes("type")) parts.push("Type de fichier non accepté")
    if (reasons.includes("count")) parts.push(`Nombre maximum : ${props.maxFiles}`)
    internalError.value = parts.join(" · ")
    for (const r of rejections) emit("rejected", r.file, r.reason)
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
  props.addLabel || (props.multiple ? "Ajouter des images" : "Ajouter une image"),
)

const containerClasses = computed(() => cn("q-image-picker", props.disable && "q-field--disabled"))
</script>

<template>
  <div class="q-image-picker" :class="containerClasses">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>

    <div class="q-image-picker__grid">
      <div v-for="file in files" :key="previewUrl(file)" class="q-image-picker__item">
        <img class="q-image-picker__thumb" :src="previewUrl(file)" :alt="file.name" />
        <button
          v-if="!disable && !readonly"
          type="button"
          class="q-image-picker__remove"
          aria-label="Retirer l'image"
          @click="removeFile(file)"
        >
          <Icon :icon="icons.x" aria-hidden="true" />
        </button>
      </div>

      <button
        v-if="canAdd"
        type="button"
        class="q-image-picker__add"
        :disabled="disable"
        @click="pick"
      >
        <Icon :icon="icons.imagePlus" class="q-image-picker__add-icon" />
        <span v-if="defaultAddLabel" class="q-image-picker__add-label">{{ defaultAddLabel }}</span>
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
      class="q-image-picker__input"
      :accept="accept"
      :multiple="multiple"
      @change="onInputChange"
    />
  </div>
</template>
