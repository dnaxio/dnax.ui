/**
 * Regenerates `index.ts` with one explicit export per component.
 * Run with: bun scripts/generate-exports.ts
 */
import { readdir } from "node:fs/promises"

const componentsDir = new URL("../components/", import.meta.url)
const indexFile = new URL("../index.ts", import.meta.url)

const toPascalCase = (name: string) =>
  name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

const files = (await readdir(componentsDir))
  .filter((file) => file.endsWith(".vue"))
  .sort()

const exports = files
  .map(
    (file) =>
      `export { default as ${toPascalCase(file.replace(/\.vue$/, ""))} } from "./components/${file}"`,
  )
  .join("\n")

// Exports manuels (composables / helpers) — conservés à chaque régénération
const manualExports = `
export { $q, usePlugin, useQ, QPlugin, dialogStack, closeDialog, bottomSheetStack, closeBottomSheet, useDialogPluginComponent, useBottomSheetPluginComponent } from "./lib/q"
export type {
  DialogOptions,
  DialogController,
  BottomSheetOptions,
  BottomSheetController,
  BottomSheetPluginContext,
  NotifyOptions,
  NotifyController,
} from "./lib/q"
export { platform, qBreakpoints } from "./lib/platform"
export type { QPlatform } from "./lib/platform"
export { screen } from "./lib/screen"
export type { QScreen } from "./lib/screen"
export { loading } from "./lib/loading"
export type { LoadingOptions, QLoadingPlugin } from "./lib/loading"
export { localStorage, sessionStorage } from "./lib/storage"
export type { QWebStorage } from "./lib/storage"
export {
  registerOverlay,
  unregisterOverlay,
  hasOpenOverlays,
  closeTopmostOverlay,
  useOverlayBack,
  installOverlayBackHandler,
} from "./lib/overlayBack"
export type { OverlayHandle } from "./lib/overlayBack"
export { markOverlayClose, closeParentOverlay, vClose } from "./lib/closeOverlay"
export { vTouchPan } from "./lib/touchPan"
export type { PanDetails, TouchPanHandler, PanDirection } from "./lib/touchPan"
export { vTouchHold } from "./lib/touchHold"
export type { TouchHoldDetails, TouchHoldHandler } from "./lib/touchHold"
export { vTouchSwipe } from "./lib/touchSwipe"
export type { TouchSwipeDetails, TouchSwipeHandler, SwipeDirection } from "./lib/touchSwipe"
export { vTouchRepeat } from "./lib/touchRepeat"
export type { TouchRepeatDetails, TouchRepeatHandler } from "./lib/touchRepeat"
export { vIntersection } from "./lib/intersection"
export type { IntersectionValue } from "./lib/intersection"
`

await Bun.write(indexFile, `${exports}\n${manualExports}`)
console.log(`✓ ${files.length} composant(s) exporté(s) dans index.ts`)
