// $q — plugin global style Quasar : dialogues programmatiques.
// $q.dialog.open({ component, componentProps, ... }) pousse un dialogue dans la
// pile (singleton) ; <q-dialog-provider> le rend et le retire à la fermeture.
// Installation (optionnel, pattern Quasar) :
//   app.use(QPlugin)  →  accès $q via this.$q / getCurrentInstance().proxy.$q
// ou import direct :
//   import { $q } from "@dnax/ui"  →  $q.dialog.open(...)
import { inject, ref } from "vue"
import { h } from "vue"
import type { App, Component, InjectionKey, Ref } from "vue"
import { toast } from "vue-sonner"
import type { ExternalToast } from "vue-sonner"
import QNotifyToast from "../components/QNotifyToast.vue"
import { platform, qBreakpoints } from "./platform"
import { screen } from "./screen"
import { loading } from "./loading"

export interface DialogOptions {
  /** Composant de dialogue (SFC importé) ou nom de composant global */
  component: Component | string
  /** Props passées au composant */
  componentProps?: Record<string, any>
  /** Titre affiché par QDialogHeader (optionnel — sinon le composant rend son propre header) */
  title?: string
  description?: string
  /** true = plein écran ; string = largeur CSS ("90%") */
  fullscreen?: boolean | string
  /** Classe appliquée au contenu du dialogue (q-dialog__content) */
  class?: string
  /** Ne se ferme ni au backdrop ni à Échap */
  persistent?: boolean
}

export interface DialogController {
  onOK: (cb: (data?: any) => void | Promise<void>) => DialogController
  onCancel: (cb: () => void | Promise<void>) => DialogController
  onDismiss: (cb: () => void | Promise<void>) => DialogController
  /** Résolveurs enregistrés (consommés par QDialogProvider) */
  _resolvers: {
    ok?: (data?: any) => void | Promise<void>
    cancel?: () => void | Promise<void>
    dismiss?: () => void | Promise<void>
  }
  _opts: DialogOptions
}

// — Contexte plugin dialog (pattern Quasar) —
// Le composant passé à $q.dialog.open({ component }) DOIT contenir un
// <q-dialog v-model="open" @hide="onDialogHide"> à sa racine ; il pilote
// l'ouverture via le composable useDialogPluginComponent().
export interface DialogPluginContext {
  /** Ref d'ouverture (v-model du <q-dialog> du composant) */
  open: Ref<boolean>
  /** Ferme en validant — le résolveur onOK est appelé */
  onOK: (data?: unknown) => void
  /** Ferme en annulant — le résolveur onCancel est appelé */
  onCancel: () => void
  /** Fermé par backdrop / Échap / × — le résolveur onDismiss est appelé */
  onHide: () => void
}

export const qDialogPluginKey: InjectionKey<DialogPluginContext> = Symbol("q-dialog-plugin")

/**
 * Composable Quasar-style pour les composants passés à $q.dialog.open().
 * Le composant doit rendre un <q-dialog v-model="open" @hide="onDialogHide">
 * comme racine. Expose aussi onDialogOK / onDialogCancel pour fermer en validant
 * ou en annulant, et onDialogHide à brancher sur @hide du q-dialog.
 */
export function useDialogPluginComponent() {
  const ctx = inject(qDialogPluginKey, null)
  return {
    open: ctx?.open ?? ref(false),
    onDialogHide: () => ctx?.onHide(),
    onDialogOK: (data?: unknown) => ctx?.onOK(data),
    onDialogCancel: () => ctx?.onCancel(),
  }
}

// — Pile de dialogues (singleton module-level, client-side) —
const dialogs: Ref<DialogController[]> = ref([])

