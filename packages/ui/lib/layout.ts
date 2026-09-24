// Analyse du prop `view` de QLayout — matrice 3×3 de la fenêtre (modèle Quasar).
//
// `view` = 11 caractères : 3 (rangée header) + espace + 3 (rangée milieu) + espace +
// 3 (rangée footer). Chaque caractère dit quelle zone occupe cette cellule :
//   l = drawer gauche, h = header, r = drawer droit, f = footer, p = page (centre),
//   . = cellule vide.
// La casse compte : **majuscule = la zone reste en place** au scroll (Quasar :
// « position fixe »), **minuscule = elle défile avec la page**. Une zone qui occupe
// plusieurs cellules les occupe forcément en rectangle (exigence de
// `grid-template-areas`) ; `hHh lpR fFf` donne donc un header pleine largeur, un
// drawer gauche sous le header et un drawer droit pleine hauteur.
//
// Aucune dépendance au DOM : le SFC pose `grid-template-areas` sur `.q-layout`, et
// chaque enfant (q-header, q-footer, q-sidebar) lit sa cellule dans le contexte
// injecté — d'où l'export de `qLayoutKey`.
//
// Modèle retenu par dnax.ui (« A ») : **scroll du document + `position: sticky`**,
// pas le scroll interne de Quasar. Conséquence sur les lettres : la casse se voit
// sur le header (`H` reste collé / `h` défile) et sur les drawers (`L`/`R` collés et
// hauts de 100dvh / `l`/`r` dans le flux), alors que `F`/`f` sont **équivalents** (la
// rangée footer est la dernière : le footer tombe en fin de page dans les deux cas) et
// que `P` est sans effet (la page EST ce qui défile).

import type { InjectionKey, Ref } from "vue"

/** Zone de la matrice (une par composant concerné) */
export type LayoutZone = "left" | "header" | "right" | "page" | "footer"

/** Vue par défaut : header et footer pleine largeur, les deux drawers restent en place */
export const DEFAULT_LAYOUT_VIEW = "hHh LpR fFf"

/** Lettres acceptées par rangée — la matrice n'a de sens qu'avec ces zones-là */
const ROW_LETTERS: readonly (readonly string[])[] = [
  ["l", "h", "r"], // rangée header : drawer gauche, header, drawer droit
  ["l", "p", "r"], // rangée milieu : drawer gauche, page, drawer droit
  ["l", "f", "r"], // rangée footer : drawer gauche, footer, drawer droit
]

/** Lettre → zone */
const LETTER_ZONE: Record<string, LayoutZone> = {
  l: "left",
  h: "header",
  r: "right",
  p: "page",
  f: "footer",
}

/** Cellule vide (aucune zone) */
const EMPTY_CELL = "."

export interface LayoutZonePlacement {
  /** Nom d'aire CSS à passer à `grid-area` — `undefined` si la zone n'occupe aucune cellule */
  area?: string
  /** La zone reste en place au scroll (au moins une de ses lettres en majuscule) */
  fixed: boolean
  /** Cellules occupées, `[ligne, colonne]` en base 0 */
  cells: Array<[number, number]>
}

export interface LayoutView {
  /** Chaîne retenue — la vue par défaut quand la chaîne fournie est invalide */
  view: string
  /** `grid-template-areas` prêt à poser sur `.q-layout` */
  gridTemplateAreas: string
  /** Placement de chaque zone */
  zones: Record<LayoutZone, LayoutZonePlacement>
  /** Raison du rejet de la chaîne fournie (`undefined` si elle était valide) */
  error?: string
}

/** Contexte fourni par QLayout à ses enfants (q-header, q-footer, q-sidebar) */
export interface QLayoutContext {
  /** Placement de chaque zone, déduit de `view` (suit les changements de `view`) */
  zones: Readonly<Ref<Record<LayoutZone, LayoutZonePlacement>>>
  /** QLayout est utilisé comme conteneur (hauteur explicite requise) */
  container: Readonly<Ref<boolean>>
}

/** Clé d'injection du contexte QLayout — lue par les composants enfants */
export const qLayoutKey: InjectionKey<QLayoutContext> = Symbol("q-layout")

