<script lang="ts">
// QBtnActions — bouton + menu d'actions intégré (type QBtnDropdown Quasar, mais
// piloté par données : plus besoin de compose un QMenu/QList séparé).
// <q-btn-actions label="Actions" :actions="acts" @select-action="onSelect" />
// Chaque action : { label, value?, icon?, color?, description?, onClick? }.
// Le panneau est téléporté dans <body> en position fixed : il survit aux
// contextes d'empilement/overflow (cellules sticky de table, scroll containers).

export interface BtnAction {
  /** Libellé affiché dans le menu (absent pour une entrée « séparateur seul ») */
  label?: string
  /** Valeur émise par @select-action ; si absente, l'action elle-même est émise */
  value?: any
  /** Icône Iconify à gauche (ex. : "lucide:pencil") */
  icon?: string
  /** Icône Iconify à droite */
  iconRight?: string
  /** Couleur du texte/icône (token — ex. "negative" pour une suppression — ou hex) */
  color?: string
  /** Sous-texte descriptif sous le label */
  description?: string
  /** Ligne de séparation affichée au-dessus de l'action */
  separator?: boolean
  /** Action désactivée */
  disable?: boolean
  /** Rappel local au clic (en plus de l'événement @select-action) */
  onClick?: (action: BtnAction) => void
}

/**
 * Placement du panneau autour du déclencheur (côté + alignement sur l'axe
 * perpendiculaire) :
 * - "bottom-start" / "bottom-end" : sous le bouton, bord gauche / droit aligné ;
 * - "top-start" / "top-end" : au-dessus du bouton ;
 * - "left-start"… / "right-start"… : sur le côté (start = haut, end = bas) ;
 * - sans suffixe ("bottom", "top", "left", "right") : centré sur l'axe croisé.
 */
export type DropdownPosition =
  | "bottom-start" | "bottom-end" | "bottom"
  | "top-start" | "top-end" | "top"
  | "left-start" | "left-end" | "left"
  | "right-start" | "right-end" | "right"
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { Icon } from "@iconify/vue"
import { colorValue } from "../lib/colors"
import { icons } from "../lib/icons"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"
import QBtn from "./QBtn.vue"

interface Props {
  /** Liste des actions du menu */
  actions?: BtnAction[]
  /** Libellé du bouton déclencheur (sinon icône seule) */
  label?: string
  /** Icône Iconify du déclencheur (défaut "lucide:ellipsis" si pas de label) */
  icon?: string
  /** Masque la flèche déroulante (n'apparaît de toute façon que s'il y a un label) */
  noCaret?: boolean
  /** Icône de la flèche déroulante */
  dropdownIcon?: string
  /** Alignement du menu sous le bouton : "left" = bottom-start, "right" = bottom-end (alias de `position`) */
  align?: "left" | "right"
  /**
   * Placement du panneau autour du déclencheur — ex. "bottom-end" (défaut),
   * "top-start", "right", "left-end"… (voir DropdownPosition). Prioritaire sur `align`.
   */
  position?: DropdownPosition
  /** Distance entre le panneau et le déclencheur, en px (défaut : 4) */
  offset?: number
  /** Largeur minimale du menu (ex. "200px") */
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
  actions: () => [],
  noCaret: false,
  dropdownIcon: "lucide:chevron-down",
  align: "right",
  offset: 4,
  menuWidth: "180px",
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
  dark: false,
})

const emit = defineEmits<{
  /** Action sélectionnée — payload : `value` de l'action (ou l'action si pas de value) */
  "select-action": [value: any]
}>()

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
/** Position fixed du panneau (téléporté dans <body>) */
const panelPos = ref({ top: 0, left: 0, transform: "" })

const canOpen = computed(() => !props.disable && !props.loading && props.actions.length > 0)

// Icône par défaut : « … » si le déclencheur est en icône seule (pas de label)
const triggerIcon = computed(() => props.icon ?? (props.label ? undefined : icons.ellipsis))

