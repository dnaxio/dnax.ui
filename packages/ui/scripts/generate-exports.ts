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

await Bun.write(indexFile, `${exports}\n`)
console.log(`✓ ${files.length} composant(s) exporté(s) dans index.ts`)
