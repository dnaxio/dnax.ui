// Marks de graphique → options ECharts.
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

/** Sens des axes : `horizontal` inverse les axes (catégories sur l'axe Y) */
export type QChartOrientation = "vertical" | "horizontal"

/** A single mark: `{ type: 'line', data, x, y, … }` */
export interface QChartMark {
  /** Mark family (`line`, `area`, `bar`, `dot`, `image`, `text`, `rule`) */
  type: QChartMarkType
  /** Data: rows (objects) or plain values */
  data?: any[]
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
  /** `pie`: starting angle in degrees (ECharts' convention — 90, the default, is 12 o'clock) */
  startAngle?: number
  /** `pie`: content of the slice labels — `name` (default), `value`, `percent`, `name-value`, `name-percent`, or `false` to hide them.
   *  `heatmap`: `true` prints the value inside each cell. */
  labels?: boolean | "name" | "value" | "percent" | "name-value" | "name-percent"
  /** `dot`: point radius — a constant, or a channel for a bubble chart */
  r?: number | QChartChannel
  /** `dot`: point shape — `circle` (default), `rect`, `triangle`, `diamond`, `pin`, `none`… */
  symbol?: string
  /** `image`: URL of each image — a constant when it starts with `.`, `/` or a protocol, otherwise a channel (a field of each row). Required. */
  src?: QChartChannel
  /** `image`: width in pixels (default 16, or `2 * r`) */
  width?: number | QChartChannel
  /** `image`: height in pixels (default 16, or `2 * r`) */
  height?: number | QChartChannel
  /** Rotation in degrees, **clockwise** (like Plot) — `image` (`symbolRotate`) and `text` (ECharts' `label.rotate` turns the other way, so the sign is flipped for you) */
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
  /** Stack the series */
  stack?: boolean
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
  line: ["data", "x", "y", "stroke", "strokeWidth", "opacity", "title", "name", "z", "stack", "orientation"],
  area: ["data", "x", "y", "fill", "stroke", "strokeWidth", "opacity", "title", "name", "z", "stack", "orientation"],
  bar: ["data", "x", "y", "fill", "stroke", "strokeWidth", "opacity", "title", "name", "z", "stack", "orientation"],
  dot: ["data", "x", "y", "fill", "stroke", "strokeWidth", "opacity", "r", "symbol", "title", "name", "z", "stack", "orientation"],
  image: ["data", "x", "y", "src", "width", "height", "r", "rotate", "opacity", "title", "name", "z", "stack", "orientation"],
  text: [
    "data",
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
  rule: ["data", "x", "y", "stroke", "fill", "strokeWidth"],
  pie: ["data", "x", "y", "fill", "radius", "innerRadius", "startAngle", "labels", "opacity", "title", "name"],
  heatmap: ["data", "x", "y", "fill", "labels", "opacity", "title", "name"],
} as const satisfies Record<QChartMarkType, readonly (keyof QChartMark)[]>

/** Configuration d'axe */
export interface QChartAxis {
  /** `band` (catégories — défaut si l'axe contient du texte), `linear`, `time`, `log` */
  type?: "band" | "linear" | "time" | "log"
  label?: string
  min?: number | string
  max?: number | string
  /** Afficher les lignes de grille (défaut : oui) */
  grid?: boolean
}

/** Placement de la légende (position autour de la zone de tracé, marge, alignement) */
export interface QChartLegend {
  /** Côté où se trouve la légende — `top` (défaut), `bottom`, `left`, `right` */
  position?: "top" | "bottom" | "left" | "right"
  /** Marge entre la légende et la zone de tracé, en pixels (défaut 12) */
  offset?: number
  /** Alignement le long du bord (`top` / `bottom`) — `start` (défaut), `center`, `end` */
  align?: "start" | "center" | "end"
}

/** Entrée de `chartToECharts()` — ce que `<q-chart>` construit à partir de ses props */
export interface QChartConfig {
  marks: QChartMark[]
  x?: QChartAxis
  y?: QChartAxis
  /** Palette : tokens dnax.ui (`primary`, `secondary`…) ou couleurs CSS */
  colors?: string[]
  /** Titre du graphique */
  title?: string
  /** Légende : `false` pour la masquer, `true` pour la forcer (défaut : dès qu'une série
   *  est nommée) ou un objet `{ position, offset, align }` */
  legend?: boolean | QChartLegend
  /** Info-bulle (défaut : oui) */
  tooltip?: boolean
  /** Thème : couleurs de texte/grille (résolues depuis les tokens CSS) */
  theme?: { text?: string; muted?: string; grid?: string }
  /** Valeurs des tokens de couleur (relues sur l'élément → suit le thème hôte) */
  tokens?: Record<string, string>
  /** Normalise une couleur CSS en une forme que zrender relit (`#rrggbb` / `rgba()`).
   *  Injecté par `QChart` (canvas 2D) ; absent hors navigateur → couleurs telles quelles. */
  normalizeColor?: (value: string) => string | undefined
  /** Options ECharts brutes, fusionnées en dernier (échappatoire) */
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

