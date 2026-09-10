/**
 * Module Nuxt pour @dnax/ui.
 * Usage : `modules: ["@dnax/ui"]` dans nuxt.config.ts.
 *
 * - Auto-importe les composants Q* (balises kebab-case : <q-btn>, <q-header>…)
 * - Ajoute styles/main.css (safe-area, tokens, styles de tous les composants)
 *
 * Options (clé `dnaxUi`) :
 *   components: false  — désactive l'auto-import des composants
 *   css: false         — désactive l'ajout de styles/main.css
 */
import { addComponentsDir, addPluginTemplate, createResolver, defineNuxtModule } from "@nuxt/kit"

export interface DnaxUiModuleOptions {
  /** Auto-importe les composants Q* (défaut : true) */
  components?: boolean
  /** Ajoute styles/main.css (défaut : true) */
  css?: boolean
  /** Installe le handler « retour » : ferme l'overlay ouvert au lieu de naviguer (défaut : true) */
  overlayBack?: boolean
}

/** Custom elements du framework HTML Video.js v10 (@videojs/html) — balises non-Vue */
const VIDEOJS_CUSTOM_ELEMENTS = [
  "video-player",
  "video-skin",
  "youtube-video",
  "hlsjs-video",
  "mux-video",
]

export default defineNuxtModule<DnaxUiModuleOptions>({
  meta: {
    name: "@dnax/ui",
    configKey: "dnaxUi",
    compatibility: { nuxt: ">=3.12.0" },
  },
  defaults: {
    components: true,
    css: true,
    overlayBack: true,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Les balises <video-player>/<youtube-video>… sont des custom elements @videojs/html,
    // pas des composants Vue → les exclure de la résolution (évite le warn
    // « Failed to resolve component »).
    nuxt.options.vue.compilerOptions ??= {}
    const existing = nuxt.options.vue.compilerOptions.isCustomElement
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) =>
      VIDEOJS_CUSTOM_ELEMENTS.includes(tag) ||
      (typeof existing === "function" ? existing(tag) : false)

    if (options.css) {
      const cssPath = resolve("./styles/main.css")
      if (!nuxt.options.css.includes(cssPath)) {
        nuxt.options.css.push(cssPath)
      }
    }

    if (options.components) {
      addComponentsDir({
        path: resolve("./components"),
        prefix: "", // pas de préfixe : QBtn.vue → <q-btn>
        pathPrefix: false, // pas de préfixe par sous-dossier
        ignore: ["**/internal/**"], // composants internes : non auto-importés
      })
    }

    // « Retour » navigateur → ferme l'overlay ouvert (dialog, sheet, sidebar…)
    // addPluginTemplate : le template est compilé dans l'app (où #imports existe),
    // évitant une dépendance `nuxt` dans ce package pour les types du plugin.
    if (options.overlayBack) {
      addPluginTemplate({
        filename: "dnax-ui-overlay-back.mjs",
        mode: "client",
        getContents: () => `
import { defineNuxtPlugin } from "#imports"
import { installOverlayBackHandler } from "@dnax/ui/runtime"

export default defineNuxtPlugin((nuxtApp) => {
  installOverlayBackHandler(nuxtApp.$router)
})
`,
      })
    }

    // Directive globale v-close / v-ripple / v-touch-* / v-intersection :
    // <q-btn v-close>, <div v-ripple.center>…
    // Plugin UNIVERSEL (pas "client") : sans enregistrement côté serveur, tout
    // rendu SSR/SSG d'une page utilisant une directive crash (Vue SSR lit
    // `dir.getSSRProps` sur une directive non résolue → `undefined`).
    // Les directives n'ont pas de getSSRProps : en SSR elles rendent `{}` (no-op).
    addPluginTemplate({
      filename: "dnax-ui-directives.mjs",
      getContents: () => `
import { defineNuxtPlugin } from "#imports"
import { vClose } from "@dnax/ui/runtime"
import { vRipple } from "@dnax/ui/runtime"
import { vTouchPan } from "@dnax/ui/runtime"
import { vTouchHold } from "@dnax/ui/runtime"
import { vTouchSwipe } from "@dnax/ui/runtime"
import { vTouchRepeat } from "@dnax/ui/runtime"
import { vIntersection } from "@dnax/ui/runtime"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("close", vClose)
  nuxtApp.vueApp.directive("ripple", vRipple)
  nuxtApp.vueApp.directive("touch-pan", vTouchPan)
  nuxtApp.vueApp.directive("touch-hold", vTouchHold)
  nuxtApp.vueApp.directive("touch-swipe", vTouchSwipe)
  nuxtApp.vueApp.directive("touch-repeat", vTouchRepeat)
  nuxtApp.vueApp.directive("intersection", vIntersection)
})
`,
    })
  },
})
