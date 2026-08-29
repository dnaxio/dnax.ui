<script setup lang="ts">
// QInputTag — champ de tags : <q-input-tag v-model="tags" label="Emails" placeholder="Type and press Enter" outlined />
// Entrée (ou virgule) ajoute un tag, Backspace sur champ vide retire le dernier, × retire un tag.
import { computed, ref } from "vue"
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
})

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  add: [tag: string]
  remove: [tag: string]
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const text = ref("")

const tags = computed(() => props.modelValue ?? [])

const addTag = () => {
  const t = text.value.trim()
  text.value = ""
  if (!t) return
  if (props.maxTags > 0 && tags.value.length >= props.maxTags) return
  if (tags.value.includes(t)) return
  emit("update:modelValue", [...tags.value, t])
  emit("add", t)
}

const removeTag = (t: string) => {
  emit("update:modelValue", tags.value.filter((x) => x !== t))
  emit("remove", t)
  inputEl.value?.focus()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault()
    addTag()
  }
  else if (e.key === "Backspace" && text.value === "" && tags.value.length) {
    removeTag(tags.value[tags.value.length - 1]!)
  }
}

// radius : prop explicite > composantProps.QInputTag > composantProps.default
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
    <div class="q-field__control q-input-tag__control" @click="inputEl?.focus()">
      <span v-for="t in tags" :key="t" class="q-input-tag__chip">
        <span class="q-input-tag__chip-label">{{ t }}</span>
        <button
          v-if="!disable && !readonly"
          type="button"
          class="q-input-tag__chip-remove"
          :aria-label="`Retirer ${t}`"
          @click.stop="removeTag(t)"
        >
          <Icon :icon="icons.x" aria-hidden="true" />
        </button>
      </span>
      <input
        ref="inputEl"
        class="q-field__native q-input-tag__native"
        :value="text"
        :placeholder="tags.length ? undefined : placeholder"
        :disabled="disable || undefined"
        :readonly="readonly || undefined"
        @input="text = ($event.target as HTMLInputElement).value"
        @keydown="onKeydown"
        @focus="(e) => emit('focus', e)"
        @blur="(e) => {
          if (text.trim()) addTag()
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
