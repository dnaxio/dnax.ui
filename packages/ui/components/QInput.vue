<script setup lang="ts">
// QInput — API Quasar : <q-input v-model="…" label="Email" outlined dense clearable counter maxlength="60" hint error error-message />
// Variants : outlined (défaut) | filled | borderless ; le label est toujours affiché au-dessus du champ.
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
  /** Label affiché au-dessus du champ */
  label?: string
  /** @deprecated Le label est toujours affiché au-dessus — cette prop est ignorée */
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
  /** Icône Iconify à gauche (remplacée par le slot #prepend s'il est fourni) */
  iconLeft?: string
  /** Icône Iconify à droite (remplacée par le slot #append s'il est fourni) */
  iconRight?: string
  /** Masque de saisie : # = chiffre, A = lettre, N = alphanumérique, X = quelconque (ex. "##-##-##") */
  mask?: string
  /** Remplit les emplacements vides par "_" (défaut : la saisie s'arrête au dernier caractère) */
  fillMask?: boolean
  /** Émet la valeur sans les caractères du masque (littéraux et _) */
  unmaskedValue?: boolean
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
  fillMask: false,
  unmaskedValue: false,
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

// ═════════ Masque de saisie : # chiffre, A lettre, N alphanumérique, X quelconque ═════════
const isToken = (c: string): boolean => c === "#" || c === "A" || c === "N" || c === "X"

const matchesToken = (tok: string, c: string): boolean =>
  tok === "#"
    ? /[0-9]/.test(c)
    : tok === "A"
      ? /[a-zA-Z]/.test(c)
      : tok === "N"
        ? /[0-9a-zA-Z]/.test(c)
        : true

/** Extrait les caractères réels (emplacements tokens) d'une valeur affichée masquée. */
const unmask = (v: string, fill: boolean): string => {
  if (!props.mask) return v
  let out = ""
  let vi = 0
  for (const ch of props.mask) {
    if (!isToken(ch)) {
      if (v[vi] === ch) vi++ // littéral présent → on le consomme
      continue // sinon : ne pas consommer, c'est un vrai caractère
    }
    if (vi >= v.length) break
    const c = v[vi]!
    vi++
    if (fill && c === "_") continue // emplacement vide
    out += c
  }
  return out
}

/** Applique le masque à une chaîne de caractères bruts (littéraux insérés, caractères invalides sautés). */
const mask = (raw: string, fill: boolean): string => {
  if (!props.mask) return raw
  let out = ""
  let ri = 0
  for (const ch of props.mask) {
    // Plus de caractères bruts (sans fill) → on s'arrête (pas de littéraux de fin)
    if (ri >= raw.length && !fill) break
    if (!isToken(ch)) {
      out += ch
      continue
    }
    while (ri < raw.length && !matchesToken(ch, raw[ri]!)) ri++
    if (ri >= raw.length) {
      if (fill) out += "_"
      else break
      continue
    }
    out += raw[ri]!
    ri++
  }
  return out
}

/** Valeur affichée dans le champ : applique le masque au modelValue (brut si unmaskedValue). */
const displayValue = computed(() => {
  const v = String(props.modelValue ?? "")
  if (!props.mask) return v
  const raw = props.unmaskedValue ? v : unmask(v, props.fillMask)
  return mask(raw, props.fillMask)
})

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
  const el = e.target as HTMLInputElement | HTMLTextAreaElement
  const raw = el.value
  if (!props.mask) {
    emit("update:modelValue", raw)
    return
  }
  const masked = mask(unmask(raw, props.fillMask), props.fillMask)
  emit("update:modelValue", props.unmaskedValue ? unmask(masked, props.fillMask) : masked)
  // Replique le texte masqué dans le champ et remet le caret à la fin
  el.value = masked
  const len = masked.length
  el.setSelectionRange?.(len, len)
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
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>
    <div class="q-field__control">
      <slot name="prepend">
        <Icon v-if="iconLeft" :icon="iconLeft" class="q-field__icon" aria-hidden="true" />
      </slot>
      <span v-if="prefix" class="q-field__prefix">{{ prefix }}</span>
      <textarea
        v-if="autogrow"
        ref="nativeEl"
        class="q-field__native"
        :value="displayValue"
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
        :value="displayValue"
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
      <slot name="append">
        <Icon v-if="iconRight" :icon="iconRight" class="q-field__icon" aria-hidden="true" />
      </slot>
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
