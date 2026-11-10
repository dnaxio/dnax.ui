// Taille de cellule du tableur — calculs **purs** (aucun DOM).
//
// Une seule échelle pilote la hauteur de ligne, la largeur de colonne par défaut **et** la
// taille de police des cellules, pour qu'une grille « large » reste proportionnée (une
// cellule de 66px avec une police de 13px paraît vide).

/** Presets de hauteur de cellule, en px. */
export type CellSizePreset = "sm" | "md" | "lg"

export const CELL_SIZE_PX: Record<CellSizePreset, number> = {
  sm: 28,
  md: 32,
  lg: 40,
}

/** Bornes d'une hauteur passée en nombre (px). */
export const CELL_SIZE_MIN = 20
export const CELL_SIZE_MAX = 120

/**
 * Hauteur de cellule en px : preset (`sm` 28, `md` 32, `lg` 40), nombre borné
 * `[20, 120]`, ou `md` par défaut / pour une valeur invalide.
 */
export const cellSizePx = (size?: CellSizePreset | number | null): number => {
  if (typeof size === "number" && Number.isFinite(size)) {
    return Math.min(CELL_SIZE_MAX, Math.max(CELL_SIZE_MIN, Math.round(size)))
  }
  if (size === "sm" || size === "md" || size === "lg") return CELL_SIZE_PX[size]
  return CELL_SIZE_PX.md
}

/**
 * Largeur de colonne par défaut dérivée de la hauteur — ratio **5:1**, cohérent avec le
 * couple historique 32 px / 160 px. Une cellule haute est aussi plus large.
 */
export const cellWidthFor = (heightPx: number): number => Math.round(heightPx * 5)

/**
 * Taille de police des cellules : suit la hauteur (~40 %), bornée pour rester lisible.
 * `32 px → 13` (la valeur historique), `40 → 16`, `48 → 20`, `66 → 20` (plafond).
 */
export const cellFontFor = (heightPx: number): number =>
  Math.min(20, Math.max(11, Math.round(heightPx * 0.406)))

/** Métriques de la ligne d'en-tête (noms de colonnes + numéros de ligne). */
export interface HeaderMetrics {
  /** Hauteur de la ligne d'en-tête, en px */
  height: number
  /** Largeur de la gouttière des numéros de ligne, en px */
  gutter: number
  /** Police du libellé de colonne, en px */
  labelFont: number
  /** Police de la lettre de colonne (A, B, C…), en px */
  letterFont: number
  /** Police des numéros de ligne, en px */
  rowFont: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/**
 * En-têtes **accordés à la taille des cellules** : une cellule de 66 px avec un en-tête de
 * 28 px (et une police de 11 px) jurerait. À `md` (32 px), toutes les valeurs retombent
 * **exactement** sur l'historique (28 px de haut, gouttière 34, libellé 11.5, lettre 9.5,
 * numéro 11) — donc aucune régression sans `sizeCell`.
 */
export const headerMetricsFor = (cellHeightPx: number): HeaderMetrics => {
  const cellFont = cellFontFor(cellHeightPx)
  // Arrondi au demi-px : `md` tombe pile sur 11.5 (valeur historique)
  const labelFont = clamp(Math.round(cellFont * 1.77) / 2, 9.5, 16)
  return {
    height: clamp(Math.round(cellHeightPx * 0.875), 24, 56),
    gutter: clamp(Math.round(labelFont * 2.96), 28, 56),
    labelFont,
    letterFont: clamp(labelFont - 2, 8, 13),
    rowFont: clamp(Math.round(cellFont * 0.846), 9, 15),
  }
}
