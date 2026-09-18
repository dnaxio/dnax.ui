// Tests unitaires du traducteur marks → option ECharts (bun test).
// Seule la **marque `text`** est couverte pour l'instant (Plot.text).
import { describe, expect, it } from "bun:test"
import {
  MARK_OPTIONS,
  chartToECharts,
  chartLink,
  legendPickOf,
  linkedRows,
  linkValue,
  nextLegendPick,
  pickFromEvent,
  sameSelection,
  tableModel,
  tableModel,
  textValue,
} from "./chart"
import type { QChartConfig, QChartMark } from "./chart"

/** Option produite par une marque `text` seule, avec un thème minimal */
const option = (marks: QChartMark[], rest: Partial<QChartConfig> = {}) =>
  chartToECharts({
    marks,
    theme: { text: "#111111", muted: "#666666", grid: "#e5e5e5" },
    tokens: { primary: "#1976d2" },
    ...rest,
  })

const labelOf = (marks: QChartMark[]) => {
  const series = option(marks).series.find((s: any) => s.type === "scatter")
  return { series, label: series.label }
}

const rows = [
  { month: "Jan", revenue: 42, city: "Paris" },
  { month: "Feb", revenue: 51, city: "Lyon" },
]

describe("marque `text`", () => {
  it("pose le libellé sur le point (scatter + label), point invisible", () => {
    const { series, label } = labelOf([{ type: "text", data: rows, x: "month", y: "revenue", text: "revenue" }])
    expect(series.type).toBe("scatter")
    expect(series.symbolSize).toBe(1)
    expect(series.itemStyle).toEqual({ color: "transparent", opacity: 1 })
    expect(series.data.map((d: any) => d.label.formatter)).toEqual(["42", "51"])
    // Les points portent les coordonnées attendues
    expect(series.data.map((d: any) => d.value)).toEqual([
      ["Jan", 42],
      ["Feb", 51],
    ])
    expect(label.show).toBe(true)
    expect(label.position).toBe("inside")
  })

  it("centre le texte par défaut (ancres `middle`, comme Plot)", () => {
    const { label } = labelOf([{ type: "text", data: rows, x: "month", y: "revenue", text: "month" }])
    expect(label.align).toBe("center")
    expect(label.verticalAlign).toBe("middle")
    expect(label.fontSize).toBe(11)
    expect(label.offset).toBeUndefined()
    expect(label.rotate).toBeUndefined()
  })

  it("traduit `textAnchor` / `lineAnchor`", () => {
    const at = (textAnchor: any, lineAnchor: any) =>
      labelOf([{ type: "text", data: rows, x: "month", y: "revenue", text: "revenue", textAnchor, lineAnchor }]).label
    expect(at("start", "top")).toMatchObject({ align: "left", verticalAlign: "top" })
    expect(at("middle", "bottom")).toMatchObject({ align: "center", verticalAlign: "bottom" })
    // `center` est accepté comme synonyme de `middle` (Plot écrit `middle`)
    expect(at("center", "middle")).toMatchObject({ align: "center", verticalAlign: "middle" })
    expect(at("end", "middle")).toMatchObject({ align: "right", verticalAlign: "middle" })
  })

  it("décale le libellé avec `dx` / `dy`", () => {
    const { label } = labelOf([
      { type: "text", data: rows, x: "month", y: "revenue", text: "revenue", dx: 6, dy: -8, lineAnchor: "bottom" },
    ])
    expect(label.offset).toEqual([6, -8])
  })

  it("inverse le sens de `rotate` (Plot = horaire, label.rotate = anti-horaire)", () => {
    const { label } = labelOf([{ type: "text", data: rows, x: "month", y: "revenue", text: "revenue", rotate: 90 }])
    expect(label.rotate).toBe(-90)
  })

  it("applique la police et le retour à la ligne", () => {
    const { label } = labelOf([
      {
        type: "text",
        data: rows,
        x: "month",
        y: "revenue",
        text: "theme",
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: "Urbanist",
        fontStyle: "italic",
        lineHeight: 18,
        lineWidth: 10,
      },
    ])
    expect(label).toMatchObject({
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: "Urbanist",
      fontStyle: "italic",
      lineHeight: 18,
      width: 120, // 10 ems × 12 px
      overflow: "break",
    })
  })

  it("tronque avec `textOverflow`", () => {
    const ellipsis = labelOf([
      { type: "text", data: rows, x: "month", y: "revenue", text: "city", lineWidth: 4, textOverflow: "ellipsis" },
    ]).label
    expect(ellipsis).toMatchObject({ overflow: "truncate", ellipsis: "…", width: 44 })
    const clip = labelOf([
      { type: "text", data: rows, x: "month", y: "revenue", text: "city", lineWidth: 4, textOverflow: "clip" },
    ]).label
    expect(clip).toMatchObject({ overflow: "truncate", ellipsis: "" })
  })

  it("colore le texte (`fill`) et dessine un halo (`fill` + `stroke`)", () => {
    const text = labelOf([{ type: "text", data: rows, x: "month", y: "revenue", text: "revenue", fill: "primary" }]).label
    expect(text.color).toBe("#1976d2")
    expect(text.textBorderColor).toBeUndefined()

    // `stroke` seul : colore le texte (comme un `dot`), pas de halo
    const lone = labelOf([{ type: "text", data: rows, x: "month", y: "revenue", text: "revenue", stroke: "#c10015" }]).label
    expect(lone.color).toBe("#c10015")
    expect(lone.textBorderColor).toBeUndefined()

    // `fill` + `stroke` : halo, épaisseur 3 par défaut (Plot) puis `strokeWidth`
    const halo = labelOf([
      { type: "text", data: rows, x: "month", y: "revenue", text: "revenue", fill: "#fff", stroke: "#1d1d1d" },
    ]).label
    expect(halo).toMatchObject({ color: "#fff", textBorderColor: "#1d1d1d", textBorderWidth: 3 })
    const thick = labelOf([
      {
        type: "text",
        data: rows,
        x: "month",
        y: "revenue",
        text: "revenue",
        fill: "#fff",
        stroke: "#1d1d1d",
        strokeWidth: 5,
      },
    ]).label
    expect(thick.textBorderWidth).toBe(5)
  })

  it("résout par point les canaux qui varient (text, fontSize, dx, rotate, fill)", () => {
    const mark: QChartMark = {
      type: "text",
      data: rows,
      x: "month",
      y: "revenue",
      text: "city",
      fontSize: 10,
      dx: 0,
      rotate: 0,
      fill: "primary",
    }
    // Canaux explicites (un tableau de valeurs par ligne)
    const { series } = labelOf([
      {
        ...mark,
        text: ["A", "B"],
        fontSize: [10, 14],
        dx: [0, 4],
        rotate: [0, 30],
        fill: ["primary", "#c10015"],
      },
    ])
    expect(series.data[0].label).toEqual({ formatter: "A" })
    expect(series.data[1].label).toEqual({
      formatter: "B",
      fontSize: 14,
      offset: [4, 0],
      rotate: -30,
      color: "#c10015",
    })
  })

  it("ajoute l'info-bulle par point quand `title` est donné", () => {
    const { series } = labelOf([
      { type: "text", data: rows, x: "month", y: "revenue", text: "revenue", title: "city" },
    ])
    expect(series.data[0].tooltip).toEqual({ formatter: "Paris" })
    expect(series.data[1].tooltip).toEqual({ formatter: "Lyon" })
  })

  it("garde `type: 'text'` dans les types de marque et la légende via `z`", () => {
    const marks: QChartMark[] = [{ type: "text", data: rows, x: "month", y: "revenue", text: "revenue", z: "city" }]
    const chart = option(marks)
    // Une série (et une entrée de légende) par valeur du canal `z`
    expect(chart.series.map((s: any) => s.name)).toEqual(["Paris", "Lyon"])
    expect(chart.series.map((s: any) => s.data.length)).toEqual([1, 1])
    expect(chart.legend.show).not.toBe(false)
    expect(chart.tooltip.trigger).toBe("item")
  })

  it("accepte les données en paires (raccourci Plot, sans `x` ni `y`)", () => {
    const chart = option([{ type: "text", data: [[1, 4], [2, 7]], text: (d: any) => `${d[1]} %` }])
    const series = chart.series[0]
    expect(series.data.map((d: any) => d.value)).toEqual([
      [1, 4],
      [2, 7],
    ])
    expect(series.data.map((d: any) => d.label.formatter)).toEqual(["4 %", "7 %"])
    expect(chart.xAxis.type).toBe("value")
  })
})

