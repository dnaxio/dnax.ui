/**
 * Module Nuxt pour @dnax/ui.
 * Usage : `modules: ["@dnax/ui"]` dans nuxt.config.ts.
 *
 * - Auto-importe les composants Q* (balises kebab-case : <q-btn>, <q-header>…)
 * - Ajoute styles/main.css (safe-area, tokens, styles de tous les composants)
 * - **Embarque les icônes** : enregistre un sous-ensemble `lucide` auprès d'Iconify
 *   (`addCollection`) — design system + (par défaut) les icônes `lucide:…` trouvées
 *   dans les sources de l'app. Aucune requête vers l'API Iconify pour ces noms, et les
 *   `<path>` sont présents dès le SSR.
 *
 * Options (clé `dnaxUi`) :
 *   components: false            — désactive l'auto-import des composants
 *   css: false                   — désactive l'ajout de styles/main.css
 *   icons: false                 — n'embarque aucune icône (API Iconify à la demande)
 *   icons: { scan: false }       — n'embarque que le design system
 *   icons: { dirs: ["app"] }     — limite le scan (chemins relatifs à rootDir)
 */
import { addComponentsDir, addPluginTemplate, createResolver, defineNuxtModule, updateTemplates } from "@nuxt/kit"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join, resolve } from "node:path"
import { lucideIconSet } from "./lib/iconSet"
import {
  buildIconSet,
  mergeIconSets,
  scrapeIconNames,
  type IconifySourceCollection,
} from "./lib/iconSetScrape"

export interface DnaxUiIconsOptions {
  /**
   * Scanne les sources de l'app au build pour embarquer aussi **ses** icônes
   * `lucide:` (défaut : true)
   */
  scan?: boolean
  /** Dossiers à scanner, résolus depuis `rootDir` (défaut : tout `rootDir`) */
  dirs?: string[]
}

export interface DnaxUiModuleOptions {
  /** Auto-importe les composants Q* (défaut : true) */
  components?: boolean
  /** Ajoute styles/main.css (défaut : true) */
  css?: boolean
  /** Installe le handler « retour » : ferme l'overlay ouvert au lieu de naviguer (défaut : true) */
  overlayBack?: boolean
  /**
   * Icônes : `false` = rien d'embarqué (API Iconify à la demande) ; objet = réglages
   * du scan. Par défaut : sous-ensemble du design system **+** scan des sources.
   */
  icons?: boolean | DnaxUiIconsOptions
}

/** Collection Iconify lue pour résoudre les noms (`@iconify-json/lucide`). */
const LUCIDE_COLLECTION = "@iconify-json/lucide/icons.json"

/**
 * Charge la collection `lucide`. Elle vit dans les dépendances de `@dnax/ui` ; on tente
 * la résolution depuis ce module, puis depuis l'app hôte (hoisting).
 */
const loadLucideCollection = (rootDir: string): IconifySourceCollection | null => {
  const resolvers = [
    () => createRequire(import.meta.url).resolve(LUCIDE_COLLECTION),
    () => createRequire(join(rootDir, "package.json")).resolve(LUCIDE_COLLECTION),
  ]
  for (const resolveSpec of resolvers) {
    try {
      return JSON.parse(readFileSync(resolveSpec(), "utf8")) as IconifySourceCollection
    } catch {
      // on passe au résolveur suivant
    }
  }
  return null
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
    overlayBack: true,
    icons: { scan: true },
  },
  setup(options, nuxt) {
    const { resolve: resolvePath } = createResolver(import.meta.url)

    if (options.css) {
      const cssPath = resolvePath("./styles/main.css")
      if (!nuxt.options.css.includes(cssPath)) {
        nuxt.options.css.push(cssPath)
      }
    }

    if (options.components) {
      addComponentsDir({
        path: resolvePath("./components"),
        prefix: "", // pas de préfixe : QBtn.vue → <q-btn>
        pathPrefix: false, // pas de préfixe par sous-dossier
        ignore: ["**/internal/**"], // composants internes : non auto-importés
      })
    }

    // — Icônes embarquées ---------------------------------------------------------
    // Plugin **universel** : côté serveur aussi, sinon le SSR ne rend que des coquilles
    // `<svg class="iconify">`, les `<path>` n'arrivant qu'après le fetch client (et
    // jamais sans réseau). `addCollection` est purement local et **fusionne**.
    if (options.icons !== false) {
      const iconsOptions: DnaxUiIconsOptions =
        typeof options.icons === "object" ? options.icons : {}
      const scan = iconsOptions.scan !== false

      const dirs = iconsOptions.dirs?.length
        ? iconsOptions.dirs.map((dir) => resolve(nuxt.options.rootDir, dir))
        : [nuxt.options.rootDir]

      const collection = scan ? loadLucideCollection(nuxt.options.rootDir) : null
      if (scan && !collection) {
        console.warn(
          "[@dnax/ui] `@iconify-json/lucide` introuvable : seules les icônes du design system sont embarquées. " +
            "Installez-le (`bun add -D @iconify-json/lucide`) pour scanner votre app.",
        )
      }

      addPluginTemplate({
        filename: "dnax-ui-icons.mjs",
        getContents: () => {
          let set = lucideIconSet
          let scanned = false
          if (collection) {
            const { set: appSet, missing } = buildIconSet(collection, scrapeIconNames(dirs))
            set = mergeIconSets(lucideIconSet, appSet)
            scanned = true
            if (nuxt.options.dev && missing.length) {
              console.warn(
                `[@dnax/ui] icône(s) \`lucide:\` absente(s) de la collection (faute de frappe ?) : ${missing.join(", ")}`,
              )
            }
          }
          return `
import { defineNuxtPlugin } from "#imports"
import { registerIconSet } from "@dnax/ui/runtime"

// Sous-ensemble \`lucide\` embarqué (${Object.keys(set.icons).length} icônes) :
// design system${scanned ? " + sources de l'app" : ""}. Aucune requête vers l'API Iconify
// pour ces noms ; les autres retombent dessus (progressive enhancement).
const ICON_SET = ${JSON.stringify(set)}

export default defineNuxtPlugin(() => {
  registerIconSet(ICON_SET)
})
`
        },
      })

      // Dev : une icône ajoutée dans les sources régénère le module virtuel — sans ça
      // il faudrait redémarrer le serveur pour l'embarquer (en attendant, l'icône
      // s'affiche via l'API : dégradation, pas rupture).
      if (scan) {
        nuxt.hook("builder:watch", async (_event, watchedPath) => {
          if (!/\.(vue|ts|js|mjs|md|mdx)$/.test(String(watchedPath).replace(/\\/g, "/"))) return
          await updateTemplates({ filter: (template) => template.filename === "dnax-ui-icons.mjs" })
        })
      }
    }

    // Dépendances CJS sans export ESM `default` explicite : esbuild doit les pré-bundler
    // (interop) sinon, servies brutes, le navigateur échoue sur « does not provide an
    // export named 'default' ». `leaflet` (lib/mapLeaflet.ts) est dans ce cas ; le code
    // tolère déjà les deux formes (`default ?? module`), ceci est une ceinture-bretelles
    // côté hôte. Ne pas pointer une sous-entrée sur `index.ts` (cf. warnings en mémoire).
    nuxt.hook("vite:extendConfig", (config) => {
      const optimizeDeps = ((config as any).optimizeDeps ||= {})
      const include: string[] = (optimizeDeps.include ||= [])
      if (!include.includes("leaflet")) include.push("leaflet")
    })

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
