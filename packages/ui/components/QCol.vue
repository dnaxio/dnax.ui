<script setup lang="ts">
// QCol — cellule de la grille : <q-col :span="6" :span-md="4" :offset="1">
// Responsive : span-sm/md/lg/xl et offset-* écrasent la valeur de base au breakpoint.
import { computed } from "vue"

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

// Les classes responsive (span-md-*…) sont TOUJOURS posées — ce sont les
// @media (min-width) du CSS qui les activent au bon breakpoint (pas de JS).
const classes = computed(() => ({
  ...(props.span !== "auto" ? { [`q-col--span-${props.span}`]: true } : {}),
  ...(props.offset ? { [`q-col--offset-${props.offset}`]: true } : {}),
  ...(props.spanSm !== undefined && props.spanSm !== "auto" ? { [`q-col--span-sm-${props.spanSm}`]: true } : {}),
  ...(props.offsetSm ? { [`q-col--offset-sm-${props.offsetSm}`]: true } : {}),
  ...(props.spanMd !== undefined && props.spanMd !== "auto" ? { [`q-col--span-md-${props.spanMd}`]: true } : {}),
  ...(props.offsetMd ? { [`q-col--offset-md-${props.offsetMd}`]: true } : {}),
  ...(props.spanLg !== undefined && props.spanLg !== "auto" ? { [`q-col--span-lg-${props.spanLg}`]: true } : {}),
  ...(props.offsetLg ? { [`q-col--offset-lg-${props.offsetLg}`]: true } : {}),
  ...(props.spanXl !== undefined && props.spanXl !== "auto" ? { [`q-col--span-xl-${props.spanXl}`]: true } : {}),
  ...(props.offsetXl ? { [`q-col--offset-xl-${props.offsetXl}`]: true } : {}),
}))

const style = computed(() => (props.alignSelf !== "stretch" ? { alignSelf: props.alignSelf } : undefined))
</script>

<template>
  <div class="q-col" :class="classes" :style="style">
    <slot />
  </div>
</template>
