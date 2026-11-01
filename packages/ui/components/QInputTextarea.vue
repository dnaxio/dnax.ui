<script setup lang="ts">
// QInputTextarea — champ multiligne dédié : <q-input-textarea v-model="bio" label="Bio" :rows="3" />
// Contrairement à `q-input` (qui bascule entre `<input>` et `<textarea>`), ce composant
// est un textarea **seul** : lignes visibles (`rows`), plafond d'auto-extension
// (`maxRows`), redimensionnement manuel (`resize`), compteur et états — avec le
// vocabulaire de champ commun (outlined / filled / borderless / dense / radius / error).
import { computed, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"
import { useTextareaAutosize } from "../lib/useTextareaAutosize"

interface Props {
  modelValue?: string | number | null
  /** Label affiché au-dessus du champ */
  label?: string
  /** Aide affichée sous le champ */
  hint?: string
  /** État d'erreur */
  error?: boolean
  /** Message d'erreur (affiché quand error) */
  errorMessage?: string
  /** Affiche le compteur de caractères (nécessite maxlength) */
  counter?: boolean
  maxlength?: number
  /** Nombre de lignes visibles (hauteur du champ hors auto-extension) */
  rows?: number
  /** Plafond d'auto-extension en lignes, 0 = illimité : au-delà, le champ défile */
  maxRows?: number
  /** Le champ grandit avec le contenu jusqu'à `maxRows`, puis défile */
  autogrow?: boolean
  /** Redimensionnement manuel (sans effet en `autogrow`) */
  resize?: "none" | "vertical" | "both"
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
  disable?: boolean
  readonly?: boolean
  placeholder?: string
  /** Préfixe dans le champ */
  prefix?: string
  /** Suffixe dans le champ */
  suffix?: string
  /** Icône Iconify à gauche (remplacée par le slot #prepend s'il est fourni) */
  iconLeft?: string
  /** Icône Iconify à droite (remplacée par le slot #append s'il est fourni) */
  iconRight?: string
  /** Attribut autocomplete du champ natif */
  autocomplete?: string
  /** Correction orthographique du navigateur */
  spellcheck?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  maxRows: 0,
  autogrow: false,
  resize: "none",
  error: false,
  counter: false,
  clearable: false,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  disable: false,
  readonly: false,
  spellcheck: false,
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
const nativeEl = ref<HTMLTextAreaElement | null>(null)

// radius : prop explicite > composantProps.QInputTextarea ; échelle → --q-radius
const effectiveRadius = useRadius("QInputTextarea", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const value = computed(() => String(props.modelValue ?? ""))

const fieldClasses = computed(() =>
  cn(
    "q-input-textarea",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    effectiveRadius.value === true && "q-field--rounded",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
    focused.value && "q-field--float",
    props.autogrow && "q-input-textarea--autogrow",
  ),
)

// Auto-extension : mesure + plafond `maxRows` (calcul pur dans `lib/textarea.ts`),
// re-mesurée au montage, à chaque changement de valeur/lignes et au changement de
// largeur (le texte se replie autrement).
const { resize } = useTextareaAutosize(nativeEl, {
  enabled: () => props.autogrow,
  maxRows: () => props.maxRows,
  sources: () => [value.value, props.rows, props.maxRows, props.autogrow],
})

// `resize` manuel inutile en auto-extension : les deux pilotent la hauteur.
const textareaStyle = computed(() =>
  props.resize === "none" || props.autogrow ? undefined : { resize: props.resize },
)

const showClear = computed(
  () => props.clearable && !props.disable && !props.readonly && value.value !== "",
)

const onInput = (e: Event) => emit("update:modelValue", (e.target as HTMLTextAreaElement).value)

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
  void resize()
  nativeEl.value?.focus()
}

defineExpose({
  focus: () => nativeEl.value?.focus(),
  blur: () => nativeEl.value?.blur(),
  resize: () => void resize(),
})
</script>

<template>
  <div class="q-input-textarea" :class="fieldClasses" :style="roundedStyle">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>
    <div class="q-field__control">
      <slot name="prepend">
        <Icon v-if="iconLeft" :icon="iconLeft" class="q-field__icon" aria-hidden="true" />
      </slot>
      <span v-if="prefix" class="q-field__prefix">{{ prefix }}</span>
      <textarea
        ref="nativeEl"
        class="q-field__native"
        :value="value"
        :rows="rows"
        :style="textareaStyle"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :spellcheck="spellcheck"
        :disabled="disable || undefined"
        :readonly="readonly || undefined"
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
        {{ value.length }}/{{ maxlength }}
      </div>
    </div>
  </div>
</template>