describe("marque `pie`", () => {
  const share = [
    { channel: "Online", revenue: 62 },
    { channel: "Store", revenue: 41 },
    { channel: "Partners", revenue: 27 },
  ]

  it("produit une série `pie` — une part par ligne — **sans axes ni grid**", () => {
    const chart = option([{ type: "pie", data: share, x: "channel", y: "revenue" }])
    expect(chart.series.length).toBe(1)
    expect(chart.series[0].type).toBe("pie")
    expect(chart.series[0].data).toEqual([
      { name: "Online", value: 62 },
      { name: "Store", value: 41 },
      { name: "Partners", value: 27 },
    ])
    // Famille hors axes : rien de cartésien dans l'option
    expect(chart.xAxis).toBeUndefined()
    expect(chart.yAxis).toBeUndefined()
    expect(chart.grid).toBeUndefined()
    // Une part se survole à l'unité (tooltip `item`)
    expect(chart.tooltip.trigger).toBe("item")
  })

  it("rayon : `radius` (défaut 70 %) et `innerRadius` → anneau", () => {
    const pie = option([{ type: "pie", data: share, x: "channel", y: "revenue" }]).series[0]
    expect(pie.radius).toBe("70%")
    const donut = option([
      { type: "pie", data: share, x: "channel", y: "revenue", radius: "80%", innerRadius: "50%" },
    ]).series[0]
    expect(donut.radius).toEqual(["50%", "80%"])
    const px = option([{ type: "pie", data: share, x: "channel", y: "revenue", radius: 90 }]).series[0]
    expect(px.radius).toBe(90)
  })

  it("libellés : `name` par défaut, puis `value`/`percent`/`name-value`/`name-percent`/`false`", () => {
    const label = (labels: any) =>
      option([{ type: "pie", data: share, x: "channel", y: "revenue", labels }]).series[0].label
    expect(label(undefined).formatter).toBe("{b}")
    expect(label("value").formatter).toBe("{c}")
    expect(label("percent").formatter).toBe("{d}%")
    expect(label("name-value").formatter).toBe("{b}: {c}")
    expect(label("name-percent").formatter).toBe("{b} {d}%")
    expect(label(false)).toEqual({ show: false })
  })

  it("`startAngle`, `fill` par part, `opacity` et `title`", () => {
    const chart = option([
      {
        type: "pie",
        data: share,
        x: "channel",
        y: "revenue",
        startAngle: 180,
        opacity: 0.9,
        fill: ["primary", "#c10015", "chart-1"],
        title: "revenue",
      },
    ])
    const pie = chart.series[0]
    expect(pie.startAngle).toBe(180)
    expect(pie.data.map((d: any) => d.itemStyle)).toEqual([
      { color: "#1976d2", opacity: 0.9 },
      { color: "#c10015", opacity: 0.9 },
      { color: "#1976d2", opacity: 0.9 }, // `chart-1` → repli Material en l'absence de token
    ])
    expect(pie.data[0].tooltip).toEqual({ formatter: "62" })
  })

  it("sans `fill`, laisse ECharts colorier les parts avec la palette", () => {
    const pie = option([{ type: "pie", data: share, x: "channel", y: "revenue" }]).series[0]
    expect(pie.data.every((d: any) => d.itemStyle === undefined)).toBe(true)
    expect(option([{ type: "pie", data: share, x: "channel", y: "revenue" }]).color[0]).toBeTruthy()
  })

  it("n'ajoute pas de catégories d'axe (les noms de parts ne sont pas des catégories)", () => {
    const chart = option([{ type: "pie", data: share, x: "channel", y: "revenue" }])
    expect(chart.xAxis).toBeUndefined()
    // Un graphique mixte (camembert + barres) garde ses axes
    const mixed = option([
      { type: "pie", data: share, x: "channel", y: "revenue" },
      { type: "bar", data: share, x: "channel", y: "revenue" },
    ])
    expect(mixed.xAxis.type).toBe("category")
    expect(mixed.xAxis.data).toEqual(["Online", "Store", "Partners"])
  })

  it("la légende liste les parts dès que la marque est nommée", () => {
    const chart = option([{ type: "pie", data: share, x: "channel", y: "revenue", name: "Revenue" }])
    expect(chart.series[0].name).toBe("Revenue")
    expect(chart.legend.show).not.toBe(false)
  })
})

