// Micro-visualisations **dans les cellules** d'une marque `table` (façon Power BI) :
// barres de données, barres divergentes (`vs. target`), intensité de cellule et sparklines.
//
// Tout est **pur** : les échelles sont calculées sur les lignes visibles et la géométrie est
// renvoyée en pourcentages / en tracé SVG. `QChart.vue` ne fait que poser des styles.

import type { QChartFormat } from "./chartFormat"

/** Famille de visualisation d'une cellule */
export type QChartCellKind = "bar" | "delta" | "heat" | "sparkline"

/** Configuration d'une cellule (`column.cell`). `cell: true` équivaut à `{ type: "bar" }`. */
export interface QChartCellVisual {
  /** Type de micro-visualisation */
  type: QChartCellKind
  /** Couleur principale : barre, ligne de sparkline, valeurs positives */
  color?: string
  /** Couleur des valeurs **négatives** (type `delta`) et des barres descendantes */
  negativeColor?: string
  /** Couleur du point de sparkline (défaut : `color`) */
  pointColor?: string
  /** Borne basse de l'échelle (défaut : `min(0, valeurs)`) */
  min?: number
  /** Borne haute de l'échelle (défaut : `max(0, valeurs)`) */
  max?: number
  /** Opacité de la barre (défauts : `bar` 0.18, `delta` 0.85, `heat` calculée) */
  opacity?: number
  /** `sparkline` : champ de la ligne qui porte la série (tableau de nombres) */
  field?: string
  /** `sparkline` : accès direct à la série (prioritaire sur `field`) */
  values?: (row: any) => readonly number[] | undefined
  /** `sparkline` : point mis en évidence (défaut : `last`) */
  point?: "last" | "first" | "high" | "low" | false
  /** `sparkline` : remplir la surface sous la ligne */
  area?: boolean
  /** `delta` : afficher ▲ / ▼ (défaut : oui pour `delta`, non sinon) */
  arrow?: boolean
  /** `delta` : imprimer la valeur **absolue** (défaut : oui — la flèche porte le signe) */
  absolute?: boolean
  /** Format de la valeur affichée (`compact`, `percent`, `currency`…) si la colonne n'a pas de `format` */
  format?: QChartFormat
}

/** Bornes d'une colonne, calculées sur les lignes visibles */
export interface QChartCellScale {
  min: number
  max: number
  /** Plus grande amplitude par rapport à zéro (barres divergentes) */
  maxAbs: number
}

const finite = (v: any): v is number => typeof v === "number" && Number.isFinite(v)