function openDialog(opts: DialogOptions): DialogController {
  const ctrl: DialogController = {
    _resolvers: {},
    _opts: opts,
    onOK(cb) {
      ctrl._resolvers.ok = cb
      return ctrl
    },
    onCancel(cb) {
      ctrl._resolvers.cancel = cb
      return ctrl
    },
    onDismiss(cb) {
      ctrl._resolvers.dismiss = cb
      return ctrl
    },
  }
  dialogs.value.push(ctrl)
  return ctrl
}

/** Retire un dialogue de la pile (appelé par QDialogProvider à la fermeture) */
function closeDialog(ctrl: DialogController) {
  const idx = dialogs.value.indexOf(ctrl)
  if (idx !== -1) dialogs.value.splice(idx, 1)
}

export interface BottomSheetOptions {
  /** Composant à afficher (SFC importé) ou nom de composant global */
  component: Component | string
  /** Props passées au composant */
  componentProps?: Record<string, any>
  /** Titre affiché par QBottomSheetHeader (optionnel) */
  title?: string
  description?: string
  /** Largeur max du panneau (défaut : 640px) */
  width?: string
  /** Hauteur du panneau (sinon max-height 90vh) */
  height?: string
  /** Arrondi des coins hauts : true | false | valeur CSS */
  rounded?: boolean | string
  dark?: boolean
  /** Fond translucide (frosted glass) : true = 70%, ou valeur % */
  translucent?: boolean | number
  /** Ne se ferme ni au backdrop ni à Échap */
  persistent?: boolean
  /** Seuil de drag (px) au-delà duquel on ferme */
  dragThreshold?: number
}

export interface BottomSheetController {
  onOK: (cb: (data?: any) => void | Promise<void>) => BottomSheetController
  onCancel: (cb: () => void | Promise<void>) => BottomSheetController
  onDismiss: (cb: () => void | Promise<void>) => BottomSheetController
  _resolvers: {
    ok?: (data?: any) => void | Promise<void>
    cancel?: () => void | Promise<void>
    dismiss?: () => void | Promise<void>
  }
  _opts: BottomSheetOptions
}

// — Pile de bottom sheets (singleton module-level, client-side) —
const bottomSheets: Ref<BottomSheetController[]> = ref([])

function openBottomSheet(opts: BottomSheetOptions): BottomSheetController {
  const ctrl: BottomSheetController = {
    _resolvers: {},
    _opts: opts,
    onOK(cb) {
      ctrl._resolvers.ok = cb
      return ctrl
    },
    onCancel(cb) {
      ctrl._resolvers.cancel = cb
      return ctrl
    },
    onDismiss(cb) {
      ctrl._resolvers.dismiss = cb
      return ctrl
    },
  }
  bottomSheets.value.push(ctrl)
  return ctrl
}

function closeBottomSheet(ctrl: BottomSheetController) {
  const idx = bottomSheets.value.indexOf(ctrl)
  if (idx !== -1) bottomSheets.value.splice(idx, 1)
}

export interface ImagePreviewOptions {
  /** URLs d'images — string[] ou { src, title? }[] */
  images: (string | { src: string; title?: string })[]
  /** Image initiale */
  index?: number
  /** Transition d'ouverture : fade | up | down | zoom */
  transition?: "fade" | "up" | "down" | "zoom"
  closeBtn?: boolean
  counter?: boolean
  closeOnBackdrop?: boolean
  closeOnSwipeDown?: boolean
  nav?: boolean
  /** Rappel à la fermeture (comme onDismiss des dialogs) */
  onDismiss?: () => void
}

export interface ImagePreviewController {
  /** Va à l'image d'index donné */
  goTo: (index: number) => void
  _opts: ImagePreviewOptions
}

// — Pile de visionneuses (singleton module-level, client-side) —
const imagePreviews: Ref<ImagePreviewController[]> = ref([])

function openImagePreview(opts: ImagePreviewOptions): ImagePreviewController {
  const ctrl: ImagePreviewController = {
    _opts: opts,
    goTo(index) {
      ctrl._opts.index = Math.max(0, index)
    },
  }
  imagePreviews.value.push(ctrl)
  return ctrl
}

