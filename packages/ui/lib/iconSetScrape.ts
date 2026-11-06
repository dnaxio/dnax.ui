// Extraction d'icônes pour l'embarquement — **Node uniquement (build)**.
//
// Utilisé par :
//   - `module.ts` (module Nuxt) : scanne les sources de l'app hôte au build ;
//   - `scripts/gen-icon-set.ts` : produit `lib/iconSet.ts` (sous-ensemble figé) ;
//   - `lib/iconSet.test.ts` : garde-fou contre la dérive du fichier généré.
//
// ⚠️ Ne pas réexporter depuis `index.ts` : ce fichier importe `node:fs`, il n'a rien à
// faire dans un bundle client.
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { IconSetJson } from "./icons"

/** `lucide:arrow-down`, `lucide:table-cells-merge`… */
export const ICON_NAME_RE = /\blucide:[a-z0-9]+(?:-[a-z0-9]+)*/g

const PREFIX = "lucide:"

const TEXT_FILE_RE = /\.(vue|ts|js|mjs|md|mdx)$/

/** Dossiers techniques jamais scannés (le reste de l'arbre est parcouru). */
export const SKIP_DIRS = new Set([
  "node_modules",
  ".nuxt",
  ".output",
  ".data",
  ".git",
  "dist",
  "coverage",
  "public",
])

/** Noms d'icônes cités dans un texte, **sans** le préfixe (`arrow-down`). */
export const iconNamesIn = (text: string): string[] =>
  [...text.matchAll(ICON_NAME_RE)].map((match) => match[0].slice(PREFIX.length))

/** Sous-ensemble de `IconifyJSON` (collection officielle) dont on a besoin. */
export interface IconifySourceCollection {
  prefix: string
  width?: number
  height?: number
  icons: Record<string, { body: string; [key: string]: unknown }>
  aliases?: Record<string, { parent: string; [key: string]: unknown }>
}

export interface ScrapeOptions {
  /** Dossiers supplémentaires à ignorer (noms de base, pas des chemins) */
  skipDirs?: Iterable<string>
}

/** Fichiers texte (`.vue`, `.ts`, `.js`, `.mjs`, `.md`…) sous `dir`, récursivement. */
export const textFilesUnder = (dir: string, options: ScrapeOptions = {}): string[] => {
  const skip = new Set([...SKIP_DIRS, ...(options.skipDirs ?? [])])
  const found: string[] = []

  const walk = (current: string): void => {
    let entries
    try {
      entries = readdirSync(current, { withFileTypes: true })
    } catch {
      return // dossier absent ou illisible : on ignore
    }
    for (const entry of entries) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) {
        if (!skip.has(entry.name)) walk(path)
        continue
      }
      // Les tests citent des noms d'icônes pour vérifier : rien à embarquer.
      if (!TEXT_FILE_RE.test(entry.name) || entry.name.endsWith(".test.ts")) continue
      found.push(path)
    }
  }

  walk(dir)
  return found
}

/** Noms d'icônes relevés dans un ensemble de dossiers (dédupliqués, triés). */
export const scrapeIconNames = (dirs: string[], options: ScrapeOptions = {}): string[] => {
  const names = new Set<string>()
  for (const dir of dirs) {
    for (const file of textFilesUnder(dir, options)) {
      for (const name of iconNamesIn(readFileSync(file, "utf8"))) names.add(name)
    }
  }
  return [...names].sort()
}

/** Construit une collection (alias résolus, parente incluse) à partir de noms nus. */
export const buildIconSet = (
  source: IconifySourceCollection,
  names: Iterable<string>,
): { set: IconSetJson; missing: string[] } => {
  const icons: IconSetJson["icons"] = {}
  const aliases: NonNullable<IconSetJson["aliases"]> = {}
  const missing: string[] = []

  const add = (name: string): void => {
    if (name in icons || name in aliases) return
    const icon = source.icons[name]
    if (icon) {
      icons[name] = { body: icon.body }
      return
    }
    const alias = source.aliases?.[name]
    if (alias) {
      aliases[name] = { parent: alias.parent }
      // Un alias ne rend rien sans sa parente : on l'embarque aussi.
      add(alias.parent)
      return
    }
    missing.push(name)
  }

  for (const name of [...names].sort()) add(name)

  const set: IconSetJson = {
    prefix: source.prefix,
    width: source.width ?? 24,
    height: source.height ?? 24,
    icons,
  }
  if (Object.keys(aliases).length) set.aliases = aliases
  return { set, missing }
}

/** Fusionne deux collections (les entrées de `extra` complètent `base`). */
export const mergeIconSets = (base: IconSetJson, extra: IconSetJson): IconSetJson => {
  const aliases = { ...base.aliases, ...extra.aliases }
  const merged: IconSetJson = {
    prefix: base.prefix,
    width: base.width ?? extra.width,
    height: base.height ?? extra.height,
    icons: { ...base.icons, ...extra.icons },
  }
  if (Object.keys(aliases).length) merged.aliases = aliases
  return merged
}
