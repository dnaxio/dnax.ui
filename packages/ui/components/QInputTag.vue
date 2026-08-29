<script setup lang="ts">
// QInputTag — champ de tags : <q-input-tag v-model="tags" label="Emails" outlined />
// Entrée/virgule ajoute · Backspace/Delete retire · flèches pour naviguer entre les
// tags · double-clic (ou Entrée) pour éditer un tag · collage multi-tags (séparateurs).
import { computed, nextTick, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  /** Tags (v-model) */
  modelValue?: string[]
  /** Label affiché au-dessus du champ */
  label?: string
  placeholder?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  /** Bordure visible */
  outlined?: boolean
  /** Fond gris, soulignement */
  filled?: boolean
  /** Aucune bordure */
  borderless?: boolean
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
  /** Hauteur réduite */
  dense?: boolean
  disable?: boolean
  readonly?: boolean
  /** Nombre max de tags (0 = illimité) */
  maxTags?: number
  /** Séparateurs de collage (défaut : virgule, point-virgule, retour ligne) */
  separators?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  disable: false,
  readonly: false,
  maxTags: 0,
  separators: () => [",", ";", "\n"],
})

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  add: [tag: string]
  remove: [tag: string]
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const editInputEl = ref<HTMLInputElement | null>(null)
const controlEl = ref<HTMLElement | null>(null)
const text = ref("")
const focusedTag = ref<number | null>(null)
const editing = ref<{ index: number; value: string } | null>(null)

const tags = computed(() => props.modelValue ?? [])

// — Ajout / retrait —
const addTag = (raw: string) => {
  const t = raw.trim()
  if (!t) return
  if (props.maxTags > 0 && tags.value.length >= props.maxTags) return
  if (tags.value.includes(t)) return
  emit("update:modelValue", [...tags.value, t])
  emit("add", t)
}

const addText = () => {
  const t = text.value.trim()
  text.value = ""
  if (t) addTag(t)
}

const removeAt = (index: number) => {
  const t = tags.value[index]
  if (t === undefined) return
  const next = [...tags.value]
  next.splice(index, 1)
  emit("update:modelValue", next)
  emit("remove", t)
  if (focusedTag.value === index) focusedTag.value = null
  inputEl.value?.focus()
}

// — Saisie —
const onInputKeydown = (e: KeyboardEvent) => {
  if (props.disable || props.readonly) return
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault()
    addText()
  }
  else if (e.key === "Backspace" && text.value === "" && tags.value.length) {
    e.preventDefault()
    removeAt(tags.value.length - 1)
  }
  else if (e.key === "ArrowLeft" && text.value === "" && tags.value.length) {
    const el = e.target as HTMLInputElement
    if (el.selectionStart === 0) {
      e.preventDefault()
      focusChip(tags.value.length - 1)
    }
  }
}

// Collage : divise par les séparateurs → plusieurs tags
const onPaste = (e: ClipboardEvent) => {
  if (props.disable || props.readonly) return
  const raw = e.clipboardData?.getData("text") ?? ""
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = raw.split(new RegExp(props.separators.map(esc).join("|")))
  if (parts.length > 1) {
    e.preventDefault()
    for (const p of parts) addTag(p)
  }
}

// — Navigation & édition des tags —
const focusChip = (index: number) => {
  const chips = controlEl.value?.querySelectorAll<HTMLElement>(".q-input-tag__chip")
  const el = chips?.[index]
  if (el) {
    el.focus()
    focusedTag.value = index
  }
  else {
    inputEl.value?.focus()
    focusedTag.value = null
  }
}

const tagKeydown = (index: number, e: KeyboardEvent) => {
  if (e.key === "Backspace" || e.key === "Delete") {
    e.preventDefault()
    removeAt(index)
  }
  else if (e.key === "ArrowRight") {
    e.preventDefault()
    focusChip(index + 1)
  }
  else if (e.key === "ArrowLeft") {
    e.preventDefault()
    if (index === 0) inputEl.value?.focus()
    else focusChip(index - 1)
  }
  else if (e.key === "Enter" || e.key === "F2") {
    e.preventDefault()
    startEdit(index)
  }
}

const startEdit = (index: number) => {
  editing.value = { index, value: tags.value[index] ?? "" }
  nextTick(() => {
    editInputEl.value?.focus()
    editInputEl.value?.select()
  })
}

const commitEdit = () => {
  if (!editing.value) return
  const { index, value } = editing.value
  editing.value = null
  const next = [...tags.value]
  const t = value.trim()
  if (!t) {
    next.splice(index, 1)
    emit("update:modelValue", next)
    emit("remove", tags.value[index]!)
  }
  else if (t !== next[index]) {
    next[index] = t
    emit("update:modelValue", next)
  }
  inputEl.value?.focus()
}

const cancelEdit = () => {
  editing.value = null
  inputEl.value?.focus()
}

const editKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault()
    commitEdit()
  }
  else if (e.key === "Escape") {
    e.preventDefault()
    cancelEdit()
  }
}

// — Radius & styles de champ —
const effectiveRadius = useRadius("QInputTag", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const fieldClasses = computed(() =>
  cn(
    "q-input-tag",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    effectiveRadius.value === true && "q-field--rounded",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
  ),
)
</script>

<template>
  <div class="q-input-tag" :class="fieldClasses" :style="roundedStyle">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>
    <div ref="controlEl" class="q-field__control q-input-tag__control" @click="inputEl?.focus()">
      <template v-for="(t, i) in tags" :key="`${t}-${i}`">
        <span
          v-if="editing?.index !== i"
          class="q-input-tag__chip"
          :class="{ 'q-input-tag__chip--focused': focusedTag === i }"
          role="button"
          :tabindex="disable || readonly ? -1 : 0"
          @click.stop="focusedTag = i"
          @dblclick.stop="startEdit(i)"
          @keydown="(e) => tagKeydown(i, e)"
          @focus="focusedTag = i"
          @blur="focusedTag = null"
        >
          <span class="q-input-tag__chip-label">{{ t }}</span>
          <button
            v-if="!disable && !readonly"
            type="button"
            class="q-input-tag__chip-remove"
            :aria-label="`Retirer ${t}`"
            @click.stop="removeAt(i)"
          >
            <Icon :icon="icons.x" aria-hidden="true" />
          </button>
        </span>
        <input
          v-else
          ref="editInputEl"
          class="q-input-tag__edit"
          :value="editing.value"
          @input="editing.value = ($event.target as HTMLInputElement).value"
          @keydown="editKeydown"
          @blur="commitEdit"
        />
      </template>
      <input
        ref="inputEl"
        class="q-field__native q-input-tag__native"
        :value="text"
        :placeholder="tags.length ? undefined : placeholder"
        :disabled="disable || undefined"
        :readonly="readonly || undefined"
        @input="text = ($event.target as HTMLInputElement).value"
        @keydown="onInputKeydown"
        @paste="onPaste"
        @focus="(e) => emit('focus', e)"
        @blur="(e) => {
          if (text.trim()) addText()
          emit('blur', e)
        }"
      />
    </div>
    <div class="q-field__bottom">
      <div v-if="error" class="q-field__error">{{ errorMessage }}</div>
      <div v-else-if="hint" class="q-field__hint">{{ hint }}</div>
    </div>
  </div>
</template>
