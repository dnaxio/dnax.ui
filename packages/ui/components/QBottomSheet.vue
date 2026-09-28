<script lang="ts">
// QBottomSheet — bottom sheet type Drawer shadcn-vue (vaul), style Quasar :
// <q-bottom-sheet v-model="open"> + slot trigger / QBottomSheetHeader / QBottomSheetFooter
// Drag vers le bas pour fermer, backdrop, Échap, safe-area bottom.
//
// Points d'ancrage (style Ionic) : `:breakpoints="[0.25, 0.5, 0.75]"` pose le panneau sur
// des fractions de la hauteur de vue, la poignée (ou le clavier) passant de l'une à
// l'autre. Le contenu reste **défilable à chaque point d'ancrage** : c'est la poignée qui
// pilote la hauteur, jamais le scroll.
import type { InjectionKey, Ref } from "vue"

export interface BottomSheetContext {
  open: Readonly<Ref<boolean>>
  setOpen: (v: boolean) => void
}

export const qBottomSheetKey: InjectionKey<BottomSheetContext> = Symbol("q-bottom-sheet")
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from "vue"
import {
  clampRatio,
  nearestBreakpoint,
  normalizeBreakpoints,
  ratioFromDrag,
  releaseBreakpoint,
  stepBreakpoint,
} from "../lib/bottomSheet"
import { cn } from "../lib/utils"
import { useOverlayBack } from "../lib/overlayBack"
import { markOverlayClose } from "../lib/closeOverlay"

interface Props {
  /** Ouvert (v-model) */
  modelValue?: boolean
  /** Ne se ferme ni au backdrop ni à Échap */
  persistent?: boolean
  /** **Sans backdrop** : le fond n'est pas assombri et reste **interactif** (les clics le
   *  traversent) — le clic à côté ne ferme donc plus le panneau. Échap, bouton « retour »
   *  et `v-model` restent les moyens de le fermer (voir aussi `persistent`). */
  seamless?: boolean
  /** Largeur max du panneau */
  width?: string
  /** Hauteur du panneau (sinon max-height 90vh) */
  height?: string
  /** Arrondi des coins hauts : true | false | valeur CSS */
  rounded?: boolean | string
  /** Ombre du panneau : `true` (défaut — automatiquement **adoucie** en mode `seamless`,
   *  où il n'y a pas de fond assombri derrière), `false` (aucune ombre) ou une valeur CSS
   *  (`"0 8px 30px rgb(0 0 0 / 0.25)"`). Surchargeable en CSS via `--q-bs-shadow`. */
  shadow?: boolean | string
  dark?: boolean
  /** Fond translucide (frosted glass) : true = 70%, ou valeur % */
  translucent?: boolean | number
  /** Glassmorphism marqué (même recette que `q-header` / `q-footer`) : fond très translucide
   *  + flou fort + bordure claire. **Prioritaire sur `translucent`** ; le flou et le fond
   *  des textes se règlent par `--q-glass-blur` / `--q-glass-bg`. */
  glass?: boolean
  /** Seuil de drag (px) au-delà duquel on ferme */
  dragThreshold?: number
  /** Animation d'ouverture : slide-up (défaut) | fade | zoom */
  transition?: "slide-up" | "fade" | "zoom"
  /** Durée des transitions d'entrée/sortie en ms */
  transitionDuration?: number
  /** Style du panneau (variables de thème pour les contenus téléportés) */
  contentStyle?: Record<string, string>
  /** Points d'ancrage : fractions de la hauteur de vue où le panneau peut se poser,
   *  ex. `[0.25, 0.5, 0.75]` (comme Ionic). Le contenu reste défilable à chaque point
   *  d'ancrage et c'est la poignée qui fait grandir/rétrécir le panneau ; `0` est accepté
   *  et vaut « fermé ». Sans cette prop, le panneau prend la hauteur de son contenu
   *  (bornée par `max-height` / 90vh). */
  breakpoints?: number[] | string
  /** Point d'ancrage courant (`v-model:breakpoint`) : point de départ à l'ouverture, puis
   *  suivi des drags. Une valeur absente de `breakpoints` est ramenée au plus proche. */
  breakpoint?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  persistent: false,
  seamless: false,
  width: "640px",
  rounded: true,
  shadow: true,
  dark: false,
  glass: false,
  dragThreshold: 80,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  /** Nouveau point d'ancrage retenu (`v-model:breakpoint`) */
  "update:breakpoint": [value: number]
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
})

provide<BottomSheetContext>(qBottomSheetKey, {
  open,
  setOpen: (v) => {
    open.value = v
  },
})

