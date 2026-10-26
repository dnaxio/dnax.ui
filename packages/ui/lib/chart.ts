// Marks de graphique → options du moteur de rendu.
//
// Une marque est un **objet littéral** : `{ type: "line", data, x, y, stroke }`.
// Les canaux acceptent 3 formes :
//
//   x: "month"                 → nom de champ dans chaque ligne
//   x: ["Jan", "Feb"]          → valeurs (ou constante si un seul élément)
//   x: (d, i) => d.month       → fonction d'accès
//
// Marques : `line`, `area`, `bar`, `dot`, `text`, `image`, `rule`, `pie`, `heatmap`.
//   { type: "bar", orientation: "horizontal" }         → barres horizontales (axes inversés)
//   { type: "rule", y: [0] }                           → ligne de repère horizontale (défaut)
//   { type: "rule", x: [0] }                           → ligne de repère verticale
//   { type: "text", x, y, text, dx, dy }               → un libellé par ligne (Plot.text)
//   { type: "image", x, y, src, width, height }        → une image par ligne (scatter d'images)
//   { type: "pie", x, y, innerRadius }                 → camembert / anneau (hors axes)
//   { type: "heatmap", x, y, fill: "temp" }           → carte de chaleur (2 axes catégories)
//
// Canaux : x, y, fill, stroke, strokeWidth, opacity, r, symbol, title, text, src, width,
// height, rotate, fontSize, dx, dy, name, z (une série + une entrée de légende par valeur)
// et stack.
//
// `text` (Plot.text) : `textAnchor` (start | middle | end), `lineAnchor` (top | middle |
// bottom), `dx`/`dy`, `fontSize`, `fontWeight`, `fontFamily`, `fontStyle`, `lineHeight`,
// `lineWidth` (ems → retour à la ligne), `textOverflow`, `fill` (couleur du texte) et
// `stroke` + `strokeWidth` (halo autour du texte).
//
// Les options **de chaque marque** sont listées dans `MARK_OPTIONS` — source de vérité,
// analysée au build par la doc (`docd/scripts/mark-parse.ts`) pour documenter l'API de
// chaque marque.

import { axisFormatter, DEFAULT_LOCALE, formatValue, timeTickFormatter } from "./chartFormat"
import type { QChartFormat } from "./chartFormat"
import { boxStats, categoryTotals, histogram, linearFit, waterfallSteps } from "./chartStats"
import { cellScale, cellVisualOf } from "./chartTable"
import type { QChartCellScale, QChartCellVisual } from "./chartTable"

export type { QChartFormat, QChartFormatKind, QChartFormatOptions } from "./chartFormat"
export type { QChartCellKind, QChartCellScale, QChartCellVisual } from "./chartTable"

/** Valeur d'un canal : nom de champ, valeurs explicites ou fonction d'accès */
export type QChartChannel = string | readonly any[] | ((d: any, i: number) => any) | number

/** Familles de marques */
export type QChartMarkType =
  | "line"
  | "area"
  | "bar"
  | "dot"
  | "text"
  | "image"
  | "rule"
  | "pie"
  | "heatmap"
  /** Données en **table** (HTML, pas de canvas) — mêmes données, même `link`, même sélection */
  | "table"
  // ── Analyses métier (P1) ──
  /** Bande de seuil / zone d'alerte (`y0` → `y1`) — `markArea` */
  | "band"
  /** Jauge (valeur, cible, plages de performance) — hors axes */
  | "gauge"
  /** Entonnoir — hors axes */
  | "funnel"
  /** Radar multicritères — hors axes */
  | "radar"
  /** Treemap hiérarchique — hors axes */
  | "treemap"
  /** Sunburst hiérarchique — hors axes */
  | "sunburst"
  /** Flux entre étapes — hors axes */
  | "sankey"
  /** Boîte à moustaches — cinq nombres par catégorie */
  | "boxplot"
  /** Histogramme — binning natif (`bins`, `domain`) */
  | "histogram"
  /** Cascade — cumul et barres flottantes */
  | "waterfall"

/** Sens des axes : `horizontal` inverse les axes (catégories sur l'axe Y) */
export type QChartOrientation = "vertical" | "horizontal"

/** Colonne d'une marque `table`. Une colonne se déclare en toutes lettres (`{ field, label }`)
 *  ou par son seul champ (`'month'`). Sans `columns`, les colonnes sont déduites des clés des
 *  lignes, dans leur ordre d'apparition. */
export interface QChartColumn {
  /** Champ lu dans chaque ligne */
  field: string
  /** En-tête affiché (défaut : le champ) */
  label?: string
  /** Alignement du contenu — `start` (défaut), `center`, `end` (nombres) */
  align?: "start" | "center" | "end"
  /** Formate la valeur affichée (reçoit la valeur et la ligne) */
  format?: (value: any, row: any) => string
  /** Largeur de la colonne (nombre = px, sinon valeur CSS) */
  width?: number | string
  /** La colonne est-elle **triable** ? (défaut : `true` quand la table est triable) */
  sortable?: boolean
  /** Agrégat de la ligne de **totaux** (`sum`, `avg`, `min`, `max`, `count`) */
  summary?: "sum" | "avg" | "min" | "max" | "count"
  /** **Micro-visualisation** de la cellule (façon Power BI) : barre de données, barre
   *  divergente `delta`, intensité `heat` ou `sparkline`. `true` = barre de données. */
  cell?: QChartCellVisual | boolean
}

/** Séparateurs d'une marque `table` : `horizontal` (défaut — un trait sous chaque rangée),
 *  `vertical` (entre les colonnes), `grid` (les deux) ou `none`. */
export type QChartTableSeparator = "horizontal" | "vertical" | "grid" | "none"

/** Modèle prêt à rendre d'une marque `table` */
export interface QChartTable {
  columns: QChartColumn[]
  /** Lignes **jointes** à la sélection (même règle que les autres marques), puis triées et paginées */
  rows: any[]
  /** Séparateurs demandés par la marque (`separator`, défaut `horizontal`) */
  separator: QChartTableSeparator
  /** Toutes les lignes visibles (avant pagination) — export CSV et totaux */
  allRows?: any[]
  /** Page courante (0-based) et nombre de pages (quand `pageSize` est donné) */
  page?: number
  pages?: number
  pageSize?: number
  /** Tri courant */
  sortBy?: string
  sortDesc?: boolean
  /** Ligne de **totaux** déjà formatée (clé = champ) */
  totals?: Record<string, string>
  /** Valeurs **brutes** des agrégats de la ligne de totaux (pour ses barres de cellule) */
  totalValues?: Record<string, number>
  /** Bornes par colonne, calculées sur les lignes visibles (barres / heat / delta) */
  cellScales?: Record<string, QChartCellScale>
}

/** État de vue d'une table (tri / page), piloté par le composant */
export interface QChartTableView {
  sortBy?: string
  sortDesc?: boolean
  page?: number
}

/** Compare deux valeurs de cellule : nombres d'abord, puis texte ; les vides en dernier. */
function compareCells(a: any, b: any): number {
  const ea = a === null || a === undefined || Number.isNaN(a)
  const eb = b === null || b === undefined || Number.isNaN(b)
  if (ea || eb) return ea && eb ? 0 : ea ? 1 : -1
  if (typeof a === "number" && typeof b === "number") return a - b
  const sa = String(a)
  const sb = String(b)
  return sa < sb ? -1 : sa > sb ? 1 : 0
}

/** Agrège une colonne pour la ligne de totaux (`undefined` = pas d'agrégat).
 *  Renvoie la valeur **brute** (pour les barres du pied de table) et son texte formaté. */
function aggregate(column: QChartColumn, rows: any[]): { value?: number; formatted?: string } | undefined {
  const raw = rows.map((row) => row?.[column.field])
  const nums = raw.filter((v): v is number => typeof v === "number" && Number.isFinite(v))
  const nonEmpty = raw.filter((v) => v !== null && v !== undefined).length
  const mode = column.summary ?? (nums.length === nonEmpty && nums.length > 0 ? "sum" : undefined)
  if (!mode) return undefined
  if (mode === "count") return { value: rows.length, formatted: String(rows.length) }
  if (nums.length === 0) return { formatted: "" }
  const value =
    mode === "sum"
      ? nums.reduce((s, v) => s + v, 0)
      : mode === "avg"
        ? nums.reduce((s, v) => s + v, 0) / nums.length
        : mode === "min"
          ? Math.min(...nums)
          : Math.max(...nums)
  return {
    value,
    formatted: column.format ? column.format(value, undefined) : String(Number(value.toPrecision(12))),
  }
}

/** Modèle d'une marque `table` : colonnes déclarées ou déduites des lignes, lignes jointes à la
 *  sélection partagée (comme n'importe quelle marque liée), puis **tri**, **pagination** et
 *  **totaux** (options de la marque, ou `view` pour un état interactif).
 *
 *  `mode` a le même sens que sur les graphiques : `filter` ne garde que les lignes liées, `dim`
 *  les **garde toutes** (c'est au rendu d'estomper les autres, comme pour une série). */
export function tableModel(
  mark: QChartMark | undefined,
  selection?: any,
  mode: QChartLinkMode = "filter",
  view: QChartTableView = {},
): QChartTable {
  if (!mark) return { columns: [], rows: [], separator: "horizontal" }
  const separator = mark.separator ?? "horizontal"
  const all = mark.data ?? []
  const visible = mode === "dim" ? all : linkedRows(all, chartLink(mark.link), selection)
  const declared = mark.columns ?? []
  const columns: QChartColumn[] = declared.map((column) =>
    typeof column === "string" ? { field: column, label: column } : { ...column, label: column.label ?? column.field },
  )
  if (columns.length === 0) {
    const seen = new Set<string>()
    for (const row of visible) {
      if (row === null || typeof row !== "object") continue
      for (const key of Object.keys(row)) {
        if (!seen.has(key)) {
          seen.add(key)
          columns.push({ field: key, label: key })
        }
      }
    }
  }

  // ── Tri ──
  const sortBy = view.sortBy ?? mark.sortBy
  const sortDesc = !!(view.sortDesc ?? mark.sortDesc ?? false)
  const sorted = sortBy ? [...visible].sort((a, b) => compareCells(a?.[sortBy], b?.[sortBy])) : visible
  if (sortBy && sortDesc) sorted.reverse()

  // ── Totaux (sur toutes les lignes visibles, pas seulement la page) ──
  let totals: Record<string, string> | undefined
  let totalValues: Record<string, number> | undefined
  if (mark.totals) {
    const label = typeof mark.totals === "object" ? (mark.totals.label ?? "") : ""
    const out: Record<string, string> = {}
    const raw: Record<string, number> = {}
    columns.forEach((column, i) => {
      const agg = aggregate(column, sorted)
      if (i === 0 && label) out[column.field] = label
      else if (agg?.formatted !== undefined) out[column.field] = agg.formatted
      if (agg?.value !== undefined) raw[column.field] = agg.value
    })
    if (Object.keys(out).length) totals = out
    if (Object.keys(raw).length) totalValues = raw
  }

  // ── Échelles des micro-visualisations (barres / heat / delta) ──
  let cellScales: Record<string, QChartCellScale> | undefined
  const visualColumns = columns.filter((column) => {
    const visual = cellVisualOf(column.cell)
    return !!visual && visual.type !== "sparkline"
  })
  if (visualColumns.length) {
    cellScales = {}
    for (const column of visualColumns) {
      const visual = cellVisualOf(column.cell)!
      cellScales[column.field] = cellScale(
        sorted.map((row) => row?.[column.field]),
        visual,
      )
    }
  }

  // ── Pagination ──
  const pageSize = typeof mark.pageSize === "number" && mark.pageSize > 0 ? Math.floor(mark.pageSize) : 0
  const pages = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : undefined
  const page = pages ? Math.max(0, Math.min(pages - 1, Math.floor(view.page ?? mark.page ?? 0))) : undefined
  const rows = pages && page !== undefined ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted

  const model: QChartTable = { columns, rows, separator }
  if (mark.sortBy !== undefined || sortBy !== undefined) {
    model.sortBy = sortBy
    model.sortDesc = sortDesc
  }
  if (pages !== undefined) {
    model.allRows = sorted
    model.page = page
    model.pages = pages
    model.pageSize = pageSize
  } else if (totals) {
    model.allRows = sorted
  }
  if (totals) model.totals = totals
  if (totalValues) model.totalValues = totalValues
  if (cellScales) model.cellScales = cellScales
  return model
}

/** Export CSV d'un modèle de table (RFC 4180 : guillemets doublés, séparateur déduit du séparateur
 *  de champs, pas de ligne d'en-tête ajoutée si `header: false`). Ne dépend d'aucun DOM. */
