// Contrat des **styles** (`styles/main.css` et les composants) :
//  1. tokens de thème (couche `@layer dnax-tokens`) — voir plus bas ;
//  2. classes de style **partagées** entre un composant et la feuille : une divergence des deux
//     côtés (classe renommée d'un seul côté) est un échec **silencieux** — aucune erreur, juste
//     un style qui ne s'applique plus.
//
// Test de contenu de fichier : la seule vérification possible sans navigateur (règle projet).
import { describe, expect, it } from "bun:test"

const css = await Bun.file(new URL("../styles/main.css", import.meta.url)).text()

/** Contenu d'un bloc `selector { … }` (accolades équilibrées), à partir de `from`. */
function blockAfter(source: string, selector: string, from = 0): string | undefined {
  const at = source.indexOf(selector, from)
  if (at === -1) return undefined
  const open = source.indexOf("{", at)
  if (open === -1) return undefined
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++
    else if (source[i] === "}") {
      depth--
      if (depth === 0) return source.slice(open + 1, i)
    }
  }
  return undefined
}

/** Propriétés personnalisées (`--x:`) déclarées dans un bloc. */
function tokensOf(block: string): Set<string> {
  const out = new Set<string>()
  for (const m of block.matchAll(/(--[\w-]+)\s*:/g)) out.add(m[1]!)
  return out
}

const tokensLayerAt = css.indexOf("@layer dnax-tokens")
const lightBlock = blockAfter(css, ":root", tokensLayerAt)
const darkBlock = blockAfter(css, ".dark", tokensLayerAt)

/** Tokens sémantiques (surfaces + texte) — doivent exister dans les deux thèmes. */
const SEMANTIC = ["--background", "--foreground", "--card", "--muted", "--muted-foreground", "--border"]

describe("tokens de thème (clair / sombre)", () => {
  it("la couche @layer dnax-tokens contient les deux thèmes", () => {
    expect(tokensLayerAt).toBeGreaterThan(-1)
    expect(lightBlock).toBeDefined()
    expect(darkBlock).toBeDefined()
  })

  it("clair et sombre définissent les mêmes tokens sémantiques", () => {
    const light = tokensOf(lightBlock!)
    const dark = tokensOf(darkBlock!)
    for (const token of SEMANTIC) {
      expect({ token, inLight: light.has(token) }).toEqual({ token, inLight: true })
      expect({ token, inDark: dark.has(token) }).toEqual({ token, inDark: true })
    }
  })

  it("tout `var(--muted-foreground…)` a un token défini (pas seulement un fallback)", () => {
    // Le token est référencé ailleurs dans la feuille : il doit exister en clair ET en sombre.
    expect(css.includes("var(--muted-foreground")).toBe(true)
    expect(tokensOf(lightBlock!)).toContain("--muted-foreground")
    expect(tokensOf(darkBlock!)).toContain("--muted-foreground")
  })

  it("les descriptions de dialog et de bottom sheet lisent le token (plus de noir en dur)", () => {
    for (const selector of [".q-dialog__description", ".q-bottom-sheet__description"]) {
      const block = blockAfter(css, selector)
      expect({ selector, defined: block !== undefined }).toEqual({ selector, defined: true })
      expect({ selector, usesToken: block!.includes("var(--muted-foreground") }).toEqual({
        selector,
        usesToken: true,
      })
      expect({ selector, hardcodedBlack: block!.includes("color: rgb(0 0 0 / 0.6)") }).toEqual({
        selector,
        hardcodedBlack: false,
      })
    }
  })

  it("plus aucune couleur de texte secondaire en noir codé en dur", () => {
    // Le token clair vaut exactement `rgb(0 0 0 / 0.6)` → la migration est transparente en clair
    // et corrige le sombre. On interdit donc la forme littérale (le fallback du token reste permis :
    // il s'écrit `var(--muted-foreground, rgb(0 0 0 / 0.6))`).
    // ⚠️ Lookbehind : `background-color: …` **contient** la sous-chaîne `color: …`.
    expect(/(?<!-)color: rgb\(0 0 0 \/ 0\.6\)/.test(css)).toBe(false)
  })
})

describe("classes de style (composant ↔ CSS)", () => {
  /** `[fichier du composant, classe, sélecteur CSS attendu]` */
  const CONTRACTS: [string, string, string][] = [
    [
      "components/QDialogHeader.vue",
      "q-dialog__header-text--with-description",
      ".q-dialog__header-text--with-description .q-dialog__title",
    ],
    [
      "components/QBottomSheetHeader.vue",
      "q-bottom-sheet__header-text--with-description",
      ".q-bottom-sheet__header-text--with-description .q-bottom-sheet__title",
    ],
    ["components/QCollapse.vue", "q-collapse--guide", ".q-collapse--guide .q-collapse__inner"],
  ]

  for (const [file, className, selector] of CONTRACTS) {
    it(`« ${className} » est posée par le composant ET stylée par le CSS`, async () => {
      const vue = await Bun.file(new URL(`../${file}`, import.meta.url)).text()
      expect({ file, inComponent: vue.includes(className) }).toEqual({ file, inComponent: true })
      expect({ selector, inCss: css.includes(selector) }).toEqual({ selector, inCss: true })
    })
  }
})

describe("mode sombre des contrôles", () => {
  it("la bordure noire du checkbox / radio décoché est corrigée en sombre", () => {
    // Base claire : bordure codée en dur (le variant `--dark` du composant la corrige, mais
    // il faut aussi le **mode sombre du thème**) — sinon le contrôle est invisible en dark.
    expect(css.includes("border: 2px solid rgb(0 0 0 / 0.45)")).toBe(true)
    for (const selector of [".dark .q-checkbox__box", ".dark .q-radio__circle"]) {
      expect({ selector, present: css.includes(selector) }).toEqual({ selector, present: true })
    }
  })
})

describe("en-têtes de panneau : safe-area", () => {
  // La safe-area doit **s'ajouter** au padding de base, jamais le remplacer : sinon, sans
  // encoche (`env()` = 0), le titre et le × collent au bord haut.
  const PANEL_HEADERS = [
    ".q-select__sheet--dialog .q-select__sheet-header",
    ".q-date-picker__sheet--dialog .q-date-picker__sheet-header",
    ".q-country-picker__sheet--dialog .q-country-picker__sheet-header",
  ]

  for (const selector of PANEL_HEADERS) {
    it(`« ${selector} » ajoute la safe-area à un padding de base`, () => {
      const block = blockAfter(css, selector)
      expect({ selector, defined: block !== undefined }).toEqual({ selector, defined: true })
      expect({ selector, adds: block!.includes("calc(env(safe-area-inset-top) + 16px)") }).toEqual({
        selector,
        adds: true,
      })
      expect({ selector, bare: block!.includes("padding-top: env(safe-area-inset-top);") }).toEqual({
        selector,
        bare: false,
      })
    })
  }
})