describe("marque `heatmap`", () => {
  const grid = [
    { day: "Mon", hour: "9h", temp: 12 },
    { day: "Mon", hour: "12h", temp: 21 },
    { day: "Tue", hour: "9h", temp: 8 },
    { day: "Tue", hour: "12h", temp: 18 },
  ]
  const heat = (marks: QChartMark[]) => option(marks)

  it("deux axes **catégories** (colonnes = `x`, lignes = `y`) et un `visualMap`", () => {
    const chart = heat([{ type: "heatmap", data: grid, x: "hour", y: "day", fill: "temp" }])
    expect(chart.series[0].type).toBe("heatmap")
    // Les cellules portent des **index** (colonne, ligne) et la valeur
    expect(chart.series[0].data).toEqual([
      { name: "Mon · 9h", value: [0, 0, 12] },
      { name: "Mon · 12h", value: [1, 0, 21] },
      { name: "Tue · 9h", value: [0, 1, 8] },
      { name: "Tue · 12h", value: [1, 1, 18] },
    ])
    expect(chart.xAxis).toMatchObject({ type: "category", data: ["9h", "12h"], boundaryGap: true })
    expect(chart.yAxis).toMatchObject({ type: "category", data: ["Mon", "Tue"] })
    expect(chart.xAxis.splitArea).toEqual({ show: true })
    // ECharts exige un visualMap pour une série heatmap : la palette sert de rampe
    expect(chart.visualMap.length).toBe(1)
    expect(chart.visualMap[0]).toMatchObject({ min: 8, max: 21, show: true })
    expect(chart.visualMap[0].inRange.color.length).toBe(6)
    // Il faut de la place sous l'axe pour l'échelle de couleurs
    expect(chart.grid.bottom).toBe(8 + 30)
    expect(chart.tooltip.trigger).toBe("item")
  })

  it("couleur **constante** → toutes les cellules de cette couleur, échelle cachée", () => {
    const chart = heat([{ type: "heatmap", data: grid, x: "hour", y: "day", fill: "primary" }])
    expect(chart.visualMap[0].show).toBe(false)
    expect(chart.visualMap[0].inRange.color).toEqual(["#1976d2", "#1976d2"])
    expect(chart.grid.bottom).toBe(8)
  })

  it("sans `fill`, la première couleur de la palette (échelle cachée)", () => {
    const chart = heat([{ type: "heatmap", data: grid, x: "hour", y: "day" }])
    const first = chart.color[0]
    expect(chart.visualMap[0].show).toBe(false)
    expect(chart.visualMap[0].inRange.color).toEqual([first, first])
  })

  it("`labels: true` imprime la valeur, `title` alimente l'info-bulle, `opacity` s'applique", () => {
    const chart = heat([
      {
        type: "heatmap",
        data: grid,
        x: "hour",
        y: "day",
        fill: "temp",
        labels: true,
        title: "day",
        opacity: 0.8,
        name: "Temperature",
      },
    ])
    expect(chart.series[0].label).toMatchObject({ show: true, formatter: "{@[2]}" })
    expect(chart.series[0].itemStyle).toEqual({ opacity: 0.8 })
    expect(chart.series[0].data[0].tooltip).toEqual({ formatter: "Mon" })
    expect(chart.legend.show).not.toBe(false)
    const noLabels = heat([{ type: "heatmap", data: grid, x: "hour", y: "day", fill: "temp" }])
    expect(noLabels.series[0].label).toBeUndefined()
  })

  it("les lignes et colonnes suivent l'ordre d'apparition des données", () => {
    const chart = heat([
      { type: "heatmap", data: [{ h: "15h", d: "Wed", v: 1 }, { h: "9h", d: "Mon", v: 2 }], x: "h", y: "d", fill: "v" },
    ])
    expect(chart.xAxis.data).toEqual(["15h", "9h"])
    expect(chart.yAxis.data).toEqual(["Wed", "Mon"])
    expect(chart.series[0].data.map((c: any) => c.value)).toEqual([
      [0, 0, 1],
      [1, 1, 2],
    ])
  })
})

