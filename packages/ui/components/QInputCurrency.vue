<script setup lang="ts">
// QInputCurrency — champ montant : la saisie est formatée à la volée (groupement des
// milliers, décimales et séparateur de la locale) et le `v-model` porte un **nombre**
// (`number | null`), jamais la chaîne affichée.
//
//   <q-input-currency v-model="price" label="Prix" currency="EUR" outlined dense />
//   <q-input-currency v-model="amount" currency="USD" locale="en-US" :min="0" />
//
// Le symbole de la devise est un **décor** : sa place et son espacement viennent d'`Intl`
// (« 1 234,56 € » en français, « $1,234.56 » en anglais), la valeur reste éditable. Les
// bornes (`min` / `max`) et l'arrondi de la devise s'appliquent à la sortie du champ ; les
// flèches ↑ / ↓ avancent du pas (`step`, ×10 avec Maj).
// Tout le calcul vit dans `lib/currency.ts` (pur, testé).
import { computed, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import {
  applyLimits,
  caretForDigitCount,
  currencyFormat,
  digitCountBefore,
  draftFromValue,
  draftValue,
  formatAmount,
  formatDraft,
  localeOf,
  parseAmount,
  stepValue,
  type AmountDraft,
} from "../lib/currency"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { radiusStyle, useConfigLang, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  /** Montant — `null` quand le champ est vide */
  modelValue?: number | null
  /** Code ISO 4217 (défaut `"EUR"`) — `""` pour un montant sans devise */
  currency?: string
  /** Locale BCP-47 (défaut : la langue de QConfigProvider — `fr` → `fr-FR`, `en` → `en-US`) */
  locale?: string
  /** Décimales (défaut : celles de la devise — 2 pour EUR, 0 pour JPY) */
  decimals?: number
  /** Affichage de la devise : symbole (défaut), code ISO ou nom localisé */
  currencyDisplay?: "symbol" | "code" | "name"
  /** Autorise un montant négatif */
  allowNegative?: boolean
  /** Borne basse, appliquée à la sortie du champ */
  min?: number
  /** Borne haute, appliquée à la sortie du champ */
  max?: number
  /** Pas des flèches ↑ / ↓ (×10 avec Maj) */
  step?: number
  /** Label affiché au-dessus du champ */
  label?: string
  /** Aide affichée sous le champ */
  hint?: string
  /** État d'erreur */
  error?: boolean
  /** Message d'erreur (affiché quand error) */
  errorMessage?: string
  /** Bouton d'effacement (remet `null`) */
  clearable?: boolean
  /** Bordure visible */
  outlined?: boolean
  /** Fond gris, soulignement */
  filled?: boolean
  /** Aucune bordure */
  borderless?: boolean
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg */
  radius?: RadiusProp
  /** Hauteur réduite */
  dense?: boolean
  disable?: boolean
  readonly?: boolean
  placeholder?: string
  /** Icône Iconify à gauche (remplacée par le slot #prepend) */
  iconLeft?: string
  /** Icône Iconify à droite (remplacée par le slot #append) */
  iconRight?: string
  /** Nom du champ : un input caché porte la valeur brute pour l'envoi de formulaire */
  name?: string
  /** Id de l'input natif (pour un `<label for>`) */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  currency: "EUR",
  locale: "",
  currencyDisplay: "symbol",
  allowNegative: false,
  step: 1,
  error: false,
  clearable: false,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  disable: false,
  readonly: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: number | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const lang = useConfigLang()
const effectiveRadius = useRadius("QInputCurrency", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

/** Réglages de formatage : locale, devise, décimales, bornes */
const options = computed(() => ({
  locale: props.locale || localeOf(lang.value),
  currency: props.currency,
  decimals: props.decimals,
  allowNegative: props.allowNegative,
  currencyDisplay: props.currencyDisplay,
  min: props.min,
  max: props.max,
}))

const format = computed(() => currencyFormat(options.value))

const focused = ref(false)
const nativeEl = ref<HTMLInputElement | null>(null)
/** État de la frappe (indépendant de la locale) */
const draft = ref<AmountDraft>({ negative: false, integer: "", fraction: "", hasSeparator: false })

// Le modèle fait foi : au montage et à chaque changement venu de l'extérieur, on repart de
// la valeur — sauf quand l'utilisateur est en train de taper (on ne l'interrompt pas).
watch(
  () => props.modelValue,
  (value) => {
    if (focused.value) return
    if (draftValue(draft.value) === value) return
    draft.value = draftFromValue(value, options.value)
  },
  { immediate: true },
)

// La devise ou la locale changent : l'affichage se recalcule et la valeur est ramenée aux
// nouvelles décimales (un montant en JPY n'a pas de centimes) — le modèle reste cohérent
// avec ce que le champ affiche.
watch(format, () => {
  const limited = applyLimits(props.modelValue, options.value)
  if (limited !== props.modelValue) emit("update:modelValue", limited)
  if (focused.value) return
  draft.value = draftFromValue(limited, options.value)
})

const displayValue = computed(() =>
  focused.value ? formatDraft(draft.value, options.value) : formatAmount(props.modelValue, options.value),
)

const showClear = computed(
  () =>
    props.clearable &&
    !props.disable &&
    !props.readonly &&
    (props.modelValue !== null || draft.value.integer !== "" || draft.value.fraction !== ""),
)

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
  ),
)

const inputAttrs = computed(() => ({
  type: "text",
  inputmode: "decimal" as const,
  autocomplete: "off",
  id: props.id || undefined,
  placeholder: props.placeholder,
  disabled: props.disable || undefined,
  readonly: props.readonly || undefined,
  "aria-invalid": props.error || undefined,
}))

/** Écrit la valeur formatée dans l'input et replace le curseur après les mêmes chiffres */
const writeDisplay = (digitsBefore: number) => {
  const el = nativeEl.value
  if (!el) return
  const display = formatDraft(draft.value, options.value)
  el.value = display
  const caret = caretForDigitCount(display, digitsBefore)
  el.setSelectionRange(caret, caret)
}

const onInput = (event: Event) => {
  const el = event.target as HTMLInputElement
  const caret = el.selectionStart ?? el.value.length
  const digitsBefore = digitCountBefore(el.value, caret)

  draft.value = parseAmount(el.value, options.value)
  const value = draftValue(draft.value)
  if (value !== props.modelValue) emit("update:modelValue", value)

  // La saisie est reformatée immédiatement (même sans `v-model` : le champ ne peut pas
  // contenir de texte non formaté)
  writeDisplay(digitsBefore)
}

const onFocus = (event: FocusEvent) => {
  focused.value = true
  draft.value = parseAmount(
    props.modelValue === null
      ? formatDraft(draft.value, options.value)
      : formatAmount(props.modelValue, options.value),
    options.value,
  )
  emit("focus", event)
}

const onBlur = (event: FocusEvent) => {
  focused.value = false
  const limited = applyLimits(draftValue(draft.value), options.value)
  draft.value = draftFromValue(limited, options.value)
  if (limited !== props.modelValue) emit("update:modelValue", limited)
  emit("blur", event)
}

const onKeydown = (event: KeyboardEvent) => {
  if (props.disable || props.readonly) return
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return

  event.preventDefault()
  const next = stepValue(
    draftValue(draft.value),
    props.step,
    event.key === "ArrowUp" ? 1 : -1,
    event.shiftKey,
    options.value,
  )
  draft.value = draftFromValue(next, options.value)
  // Curseur en fin de saisie après le pas (tous les chiffres du brouillon)
  writeDisplay(draft.value.integer.length + draft.value.fraction.length)
  if (next !== props.modelValue) emit("update:modelValue", next)
}

const onClear = () => {
  draft.value = { negative: false, integer: "", fraction: "", hasSeparator: false }
  emit("update:modelValue", null)
  emit("clear")
  nativeEl.value?.focus()
}

/** Décale le groupe et l'espace : « 1 234,56 € » ou « $1,234.56 » */
const symbolBefore = computed(() => format.value.symbol !== "" && format.value.position === "before")
const symbolAfter = computed(() => format.value.symbol !== "" && format.value.position === "after")
</script>

<template>
  <div class="q-input q-input-currency" :class="fieldClasses" :style="roundedStyle">
    <label v-if="label" class="q-field__label-stack" :for="id">{{ label }}</label>

    <div class="q-field__control">
      <slot name="prepend">
        <Icon v-if="iconLeft" :icon="iconLeft" class="q-field__icon" aria-hidden="true" />
      </slot>

      <span v-if="symbolBefore" class="q-field__currency q-field__currency--before">{{
        format.symbol
      }}</span>

      <input
        ref="nativeEl"
        class="q-field__native"
        :value="displayValue"
        v-bind="inputAttrs"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span v-if="symbolAfter" class="q-field__currency q-field__currency--after">{{
        format.symbol
      }}</span>

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
    </div>

    <!-- Valeur brute : un formulaire classique envoie un nombre, pas un montant formaté -->
    <input v-if="name" type="hidden" :name="name" :value="modelValue === null ? '' : String(modelValue)" />
  </div>
</template>
