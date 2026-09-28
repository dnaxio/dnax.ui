// bottomSheet — points d'ancrage (`breakpoints`) d'un bottom sheet : les hauteurs
// relatives où le panneau peut se poser, et les calculs de drag / snap associés.
// Pur (aucun DOM) → testable hors navigateur, comme `lib/layout.ts`.
//
// Convention : un point d'ancrage est une **fraction de la hauteur de vue** (0 → 1),
// comme chez Ionic (`:breakpoints="[0.25, 0.5, 0.75]"`). `0` est accepté dans la liste
// mais retiré à la normalisation : il signifie « fermé », un état porté par `v-model`.

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined
  if (typeof value !== "string" || value.trim() === "") return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Points d'ancrage exploitables : nombres finis de ]0, 1], dédoublonnés et **croissants**.
 * Accepte aussi une chaîne (`"0.25,0.5"` ou `"[0.25, 0.5]"`) pour l'usage en attribut.
 */
export function normalizeBreakpoints(breakpoints?: unknown): number[] {
  let raw: unknown = breakpoints

  if (typeof raw === "string") {
    raw = raw
      .replace(/[[\]()]/g, "")
      .split(/[,;\s]+/)
      .filter(Boolean)
  }

  if (!Array.isArray(raw)) return []

  const values = raw
    .map((value) => toNumber(value))
    .filter((value): value is number => value !== undefined && value > 0 && value <= 1)

  return [...new Set(values)].sort((a, b) => a - b)
}

/** Fraction bornée à [min, max] (défaut `0 → 1`) — valeur illisible → `min`. */
export function clampRatio(value: number, min = 0, max = 1): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

/**
 * Point d'ancrage le plus proche de `value` — à égalité, le plus bas.
 * `breakpoints` vide → la valeur bornée à [0, 1].
 */
export function nearestBreakpoint(value: number, breakpoints: readonly number[]): number {
  if (breakpoints.length === 0) return clampRatio(value)

  let best = breakpoints[0]!
  for (const candidate of breakpoints) {
    if (Math.abs(candidate - value) < Math.abs(best - value)) best = candidate
  }
  return best
}

/**
 * Point d'ancrage voisin dans une direction (`1` = plus haut, `-1` = plus bas), borné :
 * aux extrémités, la valeur courante est rendue telle quelle. Sert au cycle clavier
 * (touche Entrée sur la poignée) et à l'API exposée.
 */
export function stepBreakpoint(
  value: number,
  breakpoints: readonly number[],
  direction: 1 | -1,
): number {
  if (breakpoints.length === 0) return clampRatio(value)

  const ordered = [...breakpoints].sort((a, b) => a - b)
  const current = nearestBreakpoint(value, ordered)
  const index = ordered.indexOf(current)
  const next = index + direction
  if (next < 0 || next >= ordered.length) return current
  return ordered[next]!
}

/** Fraction atteinte après un drag vertical : un geste vers le haut (`dy < 0`) agrandit. */
export function ratioFromDrag(startRatio: number, dy: number, viewportHeight: number): number {
  if (!Number.isFinite(dy) || !Number.isFinite(viewportHeight) || viewportHeight <= 0) {
    return clampRatio(startRatio)
  }
  return clampRatio(startRatio - dy / viewportHeight)
}

/** Décision prise au relâchement du drag : se poser sur un point d'ancrage, ou fermer. */
export interface BreakpointRelease {
  /** Le panneau doit se fermer */
  close: boolean
  /** Point d'ancrage retenu (absent quand `close`) */
  breakpoint?: number
}

/**
 * Où se poser au relâchement : sous le plus bas point d'ancrage de plus de
 * `closeThreshold` (fraction), ou à 0 → **fermeture** ; sinon le point d'ancrage le plus
 * proche. Garde la règle historique du composant — un drag vers le bas ferme le panneau,
 * même quand `0` n'est pas dans la liste (Ionic, lui, ne ferme plus dans ce cas).
 */
export function releaseBreakpoint(
  ratio: number,
  breakpoints: readonly number[],
  closeThreshold = 0.15,
): BreakpointRelease {
  if (!Number.isFinite(ratio) || ratio <= 0) return { close: true }

  const ordered = [...breakpoints].sort((a, b) => a - b)
  if (ordered.length === 0) return { close: true }

  const lowest = ordered[0]!
  if (ratio < lowest - Math.max(0, closeThreshold)) return { close: true }

  return { breakpoint: nearestBreakpoint(ratio, ordered), close: false }
}