describe("légende et grille", () => {
  it("légende : `position`, `offset` et `align` — la place est **réservée** dans le grid", () => {
    const marks: QChartMark[] = [
      { type: "bar", data: rows, x: "month", y: "revenue", fill: "primary", name: "Revenue" },
    ]
    // Défaut : en haut à gauche, marge 24 px
    const byDefault = option(marks)
    expect(byDefault.legend).toMatchObject({ top: 0, left: 0 })
    expect(byDefault.legend.show).toBeUndefined()
    expect(byDefault.grid.top).toBe(14 + 24)
    // Une marge plus grande décale la zone de tracé
    const wide = option(marks, { legend: { offset: 40 } })
    expect(wide.grid.top).toBe(14 + 40)
    // En bas, aligné au centre
    const bottom = option(marks, { legend: { position: "bottom", align: "center", offset: 16 } })
    expect(bottom.legend).toMatchObject({ bottom: 0, left: "center" })
    expect(bottom.grid.bottom).toBe(8 + 14 + 16)
    // À gauche / à droite : légende verticale, colonne réservée
    const left = option(marks, { legend: { position: "left", offset: 20 } })
    expect(left.legend).toMatchObject({ orient: "vertical", left: 0, top: "middle" })
    expect(left.grid.left).toBe(8 + 90 + 20)
    const right = option(marks, { legend: { position: "right" } })
    expect(right.legend).toMatchObject({ orient: "vertical", right: 0, top: "middle" })
    expect(right.grid.right).toBe(16 + 90 + 24)
    // Toujours masquable
    expect(option(marks, { legend: false }).legend).toEqual({ show: false })
    expect(option(marks, { legend: true }).legend.show).toBeUndefined()
  })

  it("titre + légende : le titre garde sa place, la légende passe dessous", () => {
    const chart = option([{ type: "line", data: rows, x: "month", y: "revenue", stroke: "primary", name: "Revenue" }], {
      title: "Revenue",
    })
    expect(chart.legend.top).toBe(26)
    expect(chart.grid.top).toBe(26 + 14 + 24)
  })
})

describe("marque `image`", () => {
  const team = [
    { name: "Amina", src: "https://cdn.test/amina.jpg", x: 1, y: 2 },
    { name: "Dan", src: "https://cdn.test/dan.jpg", x: 3, y: 1 },
  ]

  it("sans `round` : symbole `image://` (constante au niveau de la série, canal par point)", () => {
    const perRow = option([{ type: "image", data: team, x: "x", y: "y", src: "src", r: 18 }]).series[0]
    expect(perRow.symbol).toBeUndefined()
    expect(perRow.symbolKeepAspect).toBe(true)
    expect(perRow.data.map((d: any) => d.symbol)).toEqual([
      "image://https://cdn.test/amina.jpg",
      "image://https://cdn.test/dan.jpg",
    ])
    const constant = option([{ type: "image", data: team, x: "x", y: "y", src: "/logo.svg", r: 10 }]).series[0]
    expect(constant.symbol).toBe("image:///logo.svg")
    expect(constant.data.every((d: any) => d.symbol === undefined)).toBe(true)
  })

  it("`round: true` : symbole `circle` rempli par un **motif** image, par point", () => {
    const chart = option([{ type: "image", data: team, x: "x", y: "y", src: "src", r: 22, round: true }])
    const series = chart.series[0]
    expect(series.symbol).toBe("circle")
    expect(series.symbolKeepAspect).toBeUndefined()
    // 22 → 2r = 44 px de côté
    expect(series.symbolSize).toEqual([44, 44])
    expect(series.data.map((d: any) => d.itemStyle)).toEqual([
      { color: { image: "https://cdn.test/amina.jpg", repeat: "no-repeat" } },
      { color: { image: "https://cdn.test/dan.jpg", repeat: "no-repeat" } },
    ])
    // `opacity` par défaut à 1 (les images ne doivent pas être délavées)
    expect(series.itemStyle.opacity).toBe(1)
  })

  it("`round: true` + `stroke` : un anneau autour de la pastille", () => {
    const chart = option([
      { type: "image", data: team, x: "x", y: "y", src: "src", r: 20, round: true, stroke: "primary" },
    ])
    expect(chart.series[0].itemStyle).toMatchObject({ borderColor: "#1976d2", borderWidth: 2 })
    const thick = option([
      {
        type: "image",
        data: team,
        x: "x",
        y: "y",
        src: "src",
        r: 20,
        round: true,
        stroke: "#fff",
        strokeWidth: 4,
      },
    ])
    expect(thick.series[0].itemStyle).toMatchObject({ borderColor: "#fff", borderWidth: 4 })
  })

  it("`rotate` et `width`/`height` restent appliqués", () => {
    const chart = option([
      { type: "image", data: team, x: "x", y: "y", src: "src", width: 30, height: 20, rotate: 30 },
    ])
    expect(chart.series[0].symbolSize).toEqual([30, 20])
    expect(chart.series[0].symbolRotate).toBe(30)
  })
})

describe("marque `table`", () => {
  const rows = [
    { month: "Jan", revenue: 42 },
    { month: "Feb", revenue: 51 },
  ]
  const mark = { type: "table", data: rows, link: "month" } as any

  it("`filter` (défaut) ne garde que les lignes liées", () => {
    expect(tableModel(mark, { name: "Feb" }).rows).toEqual([rows[1]])
  })

  it("`dim` garde **toutes** les lignes : c'est le rendu qui estompe les autres", () => {
    const t = tableModel(mark, { name: "Feb" }, "dim")
    expect(t.rows.length).toBe(2)
    expect(t.rows[1]).toBe(rows[1]) // mêmes références, aucun clone
  })

  it("sans sélection, `dim` et `filter` rendent la même chose", () => {
    expect(tableModel(mark, null, "dim").rows).toEqual(tableModel(mark, null).rows)
  })

  it("les colonnes sont déduites des lignes quand elles ne sont pas déclarées", () => {
    expect(tableModel(mark, null).columns.map((c) => c.field)).toEqual(["month", "revenue"])
  })

  it("les séparateurs : `horizontal` par défaut, puis `vertical`, `grid`, `none`", () => {
    expect(tableModel(mark, null).separator).toBe("horizontal")
    for (const separator of ["vertical", "grid", "none"] as const) {
      expect(tableModel({ ...mark, separator }, null).separator).toBe(separator)
    }
  })

  it("`separator` est bien une option de la marque `table` (table d'API générée)", () => {
    expect(MARK_OPTIONS.table).toEqual(["data", "link", "columns", "separator"])
  })
})