  const dataOf = (m: QChartMark) => m.data ?? []

  // Orientation : donnée par la première marque de série. Toutes les marques
  // doivent partager la même orientation (`pie` n'est pas posé sur les axes → ignoré).
  const first = marks.find((m) => !isRule(m) && m.type !== "pie") ?? marks[0]
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

  // ─── Domaine des catégories (axe « band ») ───
  const categories: string[] = []
  const seen = new Set<string>()
  let numericX = true
  let timeX = config.x?.type === "time"
  for (const m of marks) {
    if (isRule(m) || m.type === "pie") continue
    const data = dataOf(m)
    const ch = abscissaOf(m)
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

  const series: Record<string, any>[] = []
  let colorIndex = 0
  const colorFor = (explicit?: any) => {
    if (explicit !== undefined && explicit !== null && explicit !== "") return resolve(explicit)
    return palette[colorIndex++ % palette.length]
  }

  const rulesY: any[] = []
  const rulesX: any[] = []
  /** Échelles de couleurs des cartes de chaleur (valeur numérique → palette) */
  const visualMaps: any[] = []

  for (const m of marks) {
    const data = dataOf(m)

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
      const outer = m.radius ?? "70%"
      series.push({
        type: "pie",
        name: m.name,
        z: series.length,
        radius: m.innerRadius !== undefined ? [m.innerRadius, outer] : outer,
        ...(typeof m.startAngle === "number" ? { startAngle: m.startAngle } : {}),
        ...(m.labels === false
          ? { label: { show: false }, labelLine: { show: false } }
          : { label: { formatter } }),
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
      const numeric = raw.length > 0 && raw.every((v) => typeof v === "number")
      const uniform = numeric ? undefined : resolve(raw[0] ?? m.fill)
      const cells: any[] = []
      for (let i = 0; i < data.length; i++) {
        const column = columnIndex.get(String(solveX(m.x, m, i)))
        const row = rowIndex.get(String(channelValue(m.y, data, i)))
        if (column === undefined || row === undefined) continue
        const cell: Record<string, any> = {
          // Nom de la cellule → l'info-bulle ECharts par défaut (« ligne · colonne »)
          name: `${rowCategories[row]} · ${categories[column]}`,
          value: [column, row, numeric ? raw[i] : 1],
        }
        if (m.title !== undefined) cell.tooltip = { formatter: String(channelValue(m.title, data, i)) }
        cells.push(cell)
      }
      const values = numeric ? (raw as number[]) : [0, 1]
      // Couleur constante → échelle dégénérée `[c, c]` (sinon la palette sert de rampe)
      const flat = typeof uniform === "string" && looksLikeColor(uniform) ? uniform : (palette[0] ?? "#1976d2")
      visualMaps.push({
        min: Math.min(...values),
        max: Math.max(...values),
        inRange: { color: numeric ? palette : [flat, flat] },
        show: numeric, // une couleur constante n'a pas d'échelle à montrer
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
          ? { label: { show: true, formatter: "{c}", color: theme.text } }
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
      for (const v of values) {
        if (v === undefined || v === null) continue
        list.push({ [vertical ? "xAxis" : "yAxis"]: v, lineStyle: { ...lineStyle } })
      }
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
          const pair = pairOf(m, i)
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

      const common = {
        name,
        z: series.length,
        ...(m.stack ? { stack: "total" } : {}),
        ...(theme.muted ? { markLineColor: theme.muted } : {}),
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
          if (!constantSrc && typeof src === "string") item.symbol = `image://${src}`
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
        return item
      }

      const opacity = typeof m.opacity === "number" ? m.opacity : undefined

      if (m.type === "bar") {
        series.push({
          ...common,
          type: "bar",
          data: points.map(perPoint),
          itemStyle: { color: baseColor, borderRadius: [3, 3, 0, 0], ...(opacity !== undefined ? { opacity } : {}) },
          barMaxWidth: 42,
        })
      } else if (m.type === "line" || m.type === "area") {
        const isArea = m.type === "area"
        series.push({
          ...common,
          type: "line",
          data: points.map(perPoint),
          smooth: false,
          symbol: "circle",
          symbolSize: isArea ? 0 : 5,
          lineStyle: {
            width: typeof m.strokeWidth === "number" ? m.strokeWidth : 2,
            color: baseColor,
            ...(opacity !== undefined ? { opacity } : {}),
          },
          ...(isArea ? { areaStyle: { color: baseColor, opacity: 0.18 } } : {}),
        })
      } else if (m.type === "dot") {
        series.push({
          ...common,
          type: "scatter",
          symbol: typeof m.symbol === "string" ? m.symbol : "circle",
          data: points.map(perPoint),
          symbolSize: typeof radius === "number" ? radius * 2 + 2 : 9,
          itemStyle: {
            color: baseColor,
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
        // `image://` : ECharts dessine l'image dans le cadre `symbolSize` (l'aspect est
        // conservé via `symbolKeepAspect`). `opacity` par défaut à 1 : la valeur 0.8 de
        // `scatter` délave les images.
        series.push({
          ...common,
          type: "scatter",
          ...(constantSrc ? { symbol: `image://${constantSrc}` } : {}),
          symbolKeepAspect: true,
          ...(typeof rotate0 === "number" ? { symbolRotate: rotate0 } : {}),
          data: points.map(perPoint),
          symbolSize: imageSize,
          itemStyle: { opacity: opacity ?? 1 },
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
  const legendOn = config.legend === false ? false : config.legend === true || series.some((s) => !!s.name)
  const legendConfig: QChartLegend = typeof config.legend === "object" && config.legend !== null ? config.legend : {}
  const legendPosition = legendConfig.position ?? "top"
  const legendGap = typeof legendConfig.offset === "number" ? legendConfig.offset : 12
  const legendAlign = legendConfig.align === "center" ? "center" : legendConfig.align === "end" ? "right" : 0
  /** Hauteur d'une entrée de légende (itemHeight 10 + respiration) */
  const LEGEND_LINE = 14
  /** Largeur réservée à une légende verticale (gauche / droite) */
  const LEGEND_COLUMN = 90
  const legendTop = config.title ? 26 : 0
  const legendTopBand = legendOn && legendPosition === "top" ? legendTop + LEGEND_LINE + legendGap : 0
  /** Place sous le graphique quand une échelle de couleurs est visible (`heatmap`) */
  const scaleBand = visualMaps.some((vm) => vm.show !== false) ? 30 : 0
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
  const gridBox = {
    left: 8 + (legendOn && legendPosition === "left" ? LEGEND_COLUMN + legendGap : 0),
    right: 16 + (legendOn && legendPosition === "right" ? LEGEND_COLUMN + legendGap : 0),
    top: legendTopBand > 0 ? legendTopBand : config.title ? 44 : 16,
    bottom: 8 + scaleBand + (legendOn && legendPosition === "bottom" ? LEGEND_LINE + legendGap : 0),
    containLabel: true,
  }

  const axisLabel = { color: theme.muted }
  const axisLine = { lineStyle: { color: theme.grid } }

  const hasHeatmap = series.some((s) => s.type === "heatmap")
  const categoryAxis = (axis: QChartAxis | undefined, data: string[] = categories, heat = false) => ({
    type: "category",
    data,
    name: axis?.label,
    nameTextStyle: axisLabel,
    axisLabel: { ...axisLabel, hideOverlap: true },
    axisLine,
    axisTick: { show: false },
    splitLine: { show: false },
    // Carte de chaleur : quadrillage des cases
    ...(heat ? { splitArea: { show: true } } : {}),
    boundaryGap: hasHeatmap || series.some((s) => s.type === "bar"),
  })
  const valueAxis = (axis: QChartAxis | undefined, zero: boolean) => ({
    type: axis?.type === "log" ? "log" : "value",
    name: axis?.label,
    nameTextStyle: axisLabel,
    min: axis?.min ?? (zero ? 0 : undefined),
    max: axis?.max,
    axisLabel,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: axis?.grid ?? true, lineStyle: { color: theme.grid } },
  })

  // Orientation horizontale : catégories sur l'axe Y
  const hasBar = series.some((s) => s.type === "bar")
  const xAxis = hasHeatmap
    ? categoryAxis(config.x, categories, true)
    : horizontal
      ? valueAxis(config.x, hasBar)
      : axisType === "category"
        ? categoryAxis(config.x)
        : valueAxis(config.x, false)
  const yAxis = hasHeatmap
    ? categoryAxis(config.y, rowCategories, true)
    : horizontal
      ? axisType === "category"
        ? categoryAxis(config.y)
        : valueAxis(config.y, false)
      : valueAxis(config.y, hasBar)

  // Familles **hors axes** (`pie` seul) : ni grid ni xAxis/yAxis — sinon ECharts laisse
  // un cadre fantôme et décale le titre.
  const cartesian = series.some(
    (s) => s.type === "bar" || s.type === "line" || s.type === "scatter" || s.type === "heatmap",
  )

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
    ...(visualMaps.length ? { visualMap: visualMaps } : {}),
    tooltip:
      config.tooltip === false
        ? { show: false }
        : {
            // `axis` : comparer les séries le long de l'axe (line/bar…). `item` : le
            // graphique n'a que des points/étiquettes/parts — sinon le `title` d'un point
            // n'est jamais affiché.
            trigger: series.some((s) => s.type === "bar" || s.type === "line") ? "axis" : "item",
            confine: true,
            ...tooltipStyle(theme),
          },
    legend: legendOption,
    color: palette,
    series,
  }

  return { ...option, ...(config.options ?? {}) }
}
