// Calculs statistiques du traducteur de graphiques — **purs**, testables sans DOM.
//
// Utilisés par les marques `histogram`, `boxplot` et `waterfall` (P1 de `QChart`).
// Aucune notion de couleur ni de rendu : uniquement des nombres, pour que les tests
// portent sur la sémantique (tranches, quartiles, cumul) et non sur ECharts.

/** Une tranche d'histogramme */
export interface QChartBin {
  /** Borne basse (incluse) */
  x0: number
  /** Borne haute (exclue, sauf la dernière tranche) */
  x1: number
  /** Nombre de valeurs dans la tranche */
  count: number
  /** Libellé par défaut (`x0 – x1`) — l'appelant peut le reformater */
  label: string
}

/** Arrondit un nombre de borne pour les libellés (évite `0.30000000000000004`) */
const clean = (v: number) => Number(v.toPrecision(12))

/** Histogramme : répartit des valeurs numériques en `bins` tranches.
 *
 *  - `bins` par défaut : `ceil(sqrt(n))` (règle de la racine), borné à `[1, 40]` ;
 *  - `domain` force les bornes ; sinon `[min, max]` des valeurs ;
 *  - une valeur `null` / non finie est ignorée ;
 *  - la borne haute de la **dernière** tranche est inclusive (la valeur maximale compte). */
export function histogram(
  values: readonly any[],
  options: { bins?: number; domain?: [number, number] } = {},
): QChartBin[] {
  const nums = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v))
  if (nums.length === 0) return []
  let lo = options.domain?.[0] ?? Math.min(...nums)
  let hi = options.domain?.[1] ?? Math.max(...nums)
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return []
  if (hi < lo) [lo, hi] = [hi, lo]
  const requested = Math.max(1, Math.min(40, Math.round(options.bins ?? Math.ceil(Math.sqrt(nums.length)))))
  // Domaine dégénéré (une seule valeur) : une tranche autour de la valeur
  if (hi === lo) {
    return [{ x0: lo, x1: hi, count: nums.length, label: `${clean(lo)}` }]
  }
  // Le nombre de tranches demandé est **respecté** : pas d'arrondi « joli » qui le changerait.
  const step = (hi - lo) / requested
  const bins: QChartBin[] = Array.from({ length: requested }, (_, i) => ({
    x0: clean(lo + i * step),
    x1: clean(lo + (i + 1) * step),
    count: 0,
    label: "",
  }))
  for (const v of nums) {
    // La valeur maximale tombe dans la dernière tranche (borne haute inclusive)
    let i = Math.floor((v - lo) / step)
    if (i < 0) i = 0
    if (i >= requested) i = requested - 1
    const bin = bins[i]
    if (bin) bin.count++
  }
  for (const bin of bins) bin.label = `${clean(bin.x0)} – ${clean(bin.x1)}`
  return bins
}

/** Quantile (interpolation linéaire, méthode R-7 — celle d'Excel `QUARTILE.INC`) */
export function quantile(sorted: readonly number[], p: number): number {
  if (sorted.length === 0) return Number.NaN
  const pos = (sorted.length - 1) * Math.max(0, Math.min(1, p))
  const lower = Math.floor(pos)
  const upper = Math.ceil(pos)
  if (lower === upper) return sorted[lower]!
  return sorted[lower]! + (sorted[upper]! - sorted[lower]!) * (pos - lower)
}

/** Boîte à moustaches (cinq nombres) */
export interface QChartBox {
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

/** Statistiques d'une série de valeurs (`undefined` si aucune valeur numérique) */
export function boxStats(values: readonly any[]): QChartBox | undefined {
  const nums = values
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v))
    .slice()
    .sort((a, b) => a - b)
  if (nums.length === 0) return undefined
  return {
    min: nums[0]!,
    q1: quantile(nums, 0.25),
    median: quantile(nums, 0.5),
    q3: quantile(nums, 0.75),
    max: nums[nums.length - 1]!,
  }
}

/** Ajustement affine par moindres carrés — `undefined` si les abscisses sont toutes égales */
export function linearFit(
  points: readonly (readonly [number, number])[],
): { slope: number; intercept: number } | undefined {
  const pts = points.filter(
    ([x, y]) => typeof x === "number" && typeof y === "number" && Number.isFinite(x) && Number.isFinite(y),
  )
  if (pts.length < 2) return undefined
  const n = pts.length
  const sumX = pts.reduce((s, [x]) => s + x, 0)
  const sumY = pts.reduce((s, [, y]) => s + y, 0)
  const meanX = sumX / n
  const meanY = sumY / n
  let num = 0
  let den = 0
  for (const [x, y] of pts) {
    num += (x - meanX) * (y - meanY)
    den += (x - meanX) ** 2
  }
  if (den === 0) return undefined
  const slope = num / den
  return { slope, intercept: meanY - slope * meanX }
}

/** Étape d'un graphique en cascade (waterfall) */
export interface QChartWaterfallStep {
  /** Valeur de départ de la barre (le cumul précédent) */
  base: number
  /** Hauteur signée de la barre (le delta) */
  delta: number
  /** Cumul après l'étape */
  total: number
  /** Ligne de **total** (barre posée depuis zéro) ? */
  totalRow: boolean
}

/** Décompose des deltas en barres flottantes cumulées.
 *
 *  `flags[i] === true` marque une ligne de **total** : la barre part de zéro et sa hauteur
 *  est le cumul courant (elle ne s'ajoute pas une seconde fois au cumul). */
export function waterfallSteps(
  values: readonly any[],
  flags: readonly any[] = [],
): QChartWaterfallStep[] {
  const steps: QChartWaterfallStep[] = []
  let running = 0
  for (let i = 0; i < values.length; i++) {
    const raw = values[i]
    const value = typeof raw === "number" && Number.isFinite(raw) ? raw : 0
    const totalRow = flags[i] === true || flags[i] === "total"
    if (totalRow) {
      steps.push({ base: 0, delta: running, total: running, totalRow: true })
      continue
    }
    steps.push({ base: running, delta: value, total: running + value, totalRow: false })
    running += value
  }
  return steps
}

/** Répartition en pourcentage (somme des valeurs absolues, `0` évité).
 *  Une valeur nulle ou non finie vaut `0` : la part reste calculable. */
export function percentShares(values: readonly any[]): number[] {
  const nums = values.map((v) => (typeof v === "number" && Number.isFinite(v) ? v : 0))
  const total = nums.reduce((s, v) => s + Math.abs(v), 0)
  return total === 0 ? nums.map(() => 0) : nums.map((v) => (Math.abs(v) / total) * 100)
}

/** Somme par catégorie — sert au calcul des **empilements 100 %**. */
export function categoryTotals(
  entries: readonly { category: any; value: any }[],
): Map<string, number> {
  const totals = new Map<string, number>()
  for (const { category, value } of entries) {
    if (category === undefined || category === null) continue
    if (typeof value !== "number" || !Number.isFinite(value)) continue
    const key = String(category)
    totals.set(key, (totals.get(key) ?? 0) + value)
  }
  return totals
}
