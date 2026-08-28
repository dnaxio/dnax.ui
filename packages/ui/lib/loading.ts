// $q.loading — overlay de chargement plein écran façon Quasar
// (https://quasar.dev/quasar-plugins/loading) : $q.loading.show(opts) / hide() / isActive.
import { reactive, ref } from "vue"
import type { Ref } from "vue"

export interface LoadingOptions {
  /** Message sous le spinner */
  message?: string
  /** Taille du spinner en px (défaut : 48) */
  spinnerSize?: number
  /** Couleur du spinner : token (primary…) ou hex (défaut : primary) */
  spinnerColor?: string
  /** Couleur du message (défaut : #1d1d1d) */
  messageColor?: string
  /** Fond de l'overlay (défaut : rgb(0 0 0 / 0.3)) */
  backgroundColor?: string
  /** Délai avant affichage en ms (défaut : 0) */
  delay?: number
  /** show()/hide() comptés — hide() ne cache que quand tous les show sont retirés */
  group?: boolean
  /** Icône Iconify affichée à la place du spinner (ex. : "lucide:loader-circle") */
  icon?: string
  /** Couleur de l'icône (défaut : spinnerColor) */
  iconColor?: string
}

export interface QLoading {
  show: (options?: LoadingOptions) => void
  hide: () => void
  /** true tant que le loading est affiché */
  isActive: Ref<boolean>
}

const visible = ref(false)
const opts = reactive<Required<Pick<LoadingOptions, "spinnerSize" | "spinnerColor" | "messageColor" | "backgroundColor" | "delay" | "group">> & LoadingOptions>({
  spinnerSize: 48,
  spinnerColor: "primary",
  messageColor: "#1d1d1d",
  backgroundColor: "rgb(0 0 0 / 0.3)",
  delay: 0,
  group: false,
  icon: undefined,
  iconColor: undefined,
})

let groupCount = 0
let timer: ReturnType<typeof setTimeout> | undefined

function show(options?: LoadingOptions) {
  if (options) Object.assign(opts, options)
  if (opts.group) groupCount++
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = true
  }, opts.delay ?? 0)
}

function hide() {
  if (opts.group) {
    groupCount = Math.max(0, groupCount - 1)
    if (groupCount > 0) return
  }
  if (timer) clearTimeout(timer)
  visible.value = false
}

export const loading: QLoading & { _opts: typeof opts } = {
  show,
  hide,
  isActive: visible,
  _opts: opts,
}
