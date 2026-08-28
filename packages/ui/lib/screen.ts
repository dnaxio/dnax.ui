// $q.screen — plugin Screen façon Quasar
// (https://quasar.dev/options/screen-plugin) : taille de fenêtre réactive,
// refs lt/gt, taille courante (name), seuils personnalisables (setSizes).
import { computed, reactive, ref, watch } from "vue"
import { useWindowSize } from "@vueuse/core"
import type { Ref } from "vue"

export interface QScreenSizes {
  sm: number
  md: number
  lg: number
  xl: number
}

export interface QScreen {
  /** largeur de fenêtre (px, réactive) */
  width: Ref<number>
  /** hauteur de fenêtre (px, réactive) */
  height: Ref<number>
  /** taille courante : 'xs' | 'sm' | 'md' | 'lg' | 'xl' */
  name: Ref<"xs" | "sm" | "md" | "lg" | "xl">
  /** seuils (réactifs, modifiables via setSizes) */
  sizes: QScreenSizes
  /** less than : width < seuil */
  lt: { sm: Ref<boolean>; md: Ref<boolean>; lg: Ref<boolean>; xl: Ref<boolean> }
  /** greater than : xs > 0 ; sm/md/lg ≥ seuil */
  gt: { xs: Ref<boolean>; sm: Ref<boolean>; md: Ref<boolean>; lg: Ref<boolean> }
  /** taille exacte courante */
  xs: Ref<boolean>
  sm: Ref<boolean>
  md: Ref<boolean>
  lg: Ref<boolean>
  xl: Ref<boolean>
  /** Personnalise les seuils (ex. setSizes({ md: 900 })) */
  setSizes: (all: Partial<QScreenSizes>) => void
  /** Ajoute les classes body .screen--xs … .screen--xl (façon Quasar) */
  setBodyClasses: (condition?: boolean) => void
}

const { width, height } = useWindowSize()

const sizes = reactive<QScreenSizes>({ sm: 600, md: 1024, lg: 1440, xl: 1920 })

const lt = {
  sm: computed(() => width.value < sizes.sm),
  md: computed(() => width.value < sizes.md),
  lg: computed(() => width.value < sizes.lg),
  xl: computed(() => width.value < sizes.xl),
}

const gt = {
  xs: computed(() => width.value > 0),
  sm: computed(() => width.value >= sizes.sm),
  md: computed(() => width.value >= sizes.md),
  lg: computed(() => width.value >= sizes.lg),
}

const xs = computed(() => width.value < sizes.sm)
const sm = computed(() => width.value >= sizes.sm && width.value < sizes.md)
const md = computed(() => width.value >= sizes.md && width.value < sizes.lg)
const lg = computed(() => width.value >= sizes.lg && width.value < sizes.xl)
const xl = computed(() => width.value >= sizes.xl)

const name = computed<"xs" | "sm" | "md" | "lg" | "xl">(() =>
  xs.value ? "xs" : sm.value ? "sm" : md.value ? "md" : lg.value ? "lg" : "xl",
)

function setSizes(all: Partial<QScreenSizes>) {
  Object.assign(sizes, all)
}

// Classes body façon Quasar (.screen--xs …) — activées via setBodyClasses()
let bodyClassesEnabled = false

const updateBodyClasses = () => {
  if (typeof document === "undefined") return
  const body = document.body
  body.classList.remove("screen--xs", "screen--sm", "screen--md", "screen--lg", "screen--xl")
  body.classList.add(`screen--${name.value}`)
}

watch(name, () => {
  if (bodyClassesEnabled) updateBodyClasses()
})

function setBodyClasses(condition = true) {
  bodyClassesEnabled = condition
  if (condition) updateBodyClasses()
}

export const screen: QScreen = {
  width,
  height,
  name,
  sizes,
  lt,
  gt,
  xs,
  sm,
  md,
  lg,
  xl,
  setSizes,
  setBodyClasses,
}
