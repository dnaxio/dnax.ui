// $q — plugin global style Quasar : dialogues programmatiques.
// $q.dialog.open({ component, componentProps, ... }) pousse un dialogue dans la
// pile (singleton) ; <q-dialog-provider> le rend et le retire à la fermeture.
// Installation (optionnel, pattern Quasar) :
//   app.use(QPlugin)  →  accès $q via this.$q / getCurrentInstance().proxy.$q
// ou import direct :
//   import { $q } from "@dnax/ui"  →  $q.dialog.open(...)
import { ref } from "vue"
import { h } from "vue"
import type { App, Component, Ref } from "vue"
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

export interface NotifyOptions {
  /** Message principal */
  message: string
  /** Sous-texte (caption Quasar) */
  caption?: string
  /** Icône Iconify (ex. : "lucide:info") */
  icon?: string
  /** Couleur de fond : token (primary, negative…) ou hex */
  color?: string
  /** Type → couleur riche sonner (success, error, warning, info) */
  type?: "default" | "success" | "error" | "warning" | "info"
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

  let id: string | number | undefined

  if (color && type === "default") {
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
    id = toasts[type](message, {
      ...data,
      action: action ? { label: action.label, onClick: () => action.handler() } : undefined,
    })
  }

  return { dismiss: () => toast.dismiss(id) }
}

/** API publique : $q.dialog / $q.bottomSheet / $q.notify / $q.platform / $q.breakpoints / $q.screen / $q.loading */
export const $q = {
  dialog: {
    open: openDialog,
  },
  bottomSheet: {
    open: openBottomSheet,
  },
  notify,
  platform,
  breakpoints: qBreakpoints,
  screen,
  loading,
}

/** Accès programmatique au singleton (équivalent useQuasar de Quasar) */
export function useQ() {
  return $q
}

/** Plugin Vue : app.use(QPlugin) → this.$q / proxy.$q (pattern Quasar) */
export const QPlugin = {
  install(app: App) {
    app.config.globalProperties.$q = $q
  },
}

// — Internes consommés par QDialogProvider / QBottomSheetProvider —
export { dialogs as dialogStack, closeDialog }
export { bottomSheets as bottomSheetStack, closeBottomSheet }
