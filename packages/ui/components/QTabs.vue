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
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from "vue"
import { cva } from "class-variance-authority"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

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
  shrink: false,
  stretch: false,
  contentClass: "",
  animated: false,
  transition: "spring",
  transitionDuration: undefined,
  collapseInactive: false,
})

const emit = defineEmits<{ "update:modelValue": [value: string | number | null] }>()

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

// Recalcule la position de l'indicateur après chaque changement de DOM
const measure = async () => {
  await nextTick()
  tick.value++
}

// collapse-inactive : le label s'étend/retombe via une transition max-width
// (0.3s) — à la fin, la largeur du tab actif change encore → re-mesurer,
// sinon l'indicateur reste calé sur la largeur repliée (mal positionné).
// transitionend bulle depuis le label jusqu'à la racine : un seul écouteur.
const onCollapseEnd = (e: Event) => {
  if ((e as TransitionEvent).propertyName !== "max-width") return
  measure()
}

watch([() => props.modelValue, tabRegs], measure)

onMounted(() => {
  measure()
  if (typeof window !== "undefined") window.addEventListener("resize", measure)
  rootEl.value?.addEventListener("transitionend", onCollapseEnd)
})
onBeforeUnmount(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", measure)
  rootEl.value?.removeEventListener("transitionend", onCollapseEnd)
})

const context: QTabContext = {
  activeName: computed(() => props.modelValue),
  setActive: (name) => emit("update:modelValue", name),
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
  () => tabRegs.value.find((t) => t.name === props.modelValue)?.el.value ?? null,
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
    <div class="q-tabs__content" :class="contentClass">
      <slot />
      <div class="q-tabs__indicator" :style="indicatorStyle" aria-hidden="true" />
    </div>
  </div>
</template>
