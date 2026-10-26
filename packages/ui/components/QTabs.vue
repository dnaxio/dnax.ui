<script lang="ts">
// QTabs — API Quasar (source officielle) : <q-tabs v-model="tab" align="justify" active-color="secondary">
// Fournit le contexte (tab actif, enregistrement) aux QTab enfants via provide/inject.
import type { InjectionKey, Ref } from "vue"

export interface QTabRegistration {
  name: string | number
  el: Ref<HTMLElement | null>
}

export interface QTabContext {
  activeName: Readonly<Ref<string | number | null>>
  setActive: (name: string | number) => void
  register: (tab: QTabRegistration) => void
  unregister: (name: string | number) => void
  inlineLabel: Readonly<Ref<boolean>>
  noCaps: Readonly<Ref<boolean>>
  activeClass: Readonly<Ref<string | undefined>>
  /** Mode replié : seul le tab actif montre icône + label (les autres : icône seule) */
  collapseInactive: Readonly<Ref<boolean>>
}

export const qTabsKey: InjectionKey<QTabContext> = Symbol("q-tabs")
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from "vue"
import { Icon } from "@iconify/vue"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"
import { icons } from "../lib/icons"
import { tabArrowState, tabArrowStep } from "../lib/tabs"

const tabsVariants = cva("q-tabs", {
  variants: {
    align: {
      left: "q-tabs--left",
      center: "q-tabs--center",
      right: "q-tabs--right",
      justify: "q-tabs--justify",
    },
    dense: { true: "q-tabs--dense" },
  },
  defaultVariants: { align: "center" },
})

interface Props {
  /** Nom du tab actif */
  modelValue?: string | number | null
  /** Alignement des tabs (défaut Quasar : center) */
  align?: "left" | "center" | "right" | "justify"
  /** Couleur du tab actif (token ou hex) */
  activeColor?: string
  /** Couleur de fond du tab actif */
  activeBgColor?: string
  /** Couleur des tabs inactifs (token ou hex — défaut : couleur héritée) */
  inactiveColor?: string
  /** Classe ajoutée au tab actif */
  activeClass?: string
  /** Couleur de l'indicateur (défaut : activeColor → primary) */
  indicatorColor?: string
  /** Hauteur réduite */
  dense?: boolean
  /** Icône + label sur la même ligne */
  inlineLabel?: boolean
  /** Pas de majuscules sur les tabs */
  noCaps?: boolean
  /**
   * Position de l'indicateur (opt-in — sans la prop, aucun indicateur) :
   * true | "bottom" → en bas (défaut) ; "top" → en haut (pattern iOS/mobile).
   */
  switchIndicatorPosition?: boolean | "top" | "bottom"
  /** Tabs en colonne (verticales) */
  vertical?: boolean
  /**
   * **Flèches de défilement** quand les tabs débordent (comportement Quasar, défaut `true`) :
   * le contenu devient défilable et deux boutons apparaissent aux extrémités débordantes.
   * `false` → aucun défilement (les tabs débordent, comme avant).
   */
  showArrows?: boolean
  /** Ne pas s'étendre (usage dans un QToolbar) */
  shrink?: boolean
  /** S'étendre sur l'axe croisé du parent flex */
  stretch?: boolean
  /** Classe du contenu interne */
  contentClass?: string
  /** Anime les tabs au clic (appui scale + pop du tab actif) */
  animated?: boolean
  /**
   * Transition du changement de tab (requiert `animated`) :
   * spring (défaut, rebond léger) | smooth (expo-out velouté, label qui monte)
   * | elastic (rebond marqué).
   */
  transition?: "spring" | "smooth" | "elastic"
  /** Durée des transitions en ms (indicateur, labels collapse, pop/rise) */
  transitionDuration?: number
  /**
   * Mode replié (pattern mobile) : les tabs inactifs n'affichent que l'icône ;
   * le tab actif s'étend (icône + label) avec une largeur animée.
   */
  collapseInactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  align: "center",
  activeColor: "",
  activeBgColor: "",
  inactiveColor: "",
  activeClass: "",
  indicatorColor: "",
  dense: false,
  inlineLabel: false,
  noCaps: false,
  switchIndicatorPosition: undefined,
  vertical: false,
  showArrows: true,
  shrink: false,
  stretch: false,
  contentClass: "",
  animated: false,
  transition: "spring",
  transitionDuration: undefined,
  collapseInactive: false,
})

