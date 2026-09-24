<script setup lang="ts">
// QLayout — matrice 3×3 pilotée par le prop `view` (modèle Quasar). Les enfants
// **directs** se placent eux-mêmes : q-header en cellule « h », q-footer en « f »,
// q-sidebar en « l » / « r », et tout le reste — donc le contenu — en cellule « p ».
//
//   <q-layout view="hHh LpR fFf">
//     <q-header>…</q-header>
//     <q-sidebar side="left" show-if-above>…</q-sidebar>
//     <q-page>…</q-page>        ← un SEUL enfant de contenu
//     <q-footer>…</q-footer>
//   </q-layout>
//
// Majuscule = la zone reste en place au scroll (`position: sticky`), minuscule =
// elle défile avec la page. L'analyse de `view` vit dans `lib/layout.ts` (pure) ;
// ici : le rendu de la grille et la mesure.
//
// Deux différences assumées avec Quasar : le scroll reste celui du **document**
// (pas de scroll interne, donc `QFooter reveal`, `QSidebar` statique et les
// safe-areas continuent de fonctionner), et un header sticky est **clos dans sa
// cellule** — il ne peut pas passer au-dessus du drawer voisin.
//
// Les hauteurs des barres sont mesurées en continu et publiées en variables CSS
// (`--q-layout-header-h` / `--q-layout-footer-h` / `--q-layout-viewport-h`) : les
// drawers sticky s'y accrochent sans glisser sous le header, et la hauteur de
// référence suit le mode (fenêtre, ou conteneur en mode `container`).
import { computed, onBeforeUnmount, onMounted, provide, ref, toRef, watch } from "vue"
import type { StyleValue } from "vue"
import { DEFAULT_LAYOUT_VIEW, parseView, qLayoutKey } from "../lib/layout"
import { cn } from "../lib/utils"

interface Props {
  /** Matrice 3×3 : 3 groupes de 3 lettres (l, h, r, f, p, ou .) + casse = la zone reste en place */
  view?: string
  /** Layout conteneur (comme Quasar) : ne gère pas la fenêtre, une hauteur explicite est requise */
  container?: boolean
  /** Classe(s) additionnelle(s) */
  class?: string
  /** Styles CSS additionnels */
  style?: StyleValue
}

const props = withDefaults(defineProps<Props>(), {
  view: DEFAULT_LAYOUT_VIEW,
  container: false,
  class: "",
  style: undefined,
})

const parsed = computed(() => parseView(props.view))

// Une `view` invalide n'est jamais fatale : la vue par défaut s'applique et, en dev,
// la raison est affichée (l'analyse est pure, le composant ne fait que rapporter).
watch(
  parsed,
  (v) => {
    if (v.error) console.warn(`[q-layout] ${v.error} — vue par défaut appliquée`)
  },
  { immediate: true },
)

// Les enfants (q-header, q-footer, q-sidebar) lisent leur cellule ici.
provide(qLayoutKey, { zones: computed(() => parsed.value.zones), container: toRef(props, "container") })

const rootEl = ref<HTMLElement | null>(null)

// — Mesure des barres : hauteur cumulée des headers/footers enfants directs —
let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null

const bars = (): HTMLElement[] =>
  Array.from(rootEl.value?.children ?? []).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement && el.matches(".q-header, .q-back-header, .q-footer"),
  )

const measure = () => {
  const root = rootEl.value
  if (!root || typeof window === "undefined") return
  let header = 0
  let footer = 0
  for (const bar of bars()) {
    if (bar.matches(".q-footer")) footer += bar.offsetHeight
    else header += bar.offsetHeight
  }
  // Hauteur de référence des zones sticky : la fenêtre, ou le conteneur (mode `container`)
  const viewport = props.container ? root.clientHeight : window.innerHeight
  root.style.setProperty("--q-layout-header-h", `${header}px`)
  root.style.setProperty("--q-layout-footer-h", `${footer}px`)
  root.style.setProperty("--q-layout-viewport-h", `${viewport}px`)
}

// Les barres peuvent être rendues conditionnellement (v-if) → on ré-observe.
const observe = () => {
  ro?.disconnect()
  if (typeof ResizeObserver === "undefined") return
  ro = new ResizeObserver(measure)
  bars().forEach((bar) => ro!.observe(bar))
  // En mode conteneur la hauteur de référence est celle du conteneur : on la suit
  if (props.container && rootEl.value) ro.observe(rootEl.value)
}

onMounted(() => {
  measure()
  observe()
  if (typeof MutationObserver !== "undefined" && rootEl.value) {
    mo = new MutationObserver(() => {
      observe()
      measure()
    })
    mo.observe(rootEl.value, { childList: true })
  }
  window.addEventListener("resize", measure)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  mo?.disconnect()
  window.removeEventListener("resize", measure)
})

// Cellules de la grille (`grid-template-areas` + cellule par défaut du contenu).
const rootStyle = computed<Record<string, string>>(() => ({
  "--q-layout-areas": parsed.value.gridTemplateAreas,
  "--q-layout-page-area": parsed.value.zones.page.area ?? "p",
}))
</script>

<template>
  <div
    ref="rootEl"
    class="q-layout"
    :class="cn(container && 'q-layout--container', props.class)"
    :style="[rootStyle, props.style]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
