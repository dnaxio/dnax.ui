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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue"
import { chartToECharts, COLOR_TOKENS } from "../lib/chart"
import { normalizeCssColor } from "../lib/color"
import { legendPickOf, nextLegendPick, pickFromEvent, sameSelection, tableCsv, tableModel } from "../lib/chart"
import { useConfigLang } from "../lib/useComponentProps"
import type {
  QChartAxis,
  QChartColumn,
  QChartLegend,
  QChartMark,
  QChartPick,
  QChartTooltip,
} from "../lib/chart"

interface Props {
  /** Marques à rendre : `{ type: 'line', data, x, y }`, `{ type: 'bar', … }`… */
  marks?: QChartMark[]
  /** Axe X (type, libellé, bornes, grille, format, granularité temporelle) */
  x?: QChartAxis
  /** Axe Y (type, libellé, bornes, grille, format) */
  y?: QChartAxis
  /** Axe Y **secondaire**, à droite — pour un combo volume (barres) + taux (ligne) :
   *  la marque visée déclare `yAxis: 'right'`. */
  yRight?: QChartAxis
  /** Locale des nombres / dates (`fr-FR` par défaut, sinon celle du provider) */
  locale?: string
  /** Mode **compact** (mini-widget) : marges réduites, axes et légende masqués par défaut */
  compact?: boolean
  /** Hauteur du conteneur (nombre = px, sinon valeur CSS) */
  height?: number | string
  /** Titre du graphique */
  title?: string
  /** Palette (tokens `primary`, `secondary`… ou couleurs CSS) des séries non colorées */
  colors?: string[]
  /** Légende : `false` pour la masquer, `true` pour la forcer (défaut : dès qu'une série est
   *  nommée), ou `{ position: 'top' | 'bottom' | 'left' | 'right', offset, align }` */
  legend?: boolean | QChartLegend
  /** Info-bulle au survol (défaut : true) — `false` l'éteint, un objet la personnalise
   *  (`formatter`, `valueFormatter`, `sortDesc`) */
  tooltip?: boolean | QChartTooltip
  /** Réaction des marques liées à la sélection : `filter` (défaut) **retire** les données non
   *  liées, `dim` les **estompe** (`dimOpacity`) en gardant tout le contexte visible. */
  linkMode?: "filter" | "dim"
  /** Opacité des éléments non sélectionnés en mode `dim` (défaut : 0.25) */
  dimOpacity?: number
  /** **Groupe de liaison** : les `<q-chart>` d'un même groupe se synchronisent
   *  (`echarts.connect`) — survol/curseur d'axe, info-bulle, légende, zoom et mise en
   *  évidence d'un élément. */
  group?: string
  /** Élément **sélectionné** (`QChartPick`, typiquement le `@pick` d'un autre graphique) :
   *  les éléments qui portent ce `name` sont mis en évidence (`highlight`) dans toutes les
   *  séries. `null` efface la sélection. */
  selected?: QChartPick | null
  /** État **chargement** : superpose un message (slot `loading`) */
  loading?: boolean
  /** État **erreur** : `true` (message localisé) ou un texte à afficher (slot `error`) */
  error?: string | boolean
  /** État **vide** forcé (sinon détecté : aucune donnée) — slot `empty` */
  empty?: boolean
  /** Textes des états et de la table (prioritaires sur l'i18n du provider) */
  texts?: Partial<
    Record<"loading" | "empty" | "error" | "exportCsv" | "total" | "page" | "sortAscending" | "sortDescending", string>
  >
  /** Marque `table` : bouton d'**export CSV** */
  exportable?: boolean
  /** Options ECharts brutes, fusionnées en dernier (échappatoire) */
  options?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  marks: () => [],
  height: 280,
  legend: undefined,
  tooltip: true,
  // mêmes défauts que le traducteur : un composant qui n'est pas renseigné (la marque `table`,
  // rendue en HTML, lit ses props directement) se comporte comme les graphiques.
  linkMode: "filter",
  dimOpacity: 0.25,
})