describe("tooltip par défaut", () => {
  const monthly = [{ month: "Jan", revenue: 42, cost: 28 }]
  const opt = (marks: any[], cfg: any = {}) =>
    option(marks, { x: { type: "band" }, ...cfg } as any)

  it("`axis` pour bar **et** line, avec un pointeur explicite", () => {
    const barChart = opt([{ type: "bar", data: monthly, x: "month", y: "revenue" }])
    expect(barChart.tooltip.trigger).toBe("axis")
    // une barre : bandeau (`shadow`) sous la catégorie survolée
    expect(barChart.tooltip.axisPointer).toEqual({ type: "shadow" })

    const lineChart = opt([{ type: "line", data: monthly, x: "month", y: "revenue" }])
    expect(lineChart.tooltip.trigger).toBe("axis")
    // un trait : curseur vertical
    expect(lineChart.tooltip.axisPointer).toEqual({ type: "line" })
  })

  it("`axis` aussi pour des points seuls (graphique cartésien sans `title`)", () => {
    const chart = opt([{ type: "dot", data: monthly, x: "month", y: "revenue" }])
    expect(chart.series[0].type).toBe("scatter")
    expect(chart.tooltip.trigger).toBe("axis")
    expect(chart.tooltip.axisPointer).toEqual({ type: "line" })
  })

  it("reste en `item` quand l'info est par point ou cellule", () => {
    // un `title` par point ne s'afficherait jamais dans un tooltip d'axe
    expect(opt([{ type: "dot", data: monthly, x: "month", y: "revenue", title: "revenue" }]).tooltip.trigger)
      .toBe("item")
    // graphique d'étiquettes : la donnée est le libellé
    expect(opt([{ type: "text", data: monthly, x: "month", y: "revenue", text: "revenue" }]).tooltip.trigger)
      .toBe("item")
  })

  it("`tooltip: false` éteint tout, pointeur compris", () => {
    const chart = opt([{ type: "bar", data: monthly, x: "month", y: "revenue" }], { tooltip: false })
    expect(chart.tooltip).toEqual({ show: false })
  })
})

describe("lisibilité des axes", () => {
  const monthly = [{ month: "Jan", revenue: 42 }]

  it("les nombres de l'axe des ordonnées respirent (marge > défaut 8)", () => {
    const chart = option([{ type: "bar", data: monthly, x: "month", y: "revenue" }], { x: { type: "band" } })
    expect(chart.yAxis.axisLabel.margin).toBe(16)
    // la place est réservée automatiquement par le moteur
    expect(chart.grid.containLabel).toBe(true)
  })

  it("`margin` est réglable par axe", () => {
    const chart = option([{ type: "bar", data: monthly, x: "month", y: "revenue" }], {
      x: { type: "band" },
      y: { margin: 4 },
    })
    expect(chart.yAxis.axisLabel.margin).toBe(4)
    expect(chart.yAxis.axisLabel.color).toBe("#666666") // le reste du style est conservé
  })
})

describe("mode `dim` : estomper au lieu de retirer", () => {
  const rows = [
    { month: "Jan", revenue: 42, cost: 28 },
    { month: "Feb", revenue: 51, cost: 31 },
  ]
  const bar = (rest: any) =>
    option([{ type: "bar", data: rows, x: "month", y: "revenue", link: "month" }], {
      selection: { name: "Feb" },
      x: { type: "band" },
      ...rest,
    })

  it("garde **toutes** les lignes (le contexte reste lisible)", () => {
    expect(bar({ linkMode: "dim" }).series[0].data).toHaveLength(2)
  })

  it("abaisse l'opacité par défaut et relève la sélection (`select`)", () => {
    const series = bar({ linkMode: "dim" }).series[0]
    expect(series.itemStyle).toMatchObject({ opacity: 0.25 })
    expect(series.selectedMode).toBe("single")
    expect(series.select).toMatchObject({ itemStyle: { opacity: 1 } })
  })

  it("la sélection **annule la bordure** du style `select` par défaut, sans toucher au rayon", () => {
    const series = bar({ linkMode: "dim" }).series[0]
    expect(series.select.itemStyle).toMatchObject({ opacity: 1, borderWidth: 0, borderColor: "transparent" })
    // rayon : laissé tel qu'à l'état initial (aucune surcharge dans le style de sélection)
    expect("borderRadius" in series.select.itemStyle).toBe(false)
  })

  it("l'état estompé ne surcharge que l'opacité (rayon et bordure de la marque intacts)", () => {
    const rounded = option(
      [{ type: "bar", data: rows, x: "month", y: "revenue", link: "month" }],
      { selection: { name: "Feb" }, linkMode: "dim", x: { type: "band" } },
    ).series[0]
    // le rayon des barres vient du traducteur (`[3, 3, 0, 0]`) : il doit survivre à l'estompage
    expect(rounded.itemStyle.borderRadius).toEqual([3, 3, 0, 0])
    expect(rounded.itemStyle.opacity).toBe(0.25)
    expect("borderWidth" in rounded.itemStyle).toBe(false)
  })

  it("`dimOpacity` est configurable", () => {
    expect(bar({ linkMode: "dim", dimOpacity: 0.4 }).series[0].itemStyle).toMatchObject({ opacity: 0.4 })
  })

  it("une ligne est estompée **avec son trait**", () => {
    const chart = option([{ type: "line", data: rows, x: "month", y: "cost", link: "month" }], {
      selection: { name: "Feb" },
      linkMode: "dim",
      x: { type: "band" },
    })
    expect(chart.series[0].lineStyle).toMatchObject({ opacity: 0.25 })
    expect(chart.series[0].select.lineStyle).toMatchObject({ opacity: 1 })
  })

  it("**sans sélection**, rien n'est estompé : tout est à plein contraste", () => {
    const rest = option([{ type: "bar", data: rows, x: "month", y: "revenue", link: "month" }], {
      linkMode: "dim",
      x: { type: "band" },
    })
    expect(rest.series[0].itemStyle?.opacity).toBeUndefined()
    expect(rest.series[0].selectedMode).toBeUndefined()
    expect(rest.series[0].data).toHaveLength(2)
    // une sélection vide ne compte pas comme une sélection
    const blank = option([{ type: "bar", data: rows, x: "month", y: "revenue", link: "month" }], {
      linkMode: "dim",
      selection: {},
      x: { type: "band" },
    })
    expect(blank.series[0].itemStyle?.opacity).toBeUndefined()
  })

  it("le mode `filter` reste le défaut : les lignes partent, aucun style d'estompage", () => {
    const series = bar({}).series[0]
    expect(series.data).toHaveLength(1)
    expect(series.selectedMode).toBeUndefined()
    expect(series.select).toBeUndefined()
    expect(series.itemStyle?.opacity).toBeUndefined()
  })
})

