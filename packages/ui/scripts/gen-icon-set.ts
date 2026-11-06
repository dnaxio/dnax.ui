/**
 * Génère un **sous-ensemble** de la collection `lucide` contenant uniquement les
 * icônes réellement référencées dans le code, sous forme d'un module TS prêt à être
 * embarqué dans le bundle.
 *
 * C'est ce qui produit `lib/iconSet.ts` (icônes du design system, figées et testées).
 * Le module Nuxt fait la même chose **à la volée** pour les sources de l'app hôte
 * (option `icons.scan`) ; ce script sert quand on veut un fichier committé, ou sans Nuxt.
 *
 * Usage :
 *   # design system (composants + lib) → packages/ui/lib/iconSet.ts
 *   bun scripts/gen-icon-set.ts --out ./lib/iconSet.ts --src ./components --src ./lib
 *
 *   # app / site de docs → ./app/iconSet.ts
 *   bun scripts/gen-icon-set.ts --out ./app/iconSet.ts --src ./app --src ./content \
 *     --type-import @dnax/ui
 *
 * `--src` est récursif (`.vue`, `.ts`, `.js`, `.mjs`, `.md`), les dossiers
 * `node_modules` / `.nuxt` / `.output` / `dist` / `public` sont ignorés. Un nom absent
 * de la collection est signalé (faute de frappe le plus souvent).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import {
  buildIconSet,
  scrapeIconNames,
  type IconifySourceCollection,
} from "../lib/iconSetScrape"

// — Arguments ------------------------------------------------------------------
let outFile = ""
let typeImport = "./icons"
const sources: string[] = []

const args = process.argv.slice(2)
for (let i = 0; i < args.length; i++) {
  const arg = args[i]!
  if (arg === "--out") outFile = args[++i] ?? ""
  else if (arg === "--src") sources.push(args[++i] ?? "")
  else if (arg === "--type-import") typeImport = args[++i] ?? "./icons"
  else {
    console.error(`Argument inconnu : ${arg}`)
    process.exit(1)
  }
}

if (!outFile || sources.length === 0) {
  console.error(
    "Usage : bun scripts/gen-icon-set.ts --out <fichier.ts> --src <dossier> [--src <dossier>…] [--type-import <specifier>]",
  )
  process.exit(1)
}

// — Relevé + résolution --------------------------------------------------------
const resolvedSources = sources.map((src) => resolve(process.cwd(), src))
const names = scrapeIconNames(resolvedSources)

if (names.length === 0) {
  console.error("Aucune icône `lucide:` trouvée dans les sources fournies.")
  process.exit(1)
}

const collectionUrl = import.meta.resolve("@iconify-json/lucide/icons.json")
const collection = JSON.parse(await readFile(new URL(collectionUrl), "utf8")) as IconifySourceCollection
const { set, missing } = buildIconSet(collection, names)

// — Écriture -------------------------------------------------------------------
const iconNames = Object.keys(set.icons).sort()
const aliasNames = Object.keys(set.aliases ?? {}).sort()

const iconLines = iconNames
  .map((name) => `    ${JSON.stringify(name)}: { body: ${JSON.stringify(set.icons[name]!.body)} },`)
  .join("\n")
const aliasLines = aliasNames
  .map(
    (name) =>
      `    ${JSON.stringify(name)}: { parent: ${JSON.stringify(set.aliases![name]!.parent)} },`,
  )
  .join("\n")

const sourceLabel = sources.map((src) => `\`${src}\``).join(", ")
const header = `// ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.
// Commande : bun scripts/gen-icon-set.ts --out ${outFile} --src ${sources.join(" --src ")}${typeImport === "./icons" ? "" : ` --type-import ${typeImport}`}
//
// Sous-ensemble de la collection \`lucide\` : ${iconNames.length} icônes${aliasNames.length ? ` + ${aliasNames.length} alias` : ""}, relevées dans
// ${sourceLabel}. Embarqué dans le bundle, il est enregistré auprès d'Iconify par
// \`registerIcons()\` (ou par le module Nuxt \`@dnax/ui\`) via \`addCollection()\` :
// ces icônes ne déclenchent **aucune** requête vers l'API Iconify et sont rendues
// dès le SSR. Les noms absents de ce fichier continuent de passer par l'API.
import type { IconSetJson } from "${typeImport}"

export const lucideIconSet: IconSetJson = {
  prefix: "lucide",
  width: ${set.width ?? 24},
  height: ${set.height ?? 24},
  icons: {
${iconLines}
  },
${aliasLines ? `  aliases: {\n${aliasLines}\n  },\n` : ""}}
`

const outPath = resolve(process.cwd(), outFile)
await mkdir(dirname(outPath), { recursive: true })
await writeFile(outPath, header)

const kb = (Buffer.byteLength(header) / 1024).toFixed(1)
console.log(`✓ ${iconNames.length} icône(s) + ${aliasNames.length} alias → ${outFile} (${kb} Ko)`)
if (missing.length) {
  console.warn(`⚠️  ${missing.length} nom(s) introuvable(s) dans lucide : ${missing.join(", ")}`)
}
