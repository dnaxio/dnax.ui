<script setup lang="ts">
// QChip — API Quasar : <q-chip label="Chip" icon="…" removable color="secondary" outline square dense>
// removable → bouton de retrait qui émet "remove"
import { computed } from "vue"
import type { Component } from "vue"
import { X } from "@lucide/vue"
import { cn } from "../lib/utils"
import { colorValue, foregroundFor } from "../lib/colors"

interface Props {
  /** Texte */
  label?: string
  /** Icône Lucide à gauche */
  icon?: Component
  /** Icône Lucide à droite */
  iconRight?: Component
  /** Icône Lucide du bouton de retrait (défaut : ×) */
  iconRemove?: Component
  /** Affiche le bouton de retrait */
  removable?: boolean
  /** Contour seul */
  outline?: boolean
  /** Coins droits */
  square?: boolean
  /** Hauteur réduite */
  dense?: boolean
  /** Couleur de fond (token ou hex) */
  color?: string
  /** Couleur du texte (token ou hex) */
  textColor?: string
  /** Désactivé */
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  textColor: "",
  removable: false,
  outline: false,
  square: false,
  dense: false,
  disable: false,
})

const emit = defineEmits<{ remove: []; click: [event: MouseEvent] }>()

const chipStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  style["--q-chip-bg"] = colorValue(props.color)
  style["--q-chip-fg"] = props.textColor ? colorValue(props.textColor) : foregroundFor(props.color)
  return style
})

const chipClasses = computed(() =>
  cn(
    "q-chip",
    props.outline && "q-chip--outline",
    props.square && "q-chip--square",
    props.dense && "q-chip--dense",
    props.disable && "q-chip--disabled",
  ),
)

const onClick = (e: MouseEvent) => {
  if (props.disable) return
  emit("click", e)
}

const onRemove = () => {
  if (props.disable) return
  emit("remove")
}
</script>

<template>
  <div class="q-chip" :class="chipClasses" :style="chipStyle" @click="onClick">
    <component :is="icon" v-if="icon" class="q-chip__icon" aria-hidden="true" />
    <span v-if="label" class="q-chip__label">{{ label }}</span>
    <slot v-else />
    <component :is="iconRight" v-if="iconRight" class="q-chip__icon q-chip__icon--right" aria-hidden="true" />
    <button
      v-if="removable"
      class="q-chip__remove"
      type="button"
      aria-label="Retirer"
      @click.stop="onRemove"
    >
      <component :is="iconRemove || X" />
    </button>
  </div>
</template>
