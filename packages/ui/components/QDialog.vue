<script lang="ts">
// QDialog — modale type Dialog shadcn-vue (reka-ui), API Quasar.
// <q-dialog v-model="open" persistent position="bottom"> + QDialogTrigger/Header/Footer
import type { InjectionKey } from "vue"

export interface DialogContext {
  setOpen: (v: boolean) => void
}

export const qDialogKey: InjectionKey<DialogContext> = Symbol("q-dialog")
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, watch } from "vue"
import type { StyleValue } from "vue"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"
import { useOverlayBack } from "../lib/overlayBack"

type DialogPosition = "standard" | "top" | "right" | "bottom" | "left"

interface Props {
  /** Ouvert (v-model) */
  modelValue?: boolean
  /** Ne se ferme ni au backdrop ni à Échap */
  persistent?: boolean
  /** Plein écran */
  maximized?: boolean
  /** Position : standard (centré) | top | right | bottom | left */
  position?: DialogPosition
  /** Coins droits */
  square?: boolean
  /** Coins arrondis : true = md, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
  fullWidth?: boolean
  fullHeight?: boolean
  contentClass?: string
  /** Style(s) du panneau — string, objet ou tableau (comme la prop style de Vue) */
  contentStyle?: StyleValue
  noBackdropDismiss?: boolean
  noEscDismiss?: boolean
  /** Animation : fade | zoom | slide-up | slide-down | slide-left | slide-right | swipe-left | swipe-right (sinon basée sur position) */
  transition?: "fade" | "zoom" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "swipe-left" | "swipe-right"
  /** Durée des transitions d'entrée/sortie en ms (défaut CSS : ~200ms entrée, ~150ms sortie) */
  transitionDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  persistent: false,
  maximized: false,
  position: "standard",
  square: false,
  fullWidth: false,
  fullHeight: false,
  contentClass: "",
  contentStyle: "",
  noBackdropDismiss: false,
  noEscDismiss: false,
  transitionDuration: undefined,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  show: []
  hide: []
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
})

provide<DialogContext>(qDialogKey, {
  setOpen: (v) => {
    open.value = v
  },
})

// Échap + verrouillage du scroll du body
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value && !props.persistent && !props.noEscDismiss) {
    open.value = false
  }
}

// « Retour » navigateur → ferme le dialog au lieu de naviguer
useOverlayBack(open, () => { open.value = false }, "QDialog")

// — Verrou du scroll de la page derrière le dialog —
// Compteur module-level + suivi par instance : chaque dialog verrouille au plus
// une fois et déverrouille au plus une fois → pile de dialogs ($q.dialog) sans
// déverrouillage prématuré. Verrouille html + body (iOS Safari ignore
// overflow:hidden sur body seul).
let scrollLockCount = 0
function setBodyScrollLock(locked: boolean) {
  if (typeof document === "undefined") return
  scrollLockCount = Math.max(0, scrollLockCount + (locked ? 1 : -1))
  const on = scrollLockCount > 0
  document.documentElement.style.overflow = on ? "hidden" : ""
  document.body.style.overflow = on ? "hidden" : ""
}

let didLock = false
const lockIf = (v: boolean) => {
  if (v && !didLock) {
    didLock = true
    setBodyScrollLock(true)
  }
  else if (!v && didLock) {
    didLock = false
    setBodyScrollLock(false)
  }
}

onMounted(() => lockIf(props.modelValue))
watch(open, lockIf)
onBeforeUnmount(() => {
  if (didLock) setBodyScrollLock(false)
})

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("keydown", onDocKeydown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", onDocKeydown)
  }
  if (didLock) setBodyScrollLock(false)
})

const overlayClasses = computed(() => cn("q-dialog__overlay", `q-dialog__overlay--${props.position}`))

// radius : prop explicite > composantProps.QDialog.radius ; échelle → --q-radius
const effectiveRadius = useRadius("QDialog", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const contentClasses = computed(() =>
  cn(
    "q-dialog__content",
    `q-dialog__content--${props.position}`,
    props.maximized && "q-dialog__content--maximized",
    props.square && "q-dialog__content--square",
    props.fullWidth && "q-dialog__content--full-width",
    props.fullHeight && "q-dialog__content--full-height",
    props.contentClass,
  ),
)

// Nom de la transition : custom (prop) ou défaut basé sur position
const transitionName = computed(() =>
  props.transition ? `q-dialog-${props.transition}` : "q-dialog",
)

// Durée des transitions (enter/leave) via variables CSS sur l'overlay
const durationStyle = computed<StyleValue>(() =>
  props.transitionDuration
    ? {
        "--q-dialog-duration-enter": `${props.transitionDuration}ms`,
        "--q-dialog-duration-leave": `${props.transitionDuration}ms`,
      }
    : {},
)
</script>

<template>
  <Teleport to="body">
    <Transition :name="transitionName" @after-enter="emit('show')" @after-leave="emit('hide')">
      <div
        v-if="open"
        class="q-dialog__overlay"
        :class="overlayClasses"
        :style="durationStyle"
        @mousedown.self="!persistent && !noBackdropDismiss && (open = false)"
      >
        <div
          v-if="open"
          class="q-dialog__content"
          :class="contentClasses"
          :style="[contentStyle, roundedStyle]"
          role="dialog"
          aria-modal="true"
          @mousedown.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