// « Retour » navigateur → ferme le bottom sheet au lieu de naviguer
useOverlayBack(open, () => { open.value = false }, "QBottomSheet")

// v-close : marque l'overlay comme fermable (la directive remonte jusqu'ici)
const markOverlay = (el: unknown) => {
  markOverlayClose(el as HTMLElement | null, () => { open.value = false })
}

// Échap + verrouillage du scroll du body
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value && !props.persistent) open.value = false
}

watch(open, (v) => {
  if (typeof document !== "undefined") document.body.style.overflow = v ? "hidden" : ""
})

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("keydown", onDocKeydown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", onDocKeydown)
    document.body.style.overflow = ""
  }
})

// — Points d'ancrage (breakpoints) : le panneau se pose sur des fractions de la hauteur
//   de vue (`:breakpoints="[0.25, 0.5, 0.75]"`). Contrairement au drag historique (qui
//   translate le panneau), on pilote ici sa **hauteur** : le contenu se réagence et reste
//   défilable à chaque point d'ancrage (cf. `lib/bottomSheet.ts`, pur et testé).
const anchors = computed(() => normalizeBreakpoints(props.breakpoints))
const usesBreakpoints = computed(() => anchors.value.length > 0)

/** Fraction courante du panneau (1 = pleine hauteur) */
const currentRatio = ref(1)

/** Dernière valeur **communiquée** au parent (`v-model:breakpoint`) : évite un événement
 *  inutile quand le panneau retombe sur le même point d'ancrage. */
let committedRatio = 1

/** Point d'ancrage demandé par la prop `breakpoint`, ramené à la liste */
const requestedBreakpoint = computed(() => {
  if (typeof props.breakpoint !== "number") return undefined
  return usesBreakpoints.value
    ? nearestBreakpoint(props.breakpoint, anchors.value)
    : clampRatio(props.breakpoint)
})

watch(
  [open, requestedBreakpoint, anchors],
  () => {
    if (!open.value) return
    currentRatio.value = requestedBreakpoint.value ?? anchors.value[0] ?? 1
    committedRatio = currentRatio.value
  },
  { immediate: true },
)

/** Hauteur de vue de référence (barre d'URL mobile exclue quand elle est connue) */
const viewportHeight = () =>
  typeof window === "undefined" ? 0 : (window.visualViewport?.height ?? window.innerHeight)

/** Pose le panneau sur un point d'ancrage et prévient le parent si la valeur change */
const applyBreakpoint = (value: number) => {
  currentRatio.value = value
  if (value === committedRatio) return
  committedRatio = value
  emit("update:breakpoint", value)
}

const stepToBreakpoint = (direction: 1 | -1) => {
  if (!usesBreakpoints.value) return
  applyBreakpoint(stepBreakpoint(currentRatio.value, anchors.value, direction))
}

// — Drag to dismiss (pattern vaul) —
const panelRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
let startY = 0
let currentDy = 0
let startRatio = 1

const onHandleDown = (e: PointerEvent) => {
  // capture du pointeur : peut échouer (pointeur déjà relâché, événement synthétique)
  try {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  } catch {
    /* sans capture, le drag suit tant que le pointeur reste sur la poignée */
  }
  startY = e.clientY
  currentDy = 0
  startRatio = currentRatio.value
  dragging.value = true
}

const onHandleMove = (e: PointerEvent) => {
  if (!dragging.value) return
  currentDy = e.clientY - startY

  if (usesBreakpoints.value) {
    // La hauteur suit le doigt (bornée au plus haut point d'ancrage)
    const highest = Math.max(...anchors.value)
    currentRatio.value = Math.min(
      highest,
      ratioFromDrag(startRatio, currentDy, viewportHeight()),
    )
    return
  }

  currentDy = Math.max(0, currentDy)
  if (panelRef.value) panelRef.value.style.transform = `translateY(${currentDy}px)`
}

const onHandleUp = () => {
  if (!dragging.value) return
  dragging.value = false

  if (usesBreakpoints.value) {
    const height = viewportHeight()
    const threshold = height > 0 ? props.dragThreshold / height : 0.15
    const release = releaseBreakpoint(currentRatio.value, anchors.value, threshold)

    if (release.close) {
      open.value = false
      currentRatio.value = anchors.value[0] ?? 1
      committedRatio = currentRatio.value
    } else if (release.breakpoint !== undefined) {
      applyBreakpoint(release.breakpoint)
    }

    currentDy = 0
    return
  }

  if (currentDy > props.dragThreshold) open.value = false
  else if (panelRef.value) panelRef.value.style.transform = ""
  currentDy = 0
}

