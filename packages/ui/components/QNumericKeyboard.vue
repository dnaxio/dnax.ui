<script setup lang="ts">
// QNumericKeyboard — pavé numérique à l'écran : code PIN, montant, numéro. La valeur est une
// **chaîne** (elle garde les zéros de tête d'un code et le séparateur tel quel) ; c'est
// l'application qui l'affiche (points d'un code, montant formaté…).
//
//   <q-numeric-keyboard v-model="pin" :max-length="6" @complete="submit" />
//   <q-numeric-keyboard v-model="amount" mode="decimal" :max-decimals="2" clearable />
//
// Les règles de saisie (longueur, décimales, zéros de tête, effacement) vivent dans
// `lib/numericKeyboard.ts` (pur, testé).
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import {
  applyDigitOrder,
  digitCount,
  keypadLayout,
  pressKey,
  shuffledDigits,
  type KeypadKey,
  type KeypadMode,
} from "../lib/numericKeyboard"
import { cn } from "../lib/utils"

interface Props {
  /** Valeur saisie (chaîne) */
  modelValue?: string
  /** `numeric` (défaut : code, téléphone) ou `decimal` (montant : touche séparateur) */
  mode?: KeypadMode
  /** Longueur maximale, en **chiffres** (0 = illimité) — 6 pour un code à six chiffres */
  maxLength?: number
  /** Décimales maximales après le séparateur (0 = illimité) */
  maxDecimals?: number
  /** Séparateur décimal affiché — `,` par défaut (français), `.` en anglais */
  decimalSeparator?: string
  /** Touche « tout effacer » (quand une case est libre : mode `numeric`) */
  clearable?: boolean
  /** Nombre de colonnes du pavé */
  columns?: number
  /** Touches plus compactes */
  dense?: boolean
  /** Affiche une rangée de **points** au-dessus du pavé (progression d'un code) ; le point qui
   *  se remplit s'anime (respecte `prefers-reduced-motion`). */
  showDots?: boolean
  /** Nombre de points affichés : par défaut `maxLength` ; si les deux sont à 0, un point par
   *  chiffre saisi (un champ masqué qui grandit). */
  dots?: number
  /** Taille des points : nombre (**px**) ou valeur CSS (`"14px"`, `"1.2rem"`, `"18px"`).
   *  Prioritaire sur `dense` (le défaut reste `--q-nk-dot-size`). */
  dotsSize?: number | string
  /** **Disposition aléatoire** des chiffres (anti-observation) : le mélange est tiré au montage
   *  côté client, puis **stable** — il ne change pas à chaque touche. Relancez-le via la méthode
   *  `shuffle()` (par ex. après chaque code). Les touches d'édition (`separator`, `C`, `⌫`) ne
   *  bougent jamais. */
  random?: boolean
  /** Thème sombre forcé (sinon celui du document) */
  dark?: boolean
  /** **État d'erreur** : les points passent en rouge et `errorMessage` s'affiche sous le pavé.
   *  Se remet à zéro tout seul dès que l'on **efface tout** (valeur vide) — l'événement
   *  `update:error` permet de le piloter en `v-model:error`. */
  error?: boolean
  /** Message affiché sous le pavé pendant l'erreur (masqué aussitôt l'erreur levée) */
  errorMessage?: string
  disable?: boolean
  /** Libellé accessible du pavé */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  mode: "numeric",
  maxLength: 0,
  maxDecimals: 0,
  decimalSeparator: ",",
  clearable: false,
  columns: 3,
  dense: false,
  showDots: false,
  dots: 0,
  random: false,
  dark: false,
  error: false,
  errorMessage: "",
  disable: false,
  label: "Clavier numérique",
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  /** Touche pressée : un chiffre, `"separator"`, `"backspace"` ou `"clear"` */
  press: [key: string]
  /** La valeur vient d'atteindre `maxLength` (valider un code automatiquement) */
  complete: [value: string]
  /** L'erreur est levée parce que l'on a tout effacé (`v-model:error`) */
  "update:error": [value: boolean]
}>()

const options = computed(() => ({
  mode: props.mode,
  maxLength: props.maxLength,
  maxDecimals: props.maxDecimals,
  decimalSeparator: props.decimalSeparator,
  clearable: props.clearable,
}))

// — Disposition aléatoire (optionnelle) —
// L'ordre est tiré **côté client** (au montage) : tirer pendant le rendu serveur ferait un écart
// d'hydratation (le serveur et le client obtiendraient deux dispositions différentes). Tant que
// l'ordre n'est pas tiré, la disposition canonique est rendue (SSR et premier rendu client
// identiques), puis le mélange s'applique.
const digitOrder = ref<string[] | null>(null)

/** Retire une nouvelle disposition aléatoire (voir la méthode exposée `shuffle`) */
const shuffle = () => {
  digitOrder.value = shuffledDigits()
}

onMounted(() => {
  if (props.random) shuffle()
})

watch(
  () => props.random,
  (enabled) => {
    if (enabled) shuffle()
    else digitOrder.value = null
  },
)

const cells = computed(() => {
  const base = keypadLayout(options.value)
  return props.random && digitOrder.value ? applyDigitOrder(base, digitOrder.value) : base
})

// — Points de progression (optionnels) —
const digitsEntered = computed(() => digitCount(props.modelValue ?? ""))

/** Total de points : `dots` explicite, sinon `maxLength`, sinon un point par chiffre saisi */
const dotTotal = computed(() => {
  if (props.dots > 0) return props.dots
  if (props.maxLength > 0) return props.maxLength
  return digitsEntered.value
})

const dotsFilled = computed(() => Math.min(digitsEntered.value, dotTotal.value))
const dotIndexes = computed(() => Array.from({ length: dotTotal.value }, (_, i) => i))

