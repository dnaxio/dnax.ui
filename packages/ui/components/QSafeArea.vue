<script setup lang="ts">
// QSafeArea — applique les safe-area insets (encoche, barre d'accueil) sur les côtés demandés.
// <q-safe-area top bottom>…</q-safe-area> — padding = env(safe-area-inset-*), fallback constant() (iOS 11.0-11.2).
interface Props {
  /** padding-top = env(safe-area-inset-top) */
  top?: boolean
  /** padding-right = env(safe-area-inset-right) */
  right?: boolean
  /** padding-bottom = env(safe-area-inset-bottom) */
  bottom?: boolean
  /** padding-left = env(safe-area-inset-left) */
  left?: boolean
  /** Applique les 4 insets (équivalent top + right + bottom + left) */
  all?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  top: false,
  right: false,
  bottom: false,
  left: false,
  all: false,
})
</script>

<template>
  <div
    class="q-safe-area"
    :class="{
      'q-safe-area--top': props.all || props.top,
      'q-safe-area--right': props.all || props.right,
      'q-safe-area--bottom': props.all || props.bottom,
      'q-safe-area--left': props.all || props.left,
    }"
  >
    <slot />
  </div>
</template>
