<script lang="ts">
// QChart — graphique ECharts piloté par des **marks** :
//   <q-chart :marks="[{ type: 'bar', data: rows, x: 'mois', y: 'ventes', fill: 'primary' }]" />
// Une marque est un objet `{ type, data, x, y, fill, … }` ; les canaux acceptent
// le nom d'un champ, des valeurs explicites ou une fonction d'accès. Types :
// `line`, `area`, `bar`, `dot`, `text`, `rule`. Voir `lib/chart.ts`.
//
// ECharts dessine en canvas → le graphe est monté côté client (onMounted) ; le
// conteneur, sa hauteur et son `aria-label` sortent dès le prerender.
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue"
import { chartToECharts, COLOR_TOKENS } from "../lib/chart"
import { normalizeCssColor } from "../lib/color"
import type { QChartAxis, QChartLegend, QChartMark } from "../lib/chart"

interface Props {
  /** Marques à rendre : `{ type: 'line', data, x, y }`, `{ type: 'bar', … }`… */
  marks?: QChartMark[]
  /** Axe X (type, libellé, bornes, grille) */
  x?: QChartAxis
  /** Axe Y (type, libellé, bornes, grille) */
  y?: QChartAxis
  /** Hauteur du conteneur (nombre = px, sinon valeur CSS) */
  height?: number | string
  /** Titre du graphique */
  title?: string
  /** Palette (tokens `primary`, `secondary`… ou couleurs CSS) des séries non colorées */
  colors?: string[]
  /** Légende : `false` pour la masquer, `true` pour la forcer (défaut : dès qu'une série est
   *  nommée), ou `{ position: 'top' | 'bottom' | 'left' | 'right', offset, align }` */
  legend?: boolean | QChartLegend
  /** Info-bulle au survol (défaut : true) */
  tooltip?: boolean
  /** Options ECharts brutes, fusionnées en dernier (échappatoire) */
  options?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  marks: () => [],
  height: 280,
  legend: undefined,
  tooltip: true,
})

const emit = defineEmits<{
  /** Émis une fois, avec l'instance ECharts */
  ready: [chart: any]
}>()

const el = ref<HTMLElement | null>(null)
const chart = shallowRef<any>(null)
let modulePromise: Promise<any> | null = null
let resizeObserver: ResizeObserver | undefined
let themeObserver: MutationObserver | undefined

/** Charge ECharts (modules enregistrés une seule fois, arbre secoué). */
const loadECharts = () => {
  modulePromise ??= (async () => {
    const [core, charts, components, renderers] = await Promise.all([
      import("echarts/core"),
      import("echarts/charts"),
      import("echarts/components"),
      import("echarts/renderers"),
    ])
    core.use([
      charts.BarChart,
      charts.LineChart,
      charts.ScatterChart,
      charts.PieChart, // marque `pie` (camembert / anneau)
      charts.HeatmapChart, // marque `heatmap` (carte de chaleur)
      components.GridComponent,
      components.TooltipComponent,
      components.LegendComponent,
      components.MarkLineComponent,
      components.VisualMapComponent, // échelle de couleurs des cartes de chaleur
      renderers.CanvasRenderer,
    ])
    return core
  })()
  return modulePromise
}

/** Canvas 2D de 1×1 px, mémoïsé : sert à **normaliser les couleurs CSS** (cf. `lib/color.ts`). */
let probeCtx: CanvasRenderingContext2D | null | undefined
const colorContext = () => {
  if (probeCtx !== undefined) return probeCtx
  if (typeof document === "undefined") return (probeCtx = null)
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  probeCtx = canvas.getContext("2d")
  return probeCtx
}

/** Couleurs déjà normalisées (les tokens ne changent pas d'un rendu à l'autre) */
const colorCache = new Map<string, string>()

/** Normalise n'importe quelle couleur CSS (`oklch()`, `color-mix()`, `rgb(0 0 0 / .5)`) en
 *  `#rrggbb` / `rgba()`, la seule forme que le parseur de zrender (moteur d'ECharts) sait
 *  relire. Sans ça, `liftColor()` — appelé sur l'état de survol — renvoie `undefined` et
 *  l'élément survolé devient invisible (cf. `lib/color.ts`).
 *  Renvoie `undefined` si la couleur n'est pas reconnue (ou hors navigateur). */
const normalizeColor = (value: string): string | undefined => {
  if (typeof value !== "string") return undefined
  const cached = colorCache.get(value)
  if (cached !== undefined) return cached
  const out = normalizeCssColor(value, colorContext())
  if (out !== undefined) colorCache.set(value, out)
  return out
}

/** Couleurs lues sur les tokens CSS du conteneur → suit clair/sombre et le thème hôte */
const themeOf = () => {
  const node = el.value
  if (!node || typeof getComputedStyle !== "function") return { theme: {}, tokens: {} }
  const cs = getComputedStyle(node)
  const read = (name: string) => cs.getPropertyValue(name).trim()
  /** Valeur normalisée d'un token, ou `raw` (déjà lisible) */
  const token = (name: string, fallback = "") => {
    const raw = read(name) || fallback
    return normalizeColor(raw) ?? raw
  }
  const tokens: Record<string, string> = {}
  for (const name of COLOR_TOKENS) {
    const raw = read(`--${name}`)
    if (raw) tokens[name] = normalizeColor(raw) ?? raw
  }
  return {
    theme: {
      text: token("--foreground", "#1d1d1d"),
      muted: token("--muted-foreground", "rgba(0, 0, 0, 0.55)"),
      grid: token("--border", "rgba(0, 0, 0, 0.1)"),
    },
    tokens,
  }
}

const build = () => {
  const { theme, tokens } = themeOf()
  return chartToECharts({
    marks: props.marks,
    x: props.x,
    y: props.y,
    colors: props.colors,
    title: props.title,
    legend: props.legend,
    tooltip: props.tooltip,
    options: props.options,
    theme,
    tokens,
    normalizeColor,
  })
}

const render = async () => {
  if (!el.value || typeof window === "undefined") return
  const echarts = await loadECharts()
  if (!el.value) return
  if (!chart.value) {
    chart.value = echarts.init(el.value)
    emit("ready", chart.value)
  }
  chart.value.setOption(build(), { notMerge: true })
  chart.value.resize()
}

onMounted(async () => {
  await render()
  if (el.value && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => chart.value?.resize())
    resizeObserver.observe(el.value)
  }
  // Le basculement clair/sombre change une classe sur <html> : on relit les tokens
  if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
    themeObserver = new MutationObserver(() => {
      chart.value?.setOption(build(), { notMerge: true })
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })
  }
})

watch(
  () => [props.marks, props.x, props.y, props.title, props.colors, props.legend, props.tooltip, props.options],
  () => void render(),
  { deep: true },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  themeObserver?.disconnect()
  chart.value?.dispose()
  chart.value = null
})

defineExpose({
  /** Instance ECharts (échappatoire : `chart.value?.dispatchAction(...)`) */
  chart,
  /** Force un nouveau rendu */
  refresh: () => void render(),
})
</script>

<template>
  <div
    ref="el"
    class="q-chart"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    role="img"
    :aria-label="title || 'Chart'"
  ></div>
</template>

<style scoped>
.q-chart {
  width: 100%;
}
</style>