describe("marque `table` (`tableModel`)", () => {
  const rows = [
    { month: "Jan", revenue: 42, cost: 28 },
    { month: "Feb", revenue: 51, cost: 31 },
  ]

  it("déduit les colonnes des clés, dans l'ordre d'apparition", () => {
    const model = tableModel({ type: "table", data: rows })
    expect(model.columns.map((c) => c.field)).toEqual(["month", "revenue", "cost"])
    expect(model.columns.map((c) => c.label)).toEqual(["month", "revenue", "cost"])
    expect(model.rows).toHaveLength(2)
  })

  it("respecte les colonnes déclarées (champ, en-tête, alignement, format)", () => {
    const model = tableModel({
      type: "table",
      data: rows,
      columns: [
        { field: "month", label: "Month" },
        { field: "revenue", label: "Revenue", align: "end", format: (v) => `${v} €` },
      ],
    })
    expect(model.columns).toEqual([
      { field: "month", label: "Month" },
      { field: "revenue", label: "Revenue", align: "end", format: expect.any(Function) },
    ])
    expect(model.columns[1].format?.(42, rows[0])).toBe("42 €")
  })

  it("accepte les colonnes en abrégé (`'month'`)", () => {
    expect(tableModel({ type: "table", data: rows, columns: ["month"] }).columns).toEqual([
      { field: "month", label: "month" },
    ])
  })

  it("les lignes suivent la **jointure** (`link`) comme n'importe quelle marque", () => {
    const mark: QChartMark = { type: "table", data: rows, link: "month" }
    expect(tableModel(mark, { name: "Feb" }).rows).toEqual([{ month: "Feb", revenue: 51, cost: 31 }])
    expect(tableModel(mark, null).rows).toHaveLength(2)
    // les colonnes restent celles des lignes visibles
    expect(tableModel(mark, { name: "Jan" }).columns.map((c) => c.field)).toEqual(["month", "revenue", "cost"])
  })

  it("marque absente ou données vides → modèle vide (pas d'erreur)", () => {
    expect(tableModel(undefined)).toEqual({ columns: [], rows: [], separator: "horizontal" })
    expect(tableModel({ type: "table" })).toEqual({ columns: [], rows: [], separator: "horizontal" })
  })

  it("le traducteur ignore une marque `table` (aucune série produite)", () => {
    const chart = option([
      { type: "table", data: rows, columns: ["month"] },
      { type: "bar", data: rows, x: "month", y: "revenue" },
    ])
    expect(chart.series).toHaveLength(1)
    expect(chart.series[0].type).toBe("bar")
  })
})

describe("re-clic = désélection (`sameSelection`)", () => {
  it("compare d'abord le `name` — la clé partagée entre graphiques", () => {
    expect(sameSelection({ name: "Feb" }, { name: "Feb", markIndex: 3, dataIndex: 9 })).toBe(true)
    expect(sameSelection({ name: "Feb" }, { name: "Mar" })).toBe(false)
    // le type compte peu : un même mois dans deux marques, c'est la même sélection
    expect(sameSelection({ name: "Feb", markType: "bar" }, { name: "Feb", markType: "line" })).toBe(true)
  })

  it("à défaut de nom, compare la position (marque + donnée)", () => {
    expect(sameSelection({ markIndex: 0, dataIndex: 2 }, { name: undefined, markIndex: 0, dataIndex: 2 })).toBe(true)
    expect(sameSelection({ markIndex: 0, dataIndex: 2 }, { markIndex: 0, dataIndex: 3 })).toBe(false)
    expect(sameSelection({ markIndex: 1, dataIndex: 2 }, { markIndex: 0, dataIndex: 2 })).toBe(false)
  })

  it("sans sélection courante (ou position incomplète), rien n'est « déjà sélectionné »", () => {
    expect(sameSelection(null, { name: "Feb" })).toBe(false)
    expect(sameSelection(undefined, { name: "Feb" })).toBe(false)
    expect(sameSelection({ markIndex: 0 }, { markIndex: 0 })).toBe(false)
    expect(sameSelection({ dataIndex: 2 }, { dataIndex: 2 })).toBe(false)
  })

  it("un nom face à une sélection sans nom ne conclut pas à l'égalité", () => {
    expect(sameSelection({ markIndex: 0, dataIndex: 1 }, { name: "Feb" })).toBe(false)
  })
})

