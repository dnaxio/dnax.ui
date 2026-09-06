<script lang="ts">
// QBottomSheet — bottom sheet type Drawer shadcn-vue (vaul), style Quasar :
// <q-bottom-sheet v-model="open"> + slot trigger / QBottomSheetHeader / QBottomSheetFooter
// Drag vers le bas pour fermer, backdrop, Échap, safe-area bottom.
import type { InjectionKey, Ref } from "vue"

export interface BottomSheetContext {
  open: Readonly<Ref<boolean>>
  setOpen: (v: boolean) => void
}

export const qBottomSheetKey: InjectionKey<BottomSheetContext> = Symbol("q-bottom-sheet")
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from "vue"
import { cn } from "../lib/utils"
import { useOverlayBack } from "../lib/overlayBack"
import { markOverlayClose } from "../lib/closeOverlay"

interface Props {
  /** Ouvert (v-model) */
  modelValue?: boolean
  /** Ne se ferme ni au backdrop ni à Échap */
  persistent?: boolean
  /** Largeur max du panneau */
  width?: string
  /** Hauteur du panneau (sinon max-height 90vh) */
  height?: string
  /** Arrondi des coins hauts : true | false | valeur CSS */
  rounded?: boolean | string
  dark?: boolean
  /** Fond translucide (frosted glass) : true = 70%, ou valeur % */
  translucent?: boolean | number
  /** Seuil de drag (px) au-delà duquel on ferme */
  dragThreshold?: number
  /** Animation d'ouverture : slide-up (défaut) | fade | zoom */
  transition?: "slide-up" | "fade" | "zoom"
  /** Durée des transitions d'entrée/sortie en ms */
  transitionDuration?: number
  /** Style du panneau (variables de thème pour les contenus téléportés) */
  contentStyle?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  persistent: false,
  width: "640px",
  rounded: true,
  dark: false,
  dragThreshold: 80,
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

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

// — Drag to dismiss (pattern vaul) —
const panelRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
let startY = 0
let currentDy = 0

const onHandleDown = (e: PointerEvent) => {
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  startY = e.clientY
  currentDy = 0
  dragging.value = true
}

const onHandleMove = (e: PointerEvent) => {
  if (!dragging.value) return
  currentDy = Math.max(0, e.clientY - startY)
  if (panelRef.value) panelRef.value.style.transform = `translateY(${currentDy}px)`
}

const onHandleUp = () => {
  if (!dragging.value) return
  dragging.value = false
  if (currentDy > props.dragThreshold) open.value = false
  else if (panelRef.value) panelRef.value.style.transform = ""
  currentDy = 0
}

const panelStyle = computed<Record<string, string>>(() => ({
  maxWidth: props.width,
  ...(props.height ? { height: props.height } : {}),
}))

const radiusStyle = computed<Record<string, string> | undefined>(() => {
  if (props.rounded === false) return { borderRadius: "0" }
  if (typeof props.rounded === "string") return { borderRadius: props.rounded }
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
    props.rounded === false && "q-bottom-sheet__panel--square",
    props.dark && "q-bottom-sheet__panel--dark",
    (props.translucent === true || typeof props.translucent === "number") && "q-bottom-sheet__panel--translucent",
    dragging.value && "q-bottom-sheet__panel--dragging",
  ),
)

const translucentStyle = computed<Record<string, string> | undefined>(() =>
  props.translucent === true || typeof props.translucent === "number"
    ? { "--q-translucent-opacity": `${typeof props.translucent === "number" ? props.translucent : 70}%` }
    : undefined,
)
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
        @click="!persistent && (open = false)"
      >
        <div
          ref="panelRef"
          class="q-bottom-sheet__panel"
          :class="panelClasses"
          :style="[panelStyle, radiusStyle, translucentStyle, transitionStyle, props.contentStyle]"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <div
            class="q-bottom-sheet__handle"
            @pointerdown="onHandleDown"
            @pointermove="onHandleMove"
            @pointerup="onHandleUp"
            @pointercancel="onHandleUp"
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