const emit = defineEmits<{
  /** Émis une fois, avec l'instance ECharts */
  ready: [chart: any]
  /** Clic sur un élément du graphique (point, barre, part, cellule…) ou sur un élément de
   *  légende (`legend.action: 'select'`) — payload normalisé. `null` = sélection effacée
   *  (re-clic sur l'élément déjà sélectionné). */
  pick: [pick: QChartPick | null]
  /** La sélection vient d'être **effacée par l'utilisateur** — payload : l'élément lâché
   *  (`{ name, origin: 'legend', data }`). Émis juste avant le `@pick` à `null`, pour qui a
   *  besoin de savoir *ce qui* a été désélectionné (journal, requête, analytics). Jamais émis
   *  quand c'est l'application qui remet `selected` à `null` : ce serait un écho. */
  unpick: [pick: QChartPick]
}>()

// ─── i18n des états et de la table ────────────────────────────────────────────
const I18N = {
  en: {
    loading: "Loading…",
    empty: "No data",
    error: "Unable to display the chart",
    exportCsv: "Export CSV",
    total: "Total",
    page: "Page {n} / {m}",
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
  },
  fr: {
    loading: "Chargement…",
    empty: "Aucune donnée",
    error: "Impossible d'afficher le graphique",
    exportCsv: "Exporter en CSV",
    total: "Total",
    page: "Page {n} / {m}",
    sortAscending: "Tri croissant",
    sortDescending: "Tri décroissant",
  },
} as const
type UiText = keyof (typeof I18N)["en"]
const configLang = useConfigLang()
const t = (key: UiText): string => props.texts?.[key] ?? I18N[configLang.value === "fr" ? "fr" : "en"][key]
const fmtPage = (n: number, total: number) =>
  t("page").replace("{n}", String(n)).replace("{m}", String(total))
/** Locale des nombres / dates : prop, sinon celle du provider (`fr` → `fr-FR`) */
const locale = computed(() => props.locale ?? (configLang.value === "fr" ? "fr-FR" : "en-US"))

const el = ref<HTMLElement | null>(null)
const chart = shallowRef<any>(null)
let modulePromise: Promise<any> | null = null
let resizeObserver: ResizeObserver | undefined
let themeObserver: MutationObserver | undefined

