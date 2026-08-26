<script setup lang="ts">
// QInnerLoading — overlay de chargement dans un conteneur : <q-inner-loading showing label="…" color="primary" />
// Le parent doit être position: relative. Rendu en fondu (Transition).
import { computed } from "vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

const SIZE_MAP: Record<string, string> = { sm: "20px", md: "32px", lg: "48px" }

interface Props {
  /** Affiche/masque le loading */
  showing?: boolean
  /** Libellé sous le spinner */
  label?: string
  /** Taille : sm | md | lg ou valeur CSS */
  size?: string
  /** Couleur du spinner (token ou hex) */
  color?: string
  /** Fond sombre */
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showing: false,
  size: "md",
  color: "primary",
  dark: false,
})

const spinnerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  style.width = SIZE_MAP[props.size] ?? props.size
  style.height = SIZE_MAP[props.size] ?? props.size
  style.color = colorValue(props.color)
  return style
})

const overlayClasses = computed(() => cn("q-inner-loading", props.dark && "q-inner-loading--dark"))
</script>

<template>
  <Transition name="q-inner-loading">
    <div
      v-if="showing"
      class="q-inner-loading"
      :class="overlayClasses"
      role="status"
      aria-live="polite"
    >
      <slot>
        <span class="q-spinner" :style="spinnerStyle" aria-hidden="true" />
        <span v-if="label" class="q-inner-loading__label">{{ label }}</span>
      </slot>
    </div>
  </Transition>
</template>
