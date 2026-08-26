<script setup lang="ts">
// QRadio — API Quasar : <q-radio v-model="val" val="a" label="Option A" color="secondary" dense left-label />
// Sélectionné quand modelValue === val (ou trueValue si pas de val).
import { computed } from "vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

interface Props {
  modelValue?: unknown
  /** Valeur que ce radio représente */
  val?: unknown
  trueValue?: unknown
  falseValue?: unknown
  /** Couleur (token ou hex) */
  color?: string
  /** Applique la couleur aussi à l'état non sélectionné */
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

const emit = defineEmits<{
  "update:modelValue": [value: unknown]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const selectedValue = computed(() => props.val ?? trueValue.value)
const isSelected = computed(() => props.modelValue === selectedValue.value)
const isDisabled = computed(() => props.disable || props.readonly)

const select = () => {
  if (isDisabled.value) return
  emit("update:modelValue", selectedValue.value)
}

const circleStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  const color = colorValue(props.color)
  if (isSelected.value || props.keepColor) style.borderColor = color
  return style
})

const dotStyle = computed<Record<string, string>>((): Record<string, string> =>
  isSelected.value ? { backgroundColor: colorValue(props.color) } : {},
)

const rootClasses = computed(() =>
  cn(
    "q-radio",
    props.dense && "q-radio--dense",
    props.dark && "q-radio--dark",
    props.disable && "q-radio--disabled",
  ),
)
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="isSelected ? 'true' : 'false'"
    :disabled="isDisabled"
    class="q-radio"
    :class="rootClasses"
    @click="select"
    @focus="(e) => emit('focus', e)"
    @blur="(e) => emit('blur', e)"
  >
    <span v-if="leftLabel && (label !== undefined || $slots.default)" class="q-radio__label">
      <slot>{{ label }}</slot>
    </span>
    <span class="q-radio__circle" :style="circleStyle" aria-hidden="true">
      <span v-if="isSelected" class="q-radio__dot" :style="dotStyle" />
    </span>
    <span v-if="!leftLabel && (label !== undefined || $slots.default)" class="q-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>