// Flèche déroulante : seulement avec un label (bouton icône seule = pas de caret)
const showCaret = computed(() => !props.noCaret && !!props.label)

const triggerClasses = computed(() => [
  "q-btn-actions__trigger",
  open.value && "q-btn-actions__trigger--open",
])

const effectiveRadius = useRadius("QBtnActions", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const panelStyle = computed<Record<string, string>>(() => ({
  top: `${panelPos.value.top}px`,
  left: `${panelPos.value.left}px`,
  transform: panelPos.value.transform,
  minWidth: props.menuWidth,
  ...(roundedStyle.value ?? {}),
}))

// `position` explicite, sinon alias `align` (compat) → bottom-start / bottom-end
const placement = computed<DropdownPosition>(
  () => props.position ?? (props.align === "left" ? "bottom-start" : "bottom-end"),
)

// ═════════ Positionnement (fixed, téléporté) ═════════
// Placement exprimé en « point d'ancrage » du panneau (top/left fixed) + un
// décalage par translation en % de la taille du panneau (−100% = bord opposé,
// −50% = centré) : aucun calcul de largeur/hauteur du panneau nécessaire.
const placePanel = () => {
  const el = rootEl.value
  if (!el || typeof document === "undefined") return
  const rect = el.getBoundingClientRect()
  const [main, alt] = placement.value.split("-") as ["bottom" | "top" | "left" | "right", "start" | "end" | undefined]
  const off = props.offset
  const midX = (rect.left + rect.right) / 2
  const midY = (rect.top + rect.bottom) / 2

  let top = 0
  let left = 0
  let tx = "0%"
  let ty = "0%"

  if (main === "bottom" || main === "top") {
    // Axe horizontal : bord gauche (start), bord droit (end) ou centre
    if (alt === "start") left = rect.left
    else if (alt === "end") {
      left = rect.right
      tx = "-100%"
    }
    else {
      left = midX
      tx = "-50%"
    }
    if (main === "bottom") top = rect.bottom + off
    else {
      top = rect.top - off
      ty = "-100%"
    }
  }
  else {
    // Axe vertical : haut (start), bas (end) ou centre
    if (alt === "start") top = rect.top
    else if (alt === "end") {
      top = rect.bottom
      ty = "-100%"
    }
    else {
      top = midY
      ty = "-50%"
    }
    if (main === "right") left = rect.right + off
    else {
      left = rect.left - off
      tx = "-100%"
    }
  }

  panelPos.value = {
    top,
    left,
    transform: tx === "0%" && ty === "0%" ? "none" : `translate(${tx}, ${ty})`,
  }
}

const enableTracking = () => {
  window.addEventListener("resize", placePanel)
  window.addEventListener("scroll", placePanel, true)
}
const disableTracking = () => {
  window.removeEventListener("resize", placePanel)
  window.removeEventListener("scroll", placePanel, true)
}

// ═════════ Ouverture / fermeture ═════════
const toggle = () => (open.value ? close() : openMenu())

const openMenu = async () => {
  if (!canOpen.value) return
  placePanel()
  open.value = true
  enableTracking()
  await nextTick()
  ;(panelEl.value?.querySelector(".q-btn-actions__item:not(:disabled)") as HTMLElement | null)?.focus()
}

const close = () => {
  if (!open.value) return
  open.value = false
  disableTracking()
}

// Clic extérieur (bouton ET panneau téléporté) → ferme
const onDocMousedown = (e: MouseEvent) => {
  if (!open.value) return
  const target = e.target as Node
  if (rootEl.value?.contains(target) || panelEl.value?.contains(target)) return
  close()
}

// Clavier : flèches/Home/End dans le menu, Échap ferme (focus revient au trigger)
const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === "Escape") {
    e.preventDefault()
    close()
    ;(rootEl.value?.querySelector(".q-btn-actions__trigger") as HTMLElement | null)?.focus()
    return
  }
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return
  const items = Array.from(
    panelEl.value?.querySelectorAll(".q-btn-actions__item:not(:disabled)") ?? [],
  ) as HTMLElement[]
  if (!items.length) return
  const current = items.indexOf(document.activeElement as HTMLElement)
  let next = current
  if (e.key === "ArrowDown") next = (current + 1) % items.length
  else if (e.key === "ArrowUp") next = (current - 1 + items.length) % items.length
  else if (e.key === "Home") next = 0
  else if (e.key === "End") next = items.length - 1
  e.preventDefault()
  items[next]?.focus()
}

