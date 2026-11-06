// Icônes embarquées — garde-fou contre la dérive du fichier généré.
//
// `lib/iconSet.ts` est produit par `bun scripts/gen-icon-set.ts`. Si quelqu'un ajoute
// un `lucide:…` dans un composant sans relancer le script, l'icône repasse
// silencieusement par l'API Iconify (donc : absente du SSR et du mode hors ligne).
// Ces tests échouent dans ce cas, sans navigateur ni réseau.
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "bun:test"
import { icons } from "./icons"
import { lucideIconSet } from "./iconSet"

const ICON_NAME_RE = /\blucide:[a-z0-9]+(?:-[a-z0-9]+)*/g
const componentsDir = join(import.meta.dir, "..", "components")

const has = (name: string): boolean =>
  name in lucideIconSet.icons || Boolean(lucideIconSet.aliases && name in lucideIconSet.aliases)

const strip = (value: string): string => value.slice("lucide:".length)

describe("lucideIconSet (généré)", () => {
  it("est une collection lucide valide", () => {
    expect(lucideIconSet.prefix).toBe("lucide")
    expect(lucideIconSet.width).toBe(24)
    expect(lucideIconSet.height).toBe(24)
    expect(Object.keys(lucideIconSet.icons).length).toBeGreaterThan(0)
    for (const [name, icon] of Object.entries(lucideIconSet.icons)) {
      expect(name).not.toContain(":")
      expect(icon.body.length).toBeGreaterThan(0)
    }
  })

  it("contient toutes les icônes de `lib/icons.ts`", () => {
    const missing = Object.values(icons)
      .map(strip)
      .filter((name) => !has(name))
    expect(missing).toEqual([])
  })

  it("contient tous les `lucide:…` référencés dans les composants", () => {
    const files = readdirSync(componentsDir, { recursive: true })
      .map(String)
      .filter((path) => path.endsWith(".vue"))
      .map((path) => join(componentsDir, path))

    const missing = new Set<string>()
    for (const file of files) {
      for (const match of readFileSync(file, "utf8").matchAll(ICON_NAME_RE)) {
        const name = strip(match[0])
        if (!has(name)) missing.add(name)
      }
    }
    expect([...missing]).toEqual([])
  })

  it("embarque la parente de chaque alias", () => {
    for (const alias of Object.values(lucideIconSet.aliases ?? {})) {
      expect(alias.parent in lucideIconSet.icons).toBe(true)
    }
  })
})
