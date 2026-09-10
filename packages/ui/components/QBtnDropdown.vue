<script lang="ts">
// QBtnDropdown — dropdown Quasar : <q-btn-dropdown label="…" :items="…" @select="…" />.
// Le déclencheur est un QBtn (+ flèche caret) ; le menu liste les `items`, chacun
// avec une icône GAUCHE (`leftIcon`) et une icône DROITE (`rightIcon`).
// Implémentation : réutilise le moteur de QBtnActions (panneau téléporté fixed,
// clavier, séparateurs, clic extérieur) — zéro duplication.

export interface DropdownItem {
  /** Libellé affiché (absent pour une entrée « séparateur seul ») */
  label?: string
  /** Valeur émise par @select ; si absente, l'item lui-même est émis */
  value?: any
  /** Icône Iconify à GAUCHE du label (ex. "lucide:settings") */
  leftIcon?: string
  /** Icône Iconify à DROITE du label (ex. "lucide:chevron-right" pour un sous-menu) */
  rightIcon?: string
  /** Couleur du texte/icône (token — ex. "negative" — ou hex) */
  color?: string
  /** Sous-texte descriptif sous le label */
  description?: string
  /** Ligne de séparation affichée au-dessus de l'item */
  separator?: boolean
  /** Item désactivé */
  disable?: boolean
  /** Rappel local au clic (en plus de l'événement @select) */
  onClick?: (item: DropdownItem) => void
}
</script>

<script setup lang="ts">
import { computed } from "vue"
import QBtnActions, { type DropdownPosition } from "./QBtnActions.vue"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  /** Items du menu (icône gauche + icône droite par item) */
  items?: DropdownItem[]
  /** Libellé du bouton déclencheur (sinon icône seule) */
  label?: string
  /** Icône Iconify du déclencheur (défaut "lucide:ellipsis" si pas de label) */
  icon?: string
  /** Masque la flèche déroulante */
  noCaret?: boolean
  /** Icône de la flèche déroulante */
  dropdownIcon?: string
  /** Alignement du menu sous le bouton : "left" = bottom-start, "right" = bottom-end (alias de `position`) */
  align?: "left" | "right"
  /**
   * Placement du panneau autour du déclencheur — ex. "bottom-end" (défaut),
   * "top-start", "right", "left-end"… Prioritaire sur `align`.
   */
  position?: DropdownPosition
  /** Distance entre le panneau et le déclencheur, en px (défaut : 4) */
  offset?: number
  /** Largeur minimale du menu (ex. "220px") */
  menuWidth?: string
  // — API déclencheur (transmise à QBtn) —
  color?: string
  textColor?: string
  size?: string
  radius?: RadiusProp
  flat?: boolean
  outline?: boolean
  unelevated?: boolean
  dense?: boolean
  round?: boolean
  square?: boolean
  noCaps?: boolean
  stretch?: boolean
  loading?: boolean
  disable?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  align: "right",
  offset: 4,
  menuWidth: "220px",
})

const emit = defineEmits<{
  /** Item sélectionné — payload : `value` de l'item (ou l'item si pas de value) */
  select: [value: any]
}>()

// leftIcon/rightIcon → icon/iconRight du moteur QBtnActions
const mappedActions = computed(() =>
  (props.items ?? []).map((item) => ({
    label: item.label,
    value: item.value,
    icon: item.leftIcon,
    iconRight: item.rightIcon,
    color: item.color,
    description: item.description,
    separator: item.separator,
    disable: item.disable,
    onClick: item.onClick ? () => item.onClick!(item) : undefined,
  })),
)

const onSelectAction = (value: any) => emit("select", value)
</script>

<template>
  <QBtnActions
    :actions="mappedActions"
    :label="label"
    :icon="icon"
    :no-caret="noCaret"
    :dropdown-icon="dropdownIcon"
    :align="align"
    :position="position"
    :offset="offset"
    :menu-width="menuWidth"
    :color="color"
    :text-color="textColor"
    :size="size"
    :radius="radius"
    :flat="flat"
    :outline="outline"
    :unelevated="unelevated"
    :dense="dense"
    :round="round"
    :square="square"
    :no-caps="noCaps"
    :stretch="stretch"
    :loading="loading"
    :disable="disable"
    :dark="dark"
    @select-action="onSelectAction"
  />
</template>
