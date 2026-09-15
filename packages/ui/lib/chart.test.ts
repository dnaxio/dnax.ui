// Tests unitaires du traducteur marks → option ECharts (bun test).
// Seule la **marque `text`** est couverte pour l'instant (Plot.text).
import { describe, expect, it } from "bun:test"
import { chartToECharts, textValue } from "./chart"
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
    expect(chart.series[0].label).toMatchObject({ show: true, formatter: "{c}" })
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
    // Défaut : en haut à gauche, marge 12 px
    const byDefault = option(marks)
    expect(byDefault.legend).toMatchObject({ top: 0, left: 0 })
    expect(byDefault.legend.show).toBeUndefined()
    expect(byDefault.grid.top).toBe(14 + 12)
    // Une marge plus grande décale la zone de tracé
    const wide = option(marks, { legend: { offset: 24 } })
    expect(wide.grid.top).toBe(14 + 24)
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
    expect(right.grid.right).toBe(16 + 90 + 12)
    // Toujours masquable
    expect(option(marks, { legend: false }).legend).toEqual({ show: false })
    expect(option(marks, { legend: true }).legend.show).toBeUndefined()
  })

  it("titre + légende : le titre garde sa place, la légende passe dessous", () => {
    const chart = option([{ type: "line", data: rows, x: "month", y: "revenue", stroke: "primary", name: "Revenue" }], {
      title: "Revenue",
    })
    expect(chart.legend.top).toBe(26)
    expect(chart.grid.top).toBe(26 + 14 + 12)
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
