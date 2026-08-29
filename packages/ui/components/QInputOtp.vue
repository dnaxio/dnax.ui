<script setup lang="ts">
// QInputOtp — saisie de code à usage unique : <q-input-otp v-model="code" length="6" numeric />
// Une case par caractère, avance automatique, Backspace/Delete, flèches, collage,
// masquage (password), complétion émise via @complete.
import { computed, ref, watch } from "vue"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

type OtpSize = "sm" | "md" | "lg"

interface Props {
  /** Code (v-model) — chaîne, longueur ≤ length */
  modelValue?: string
  /** Nombre de cases (défaut : 6) */
  length?: number
  /** Label affiché au-dessus du champ */
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  /** Variantes de champ (même vocabulaire que q-input) */
  outlined?: boolean
  filled?: boolean
  borderless?: boolean
  /** Hauteur réduite */
  dense?: boolean
  disable?: boolean
  readonly?: boolean
  /** Restreint la saisie aux chiffres (inputmode numeric sur mobile) */
  numeric?: boolean
  /** Masque les caractères (type password) */
  password?: boolean
  /** Taille des cases : sm | md | lg */
  size?: OtpSize
  /** Séparateur affiché entre les groupes (ex. "-") */
  separator?: string
  /** Nombre de cases par groupe (défaut : length → aucun séparateur) */
  groupEvery?: number
  /** Focus sur la première case au montage */
  autofocus?: boolean
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  length: 6,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  disable: false,
  readonly: false,
  numeric: false,
  password: false,
  size: "md",
  separator: "",
  groupEvery: 0,
  autofocus: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  complete: [value: string]
  focus: [event: FocusEvent, index: number]
  blur: [event: FocusEvent, index: number]
}>()

const value = computed(() => props.modelValue ?? "")
const boxes = computed(() => Array.from({ length: props.length }, (_, i) => i))
const inputs = ref<(HTMLInputElement | null)[]>([])

const boxChar = (i: number) => value.value[i] ?? ""
const charType = computed(() => (props.password ? "password" : "text"))

// — Focus —
const focusBox = (i: number) => {
  const el = inputs.value[i]
  el?.focus()
  el?.select()
}

const onBoxFocus = (i: number, e: FocusEvent) => {
  ;(e.target as HTMLInputElement).select()
  emit("focus", e, i)
}

// — Saisie —
const isValidChar = (ch: string) => (props.numeric ? /[0-9]/.test(ch) : ch !== " ")

const write = (i: number, chars: string[]) => {
  const arr = value.value.split("")
  for (let k = 0; k < chars.length && i + k < props.length; k++) {
    if (!isValidChar(chars[k]!)) continue
    arr[i + k] = chars[k]!
  }
  emit("update:modelValue", arr.join(""))
  return Math.min(i + chars.length - 1, props.length - 1)
}

const onInput = (i: number, e: Event) => {
  const el = e.target as HTMLInputElement
  const text = el.value
  el.value = "" // valeur pilotée : on remplit nous-mêmes
  if (props.disable || props.readonly) return
  if (!text) return
  if (text.length > 1) {
    // collage ou saisie multiple : remplit depuis la case i
    const chars = text.replace(/\s/g, "").split("")
    const last = write(i, chars)
    focusBox(last)
    return
  }
  const ch = text[0]!
  if (!isValidChar(ch)) return
  write(i, [ch])
  if (i < props.length - 1) focusBox(i + 1)
}

const onPaste = (i: number, e: ClipboardEvent) => {
  if (props.disable || props.readonly) return
  e.preventDefault()
  const text = e.clipboardData?.getData("text") ?? ""
  const chars = text.replace(/\s/g, "").split("")
  const last = write(i, chars)
  focusBox(last)
}

// — Clavier —
const onKeydown = (i: number, e: KeyboardEvent) => {
  if (props.disable || props.readonly) return
  if (e.key === "Backspace") {
    e.preventDefault()
    if (boxChar(i)) {
      const arr = value.value.split("")
      arr[i] = ""
      emit("update:modelValue", arr.join(""))
    } else if (i > 0) {
      const arr = value.value.split("")
      arr[i - 1] = ""
      emit("update:modelValue", arr.join(""))
      focusBox(i - 1)
    }
    return
  }
  if (e.key === "Delete") {
    e.preventDefault()
    if (boxChar(i)) {
      const arr = value.value.split("")
      arr[i] = ""
      emit("update:modelValue", arr.join(""))
    }
    return
  }
  if (e.key === "ArrowLeft" && i > 0) {
    e.preventDefault()
    focusBox(i - 1)
    return
  }
  if (e.key === "ArrowRight" && i < props.length - 1) {
    e.preventDefault()
    focusBox(i + 1)
    return
  }
  // Retaper le même caractère : l'événement input ne se déclenche pas
  // (valeur identique) → on avance quand même.
  if (e.key.length === 1 && isValidChar(e.key) && boxChar(i) === e.key) {
    focusBox(i + 1)
  }
}

// — Complétion —
watch(
  value,
  (v) => {
    if (v.length === props.length && props.length > 0) emit("complete", v)
  },
)

// — Styles —
const effectiveRadius = useRadius("QInputOtp", () => props.radius)

const rootClasses = computed(() =>
  cn(
    "q-input-otp",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
  ),
)

const boxClasses = (i: number) =>
  cn(
    "q-input-otp__box",
    `q-input-otp__box--${props.size}`,
    boxChar(i) && "q-input-otp__box--filled",
    props.error && "q-input-otp__box--error",
  )

const showSeparator = (i: number) =>
  props.separator && props.groupEvery > 0 && i > 0 && i % props.groupEvery === 0
</script>

<template>
  <div class="q-input-otp" :class="rootClasses" :style="radiusStyle(effectiveRadius)">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>
    <div class="q-input-otp__boxes">
      <template v-for="i in boxes" :key="i">
        <span v-if="showSeparator(i)" class="q-input-otp__separator">{{ separator }}</span>
        <input
          :ref="(el) => (inputs[i] = el as HTMLInputElement | null)"
          :class="boxClasses(i)"
          :value="boxChar(i)"
          :type="charType"
          :inputmode="numeric ? 'numeric' : undefined"
          :autocomplete="'one-time-code'"
          :disabled="disable || undefined"
          :readonly="readonly || undefined"
          :tabindex="disable || readonly ? -1 : 0"
          :aria-label="label ? label + ', character ' + (i + 1) : 'Character ' + (i + 1)"
          @focus="onBoxFocus(i, $event)"
          @blur="(e) => emit('blur', e, i)"
          @input="onInput(i, $event)"
          @keydown="onKeydown(i, $event)"
          @paste="onPaste(i, $event)"
        />
      </template>
    </div>
    <div class="q-field__bottom">
      <div v-if="error" class="q-field__error">{{ errorMessage }}</div>
      <div v-else-if="hint" class="q-field__hint">{{ hint }}</div>
    </div>
  </div>
</template>
