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
