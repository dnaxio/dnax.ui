// Tests des extensions **BI / PKI** de `<q-chart>` (P0 + P1) :
// formats Intl, empilement 100 %, barres flottantes, axe secondaire, étiquettes, bandes de
// seuil, seuils de couleur, table triable/paginée, mode compact, info-bulle personnalisée,
// et les marques hors axes (jauge, entonnoir, radar, treemap, sunburst, sankey, boxplot,
// histogramme, cascade).
//
// Aucun navigateur : les options sont inspectées directement, et chaque nouvelle famille est
// rendue en **SVG SSR** (la technique validée dans `chart.axis.test.ts`).
import { describe, expect, it } from "bun:test"
import * as echarts from "echarts"
import { MARK_OPTIONS, chartToECharts, tableCsv, tableModel } from "./chart"
import type { QChartConfig, QChartMark } from "./chart"
import { formatValue, timeTickFormatter } from "./chartFormat"
import { boxStats, histogram, linearFit, percentShares, waterfallSteps } from "./chartStats"

const THEME = { text: "#111111", muted: "#666666", grid: "#e5e5e5" }
const option = (marks: QChartMark[], rest: Partial<QChartConfig> = {}) =>
  chartToECharts({
    marks,
    theme: THEME,
    tokens: { primary: "#1976d2" },
    ...rest,
  })

/** Intl utilise des espaces insécables (fines) : les tests comparent des espaces normaux */
const plain = (s: string) => s.replace(/[\u00a0\u202f]/g, " ")

const monthly = [
  { month: "Jan", revenue: 42, cost: 28 },
  { month: "Feb", revenue: 51, cost: 31 },
  { month: "Mar", revenue: 47, cost: 30 },
]
const bar = (rest: Partial<QChartMark> = {}): QChartMark => ({
  type: "bar",
  data: monthly,
  x: "month",
  y: "revenue",
  ...rest,
})

/** Rend une option en SVG via le SSR d'ECharts (contrôle de bout en bout, sans navigateur). */
const renderSvg = (config: QChartConfig) => {
  const chart = echarts.init(null as any, null, { renderer: "svg", ssr: true, width: 480, height: 300 })
  chart.setOption(chartToECharts({ theme: THEME, tokens: { primary: "#1976d2" }, ...config }))
  const svg = chart.renderToSVGString()
  chart.dispose()
  return svg
}