export function tableCsv(
  model: QChartTable,
  options: { separator?: string; header?: boolean; label?: string } = {},
): string {
  const delimiter = options.separator ?? ","
  const escape = (value: any) => {
    const text = value === null || value === undefined ? "" : String(value)
    return new RegExp(`["\n\r${delimiter}]`).test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const rows = model.allRows ?? model.rows
  const lines: string[] = []
  if (options.header !== false) {
    lines.push(model.columns.map((column) => escape(column.label ?? column.field)).join(delimiter))
  }
  for (const row of rows) {
    lines.push(model.columns.map((column) => escape(row?.[column.field])).join(delimiter))
  }
  if (model.totals && options.label !== undefined) {
    lines.push(
      model.columns
        .map((column, i) => escape(model.totals?.[column.field] ?? (i === 0 ? options.label : "")))
        .join(delimiter),
    )
  }
  return lines.join("\r\n")
}

/** Seuil déclaratif de couleur (barres, points, aires) : la première règle qui matche
 *  colore l'élément. Sans `op`, `gt` (strictement supérieur). */
export interface QChartThreshold {
  value: number
  op?: "gt" | "gte" | "lt" | "lte" | "eq" | "neq"
  /** Token dnax.ui ou couleur CSS */
  color: string
}

/** Plage de performance d'une `gauge` (zone colorée de l'arc) */
export interface QChartGaugeBand {
  /** Borne haute — en valeur d'axe, ou en **fraction** `0..1` avec `fraction: true` */
  to: number
  color: string
  fraction?: boolean
}

/** Ligne de totaux d'une marque `table` */
export interface QChartTableTotals {
  /** Libellé de la première colonne (« Total ») */
  label?: string
}

/** A single mark: `{ type: 'line', data, x, y, … }` */
export interface QChartMark {
  /** Mark family (`line`, `area`, `bar`, `dot`, `image`, `text`, `rule`) */
  type: QChartMarkType
  /** Data: rows (objects) or plain values */
  data?: any[]
  /** **Jointure** de cette marque à la sélection partagée : `link: 'month'` (champ local) ou
   *  `link: { localField, foreignField }`. Sans sélection, la marque affiche tout. */
  link?: string | QChartLink
  /** Separator lines of a `table` mark's cells: `horizontal` (default — one line under each
   *  row), `vertical` (between columns), `grid` (both) or `none`. */
  separator?: QChartTableSeparator
  /** Marque `table` : les colonnes à afficher (défaut : déduites des clés des lignes) */
  columns?: (string | QChartColumn)[]
  /** Axis direction (default: `vertical`) */
  orientation?: QChartOrientation
  /** Position on the X axis */
  x?: QChartChannel
  /** Position on the Y axis */
  y?: QChartChannel
  /** Fill: a dnax.ui token (`primary`, `chart-1`…) or any CSS color, or a channel */
  fill?: QChartChannel
  /** Stroke: a dnax.ui token or any CSS color, or a channel */
  stroke?: QChartChannel
  /** Stroke width — the line (`line`, `area`) or the outline / halo (`dot`, `text`). A channel is allowed. */
  strokeWidth?: number | QChartChannel
  /** Opacity of the mark (0 → 1) */
  opacity?: number | QChartChannel
  /** `pie`: outer radius — a number (pixels) or a CSS length (`70%` by default) */
  radius?: number | string
  /** `pie`: inner radius (number or CSS length). Given, the pie becomes a **donut**. */
  innerRadius?: number | string
  /** `pie`: starting angle in degrees — `90` (the default) starts at 12 o'clock, angles growing counter-clockwise */
  startAngle?: number
  /** `pie`: content of the slice labels — `name` (default), `value`, `percent`, `name-value`, `name-percent`, or `false` to hide them.
   *  `heatmap`: `true` prints the value inside each cell.
   *  `bar` / `line` / `area`: `true` or `value` prints the value, `name` the category, `percent`
   *  the share of the category — `labelFormat` formate le nombre. */
  labels?: boolean | "name" | "value" | "percent" | "name-value" | "name-percent"
  /** Position des étiquettes de données (`top`, `bottom`, `inside`, `left`, `right`…) */
  labelPosition?: string
  /** Format des étiquettes de données (axes, barres, lignes, aires) */
  labelFormat?: QChartFormat
  /** Seuils de couleur par point (bar, dot, area) — la première règle qui matche gagne */
  thresholds?: QChartThreshold[]
  /** `dot`: point radius — a constant, or a channel for a bubble chart */
  r?: number | QChartChannel
  /** `dot`: point shape — `circle` (default), `rect`, `triangle`, `diamond`, `pin`, `none`… */
  symbol?: string
  /** `image`: URL of each image — a constant when it starts with `.`, `/` or a protocol, otherwise a channel (a field of each row). Required. */
  src?: QChartChannel
  /** `image`: `true` paints the image inside a **circle** (round marker) — serve the image at
   *  the marker size (the pattern is anchored at the top-left, a bigger source is cropped).
   *  `stroke` + `strokeWidth` then draw a ring around it. */
  round?: boolean
  /** `image`: width in pixels (default 16, or `2 * r`) */
  width?: number | QChartChannel
  /** `image`: height in pixels (default 16, or `2 * r`) */
  height?: number | QChartChannel
  /** Rotation in degrees, **clockwise** (like Plot) — the sign is flipped for you, because the underlying label rotation turns the other way */
  rotate?: number | QChartChannel
  /** `text`: font size in pixels (default 11) — constant or channel */
  fontSize?: number | QChartChannel
  /** `text`: font weight (`bold`, `600`…) */
  fontWeight?: string | number
  /** `text`: font family (the host font by default) */
  fontFamily?: string
  /** `text`: font style (`italic`, `oblique`) */
  fontStyle?: string
  /** `text`: line height in pixels, once the label has several lines */
  lineHeight?: number
  /** `text`: width in **ems** — beyond it the text wraps (Plot's `lineWidth`) */
  lineWidth?: number
  /** `text`: lines wider than `lineWidth` — `ellipsis` truncates with an ellipsis, `clip` cuts hard. Plot's `-start` / `-middle` variants fall back to the end. */
  textOverflow?: "ellipsis" | "ellipsis-end" | "clip" | "clip-end"
  /** `text`: horizontal anchor — `start` (text runs to the right of the point), `middle` (centred, default), `end` (text runs to the left) */
  textAnchor?: "start" | "middle" | "center" | "end"
  /** `text`: vertical anchor — `top` (text hangs below the point), `middle` (centred, default), `bottom` (text sits above the point) */
  lineAnchor?: "top" | "middle" | "bottom"
  /** `text`: horizontal offset of the label, in pixels (Plot's `dx`) */
  dx?: number | QChartChannel
  /** `text`: vertical offset of the label, in pixels (Plot's `dy`) */
  dy?: number | QChartChannel
  /** Per-point tooltip */
  title?: QChartChannel
  /** `text`: the label — defaults to the row itself (primitive data), otherwise its index */
  text?: QChartChannel
  /** Series name (legend entry) */
  name?: string
  /** Grouping: one series (and one legend entry) per value of the channel */
  z?: QChartChannel
  /** Stack the series — `true` empile, `"percent"` empile **à 100 %** (valeurs normalisées
   *  par catégorie), une autre chaîne nomme le groupe d'empilement. */
  stack?: boolean | "percent" | string
  /** Axe des ordonnées visé — `left` (défaut) ou `right` (axe secondaire, cf. `yRight`) */
  yAxis?: "left" | "right"
  /** `bar` **flottante** : canal de la base par point (`y0`) — waterfall, budget/réalisé, bullet */
  base?: QChartChannel
  /** `bar` : couleur de la base (défaut : transparente) */
  baseFill?: string
  /** `line` / `area` : relie les points manquants au lieu de couper le trait */
  connectNulls?: boolean
  /** `line` / `area` : courbe lissée (`true`) ou tension numérique */
  smooth?: boolean | number
  /** `dot` : ajoute une **ligne de tendance** (régression linéaire) */
  trend?: boolean
  /** `rule` / `band` : libellé du repère et sa position (`start`, `middle`, `end`, `insideTop`…) */
  label?: string
  /** `band` : bornes basses / hautes verticales (axe Y) */
  y0?: QChartChannel
  y1?: QChartChannel
  /** `band` : bornes pour une bande **verticale** (axe X) */
  x0?: QChartChannel
  x1?: QChartChannel
  /** `histogram` : nombre de tranches (défaut : règle de la racine carrée) */
  bins?: number
  /** `histogram` : domaine forcé `[min, max]` */
  domain?: [number, number]
  /** `sankey` / `treemap` / `sunburst` : canal de la valeur (poids, surface) */
  value?: QChartChannel
  /** `treemap` / `sunburst` : canal du **parent** (hiérarchie) */
  parent?: QChartChannel
  /** `boxplot` : canal de la **liste de valeurs** brutes (calcul des cinq nombres) */
  values?: QChartChannel
  /** `boxplot` : canal des **statistiques précalculées** (`[min, q1, médiane, q3, max]`) */
  stats?: QChartChannel
  /** `gauge` / `radar` : borne basse / haute de l'échelle */
  min?: number
  max?: number
  /** `gauge` : valeur de la **cible** (aiguille secondaire annotée) */
  target?: number | QChartChannel
  /** `gauge` : plages de performance (arc coloré) */
  bands?: QChartGaugeBand[]
  /** `gauge` / `funnel` : suffixe d'unité affiché dans le détail (`%`, `F CFA`…) */
  unit?: string
  /** `waterfall` : couleur des deltas négatifs (défaut : token `negative`) */
  negativeFill?: QChartChannel
  /** `waterfall` : canal qui marque les lignes de **total** (`true` → barre depuis zéro) */
  isTotal?: QChartChannel
  /** `table` : tri initial (champ, sens) — interactif au clic sur l'en-tête */
  sortBy?: string
  sortDesc?: boolean
  /** `table` : pagination (`pageSize` lignes par page, `page` 0-based) */
  pageSize?: number
  page?: number
  /** `table` : ligne de **totaux** (agrégats des colonnes, `summary`) */
  totals?: boolean | QChartTableTotals
  /** Info-bulle **par marque** : reçoit les paramètres du point et la valeur brute */
  tooltip?: (params: any, value: any) => string
}

/** Options accepted by **each** mark (keys of `QChartMark`).
 *
 *  Source of truth for the docs: `docd/scripts/mark-parse.ts` reads this literal at build
 *  time and prints the mark's own API at the end of every `/docs/charts/<mark>` page.
 *  Adding an option to a mark = adding its key here (otherwise it never shows up in the docs).
 *
 *  Every series mark takes `data`, `x`, `y`, `opacity`, `title`, `name`, `z`, `stack` and
 *  `orientation` (`rule` reference lines only carry positions and a stroke, and `pie`
 *  slices are one per row: no `z`, `stack` or `orientation`). */
export const MARK_OPTIONS = {
  line: [
    "data",
    "link",
    "x",
    "y",
    "stroke",
    "strokeWidth",
    "opacity",
    "title",
    "name",
    "z",
    "stack",
    "orientation",
    "yAxis",
    "connectNulls",
    "smooth",
    "labels",
    "labelPosition",
    "labelFormat",
    "thresholds",
    "tooltip",
  ],
  area: [
    "data",
    "link",
    "x",
    "y",
    "fill",
    "stroke",
    "strokeWidth",
    "opacity",
    "title",
    "name",
    "z",
    "stack",
    "orientation",
    "yAxis",
    "connectNulls",
    "smooth",
    "labels",
    "labelPosition",
    "labelFormat",
    "thresholds",
    "tooltip",
  ],
  bar: [
    "data",
    "link",
    "x",
    "y",
    "fill",
    "stroke",
    "strokeWidth",
    "opacity",
    "title",
    "name",
    "z",
    "stack",
    "orientation",
    "yAxis",
    "base",
    "baseFill",
    "labels",
    "labelPosition",
    "labelFormat",
    "thresholds",
    "tooltip",
  ],
  dot: [
    "data",
    "link",
    "x",
    "y",
    "fill",
    "stroke",
    "strokeWidth",
    "opacity",
    "r",
    "symbol",
    "trend",
    "thresholds",
    "title",
    "name",
    "z",
    "stack",
    "orientation",
    "yAxis",
    "tooltip",
  ],
  image: [
    "data",
    "link",
    "x",
    "y",
    "src",
    "round",
    "width",
    "height",
    "r",
    "rotate",
    "stroke",
    "strokeWidth",
    "opacity",
    "title",
    "name",
    "z",
    "stack",
    "orientation",
  ],
  text: [
    "data",
    "link",
    "x",
    "y",
    "text",
    "fill",
    "stroke",
    "strokeWidth",
    "opacity",
    "fontSize",
    "fontWeight",
    "fontFamily",
    "fontStyle",
    "lineHeight",
    "lineWidth",
    "textOverflow",
    "textAnchor",
    "lineAnchor",
    "dx",
    "dy",
    "rotate",
    "title",
    "name",
    "z",
    "stack",
    "orientation",
  ],
  rule: ["data", "link", "x", "y", "stroke", "fill", "strokeWidth", "label", "labelPosition"],
  band: ["data", "link", "x", "y", "x0", "x1", "y0", "y1", "fill", "stroke", "opacity", "label", "labelPosition"],
  pie: [
    "data",
    "link",
    "x",
    "y",
    "fill",
    "radius",
    "innerRadius",
    "startAngle",
    "labels",
    "labelPosition",
    "opacity",
    "title",
    "name",
  ],
  heatmap: ["data", "link", "x", "y", "fill", "labels", "labelFormat", "opacity", "title", "name"],
  gauge: [
    "data",
    "link",
    "x",
    "y",
    "min",
    "max",
    "target",
    "bands",
    "unit",
    "fill",
    "opacity",
    "title",
    "name",
    "labelFormat",
  ],
  funnel: [
    "data",
    "link",
    "x",
    "y",
    "fill",
    "opacity",
    "labels",
    "labelPosition",
    "labelFormat",
    "title",
    "name",
  ],
  radar: [
    "data",
    "link",
    "x",
    "y",
    "z",
    "fill",
    "stroke",
    "strokeWidth",
    "opacity",
    "min",
    "max",
    "labels",
    "title",
    "name",
  ],
  treemap: ["data", "link", "x", "parent", "value", "fill", "opacity", "labels", "labelFormat", "title", "name"],
  sunburst: [
    "data",
    "link",
    "x",
    "parent",
    "value",
    "fill",
    "radius",
    "opacity",
    "labels",
    "labelFormat",
    "title",
    "name",
  ],
  sankey: ["data", "link", "x", "y", "value", "fill", "opacity", "title", "name"],
  boxplot: [
    "data",
    "link",
    "x",
    "y",
    "values",
    "stats",
    "fill",
    "stroke",
    "opacity",
    "title",
    "name",
    "yAxis",
  ],
  histogram: [
    "data",
    "link",
    "x",
    "bins",
    "domain",
    "fill",
    "opacity",
    "labels",
    "labelPosition",
    "labelFormat",
    "title",
    "name",
  ],
  waterfall: [
    "data",
    "link",
    "x",
    "y",
    "fill",
    "negativeFill",
    "isTotal",
    "labels",
    "labelPosition",
    "labelFormat",
    "opacity",
    "title",
    "name",
    "yAxis",
  ],
  table: [
    "data",
    "link",
    "columns",
    "separator",
    "sortBy",
    "sortDesc",
    "pageSize",
    "page",
    "totals",
  ],
} as const satisfies Record<QChartMarkType, readonly (keyof QChartMark)[]>

/** Configuration d'axe */
export interface QChartAxis {
  /** Espace entre les nombres et l'axe, en pixels (défaut : 16 sur l'axe des ordonnées) */
  margin?: number
  /** `band` (catégories — défaut si l'axe contient du texte), `linear`, `time`, `log` */
  type?: "band" | "linear" | "time" | "log"
  label?: string
  min?: number | string
  max?: number | string
  /** Afficher les lignes de grille (défaut : oui) */
  grid?: boolean
  /** Format des **graduations** (`compact`, `percent`, `currency`, `date`… ou fonction) */
  format?: QChartFormat
  /** Locale des graduations (défaut : celle du graphique) */
  locale?: string
  /** Axe **temporel** : granularité des libellés (`auto` par défaut) */
  timeUnit?: "auto" | "day" | "week" | "month" | "quarter" | "year"
  /** Axe temporel : fuseau horaire IANA (`Africa/Dakar`, `Europe/Paris`…) */
  timeZone?: string
  /** Rotation des libellés, en degrés (ex. `-35` pour gagner de la place) */
  labelRotate?: number
  /** Nombre de graduations souhaité (indicatif) */
  splitNumber?: number
  /** Masquer tout l'axe */
  show?: boolean
  /** Interligne ou intervalle des libellés : `auto` (défaut) ou un nombre (`0` = tous) */
  interval?: number | "auto"
}

/** Info-bulle personnalisable */
export interface QChartTooltip {
  /** Formateur **global** : reçoit les paramètres ECharts, renvoie du HTML / du texte */
  formatter?: (params: any) => string
  /** Formate **chaque valeur** affichée (axe comme point) */
  valueFormatter?: (value: any, params?: any) => string
  /** Trier les séries de l'info-bulle d'axe par valeur décroissante */
  sortDesc?: boolean
  /** Garder le `valueFormatter` aussi dans le **nom de la donnée** (`name`) */
  nameFormatter?: (name: any, params?: any) => string
}

/** Élément désigné dans un graphique (clic, survol) — émis par `<q-chart>` sur `@pick`.
 *  Le vocabulaire est celui des **marques** (`markName`, `markIndex`, `markType`) : jamais
 *  celui du moteur de rendu. */
export interface QChartPick {
  /** Nom de la donnée : le `name` du point, ou la catégorie sur un axe `band` */
  name?: string
  /** Valeur du point (un nombre, ou `[x, y]` sur une marque cartésienne) */
  value?: any
  /** Nom de la **marque** cliquée (son `name` — l'entrée de légende) */
  markName?: string
  /** Index de la marque dans la propriété `marks` */
  markIndex?: number
  /** **Type** de la marque cliquée (`bar`, `line`, `pie`, `heatmap`…) */
  markType?: string
  /** Index de la donnée dans sa marque */
  dataIndex?: number
  /** D'où vient le clic : `mark` (un élément du graphique) ou `legend` (une entrée de légende) */
  origin?: "mark" | "legend"
  /** **Donnée brute** de l'élément (la ligne d'origine) — c'est elle qui alimente les
   *  jointures `link.foreignField` des autres graphiques. */
  data?: any
}

/** Identité d'un élément par son **nom** dans les marques du graphique : la **marque**
 *  (index, `name`, `type`) et la **donnée** (index, ligne, valeur). Un clic de légende ne porte
 *  que le nom : cette fonction reconstruit le `QChartPick` complet, pour que `selected` ait la
 *  même forme quelle que soit l'origine du clic. */
export function legendPickOf(
  marks: readonly QChartMark[] | undefined,
  name: string,
  /** Marque à essayer **en premier** — le clic transmet sa position ; la recherche est globale
   *  ensuite (deux marques peuvent partager un nom, comme `line` et `bar` sur les mois). */
  markHint?: number,
): QChartPick {
  const pick: QChartPick = { name, origin: "legend" }
  const order = [...(marks?.keys() ?? [])]
  if (markHint !== undefined && order.includes(markHint)) {
    order.splice(order.indexOf(markHint), 1)
    order.unshift(markHint)
  }
  for (const markIndex of order) {
    const mark = marks![markIndex]
    if (!mark) continue
    const rows = mark.data ?? []
    for (let dataIndex = 0; dataIndex < rows.length; dataIndex++) {
      const row = rows[dataIndex]
      if (row === null || typeof row !== "object") continue
      const label = typeof mark.x === "string" ? (row as any)[mark.x] : undefined
      const matched =
        label !== undefined
          ? String(label) === String(name)
          : Object.values(row).some((v) => typeof v !== "object" && v !== null && String(v) === String(name))
      if (!matched) continue
      pick.markIndex = markIndex
      pick.markName = mark.name
      pick.markType = mark.type
      pick.dataIndex = dataIndex
      pick.data = row
      const ordinate = typeof mark.y === "string" ? (row as any)[mark.y] : undefined
      if (ordinate !== undefined) pick.value = ordinate
      return pick
    }
  }
  return pick
}

/** Deux sélections désignent-elles le **même élément** ? Le `name` d'abord — c'est la clé
 *  partagée entre graphiques (re-cliquer « Fév », même dans une autre marque, c'est la même
 *  sélection) ; à défaut la position (marque + donnée). Sert au **re-clic qui désélectionne**,
 *  pour les éléments comme pour la légende. */
export function sameSelection(current: QChartPick | null | undefined, candidate: QChartPick): boolean {
  if (!current || !candidate) return false
  if (current.name !== undefined && candidate.name !== undefined) {
    return String(current.name) === String(candidate.name)
  }
  return (
    current.markIndex !== undefined &&
    current.markIndex === candidate.markIndex &&
    current.dataIndex !== undefined &&
    current.dataIndex === candidate.dataIndex
  )
}

/** Sélection suivante après un clic de **légende** en mode `select` : le nom déjà sélectionné
 *  → `null` (l'utilisateur **désélectionne** : le filtre se relâche), un autre nom → ce nom
 *  (on bascule). Le composant rétablit au passage l'entrée de légende que le moteur a
 *  basculée, pour que la part / la série reste visible. */
export function nextLegendPick(
  current: QChartPick | null | undefined,
  name: string,
  data?: any,
) : QChartPick | null {
  // Même règle que pour un clic sur un élément (cf. `sameSelection`) : re-cliquer le nom
  // courant **désélectionne**.
  if (current && current.name !== undefined && String(current.name) === String(name)) return null
  return { name, origin: "legend", data }
}

/** Normalise l'événement de clic du moteur en `QChartPick` — les clés absentes sont omises,
 *  pour que le payload reste comparable et sérialisable. */
export function pickFromEvent(params: any): QChartPick {
  const pick: QChartPick = {}
  const put = (key: keyof QChartPick, value: any) => {
    if (value !== undefined && value !== null) pick[key] = value
  }
  put("name", params?.name)
  put("value", params?.value)
  put("markName", params?.seriesName)
  put("markIndex", params?.seriesIndex)
  put("markType", params?.seriesType)
  put("dataIndex", params?.dataIndex)
  // `series` (le moteur) devient `mark` (notre vocabulaire)
  put("origin", params?.componentType === "series" ? "mark" : params?.componentType === "legend" ? "legend" : undefined)
  put("data", params?.data)
  return pick
}

/** Jointure d'une marque à la **sélection partagée** (façon `localField`/`foreignField` de
 *  Mongo) : la marque ne garde que les lignes dont `localField` correspond à la clé de la
 *  sélection. Écrire `link: 'month'` est le raccourci de `link: { localField: 'month' }`. */
export interface QChartLink {
  /** Le champ de **cette** marque qui porte la clé de jointure (côté local) */
  localField: string
  /** Le champ de la **source** de la sélection (côté étranger), résolu dans la donnée du clic
   *  (`pick.data[foreignField]`), puis dans le pick lui-même, puis dans son `name`.
   *  Défaut : `localField`. */
  foreignField?: string
}

/** Normalise `link: 'month'` en `{ localField: 'month' }` */
export function chartLink(link?: string | QChartLink): QChartLink | undefined {
  if (!link) return undefined
  return typeof link === "string" ? { localField: link } : link
}

/** Clé de jointure d'une sélection : `pick.data[foreignField]`, sinon `pick[foreignField]`,
 *  sinon le `name` du pick ; un scalaire est sa propre clé. `undefined` = pas de sélection. */
export function linkValue(link: QChartLink, selection: any): any {
  if (selection === null || selection === undefined) return undefined
  const field = link.foreignField ?? link.localField
  if (typeof selection !== "object") return selection
  for (const candidate of [selection.data?.[field], selection[field], selection.name]) {
    if (candidate !== undefined && candidate !== null) return candidate
  }
  return undefined
}

/** Lignes d'une marque **jointes** à la sélection : filtre sur `localField`. Deux garde-fous —
 *  sans sélection, ou quand aucune ligne ne porte le champ (jointure impossible), la marque
 *  garde toutes ses données : un graphique ne doit pas se vider sur une clé mal orthographiée. */
export function linkedRows(rows: any[], link: QChartLink | undefined, selection: any): any[] {
  if (!link || selection === null || selection === undefined || rows.length === 0) return rows
  if (!rows.some((row) => row !== null && typeof row === "object" && link.localField in row)) return rows
  const key = linkValue(link, selection)
  if (key === undefined || key === null) return rows
  return rows.filter((row) => String(row?.[link.localField]) === String(key))
}

/** Réaction d'une marque liée à une sélection : `filter` retire les lignes non liées, `dim`
 *  les estompe (opacité réduite) et garde tout le contexte visible. */
export type QChartLinkMode = "filter" | "dim"

/** Placement de la légende (position autour de la zone de tracé, marge, alignement) */
export interface QChartLegend {
  /** Côté où se trouve la légende — `top` (défaut), `bottom`, `left`, `right` */
  position?: "top" | "bottom" | "left" | "right"
  /** Marge entre la légende et la zone de tracé, en pixels (défaut 12) */
  offset?: number
  /** Alignement le long du bord — `start` (défaut), `center`, `end` */
  align?: "start" | "center" | "end"
  /** Un clic sur un élément de légende : `toggle` (défaut — masque la série) ou
   *  `select` (la légende sert de **sélecteur** : le clic émet `@pick` et l'état des séries
   *  est préservé, pour filtrer les autres graphiques). */
  action?: "toggle" | "select"
}

/** Entrée de `chartToECharts()` — ce que `<q-chart>` construit à partir de ses props */
export interface QChartConfig {
  marks: QChartMark[]
  x?: QChartAxis
  y?: QChartAxis
  /** Axe des ordonnées **secondaire**, à droite (combo volume + taux) */
  yRight?: QChartAxis
  /** Locale de l'axe et des formats par défaut (`fr-FR`) */
  locale?: string
  /** Mode **compact** : marges réduites, graduations discrètes, légende masquée par défaut */
  compact?: boolean
  /** Palette : tokens dnax.ui (`primary`, `secondary`…) ou couleurs CSS */
  colors?: string[]
  /** Titre du graphique */
  title?: string
  /** Légende : `false` pour la masquer, `true` pour la forcer (défaut : dès qu'une série
   *  est nommée) ou un objet `{ position, offset, align }` */
  legend?: boolean | QChartLegend
  /** Info-bulle : `false` pour l'éteindre, ou `{ formatter, valueFormatter, sortDesc }` */
  tooltip?: boolean | QChartTooltip
  /** Ce que deviennent les lignes **non liées** par `link` : `filter` (défaut) les retire, `dim`
   *  les **estompe** (`dimOpacity`) et laisse la place à la sélection. */
  linkMode?: QChartLinkMode
  /** Opacité des éléments non sélectionnés en mode `dim` — 0.25 par défaut */
  dimOpacity?: number
  /** **Sélection partagée** (le `@pick` d'un graphique, ou la clé choisie par l'application) :
   *  les marques qui déclarent `link` ne gardent que les lignes jointes (`localField` ←
   *  `foreignField`). `null` = aucune sélection, tout est affiché. */
  selection?: any
  /** Thème : couleurs de texte/grille (résolues depuis les tokens CSS) */
  theme?: { text?: string; muted?: string; grid?: string }
  /** Valeurs des tokens de couleur (relues sur l'élément → suit le thème hôte) */
  tokens?: Record<string, string>
  /** Normalise une couleur CSS en une forme que zrender relit (`#rrggbb` / `rgba()`).
   *  Injecté par `QChart` (canvas 2D) ; absent hors navigateur → couleurs telles quelles. */
  normalizeColor?: (value: string) => string | undefined
  /** Options de rendu brutes, fusionnées en dernier (échappatoire) */
  options?: Record<string, any>
}

const DEFAULT_COLORS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
]

