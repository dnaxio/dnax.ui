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
import { addComponentsDir, createResolver, defineNuxtModule } from "@nuxt/kit"

export interface DnaxUiModuleOptions {
  /** Auto-importe les composants Q* (défaut : true) */
  components?: boolean
  /** Ajoute styles/main.css (défaut : true) */
  css?: boolean
}

export default defineNuxtModule<DnaxUiModuleOptions>({
  meta: {
    name: "@dnax/ui",
    configKey: "dnaxUi",
    compatibility: { nuxt: ">=3.12.0" },
  },
  defaults: {
    components: true,
    css: true,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

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
  },
})
