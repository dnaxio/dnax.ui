// runtime.ts — **surface runtime** consommée par les plugins (module Nuxt + plugins de
// l'app hôte). Elle contient, et rien de plus :
//   - l'API directive / overlay (`installOverlayBackHandler`, `v-close`, `v-ripple`,
//     `v-touch-*`, `v-intersection`) ;
//   - l'API impérative `$q` (composables `usePlugin` / `useDialogPluginComponent`…) ;
//   - les **providers** de `$q` (dialog, bottom sheet, notify, loading, image preview),
//     montés au boot par l'app hôte.
//
// ⚠️ Ne JAMAIS réexporter `index.ts` ici. Le barrel importe **tous** les composants et,
// avec eux, leurs dépendances lourdes (echarts, @maptiler/sdk, swiper, shiki, uqr…) : une
// sous-entrée qui pointe sur `index.ts` les évalue au boot, même si l'app n'utilise aucun
// de ces composants. C'est tout l'intérêt de ce fichier — voir `.memory/warnings.md`.
//
// Pour *résoudre un composant par son nom* (tableaux d'API, docs), importer le barrel
// `@dnax/ui` — pas cette entrée.
export {
  installOverlayBackHandler,
  registerOverlay,
  unregisterOverlay,
  hasOpenOverlays,
  closeTopmostOverlay,
  useOverlayBack,
} from "./lib/overlayBack"
export type { OverlayHandle } from "./lib/overlayBack"
export { markOverlayClose, closeParentOverlay, vClose } from "./lib/closeOverlay"
export { vRipple } from "./lib/ripple"
export { vTouchPan } from "./lib/touchPan"
export { vTouchHold } from "./lib/touchHold"
export { vTouchSwipe } from "./lib/touchSwipe"
export { vTouchRepeat } from "./lib/touchRepeat"
export { vIntersection } from "./lib/intersection"

// — API impérative `$q` (composables) —
export {
  $q,
  usePlugin,
  useQ,
  QPlugin,
  useDialogPluginComponent,
  useBottomSheetPluginComponent,
} from "./lib/q"

// — Providers de `$q` (montés au boot par l'app hôte) —
export { default as QDialogProvider } from "./components/QDialogProvider.vue"
export { default as QBottomSheetProvider } from "./components/QBottomSheetProvider.vue"
export { default as QNotifyProvider } from "./components/QNotifyProvider.vue"
export { default as QLoadingProvider } from "./components/QLoadingProvider.vue"
export { default as QImagePreviewProvider } from "./components/QImagePreviewProvider.vue"
