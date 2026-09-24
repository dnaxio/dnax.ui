// pagePadding — padding utilisateur du QPage (prop `padding`).
//
// Quasar n'expose qu'un booléen (`padding` = 16px) ; dnax.ui accepte aussi une valeur
// CSS explicite (`padding="12px"`), d'où la normalisation :
//   - `true` (modifier, `<q-page padding>`) → PAGE_PADDING (14px, défaut du DS)
//   - nombre ou chaîne numérique ("12")     → "12px" (une longueur sans unité
//     invaliderait tout le `calc()` de composition dans styles/main.css)
//   - toute autre chaîne ("2rem", "12px 24px") → rendue telle quelle
//   - absent, `false` ou chaîne vide        → aucun padding
//
// La longueur retournée est posée dans `--q-page-padding` (le composant), lue par la
// règle `.q-page` de `styles/main.css` — là où elle est composée avec les offsets des
// barres `fixed` (`lib/fixedLayout.ts`) et la safe-area basse.

/** Padding appliqué par la prop booléenne `padding` — défaut du design system. */
export const PAGE_PADDING = "14px"

/** Nombre nu ("12", "1.5") → longueur CSS ("12px", "1.5px") ; sinon valeur inchangée. */
const withUnit = (value: string): string => (/^-?\d*\.?\d+$/.test(value) ? `${value}px` : value)

/**
 * Longueur CSS à poser dans `--q-page-padding`, ou `undefined` quand aucun padding
 * n'est demandé (prop absente, `false`, chaîne vide).
 */
export function resolvePagePadding(padding?: boolean | string | number | null): string | undefined {
  if (padding === true) return PAGE_PADDING
  if (typeof padding === "number") return Number.isFinite(padding) ? `${padding}px` : undefined
  if (typeof padding !== "string") return undefined

  const value = padding.trim()
  return value ? withUnit(value) : undefined
}