describe("identité d'un clic de légende (`legendPickOf`)", () => {
  const monthly = [
    { month: "Jan", revenue: 42, cost: 28 },
    { month: "Feb", revenue: 51, cost: 31 },
    { month: "Mar", revenue: 47, cost: 30 },
  ]

  it("reconstruit la marque ET la donnée depuis le seul nom", () => {
    const pick = legendPickOf([{ type: "pie", data: monthly, x: "month", y: "revenue", name: "Revenue" }], "Jan")
    expect(pick).toEqual({
      name: "Jan",
      origin: "legend",
      markIndex: 0,
      markName: "Revenue",
      markType: "pie",
      dataIndex: 0,
      data: { month: "Jan", revenue: 42, cost: 28 },
      value: 42,
    })
  })

  it("cherche dans toutes les marques et donne l'index exact de la donnée", () => {
    const marks: QChartMark[] = [
      { type: "bar", data: monthly, x: "month", y: "revenue", name: "Revenue" },
      { type: "line", data: monthly, x: "month", y: "cost", name: "Cost" },
    ]
    expect(legendPickOf(marks, "Mar")).toMatchObject({ markIndex: 0, markType: "bar", dataIndex: 2, value: 47 })
    expect(legendPickOf(marks, "Feb")).toMatchObject({ markIndex: 0, dataIndex: 1, markName: "Revenue" })
  })

  it("`markHint` (la marque cliquée) passe en premier — deux marques peuvent partager un nom", () => {
    const marks: QChartMark[] = [
      { type: "bar", data: monthly, x: "month", y: "revenue", name: "Revenue" },
      { type: "line", data: monthly, x: "month", y: "cost", name: "Cost" },
    ]
    // sans indice : la première marque qui porte le nom
    expect(legendPickOf(marks, "Feb")).toMatchObject({ markIndex: 0, markType: "bar", dataIndex: 1 })
    // avec l'indice du clic : la marque visée, et sa valeur d'ordonnée
    expect(legendPickOf(marks, "Feb", 1)).toMatchObject({ markIndex: 1, markType: "line", dataIndex: 1, value: 31 })
    // indice hors bornes → recherche normale
    expect(legendPickOf(marks, "Feb", 7)).toMatchObject({ markIndex: 0, markType: "bar" })
  })

  it("nom inconnu → sélection réduite au nom (rien d'inventé)", () => {
    expect(legendPickOf([{ type: "bar", data: monthly, x: "month", y: "revenue" }], "Nope")).toEqual({
      name: "Nope",
      origin: "legend",
    })
    expect(legendPickOf(undefined, "Jan")).toEqual({ name: "Jan", origin: "legend" })
  })
})

describe("clic de légende en mode `select` (`nextLegendPick`)", () => {
  it("sélectionne le nom cliqué", () => {
    const pick = nextLegendPick(null, "Jan", { month: "Jan" })
    expect(pick).toEqual({ name: "Jan", origin: "legend", data: { month: "Jan" } })
  })

  it("bascule sur un autre nom", () => {
    expect(nextLegendPick({ name: "Jan" }, "Feb")).toEqual({ name: "Feb", origin: "legend", data: undefined })
  })

  it("**désélectionne** quand on reclique le nom courant (`null`)", () => {
    expect(nextLegendPick({ name: "Jan" }, "Jan")).toBeNull()
    // la comparaison est textuelle : 42 et « 42 » désignent la même part
    expect(nextLegendPick({ name: 42 }, "42")).toBeNull()
  })

  it("une sélection sans nom (ou absente) laisse sélectionner", () => {
    expect(nextLegendPick({}, "Jan")).toMatchObject({ name: "Jan" })
    expect(nextLegendPick(undefined, "Jan")).toMatchObject({ name: "Jan" })
    expect(nextLegendPick({ name: undefined }, "Jan")).toMatchObject({ name: "Jan" })
  })
})

describe("jointure d'une marque à la sélection (`link`)", () => {
  const rows = [
    { month: "Jan", revenue: 42, cost: 28 },
    { month: "Feb", revenue: 51, cost: 31 },
    { month: "Mar", revenue: 47, cost: 30 },
  ]

  it("`link: 'month'` = `{ localField: 'month' }`", () => {
    expect(chartLink("month")).toEqual({ localField: "month" })
    expect(chartLink({ localField: "m", foreignField: "month" })).toEqual({ localField: "m", foreignField: "month" })
    expect(chartLink(undefined)).toBeUndefined()
  })

  it("résout la clé : donnée du pick → champ du pick → son `name` → scalaire", () => {
    const link = { localField: "month" }
    expect(linkValue(link, { name: "Jan", data: { month: "Mar" } })).toBe("Mar")
    expect(linkValue({ localField: "m", foreignField: "month" }, { data: { month: "Feb" } })).toBe("Feb")
    expect(linkValue({ localField: "m", foreignField: "month" }, { month: "Apr" })).toBe("Apr")
    expect(linkValue(link, { name: "Jan" })).toBe("Jan")
    expect(linkValue(link, "Jan")).toBe("Jan")
    expect(linkValue(link, null)).toBeUndefined()
  })

  it("filtre les lignes jointes, sans sélection garde tout", () => {
    expect(linkedRows(rows, { localField: "month" }, { name: "Feb" }).map((r: any) => r.month)).toEqual(["Feb"])
    expect(linkedRows(rows, { localField: "month" }, null)).toHaveLength(3)
    expect(linkedRows(rows, undefined, { name: "Feb" })).toHaveLength(3)
  })

  it("garde-fou : champ absent des lignes → la marque n'est pas vidée", () => {
    expect(linkedRows(rows, { localField: "semaine" }, { name: "Feb" })).toHaveLength(3)
    expect(linkedRows(rows, { localField: "month" }, { name: "Dec" })).toHaveLength(0)
  })

  /** Valeurs d'une série cartésienne, quel que soit l'encodage (nombre ou paire `[x, y]`) */
  const values = (series: any) =>
    series.data.map((item: any) => (Array.isArray(item?.value) ? item.value[1] : (item?.value ?? item)))

  it("le traducteur filtre la marque liée, et laisse les autres intactes", () => {
    const marks: QChartMark[] = [
      { type: "bar", data: rows, x: "month", y: "revenue", link: "month" },
      { type: "line", data: rows, x: "month", y: "cost" },
    ]
    const chart = option(marks, { selection: { name: "Feb" }, x: { type: "band" } })
    expect(values(chart.series[0])).toEqual([51]) // la barre liée : février seulement
    expect(values(chart.series[1])).toEqual([28, 31, 30]) // la ligne non liée : tout
    // L'axe est **commun** : ses catégories restent l'union des marques (une marque liée
    // seule ne rétrécit donc pas l'axe — il faut que toutes les marques soient liées).
    expect(chart.xAxis.data).toEqual(["Feb", "Jan", "Mar"])
  })

  it("toutes les marques liées → l'axe se réduit à la clé (cross-filter complet)", () => {
    const marks: QChartMark[] = [
      { type: "bar", data: rows, x: "month", y: "revenue", link: "month" },
      { type: "line", data: rows, x: "month", y: "cost", link: "month" },
    ]
    const chart = option(marks, { selection: { name: "Jan" }, x: { type: "band" } })
    expect(values(chart.series[0])).toEqual([42])
    expect(values(chart.series[1])).toEqual([28])
    expect(chart.xAxis.data).toEqual(["Jan"])
  })

  it("jointure croisée : `foreignField` écrit autrement que le champ local", () => {
    const channels = [
      { label: "Online", revenue: 120 },
      { label: "Store", revenue: 80 },
    ]
    const driven = option(
      [{ type: "bar", data: channels, x: "label", y: "revenue", link: { localField: "label", foreignField: "month" } }],
      { selection: { name: "x", data: { month: "Online" } }, x: { type: "band" } },
    )
    expect(values(driven.series[0])).toEqual([120])
  })
})