/** Points qui viennent de se remplir : le temps d'une animation « pop » */
const pulsingDots = ref<number[]>([])
let pulseTimer: ReturnType<typeof setTimeout> | undefined

watch(dotsFilled, (next, previous) => {
  if (!props.showDots || next <= (previous ?? 0)) return

  const started: number[] = []
  for (let i = Math.max(0, previous ?? 0); i < next; i++) started.push(i)
  pulsingDots.value = [...new Set([...pulsingDots.value, ...started])]

  if (pulseTimer) clearTimeout(pulseTimer)
  pulseTimer = setTimeout(() => {
    pulsingDots.value = []
    pulseTimer = undefined
  }, 340)
})

onBeforeUnmount(() => {
  if (pulseTimer) clearTimeout(pulseTimer)
})

/** Annonce lecteur d'écran (« 3 sur 6 ») : la rangée de points elle-même est décorative */
const dotsAnnouncement = computed(() =>
  props.dots > 0 || props.maxLength > 0
    ? `${dotsFilled.value} sur ${dotTotal.value}`
    : `${dotsFilled.value}`,
)

// — État d'erreur (optionnel) —
/** Erreur levée localement : l'utilisateur a **tout effacé** depuis l'erreur (état initial) */
const errorReset = ref(false)

// Une **nouvelle** erreur (la prop repasse à vrai) réaffiche points rouges + message
watch(
  () => props.error,
  (on) => {
    if (on) errorReset.value = false
  },
)

/** Vrai tant que l'erreur doit être montrée (points rouges + message) */
const hasError = computed(() => props.error && !errorReset.value)

/**
 * Remet l'erreur à zéro : masque les points rouges et le message, et prévient le parent
 * (`v-model:error`). Appelé quand l'utilisateur vide complètement le pavé.
 */
const clearError = () => {
  errorReset.value = true
  emit("update:error", false)
}

// — Taille des points —
/** `dotsSize` normalisé : nombre → px, chaîne → CSS tel quel (`undefined` = défaut CSS) */
const dotSize = computed<string | undefined>(() => {
  const v = props.dotsSize
  if (v === undefined || v === null || v === "") return undefined
  return typeof v === "number" ? `${v}px` : String(v)
})

const rootStyle = computed<Record<string, string>>(() => ({
  "--q-nk-columns": String(props.columns),
  ...(dotSize.value ? { "--q-nk-dot-size": dotSize.value } : {}),
}))

const onKey = (cell: KeypadKey) => {
  if (props.disable || cell.kind === "empty") return

  const current = props.modelValue ?? ""
  const next = pressKey(current, cell.key, options.value)

  emit("press", cell.key)

  if (next !== current) {
    emit("update:modelValue", next)
    if (props.maxLength > 0 && digitCount(next) >= props.maxLength) emit("complete", next)
  }

  // Tout effacé → retour à l'état initial : les points rouges et le message disparaissent.
  // On se fie à la touche (⌫ / C) : un pavé **déjà vide** doit aussi pouvoir lever l'erreur.
  if (props.error && next === "" && (cell.kind === "backspace" || cell.kind === "clear"))
    clearError()
}

/** Insère une touche depuis l'extérieur (raccourci clavier matériel, saisie programmée) */
const insert = (key: string) => onKey({ key, kind: "digit", label: key })

const backspace = () => onKey({ key: "backspace", kind: "backspace", label: "⌫" })
const clear = () => onKey({ key: "clear", kind: "clear", label: "C" })

const rootClasses = computed(() =>
  cn(
    "q-numeric-keyboard",
    props.dense && "q-numeric-keyboard--dense",
    props.dark && "q-numeric-keyboard--dark",
    hasError.value && "q-numeric-keyboard--error",
    props.disable && "q-numeric-keyboard--disabled",
  ),
)

defineExpose({
  /** La valeur courante */
  value: computed(() => props.modelValue ?? ""),
  /** Applique une touche (`"7"`, `"separator"`, `"backspace"`, `"clear"`) */
  press: insert,
  backspace,
  clear,
  /** Retire une nouvelle disposition aléatoire (props `random`) */
  shuffle,
})
</script>

<template>
  <div
    class="q-numeric-keyboard"
    :class="rootClasses"
    :style="rootStyle"
    role="group"
    :aria-label="label"
    :aria-invalid="hasError ? 'true' : undefined"
  >
    <div v-if="showDots" class="q-numeric-keyboard__dots">
      <span
        v-for="index in dotIndexes"
        :key="index"
        class="q-numeric-keyboard__dot"
        :class="{
          'q-numeric-keyboard__dot--filled': index < dotsFilled,
          'q-numeric-keyboard__dot--pop': pulsingDots.includes(index),
        }"
        aria-hidden="true"
      />
      <span class="q-numeric-keyboard__sr" role="status" aria-live="polite">{{ dotsAnnouncement }}</span>
    </div>

    <template v-for="(cell, index) in cells" :key="`${cell.kind}-${index}`">
      <span v-if="cell.kind === 'empty'" class="q-numeric-keyboard__key q-numeric-keyboard__key--empty" />
      <button
        v-else
        type="button"
        class="q-numeric-keyboard__key"
        :class="`q-numeric-keyboard__key--${cell.kind}`"
        :disabled="disable"
        :aria-label="cell.ariaLabel"
        @click="onKey(cell)"
      >
        <Icon v-if="cell.kind === 'backspace'" :icon="icons.backspace" aria-hidden="true" />
        <template v-else>{{ cell.label }}</template>
      </button>
    </template>

    <p v-if="hasError && errorMessage" class="q-numeric-keyboard__error" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>
