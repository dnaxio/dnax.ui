import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { addTemplate, defineNuxtModule } from "@nuxt/kit"
import { parseComponent } from "./component-parse"

/**
 * Génère, au build, les métadonnées des composants dnax.ui que le runtime Vue
 * n'expose pas : valeurs possibles des props, slots, events, methods.
 * Consommées par <DnaxApi> via le module virtuel `#build/dnax-ui-meta.mjs`.
 */
export default defineNuxtModule({
  meta: { name: "dnax-ui-meta" },
  setup(_options, nuxt) {
    const componentsDir = join(nuxt.options.rootDir, "../packages/ui/components")

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
        return `export default ${JSON.stringify(meta)}\n`
      },
    })
  },
})