const onSelect = (action: BtnAction) => {
  if (action.disable) return
  action.onClick?.(action)
  close()
  emit("select-action", action.value !== undefined ? action.value : action)
}

/** Entrée « séparateur seul » ({ separator: true } sans label/icône) : simple trait, pas de bouton cliquable */
const isSeparatorOnly = (action: BtnAction): boolean =>
  !!action.separator && !action.label && !action.icon && !action.iconRight && !action.description

const itemStyle = (action: BtnAction) =>
  action.color ? { color: colorValue(action.color) } : undefined

// — Liste aplatie du menu : un nœud stable PAR ligne (séparateur OU item), jamais
// deux frères conditionnels pour une même action. Évite la désynchronisation de
// l'arbre de blocs de Vue (crash `emitsOptions` null dans shouldUpdateComponent)
// quand le menu (Teleport + Transition) est patché avec un nombre variable d'enfants.
type MenuRow = { type: "separator"; key: string } | { type: "item"; key: string; action: BtnAction }

const menuRows = computed<MenuRow[]>(() => {
  const rows: MenuRow[] = []
  props.actions.forEach((action, i) => {
    if (action.separator) rows.push({ type: "separator", key: `${i}-sep` })
    if (!isSeparatorOnly(action)) rows.push({ type: "item", key: `${i}-item`, action })
  })
  return rows
})

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("mousedown", onDocMousedown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("mousedown", onDocMousedown)
  disableTracking()
})
</script>

<template>
  <div ref="rootEl" class="q-btn-actions" :class="dark && 'dark'" @keydown="onKeydown">
    <QBtn
      class="q-btn-actions__trigger"
      :class="triggerClasses"
      :label="label"
      :icon="triggerIcon"
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
      :aria-haspopup="'menu'"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggle"
    >
      <Icon
        v-if="showCaret"
        :icon="dropdownIcon"
        class="q-btn-actions__caret"
        :class="{ 'q-btn-actions__caret--open': open }"
        aria-hidden="true"
      />
    </QBtn>

    <Teleport to="body">
      <Transition name="q-popup">
        <div
          v-if="open"
          ref="panelEl"
          class="q-btn-actions__panel"
          role="menu"
          :aria-label="label ?? 'Actions'"
          :style="panelStyle"
          @keydown="onKeydown"
        >
          <template v-for="row in menuRows" :key="row.key">
            <div v-if="row.type === 'separator'" class="q-btn-actions__separator" role="separator" />
            <button
              v-else
              type="button"
              role="menuitem"
              class="q-btn-actions__item"
              :class="{ 'q-btn-actions__item--disabled': row.action.disable }"
              :disabled="row.action.disable"
              :style="itemStyle(row.action)"
              @click="onSelect(row.action)"
            >
              <Icon v-if="row.action.icon" :icon="row.action.icon" class="q-btn-actions__item-icon" aria-hidden="true" />
              <span class="q-btn-actions__item-text">
                <span class="q-btn-actions__item-label">{{ row.action.label }}</span>
                <span v-if="row.action.description" class="q-btn-actions__item-desc">{{ row.action.description }}</span>
              </span>
              <Icon v-if="row.action.iconRight" :icon="row.action.iconRight" class="q-btn-actions__item-icon" aria-hidden="true" />
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