/** Tokens de couleur relus sur l'élément par `QChart` (`tokens`) : le graphique suit le
 *  thème de l'hôte (clair/sombre, thème Docd, shadcn-vue…).
 *
 *  `secondary` et `accent` sont volontairement **exclus** de cette liste : chez un hôte
 *  shadcn-vue ce sont des **surfaces** (`--secondary` ≈ blanc en clair, gris foncé en
 *  sombre — cf. `--background`) et non des couleurs. Les résoudre donnait des lignes de
 *  la couleur du fond, donc invisibles en clair comme en sombre. Ils gardent donc la
 *  valeur Material de dnax (`TOKEN_FALLBACKS`). Même logique pour la palette : les
 *  séries se colorent avec les tokens `--chart-N`, prévus pour ça. */
export const COLOR_TOKENS = [
  "primary",
  "info",
  "positive",
  "warning",
  "negative",
  "dark",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
] as const

/** Valeur d'un token quand le thème hôte n'en fournit pas (palette Material dnax) */
const TOKEN_FALLBACKS: Record<string, string> = {
  primary: "#1976d2",
  secondary: "#26a69a",
  accent: "#9c27b0",
  info: "#31ccec",
  positive: "#21ba45",
  warning: "#f2c037",
  negative: "#c10015",
  dark: "#1d1d1d",
  "chart-1": "#1976d2",
  "chart-2": "#26a69a",
  "chart-3": "#9c27b0",
  "chart-4": "#31ccec",
  "chart-5": "#21ba45",
  "chart-6": "#f2c037",
}

const isToken = (v: any): v is string => typeof v === "string" && v in TOKEN_FALLBACKS

/** Couleur de **cellule de table** (CSS) : un token `primary` / `chart-1` devient
 *  `var(--primary, #1976d2)` ; toute autre valeur CSS est rendue telle quelle.
 *  Les tokens d'un thème hôte qui ne sont pas dans `TOKEN_FALLBACKS` (ex. `muted-foreground`)
 *  sont acceptés dès qu'ils contiennent un tiret — on leur donne `fallback` pour repli. */
export function tokenCss(value: string | undefined, fallback = "currentColor"): string {
  if (!value) return fallback
  if (isToken(value) || /^[a-z][a-z0-9-]*-[a-z0-9-]+$/i.test(value)) {
    return `var(--${value}, ${TOKEN_FALLBACKS[value] ?? fallback})`
  }
  return value
}

/** Style de l'info-bulle : carte translucide floutée (verre), rayon 3px, ombre portée.
 *  `var(--card)` rend la surface solidaire du thème hôte (clair/sombre) sans relecture. */
