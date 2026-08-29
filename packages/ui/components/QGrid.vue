<script setup lang="ts">
// QGrid — grille CSS (12 colonnes par défaut) : <q-grid :cols="12" gap="16px">
// Breakpoints configurables via les variables CSS --q-grid-bp-* (:root par défaut).
import { computed } from "vue"
import { useGridBreakpoints } from "../lib/breakpoints"

interface Props {
  /** Nombre de colonnes (défaut : 12) */
  cols?: number
  /** Espacement (string CSS ou nombre px) */
  gap?: string | number
  rowGap?: string | number
  columnGap?: string | number
  /** Colonnes à partir du breakpoint sm / md / lg / xl */
  colsSm?: number
  colsMd?: number
  colsLg?: number
  colsXl?: number
  /** Alignement vertical des cellules */
  align?: "start" | "center" | "end" | "stretch"
}

const props = withDefaults(defineProps<Props>(), {
  cols: 12,
  gap: "16px",
  align: "stretch",
})

const bp = useGridBreakpoints()

const px = (v: string | number | undefined) =>
  v === undefined ? undefined : typeof v === "number" ? `${v}px` : v

const style = computed<Record<string, string>>(() => ({
  "--q-grid-cols": String(props.cols),
  "--q-grid-gap": px(props.gap)!,
  ...(props.rowGap !== undefined ? { "--q-grid-row-gap": px(props.rowGap)! } : {}),
  ...(props.columnGap !== undefined ? { "--q-grid-column-gap": px(props.columnGap)! } : {}),
  alignItems: props.align,
}))

const classes = computed(() => ({
  ...(bp.value.sm && props.colsSm ? { [`q-grid--cols-sm-${props.colsSm}`]: true } : {}),
  ...(bp.value.md && props.colsMd ? { [`q-grid--cols-md-${props.colsMd}`]: true } : {}),
  ...(bp.value.lg && props.colsLg ? { [`q-grid--cols-lg-${props.colsLg}`]: true } : {}),
  ...(bp.value.xl && props.colsXl ? { [`q-grid--cols-xl-${props.colsXl}`]: true } : {}),
}))
</script>

<template>
  <div class="q-grid" :class="classes" :style="style">
    <slot />
  </div>
</template>
