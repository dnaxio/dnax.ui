<script setup lang="ts">
// QGrid — grille CSS responsive (layout) ET grille de cellules style Vant.
// Mode layout (défaut) : <q-grid :cols="12" gap="16px"> + <q-col> enfants.
// Mode cellules (Vant) : activé par `column-num` → <q-grid-item> enfants
// (icône + texte), ex. menu d'app : <q-grid :column-num="4" gutter="8" clickable>
import { computed } from "vue"
import { useGridBreakpoints } from "../lib/breakpoints"

interface Props {
  /** Nombre de colonnes du layout (défaut : 12) */
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

  // ── Mode cellules (Vant Grid) ──
  /** Nombre de colonnes de cellules — active le mode Vant (défaut : 4) */
  columnNum?: number
  /** Espace entre les cellules (string CSS ou nombre px) */
  gutter?: string | number
  /** Affiche les bordures entre les cellules (défaut : true) */
  border?: boolean
  /** Cellules carrées (aspect-ratio 1) */
  square?: boolean
  /** Centre le contenu des cellules (défaut : true) */
  center?: boolean
  /** Cellules cliquables (effet hover/press) */
  clickable?: boolean
  /** Orientation du contenu : icône au-dessus (vertical) ou à gauche (horizontal) */
  direction?: "vertical" | "horizontal"
  /** Inverse l'ordre icône/texte */
  reverse?: boolean
  /** Taille des icônes des cellules (défaut : 28px) */
  iconSize?: string | number
  /** Couleur des icônes des cellules (token ou hex) */
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  cols: 12,
  gap: "16px",
  align: "stretch",
  columnNum: 0,
  gutter: 0,
  border: true,
  square: false,
  center: true,
  clickable: false,
  direction: "vertical",
  reverse: false,
  iconSize: "28px",
  iconColor: "",
})

const bp = useGridBreakpoints()

const px = (v: string | number | undefined) =>
  v === undefined ? undefined : typeof v === "number" ? `${v}px` : v

/** Mode cellules (Vant) : activé dès que column-num est fourni (> 0) */
const isCellMode = computed(() => props.columnNum > 0)

const style = computed<Record<string, string>>(() => {
  const s: Record<string, string> = {}
  if (isCellMode.value) {
    s["--q-grid-cols"] = String(props.columnNum)
    s["--q-grid-gap"] = px(props.gutter)!
    s["--q-grid-item-icon-size"] = px(props.iconSize)!
    if (props.iconColor) s["--q-grid-item-icon-color"] = props.iconColor
    return s
  }
  s["--q-grid-cols"] = String(props.cols)
  s["--q-grid-gap"] = px(props.gap)!
  if (props.rowGap !== undefined) s["--q-grid-row-gap"] = px(props.rowGap)!
  if (props.columnGap !== undefined) s["--q-grid-column-gap"] = px(props.columnGap)!
  s.alignItems = props.align
  return s
})

const classes = computed(() => ({
  ...(bp.value.sm && props.colsSm ? { [`q-grid--cols-sm-${props.colsSm}`]: true } : {}),
  ...(bp.value.md && props.colsMd ? { [`q-grid--cols-md-${props.colsMd}`]: true } : {}),
  ...(bp.value.lg && props.colsLg ? { [`q-grid--cols-lg-${props.colsLg}`]: true } : {}),
  ...(bp.value.xl && props.colsXl ? { [`q-grid--cols-xl-${props.colsXl}`]: true } : {}),
  "q-grid--cell": isCellMode.value,
  "q-grid--border": isCellMode.value && props.border,
  "q-grid--square": isCellMode.value && props.square,
  "q-grid--center": isCellMode.value && props.center,
  "q-grid--clickable": isCellMode.value && props.clickable,
  "q-grid--horizontal": isCellMode.value && props.direction === "horizontal",
  "q-grid--reverse": isCellMode.value && props.reverse,
}))
</script>

<template>
  <div class="q-grid" :class="classes" :style="style">
    <slot />
  </div>
</template>