const emptyZones = (): Record<LayoutZone, LayoutZonePlacement> => ({
  left: { fixed: false, cells: [] },
  header: { fixed: false, cells: [] },
  right: { fixed: false, cells: [] },
  page: { fixed: false, cells: [] },
  footer: { fixed: false, cells: [] },
})

/** Les 3 rangées de 3 lettres d'une vue (chaîne déjà validée) */
const rowsOf = (view: string) => view.trim().split(/\s+/) as [string, string, string]

/**
 * Construit le résultat à partir d'une vue **valide** : cellules de chaque zone,
 * drapeau « reste en place », aires CSS.
 */
function build(view: string): LayoutView {
  const rows = rowsOf(view)
  const zones = emptyZones()
  const areas: string[][] = []

  rows.forEach((row, r) => {
    const cells = [...row]
    areas.push(cells.map((char) => (char === EMPTY_CELL ? EMPTY_CELL : char.toLowerCase())))
    cells.forEach((char, c) => {
      if (char === EMPTY_CELL) return
      const zone = LETTER_ZONE[char.toLowerCase()]!
      zones[zone].cells.push([r, c])
      // Casse : au moins une majuscule → la zone reste en place
      if (char === char.toUpperCase()) zones[zone].fixed = true
    })
  })

  for (const zone of Object.keys(zones) as LayoutZone[]) {
    if (zones[zone].cells.length) {
      const [r, c] = zones[zone].cells[0]!
      zones[zone].area = areas[r]![c]!
    }
  }

  return {
    view: rows.join(" "),
    gridTemplateAreas: areas.map((row) => `"${row.join(" ")}"`).join(" "),
    zones,
  }
}

/** Vérifie qu'une zone occupe bien un rectangle plein (sinon `grid-template-areas` est invalide) */
function isRectangle(cells: Array<[number, number]>): boolean {
  const rows = cells.map(([r]) => r)
  const cols = cells.map(([, c]) => c)
  const height = Math.max(...rows) - Math.min(...rows) + 1
  const width = Math.max(...cols) - Math.min(...cols) + 1
  return new Set(rows).size === height && new Set(cols).size === width && height * width === cells.length
}

/** Vue par défaut + la raison du rejet, pour rester utilisable en production */
const fallback = (error: string): LayoutView => ({ ...build(DEFAULT_LAYOUT_VIEW), error })

/**
 * Analyse le prop `view`. Toute chaîne invalide est **rejetée** (jamais de crash) :
 * la vue par défaut s'applique et `error` porte la raison (affichée en dev par le SFC).
 */
export function parseView(view?: string): LayoutView {
  if (!view) return build(DEFAULT_LAYOUT_VIEW)

  const groups = view.trim().split(/\s+/)
  if (groups.length !== 3 || groups.some((group) => group.length !== 3)) {
    return fallback(
      `view "${view}" : attendu 3 groupes de 3 caractères (ex. "${DEFAULT_LAYOUT_VIEW}")`,
    )
  }

  const rows = groups as [string, string, string]
  for (let r = 0; r < 3; r++) {
    for (const char of rows[r]!) {
      if (char === EMPTY_CELL) continue
      const letter = char.toLowerCase()
      if (!LETTER_ZONE[letter]) {
        return fallback(`view "${view}" : lettre "${char}" inconnue (attendu l, h, r, f, p ou .)`)
      }
      if (!ROW_LETTERS[r]!.includes(letter)) {
        return fallback(
          `view "${view}" : "${char}" n'a pas sa place dans la rangée ${r + 1} (attendu ${ROW_LETTERS[r]!.join(", ")} ou .)`,
        )
      }
    }
  }

  const parsed = build(rows.join(" "))
  if (!parsed.zones.page.cells.length) {
    return fallback(`view "${view}" : la rangée du milieu doit contenir au moins un "p" (page)`)
  }
  for (const zone of Object.keys(parsed.zones) as LayoutZone[]) {
    const cells = parsed.zones[zone].cells
    if (cells.length > 1 && !isRectangle(cells)) {
      return fallback(`view "${view}" : la zone "${zone}" n'occupe pas un rectangle plein`)
    }
  }
  return parsed
}