const emit = defineEmits<{ "update:modelValue": [value: string | number | null] }>()

// — Mode non-contrôlé : sans v-model (pas de listener update:modelValue), QTabs
// maintient son propre état interne — indispensable pour QRouteTab (le tab
// actif suit la route sans v-model parent) et pour tout usage sans v-model.
const instance = getCurrentInstance()
const controlled = computed(
  () => !!instance && "onUpdate:modelValue" in (instance.vnode.props ?? {}),
)
const internal = ref<string | number | null>(null)

const activeName = computed<string | number | null>(() =>
  controlled.value ? (props.modelValue ?? null) : internal.value,
)

const setActive = (name: string | number) => {
  if (controlled.value) emit("update:modelValue", name)
  else internal.value = name
}

// Position effective de l'indicateur : "top" | "bottom" (défaut) | "none" (masqué)
const indicatorPos = computed<"top" | "bottom" | "none">(() => {
  const p = props.switchIndicatorPosition
  if (p === "top") return "top"
  if (p === false || p === undefined || p === null) return "none"
  return "bottom" // true | "" (attribut sans valeur) | "bottom"
})

// shallowRef : on ne veut PAS que Vue dé-unwrappe les Ref contenues dans les enregistrements
const tabRegs = shallowRef<QTabRegistration[]>([])
const tick = ref(0)
const rootEl = ref<HTMLElement | null>(null)

// — Flèches de défilement (`show-arrows`, comportement Quasar) —
const contentEl = ref<HTMLElement | null>(null)
const canScrollStart = ref(false)
const canScrollEnd = ref(false)
let contentObserver: ResizeObserver | null = null

/** Met à jour la visibilité des flèches depuis les mesures de défilement (axe courant). */
const updateArrows = () => {
  const el = contentEl.value
  if (!el) return
  const state = props.vertical
    ? tabArrowState(el.scrollTop, el.clientHeight, el.scrollHeight)
    : tabArrowState(el.scrollLeft, el.clientWidth, el.scrollWidth)
  canScrollStart.value = state.canStart
  canScrollEnd.value = state.canEnd
}

/** Fait défiler d'un cran (≈ 60 % de la zone visible) — fluide. */
const scrollArrows = (dir: -1 | 1) => {
  const el = contentEl.value
  if (!el) return
  const delta = tabArrowStep(props.vertical ? el.clientHeight : el.clientWidth) * dir
  el.scrollBy(props.vertical ? { top: delta, behavior: "smooth" } : { left: delta, behavior: "smooth" })
}

/** Débordement réel → les deux flèches existent (celle du côté bloqué est **désactivée**). */
const scrollable = computed(() => canScrollStart.value || canScrollEnd.value)

// Recalcule la position de l'indicateur (et les flèches) après chaque changement de DOM
const measure = async () => {
  await nextTick()
  tick.value++
  updateArrows()
}

// collapse-inactive : le label s'étend/retombe via une transition max-width
// (0.3s) — à la fin, la largeur du tab actif change encore → re-mesurer,
// sinon l'indicateur reste calé sur la largeur repliée (mal positionné).
// transitionend bulle depuis le label jusqu'à la racine : un seul écouteur.
const onCollapseEnd = (e: Event) => {
  if ((e as TransitionEvent).propertyName !== "max-width") return
  measure()
}

watch([activeName, tabRegs], measure)

onMounted(() => {
  measure()
  if (typeof window !== "undefined") window.addEventListener("resize", measure)
  rootEl.value?.addEventListener("transitionend", onCollapseEnd)
  // Le conteneur peut changer de largeur sans resize fenêtre (sidebar, flex…) : les
  // flèches doivent suivre le débordement réel.
  if (typeof ResizeObserver !== "undefined" && contentEl.value) {
    contentObserver = new ResizeObserver(updateArrows)
    contentObserver.observe(contentEl.value)
  }
})
onBeforeUnmount(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", measure)
  rootEl.value?.removeEventListener("transitionend", onCollapseEnd)
  contentObserver?.disconnect()
  contentObserver = null
})

