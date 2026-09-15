import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { addTemplate, defineNuxtModule, updateTemplates } from "@nuxt/kit"
import { parseComponent } from "./component-parse"
import { parseMarks } from "./mark-parse"

/**
 * Génère, au build, les métadonnées des composants dnax.ui que le runtime Vue
 * n'expose pas : valeurs possibles des props, slots, events, methods — ainsi que
 * l'**API de chaque marque de graphique** (`lib/chart.ts` → `MARK_OPTIONS` + JSDoc de
 * `QChartMark`).
 * Consommées par <DnaxApi> et <DnaxMarkApi> via le module virtuel
 * `#build/dnax-ui-meta.mjs`.
 *
 * Les sources lues vivent **hors** de `docd/` : elles sont donc ajoutées à la liste des
 * fichiers surveillés en dev (`nuxt.options.watch`) et le module virtuel est régénéré à
 * chaque changement — sans ça, une modification de `chart.ts` (description, MARK_OPTIONS)
 * n'apparaît qu'après un redémarrage du serveur de dev.
 */
export default defineNuxtModule({
  meta: { name: "dnax-ui-meta" },
  setup(_options, nuxt) {
    const uiDir = join(nuxt.options.rootDir, "../packages/ui")
    const componentsDir = join(uiDir, "components")
    const chartFile = join(uiDir, "lib/chart.ts")

    // Sources suivies en dev (hors rootDir : Nuxt ne les surveille pas par défaut).
    nuxt.options.watch.push(join(componentsDir, "*.vue"), join(uiDir, "lib/*.ts"))

    addTemplate({
      filename: "dnax-ui-meta.mjs",
      write: true,
      getContents: () => {
        const meta: Record<string, unknown> = {}
        for (const file of readdirSync(componentsDir)) {
          // Fichiers privés (préfixe « _ ») exclus, comme les générateurs du monorepo.
          if (!file.endsWith(".vue") || file.startsWith("_")) continue
          const name = file.replace(/\.vue$/, "")
          meta[name] = parseComponent(name, readFileSync(join(componentsDir, file), "utf8"))
        }
        const marks = parseMarks(readFileSync(chartFile, "utf8"))
        return `export default ${JSON.stringify(meta)}\nexport const marks = ${JSON.stringify(marks)}\n`
      },
    })

    // Un composant ou `lib/chart.ts` change → régénérer le module virtuel
    nuxt.hook("builder:watch", async (_event, watchedPath) => {
      const file = String(watchedPath).replace(/\\/g, "/")
      if (!file.endsWith(".vue") && !file.endsWith(".ts")) return
      await updateTemplates({ filter: (template) => template.filename === "dnax-ui-meta.mjs" })
    })
  },
})
