<script setup lang="ts">
// QCheckbox — API Quasar : <q-checkbox v-model="val" label="Option" color="secondary" dense left-label keep-color />
// Modèle : booléen | indéterminé (indeterminateValue) | tableau (avec prop val).
import { computed, useSlots } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

interface Props {
  modelValue?: unknown
  /** Valeur ajoutée/retirée quand le modèle est un tableau */
  val?: unknown
  trueValue?: unknown
  falseValue?: unknown
  /** Valeur représentant l'état indéterminé (défaut : null) */
  indeterminateValue?: unknown
  /** Icônes Iconify des états (défauts : lucide:check, lucide:minus) */
  checkedIcon?: string
  uncheckedIcon?: string
  indeterminateIcon?: string
  /** Couleur (token ou hex) */
  color?: string
  /** Applique la couleur aussi à l'état décoché */
  keepColor?: boolean
  dense?: boolean
  dark?: boolean
  disable?: boolean
  readonly?: boolean
  label?: string
  /** Label à gauche du contrôle */
  leftLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  keepColor: false,
  dense: false,
  dark: false,
  disable: false,
  readonly: false,
  leftLabel: false,
})

// Defaults manuels (withDefaults ne gère pas les defaults sur props typées unknown)
const trueValue = computed(() => props.trueValue ?? true)
const falseValue = computed(() => props.falseValue ?? false)
const indeterminateValue = computed(() => props.indeterminateValue ?? null)

const emit = defineEmits<{
  "update:modelValue": [value: unknown]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keyup: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
}>()

const isArrayModel = computed(() => Array.isArray(props.modelValue))

const isChecked = computed(() =>
  isArrayModel.value
    ? (props.modelValue as unknown[]).includes(props.val)
    : props.modelValue === trueValue.value,
)

const isIndeterminate = computed(
  () => !isArrayModel.value && props.modelValue === indeterminateValue.value,
)

const isDisabled = computed(() => props.disable || props.readonly)

const toggle = () => {
  if (isDisabled.value) return
  if (isArrayModel.value) {
    const list = props.modelValue as unknown[]
    emit(
      "update:modelValue",
      isChecked.value ? list.filter((v) => v !== props.val) : [...list, props.val],
    )
  }
  else {
    // indéterminé → coché (comportement Quasar)
    emit("update:modelValue", isChecked.value ? falseValue.value : trueValue.value)
  }
}

const boxStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  const color = colorValue(props.color)
  if (isChecked.value || isIndeterminate.value) {
    style.backgroundColor = color
    style.borderColor = color // pas de contour noir autour du fond coloré
  }
  else if (props.keepColor) style.borderColor = color
  return style
})

const rootClasses = computed(() =>
  cn(
    "q-checkbox",
    props.dense && "q-checkbox--dense",
    props.dark && "q-checkbox--dark",
    props.disable && "q-checkbox--disabled",
  ),
)

const slots = useSlots()

const ariaChecked = computed(() =>
  isIndeterminate.value ? "mixed" : isChecked.value ? "true" : "false",
)

const hasLabel = computed(() => props.label !== undefined || !!slots.default)
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="ariaChecked"
    :disabled="isDisabled"
    class="q-checkbox"
    :class="rootClasses"
    @click="toggle"
    @focus="(e) => emit('focus', e)"
    @blur="(e) => emit('blur', e)"
    @keyup="(e) => emit('keyup', e)"
    @keydown="(e) => emit('keydown', e)"
  >
    <span v-if="leftLabel && hasLabel" class="q-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
    <span class="q-checkbox__box" :style="boxStyle" aria-hidden="true">
      <Icon
        :icon="indeterminateIcon || icons.minus"
        v-if="isIndeterminate"
        class="q-checkbox__icon"
      />
      <Icon :icon="checkedIcon || icons.check" v-else-if="isChecked" class="q-checkbox__icon" />
      <Icon :icon="uncheckedIcon" v-else-if="uncheckedIcon" class="q-checkbox__icon" />
    </span>
    <span v-if="!leftLabel && hasLabel" class="q-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>
