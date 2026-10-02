// Tests du **placement des noms d'axes** de `<q-chart>` : `chartToECharts()` produit bien des
// noms dans le cadre. Vérifié en rendant l'option en SVG via l'**SSR d'ECharts** — du JS pur,
// aucun navigateur (cf. règle projet).
//
// Rappel du bug corrigé : sans `nameLocation`, le moteur place le nom **à la fin** de l'axe —
// le nom X s'écrivait vers la droite (hors cadre) et le nom Y, centré sur la ligne d'axe,
// débordait à gauche (rogné) dès que le libellé était large.
import { describe, expect, it } from "bun:test"
import * as echarts from "echarts"
import { chartToECharts } from "./chart"

const THEME = { text: "#000000", muted: "#666666", grid: "#dddddd" }
/** Largeur approximative d'un caractère à 12px (mesure faite sur le rendu ECharts). */
const CHAR_W = 7
const FONT_H = 12

interface Box {
  x0: number
  x1: number
  y0: number
  y1: number
}

function renderSvg(config: Record<string, any>, width: number, height: number): string {
  const chart = echarts.init(null as any, null, {
    renderer: "svg",
    ssr: true,
    width,
    height,
  })
  chart.setOption(chartToECharts({ theme: THEME, ...config }))
  const svg = chart.renderToSVGString()
  chart.dispose()
  return svg
}

/** Boîte approximative du `<text>` d'un nom d'axe (via `translate` + `text-anchor`). */
function nameBox(svg: string, name: string): Box | undefined {
  for (const line of svg.split("\n")) {
    if (!line.includes("<text")) continue
    const text = (line.match(/>([^<]*)<\/text>/) ?? [, ""])[1]
    if (text !== name) continue
    const m = line.match(/translate\(([-\d.]+) ([-\d.]+)\)/)
    if (!m) continue
    const x = Number(m[1])
    const y = Number(m[2])
    const anchor = (line.match(/text-anchor="([^"]+)"/) ?? [, "middle"])[1]
    const w = text.length * CHAR_W
    const x0 = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2
    return { x0, x1: x0 + w, y0: y - FONT_H / 2, y1: y + FONT_H / 2 }
  }
  return undefined
}

const inside = (b: Box, w: number, h: number) =>
  b.x0 >= 0 && b.x1 <= w && b.y0 >= 0 && b.y1 <= h

const verticalConfig = {
  marks: [
    {
      type: "line",
      data: [
        { month: "Jan", value: 1_200_000 },
        { month: "Feb", value: 3_400_000 },
        { month: "Mar", value: 2_600_000 },
      ],
      x: "month",
      y: "value",
    },
  ],
  // libellés volontairement larges (le cas qui rognait le nom Y)
  x: { label: "Month of the year" },
  y: { label: "Revenue in thousands" },
}

const horizontalConfig = {
  marks: [
    {
      type: "bar",
      orientation: "horizontal",
      data: [
        { dept: "Engineering", value: 34 },
        { dept: "Sales", value: 26 },
      ],
      x: "dept",
      y: "value",
    },
  ],
  x: { label: "Headcount" },
  y: { label: "Department" },
}

describe("noms d'axes — placement dans le cadre", () => {
  it("X et Y restent dans le cadre (vertical, horizontal, petit canevas)", () => {
    const cases: [Record<string, any>, number, number][] = [
      [verticalConfig, 520, 280],
      [horizontalConfig, 520, 280],
      [verticalConfig, 300, 160],
    ]
    for (const [config, w, h] of cases) {
      const svg = renderSvg(config, w, h)
      const bx = nameBox(svg, config.x.label)
      const by = nameBox(svg, config.y.label)
      expect(bx).toBeDefined()
      expect(by).toBeDefined()
      expect(inside(bx!, w, h)).toBe(true)
      expect(inside(by!, w, h)).toBe(true)
    }
  })

  it("le nom X est centré sous l'axe, pas collé au bord droit", () => {
    const svg = renderSvg(verticalConfig, 520, 280)
    const bx = nameBox(svg, verticalConfig.x.label)!
    // centré : commence bien après le bord gauche et finit bien avant le bord droit
    expect(bx.x0).toBeGreaterThan(60)
    expect(bx.x1).toBeLessThan(520 - 60)
    // sous la zone de tracé
    expect(bx.y0).toBeGreaterThan(200)
  })

  it("le nom Y est ancré à gauche sur la ligne d'axe (jamais rogné), en haut", () => {
    const svg = renderSvg(verticalConfig, 520, 280)
    const by = nameBox(svg, verticalConfig.y.label)!
    expect(by.x0).toBeGreaterThan(0)
    expect(by.y1).toBeLessThan(160)
  })
})
