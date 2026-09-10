import { createApp, h, Fragment } from "vue"
import {
  QBottomSheetProvider,
  QDialogProvider,
  QImagePreviewProvider,
  QLoadingProvider,
  QNotifyProvider,
} from "@dnax/ui/runtime"

/**
 * Monte les providers des APIs impératives `$q` (dialog, bottom sheet, notify,
 * loading, image preview) — sinon les démos `$q.dialog({…})`, `$q.notify({…})`,
 * `$q.loading.show()`, `$q.bottomSheet({…})` et `$q.imagePreview.open()` ne
 * rendent rien (Docus n'a pas de `<q-config-provider>` racine).
 *
 * Montage dans une app Vue DÉTACHÉE (hors de l'arbre Docus) : les providers lisent
 * la pile partagée de `@dnax/ui`, donc une seule instance suffit pour toute la page.
 * On monte les providers directement (pas via QConfigProvider) pour ne pas entrer
 * en conflit avec le mode sombre géré par Docus.
 */
export default defineNuxtPlugin(() => {
  if (typeof document === "undefined") return
  if (document.getElementById("dnax-providers")) return

  const host = document.createElement("div")
  host.id = "dnax-providers"
  document.body.appendChild(host)

  createApp({
    render: () =>
      h(Fragment, [
        h(QDialogProvider),
        h(QBottomSheetProvider),
        h(QNotifyProvider),
        h(QLoadingProvider),
        h(QImagePreviewProvider),
      ]),
  }).mount(host)
})
