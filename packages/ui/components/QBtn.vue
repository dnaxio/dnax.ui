<script setup lang="ts">
// QBtn — API Quasar : <q-btn flat dense outline rounded no-caps label="…" icon="…" />
// Implémentation shadcn-vue : cva (variants) + cn() ; styles dans styles/main.css
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

const btnVariants = cva("q-btn", {
  variants: {
    size: {
      sm: "q-btn--sm",
      md: "q-btn--md",
      lg: "q-btn--lg",
      xl: "q-btn--xl",
    },
  },
  defaultVariants: { size: "md" },
})

const TOKEN_COLORS = ["primary", "secondary", "accent", "dark", "positive", "negative", "info", "warning"] as const
const SIZE_TOKENS = ["sm", "md", "lg", "xl"] as const

interface Props {
  /** Texte du bouton (sinon contenu du slot) */
  label?: string
  /** Icône Iconify à gauche du label (ex. : "lucide:download") */
  icon?: string
  /** Icône Iconify à droite du label */
  iconRight?: string
  /** Couleur : token (primary, secondary, negative…) ou hex (#1976d2) */
  color?: string
  /** Couleur du texte : token ou hex */
  textColor?: string
  /** Taille : token (sm|md|lg|xl) ou valeur CSS ("2rem") */
  size?: string
  type?: "button" | "submit" | "reset"
  /** Rend un lien natif <a> */
  href?: string
  /** Fond transparent, texte coloré */
  flat?: boolean
  /** Fond transparent + bordure */
  outline?: boolean
  /** Supprime l'ombre portée */
  unelevated?: boolean
  /** Hauteur réduite */
  dense?: boolean
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
  /** Cercle parfait (bouton icône seule) */
  round?: boolean
  /** Coins droits */
  square?: boolean
  /** Désactive la mise en majuscules */
  noCaps?: boolean
  /** Largeur 100% */
  stretch?: boolean
  /** Affiche un spinner et bloque les clics */
  loading?: boolean
  /** Désactive le bouton */
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  size: "md",
  color: "primary",
  flat: false,
  outline: false,
  unelevated: false,
  dense: false,
  round: false,
  square: false,
  noCaps: false,
  stretch: false,
  loading: false,
  disable: false,
})

const isTokenColor = (c?: string) => !!c && (TOKEN_COLORS as readonly string[]).includes(c)
const isSizeToken = (s?: string) => !!s && (SIZE_TOKENS as readonly string[]).includes(s)

const sizeVariant = computed(() =>
  isSizeToken(props.size) ? (props.size as "sm" | "md" | "lg" | "xl") : "md",
)

/** Taille CSS libre : passée en variable CSS --q-btn-h */
const sizeStyle = computed<Record<string, string>>((): Record<string, string> =>
  props.size && !isSizeToken(props.size) ? { "--q-btn-h": props.size } : {},
)

/** Couleurs hex libres : passées en variables CSS */
const colorStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.color && !isTokenColor(props.color)) style["--q-btn-bg"] = props.color
  if (props.textColor && !isTokenColor(props.textColor)) style["--q-btn-fg"] = props.textColor
  return style
})

const isDisabled = computed(() => props.disable || props.loading)

// radius : prop explicite > composantProps.QBtn.radius ; échelle → --q-radius
const effectiveRadius = useRadius("QBtn", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const btnClasses = computed(() =>
  cn(
    btnVariants({ size: sizeVariant.value }),
    isTokenColor(props.color) && `q-btn--${props.color}`,
    isTokenColor(props.textColor) && `q-btn--text-${props.textColor}`,
    props.flat && "q-btn--flat",
    props.outline && "q-btn--outline",
    props.unelevated && "q-btn--unelevated",
    props.dense && "q-btn--dense",
    effectiveRadius.value === true && "q-btn--rounded",
    props.round && "q-btn--round",
    props.square && "q-btn--square",
    props.noCaps && "q-btn--no-caps",
    props.stretch && "q-btn--stretch",
    props.loading && "q-btn--loading",
    isDisabled.value && "q-btn--disabled",
  ),
)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :type="href ? undefined : type"
    :disabled="href ? undefined : isDisabled"
    :aria-disabled="isDisabled || undefined"
    :class="btnClasses"
    :style="[sizeStyle, colorStyle, roundedStyle]"
  >
    <span v-if="loading" class="q-btn__spinner" aria-hidden="true" />
    <Icon v-else-if="icon" :icon="icon" class="q-btn__icon" aria-hidden="true" />
    <span v-if="label" class="q-btn__label">{{ label }}</span>
    <slot />
    <Icon v-if="iconRight && !loading" :icon="iconRight" class="q-btn__icon" aria-hidden="true" />
  </component>
</template>
