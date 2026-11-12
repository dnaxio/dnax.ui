// Choix du côté (bas/haut) d'un panneau **ancré**, hauteur disponible et bornage horizontal.
//
// Calculs **purs** (aucun DOM) partagés par les panneaux flottants — `QBtnActions`
// (moteur de `QBtnDropdown`) et `QAutocomplete` : un menu ne doit jamais sortir de la
// fenêtre. `QSelect` a sa propre logique (basée sur `POPUP_MIN_SPACE`), mais les mêmes
// règles s'appliquent : on ouvre vers le bas, on bascule au-dessus quand il n'y a pas la
// place, et la hauteur est bornée à l'espace réellement visible.

/** Boîte de l'élément d'ancrage, en coordonnées **fenêtre** (`getBoundingClientRect`). */
export interface AnchorBox {
  top: number
  bottom: number
  left: number
  right: number
}

export interface PlacementInput {
  /** Boîte de l'ancre (le déclencheur / le champ) */
  anchor: AnchorBox
  /** Hauteur mesurée du panneau (0 ou omise = inconnue → pas de bascule) */
  panelHeight?: number
  /** Hauteur de la fenêtre */
  viewportHeight: number
  /** Largeur de la fenêtre (pour le bornage horizontal) */
  viewportWidth?: number
  /** Largeur mesurée du panneau */
  panelWidth?: number
  /** Marge conservée avec les bords de la fenêtre (défaut 8) */
  margin?: number
  /** Écart entre l'ancre et le panneau (défaut 4) */
  offset?: number
}

/** Espace vertical disponible d'un côté, écart et marge déduits (jamais négatif). */
export const spaceBelow = (input: PlacementInput): number => {
  const margin = input.margin ?? 8
  const offset = input.offset ?? 4
  return Math.max(0, input.viewportHeight - input.anchor.bottom - offset - margin)
}

/** Espace vertical disponible au-dessus, écart et marge déduits (jamais négatif). */
export const spaceAbove = (input: PlacementInput): number => {
  const margin = input.margin ?? 8
  const offset = input.offset ?? 4
  return Math.max(0, input.anchor.top - offset - margin)
}

/**
 * Côté d'ouverture : `preferred` (défaut bas). Avec `flip`, on bascule **seulement** si le
 * panneau ne tient pas du côté demandé **et** qu'il tient mieux de l'autre. Sans hauteur
 * connue (`panelHeight` = 0), on garde le côté demandé (pas de saut au premier rendu).
 */
export const pickSide = (
  input: PlacementInput,
  preferred: "top" | "bottom" = "bottom",
  flip = true,
): "top" | "bottom" => {
  if (!flip) return preferred
  const height = input.panelHeight ?? 0
  if (height <= 0) return preferred
  const below = spaceBelow(input)
  const above = spaceAbove(input)
  if (preferred === "bottom") return below >= height || above <= below ? "bottom" : "top"
  return above >= height || below <= above ? "top" : "bottom"
}

/** Hauteur max du panneau pour le côté retenu (bornée à l'espace visible). */
export const maxHeightFor = (input: PlacementInput, side: "top" | "bottom"): number =>
  Math.round(side === "bottom" ? spaceBelow(input) : spaceAbove(input))

/**
 * Bord gauche ramené dans la fenêtre : le panneau ne dépasse ni à gauche ni à droite.
 * `left` = bord gauche souhaité, `panelWidth` = largeur du panneau.
 */
export const clampLeft = (
  left: number,
  panelWidth: number,
  viewportWidth: number,
  margin = 8,
): number => {
  if (!panelWidth) return left
  const maxEdge = Math.max(margin, viewportWidth - panelWidth - margin)
  return Math.round(Math.min(Math.max(left, margin), maxEdge))
}
