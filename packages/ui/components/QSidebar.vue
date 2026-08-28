<script lang="ts">
// QSidebar — panneau latéral type Sidebar shadcn-vue, API QDrawer Quasar :
// <q-sidebar v-model="open" side="left" width="260px" bordered show-if-above breakpoint="1023">
// Fournit le contexte (toggle) aux QSidebarTrigger enfants.
import type { InjectionKey, Ref } from "vue"

export interface SidebarContext {
  open: Readonly<Ref<boolean>>
  setOpen: (v: boolean) => void
  toggle: () => void
}

export const qSidebarKey: InjectionKey<SidebarContext> = Symbol("q-sidebar")
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from "vue"
import type { StyleValue } from "vue"
import { cn } from "../lib/utils"

interface Props {
  /** Ouvert (v-model) — mode offcanvas ; ignoré en mode statique */
  modelValue?: boolean
  /** Côté : left | right */
  side?: "left" | "right"
  /** Largeur (défaut 260px) */
  width?: string
  /** Hauteur du panneau (ex. "calc(100vh - 64px)", "80vh") — sinon pleine hauteur */
  height?: string
  /** Hauteur max — le contenu scrolle (ex. "70vh") */
  maxHeight?: string
  /** Bordure côté intérieur */
  bordered?: boolean
  /** Ombre portée */
  elevated?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Toujours visible au-delà du breakpoint (mode statique) */
  showIfAbove?: boolean
  /** Mode statique : reste collé en haut pendant le scroll de la page (position: sticky) */
  sticky?: boolean
  /** Breakpoint de bascule statique/offcanvas (px) */
  breakpoint?: number
  /** Styles CSS additionnels appliqués au panneau */
  style?: StyleValue
  /** Classe(s) additionnelle(s) appliquée(s) au panneau */
  class?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  side: "left",
  width: "260px",
  height: "",
  maxHeight: "",
  bordered: false,
  elevated: false,
  dark: false,
  showIfAbove: false,
  sticky: false,
  breakpoint: 1023,
  style: undefined,
  class: "",
  disable: false,
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

// — Mode statique (viewport >= breakpoint && show-if-above) —
const isAbove = ref(false)
let mql: MediaQueryList | null = null

const updateMql = () => {
  isAbove.value = mql?.matches ?? false
}

onMounted(() => {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    mql = window.matchMedia(`(min-width: ${props.breakpoint}px)`)
    updateMql()
    mql.addEventListener("change", updateMql)
  }
})
onBeforeUnmount(() => {
  mql?.removeEventListener("change", updateMql)
})

const isStatic = computed(() => props.showIfAbove && isAbove.value && !props.disable)
const open = computed(() => (isStatic.value ? true : (props.modelValue ?? true)))

const setOpen = (v: boolean) => {
  if (!isStatic.value) emit("update:modelValue", v)
}
const toggle = () => setOpen(!open.value)

provide<SidebarContext>(qSidebarKey, { open, setOpen, toggle })

// Échap ferme en offcanvas
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && !isStatic.value && open.value) setOpen(false)
}

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("keydown", onDocKeydown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("keydown", onDocKeydown)
})

const rootClasses = computed(() =>
  cn(
    "q-sidebar",
    isStatic.value ? "q-sidebar--static" : "q-sidebar--offcanvas",
    !isStatic.value && open.value && "q-sidebar--open",
    props.side === "right" && "q-sidebar--right",
    props.sticky && "q-sidebar--sticky",
    props.bordered && "q-sidebar--bordered",
    props.elevated && "q-sidebar--elevated",
    props.dark && "q-sidebar--dark",
    props.class,
  ),
)

const rootStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = { "--q-sidebar-w": props.width }
  if (props.height) style.height = props.height
  if (props.maxHeight) style.maxHeight = props.maxHeight
  return style
})
</script>

<template>
  <aside
    class="q-sidebar"
    :class="rootClasses"
    :style="[rootStyle, props.style]"
    :aria-hidden="!isStatic && !open ? 'true' : undefined"
  >
    <slot />
  </aside>
  <div
    v-if="!isStatic && open && !disable"
    class="q-sidebar__backdrop"
    aria-hidden="true"
    @click="setOpen(false)"
  />
</template>
