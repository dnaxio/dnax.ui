<script setup lang="ts">
// QRow — alias sémantique de QGrid (même API) : <q-row gap="12px"><q-col :span="6">…
import QGrid from "./QGrid.vue"

// Même interface que QGrid (dupliquée — pas d'import de type cross-SFC, qui exige fs)
interface Props {
  cols?: number
  gap?: string | number
  rowGap?: string | number
  columnGap?: string | number
  colsSm?: number
  colsMd?: number
  colsLg?: number
  colsXl?: number
  align?: "start" | "center" | "end" | "stretch"
}

defineProps<Props>()
</script>

<template>
  <q-grid v-bind="$props"><slot /></q-grid>
</template>
