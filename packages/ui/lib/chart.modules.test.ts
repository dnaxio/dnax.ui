// Vérifie que la liste de modules **enregistrés par `QChart.vue`** suffit à rendre chaque
// famille de marque. Le SFC charge ECharts en dynamique (`echarts/core` + `use([...])`) : un
// module oublié n'échoue pas — il est **silencieusement ignoré**. Ce test rejoue exactement les
// mêmes imports tree-shakés (avec le rendu SVG) pour que l'oubli devienne visible.
//
// ⚠️ Toute nouvelle série / composant doit être ajouté ici **et** dans `QChart.vue`.
import { describe, expect, it } from "bun:test"
import * as echarts from "echarts/core"
import {
  BarChart,
  BoxplotChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  TreemapChart,
} from "echarts/charts"
import {
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components"
import { SVGRenderer } from "echarts/renderers"
import { LegacyGridContainLabel } from "echarts/features"
import { chartToECharts } from "./chart"
import type { QChartConfig } from "./chart"

echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
  HeatmapChart,
  BoxplotChart,
  GaugeChart,
  FunnelChart,
  RadarChart,
  TreemapChart,
  SunburstChart,
  SankeyChart,
  GridComponent,
  RadarComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  MarkLineComponent,
  MarkAreaComponent,
  VisualMapComponent,
  SVGRenderer,
  LegacyGridContainLabel,
])

const THEME = { text: "#111111", muted: "#666666", grid: "#e5e5e5" }

const render = (config: QChartConfig) => {
  const chart = echarts.init(null as any, null, { renderer: "svg", ssr: true, width: 420, height: 280 })
  chart.setOption(chartToECharts({ theme: THEME, ...config, marks: config.marks ?? [] }))
  const svg = chart.renderToSVGString()
  chart.dispose()
  return svg
}

const monthly = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 51 },
  { month: "Mar", value: 47 },
]

describe("modules ECharts enregistrés par QChart", () => {
  it("les marques cartésiennes et les annotations se dessinent", () => {
    const svg = render({
      marks: [
        { type: "bar", data: monthly, x: "month", y: "value", name: "Bars", labels: true },
        { type: "line", data: monthly, x: "month", y: "value", name: "Line" },
        { type: "band", y0: 45, y1: 55, fill: "warning" },
        { type: "rule", y: [50], label: "Target" },
      ],
    })
    expect(svg).toContain("<rect")
    expect(svg).toContain("<path")
  })

  it("les familles hors axes se dessinent", () => {
    const cases: [string, QChartConfig][] = [
      ["pie", { marks: [{ type: "pie", data: monthly, x: "month", y: "value" }] }],
      [
        "heatmap",
        {
          marks: [
            {
              type: "heatmap",
              data: [
                { day: "Mon", hour: "9h", v: 1 },
                { day: "Tue", hour: "9h", v: 2 },
              ],
              x: "hour",
              y: "day",
              fill: "v",
            },
          ],
        },
      ],
      [
        "gauge",
        {
          marks: [
            {
              type: "gauge",
              data: [{ label: "Uptime", value: 99 }],
              x: "label",
              y: "value",
              target: 99.5,
            },
          ],
        },
      ],
      ["funnel", { marks: [{ type: "funnel", data: monthly, x: "month", y: "value" }] }],
      [
        "radar",
        {
          marks: [
            {
              type: "radar",
              data: [
                { skill: "Speed", value: 8 },
                { skill: "Power", value: 6 },
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
                { name: "Root", parent: "", value: 0 },
                { name: "Leaf", parent: "Root", value: 10 },
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
                { name: "Root", parent: "", value: 0 },
                { name: "Leaf", parent: "Root", value: 10 },
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
              data: [{ source: "A", target: "B", value: 10 }],
            },
          ],
        },
      ],
      [
        "boxplot",
        {
          marks: [{ type: "boxplot", data: [{ team: "A", s: [1, 2, 3, 4, 5] }], x: "team", values: "s" }],
        },
      ],
      [
        "histogram",
        { marks: [{ type: "histogram", data: [1, 2, 2, 3, 5, 8], x: (d: any) => d, bins: 3 }] },
      ],
      [
        "waterfall",
        {
          marks: [
            {
              type: "waterfall",
              data: [
                { step: "A", delta: 10 },
                { step: "B", delta: -4 },
              ],
              x: "step",
              y: "delta",
            },
          ],
        },
      ],
    ]
    for (const [label, config] of cases) {
      const svg = render(config)
      expect(svg.startsWith("<svg"), label).toBe(true)
      expect(svg.length, label).toBeGreaterThan(200)
    }
  })

  it("le second axe Y se dessine", () => {
    const svg = render({
      marks: [
        { type: "bar", data: monthly, x: "month", y: "value", name: "Volume" },
        { type: "line", data: monthly, x: "month", y: "value", yAxis: "right", name: "Rate" },
      ],
    })
    expect(svg).toContain("Volume")
  })
})
