<script setup lang="ts">
// QCol — cellule de la grille : <q-col :span="6" :span-md="4" :offset="1">
// Responsive : span-sm/md/lg/xl et offset-* écrasent la valeur de base au breakpoint.
import { computed } from "vue"
import { useGridBreakpoints } from "../lib/breakpoints"

type ColSpan = number | "auto"

interface Props {
  /** Colonnes occupées (1..12, ou "auto") — valeur de base (mobile) */
  span?: ColSpan
  /** Décalage en colonnes */
  offset?: number
  spanSm?: ColSpan
  spanMd?: ColSpan
  spanLg?: ColSpan
  spanXl?: ColSpan
  offsetSm?: number
  offsetMd?: number
  offsetLg?: number
  offsetXl?: number
  alignSelf?: "start" | "center" | "end" | "stretch"
}

const props = withDefaults(defineProps<Props>(), {
  span: "auto",
  alignSelf: "stretch",
})

const bp = useGridBreakpoints()

const classes = computed(() => ({
  ...(props.span !== "auto" ? { [`q-col--span-${props.span}`]: true } : {}),
  ...(props.offset ? { [`q-col--offset-${props.offset}`]: true } : {}),
  ...(bp.value.sm && props.spanSm !== undefined && props.spanSm !== "auto" ? { [`q-col--span-sm-${props.spanSm}`]: true } : {}),
  ...(bp.value.sm && props.offsetSm ? { [`q-col--offset-sm-${props.offsetSm}`]: true } : {}),
  ...(bp.value.md && props.spanMd !== undefined && props.spanMd !== "auto" ? { [`q-col--span-md-${props.spanMd}`]: true } : {}),
  ...(bp.value.md && props.offsetMd ? { [`q-col--offset-md-${props.offsetMd}`]: true } : {}),
  ...(bp.value.lg && props.spanLg !== undefined && props.spanLg !== "auto" ? { [`q-col--span-lg-${props.spanLg}`]: true } : {}),
  ...(bp.value.lg && props.offsetLg ? { [`q-col--offset-lg-${props.offsetLg}`]: true } : {}),
  ...(bp.value.xl && props.spanXl !== undefined && props.spanXl !== "auto" ? { [`q-col--span-xl-${props.spanXl}`]: true } : {}),
  ...(bp.value.xl && props.offsetXl ? { [`q-col--offset-xl-${props.offsetXl}`]: true } : {}),
}))

const style = computed(() => (props.alignSelf !== "stretch" ? { alignSelf: props.alignSelf } : undefined))
</script>

<template>
  <div class="q-col" :class="classes" :style="style">
    <slot />
  </div>
</template>