describe("démo « Interaction » — les 4 marques portent une légende", () => {
  // Marks exacts de `DnaxDemoChart.vue` (demo="interaction" : bar, pie, line, dot)
  const monthly = [
    { month: "Jan", revenue: 42, cost: 28 },
    { month: "Feb", revenue: 51, cost: 31 },
    { month: "Mar", revenue: 47, cost: 30 },
  ]
  const axes = { x: { type: "band" as const }, y: { min: 0 } }

  // Une légende allumée n'a ni `show` ni `data` : ECharts prend `show: true` par défaut et
  // déduit les entrées des noms de séries (cartésien) ou des noms de données (pie). Éteinte,
  // le traducteur pose explicitement `{ show: false, data: [] }`.
  const legendOn = (chart: any) => chart.legend.show !== false

  it("bar / line / dot : la légende s'allume dès que la série est nommée", () => {
    const bar = option([{ type: "bar", data: monthly, x: "month", y: "revenue", fill: "chart-1", name: "Revenue" }], axes)
    const line = option([{ type: "line", data: monthly, x: "month", y: "cost", stroke: "primary", name: "Cost" }], axes)
    const dot = option([{ type: "dot", data: monthly, x: "month", y: "revenue", fill: "chart-2", r: 5, name: "Revenue" }], axes)
    for (const [label, chart] of [["bar", bar], ["line", line], ["dot", dot]] as const) {
      expect(legendOn(chart), label).toBe(true)
      expect(chart.series.some((s: any) => !!s.name), label).toBe(true)
      // ni `show` ni `data` : ECharts reprend les noms de séries
      expect(chart.legend.data, label).toBeUndefined()
    }
    // une série sans nom → pas de légende (et l'espace n'est pas réservé dans le grid)
    const unnamed = option([{ type: "bar", data: monthly, x: "month", y: "revenue" }], axes)
    expect(legendOn(unnamed)).toBe(false)
  })

  it("pie : la légende liste les parts, à droite et verticale", () => {
    const pie = option(
      [{ type: "pie", data: monthly, x: "month", y: "revenue", labels: "percent", name: "Revenue" }],
      { legend: { position: "right" } },
    )
    expect(legendOn(pie)).toBe(true)
    expect(pie.legend).toMatchObject({ orient: "vertical", right: 0, top: "middle" })
    expect(pie.legend.data).toBeUndefined() // ECharts liste les noms de données (Jan, Feb…)
  })
})

describe("pickFromEvent", () => {
  it("normalise l'événement de clic en vocabulaire de **marque**", () => {
    expect(
      pickFromEvent({
        componentType: "series",
        seriesType: "bar",
        seriesIndex: 0,
        seriesName: "Revenue",
        name: "Feb",
        value: 51,
        dataIndex: 2,
        data: { month: "Feb", revenue: 51 },
        // propriétés non retenues (event DOM, couleur, etc.)
        event: { type: "click" },
        color: "#1976d2",
      }),
    ).toEqual({
      origin: "mark",
      markType: "bar",
      markIndex: 0,
      markName: "Revenue",
      name: "Feb",
      value: 51,
      dataIndex: 2,
      data: { month: "Feb", revenue: 51 },
    })
  })

  it("omet les clés absentes ou nulles (payload comparable)", () => {
    expect(pickFromEvent({ componentType: "series", name: undefined, value: null })).toEqual({ origin: "mark" })
    // une entrée de légende n'est pas une marque
    expect(pickFromEvent({ componentType: "legend", name: "Jan" })).toEqual({ origin: "legend", name: "Jan" })
    // un composant inconnu (axe…) ne produit pas d'`origin`
    expect(pickFromEvent({ componentType: "xAxis", name: "Jan" })).toEqual({ name: "Jan" })
    expect(Object.keys(pickFromEvent({}))).toEqual([])
    expect(pickFromEvent(undefined)).toEqual({})
  })
})

describe("textValue", () => {
  it("suit Plot : canal `text`, sinon la valeur de la ligne, sinon son index", () => {
    const data = [{ a: 1 }, { a: 2 }]
    expect(textValue({ type: "text", text: "a" }, data, 1)).toBe(2)
    expect(textValue({ type: "text", text: ["x", "y"] }, data, 0)).toBe("x")
    expect(textValue({ type: "text" }, data, 1)).toBe(1) // objets → index
    expect(textValue({ type: "text" }, [10, 20, 30], 2)).toBe(30) // primitives → la valeur
  })
})