describe("formatage des valeurs (Intl)", () => {
  it("n'applique **aucun** format sans demande explicite", () => {
    expect(formatValue(42)).toBe("42")
    expect(formatValue("Jan")).toBe("Jan")
    expect(formatValue(null, "compact")).toBe("")
    expect(formatValue(undefined, "percent")).toBe("")
  })

  it("nombres, compact, pourcentage et devise (fr-FR)", () => {
    const fr = { locale: "fr-FR" }
    expect(plain(formatValue(1234.5, "number", fr))).toBe("1 234,5")
    expect(plain(formatValue(1_234_567, "compact", fr))).toBe("1,2 M")
    // `percent` attend une valeur **déjà en pourcentage** : 42 → 42 %
    expect(plain(formatValue(42, "percent", fr))).toBe("42 %")
    expect(formatValue(42, "percent", { locale: "en-US" })).toBe("42%")
    expect(plain(formatValue(1234, "currency", fr))).toContain("F CFA")
    expect(plain(formatValue(12, { style: "number", suffix: " €" }, fr))).toBe("12 €")
  })

  it("dates : Date, timestamp (s et ms), chaîne ISO, et fuseau horaire", () => {
    expect(formatValue("2024-03-05", { style: "date", locale: "fr-FR" })).toBe("5 mars 2024")
    expect(formatValue(new Date("2024-03-05T00:00:00Z"), { style: "date", locale: "fr-FR" })).toBe(
      "5 mars 2024",
    )
    // timestamp en secondes (API usuelles) et en millisecondes
    expect(formatValue(1_709_596_800, { style: "date", locale: "fr-FR" })).toBe("5 mars 2024")
    expect(formatValue(1_709_596_800_000, { style: "date", locale: "fr-FR" })).toBe("5 mars 2024")
    expect(formatValue("2024-03-05T10:30:00Z", { style: "time", locale: "fr-FR", timeZone: "UTC" })).toBe("10:30")
  })

  it("accepte une fonction, et les propriétés non numériques telles quelles", () => {
    expect(formatValue(3, (v) => `#${v}`)).toBe("#3")
    expect(formatValue("N/A", "compact")).toBe("N/A")
  })

  it("granularité d'un axe temporel", () => {
    const ts = Date.parse("2024-03-05T00:00:00Z")
    expect(timeTickFormatter("auto")).toBeUndefined()
    expect(timeTickFormatter("year", "fr-FR")!(ts)).toBe("2024")
    expect(timeTickFormatter("quarter", "fr-FR")!(ts)).toBe("T1 24")
    const month = timeTickFormatter("month", "fr-FR")!(ts)
    expect(month).toBe(new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" }).format(ts))
  })
})

describe("statistiques (histogram, boîte, tendance, cascade)", () => {
  it("histogramme : tranches propres, somme des effectifs = valeurs", () => {
    const values = [1, 2, 2, 3, 5, 8, 8, 13, 21, 34]
    const bins = histogram(values, { bins: 5 })
    expect(bins.length).toBe(5)
    expect(bins.reduce((s, b) => s + b.count, 0)).toBe(values.length)
    expect(bins[0]!.x0).toBeLessThanOrEqual(1)
    expect(bins[bins.length - 1]!.x1).toBeGreaterThanOrEqual(34)
    // une seule valeur → une tranche
    expect(histogram([7]).length).toBe(1)
    // domaine forcé
    const forced = histogram([1, 2, 3], { bins: 2, domain: [0, 10] })
    expect(forced[0]!.x0).toBe(0)
    expect(forced[forced.length - 1]!.x1).toBe(10)
    expect(histogram([])).toEqual([])
  })

  it("cinq nombres et quantiles (R-7)", () => {
    expect(boxStats([1, 2, 3, 4, 5])).toEqual({ min: 1, q1: 2, median: 3, q3: 4, max: 5 })
    expect(boxStats([])).toBeUndefined()
  })

  it("régression linéaire", () => {
    expect(linearFit([[0, 1], [1, 3], [2, 5]])).toEqual({ slope: 2, intercept: 1 })
    expect(linearFit([[1, 1], [1, 2]])).toBeUndefined()
    expect(linearFit([[1, 1]])).toBeUndefined()
  })

  it("cascade : cumul et lignes de total", () => {
    const steps = waterfallSteps([10, -3, 5, 0], [false, false, false, true])
    expect(steps.map((s) => [s.base, s.delta, s.total, s.totalRow])).toEqual([
      [0, 10, 10, false],
      [10, -3, 7, false],
      [7, 5, 12, false],
      [0, 12, 12, true],
    ])
  })

  it("parts en pourcentage", () => {
    expect(percentShares([25, 75])).toEqual([25, 75])
    expect(percentShares([0, 0])).toEqual([0, 0])
  })
})

describe("axe secondaire (`yRight`)", () => {
  it("second axe Y et `yAxisIndex` sur la marque visée", () => {
    const chart = option(
      [
        { type: "bar", data: monthly, x: "month", y: "cost", name: "Cost" },
        { type: "line", data: monthly, x: "month", y: "revenue", yAxis: "right", name: "Revenue" },
      ],
      { yRight: { label: "Revenue" } },
    )
    expect(Array.isArray(chart.yAxis)).toBe(true)
    expect(chart.yAxis.length).toBe(2)
    expect(chart.yAxis[0].min).toBe(0) // barres → axe gauche à zéro
    expect(chart.yAxis[1].name).toBe("Revenue")
    expect(chart.series[0].yAxisIndex).toBeUndefined()
    expect(chart.series[1].yAxisIndex).toBe(1)
    // la place de l'axe de droite est réservée
    expect(chart.grid.right).toBeGreaterThan(16)
  })

  it("sans marque à droite : un seul axe (objet, pas un tableau)", () => {
    const chart = option([bar()])
    expect(Array.isArray(chart.yAxis)).toBe(false)
  })
})

describe("empilement 100 % (`stack: 'percent'`)", () => {
  it("normalise chaque catégorie et partage le groupe d'empilement", () => {
    const rows = [
      { month: "Jan", a: 30, b: 90 },
      { month: "Feb", a: 10, b: 30 },
    ]
    const chart = option(
      [
        { type: "bar", data: rows, x: "month", y: "a", stack: "percent", name: "A" },
        { type: "bar", data: rows, x: "month", y: "b", stack: "percent", name: "B" },
      ],
      { x: { type: "band" } },
    )
    expect(chart.series[0].stack).toBe("total")
    expect(chart.series[1].stack).toBe("total")
    expect(chart.series[0].data.map((d: any) => d.value)).toEqual([
      ["Jan", 25],
      ["Feb", 25],
    ])
    expect(chart.series[1].data.map((d: any) => d.value)).toEqual([
      ["Jan", 75],
      ["Feb", 75],
    ])
  })

  it("un groupe nommé n'est pas normalisé, `percent` l'est", () => {
    const rows = [{ month: "Jan", a: 1, b: 1 }]
    const chart = option(
      [
        { type: "bar", data: rows, x: "month", y: "a", stack: "volume" },
        { type: "bar", data: rows, x: "month", y: "b", stack: "volume" },
      ],
      { x: { type: "band" } },
    )
    expect(chart.series[0].data[0].value).toEqual(["Jan", 1])
    expect(chart.series[0].stack).toBe("volume")
  })
})

describe("barres flottantes (`base`)", () => {
  const rows = [{ month: "Jan", low: 10, high: 25 }]
  const chart = option([{ type: "bar", data: rows, x: "month", y: "high", base: "low" }], {
    x: { type: "band" },
  })

  it("deux séries empilées : base invisible + segment", () => {
    expect(chart.series.length).toBe(2)
    expect(chart.series[0].itemStyle.color).toBe("transparent")
    expect(chart.series[0].silent).toBe(true)
    expect(chart.series[0].data[0].value).toEqual(["Jan", 10])
    expect(chart.series[1].data[0].value).toEqual(["Jan", 15]) // 25 − 10
    expect(chart.series[0].stack).toBe(chart.series[1].stack)
  })

  it("`baseFill` colore la base, et reste hors légende", () => {
    const colored = option(
      [{ type: "bar", data: rows, x: "month", y: "high", base: "low", baseFill: "primary", name: "Budget" }],
      { x: { type: "band" } },
    )
    expect(colored.series[0].itemStyle.color).toBe("#1976d2")
    expect(colored.series[0].name).toBeUndefined()
  })
})

describe("étiquettes de données (`labels`)", () => {
  it("affiche la valeur (formatée si besoin), à la position demandée", () => {
    const chart = option([bar({ labels: true, labelPosition: "bottom" })])
    expect(chart.series[0].label).toMatchObject({ show: true, position: "bottom", formatter: "{c}" })
    const formatted = option([bar({ labels: true, labelFormat: "compact" })], { locale: "fr-FR" })
    const formatter = formatted.series[0].label.formatter as (p: any) => string
    expect(plain(formatter({ value: ["Jan", 1_200_000] }))).toBe("1,2 M")
  })

  it("`percent` calcule la part de la catégorie dans le graphique", () => {
    const rows = [
      { month: "Jan", a: 30, b: 10 },
      { month: "Feb", a: 20, b: 20 },
    ]
    const chart = option(
      [
        { type: "bar", data: rows, x: "month", y: "a", name: "A", labels: "percent", labelFormat: "percent" },
        { type: "bar", data: rows, x: "month", y: "b", name: "B" },
      ],
      { x: { type: "band" } },
    )
    const formatter = chart.series[0].label.formatter as (p: any) => string
    expect(plain(formatter({ value: ["Jan", 30] }))).toBe("75 %")
  })

  it("`labels: 'name'` affiche la catégorie", () => {
    expect(option([bar({ labels: "name" })]).series[0].label.formatter).toBe("{b}")
  })

  it("les étiquettes sont une option de `bar`, `line` et `area`", () => {
    for (const type of ["bar", "line", "area"] as const) {
      expect(MARK_OPTIONS[type]).toContain("labels")
    }
  })
})

describe("bandes de seuil (`band`) et repères annotés", () => {
  it("`band` → markArea (y0 → y1), couleur et libellé", () => {
    const chart = option([
      bar(),
      { type: "band", y0: 40, y1: 60, fill: "warning", label: "Zone cible", labelPosition: "insideBottom" },
    ])
    const area = chart.series[0].markArea.data[0]
    expect(area[1]).toEqual({ yAxis: 60 })
    expect(area[0].yAxis).toBe(40)
    expect(area[0].itemStyle.color).toBe("#f2c037")
    expect(area[0].label).toMatchObject({ show: true, formatter: "Zone cible", position: "insideBottom" })
  })

  it("`band` verticale (`x0` / `x1`)", () => {
    const chart = option([bar(), { type: "band", x0: "Jan", x1: "Feb", fill: "primary" }])
    expect(chart.series[0].markArea.data[0][0].xAxis).toBe("Jan")
    expect(chart.series[0].markArea.data[0][1].xAxis).toBe("Feb")
  })

  it("`rule` accepte un libellé", () => {
    const chart = option([bar(), { type: "rule", y: [50], label: "Objectif" }])
    expect(chart.series[0].markLine.data[0].label).toMatchObject({ show: true, formatter: "Objectif" })
  })
})

describe("seuils de couleur (`thresholds`)", () => {
  const rows = [
    { month: "Jan", v: 5 },
    { month: "Feb", v: 15 },
  ]
  it("colore le point selon la première règle qui matche", () => {
    const chart = option([
      { type: "bar", data: rows, x: "month", y: "v", thresholds: [{ value: 10, color: "negative" }] },
    ])
    expect(chart.series[0].data[0].itemStyle).toBeUndefined()
    expect(chart.series[0].data[1].itemStyle.color).toBe("#c10015")
  })

  it("respecte l'opérateur (`lte`, `eq`, `neq`)", () => {
    const low = option([
      { type: "dot", data: rows, x: "month", y: "v", thresholds: [{ value: 10, op: "lte", color: "positive" }] },
    ])
    expect(low.series[0].data[0].itemStyle.color).toBe("#21ba45")
    const neq = option([
      { type: "dot", data: rows, x: "month", y: "v", thresholds: [{ value: 10, op: "neq", color: "primary" }] },
    ])
    expect(neq.series[0].data.every((d: any) => d.itemStyle?.color === "#1976d2")).toBe(true)
  })
})

describe("données manquantes et tendance", () => {
  it("un `null` coupe la ligne, `connectNulls` la relie", () => {
    const data = [
      { month: "Jan", v: 1 },
      { month: "Feb", v: null },
      { month: "Mar", v: 3 },
    ]
    const chart = option([{ type: "line", data, x: "month", y: "v", connectNulls: true }])
    expect(chart.series[0].connectNulls).toBe(true)
    expect(chart.series[0].data.map((d: any) => d.value)).toEqual([
      ["Jan", 1],
      ["Feb", null],
      ["Mar", 3],
    ])
  })

  it("`trend` ajoute une droite de régression (deux points, hors légende)", () => {
    const chart = option([
      {
        type: "dot",
        data: [
          { x: 1, y: 2 },
          { x: 2, y: 4 },
          { x: 3, y: 6 },
        ],
        x: "x",
        y: "y",
        trend: true,
      },
    ])
    const trend = chart.series.find((s: any) => s.__trend)
    expect(trend).toBeDefined()
    expect(trend.data.length).toBe(2)
    expect(trend.data[0].value).toEqual([1, 2])
    expect(trend.data[1].value).toEqual([3, 6])
  })

  it("`fill` numérique d'un `dot` → échelle de couleurs dédiée", () => {
    const chart = option([
      {
        type: "dot",
        data: [
          { x: 1, y: 2, v: 10 },
          { x: 2, y: 3, v: 30 },
        ],
        x: "x",
        y: "y",
        fill: "v",
      },
    ])
    expect(chart.visualMap.length).toBe(1)
    expect(chart.visualMap[0]).toMatchObject({ seriesIndex: 0, dimension: 2, min: 10, max: 30, show: false })
    // la valeur de couleur voyage en 3ᵉ dimension du point
    expect(chart.series[0].data[0].value).toEqual([1, 2, 10])
  })
})

describe("format des axes et axe temporel", () => {
  it("`y.format` devient `axisLabel.formatter`", () => {
    const chart = option([bar()], { y: { format: "compact" }, locale: "fr-FR" })
    const formatter = chart.yAxis.axisLabel.formatter as (v: number) => string
    expect(plain(formatter(1_200_000))).toBe("1,2 M")
  })

  it("rotation, intervalle et nombre de graduations", () => {
    const chart = option([bar()], {
      x: { type: "band", labelRotate: -35, interval: 0 },
      y: { splitNumber: 4 },
    })
    expect(chart.xAxis.axisLabel.rotate).toBe(-35)
    expect(chart.xAxis.axisLabel.interval).toBe(0)
    expect(chart.yAxis.splitNumber).toBe(4)
  })

  it("axe temporel : type `time` et libellés par granularité", () => {
    const data = [
      { day: "2024-01-01", v: 1 },
      { day: "2024-02-01", v: 2 },
    ]
    const chart = option([{ type: "line", data, x: "day", y: "v" }], {
      x: { type: "time", timeUnit: "month" },
    })
    expect(chart.xAxis.type).toBe("time")
    const formatter = chart.xAxis.axisLabel.formatter as (v: number) => string
    expect(formatter(Date.parse("2024-01-01"))).toBe(
      new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" }).format(Date.parse("2024-01-01")),
    )
  })
})

describe("info-bulle personnalisable", () => {
  it("`valueFormatter` construit un formateur d'axe", () => {
    const chart = option([bar({ name: "Revenue" })], { tooltip: { valueFormatter: (v) => `${v} €` } })
    expect(typeof chart.tooltip.formatter).toBe("function")
    const html = chart.tooltip.formatter([
      { seriesName: "Revenue", value: ["Jan", 42], marker: "●", axisValueLabel: "Jan" },
    ])
    expect(html).toContain("Revenue: 42 €")
  })

  it("`sortDesc` trie les séries, `formatter` global gagne", () => {
    const chart = option([bar({ name: "Revenue" })], {
      tooltip: {
        sortDesc: true,
        valueFormatter: (v) => String(v),
        formatter: (params: any) => `custom:${params[0].seriesName}`,
      },
    })
    expect(typeof chart.tooltip.formatter).toBe("function")
    expect(chart.tooltip.formatter([{ seriesName: "Revenue" }])).toBe("custom:Revenue")
    const sorted = option([bar({ name: "Revenue" })], { tooltip: { sortDesc: true } })
    const html = sorted.tooltip.formatter([
      { seriesName: "A", value: ["Jan", 1], axisValueLabel: "Jan" },
      { seriesName: "B", value: ["Jan", 9], axisValueLabel: "Jan" },
    ])
    expect(html.indexOf("B: 9")).toBeLessThan(html.indexOf("A: 1"))
  })

  it("un formateur **par marque** reçoit la valeur brute", () => {
    const chart = option([
      bar({ tooltip: (_p: any, value: any) => `prix ${value}` }),
    ])
    const html = chart.series[0].tooltip.formatter({ value: ["Jan", 42] })
    expect(html).toBe("prix 42")
  })
})

describe("mode compact (mini-widget)", () => {
  it("masque la légende, les graduations et réduit le cadre", () => {
    const chart = option([bar({ name: "Revenue" })], { compact: true, title: "Mini", x: { label: "Month" } })
    expect(chart.legend).toEqual({ show: false })
    expect(chart.xAxis.axisLabel.show).toBe(false)
    expect(chart.yAxis.axisLabel.show).toBe(false)
    expect(chart.xAxis.name).toBeUndefined()
    expect(chart.grid).toMatchObject({ left: 2, right: 2, bottom: 2, containLabel: true })
  })

  it("une grille explicitement demandée reste visible", () => {
    const chart = option([bar()], { compact: true, y: { grid: true } })
    expect(chart.yAxis.splitLine.show).toBe(true)
  })
})

describe("table BI : tri, pagination, totaux, CSV", () => {
  const rows = [
    { month: "Jan", revenue: 30 },
    { month: "Feb", revenue: 10 },
    { month: "Mar", revenue: 20 },
  ]
  const mark: QChartMark = { type: "table", data: rows }

  it("tri croissant puis décroissant (sans muter les données)", () => {
    const asc = tableModel(mark, null, "filter", { sortBy: "revenue" })
    expect(asc.rows.map((r) => r.month)).toEqual(["Feb", "Mar", "Jan"])
    expect(asc.sortBy).toBe("revenue")
    expect(asc.sortDesc).toBe(false)
    const desc = tableModel(mark, null, "filter", { sortBy: "revenue", sortDesc: true })
    expect(desc.rows.map((r) => r.month)).toEqual(["Jan", "Mar", "Feb"])
    // l'ordre d'origine n'est pas modifié
    expect(rows.map((r) => r.month)).toEqual(["Jan", "Feb", "Mar"])
  })

  it("tri initial porté par la marque, pagination et pages", () => {
    const paged: QChartMark = { ...mark, sortBy: "revenue", pageSize: 2 }
    const first = tableModel(paged)
    expect(first.rows.map((r) => r.month)).toEqual(["Feb", "Mar"])
    expect(first).toMatchObject({ page: 0, pages: 2, pageSize: 2 })
    expect(first.allRows?.length).toBe(3)
    const second = tableModel(paged, null, "filter", { page: 1 })
    expect(second.rows.map((r) => r.month)).toEqual(["Jan"])
    // page hors bornes → dernière page
    expect(tableModel(paged, null, "filter", { page: 9 }).page).toBe(1)
  })

  it("ligne de totaux (agrégats automatiques + libellé)", () => {
    const withTotals: QChartMark = { ...mark, totals: { label: "Total" } }
    const model = tableModel(withTotals)
    expect(model.totals).toEqual({ month: "Total", revenue: "60" })
    const counted: QChartMark = {
      ...mark,
      totals: true,
      columns: [
        { field: "month", label: "Mois" },
        { field: "revenue", summary: "avg" },
      ],
    }
    expect(tableModel(counted).totals?.revenue).toBe("20")
  })

  it("export CSV : en-têtes, échappement, toutes les lignes, totaux optionnels", () => {
    const model = tableModel({ ...mark, pageSize: 1, totals: true })
    const csv = tableCsv(model, { label: "Total" })
    const lines = csv.split("\r\n")
    expect(lines[0]).toBe("month,revenue")
    expect(lines.length).toBe(1 + 3 + 1) // en-tête + toutes les lignes + total
    expect(lines[lines.length - 1]).toBe("Total,60")
    // guillemets et séparateurs échappés
    const tricky = tableModel({ type: "table", data: [{ a: 'x,"y"', b: 1 }] })
    expect(tableCsv(tricky).split("\r\n")[1]).toBe('"x,""y""",1')
  })

  it("les options de table sont déclarées dans MARK_OPTIONS", () => {
    expect(MARK_OPTIONS.table).toEqual([
      "data",
      "link",
      "columns",
      "separator",
      "sortBy",
      "sortDesc",
      "pageSize",
      "page",
      "totals",
    ])
  })
})

describe("marques P1 : forme de l'option", () => {
  it("gauge : valeur, plages et cible", () => {
    const chart = option([
      {
        type: "gauge",
        data: [{ label: "Uptime", value: 72 }],
        x: "label",
        y: "value",
        min: 0,
        max: 100,
        target: 90,
        unit: "%",
        bands: [
          { to: 50, color: "negative" },
          { to: 80, color: "warning" },
          { to: 100, color: "positive" },
        ],
      },
    ])
    const gauge = chart.series[0]
    expect(gauge.type).toBe("gauge")
    expect(gauge.min).toBe(0)
    expect(gauge.max).toBe(100)
    expect(gauge.data[0]).toMatchObject({ name: "Uptime", value: 72 })
    // plages converties en fractions 0→1
    expect(gauge.axisLine.lineStyle.color).toEqual([
      [0, "#c10015"],
      [0.5, "#c10015"],
      [0.8, "#f2c037"],
      [1, "#21ba45"],
    ])
    expect(plain(gauge.detail.formatter(72))).toBe("72 %\nCible 90 %")
  })

  it("funnel : une part par ligne", () => {
    const chart = option([
      { type: "funnel", data: monthly, x: "month", y: "revenue", name: "Pipeline" },
    ])
    expect(chart.series[0].type).toBe("funnel")
    expect(chart.series[0].data.map((d: any) => d.name)).toEqual(["Jan", "Feb", "Mar"])
  })

  it("radar : indicateurs déduits de `x`, une série par `z`", () => {
    const rows = [
      { skill: "Speed", team: "A", value: 8 },
      { skill: "Power", team: "A", value: 6 },
      { skill: "Speed", team: "B", value: 5 },
      { skill: "Power", team: "B", value: 9 },
    ]
    const chart = option([{ type: "radar", data: rows, x: "skill", y: "value", z: "team" }])
    expect(chart.radar.indicator.map((i: any) => i.name)).toEqual(["Speed", "Power"])
    expect(chart.series[0].type).toBe("radar")
    expect(chart.series[0].data.map((d: any) => [d.name, d.value])).toEqual([
      ["A", [8, 6]],
      ["B", [5, 9]],
    ])
  })

  it("treemap / sunburst : hiérarchie par `parent`", () => {
    const rows = [
      { name: "Europe", parent: "", value: 0 },
      { name: "France", parent: "Europe", value: 40 },
      { name: "Spain", parent: "Europe", value: 30 },
      { name: "Asia", parent: "", value: 0 },
      { name: "Japan", parent: "Asia", value: 20 },
    ]
    const tree = option([{ type: "treemap", data: rows, x: "name", parent: "parent", value: "value" }])
    expect(tree.series[0].type).toBe("treemap")
    expect(tree.series[0].data.map((d: any) => d.name)).toEqual(["Europe", "Asia"])
    expect(tree.series[0].data[0].children.map((c: any) => c.name)).toEqual(["France", "Spain"])
    const sun = option([{ type: "sunburst", data: rows, x: "name", parent: "parent", value: "value" }])
    expect(sun.series[0].type).toBe("sunburst")
    expect(sun.series[0].radius).toEqual(["15%", "90%"])
  })

  it("sankey : nœuds déduits des liens", () => {
    const chart = option([
      {
        type: "sankey",
        data: [
          { source: "Visite", target: "Panier", value: 40 },
          { source: "Panier", target: "Achat", value: 12 },
        ],
      },
    ])
    expect(chart.series[0].links).toHaveLength(2)
    expect(chart.series[0].data.map((d: any) => d.name)).toEqual(["Visite", "Panier", "Achat"])
  })

  it("boxplot : cinq nombres depuis des valeurs brutes ou précalculées", () => {
    const raw = [
      { team: "A", scores: [1, 2, 3, 4, 5] },
      { team: "B", scores: [2, 2, 3, 3, 4] },
    ]
    const chart = option([{ type: "boxplot", data: raw, x: "team", values: "scores", name: "Scores" }])
    expect(chart.series[0].type).toBe("boxplot")
    expect(chart.series[0].data[0].value).toEqual([1, 2, 3, 4, 5])
    const stats = option([
      {
        type: "boxplot",
        data: [{ team: "A", s: [1, 2, 3, 4, 9] }],
        x: "team",
        stats: "s",
      },
    ])
    expect(stats.series[0].data[0].value).toEqual([1, 2, 3, 4, 9])
  })

  it("histogramme : catégories = tranches, barres = effectifs", () => {
    const chart = option([
      { type: "histogram", data: [1, 2, 2, 3, 5, 8, 8, 13], x: (d: any) => d, bins: 4 },
    ])
    expect(chart.series[0].type).toBe("bar")
    expect(chart.xAxis.type).toBe("category")
    expect(chart.xAxis.data.length).toBe(chart.series[0].data.length)
    expect(chart.series[0].data.reduce((s: number, d: any) => s + d.value, 0)).toBe(8)
  })

  it("heatmap : une valeur manquante laisse la case vide", () => {
    const chart = option([
      {
        type: "heatmap",
        data: [
          { hour: "9h", day: "Mon", v: 1 },
          { hour: "12h", day: "Mon", v: null },
        ],
        x: "hour",
        y: "day",
        fill: "v",
      },
    ])
    expect(chart.series[0].data[1].itemStyle).toEqual({ opacity: 0 })
    expect(Number.isNaN(chart.series[0].data[1].value[2])).toBe(true)
  })

  it("cascade : barres flottantes, totaux et connecteurs", () => {
    const rows = [
      { step: "Start", delta: 100 },
      { step: "Cost", delta: -30 },
      { step: "Total", delta: 0, total: true },
    ]
    const chart = option([
      { type: "waterfall", data: rows, x: "step", y: "delta", isTotal: "total", name: "Waterfall" },
    ])
    const fall = chart.series[0]
    expect(fall.type).toBe("bar")
    expect(fall.data.map((d: any) => d.value)).toEqual([
      [0, 100],
      [70, 100],
      [0, 70],
    ])
    // la perte est colorée avec le token `negative`
    expect(fall.data[1].itemStyle.color).toBe("#c10015")
    expect(fall.markLine.data.length).toBe(2)
  })
})

describe("rendu SVG SSR des nouvelles familles", () => {
  const configs: [string, QChartConfig][] = [
    [
      "yRight + band + labels",
      {
        marks: [
          { type: "bar", data: monthly, x: "month", y: "cost", name: "Cost", labels: true },
          { type: "line", data: monthly, x: "month", y: "revenue", yAxis: "right", name: "Revenue" },
          { type: "band", y0: 40, y1: 60, fill: "warning" },
        ],
        yRight: { label: "Revenue" },
      },
    ],
    [
      "gauge",
      {
        marks: [
          {
            type: "gauge",
            data: [{ label: "Uptime", value: 72 }],
            x: "label",
            y: "value",
            target: 90,
            unit: "%",
          },
        ],
      },
    ],
    [
      "funnel",
      { marks: [{ type: "funnel", data: monthly, x: "month", y: "revenue", labels: true }] },
    ],
    [
      "radar",
      {
        marks: [
          {
            type: "radar",
            data: [
              { skill: "Speed", value: 8 },
              { skill: "Power", value: 6 },
              { skill: "Accuracy", value: 9 },
            ],
            x: "skill",
            y: "value",
          },
        ],
      },
    ],
    [
      "treemap",
      {
        marks: [
          {
            type: "treemap",
            data: [
              { name: "Europe", parent: "", value: 0 },
              { name: "France", parent: "Europe", value: 40 },
            ],
            x: "name",
            parent: "parent",
            value: "value",
          },
        ],
      },
    ],
    [
      "sunburst",
      {
        marks: [
          {
            type: "sunburst",
            data: [
              { name: "Europe", parent: "", value: 0 },
              { name: "France", parent: "Europe", value: 40 },
            ],
            x: "name",
            parent: "parent",
            value: "value",
          },
        ],
      },
    ],
    [
      "sankey",
      {
        marks: [
          {
            type: "sankey",
            data: [
              { source: "Visite", target: "Panier", value: 40 },
              { source: "Panier", target: "Achat", value: 12 },
            ],
          },
        ],
      },
    ],
    [
      "boxplot",
      {
        marks: [
          {
            type: "boxplot",
            data: [
              { team: "A", scores: [1, 2, 3, 4, 5] },
              { team: "B", scores: [2, 2, 3, 3, 4] },
            ],
            x: "team",
            values: "scores",
          },
        ],
      },
    ],
    [
      "histogram",
      { marks: [{ type: "histogram", data: [1, 2, 2, 3, 5, 8, 8, 13], x: (d: any) => d, bins: 4 }] },
    ],
    [
      "waterfall",
      {
        marks: [
          {
            type: "waterfall",
            data: [
              { step: "Start", delta: 100 },
              { step: "Cost", delta: -30 },
              { step: "Total", delta: 0, total: true },
            ],
            x: "step",
            y: "delta",
            isTotal: "total",
            labels: true,
          },
        ],
      },
    ],
    [
      "compact",
      {
        compact: true,
        marks: [{ type: "line", data: monthly, x: "month", y: "revenue" }],
      },
    ],
  ]

  for (const [label, config] of configs) {
    it(`rend « ${label} » sans erreur`, () => {
      const svg = renderSvg(config)
      expect(svg.startsWith("<svg")).toBe(true)
      expect(svg.length).toBeGreaterThan(200)
    })
  }
})