/** Poignée au clavier : Entrée / Espace passe au point d'ancrage suivant (Maj : précédent) */
const onHandleKeydown = (e: KeyboardEvent) => {
  if (!usesBreakpoints.value) return
  if (e.key !== "Enter" && e.key !== " ") return
  e.preventDefault()
  stepToBreakpoint(e.shiftKey ? -1 : 1)
}

const panelStyle = computed<Record<string, string>>(() => ({
  maxWidth: props.width,
  // `height` est ignoré en mode breakpoints : la hauteur vient du point d'ancrage
  ...(props.height && !usesBreakpoints.value ? { height: props.height } : {}),
  ...(usesBreakpoints.value ? { "--q-bs-breakpoint": `${currentRatio.value}` } : {}),
}))

const radiusStyle = computed<Record<string, string> | undefined>(() => {
  if (props.rounded === false) return { borderRadius: "0" }
  if (typeof props.rounded === "string") return { borderRadius: props.rounded }
  return undefined
})

/** Ombre : `false` → aucune, une chaîne → telle quelle, `true` → le défaut CSS (adouci en
 *  `seamless`). On passe par `--q-bs-shadow` pour que le défaut reste thémable en CSS. */
const shadowStyle = computed<Record<string, string> | undefined>(() => {
  if (props.shadow === false) return { "--q-bs-shadow": "none" }
  if (typeof props.shadow === "string" && props.shadow.trim() !== "") {
    return { "--q-bs-shadow": props.shadow.trim() }
  }
  return undefined
})

// Nom de transition : q-bs (défaut slide-up) | q-bs-fade | q-bs-zoom
const transitionName = computed(() =>
  props.transition ? `q-bs-${props.transition}` : "q-bs",
)

// Durée (ms) → variables consommées par les transitions/animations CSS
const transitionStyle = computed<Record<string, string> | undefined>(() =>
  props.transitionDuration
    ? {
        "--q-bs-duration-enter": `${props.transitionDuration}ms`,
        "--q-bs-duration-leave": `${props.transitionDuration}ms`,
      }
    : undefined,
)

const panelClasses = computed(() =>
  cn(
    "q-bottom-sheet__panel",
    usesBreakpoints.value && "q-bottom-sheet__panel--breakpoints",
    props.rounded === false && "q-bottom-sheet__panel--square",
    props.dark && "q-bottom-sheet__panel--dark",
    (props.translucent === true || typeof props.translucent === "number") && "q-bottom-sheet__panel--translucent",
    props.glass && "q-bottom-sheet__panel--glass",
    dragging.value && "q-bottom-sheet__panel--dragging",
  ),
)

const translucentStyle = computed<Record<string, string> | undefined>(() =>
  props.translucent === true || typeof props.translucent === "number"
    ? { "--q-translucent-opacity": `${typeof props.translucent === "number" ? props.translucent : 70}%` }
    : undefined,
)

defineExpose({
  /** Point d'ancrage courant (fraction), quand `breakpoints` est utilisé */
  breakpoint: computed(() => (usesBreakpoints.value ? currentRatio.value : undefined)),
  /** Amène le panneau au point d'ancrage le plus proche de `value` */
  setBreakpoint(value: number) {
    if (!usesBreakpoints.value) return
    applyBreakpoint(nearestBreakpoint(value, anchors.value))
  },
  /** Passe au point d'ancrage suivant (`1`) ou précédent (`-1`) */
  stepBreakpoint: stepToBreakpoint,
})
</script>

<template>
  <span v-if="$slots.trigger" class="q-bottom-sheet__trigger" @click="open = true">
    <slot name="trigger" />
  </span>

  <Teleport to="body">
    <Transition :name="transitionName" :duration="transitionDuration">
      <div
        v-if="open"
        :ref="markOverlay"
        class="q-bottom-sheet__overlay"
        :class="cn(seamless && 'q-bottom-sheet__overlay--seamless')"
        @click="!persistent && !seamless && (open = false)"
      >
        <div
          ref="panelRef"
          class="q-bottom-sheet__panel"
          :class="panelClasses"
          :style="[panelStyle, radiusStyle, shadowStyle, translucentStyle, transitionStyle, props.contentStyle]"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <div
            class="q-bottom-sheet__handle"
            :role="usesBreakpoints ? 'button' : undefined"
            :tabindex="usesBreakpoints ? 0 : undefined"
            :aria-label="usesBreakpoints ? 'Changer la hauteur du panneau' : undefined"
            @pointerdown="onHandleDown"
            @pointermove="onHandleMove"
            @pointerup="onHandleUp"
            @pointercancel="onHandleUp"
            @keydown="onHandleKeydown"
          >
            <span class="q-bottom-sheet__handle-bar" />
          </div>
          <div class="q-bottom-sheet__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
