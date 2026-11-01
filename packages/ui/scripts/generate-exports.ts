/**
 * Regénère `index.ts` : une ligne d'export par composant, puis le **bloc manuel**
 * (composables, helpers, types de `lib/`) recopié **tel quel**.
 * Run with: bun scripts/generate-exports.ts
 *
 * ⚠️ Ne jamais figer le bloc manuel dans ce script. Une version précédente le
 * contenait en dur ; il avait pris du retard sur `index.ts` et une exécution a
 * silencieusement supprimé `network`, `wakeLock`, `chartFormat`, `chartStats`,
 * `chartTable`… (cf. `.memory/warnings.md`). Ici le bloc manuel est **relu** depuis
 * `index.ts` : tout ce qui suit le dernier export de composant est conservé, donc le
 * script est idempotent et ne peut plus rien perdre.
 */
import { readdir, readFile } from "node:fs/promises"

const componentsDir = new URL("../components/", import.meta.url)
const indexFile = new URL("../index.ts", import.meta.url)

/** Ligne produite pour un composant : `export { default as QX } from "./components/QX.vue"` */
const COMPONENT_EXPORT_LINE = /^export \{ default as [\w$]+ \} from "\.\/components\/[\w$]+\.vue"$/

const toPascalCase = (name: string) =>
  name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

const files = (await readdir(componentsDir))
  .filter((file) => file.endsWith(".vue") && !file.startsWith("_"))
  .sort()

const componentExports = files
  .map(
    (file) =>
      `export { default as ${toPascalCase(file.replace(/\.vue$/, ""))} } from "./components/${file}"`,
  )
  .join("\n")

// — Bloc manuel : relu dans l'`index.ts` courant -------------------------------
let current = ""
try {
  current = await readFile(indexFile, "utf8")
} catch {
  throw new Error(
    "packages/ui/index.ts est introuvable : le bloc manuel (exports de `lib/`) ne peut pas être conservé. " +
      "Recréez le fichier avec ses exports manuels avant de lancer ce script.",
  )
}

const lines = current.split("\n")
let lastComponentLine = -1
lines.forEach((line, i) => {
  if (COMPONENT_EXPORT_LINE.test(line)) lastComponentLine = i
})

// Fichier sans aucun export de composant (création manuelle) : tout est conservé.
const manualExports = (lastComponentLine === -1 ? current : lines.slice(lastComponentLine + 1).join("\n"))
  .trim()

if (lastComponentLine === -1 && /\bexport\b/.test(manualExports)) {
  console.warn(
    "⚠️  Aucun export de composant reconnu dans index.ts : tout son contenu est traité comme bloc manuel.",
  )
}

const output = manualExports ? `${componentExports}\n\n${manualExports}\n` : `${componentExports}\n`

await Bun.write(indexFile, output)

const kept = manualExports ? manualExports.split("\n").length : 0
console.log(`✓ ${files.length} composant(s) exporté(s) dans index.ts`)
console.log(`✓ ${kept} ligne(s) d'exports manuels conservées (bloc relu depuis index.ts)`)
