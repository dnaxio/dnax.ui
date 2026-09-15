// Expérience jetable : rendu réel (SVG SSR) de la marque `heatmap`.
import * as echarts from "echarts"
import { chartToECharts } from "./lib/chart"
import type { QChartMark } from "./lib/chart"

const CELL = /<(rect|path)[^>]*fill="([^"]+)"[^>]*>/g

const run = (label: string, marks: QChartMark[], config: Record<string, any> = {}) => {
  const option = chartToECharts({
    marks,
    theme: { text: "#111111", muted: "#666666", grid: "#e5e5e5" },
    tokens: { primary: "#1976d2", "chart-1": "#1976d2", "chart-2": "#26a69a" },
    ...config,
  })
  const chart = echarts.init(null as any, null, { renderer: "svg", ssr: true, width: 520, height: 300 })
  chart.setOption(option)
  const svg = chart.renderToSVGString()
  chart.dispose()
  const fills: Record<string, number> = {}
  for (const m of svg.matchAll(CELL)) fills[m[2]!] = (fills[m[2]!] ?? 0) + 1
  console.log(`── ${label}`)
  console.log("   séries:", JSON.stringify(option.series.map((s: any) => ({ type: s.type, n: s.data.length, first: s.data[0] }))))
  console.log("   xAxis:", JSON.stringify({ type: option.xAxis?.type, data: option.xAxis?.data, gap: option.xAxis?.boundaryGap, splitArea: !!option.xAxis?.splitArea }))
  console.log("   yAxis:", JSON.stringify({ type: option.yAxis?.type, data: option.yAxis?.data, splitArea: !!option.yAxis?.splitArea }))
  console.log("   visualMap:", JSON.stringify(option.visualMap))
  console.log("   remplissages dans le SVG:", JSON.stringify(fills))
}

const grid = [
  { day: "Mon", hour: "9h", temp: 12 },
  { day: "Mon", hour: "12h", temp: 21 },
  { day: "Mon", hour: "15h", temp: 26 },
  { day: "Tue", hour: "9h", temp: 8 },
  { day: "Tue", hour: "12h", temp: 18 },
  { day: "Tue", hour: "15h", temp: 33 },
  { day: "Wed", hour: "9h", temp: 14 },
  { day: "Wed", hour: "12h", temp: 25 },
  { day: "Wed", hour: "15h", temp: 30 },
]

// 1. Valeur **numérique** → échelle de couleurs (visualMap) sur la palette
run("numérique (visualMap)", [{ type: "heatmap", data: grid, x: "hour", y: "day", fill: "temp", labels: true, title: "temp" }])

// 2. Couleur **constante** → toutes les cellules de la même couleur (visualMap caché)
run("couleur constante", [{ type: "heatmap", data: grid, x: "hour", y: "day", fill: "primary" }])

// 3. Sans `fill` : cellules non colorées (itemStyle par défaut)
run("sans fill", [{ type: "heatmap", data: grid, x: "hour", y: "day" }])

// 4. Mixte : carte de chaleur + ligne → les axes restent, la ligne se superpose
run("heatmap + line", [
  { type: "heatmap", data: grid, x: "hour", y: "day", fill: "temp" },
  { type: "line", data: grid, x: "hour", y: "temp", stroke: "chart-2" },
])