/** Retire une visionneuse de la pile (appelé par QImagePreviewProvider à la fermeture) */
function closeImagePreview(ctrl: ImagePreviewController) {
  const idx = imagePreviews.value.indexOf(ctrl)
  if (idx !== -1) imagePreviews.value.splice(idx, 1)
}

export interface NotifyOptions {
  /** Message principal */
  message: string
  /** Sous-texte (caption Quasar) */
  caption?: string
  /** Icône Iconify (ex. : "lucide:info") */
  icon?: string
  /** Couleur de fond : token (primary, negative…) ou hex */
  color?: string
  /** Type → couleur riche sonner. Tokens Quasar acceptés : positive = success,
   *  negative = error, warning, info (success/error aussi acceptés). */
  type?: "default" | "success" | "error" | "warning" | "info" | "positive" | "negative"
  /** Position (défaut : bottom-right, celle du QNotifyProvider) */
  position?: ExternalToast["position"]
  /** Durée d'affichage en ms (défaut : 4000) */
  timeout?: number
  /** Bouton(s) d'action — la première est affichée */
  actions?: { label: string; handler: () => void }[]
}

export interface NotifyController {
  /** Ferme la notification immédiatement */
  dismiss: () => void
}

function notify(opts: NotifyOptions): NotifyController {
  const { message, caption, icon, color, type = "default", position, timeout, actions } = opts
  const action = actions?.[0]
  const data: ExternalToast = {
    description: caption,
    duration: timeout ?? 4000,
    position,
    icon: icon ? h(icon) : undefined,
  }

  // Tokens Quasar → types sonner : positive = success, negative = error
  const sonnerType =
    type === "positive" ? "success" : type === "negative" ? "error" : type

  let id: string | number | undefined

  if (color && sonnerType === "default") {
    // Couleur Quasar custom → rendu custom (QNotifyToast)
    id = toast.custom(QNotifyToast, {
      ...data,
      componentProps: {
        message,
        caption,
        icon,
        color,
        actionLabel: action?.label,
        onAction: action ? () => action.handler() : undefined,
        onDismiss: () => toast.dismiss(id),
      },
    })
  }
  else {
    const toasts = {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      default: toast,
    } as const
    id = toasts[sonnerType](message, {
      ...data,
      action: action ? { label: action.label, onClick: () => action.handler() } : undefined,
    })
  }

  return { dismiss: () => toast.dismiss(id) }
}

// API publique : $q.dialog / $q.bottomSheet / $q.notify / $q.imagePreview / $q.platform / $q.breakpoints / $q.screen / $q.loading
// Conventions Quasar : .open() pour les piles (dialog, bottomSheet, imagePreview),
// .show() pour notify et loading.
const notifyPlugin = notify as typeof notify & { show: typeof notify }
notifyPlugin.show = notify

export const $q = {
  dialog: {
    open: openDialog,
  },
  bottomSheet: {
    open: openBottomSheet,
  },
  imagePreview: {
    open: openImagePreview,
  },
  notify: notifyPlugin,
  platform,
  breakpoints: qBreakpoints,
  screen,
  loading,
}

/** Accès programmatique aux plugins ($q.dialog, $q.notify, $q.loading…) */
export function usePlugin() {
  return $q
}

/** @deprecated Utilisez usePlugin() — conservé pour rétrocompatibilité */
export const useQ = usePlugin

/** Plugin Vue : app.use(QPlugin) → this.$q / proxy.$q (pattern Quasar) */
export const QPlugin = {
  install(app: App) {
    app.config.globalProperties.$q = $q
  },
}

// — Internes consommés par QDialogProvider / QBottomSheetProvider / QImagePreviewProvider —
export { dialogs as dialogStack, closeDialog }
export { bottomSheets as bottomSheetStack, closeBottomSheet }
export { imagePreviews as imagePreviewStack, closeImagePreview }