/** Normalise `column.cell` : `true` → barre de données, objet → tel quel. */
export function cellVisualOf(
  cell: QChartCellVisual | boolean | undefined,
): QChartCellVisual | undefined {
  if (cell === true) return { type: "bar" }
  return cell || undefined
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/** Échelle d'une colonne : bornes explicites (`cell.min` / `cell.max`) ou observées. */
export function cellScale(values: readonly any[], cell: QChartCellVisual): QChartCellScale {
  const nums = values.filter(finite)
  const min = cell.min ?? (nums.length ? Math.min(0, ...nums) : 0)
  const max = cell.max ?? (nums.length ? Math.max(0, ...nums) : 0)
  const maxAbs = Math.max(Math.abs(min), Math.abs(max), Number.EPSILON)
  return { min, max, maxAbs }
}

/** Géométrie d'une barre de cellule (en % de la largeur / hauteur de la cellule). */
export interface QChartCellBar {
  /** Largeur, en % de la cellule */
  width: number
  /** Décalage depuis la gauche, en % */
  left: number
  /** Part de l'échelle (0 → 1) — sert à l'intensité du type `heat` */
  ratio: number
  /** Barre **divergente** (part de 50 %, négatifs vers la gauche) ? */
  diverging: boolean
  /** Signe de la valeur (-1, 0, 1) */
  sign: -1 | 0 | 1
}

/** Positionne la barre d'une cellule.
 *
 *  - `bar` : barre **à gauche**, longueur proportionnelle à `|valeur| / maxAbs` ;
 *  - `delta` : barre **divergente** depuis le centre (50 %), positives à droite ;
 *  - `heat` : barre pleine largeur, l'opacité porte l'intensité ;
 *  - `sparkline` : pas de barre (`undefined`). */
export function cellBarGeometry(
  value: any,
  cell: QChartCellVisual,
  scale: QChartCellScale,
): QChartCellBar | undefined {
  if (cell.type === "sparkline" || !finite(value)) return undefined
  const sign: -1 | 0 | 1 = value > 0 ? 1 : value < 0 ? -1 : 0
  const span = scale.max - scale.min
  const ratio = span > 0 ? clamp((value - scale.min) / span, 0, 1) : 0
  if (cell.type === "delta") {
    const half = clamp((Math.abs(value) / scale.maxAbs) * 50, 0, 50)
    return {
      width: half,
      left: value >= 0 ? 50 : 50 - half,
      ratio: clamp(Math.abs(value) / scale.maxAbs, 0, 1),
      diverging: true,
      sign,
    }
  }
  if (cell.type === "heat") {
    return { width: 100, left: 0, ratio, diverging: false, sign }
  }
  // `bar` : longueur proportionnelle à l'amplitude, ancrée à gauche
  return {
    width: clamp((Math.abs(value) / scale.maxAbs) * 100, 0, 100),
    left: 0,
    ratio: clamp(Math.abs(value) / scale.maxAbs, 0, 1),
    diverging: false,
    sign,
  }
}

/** Point d'un tracé de sparkline */
export interface QChartSparkPoint {
  x: number
  y: number
}

/** Tracé d'une sparkline, dans un `viewBox` de `width` × `height` */
export interface QChartSparkline {
  path: string
  areaPath: string
  points: QChartSparkPoint[]
  /** Point mis en évidence (`point: false` → aucun) */
  marker?: QChartSparkPoint
}

const round2 = (v: number) => Math.round(v * 100) / 100

/** Construit la polyligne d'une sparkline.
 *
 *  `viewBox` par défaut : `100 × 24`, avec 2 px de marge. Les valeurs non finies sont
 *  ignorées. Sans aucune valeur, `undefined` (la cellule affiche son texte). */
export function sparklineGeometry(
  values: readonly any[] | undefined,
  options: {
    point?: "last" | "first" | "high" | "low" | false
    width?: number
    height?: number
    padding?: number
  } = {},
): QChartSparkline | undefined {
  const nums = (values ?? []).filter(finite)
  if (nums.length === 0) return undefined
  const width = options.width ?? 100
  const height = options.height ?? 24
  const padding = options.padding ?? 2
  const innerW = Math.max(1, width - padding * 2)
  const innerH = Math.max(1, height - padding * 2)
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  const flat = max === min
  const span = max - min || 1
  const stepX = nums.length > 1 ? innerW / (nums.length - 1) : 0
  const points: QChartSparkPoint[] = nums.map((v, i) => ({
    x: padding + i * stepX,
    y: padding + (flat ? innerH / 2 : (1 - (v - min) / span) * innerH),
  }))
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${round2(p.x)},${round2(p.y)}`).join(" ")
  const first = points[0]!
  const last = points[points.length - 1]!
  const areaPath = `${path} L${round2(last.x)},${round2(height - padding)} L${round2(first.x)},${round2(
    height - padding,
  )} Z`
  const markerIndex =
    options.point === false
      ? undefined
      : options.point === "first"
        ? 0
        : options.point === "high"
          ? nums.indexOf(max)
          : options.point === "low"
            ? nums.indexOf(min)
            : points.length - 1
  return {
    path,
    areaPath,
    points,
    ...(markerIndex !== undefined && points[markerIndex] ? { marker: points[markerIndex] } : {}),
  }
}