const context: QTabContext = {
  activeName,
  setActive,
  register: (tab) => {
    tabRegs.value = [...tabRegs.value, tab]
  },
  unregister: (name) => {
    tabRegs.value = tabRegs.value.filter((t) => t.name !== name)
  },
  inlineLabel: computed(() => props.inlineLabel),
  noCaps: computed(() => props.noCaps),
  activeClass: computed(() => (props.activeClass ? props.activeClass : undefined)),
  collapseInactive: computed(() => props.collapseInactive),
}

provide(qTabsKey, context)

const activeTabEl = computed(
  () => tabRegs.value.find((t) => t.name === activeName.value)?.el.value ?? null,
)

const indicatorStyle = computed<Record<string, string>>(() => {
  void tick.value // réactivité sur les mesures DOM
  const el = activeTabEl.value
  const style: Record<string, string> = {}
  if (el) {
    if (props.vertical) {
      style.transform = `translateY(${el.offsetTop}px)`
      style.height = `${el.offsetHeight}px`
    }
    else {
      style.transform = `translateX(${el.offsetLeft}px)`
      style.width = `${el.offsetWidth}px`
    }
  }
  else {
    style.opacity = "0"
  }
  if (props.indicatorColor) style.backgroundColor = colorValue(props.indicatorColor)
  return style
})

const containerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  // Token (primary…) → var(--primary) ; sinon valeur directe (hex, rgb…)
  if (props.activeColor) style["--q-tabs-active-color"] = colorValue(props.activeColor)
  if (props.activeBgColor) style["--q-tabs-active-bg"] = colorValue(props.activeBgColor)
  if (props.inactiveColor) style["--q-tabs-inactive-color"] = colorValue(props.inactiveColor)
  if (props.transitionDuration) style["--q-tabs-duration"] = `${props.transitionDuration}ms`
  return style
})

const tabsClasses = computed(() =>
  cn(
    tabsVariants({ align: props.align, dense: props.dense }),
    props.vertical && "q-tabs--vertical",
    // Indicateur opt-in : bottom (défaut) | top | aucun
    indicatorPos.value === "none"
      ? "q-tabs--no-indicator"
      : indicatorPos.value === "top" && "q-tabs--switch-indicator",
    props.shrink && "q-tabs--shrink",
    props.stretch && "q-tabs--stretch",
    props.animated && "q-tabs--animated",
    props.animated && `q-tabs--anim-${props.transition}`,
    props.collapseInactive && "q-tabs--collapse-inactive",
    props.showArrows && "q-tabs--arrows",
    // Fondu des bords : uniquement du côté où il reste du contenu à révéler (le CSS
    // n'utilise qu'un masque alpha → rendu identique en thème clair et sombre).
    props.showArrows && canScrollStart.value && "q-tabs--scroll-start",
    props.showArrows && canScrollEnd.value && "q-tabs--scroll-end",
  ),
)
</script>

<template>
  <div
    ref="rootEl"
    class="q-tabs"
    :class="tabsClasses"
    :style="containerStyle"
    role="tablist"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <button
      v-if="showArrows && scrollable"
      type="button"
      class="q-tabs__arrow q-tabs__arrow--start"
      :disabled="!canScrollStart"
      :aria-label="vertical ? 'Defiler les onglets vers le haut' : 'Defiler les onglets vers la gauche'"
      @click="scrollArrows(-1)"
    >
      <Icon :icon="vertical ? icons.chevronUp : icons.chevronLeft" aria-hidden="true" />
    </button>
    <div
      ref="contentEl"
      class="q-tabs__content"
      :class="contentClass"
      @scroll="updateArrows"
    >
      <slot />
      <div class="q-tabs__indicator" :style="indicatorStyle" aria-hidden="true" />
    </div>
    <button
      v-if="showArrows && scrollable"
      type="button"
      class="q-tabs__arrow q-tabs__arrow--end"
      :disabled="!canScrollEnd"
      :aria-label="vertical ? 'Defiler les onglets vers le bas' : 'Defiler les onglets vers la droite'"
      @click="scrollArrows(1)"
    >
      <Icon :icon="vertical ? icons.chevronDown : icons.chevronRight" aria-hidden="true" />
    </button>
  </div>
</template>