const TOOLTIP_EXTRA_CSS = [
  "backdrop-filter: blur(10px)",
  "-webkit-backdrop-filter: blur(10px)",
  "border-radius: 3px",
  "box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1)",
  "padding: 8px 12px",
].join("; ")

const tooltipStyle = (theme: { text?: string; grid?: string }) => ({
  backgroundColor: "color-mix(in srgb, var(--card, #ffffff) 70%, transparent)",
  textStyle: { color: theme.text ?? "#333" },
  borderColor: theme.grid ?? "rgba(0, 0, 0, 0.1)",
  borderWidth: 1,
  extraCssText: TOOLTIP_EXTRA_CSS,
})

const isPlainObject = (v: any) => v !== null && typeof v === "object" && !(v instanceof Date)

const isArrayLike = (v: any) => Array.isArray(v)

/** Couleur littérale ? (`#hex`, `rgb()`, `hsl()`, `oklch()`, nom CSS ou token dnax.ui) */
const looksLikeColor = (v: string) =>
  /^(#|rgba?\(|hsla?\(|oklch\(|oklab\(|lch\(|lab\(|color\()/i.test(v) || /^[a-z]+$/i.test(v)

/** Valeur d'un canal pour la ligne `i` (les primitives servent d'identité) */
export function channelValue(
  channel: QChartChannel | undefined,
  data: any[],
  i: number,
): any {
  if (typeof channel === "function") return channel(data[i], i)
  if (typeof channel === "object" && channel !== null) {
    const arr = channel as readonly any[]
    return arr.length > 1 ? arr[i] : arr[0]
  }
  const row = data[i] as any
  if (channel === undefined) return isPlainObject(row) ? undefined : row
  if (typeof channel === "number") return channel
  return isPlainObject(row) ? row[channel] : undefined
}

const isHorizontal = (m: QChartMark) => m.orientation === "horizontal"
const isRule = (m: QChartMark) => m.type === "rule"

/** `textAnchor` (Plot) → `label.align` (ECharts) */
const TEXT_ALIGN: Record<string, "left" | "center" | "right"> = {
  start: "left",
  middle: "center",
  center: "center",
  end: "right",
}

/** `lineAnchor` (Plot) → `label.verticalAlign` (ECharts) */
const LINE_ANCHOR: Record<string, "top" | "middle" | "bottom"> = {
  top: "top",
  middle: "middle",
  bottom: "bottom",
}

/** Contenu d'un libellé (marque `text`) : le canal `text`, sinon la ligne elle-même
 *  (données primitives), sinon son index — comme le `text` par défaut de Plot. */
export function textValue(m: QChartMark, data: any[], i: number): any {
  const v = channelValue(m.text, data, i)
  if (v !== undefined && v !== null) return v
  const row = data[i]
  return isPlainObject(row) ? i : row
}

/** Construit l'option ECharts à partir des marks (voir `QChart`) */
export function chartToECharts(config: QChartConfig): Record<string, any> {
  const marks = config.marks ?? []
  const tokens = config.tokens ?? {}

  /** Couleur exploitable par ECharts/zrender.
   *
   *  zrender ne sait lire que `#hex`, `rgb(a,b,c)`, `hsl(h,s%,l%)` et les noms CSS ;
   *  sur une couleur moderne (`oklch()`, `color-mix()`, `rgb(0 0 0 / .5)` — c'est-à-dire
   *  tous les tokens d'un thème shadcn/Docd) son parseur échoue. Or l'état `emphasis`
   *  (survol) **recalcule la couleur** de l'élément :
   *    `emphasisStyle.fill = liftColor(fromFill)`   (`echarts/lib/util/states.js`)
   *  `liftColor()` renvoie alors `undefined` → la forme est dessinée sans remplissage →
   *  la barre/la ligne DISPARAÎT au survol. On normalise donc en amont (`QChart` le fait
   *  via un canvas 2D, seul moyen portable de sérialiser n'importe quelle couleur CSS). */
  const color = (v: any): any => {
    const c = isToken(v) ? tokens[v] ?? TOKEN_FALLBACKS[v] : v
    if (typeof c !== "string" || !config.normalizeColor) return c
    return config.normalizeColor(c) ?? c
  }
  const resolve = color
  const raw = config.colors?.length ? config.colors : DEFAULT_COLORS
  const palette = raw.map(resolve)

  const theme = {
    text: resolve(config.theme?.text),
    muted: resolve(config.theme?.muted),
    grid: resolve(config.theme?.grid),
  }

  /** Locale des nombres / dates (les formats y retombent quand ils n'en donnent pas) */
  const locale = config.locale ?? DEFAULT_LOCALE
  /** Mode mini-widget : marges réduites, axes et légende effacés */
  const compact = config.compact === true
  /** Format de valeur pour une info-bulle / une étiquette */
  const formatText = (value: any, format?: QChartFormat) => formatValue(value, format, { locale })

  /** Familles posées sur les axes (les autres sont hors axes : pie, gauge, funnel…) */
  const CARTESIAN = new Set<QChartMarkType>([
    "line",
    "area",
    "bar",
    "dot",
    "text",
    "image",
    "heatmap",
    "boxplot",
    "histogram",
    "waterfall",
  ])
  const isCartesianMark = (m: QChartMark) => CARTESIAN.has(m.type)

  /** Groupe d'empilement d'une marque (`true` / `percent` → « total », une chaîne la nomme) */
  const stackGroupOf = (m: QChartMark): string | undefined => {
    if (!m.stack) return undefined
    if (m.stack === true || m.stack === "percent") return "total"
    return String(m.stack)
  }
  /** Groupes qui doivent être normalisés à 100 % */
  const percentGroups = new Set<string>()
  for (const m of marks) if (m.stack === "percent") percentGroups.add(stackGroupOf(m) ?? "total")

  /** Seuil de couleur applicable à une valeur */
  const thresholdOf = (value: any, thresholds?: QChartThreshold[]): string | undefined => {
    if (!thresholds?.length || typeof value !== "number" || !Number.isFinite(value)) return undefined
    for (const rule of thresholds) {
      const op = rule.op ?? "gt"
      const hit =
        op === "gt"
          ? value > rule.value
          : op === "gte"
            ? value >= rule.value
            : op === "lt"
              ? value < rule.value
              : op === "lte"
                ? value <= rule.value
                : op === "eq"
                  ? value === rule.value
                  : value !== rule.value
      if (hit) return resolve(rule.color)
    }
    return undefined
  }

  /** Lignes d'une marque, **jointes** à la sélection partagée (`link` + `selection`).
   *  Point d'application unique : toutes les familles de marques en héritent. */
  const dataOf = (m: QChartMark) => {
    const link = chartLink(m.link)
    // Mode `dim` : la marque garde **toutes** ses lignes (l'estompage est un style, cf. plus bas)
    if ((config.linkMode ?? "filter") === "dim") return m.data ?? []
    return linkedRows(m.data ?? [], link, config.selection)
  }

  // Orientation : donnée par la première marque de série. Toutes les marques
  // doivent partager la même orientation (`pie` n'est pas posé sur les axes → ignoré).
  const first = marks.find(isCartesianMark) ?? marks[0]
  const horizontal = !!first && isHorizontal(first)

  const abscissaOf = (m: QChartMark) => m.x ?? m.y
  const ordinateOf = (m: QChartMark) => m.y ?? m.x

  /** Ligne en **paire** `[abscisse, ordonnée]` (raccourci Plot : ni `x` ni `y` donnés) */
  const pairRowOf = (m: QChartMark, i: number): any[] | null => {
    if (m.x !== undefined || m.y !== undefined) return null
    const row = (m.data ?? [])[i]
    return isArrayLike(row) ? (row as any[]) : null
  }

  /** Canal « couleur » : token dnax.ui, sinon champ de données, sinon couleur littérale */
  const colorValue = (channel: QChartChannel | undefined, data: any[], i: number): any => {
    if (typeof channel === "string") {
      if (isToken(channel)) return channel
      const row = data[0] as any
      if (isPlainObject(row) && channel in row) return channelValue(channel, data, i)
      return looksLikeColor(channel) ? channel : undefined
    }
    return channelValue(channel, data, i)
  }

  // ─── Histogrammes : les tranches sont calculées **avant** les catégories (leurs libellés
  // deviennent l'axe) ───
  const binsOf = new Map<QChartMark, ReturnType<typeof histogram>>()
  for (const m of marks) {
    if (m.type !== "histogram") continue
    const data = dataOf(m)
    const raw = data.map((_, i) => channelValue(m.x, data, i))
    binsOf.set(m, histogram(raw, { bins: m.bins, domain: m.domain }))
  }

  // ─── Domaine des catégories (axe « band ») ───
  const categories: string[] = []
  const seen = new Set<string>()
  let numericX = !binsOf.size
  let timeX = config.x?.type === "time"
  for (const m of marks) {
    if (!isCartesianMark(m)) continue
    const data = dataOf(m)
    const ch = abscissaOf(m)
    // Histogramme : une catégorie par tranche (borne basse → haute)
    const bins = binsOf.get(m)
    if (bins) {
      for (const bin of bins) {
        if (!seen.has(bin.label)) {
          seen.add(bin.label)
          categories.push(bin.label)
        }
      }
      continue
    }
    for (let i = 0; i < data.length; i++) {
      const pair = pairRowOf(m, i)
      const v = pair ? pair[0] : channelValue(ch, data, i)
      if (v === undefined || v === null) continue
      if (v instanceof Date || (typeof v === "string" && timeX)) {
        const ts = v instanceof Date ? v.getTime() : Date.parse(v)
        if (Number.isFinite(ts)) categories.push(String(ts))
        continue
      }
      if (typeof v !== "number") numericX = false
      const key = String(v)
      if (!seen.has(key)) {
        seen.add(key)
        categories.push(key)
      }
    }
  }
  if (config.x?.type === "time") timeX = true
  const axisType = config.x?.type
    ? { band: "category", linear: "value", log: "log", time: "time" }[config.x.type]
    : numericX && !timeX
      ? "value"
      : timeX
        ? "time"
        : "category"

  // `heatmap` : les **lignes** sont un second axe catégorie (`y`), dans l'ordre d'apparition
  const rowCategories: string[] = []
  {
    const seenRows = new Set<string>()
    for (const m of marks) {
      if (m.type !== "heatmap") continue
      const data = dataOf(m)
      for (let i = 0; i < data.length; i++) {
        const v = channelValue(m.y, data, i)
        if (v === undefined || v === null) continue
        const key = String(v)
        if (!seenRows.has(key)) {
          seenRows.add(key)
          rowCategories.push(key)
        }
      }
    }
  }

  /** Valeur d'abscisse prête pour ECharts : résout le canal, la paire, et l'axe temps */
  const solveX = (channel: QChartChannel | undefined, m: QChartMark, i: number): any => {
    const pair = pairRowOf(m, i)
    const v = pair ? pair[0] : channelValue(channel, dataOf(m), i)
    if (axisType !== "time") return v
    if (v instanceof Date) return v.getTime()
    const ts = Date.parse(String(v))
    return Number.isFinite(ts) ? ts : v
  }
  /** Paire `[abscisse, ordonnée]` attendue par ECharts (inversée si marque horizontale) */
  const pairOf = (m: QChartMark, i: number): [any, any] | null => {
    const pair = pairRowOf(m, i)
    const cat = solveX(abscissaOf(m), m, i)
    const val = pair ? pair[1] : channelValue(ordinateOf(m), dataOf(m), i)
    if (cat === undefined || cat === null || val === undefined || val === null) return null
    return horizontal ? [val, cat] : [cat, val]
  }

  /** Catégorie brute d'un point (même résolution que `pairOf`, sans l'orientation) */
  const categoryOf = (m: QChartMark, i: number): any => {
    const pair = pairRowOf(m, i)
    return pair ? pair[0] : solveX(abscissaOf(m), m, i)
  }
  /** Valeur brute d'un point (axe des ordonnées) */
  const ordinateValueOf = (m: QChartMark, i: number): any => {
    const pair = pairRowOf(m, i)
    return pair ? pair[1] : channelValue(ordinateOf(m), dataOf(m), i)
  }

  // ─── Empilement 100 % : ECharts ne normalise pas, on calcule les totaux par catégorie ───
  const stackTotals = new Map<string, Map<string, number>>()
  for (const group of percentGroups) {
    const entries: { category: any; value: any }[] = []
    for (const m of marks) {
      if (stackGroupOf(m) !== group || !isCartesianMark(m)) continue
      const data = dataOf(m)
      for (let i = 0; i < data.length; i++) {
        entries.push({ category: categoryOf(m, i), value: ordinateValueOf(m, i) })
      }
    }
    stackTotals.set(group, categoryTotals(entries))
  }

  /** Paire normalisée : dans un groupe `percent`, l'ordonnée devient une part (0→100) */
  const scaledPairOf = (m: QChartMark, i: number): [any, any] | null => {
    const pair = pairOf(m, i)
    if (!pair) return null
    const group = stackGroupOf(m)
    const totals = group && percentGroups.has(group) ? stackTotals.get(group) : undefined
    if (!totals) return pair
    const total = totals.get(String(categoryOf(m, i))) ?? 0
    const scale = (v: any) =>
      typeof v === "number" ? (total === 0 ? 0 : (v / total) * 100) : v
    return horizontal ? [scale(pair[0]), pair[1]] : [pair[0], scale(pair[1])]
  }

  /** Total par catégorie **du graphique** — sert aux étiquettes `percent` hors empilement */
  let chartLabelTotals: Map<string, number> | undefined
  const labelTotalsOf = (m: QChartMark) => {
    if (chartLabelTotals) return chartLabelTotals
    const entries: { category: any; value: any }[] = []
    for (const mark of marks) {
      if (mark.type !== "bar" && mark.type !== "line" && mark.type !== "area" && mark.type !== "dot" && mark.type !== "waterfall") continue
      const data = dataOf(mark)
      for (let i = 0; i < data.length; i++) {
        entries.push({ category: categoryOf(mark, i), value: ordinateValueOf(mark, i) })
      }
    }
    chartLabelTotals = categoryTotals(entries)
    return chartLabelTotals
  }

  /** Valeur d'ordonnée portée par un point ECharts (`{ value: [cat, val] }` ou scalaire) */
  const ordinateOfPoint = (p: any): any => {
    const v = p?.value ?? p?.data?.value ?? p?.data
    if (Array.isArray(v)) return horizontal ? v[0] : v[1]
    return v
  }
  /** Catégorie portée par un point ECharts */
  const categoryOfPoint = (p: any): any => {
    const v = p?.value ?? p?.data?.value ?? p?.data
    if (Array.isArray(v)) return horizontal ? v[1] : v[0]
    return p?.name ?? p?.axisValue
  }

  /** Étiquettes de données (`labels`) d'une marque cartésienne */
  const dataLabelsOf = (m: QChartMark): Record<string, any> | undefined => {
    if (!m.labels) return undefined
    const position = m.labelPosition ?? "top"
    let formatter: any
    if (m.labels === "name") {
      formatter = "{b}"
    } else if (m.labels === "percent") {
      if (m.labelFormat) {
        formatter = (p: any) => {
          const group = stackGroupOf(m)
          const totals = group && percentGroups.has(group) ? stackTotals.get(group) : labelTotalsOf(m)
          const total = totals?.get(String(categoryOfPoint(p))) ?? 0
          const value = Number(ordinateOfPoint(p) ?? 0)
          const share = total === 0 ? 0 : (Math.abs(value) / Math.abs(total)) * 100
          return formatText(share, { ...(typeof m.labelFormat === "object" ? m.labelFormat : {}), style: "percent" })
        }
      } else if (stackGroupOf(m) && percentGroups.has(stackGroupOf(m)!)) {
        formatter = (p: any) => formatText(Number(ordinateOfPoint(p) ?? 0), "percent")
      } else {
        formatter = (p: any) => {
          const total = labelTotalsOf(m).get(String(categoryOfPoint(p))) ?? 0
          const value = Number(ordinateOfPoint(p) ?? 0)
          const share = total === 0 ? 0 : (Math.abs(value) / Math.abs(total)) * 100
          return formatText(share, "percent")
        }
      }
    } else if (m.labelFormat) {
      formatter = (p: any) => formatText(ordinateOfPoint(p), m.labelFormat)
    } else {
      formatter = "{c}"
    }
    return {
      show: true,
      position,
      formatter,
      color: theme.text,
    }
  }

  const series: Record<string, any>[] = []
  let colorIndex = 0
  const colorFor = (explicit?: any) => {
    if (explicit !== undefined && explicit !== null && explicit !== "") return resolve(explicit)
    return palette[colorIndex++ % palette.length]
  }

  const rulesY: any[] = []
  const rulesX: any[] = []
  /** Zones de seuil (`band`) — `markArea` posé plus bas sur la première série */
  const bandsY: any[] = []
  const bandsX: any[] = []
  /** Configuration `radar` (indicateurs), une par marque `radar` */
  const radarOptions: any[] = []
  /** Échelles de couleurs des cartes de chaleur (valeur numérique → palette) */
  const visualMaps: any[] = []

  for (const m of marks) {
    // Une marque `table` n'est pas une série : elle est rendue en HTML par `<q-chart>`
    if (m.type === "table") continue
    const data = dataOf(m)

    // Bande de seuil / zone d'alerte : `markArea` — horizontale par défaut (`y0` → `y1`),
    // verticale avec `x0` / `x1`. Le libellé (`label`) est posé sur la zone.
    if (m.type === "band") {
      const color = resolve(colorValue(m.fill, data, 0) ?? m.fill)
      const style: Record<string, any> = {}
      if (typeof color === "string" && looksLikeColor(color)) style.color = color
      if (typeof m.stroke === "string") {
        const border = resolve(m.stroke)
        if (typeof border === "string" && looksLikeColor(border)) style.borderColor = border
      }
      if (typeof m.opacity === "number") style.opacity = m.opacity
      const labelCfg = m.label
        ? { show: true, formatter: m.label, position: m.labelPosition ?? "insideTop", color: theme.muted }
        : { show: false }
      const vertical = m.x0 !== undefined || m.x1 !== undefined
      const loChannel = vertical ? m.x0 : (m.y0 ?? m.y)
      const hiChannel = vertical ? m.x1 : (m.y1 ?? m.y)
      /** Une chaîne qui **n'est pas** un champ de la donnée est une constante (`x0: "Jan"`) */
      const boundValue = (channel: QChartChannel | undefined, i: number) => {
        if (typeof channel === "string") {
          const row = data[0]
          if (!isPlainObject(row) || !(channel in row)) return channel
        }
        return channelValue(channel, data, i)
      }
      const count = Math.max(
        data.length || 1,
        isArrayLike(loChannel) ? loChannel.length : 1,
        isArrayLike(hiChannel) ? hiChannel.length : 1,
      )
      for (let i = 0; i < count; i++) {
        const lo = boundValue(loChannel, i)
        const hi = boundValue(hiChannel, i)
        if (lo === undefined || hi === undefined) continue
        const area = vertical
          ? [{ xAxis: lo, itemStyle: { ...style }, label: { ...labelCfg } }, { xAxis: hi }]
          : [{ yAxis: lo, itemStyle: { ...style }, label: { ...labelCfg } }, { yAxis: hi }]
        ;(vertical ? bandsX : bandsY).push(area)
      }
      continue
    }

    // Camembert / anneau — famille **hors axes** (ni grid ni xAxis/yAxis) : une part par
    // ligne, `x` = le libellé de la part, `y` = sa valeur. Sans `fill`, ECharts colorie
    // les parts avec la palette (`color`), une part après l'autre.
    if (m.type === "pie") {
      const formatter =
        m.labels === "value"
          ? "{c}"
          : m.labels === "percent"
            ? "{d}%"
            : m.labels === "name-value"
              ? "{b}: {c}"
              : m.labels === "name-percent"
                ? "{b} {d}%"
                : "{b}"
      const sliceOpacity = typeof m.opacity === "number" ? m.opacity : undefined
      const slices = data.map((_, i) => {
        const slice: Record<string, any> = {
          name: channelValue(m.x, data, i) ?? String(i),
          value: channelValue(m.y, data, i) ?? 0,
        }
        const color = resolve(colorValue(m.fill, data, i))
        const style: Record<string, any> = {}
        if (typeof color === "string" && looksLikeColor(color)) style.color = color
        if (sliceOpacity !== undefined) style.opacity = sliceOpacity
        if (Object.keys(style).length) slice.itemStyle = style
        if (m.title !== undefined) slice.tooltip = { formatter: String(channelValue(m.title, data, i)) }
        return slice
      })
      // Format personnalisé : le formateur reçoit le point ECharts (`value`, `percent`, `name`)
      const formatted = m.labelFormat
        ? (p: any) => {
            if (m.labels === "percent") {
              return formatText(p.percent, { style: "percent", ...(typeof m.labelFormat === "object" ? m.labelFormat : {}) })
            }
            const text = formatText(p.value, m.labelFormat)
            if (m.labels === "name-value") return `${p.name}: ${text}`
            if (m.labels === "name-percent") {
              return `${p.name} ${formatText(p.percent, { style: "percent" })}`
            }
            return m.labels === "value" ? text : p.name
          }
        : formatter
      const outer = m.radius ?? "70%"
      series.push({
        type: "pie",
        name: m.name,
        z: series.length,
        radius: m.innerRadius !== undefined ? [m.innerRadius, outer] : outer,
        ...(typeof m.startAngle === "number" ? { startAngle: m.startAngle } : {}),
        ...(m.labels === false
          ? { label: { show: false }, labelLine: { show: false } }
          : {
              label: {
                formatter: formatted,
                ...(m.labelPosition ? { position: m.labelPosition } : {}),
              },
            }),
        data: slices,
      })
      continue
    }

    // Carte de chaleur — `x` = la colonne, `y` = la ligne (**deux axes catégories**).
    // `fill` porte la **valeur** de la cellule (comme le `fill` d'un rectangle de Plot) :
    // un canal numérique → échelle de couleurs bâtie sur la palette ; une couleur (token ou
    // CSS) → toutes les cellules de cette couleur.
    // ECharts **exige** un `visualMap` pour une série `heatmap` : il est donc toujours émis,
    // **caché** quand la couleur est constante (échelle dégénérée `[c, c]`).
    if (m.type === "heatmap") {
      const columnIndex = new Map(categories.map((c, i) => [c, i]))
      const rowIndex = new Map(rowCategories.map((c, i) => [c, i]))
      const raw = data.map((_, i) => colorValue(m.fill, data, i))
      const numeric = raw.some((v) => typeof v === "number")
      const uniform = numeric ? undefined : resolve(raw[0] ?? m.fill)
      const cells: any[] = []
      for (let i = 0; i < data.length; i++) {
        const column = columnIndex.get(String(solveX(m.x, m, i)))
        const row = rowIndex.get(String(channelValue(m.y, data, i)))
        if (column === undefined || row === undefined) continue
        // Valeur manquante en mode numérique : la case reste **vide** (et transparente)
        const missing = numeric && (typeof raw[i] !== "number" || !Number.isFinite(raw[i]))
        const cell: Record<string, any> = {
          // Nom de la cellule → l'info-bulle ECharts par défaut (« ligne · colonne »)
          name: `${rowCategories[row]} · ${categories[column]}`,
          value: [column, row, numeric ? (missing ? NaN : raw[i]) : 1],
        }
        if (missing) cell.itemStyle = { opacity: 0 }
        if (m.title !== undefined) cell.tooltip = { formatter: String(channelValue(m.title, data, i)) }
        cells.push(cell)
      }
      const values = numeric ? (raw.filter((v) => typeof v === "number") as number[]) : [0, 1]
      // Couleur constante → échelle dégénérée `[c, c]` (sinon la palette sert de rampe)
      const flat = typeof uniform === "string" && looksLikeColor(uniform) ? uniform : (palette[0] ?? "#1976d2")
      visualMaps.push({
        min: Math.min(...values),
        max: Math.max(...values),
        inRange: { color: numeric ? palette : [flat, flat] },
        show: numeric, // une couleur constante n'a pas d'échelle à montrer
        seriesIndex: series.length, // n'affecte pas les autres séries (ex. un `dot` coloré)
        orient: "horizontal",
        left: 0,
        bottom: 0,
        itemWidth: 12,
        itemHeight: 100,
        textStyle: { color: theme.muted },
      })
      const cellOpacity = typeof m.opacity === "number" ? m.opacity : undefined
      series.push({
        type: "heatmap",
        name: m.name,
        z: series.length,
        data: cells,
        ...(cellOpacity !== undefined ? { itemStyle: { opacity: cellOpacity } } : {}),
        ...(m.labels === true || m.labels === "value"
          ? {
              label: {
                show: true,
                formatter: m.labelFormat
                  ? (p: any) => formatText(p.value?.[2], m.labelFormat)
                  : "{@[2]}",
                color: theme.text,
              },
            }
          : {}),
      })
      continue
    }

    if (isRule(m)) {
      // Repère : **horizontal par défaut** (valeurs sur l'axe Y, comme `Plot.ruleY`),
      // c'est-à-dire le cas courant du seuil/objectif. `x` — sans `y` — donne un
      // repère vertical ; `data` (tableau de valeurs) remplace les valeurs du canal.
      const vertical = m.x !== undefined && m.y === undefined
      const ch = vertical ? m.x : m.y ?? m.x
      const values: any[] =
        data.length && !isPlainObject(data[0])
          ? data
          : Array.from(
              { length: data.length || (isArrayLike(ch) ? (ch as any[]).length : 1) },
              (_, i) => channelValue(ch, data, i),
            )
      const lineStyle: Record<string, any> = { type: "dashed" }
      if (theme.grid) lineStyle.color = theme.grid
      const stroke = resolve(m.stroke ?? m.fill)
      if (typeof stroke === "string" && looksLikeColor(stroke)) lineStyle.color = stroke
      if (typeof m.strokeWidth === "number") lineStyle.width = m.strokeWidth
      const list = vertical ? rulesX : rulesY
      const labelCfg = m.label
        ? {
            show: true,
            formatter: m.label,
            position: m.labelPosition ?? "end",
            color: theme.muted,
          }
        : undefined
      for (const v of values) {
        if (v === undefined || v === null) continue
        list.push({
          [vertical ? "xAxis" : "yAxis"]: v,
          lineStyle: { ...lineStyle },
          ...(labelCfg ? { label: { ...labelCfg } } : {}),
        })
      }
      continue
    }

    // ─── Jauge : valeur, plages de performance (`bands`) et cible annotée ───
    if (m.type === "gauge") {
      const value = Number(ordinateValueOf(m, 0) ?? 0)
      const min = m.min ?? 0
      const max = m.max ?? 100
      const span = max - min || 1
      const label = channelValue(m.x, data, 0) ?? m.name ?? ""
      const target = m.target !== undefined ? Number(channelValue(m.target, data, 0)) : undefined
      const fmt = (v: any) => {
        const text = formatText(v, m.labelFormat)
        return m.unit ? `${text} ${m.unit}` : text
      }
      // Plages : `fraction` (0→1) ou valeurs d'axe, converties en fractions pour ECharts
      const bands = (m.bands ?? [])
        .map((band) => {
          const to = band.fraction ? band.to : (band.to - min) / span
          return [Math.max(0, Math.min(1, to)), resolve(band.color)] as [number, string]
        })
        .sort((a, b) => a[0] - b[0])
      const axisColors = bands.length ? bands : ([[1, colorFor(m.fill)]] as [number, string][])
      if (axisColors[0]![0] !== 0) axisColors.unshift([0, axisColors[0]![1]])
      series.push({
        type: "gauge",
        name: m.name,
        z: series.length,
        min,
        max,
        radius: m.radius ?? "75%",
        startAngle: 210,
        endAngle: -30,
        progress: { show: true, width: 12, itemStyle: { color: colorFor(m.fill) } },
        axisLine: { lineStyle: { width: 12, color: axisColors } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: true, color: theme.muted, distance: 14, formatter: (v: number) => formatText(v, m.labelFormat) },
        pointer: { show: true, width: 4, itemStyle: { color: theme.text } },
        anchor: { show: true, size: 8, itemStyle: { color: theme.text } },
        // La cible s'affiche sous la valeur : une coordonnée polaire n'accueille pas de `markLine`
        detail: {
          valueAnimation: true,
          color: theme.text,
          fontSize: 20,
          lineHeight: 22,
          offsetCenter: [0, target !== undefined ? "46%" : "60%"],
          formatter: (v: number) => (target !== undefined ? `${fmt(v)}\nCible ${fmt(target)}` : fmt(v)),
        },
        title: { show: !!label, offsetCenter: [0, target !== undefined ? "88%" : "82%"], color: theme.muted, fontSize: 11 },
        data: [{ name: String(label), value }],
        ...(typeof m.opacity === "number" ? { itemStyle: { opacity: m.opacity } } : {}),
      })
      continue
    }

    // ─── Entonnoir : une part par ligne ───
    if (m.type === "funnel") {
      const slices = data.map((_, i) => {
        const name = String(channelValue(m.x, data, i) ?? i)
        const value = Number(channelValue(m.y, data, i) ?? 0)
        const c = resolve(colorValue(m.fill, data, i))
        return {
          name,
          value,
          ...(typeof c === "string" && looksLikeColor(c) ? { itemStyle: { color: c } } : {}),
        }
      })
      series.push({
        type: "funnel",
        name: m.name,
        z: series.length,
        top: 12,
        bottom: 12,
        left: "10%",
        right: "10%",
        minSize: "20%",
        gap: 2,
        data: slices,
        ...(m.labels === false
          ? { label: { show: false } }
          : {
              label: {
                show: true,
                position: m.labelPosition ?? "inside",
                color: theme.text,
                formatter: (p: any) =>
                  m.labelFormat ? `${p.name}: ${formatText(p.value, m.labelFormat)}` : `${p.name}: ${p.value}`,
              },
            }),
        ...(typeof m.opacity === "number" ? { itemStyle: { opacity: m.opacity } } : {}),
      })
      continue
    }

    // ─── Radar : `x` = l'indicateur, `y` = la valeur, `z` = la série ───
    if (m.type === "radar") {
      const indicators: string[] = []
      const seenIndicator = new Set<string>()
      const byGroup = new Map<string, Map<string, number>>()
      for (let i = 0; i < data.length; i++) {
        const indicator = String(channelValue(m.x, data, i) ?? i)
        if (!seenIndicator.has(indicator)) {
          seenIndicator.add(indicator)
          indicators.push(indicator)
        }
        const key = String(channelValue(m.z, data, i) ?? m.name ?? "")
        if (!byGroup.has(key)) byGroup.set(key, new Map())
        byGroup.get(key)!.set(indicator, Number(ordinateValueOf(m, i)) || 0)
      }
      const flat = [...byGroup.values()].flatMap((vals) => [...vals.values()])
      const radarMax = m.max ?? Math.max(1, ...flat) * 1.2
      radarOptions.push({
        indicator: indicators.map((name) => ({ name, max: radarMax, min: m.min ?? 0 })),
        axisLabel: { color: theme.muted },
        axisLine: { lineStyle: { color: theme.grid } },
        splitLine: { lineStyle: { color: theme.grid } },
        splitArea: { show: false },
      })
      const radarIndex = radarOptions.length - 1
      const entries = [...byGroup.entries()].map(([key, vals], index) => {
        const c = resolve(palette[index % palette.length])
        return {
          name: key || String(m.name ?? ""),
          value: indicators.map((indicator) => vals.get(indicator) ?? 0),
          lineStyle: { color: c, width: typeof m.strokeWidth === "number" ? m.strokeWidth : 2 },
          itemStyle: { color: c },
          areaStyle: { color: c, opacity: typeof m.opacity === "number" ? m.opacity : 0.18 },
        }
      })
      series.push({ type: "radar", name: m.name, z: series.length, radarIndex, symbolSize: 4, data: entries })
      continue
    }

    // ─── Treemap / sunburst : hiérarchie par `parent` ───
    if (m.type === "treemap" || m.type === "sunburst") {
      const nameOf = (i: number) => String(channelValue(m.x, data, i) ?? i)
      const nodes = new Map<string, any>()
      const roots: any[] = []
      for (let i = 0; i < data.length; i++) {
        const node: Record<string, any> = { name: nameOf(i) }
        const value = m.value !== undefined ? channelValue(m.value, data, i) : m.y !== undefined ? channelValue(m.y, data, i) : undefined
        if (value !== undefined) node.value = Number(value)
        const c = resolve(colorValue(m.fill, data, i))
        if (typeof c === "string" && looksLikeColor(c)) node.itemStyle = { color: c }
        nodes.set(node.name, node)
      }
      for (let i = 0; i < data.length; i++) {
        const node = nodes.get(nameOf(i))!
        const parentName = m.parent !== undefined ? channelValue(m.parent, data, i) : undefined
        const parent = parentName !== undefined && parentName !== null ? nodes.get(String(parentName)) : undefined
        if (parent && parent !== node) (parent.children ??= []).push(node)
        else roots.push(node)
      }
      // Un nœud **interne** tient sa surface de ses enfants : sa valeur explicite (souvent 0)
      // fausserait le calcul, on la retire.
      for (const node of nodes.values()) {
        if (node.children?.length && !node.value) delete node.value
      }
      series.push({
        type: m.type,
        name: m.name,
        z: series.length,
        data: roots,
        ...(m.type === "sunburst" ? { radius: m.radius ?? ["15%", "90%"] } : {}),
        ...(m.type === "treemap" ? { roam: false, nodeClick: false, breadcrumb: { show: false } } : {}),
        ...(m.labels === false
          ? { label: { show: false } }
          : m.labelFormat
            ? { label: { formatter: (p: any) => formatText(p.value, m.labelFormat) } }
            : {}),
      })
      continue
    }

    // ─── Sankey : flux source → cible ───
    if (m.type === "sankey") {
      const links: any[] = []
      const names: string[] = []
      const seenNode = new Set<string>()
      for (let i = 0; i < data.length; i++) {
        const source = String(channelValue(m.x ?? "source", data, i) ?? "")
        const target = String(channelValue(m.y ?? "target", data, i) ?? "")
        const value = Number(channelValue(m.value ?? "value", data, i) ?? 0)
        links.push({ source, target, value })
        for (const name of [source, target]) {
          if (name && !seenNode.has(name)) {
            seenNode.add(name)
            names.push(name)
          }
        }
      }
      series.push({
        type: "sankey",
        name: m.name,
        z: series.length,
        data: names.map((name) => ({ name })),
        links,
        left: 8,
        right: 8,
        top: 12,
        bottom: 12,
        emphasis: { focus: "adjacency" },
        lineStyle: { color: "gradient", opacity: 0.35, curveness: 0.5 },
        label: { color: theme.text },
        ...(typeof m.opacity === "number" ? { itemStyle: { opacity: m.opacity } } : {}),
      })
      continue
    }

    // ─── Boîte à moustaches : cinq nombres, bruts (`values`) ou précalculés (`stats`) ───
    if (m.type === "boxplot") {
      const boxes: any[] = []
      for (let i = 0; i < data.length; i++) {
        const category = categoryOf(m, i)
        if (category === undefined || category === null) continue
        let stats: any = m.stats !== undefined ? channelValue(m.stats, data, i) : undefined
        if (!stats && m.values !== undefined) stats = boxStats(channelValue(m.values, data, i) ?? [])
        if (!stats) continue
        const five = Array.isArray(stats) ? stats : [stats.min, stats.q1, stats.median, stats.q3, stats.max]
        if (five.some((v: any) => typeof v !== "number" || !Number.isFinite(v))) continue
        boxes.push({ name: String(category), value: five })
      }
      const border = colorFor(m.stroke ?? m.fill)
      series.push({
        type: "boxplot",
        name: m.name,
        z: series.length,
        data: boxes,
        boxWidth: [7, 40],
        itemStyle: {
          color: "transparent",
          borderColor: border,
          borderWidth: typeof m.strokeWidth === "number" ? m.strokeWidth : 2,
          ...(typeof m.opacity === "number" ? { opacity: m.opacity } : {}),
        },
      })
      continue
    }

    // ─── Histogramme : tranches calculées en amont (`binsOf`) ───
    if (m.type === "histogram") {
      const bins = binsOf.get(m) ?? []
      series.push({
        type: "bar",
        name: m.name,
        z: series.length,
        barCategoryGap: "2%",
        data: bins.map((bin) => ({ name: bin.label, value: bin.count })),
        itemStyle: {
          color: colorFor(m.fill),
          borderRadius: [2, 2, 0, 0],
          ...(typeof m.opacity === "number" ? { opacity: m.opacity } : {}),
        },
        ...(dataLabelsOf(m) ? { label: dataLabelsOf(m) } : {}),
      })
      continue
    }

    // ─── Cascade : barres flottantes cumulées + connecteurs ───
    if (m.type === "waterfall") {
      const values = data.map((_, i) => ordinateValueOf(m, i))
      const flags = data.map((_, i) => (m.isTotal !== undefined ? channelValue(m.isTotal, data, i) : false))
      const steps = waterfallSteps(values, flags)
      const positive = resolve(colorValue(m.fill, data, 0) ?? m.fill)
      const negative = resolve(colorValue(m.negativeFill, data, 0) ?? "negative")
      const totalColor = palette[colorIndex++ % palette.length]
      const items = steps.map((step, i) => {
        const color = step.totalRow
          ? totalColor
          : step.delta < 0
            ? negative
            : typeof positive === "string" && looksLikeColor(positive)
              ? positive
              : palette[0]
        return {
          name: String(categoryOf(m, i) ?? i),
          value: [Math.min(step.base, step.total), Math.max(step.base, step.total)],
          itemStyle: { color, ...(typeof m.opacity === "number" ? { opacity: m.opacity } : {}) },
        }
      })
      const connectors = steps
        .slice(0, -1)
        .map((step, i) => {
          const from = categories[i]
          const to = categories[i + 1]
          if (from === undefined || to === undefined) return null
          return [
            { coord: [from, step.total] },
            { coord: [to, step.total] },
          ]
        })
        .filter((pair): pair is { coord: (string | number)[] }[] => pair !== null)
      const labels = dataLabelsOf(m)
      series.push({
        type: "bar",
        name: m.name,
        z: series.length,
        barMaxWidth: 42,
        data: items,
        ...(labels
          ? {
              label: {
                ...labels,
                formatter: (p: any) => {
                  const step = steps[p.dataIndex]
                  if (!step) return ""
                  return formatText(step.totalRow ? step.total : step.delta, m.labelFormat)
                },
              },
            }
          : {}),
        ...(connectors.length
          ? {
              markLine: {
                silent: true,
                symbol: "none",
                animation: false,
                data: connectors,
                lineStyle: { color: theme.muted, type: "dashed", width: 1 },
              },
            }
          : {}),
      })
      continue
    }

    // Regroupement `z` → une série (et une entrée de légende) par valeur
    const zChannel = m.z
    const groups: { key: string | null; indexes: number[] }[] = []
    if (zChannel !== undefined) {
      const map = new Map<string, number[]>()
      for (let i = 0; i < data.length; i++) {
        const key = String(channelValue(zChannel, data, i) ?? "")
        const arr = map.get(key)
        if (arr) arr.push(i)
        else map.set(key, [i])
      }
      for (const [key, indexes] of map) groups.push({ key, indexes })
    } else {
      groups.push({ key: null, indexes: data.map((_, i) => i) })
    }

    for (const g of groups) {
      const points = g.indexes
        .map((i) => {
          // `line` / `area` : un trou garde sa catégorie avec une ordonnée `null` — la ligne
          // se coupe (ou se relie avec `connectNulls`). Les autres marques sautent le point.
          if (m.type === "line" || m.type === "area") {
            const scaled = scaledPairOf(m, i)
            if (scaled) return { value: scaled, index: i }
            const cat = categoryOf(m, i)
            if (cat === undefined || cat === null) return null
            return { value: (horizontal ? [null, cat] : [cat, null]) as [any, any], index: i }
          }
          const pair = scaledPairOf(m, i)
          return pair ? { value: pair, index: i } : null
        })
        .filter((p): p is { value: [any, any]; index: number } => p !== null)

      // `stroke` est la couleur de la marque (ligne, contour), `fill` celle des surfaces.
      // Pour un `dot` : `fill` colore le point et `stroke` en dessine le **contour** —
      // dès lors que `fill` est aussi donné ; un `stroke` seul colore le point, comme
      // avant (rétrocompatible, et c'est alors `fill` qui n'est pas renseigné).
      // `text` : comme un `dot`, `fill` colore la marque (ici le texte) ; un `stroke`
      // seul colore aussi — sinon c'est le halo (cf. `outline` ci-dessous).
      const primary = m.type === "dot" || m.type === "text" ? (m.fill ?? m.stroke) : (m.stroke ?? m.fill)
      const stroke = colorValue(primary, data, g.indexes[0] ?? 0)
      const fill = resolve(colorValue(m.fill, data, g.indexes[0] ?? 0))
      const baseColor = colorFor(stroke ?? fill)
      // Contour (`dot`) / halo (`text`) : `stroke`, dès que `fill` est aussi donné.
      const outline =
        (m.type === "dot" || m.type === "text") && m.fill !== undefined
          ? resolve(colorValue(m.stroke, data, g.indexes[0] ?? 0))
          : undefined
      const radius = channelValue(m.r, data, g.indexes[0] ?? 0)

      // `image` : taille et rotation au premier point ; les autres sont posées par
      // point dans `perPoint` (comme `r` pour les bulles).
      const scale = channelValue(m.r, data, g.indexes[0] ?? 0)
      const imageW = channelValue(m.width, data, g.indexes[0] ?? 0)
      const imageH = channelValue(m.height, data, g.indexes[0] ?? 0)
      const fallbackSize = typeof scale === "number" ? scale * 2 : 16
      const imageSize: [number, number] = [
        typeof imageW === "number" ? imageW : typeof imageH === "number" ? imageH : fallbackSize,
        typeof imageH === "number" ? imageH : typeof imageW === "number" ? imageW : fallbackSize,
      ]
      const rotate0 = channelValue(m.rotate, data, g.indexes[0] ?? 0)
      // `text` : police et décalage au premier point — les autres points sont posés par
      // `perPoint` quand le canal varie (comme `r` pour les bulles).
      const fontSize0 = channelValue(m.fontSize, data, g.indexes[0] ?? 0)
      const dx0 = channelValue(m.dx, data, g.indexes[0] ?? 0)
      const dy0 = channelValue(m.dy, data, g.indexes[0] ?? 0)
      // `src` est une constante si elle commence par `.`, `/` ou un protocole — sinon
      // c'est un canal (un champ de données), comme dans Observable Plot.
      const constantSrc =
        typeof m.src === "string" && /^([./]|[a-z][a-z0-9+.-]*:)/i.test(m.src) ? m.src : undefined

      const name = g.key ?? m.name
      const stackGroup = stackGroupOf(m)

      const common = {
        name,
        z: series.length,
        ...(stackGroup ? { stack: stackGroup } : {}),
        ...(m.yAxis === "right" && !horizontal ? { yAxisIndex: 1 } : {}),
        ...(theme.muted ? { markLineColor: theme.muted } : {}),
        // Info-bulle **par marque** : reçoit les paramètres du point et la valeur brute
        ...(m.tooltip
          ? { tooltip: { formatter: (p: any) => m.tooltip!(p, ordinateOfPoint(p)) } }
          : {}),
      }

      /** Valeur au point `p` si elle diffère du défaut donné (sinon `undefined`) */
      const perPointValue = (channel: QChartChannel | undefined, base: any, i: number) => {
        const v = channelValue(channel, data, i)
        return v === base ? undefined : v
      }

      const perPoint = (p: { value: [any, any]; index: number }) => {
        const item: Record<string, any> = { value: p.value }
        const c = resolve(colorValue(m.fill, data, p.index))
        if (typeof c === "string" && looksLikeColor(c) && c !== fill) item.itemStyle = { color: c }
        if (m.type === "dot") {
          // Rayon par point → graphique à bulles
          const r = channelValue(m.r, data, p.index)
          if (typeof r === "number" && r !== radius) item.symbolSize = r * 2 + 2
        } else if (m.type === "image") {
          const src = channelValue(m.src, data, p.index)
          if (m.round === true) {
            // Pastille ronde : l'image est peinte en **motif** dans le symbole `circle`
            if (typeof src === "string") item.itemStyle = { color: { image: src, repeat: "no-repeat" } }
          } else if (!constantSrc && typeof src === "string") {
            item.symbol = `image://${src}`
          }
          const w = perPointValue(m.width, imageSize[0], p.index)
          const h = perPointValue(m.height, imageSize[1], p.index)
          if (typeof w === "number" || typeof h === "number") {
            item.symbolSize = [typeof w === "number" ? w : imageSize[0], typeof h === "number" ? h : imageSize[1]]
          }
          const rotate = perPointValue(m.rotate, rotate0, p.index)
          if (typeof rotate === "number") item.symbolRotate = rotate
        }
        if (m.type === "text") {
          // Le libellé vit dans `label` ; quand le canal varie d'un point à l'autre,
          // ECharts fusionne le `label` de l'élément avec celui de la série (le premier
          // prime sur les clés qu'il donne).
          const value = textValue(m, data, p.index)
          item.label = { formatter: value === undefined || value === null ? "" : String(value) }
          const c = resolve(colorValue(m.fill, data, p.index))
          if (typeof c === "string" && looksLikeColor(c) && c !== fill) item.label.color = c
          const size = perPointValue(m.fontSize, fontSize0, p.index)
          if (typeof size === "number") item.label.fontSize = size
          // `rotate` est horaire (Plot) ; `label.rotate` d'ECharts est anti-horaire
          const rot = perPointValue(m.rotate, rotate0, p.index)
          if (typeof rot === "number") item.label.rotate = -rot
          const dx = perPointValue(m.dx, dx0, p.index)
          const dy = perPointValue(m.dy, dy0, p.index)
          if (typeof dx === "number" || typeof dy === "number") {
            item.label.offset = [typeof dx === "number" ? dx : dx0 ?? 0, typeof dy === "number" ? dy : dy0 ?? 0]
          }
          if (m.title !== undefined) item.tooltip = { formatter: String(channelValue(m.title, data, p.index)) }
        } else {
          const t = m.title !== undefined ? channelValue(m.title, data, p.index) : undefined
          if (t !== undefined) item.tooltip = { formatter: String(t) }
        }
        // Seuils déclaratifs : ils colorent le point (pas les images ni le texte)
        if (m.type !== "image" && m.type !== "text") {
          const threshold = thresholdOf(p.value[horizontal ? 0 : 1], m.thresholds)
          if (threshold) item.itemStyle = { ...(item.itemStyle ?? {}), color: threshold }
        }
        return item
      }

      const opacity = typeof m.opacity === "number" ? m.opacity : undefined

      if (m.type === "bar") {
        const labels = dataLabelsOf(m)
        if (m.base !== undefined) {
          // Barre **flottante** : ECharts n'accepte pas `[cat, [y0, y1]]` — on empile une base
          // invisible et le delta visible dans **le même groupe** d'empilement.
          const stackName = `${stackGroup ?? "bar"}__base_${series.length}`
          const at = horizontal ? 0 : 1
          const baseColorFill = resolve(m.baseFill) ?? "transparent"
          const bases = points.map((p) => {
            const raw = Number(channelValue(m.base, data, p.index))
            const base = Number.isFinite(raw) ? raw : 0
            return horizontal ? [base, p.value[1]] : [p.value[0], base]
          })
          series.push({
            type: "bar",
            z: series.length,
            stack: stackName,
            silent: true,
            legendHoverLink: false,
            tooltip: { show: false },
            emphasis: { disabled: true },
            barMaxWidth: 42,
            data: bases.map((value) => ({ value, itemStyle: { color: baseColorFill } })),
            itemStyle: { color: baseColorFill },
            // Marqueur interne : la base ne participe ni à la légende, ni à l'estompage
            __base: true,
          })
          const tops = points.map((p, k) => {
            const base = Number((bases[k] as any)[at])
            const value = Number(p.value[at])
            const delta = (Number.isFinite(value) ? value : 0) - (Number.isFinite(base) ? base : 0)
            const item = perPoint(p)
            item.value = horizontal ? [delta, p.value[1]] : [p.value[0], delta]
            return item
          })
          series.push({
            ...common,
            type: "bar",
            z: series.length,
            stack: stackName,
            data: tops,
            itemStyle: { color: baseColor, borderRadius: [3, 3, 0, 0], ...(opacity !== undefined ? { opacity } : {}) },
            barMaxWidth: 42,
            ...(labels ? { label: labels } : {}),
          })
        } else {
          series.push({
            ...common,
            type: "bar",
            data: points.map(perPoint),
            itemStyle: { color: baseColor, borderRadius: [3, 3, 0, 0], ...(opacity !== undefined ? { opacity } : {}) },
            barMaxWidth: 42,
            ...(labels ? { label: labels } : {}),
          })
        }
      } else if (m.type === "line" || m.type === "area") {
        const isArea = m.type === "area"
        const labels = dataLabelsOf(m)
        series.push({
          ...common,
          type: "line",
          data: points.map(perPoint),
          smooth: m.smooth === true ? true : typeof m.smooth === "number" ? m.smooth : false,
          ...(m.connectNulls ? { connectNulls: true } : {}),
          symbol: "circle",
          symbolSize: isArea ? 0 : 5,
          lineStyle: {
            width: typeof m.strokeWidth === "number" ? m.strokeWidth : 2,
            color: baseColor,
            ...(opacity !== undefined ? { opacity } : {}),
          },
          ...(isArea ? { areaStyle: { color: baseColor, opacity: 0.18 } } : {}),
          ...(labels ? { label: labels } : {}),
        })
      } else if (m.type === "dot") {
        // `fill` numérique → **échelle de couleurs** (visualMap dédié à cette série).
        // La valeur de couleur voyage en **3ᵉ dimension** du point (`[x, y, v]`), sinon
        // le moteur n'a rien à mapper.
        const fills = g.indexes.map((i) => colorValue(m.fill, data, i))
        const numericFill = fills.length > 0 && fills.every((v) => typeof v === "number")
        const dotData = points.map((p) => {
          const item = perPoint(p)
          if (numericFill) item.value = [...p.value, Number(colorValue(m.fill, data, p.index))]
          return item
        })
        if (numericFill) {
          const nums = fills as number[]
          visualMaps.push({
            show: false,
            seriesIndex: series.length,
            dimension: 2,
            min: Math.min(...nums),
            max: Math.max(...nums),
            inRange: { color: palette },
          })
        }
        series.push({
          ...common,
          type: "scatter",
          symbol: typeof m.symbol === "string" ? m.symbol : "circle",
          data: dotData,
          symbolSize: typeof radius === "number" ? radius * 2 + 2 : 9,
          itemStyle: {
            ...(numericFill ? {} : { color: baseColor }),
            ...(typeof outline === "string" && looksLikeColor(outline)
              ? {
                  borderColor: outline,
                  borderWidth: typeof m.strokeWidth === "number" ? m.strokeWidth : 1,
                }
              : {}),
            ...(opacity !== undefined ? { opacity } : {}),
          },
        })
      } else if (m.type === "image") {
        const round = m.round === true
        // Deux rendus :
        //  - `round: true` : un symbole `circle` **rempli par un motif** image
        //    (`itemStyle.color.image`, posé par point). zrender ne sait pas découper un
        //    symbole : le motif est peint à la taille **native** de l'image, ancré en haut à
        //    gauche du marqueur → servir l'image au format du marqueur.
        //  - sinon `image://` : ECharts dessine l'image dans `symbolSize`, aspect conservé
        //    (`symbolKeepAspect`), sans découpe possible.
        // `opacity` par défaut à 1 : la valeur 0.8 de `scatter` délave les images.
        const ring = resolve(colorValue(m.stroke, data, g.indexes[0] ?? 0))
        series.push({
          ...common,
          type: "scatter",
          ...(round
            ? { symbol: "circle" }
            : constantSrc
              ? { symbol: `image://${constantSrc}` }
              : {}),
          ...(round ? {} : { symbolKeepAspect: true }),
          ...(typeof rotate0 === "number" ? { symbolRotate: rotate0 } : {}),
          data: points.map(perPoint),
          symbolSize: imageSize,
          itemStyle: {
            opacity: opacity ?? 1,
            // Anneau (`stroke` + `strokeWidth`) — surtout lisible sur une pastille ronde
            ...(typeof ring === "string" && looksLikeColor(ring)
              ? {
                  borderColor: ring,
                  borderWidth: typeof m.strokeWidth === "number" ? m.strokeWidth : round ? 2 : 1,
                }
              : {}),
          },
        })
      } else if (m.type === "text") {
        // Libellé (Plot.text) : le point n'est qu'une **ancre invisible** (1 px,
        // transparente) — tout le rendu est dans `label`. Par défaut le texte est
        // **centré** sur (x, y) (`middle` / `middle`, comme Plot sans `frameAnchor`) ;
        // `textAnchor` / `lineAnchor` le décollent et `dx` / `dy` le décalent en pixels.
        const fontSize = typeof fontSize0 === "number" ? fontSize0 : 11
        // Plot exprime `lineWidth` en **ems** → largeur en pixels pour ECharts.
        const wrap = typeof m.lineWidth === "number" ? { width: m.lineWidth * fontSize } : {}
        const overflow =
          m.textOverflow !== undefined
            ? { overflow: "truncate", ellipsis: /^ellipsis/.test(m.textOverflow) ? "…" : "" }
            : typeof m.lineWidth === "number"
              ? { overflow: "break" }
              : {}
        series.push({
          ...common,
          type: "scatter",
          data: points.map(perPoint),
          symbolSize: 1,
          // `opacity: 1` : sans ça le libellé hérite des 0.8 par défaut d'une série
          // `scatter` (`defaultOpacity` du symbole) et le texte sort délavé.
          itemStyle: { color: color("transparent"), opacity: 1 },
          label: {
            show: true,
            position: "inside",
            align: TEXT_ALIGN[m.textAnchor ?? "middle"] ?? "center",
            verticalAlign: LINE_ANCHOR[m.lineAnchor ?? "middle"] ?? "middle",
            color: baseColor,
            fontSize,
            ...(m.fontWeight !== undefined ? { fontWeight: m.fontWeight } : {}),
            ...(m.fontFamily !== undefined ? { fontFamily: m.fontFamily } : {}),
            ...(m.fontStyle !== undefined ? { fontStyle: m.fontStyle } : {}),
            ...(typeof m.lineHeight === "number" ? { lineHeight: m.lineHeight } : {}),
            ...wrap,
            ...overflow,
            // `rotate` est horaire (Plot) ; `label.rotate` d'ECharts est anti-horaire
            ...(typeof rotate0 === "number" ? { rotate: -rotate0 } : {}),
            ...(typeof dx0 === "number" || typeof dy0 === "number"
              ? { offset: [dx0 ?? 0, dy0 ?? 0] }
              : {}),
            // Halo (Plot : `stroke` + `strokeWidth`, `paintOrder: 'stroke'` par défaut)
            ...(typeof outline === "string" && looksLikeColor(outline)
              ? {
                  textBorderColor: outline,
                  textBorderWidth: typeof m.strokeWidth === "number" ? m.strokeWidth : 3,
                }
              : {}),
            ...(opacity !== undefined ? { opacity } : {}),
          },
        })
      }
    }
  }

  // Ligne de tendance des nuages de points (`trend: true`) — régression linéaire, deux points
  for (const m of marks) {
    if (m.type !== "dot" || !m.trend) continue
    const data = dataOf(m)
    const pts: [number, number][] = []
    for (let i = 0; i < data.length; i++) {
      const cat = categoryOf(m, i)
      const val = ordinateValueOf(m, i)
      if (
        typeof cat === "number" &&
        typeof val === "number" &&
        Number.isFinite(cat) &&
        Number.isFinite(val)
      ) {
        pts.push([cat, val])
      }
    }
    const fit = linearFit(pts)
    if (!fit) continue
    const xs = pts.map(([x]) => x)
    const x0 = Math.min(...xs)
    const x1 = Math.max(...xs)
    const at = (x: number) => fit.slope * x + fit.intercept
    series.push({
      type: "line",
      z: series.length,
      silent: true,
      symbol: "none",
      legendHoverLink: false,
      tooltip: { show: false },
      lineStyle: { color: theme.muted, type: "dashed", width: 1.5 },
      data: horizontal
        ? [{ value: [at(x0), x0] }, { value: [at(x1), x1] }]
        : [{ value: [x0, at(x0)] }, { value: [x1, at(x1)] }],
      __trend: true,
    })
  }

  // Zones de seuil (`band`) : `markArea` sur la première série cartésienne
  if (bandsY.length || bandsX.length) {
    if (!series.length) {
      series.push({ type: "line", data: [], silent: true, symbol: "none", lineStyle: { opacity: 0 } })
    }
    const host =
      series.find((s) => s.type === "bar" || s.type === "line" || s.type === "scatter") ?? series[0]!
    host.markArea = { silent: true, animation: false, data: [...bandsY, ...bandsX] }
  }

  // Les règles sont posées sur la première série (ou une série vide hôte)
  if (rulesY.length || rulesX.length) {
    if (!series.length) {
      series.push({ type: "line", data: [], silent: true, symbol: "none", lineStyle: { opacity: 0 } })
    }
    series[0]!.markLine = {
      silent: true,
      symbol: "none",
      animation: false,
      data: [...rulesY, ...rulesX],
      ...(theme.muted ? { lineStyle: { color: theme.muted, type: "dashed" } } : {}),
    }
  }

  // ─── Légende : position (haut par défaut), alignement, marge, place réservée ───
  // La légende et la zone de tracé ne doivent pas se toucher : la marge (`offset`) est
  // **réservée** dans le `grid` (haut/bas/gauche/droite selon la position).
  const legendOn = config.legend === false ? false : config.legend === true || (!compact && series.some((s) => !!s.name))
  const legendConfig: QChartLegend = typeof config.legend === "object" && config.legend !== null ? config.legend : {}
  const legendPosition = legendConfig.position ?? "top"
  // `offset` par défaut : 24 px — une respiration **conséquente** entre la légende et la
  // zone de tracé (la première étiquette de graduation est collée au bord du grid, donc une
  // marge faible se lit comme un chevauchement).
  const legendGap = typeof legendConfig.offset === "number" ? legendConfig.offset : 24
  const legendAlign = legendConfig.align === "center" ? "center" : legendConfig.align === "end" ? "right" : 0
  /** Hauteur d'une entrée de légende (itemHeight 10 + respiration) */
  const LEGEND_LINE = 14
  /** Largeur réservée à une légende verticale (gauche / droite) */
  const LEGEND_COLUMN = 90
  const legendTop = config.title ? 26 : 0
  const legendTopBand = legendOn && legendPosition === "top" ? legendTop + LEGEND_LINE + legendGap : 0
  /** Place sous le graphique quand une échelle de couleurs est visible (`heatmap`) */
  const scaleBand = visualMaps.some((vm) => vm.show !== false) ? 30 : 0
  /** Bandeau du **nom d'axe** (nom de l'axe y au-dessus, nom de l'axe x en dessous) */
  const axisNameTop = config.y?.label ? 16 : 0
  const axisNameBottom = config.x?.label ? 22 : 0
  const legendOption = !legendOn
    ? { show: false }
    : {
        textStyle: { color: theme.muted },
        itemWidth: 10,
        itemHeight: 10,
        ...(legendPosition === "left"
          ? { orient: "vertical", left: 0, top: "middle" }
          : legendPosition === "right"
            ? { orient: "vertical", right: 0, top: "middle" }
            : legendPosition === "bottom"
              ? { bottom: scaleBand, left: legendAlign }
              : { top: legendTop, left: legendAlign }),
      }
  /** Axe des ordonnées **secondaire** (marques avec `yAxis: 'right'`) */
  const hasRightAxis = series.some((s) => s.yAxisIndex === 1)
  const gridBox = compact
    ? {
        left: 2,
        right: hasRightAxis ? 12 : 2,
        top: config.title ? 20 : 2,
        bottom: 2,
        containLabel: true,
      }
    : {
        left: 8 + (legendOn && legendPosition === "left" ? LEGEND_COLUMN + legendGap : 0),
        right:
          16 +
          (legendOn && legendPosition === "right" ? LEGEND_COLUMN + legendGap : 0) +
          (hasRightAxis ? 12 : 0),
        // Légende → nom d'axe → zone de tracé, sans recouvrement
        top: (legendTopBand > 0 ? legendTopBand : config.title ? 44 : 16) + axisNameTop,
        bottom:
          8 +
          axisNameBottom +
          scaleBand +
          (legendOn && legendPosition === "bottom" ? LEGEND_LINE + legendGap : 0),
        containLabel: true,
      }

  const axisLabel = { color: theme.muted }
  const axisLine = { lineStyle: { color: theme.grid } }

  /** Libellés d'axe : format demandé, granularité temporelle, rotation, mode compact */
  const axisLabelOptions = (axis: QChartAxis | undefined, temporal = false) => {
    const formatted =
      axisFormatter(axis?.format, { locale: axis?.locale ?? locale }) ??
      (temporal
        ? timeTickFormatter(axis?.timeUnit, axis?.locale ?? locale, axis?.timeZone)
        : undefined)
    const opt: Record<string, any> = { ...axisLabel, hideOverlap: true }
    if (formatted) opt.formatter = formatted
    if (typeof axis?.labelRotate === "number") opt.rotate = axis.labelRotate
    if (axis?.interval !== undefined && axis.interval !== "auto") opt.interval = axis.interval
    if (compact || axis?.show === false) opt.show = false
    return opt
  }

  const hasHeatmap = series.some((s) => s.type === "heatmap")
  const categoryAxis = (
    axis: QChartAxis | undefined,
    data: string[] = categories,
    heat = false,
    temporal = false,
  ) => ({
    type: "category",
    show: axis?.show !== false,
    data,
    name: compact ? undefined : axis?.label,
    nameTextStyle: axisLabel,
    axisLabel: axisLabelOptions(axis, temporal),
    axisLine: { ...axisLine, show: !compact && axis?.show !== false },
    axisTick: { show: false },
    splitLine: { show: false },
    // Carte de chaleur : quadrillage des cases
    ...(heat ? { splitArea: { show: true } } : {}),
    boundaryGap: hasHeatmap || series.some((s) => s.type === "bar"),
  })
  const valueAxis = (axis: QChartAxis | undefined, zero: boolean, temporal = false) => {
    const label = axisLabelOptions(axis, temporal)
    if (!temporal) label.margin = typeof axis?.margin === "number" ? axis.margin : 16
    else if (typeof axis?.margin === "number") label.margin = axis.margin
    return {
      type: axis?.type === "log" ? "log" : temporal ? "time" : "value",
      show: axis?.show !== false,
      name: compact ? undefined : axis?.label,
      nameTextStyle: axisLabel,
      min: axis?.min ?? (zero ? 0 : undefined),
      max: axis?.max,
      ...(typeof axis?.splitNumber === "number" ? { splitNumber: axis.splitNumber } : {}),
      axisLabel: label,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: compact ? axis?.grid === true : axis?.grid ?? true,
        lineStyle: { color: theme.grid },
      },
    }
  }

  // ─── Nom d'axe : placement **toujours dans le cadre** ───
  // Axe **horizontal** : centré sous l'axe (`middle`). À la fin de l'axe (`end`, le défaut
  // ECharts) le nom s'écrivait vers la droite, hors du cadre.
  const axisNameX = { nameLocation: "middle" as const, nameGap: 32 }
  // Axe **vertical** : ancré à **gauche** (`align: left`) sur la ligne d'axe, en haut.
  // Un `nameGap` fixe ne peut pas convenir : un nom centré sur l'axe déborde à gauche, un nom
  // rotaté au milieu recouvre/est rogné par les nombres (largeur variable : `1,000` vs
  // `1,000,000`). Ancré à gauche, il s'étend vers la droite → jamais rogné, jamais superposé.
  const axisNameY = {
    nameLocation: "end" as const,
    nameTextStyle: { ...axisLabel, align: "left" as const },
  }
  // Orientation horizontale : catégories sur l'axe Y
  const hasBar = series.some((s) => s.type === "bar")
  const xAxisBase = hasHeatmap
    ? categoryAxis(config.x, categories, true, axisType === "time")
    : horizontal
      ? valueAxis(config.x, hasBar, axisType === "time")
      : axisType === "category"
        ? categoryAxis(config.x)
        : valueAxis(config.x, false, axisType === "time")
  const yAxisBase = hasHeatmap
    ? categoryAxis(config.y, rowCategories, true)
    : horizontal
      ? axisType === "category"
        ? categoryAxis(config.y)
        : valueAxis(config.y, false, config.y?.type === "time")
      : valueAxis(config.y, hasBar, config.y?.type === "time")
  const xAxis = config.x?.label ? { ...xAxisBase, ...axisNameX } : xAxisBase
  const yAxisLeft = config.y?.label ? { ...yAxisBase, ...axisNameY } : yAxisBase
  // Axe **secondaire** : mêmes règles, nom ancré à droite (sinon il sort du cadre)
  const yAxisRight = hasRightAxis
    ? {
        ...valueAxis(config.yRight, series.some((s) => s.yAxisIndex === 1 && s.type === "bar"), config.yRight?.type === "time"),
        ...(config.yRight?.label
          ? { nameLocation: "end" as const, nameTextStyle: { ...axisLabel, align: "right" as const } }
          : {}),
      }
    : undefined
  const yAxis = hasRightAxis ? [yAxisLeft, yAxisRight] : yAxisLeft

  // Familles **hors axes** (`pie`, `gauge`, `radar`, `sankey`…) : ni grid ni xAxis/yAxis —
  // sinon ECharts laisse un cadre fantôme et décale le titre.
  const cartesian = series.some(
    (s) =>
      s.type === "bar" ||
      s.type === "line" ||
      s.type === "scatter" ||
      s.type === "heatmap" ||
      s.type === "boxplot",
  )

  // Un tooltip d'axe suppose des données **par catégorie** : vrai pour tout cartésien, sauf si
  // l'info est par point (`title`) ou si le graphique ne porte que des étiquettes (`text`).
  // (`cartesian` inclut la heatmap, qui se survole cellule par cellule : on ne s'en sert pas ici.)
  const axisTooltip =
    series.some((s) => s.type === "bar" || s.type === "line") ||
    (series.some((s) => s.type === "scatter") &&
      !series.some((s) => s.type === "heatmap") &&
      !marks.some((m) => m.title !== undefined || m.type === "text"))

  /** Info-bulle : `false`, `true`, ou configuration (formateurs, tri) */
  const tooltipConfig: QChartTooltip =
    typeof config.tooltip === "object" && config.tooltip !== null ? config.tooltip : {}
  /** Formateur d'axe par défaut enrichi : valeurs formatées, noms formatés, tri */
  const axisTooltipFormatter = (params: any) => {
    const list: any[] = Array.isArray(params) ? params : [params]
    const head = list[0]?.axisValueLabel ?? list[0]?.axisValue ?? ""
    const rows = tooltipConfig.sortDesc
      ? [...list].sort((a, b) => Number(ordinateOfPoint(b) ?? 0) - Number(ordinateOfPoint(a) ?? 0))
      : list
    const body = rows
      .map((p) => {
        const raw = ordinateOfPoint(p)
        const rawName = p.seriesName ?? p.name ?? ""
        const name = tooltipConfig.nameFormatter ? tooltipConfig.nameFormatter(rawName, p) : rawName
        const text = tooltipConfig.valueFormatter
          ? tooltipConfig.valueFormatter(raw, p)
          : raw === null || raw === undefined
            ? "—"
            : String(raw)
        return `${p.marker ?? ""}${name ? `${name}: ` : ""}${text}`
      })
      .join("<br/>")
    return `${head ? `<div style="margin-bottom:2px">${head}</div>` : ""}${body}`
  }

  // `valueFormatter` par point : ECharts lit cette option **au niveau de la série** quand
  // l'info-bulle est en mode `item` (pas de formateur global).
  if (!axisTooltip && tooltipConfig.valueFormatter) {
    for (const one of series) {
      one.tooltip = { ...(one.tooltip ?? {}), valueFormatter: tooltipConfig.valueFormatter }
    }
  }

  const option: Record<string, any> = {
    ...(config.title
      ? { title: { text: config.title, left: 0, textStyle: { fontSize: 13, fontWeight: 600, color: theme.text } } }
      : {}),
    ...(cartesian
      ? {
          grid: gridBox,
          xAxis,
          yAxis,
        }
      : {}),
    ...(radarOptions.length ? { radar: radarOptions.length === 1 ? radarOptions[0] : radarOptions } : {}),
    ...(visualMaps.length ? { visualMap: visualMaps } : {}),
    tooltip:
      config.tooltip === false
        ? { show: false }
        : {
            // **`axis` par défaut sur tout graphique cartésien** (bar, line, dot…) : on compare
            // les séries le long de l'axe. On reste en `item` quand l'information est vraiment
            // **par point** : une marque `title` (elle ne s'afficherait jamais dans un tooltip
            // d'axe) ou un graphique d'étiquettes (`text`, dont la donnée est le libellé).
            trigger: axisTooltip ? "axis" : "item",
            ...(axisTooltip
              ? { axisPointer: { type: series.some((s) => s.type === "bar") ? "shadow" : "line" } }
              : {}),
            confine: true,
            ...(tooltipConfig.formatter
              ? { formatter: tooltipConfig.formatter }
              : axisTooltip && (tooltipConfig.valueFormatter || tooltipConfig.nameFormatter || tooltipConfig.sortDesc)
                ? { formatter: axisTooltipFormatter }
                : {}),
            ...tooltipStyle(theme),
          },
    legend: legendOption,
    color: palette,
    series,
  }

  // ── Mode `dim` : estomper au lieu de retirer ────────────────────────────────
  // Tout est dessiné, les éléments non liés passent en opacité réduite et **l'état `select`
  // de la série ramène la sélection au plein contraste** (ECharts n'a pas d'état « non
  // sélectionné » : on baisse le style par défaut, la sélection le relève).
  // **Seulement s'il y a une sélection** : au repos, tout doit être à plein contraste
  const picked = config.selection
  const hasSelection =
    !!picked && (typeof picked !== "object" || picked.name !== undefined || picked.dataIndex !== undefined)
  if ((config.linkMode ?? "filter") === "dim" && hasSelection) {
    const dim = typeof config.dimOpacity === "number" ? config.dimOpacity : 0.25
    for (const one of option.series ?? []) {
      // Les séries techniques (base d'une barre flottante, tendance) restent intactes
      if (one.__base || one.__trend) continue
      one.selectedMode = "single"
      // Seule l'opacité change : on ne touche ni au rayon (celui des barres vient du
      // traducteur : `borderRadius: [3, 3, 0, 0]`) ni au reste du style de la marque.
      one.itemStyle = { ...(one.itemStyle ?? {}), opacity: dim }
      if (one.type === "line" || one.type === "area") {
        one.lineStyle = { ...(one.lineStyle ?? {}), opacity: dim }
      }
      // Le style `select` **par défaut** du moteur pose `borderColor: primary, borderWidth: 2`
      // autour de l'élément sélectionné : on annule la **bordure** (largeur + couleur), et rien
      // d'autre — le rayon, lui, reste celui de la marque (les barres gardent leurs coins).
      const selectStyle = {
        itemStyle: { opacity: 1, borderColor: "transparent", borderWidth: 0 },
      }
      one.select =
        one.type === "line" || one.type === "area"
          ? { ...selectStyle, lineStyle: { opacity: 1 } }
          : selectStyle
    }
  }

  return { ...option, ...(config.options ?? {}) }
}