/** Charge ECharts (modules enregistrés une seule fois, arbre secoué). */
const loadECharts = () => {
  modulePromise ??= (async () => {
    const [core, charts, components, renderers, features] = await Promise.all([
      import("echarts/core"),
      import("echarts/charts"),
      import("echarts/components"),
      import("echarts/renderers"),
      import("echarts/features"),
    ])
    core.use([
      charts.BarChart,
      charts.LineChart,
      charts.ScatterChart,
      charts.PieChart, // marque `pie` (camembert / anneau)
      charts.HeatmapChart, // marque `heatmap` (carte de chaleur)
      charts.BoxplotChart, // marque `boxplot` (boîte à moustaches)
      charts.GaugeChart, // marque `gauge` (jauge)
      charts.FunnelChart, // marque `funnel` (entonnoir)
      charts.RadarChart, // marque `radar` (multicritères)
      charts.TreemapChart, // marque `treemap`
      charts.SunburstChart, // marque `sunburst`
      charts.SankeyChart, // marque `sankey` (flux)
      components.GridComponent,
      components.RadarComponent, // coordonnée polaire de la marque `radar`
      components.TooltipComponent,
      components.LegendComponent,
      components.TitleComponent, // titre (`title` prop)
      components.MarkLineComponent,
      components.MarkAreaComponent, // marque `band` (zones de seuil)
      components.VisualMapComponent, // échelles de couleurs (heatmap, `fill` numérique d'un `dot`)
      renderers.CanvasRenderer,
      // ECharts 6 : `grid.containLabel` vit désormais dans un module de compatibilité —
      // sans lui l'option est ignorée **silencieusement** (les libellés débordent du cadre).
      features.LegacyGridContainLabel,
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
    yRight: props.yRight,
    locale: locale.value,
    compact: props.compact,
    colors: props.colors,
    title: props.title,
    legend: props.legend,
    tooltip: props.tooltip,
    // Sélection partagée : nourrit la jointure des marques qui déclarent `link`
    selection: props.selected ?? null,
    // Ce que deviennent les lignes non liées : retirées (`filter`) ou estompées (`dim`)
    linkMode: props.linkMode,
    dimOpacity: props.dimOpacity,
    options: props.options,
    theme,
    tokens,
    normalizeColor,
  })
}

/** Relie un graphique à son groupe. ECharts veut le groupe **sur l'instance**
 *  (`chart.group`) ET le groupe déclaré comme connecté (`echarts.connect`) : l'un sans
 *  l'autre ne synchronise rien (vérifié au navigateur). Une fois les deux posés, les actions
 *  « partageables » déclenchées dans un graphique sont rejouées sur les autres charts du
 *  même groupe. */
const linkChart = (group: string, instance: any, api: any) => {
  instance.group = group
  api.connect(group)
}

const tableMark = computed(() => (props.marks ?? []).find((mark) => mark.type === "table"))

/** État de vue **interactif** de la table (tri, page) — prioritaire sur les options de la marque */
const sortState = ref<{ field: string; desc: boolean } | null>(null)
const pageState = ref(0)

const table = computed(() =>
  tableMark.value
    ? tableModel(tableMark.value, props.selected ?? null, (props.linkMode as "filter" | "dim") ?? "filter", {
        ...(sortState.value ? { sortBy: sortState.value.field, sortDesc: sortState.value.desc } : {}),
        ...(pageState.value ? { page: pageState.value } : {}),
      })
    : null,
)

/** Style d'une colonne (largeur fixe, alignement) */
const columnStyle = (column: QChartColumn) => ({
  textAlign: column.align,
  ...(column.width !== undefined
    ? { width: typeof column.width === "number" ? `${column.width}px` : column.width }
    : {}),
})

/** Tri suivant : `asc` → `desc` → aucun (l'ordre d'origine revient) */
const toggleSort = (column: QChartColumn) => {
  if (column.sortable === false) return
  const base =
    sortState.value ??
    (tableMark.value?.sortBy
      ? { field: tableMark.value.sortBy, desc: !!tableMark.value.sortDesc }
      : null)
  if (!base || base.field !== column.field) sortState.value = { field: column.field, desc: false }
  else if (!base.desc) sortState.value = { field: column.field, desc: true }
  else sortState.value = null
  pageState.value = 0
}

const sortIndicator = (column: QChartColumn) => {
  const current = sortState.value ?? (tableMark.value?.sortBy ? { field: tableMark.value.sortBy, desc: !!tableMark.value.sortDesc } : null)
  if (!current || current.field !== column.field) return ""
  return current.desc ? "\u2193" : "\u2191"
}

const sortTitle = (column: QChartColumn) => {
  if (column.sortable === false) return ""
  return sortIndicator(column) === "\u2191" ? t("sortDescending") : t("sortAscending")
}

const goPage = (delta: number) => {
  const model = table.value
  if (!model?.pages) return
  pageState.value = Math.max(0, Math.min(model.pages - 1, (model.page ?? 0) + delta))
}

/** Export CSV de **toutes** les lignes visibles (pas seulement la page) */
const exportCsv = () => {
  const model = table.value
  if (!model || typeof window === "undefined" || typeof document === "undefined") return
  const csv = tableCsv(model, { label: t("total") })
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "chart.csv"
  anchor.click()
  URL.revokeObjectURL(url)
}

// Les données changent → le tri et la page repartent de zéro (sinon une page vide peut rester)
watch(
  () => props.marks,
  () => {
    sortState.value = null
    pageState.value = 0
  },
  { deep: true },
)

/** Champ qui porte la clé partagée d'une ligne : le `localField` de `link`, sinon le premier
 *  champ de la première colonne. C'est ce qui alimente `@pick`, la sélection et la mise en
 *  évidence — une ligne se désigne par la même clé que les autres marques. */
const rowKey = (row: any) => {
  const link = typeof tableMark.value?.link === "string" ? tableMark.value.link : tableMark.value?.link?.localField
  const field = link ?? table.value?.columns[0]?.field
  return field !== undefined && row ? row[field] : undefined
}

/** Ligne **hors** sélection, en mode `dim` sur une table liée : elle reste affichée, estompée.
 *  Même règle que les séries : sans `link` la marque ne réagit pas, et sans sélection rien
 *  n'est estompé. */
const isDimmed = (row: any) =>
  props.linkMode === "dim" && !!tableMark.value?.link && !!props.selected && !isSelected(row)

/** La ligne est-elle celle qui est sélectionnée ? (même clé, d'où qu'elle vienne) */
const isSelected = (row: any) => {
  const key = rowKey(row)
  const selected = props.selected
  return key !== undefined && !!selected && typeof selected === "object" && String(selected.name) === String(key)
}

/** Valeur affichée d'une cellule : `format` de la colonne sinon la valeur telle quelle */
const cellValue = (column: QChartColumn, row: any) => {
  const value = row?.[column.field]
  const formatted = column.format?.(value, row)
  if (formatted !== undefined) return formatted
  return value === null || value === undefined ? "" : String(value)
}

/** Sélection émise pour un élément — avec la même règle de re-clic que le reste */
const emitPick = (pick: QChartPick) => {
  if (sameSelection(props.selected, pick)) {
    emit("unpick", pick)
    emit("pick", null)
    return
  }
  emit("pick", pick)
}

/** Clic sur une ligne de table : elle se désigne par sa clé partagée */
const pickRow = (row: any, dataIndex: number) => {
  const markIndex = (props.marks ?? []).findIndex((mark) => mark.type === "table")
  const name = rowKey(row)
  emitPick({
    ...(name !== undefined ? { name } : {}),
    markIndex,
    markType: "table",
    dataIndex,
    origin: "mark",
    data: row,
  })
}

/** Une donnée est-elle présente ? (marque `table` : lignes visibles ; sinon : données déclarées) */
const hasData = computed(() => {
  const marks = props.marks ?? []
  return marks.some((mark) => (mark.data?.length ?? 0) > 0)
})

/** État affiché en surimpression (`loading` > `error` > `empty`) */
const stateKind = computed<"loading" | "error" | "empty" | null>(() => {
  if (props.loading) return "loading"
  if (props.error) return "error"
  if (props.empty ?? !hasData.value) return "empty"
  return null
})

const errorMessage = computed(() =>
  typeof props.error === "string" ? props.error : t("error"),
)

const render = async () => {
  // Une marque `table` remplace le tracé : on libère l'instance si elle existait
  if (tableMark.value) {
    chart.value?.dispose()
    chart.value = undefined
    return
  }
  if (!el.value || typeof window === "undefined") return
  const echarts = await loadECharts()
  if (!el.value) return
  if (!chart.value) {
    chart.value = echarts.init(el.value)
    if (props.group) linkChart(props.group, chart.value, echarts)
    // Clic sur un élément → `@pick` (payload normalisé, cf. `pickFromEvent`). Re-clic sur
    // l'élément **déjà sélectionné** → désélection, comme pour une entrée de légende : les
    // filtres croisés se relâchent (`@unpick` porte l'élément lâché, `@pick` porte `null`).
    chart.value.on("click", (params: any) => {
      // Le moteur ne transmet que sa forme interne (`data: { value: [catégorie, valeur] }`) :
      // on **restaure la ligne d'origine** depuis `marks`, comme pour un clic de légende — c'est
      // elle qui alimente les jointures `link.foreignField`, et c'est la doc qui l'annonce.
      const engine = pickFromEvent(params)
      if (engine.name === undefined && engine.dataIndex === undefined) return
      const identity = legendPickOf(props.marks, String(engine.name), engine.markIndex)
      const pick: QChartPick = {
        ...engine,
        // `origin` reste celui du moteur (`mark`) : `legendPickOf` ne fait que compléter
        // l'identité — la ligne d'origine, la position dans `marks`, la valeur (pas la paire
        // interne `[catégorie, valeur]`).
        origin: engine.origin ?? identity.origin,
        markIndex: identity.markIndex ?? engine.markIndex,
        markName: identity.markName ?? engine.markName,
        markType: identity.markType ?? engine.markType,
        dataIndex: identity.dataIndex ?? engine.dataIndex,
        data: identity.data ?? engine.data,
        value: identity.value ?? engine.value,
      }
      emitPick(pick)
    })
    // Clic sur la **légende** : avec `legend.action: 'select'`, la légende sert de sélecteur —
    // ECharts a basculé l'élément (il masquerait la part/la série), on le rétablit puis on
    // émet le pick ; un second clic sur le même nom efface la sélection.
    chart.value.on("legendselectchanged", (event: any) => {
      const legend = props.legend && typeof props.legend === "object" ? props.legend : undefined
      if (legend?.action !== "select") return
      const name = event?.name
      if (name === undefined || name === null) return
      // Le moteur a basculé l'entrée : on la rétablit, la sélection est notre affaire
      if (event?.selected?.[name] === false) chart.value?.dispatchAction({ type: "legendSelect", name })
      // Même identité qu'un clic sur un élément : marque (index, nom, type) + donnée (index,
      // ligne, valeur) — le clic de légende ne porte que le nom.
      const entry = legendPickOf(props.marks, name)
      // Re-clic sur le nom courant → `null` (désélection) ; sinon on bascule sur ce nom.
      // La désélection est signalée deux fois : `@unpick` porte l'élément lâché, `@pick`
      // porte l'état (`null`).
      const next = nextLegendPick(props.selected, name, entry.data)
      if (next === null) emit("unpick", entry)
      emit("pick", next === null ? null : entry)
    })
    emit("ready", chart.value)
  }
  chart.value.setOption(build(), { notMerge: true })
  chart.value.resize()
  applySelection()
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
  // `selected` en fait partie : la sélection change **l'option** (lignes jointes filtrées ou
  // estompées) — sans lui, les autres graphiques liés ne suivaient pas.
  () => [
    props.marks,
    props.selected,
    props.x,
    props.y,
    props.yRight,
    props.locale,
    props.compact,
    props.title,
    props.colors,
    props.legend,
    props.tooltip,
    props.options,
  ],
  async () => {
    // `nextTick` : le template a pu passer d'une table à un tracé (ou l'inverse)
    await nextTick()
    void render()
  },
  { deep: true },
)

// Le groupe peut arriver après le montage (`:group="groupe"` calculé) : on relie alors les
// graphiques déjà montés du même groupe.
watch(
  () => props.group,
  async (group) => {
    if (!group) return
    const echarts = await loadECharts()
    if (props.group === group && chart.value) linkChart(group, chart.value, echarts)
  },
)

/** Sélection venue de l'extérieur (souvent le `@pick` d'un autre graphique) → mise en
 *  évidence des éléments qui portent ce nom, dans toutes les séries. */
const applySelection = () => {
  // ⚠️ ne pas nommer la locale `chart` : elle masquerait la ref du même nom (TDZ).
  const instance = chart.value
  if (!instance) return
  // En mode `dim`, c'est l'état **`select`** qui ramène la sélection au plein contraste (les
  // autres gardent l'opacité réduite) ; sinon c'est `highlight`. Les deux locales sont
  // déclarées **avant** tout usage (piège TDZ).
  const dim = props.linkMode === "dim"
  const selection = props.selected
  instance.dispatchAction({ type: dim ? "unselect" : "downplay" })
  if (!selection || typeof selection !== "object") return
  // Le `name` est la clé partagée entre graphiques : visé dans toutes les séries.
  // Sans nom (sélection réduite à une identité), on cible l'élément précis.
  if (selection.name !== undefined) {
    instance.dispatchAction(dim ? { type: "select", name: selection.name } : { type: "highlight", name: selection.name })
  } else if (selection.markIndex !== undefined && selection.dataIndex !== undefined) {
    const target = { seriesIndex: selection.markIndex, dataIndex: selection.dataIndex }
    instance.dispatchAction(dim ? { type: "select", ...target } : { type: "highlight", ...target })
  }
}

watch(() => props.selected, applySelection)

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
  <!-- Marque `table` : les données en HTML (sélection, jointure, tri, pagination et `@pick` comme le reste) -->
  <div
    v-if="table"
    class="q-chart q-chart--table"
    :style="{ maxHeight: typeof height === 'number' ? `${height}px` : height }"
    role="table"
    :aria-label="title || 'Table'"
  >
    <div v-if="exportable" class="q-chart__table-bar">
      <button type="button" class="q-chart__table-action" @click="exportCsv">
        {{ t("exportCsv") }}
      </button>
    </div>
    <table :class="`is-${table.separator}`">
      <thead>
        <tr>
          <th
            v-for="column in table.columns"
            :key="column.field"
            :style="columnStyle(column)"
            :title="sortTitle(column)"
            :class="{ 'is-sortable': column.sortable !== false }"
            :aria-sort="sortIndicator(column) === '↑' ? 'ascending' : sortIndicator(column) === '↓' ? 'descending' : 'none'"
            @click="toggleSort(column)"
          >
            {{ column.label }}
            <span v-if="sortIndicator(column)" class="q-chart__sort">{{ sortIndicator(column) }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in table.rows"
          :key="index"
          :class="{ 'is-selected': isSelected(row), 'is-dimmed': isDimmed(row) }"
          :style="isDimmed(row) ? { opacity: dimOpacity } : undefined"
          @click="pickRow(row, index)"
        >
          <td v-for="column in table.columns" :key="column.field" :style="columnStyle(column)">
            {{ cellValue(column, row) }}
          </td>
        </tr>
      </tbody>
      <tfoot v-if="table.totals">
        <tr>
          <td v-for="column in table.columns" :key="column.field" :style="columnStyle(column)">
            {{ table.totals[column.field] ?? "" }}
          </td>
        </tr>
      </tfoot>
    </table>
    <p v-if="table.rows.length === 0" class="q-chart__empty">{{ t("empty") }}</p>
    <div v-if="table.pages && table.pages > 1" class="q-chart__pager">
      <button
        type="button"
        class="q-chart__table-action"
        :disabled="(table.page ?? 0) <= 0"
        @click="goPage(-1)"
      >
        ‹
      </button>
      <span class="q-chart__pager-label">{{ fmtPage((table.page ?? 0) + 1, table.pages) }}</span>
      <button
        type="button"
        class="q-chart__table-action"
        :disabled="(table.page ?? 0) >= table.pages - 1"
        @click="goPage(1)"
      >
        ›
      </button>
    </div>
  </div>

  <div
    v-else
    class="q-chart q-chart--plot"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  >
    <div
      ref="el"
      class="q-chart__canvas"
      role="img"
      :aria-label="title || 'Chart'"
      :aria-busy="stateKind === 'loading' || undefined"
    ></div>
    <div v-if="stateKind" class="q-chart__state" :class="`q-chart__state--${stateKind}`" role="status">
      <slot v-if="stateKind === 'loading'" name="loading">{{ t("loading") }}</slot>
      <slot v-else-if="stateKind === 'error'" name="error">{{ errorMessage }}</slot>
      <slot v-else name="empty">{{ t("empty") }}</slot>
    </div>
  </div>
</template>

<style scoped>
/* Marque `table` : mêmes jetons que le reste, en-tête collant, chiffres alignés.
   Les **séparateurs** se règlent par marque (`separator`) : `horizontal` par défaut, puis
   `vertical`, `grid` (les deux) ou `none`. */
.q-chart--table {
  overflow: auto;
  font-size: 13px;
}

.q-chart--table table {
  width: 100%;
  border-collapse: collapse;
}

.q-chart--table th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 6px 10px;
  font-weight: 600;
  color: var(--muted-foreground, #71717a);
  text-align: start;
  border-bottom: 1px solid var(--border, #e4e4e7);
  background: var(--card, #fff);
}

.q-chart--table td {
  padding: 6px 10px;
  font-variant-numeric: tabular-nums;
}

/* `horizontal` (défaut) — un trait sous chaque rangée (l'en-tête garde le sien, plus marqué) */
.q-chart--table table.is-horizontal td {
  border-bottom: 1px solid var(--border, #f1f1f3);
}

/* `vertical` — un trait entre les colonnes */
.q-chart--table table.is-vertical th + th,
.q-chart--table table.is-vertical td + td {
  border-left: 1px solid var(--border, #f1f1f3);
}

/* `grid` — les deux, en gardant l'en-tête plus marqué */
.q-chart--table table.is-grid th,
.q-chart--table table.is-grid td {
  border: 1px solid var(--border, #f1f1f3);
}

/* `none` — plus aucun trait de rangée (l'en-tête garde le sien) */
.q-chart--table table.is-none td {
  border-bottom: 0;
}

.q-chart--table tbody tr {
  cursor: pointer;
}

.q-chart--table tbody tr:hover {
  background: var(--accent, #f4f4f5);
}

.q-chart--table tbody tr.is-selected {
  box-shadow: inset 2px 0 0 var(--primary, #2563eb);
  background: var(--accent, #f4f4f5);
}

.q-chart__empty {
  margin: 8px 10px;
  font-size: 12px;
  color: var(--muted-foreground, #71717a);
}
.q-chart {
  width: 100%;
}

/* ─── Tracé (canvas + surimpression d'état) ─── */
.q-chart--plot {
  position: relative;
  width: 100%;
}

.q-chart__canvas {
  width: 100%;
  height: 100%;
}

/* États `loading` / `empty` / `error` : une surimpression lisible sur le thème hôte */
.q-chart__state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  font-size: 13px;
  text-align: center;
  color: var(--muted-foreground, #71717a);
  background: color-mix(in srgb, var(--card, #ffffff) 76%, transparent);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.q-chart__state--error {
  color: var(--negative, #c10015);
}

/* ─── Table BI (barre d'outils, tri, totaux, pagination) ─── */
.q-chart__table-bar {
  display: flex;
  justify-content: flex-end;
  padding: 4px 10px;
}

.q-chart__table-action {
  padding: 2px 8px;
  font: inherit;
  font-size: 12px;
  color: var(--muted-foreground, #71717a);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--border, #e4e4e7);
  border-radius: 4px;
}

.q-chart__table-action:hover:not(:disabled) {
  color: var(--foreground, #18181b);
  background: var(--accent, #f4f4f5);
}

.q-chart__table-action:disabled {
  cursor: default;
  opacity: 0.45;
}

.q-chart--table th.is-sortable {
  cursor: pointer;
  user-select: none;
}

.q-chart__sort {
  margin-left: 4px;
  font-size: 10px;
  opacity: 0.75;
}

.q-chart--table tfoot td {
  font-weight: 600;
  border-top: 1px solid var(--border, #e4e4e7);
}

.q-chart__pager {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--muted-foreground, #71717a);
}
</style>
