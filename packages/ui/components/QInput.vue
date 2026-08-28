<script setup lang="ts">
// QInput — API Quasar : <q-input v-model="…" label="Email" outlined dense clearable counter maxlength="60" hint error error-message />
// Variants : outlined (défaut) | filled | borderless ; stack-label pour label au-dessus.
import { computed, nextTick, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  modelValue?: string | number | null
  /** Type de champ (text par défaut) */
  type?: "text" | "password" | "number" | "email" | "search" | "tel" | "url"
  /** Label (flottant par défaut, au-dessus avec stackLabel) */
  label?: string
  /** Label fixé au-dessus du champ */
  stackLabel?: boolean
  /** Aide affichée sous le champ */
  hint?: string
  /** État d'erreur */
  error?: boolean
  /** Message d'erreur (affiché quand error) */
  errorMessage?: string
  /** Affiche le compteur (nécessite maxlength) */
  counter?: boolean
  maxlength?: number
  /** Préfixe dans le champ */
  prefix?: string
  /** Suffixe dans le champ */
  suffix?: string
  /** Bouton d'effacement */
  clearable?: boolean
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
  /** Textarea à hauteur auto */
  autogrow?: boolean
  disable?: boolean
  readonly?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  stackLabel: false,
  error: false,
  counter: false,
  clearable: false,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  autogrow: false,
  disable: false,
  readonly: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  keyup: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
}>()

const focused = ref(false)
const nativeEl = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

// radius : prop explicite > composantProps.QInput.radius ; échelle → --q-radius
const effectiveRadius = useRadius("QInput", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const value = computed(() => props.modelValue ?? "")

const floatActive = computed(() => focused.value || value.value !== "" || props.stackLabel)

const fieldClasses = computed(() =>
  cn(
    "q-input",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    effectiveRadius.value === true && "q-field--rounded",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
    floatActive.value && "q-field--float",
  ),
)

const resizeTextarea = async () => {
  const el = nativeEl.value
  if (el && props.autogrow) {
    await nextTick()
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }
}

watch(value, resizeTextarea)

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement | HTMLTextAreaElement).value)
}

const onFocus = (e: FocusEvent) => {
  focused.value = true
  emit("focus", e)
}

const onBlur = (e: FocusEvent) => {
  focused.value = false
  emit("blur", e)
}

const onClear = () => {
  emit("update:modelValue", "")
  emit("clear")
  nativeEl.value?.focus()
}

const showClear = computed(
  () => props.clearable && !props.disable && !props.readonly && value.value !== "",
)

const inputAttrs = computed(() => ({
  type: props.type,
  maxlength: props.maxlength,
  placeholder: props.placeholder,
  disabled: props.disable || undefined,
  readonly: props.readonly || undefined,
}))
</script>

<template>
  <div class="q-input" :class="fieldClasses" :style="roundedStyle">
    <label v-if="label && stackLabel" class="q-field__label-stack">{{ label }}</label>
    <div class="q-field__control">
      <slot name="prepend" />
      <span v-if="prefix" class="q-field__prefix">{{ prefix }}</span>
      <label v-if="label && !stackLabel" class="q-field__label">{{ label }}</label>
      <textarea
        v-if="autogrow"
        ref="nativeEl"
        class="q-field__native"
        :value="value"
        rows="1"
        v-bind="inputAttrs"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keyup="(e) => emit('keyup', e)"
        @keydown="(e) => emit('keydown', e)"
      />
      <input
        v-else
        ref="nativeEl"
        class="q-field__native"
        :value="value"
        v-bind="inputAttrs"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keyup="(e) => emit('keyup', e)"
        @keydown="(e) => emit('keydown', e)"
      />
      <span v-if="suffix" class="q-field__suffix">{{ suffix }}</span>
      <button
        v-if="showClear"
        class="q-field__clear"
        type="button"
        aria-label="Effacer"
        @click="onClear"
      >
        <Icon :icon="icons.x" aria-hidden="true" />
      </button>
      <slot name="append" />
    </div>
    <div class="q-field__bottom">
      <div v-if="error" class="q-field__error">
        <slot name="error">{{ errorMessage }}</slot>
      </div>
      <div v-else-if="hint || $slots.hint" class="q-field__hint">
        <slot name="hint">{{ hint }}</slot>
      </div>
      <div v-if="counter && maxlength" class="q-field__counter">
        {{ String(value).length }}/{{ maxlength }}
      </div>
    </div>
  </div>
</template>
