<script setup lang="ts">
// QPagination — pagination : <q-pagination v-model="page" :max="10" boundary-links direction-links active-color="secondary" />
// Fenêtre de pages avec ellipses, premier/dernier et précédent/suivant optionnels.
import { computed } from "vue"
import type { Component } from "vue"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "@lucide/vue"
import { cn } from "../lib/utils"
import { colorValue, foregroundFor } from "../lib/colors"

const SIZE_MAP: Record<string, string> = { xs: "24px", sm: "28px", md: "32px", lg: "40px", xl: "48px" }

interface Props {
  /** Page courante (v-model) */
  modelValue?: number
  /** Première page (défaut 1) */
  min?: number
  /** Dernière page */
  max: number
  /** Nombre max de boutons de pages (0 = illimité) */
  maxPages?: number
  /** Boutons première/dernière */
  boundaryLinks?: boolean
  /** Boutons précédent/suivant */
  directionLinks?: boolean
  /** Icônes Lucide des boutons */
  iconFirst?: Component
  iconPrev?: Component
  iconNext?: Component
  iconLast?: Component
  /** Couleur de la page active (token ou hex) */
  activeColor?: string
  /** Couleur des autres pages (token ou hex) */
  color?: string
  /** Taille : xs | sm | md | lg | xl ou valeur CSS */
  size?: string
  /** Affiche … pour les trous */
  ellipses?: boolean
  /** Variantes de boutons */
  flat?: boolean
  outline?: boolean
  unelevated?: boolean
  rounded?: boolean
  square?: boolean
  dense?: boolean
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  min: 1,
  maxPages: 0,
  boundaryLinks: false,
  directionLinks: false,
  size: "md",
  ellipses: true,
  activeColor: "primary",
  color: "",
  flat: false,
  outline: false,
  unelevated: false,
  rounded: false,
  square: false,
  dense: false,
  disable: false,
})

const emit = defineEmits<{ "update:modelValue": [value: number] }>()

const total = computed(() => Math.max(props.min, props.max))
const clampedPage = computed(() => Math.min(Math.max(props.modelValue, props.min), total.value))

const setPage = (p: number) => {
  if (props.disable) return
  emit("update:modelValue", Math.min(Math.max(p, props.min), total.value))
}

// — Fenêtre de pages avec ellipses —
const pages = computed<(number | "ellipsis")[]>(() => {
  const totalPages = total.value
  if (totalPages <= 1) return [1]
  const maxPages = props.maxPages
  if (maxPages <= 0 || totalPages <= maxPages + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const cur = clampedPage.value
  let start = Math.max(1, cur - Math.floor((maxPages - 1) / 2))
  const end = Math.min(totalPages, start + maxPages - 1)
  start = Math.max(1, end - maxPages + 1)

  const list: (number | "ellipsis")[] = []
  if (start > 2) list.push(1, "ellipsis")
  else if (start === 2) list.push(1)
  for (let i = start; i <= end; i++) list.push(i)
  if (end < totalPages - 1) list.push("ellipsis", totalPages)
  else if (end === totalPages - 1) list.push(totalPages)
  return list
})

const btnClasses = computed(() =>
  cn(
    "q-pagination__btn",
    props.flat && "q-pagination__btn--flat",
    props.outline && "q-pagination__btn--outline",
    props.unelevated && "q-pagination__btn--unelevated",
    props.rounded && "q-pagination__btn--rounded",
    props.square && "q-pagination__btn--square",
    props.dense && "q-pagination__btn--dense",
  ),
)

const btnSize = computed<Record<string, string>>(() => {
  const s = SIZE_MAP[props.size] ?? props.size
  return { minWidth: s, height: s }
})

const activeStyle = computed<Record<string, string>>(() => ({
  backgroundColor: colorValue(props.activeColor),
  color: foregroundFor(props.activeColor),
  borderColor: "transparent",
}))

const colorStyle = computed<Record<string, string> | undefined>(() =>
  props.color ? { color: colorValue(props.color) } : undefined,
)
</script>

<template>
  <div class="q-pagination" :class="{ 'q-pagination--disabled': disable }" role="navigation" aria-label="Pagination">
    <button
      v-if="boundaryLinks"
      type="button"
      class="q-pagination__btn"
      :class="btnClasses"
      :style="[btnSize, colorStyle]"
      :disabled="disable || clampedPage <= min"
      aria-label="Première page"
      @click="setPage(min)"
    >
      <component :is="iconFirst || ChevronsLeft" aria-hidden="true" />
    </button>
    <button
      v-if="directionLinks"
      type="button"
      class="q-pagination__btn"
      :class="btnClasses"
      :style="[btnSize, colorStyle]"
      :disabled="disable || clampedPage <= min"
      aria-label="Page précédente"
      @click="setPage(clampedPage - 1)"
    >
      <component :is="iconPrev || ChevronLeft" aria-hidden="true" />
    </button>

    <button
      v-for="(p, i) in pages"
      :key="i"
      type="button"
      class="q-pagination__btn"
      :class="[btnClasses, p === clampedPage && 'q-pagination__btn--active']"
      :style="[btnSize, p === clampedPage ? activeStyle : colorStyle]"
      :disabled="disable || p === 'ellipsis'"
      :aria-label="p === 'ellipsis' ? 'Pages intermédiaires' : `Page ${p}`"
      :aria-current="p === clampedPage ? 'page' : undefined"
      @click="p !== 'ellipsis' && setPage(p)"
    >
      <span v-if="p === 'ellipsis'" class="q-pagination__ellipsis" aria-hidden="true">…</span>
      <span v-else>{{ p }}</span>
    </button>

    <button
      v-if="directionLinks"
      type="button"
      class="q-pagination__btn"
      :class="btnClasses"
      :style="[btnSize, colorStyle]"
      :disabled="disable || clampedPage >= total"
      aria-label="Page suivante"
      @click="setPage(clampedPage + 1)"
    >
      <component :is="iconNext || ChevronRight" aria-hidden="true" />
    </button>
    <button
      v-if="boundaryLinks"
      type="button"
      class="q-pagination__btn"
      :class="btnClasses"
      :style="[btnSize, colorStyle]"
      :disabled="disable || clampedPage >= total"
      aria-label="Dernière page"
      @click="setPage(total)"
    >
      <component :is="iconLast || ChevronsRight" aria-hidden="true" />
    </button>
  </div>
</template>
