<script setup lang="ts">
// QRating — notation par étoiles : <q-rating v-model="note" :max="5" color="warning" size="lg" />
// Étoiles remplies jusqu'à la valeur, hover (bureau), dimming des non sélectionnées (no-dimming pour le désactiver).
import { computed, ref } from "vue"
import type { Component } from "vue"
import { Star } from "@lucide/vue"
import { colorValue } from "../lib/colors"

const SIZE_MAP: Record<string, string> = { sm: "18px", md: "22px", lg: "30px", xl: "36px" }

interface Props {
  /** Note actuelle */
  modelValue?: number
  /** Nombre d'étoiles (défaut 5) */
  max?: number
  /** Icône Lucide de l'étoile */
  icon?: Component
  /** Couleur (token ou hex) — défaut warning (ambre) */
  color?: string
  /** Couleur du texte (remplace color) */
  textColor?: string
  /** Taille : sm | md | lg | xl ou valeur CSS */
  size?: string
  /** Pas d'assombrissement des étoiles non sélectionnées */
  noDimming?: boolean
  /** Lecture seule (pas d'interaction) */
  readonly?: boolean
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 5,
  icon: Star,
  color: "warning",
  textColor: "",
  size: "md",
  noDimming: false,
  readonly: false,
  disable: false,
})

const emit = defineEmits<{ "update:modelValue": [value: number] }>()

const isDisabled = computed(() => props.readonly || props.disable)
const hoverValue = ref(0)

const displayValue = computed(() => (hoverValue.value > 0 ? hoverValue.value : props.modelValue))

const iconStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  style.width = SIZE_MAP[props.size] ?? props.size
  style.height = SIZE_MAP[props.size] ?? props.size
  style.color = props.textColor ? colorValue(props.textColor) : colorValue(props.color)
  return style
})

const isOn = (n: number) => displayValue.value >= n
const isDimmed = (n: number) => !props.noDimming && !isOn(n)

const setRating = (n: number) => {
  if (isDisabled.value) return
  emit("update:modelValue", n)
}

const setHover = (n: number) => {
  if (!isDisabled.value) hoverValue.value = n
}
</script>

<template>
  <div
    class="q-rating"
    :class="{ 'q-rating--disabled': isDisabled }"
    role="radiogroup"
    :aria-label="`Évaluation sur ${max}`"
  >
    <button
      v-for="n in max"
      :key="n"
      type="button"
      role="radio"
      class="q-rating__star"
      :class="{
        'q-rating__star--on': isOn(n),
        'q-rating__star--dimmed': isDimmed(n),
      }"
      :aria-label="`${n} étoile${n > 1 ? 's' : ''} sur ${max}`"
      :aria-checked="n === modelValue ? 'true' : 'false'"
      :disabled="isDisabled"
      @mouseenter="setHover(n)"
      @mouseleave="setHover(0)"
      @focus="setHover(n)"
      @blur="setHover(0)"
      @click="setRating(n)"
    >
      <component
        :is="icon"
        :style="iconStyle"
        :fill="isOn(n) ? 'currentColor' : 'none'"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
