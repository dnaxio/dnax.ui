<script setup lang="ts">
// Démos live « Charts » : marks littéraux `{ type, data, x, y, … }`.
import { reactive, ref } from "vue"
import type { QChartPick } from "@dnax/ui"

/** Sélection partagée, **une clé par démo** : plusieurs démos vivent sur la même page, elles
 *  ne doivent pas se contaminer. `picked.interaction`, `picked.select`… */
const picked = reactive<Record<string, QChartPick | null>>({})

/** Démo `link-app` : la sélection vient d'un `<select>`, pas d'un clic sur un graphique */
const appMonth = ref("")

/** Dernier élément **désélectionné** (`@unpick`) — la démo affiche l'événement */
const dropped = ref("")

defineProps<{
  /** Identifiant de la démo à afficher */
  demo:
    | "line"
    | "bar"
    | "rule"
    | "dot"
    | "image"
    | "image-round"
    | "text"
    | "pie"
    | "heatmap"
    | "table"
    | "legend"
    | "interaction"
    | "link-hover"
    | "link-select"
    | "link-legend"
    | "link-fields"
    | "link-app"
    | "link-dim"
    | "link-filter"
    | "table-separators"
    | "overview"
}>()

const monthly = [
  { month: "Jan", revenue: 42, cost: 28 },
  { month: "Feb", revenue: 51, cost: 31 },
  { month: "Mar", revenue: 47, cost: 30 },
  { month: "Apr", revenue: 63, cost: 35 },
  { month: "May", revenue: 72, cost: 38 },
  { month: "Jun", revenue: 68, cost: 41 },
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const sales = months.flatMap((month, i) => [
  { month, channel: "Online", value: 20 + ((i * 7) % 23) },
  { month, channel: "Store", value: 12 + ((i * 5) % 17) },
])

// `dot` : deux axes de valeurs + une taille par point (bulles)
const campaigns = [
  { campaign: "Outlet", spend: 8, revenue: 19, orders: 5 },
  { campaign: "Spring", spend: 12, revenue: 30, orders: 8 },
  { campaign: "Autumn", spend: 17, revenue: 41, orders: 11 },
  { campaign: "Summer", spend: 21, revenue: 48, orders: 14 },
  { campaign: "Winter", spend: 29, revenue: 62, orders: 19 },
]

// `image` : une photo par point. On garde l'id Unsplash et on demande à imgix un carré
// 200×200 centré sur les visages — une page de doc ne doit pas charger du 1470 px.
const photo = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=200&h=200&fit=crop&crop=faces&auto=format`

const team = [
  { name: "Amina", experience: 3, score: 4.6, src: photo("photo-1502323777036-f29e3972d82f") },
  { name: "Bastien", experience: 6, score: 4.2, src: photo("photo-1611590027211-b954fd027b51") },
  { name: "Chloé", experience: 2, score: 4.8, src: photo("photo-1753381449444-9fe1d1cf5b5b") },
  // celle-ci vit sur plus.unsplash.com (photos premium)
  {
    name: "Dan",
    experience: 9,
    score: 3.9,
    src: "https://plus.unsplash.com/premium_photo-1714340726276-5f6897ddc3ca?q=80&w=200&h=200&fit=crop&crop=faces&auto=format",
  },
  { name: "Elif", experience: 5, score: 4.4, src: photo("photo-1568579569464-f87941549e29") },
]
// `legend` : deux séries nommées, réutilisées par les trois placements de légende
const legendMarks = [
  { type: "line", data: monthly, x: "month", y: "revenue", stroke: "primary", name: "Revenue" },
  { type: "line", data: monthly, x: "month", y: "cost", stroke: "chart-2", name: "Cost" },
]

// `image-round` : les mêmes portraits, servis **au format du marqueur** (44 px) — le motif
// est peint à la taille native de l'image, une source plus grande serait rognée en haut à gauche
const avatars = team.map((m) => ({ ...m, src: m.src.replace("w=200&h=200", "w=44&h=44") }))

// `heatmap` : une cellule par ligne — `x` = la colonne, `y` = la ligne, `fill` = la valeur
const temps = [
  { day: "Mon", hour: "9h", temp: 12 },
  { day: "Mon", hour: "13h", temp: 21 },
  { day: "Mon", hour: "17h", temp: 19 },
  { day: "Tue", hour: "9h", temp: 8 },
  { day: "Tue", hour: "13h", temp: 18 },
  { day: "Tue", hour: "17h", temp: 23 },
  { day: "Wed", hour: "9h", temp: 14 },
  { day: "Wed", hour: "13h", temp: 26 },
  { day: "Wed", hour: "17h", temp: 30 },
  { day: "Thu", hour: "9h", temp: 10 },
  { day: "Thu", hour: "13h", temp: 24 },
  { day: "Thu", hour: "17h", temp: 27 },
]

// `pie` : une part par ligne — `x` = le libellé de la part, `y` = sa valeur
/** Même chose que `monthly`, mais le champ s'appelle `label` — démo de jointure `foreignField` */
const byLabel = monthly.map((m) => ({ label: m.month, revenue: m.revenue }))

const share = [
  { channel: "Online", revenue: 62 },
  { channel: "Store", revenue: 41 },
  { channel: "Partners", revenue: 27 },
  { channel: "Other", revenue: 12 },
]
</script>

<template>
  <div v-if="demo === 'line'" class="demo-chart">
    <q-chart
      title="Revenue vs cost"
      :height="260"
      :marks="[
        { type: 'line', data: monthly, x: 'month', y: 'revenue', stroke: 'primary', name: 'Revenue' },
        { type: 'line', data: monthly, x: 'month', y: 'cost', stroke: 'chart-2', name: 'Cost' },
        { type: 'dot', data: monthly, x: 'month', y: 'revenue', fill: 'primary', r: 3 },
      ]"
    />
  </div>

  <div v-else-if="demo === 'bar'" class="demo-chart">
    <q-chart
      title="Sales per channel"
      :height="260"
      :marks="[{ type: 'bar', data: sales, x: 'month', y: 'value', z: 'channel', stack: true }]"
    />
  </div>

  <div v-else-if="demo === 'rule'" class="demo-chart">
    <q-chart
      title="Sales vs target"
      :height="260"
      :marks="[
        { type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue', link: 'month' },
        { type: 'rule', y: [50], stroke: 'chart-5' },
        { type: 'rule', x: ['Apr'], stroke: 'negative', strokeWidth: 2 },
      ]"
    />
  </div>

  <div v-else-if="demo === 'dot'" class="demo-chart">
    <q-chart
      title="Revenue vs ad spend"
      :height="260"
      :x="{ label: 'Ad spend (k€)' }"
      :y="{ label: 'Revenue (k€)' }"
      :marks="[
        {
          type: 'dot',
          data: campaigns,
          x: 'spend',
          y: 'revenue',
          r: 'orders',
          fill: 'chart-1',
          stroke: '#fff',
          strokeWidth: 2,
          title: 'campaign',
        },
      ]"
    />
  </div>

  <div v-else-if="demo === 'image'" class="demo-chart">
    <q-chart
      title="Team"
      :height="260"
      :x="{ label: 'Experience (years)', min: 0 }"
      :y="{ label: 'Review score', min: 3 }"
      :marks="[
        { type: 'image', data: team, x: 'experience', y: 'score', src: 'src', r: 22, title: 'name' },
      ]"
    />
  </div>

  <div v-else-if="demo === 'text'" class="demo-chart">
    <q-chart
      title="Revenue, labeled"
      :height="260"
      :marks="[
        { type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue', link: 'month' },
        {
          type: 'text',
          data: monthly,
          x: 'month',
          y: 'revenue',
          text: (d) => `${d.revenue}`,
          lineAnchor: 'bottom',
          dy: -6,
          fill: 'primary',
          fontWeight: 'bold',
        },
        { type: 'rule', y: [50], stroke: 'chart-5' },
      ]"
    />
  </div>

  <div v-else-if="demo === 'pie'" class="demo-chart demo-stack">
    <!-- Sans `radius` : le camembert par défaut (70 % du conteneur) -->
    <q-chart
      :height="230"
      :marks="[
        { type: 'pie', data: share, x: 'channel', y: 'revenue', labels: 'name-percent', name: 'Revenue' },
      ]"
    />
    <!-- `radius` en pourcentage : le même camembert, plus compact -->
    <q-chart
      :height="230"
      :marks="[
        { type: 'pie', data: share, x: 'channel', y: 'revenue', radius: '45%', labels: 'percent' },
      ]"
    />
    <!-- `radius` en pixels + `innerRadius` : un anneau de 180 px de diamètre -->
    <q-chart
      :height="230"
      :marks="[
        {
          type: 'pie',
          data: share,
          x: 'channel',
          y: 'revenue',
          radius: 90,
          innerRadius: 55,
          labels: false,
        },
      ]"
    />
  </div>

  <div v-else-if="demo === 'heatmap'" class="demo-chart">
    <q-chart
      title="Temperature by hour"
      :height="260"
      :x="{ label: 'Hour' }"
      :y="{ label: 'Day' }"
      :marks="[
        {
          type: 'heatmap',
          data: temps,
          x: 'hour',
          y: 'day',
          fill: 'temp',
          labels: true,
          name: 'Temperature',
        },
      ]"
    />
  </div>

  <div v-else-if="demo === 'legend'" class="demo-chart demo-stack">
    <q-chart :height="170" :marks="legendMarks" :legend="{ position: 'top', offset: 32 }" />
    <q-chart
      :height="170"
      :marks="legendMarks"
      :legend="{ position: 'bottom', align: 'center' }"
    />
    <q-chart :height="190" :marks="legendMarks" :legend="{ position: 'right' }" />
  </div>

  <div v-else-if="demo === 'image-round'" class="demo-chart">
    <q-chart
      title="Team"
      :height="260"
      :x="{ label: 'Experience (years)', min: 0 }"
      :y="{ label: 'Review score', min: 3 }"
      :marks="[
        {
          type: 'image',
          data: avatars,
          x: 'experience',
          y: 'score',
          src: 'src',
          r: 22,
          round: true,
          stroke: 'primary',
          strokeWidth: 2,
          title: 'name',
        },
      ]"
    />
  </div>

  <div v-else-if="demo === 'interaction'" class="demo-chart">
    <div class="demo-grid">
      <!-- Bar: the revenue per month -->
      <q-chart
        :height="200"
        group="revenue"
        :selected="picked.interaction"
        :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue', link: 'month' }]"
        @pick="picked.interaction = $event"
      />
      <!-- Pie: the share of each month, with its own legend -->
      <q-chart
        :height="200"
        group="revenue"
        :selected="picked.interaction"
        :legend="{ position: 'right', offset: 36, action: 'select' }"
        :marks="[
          { type: 'pie', data: monthly, x: 'month', y: 'revenue', radius: '48%', labels: 'percent', name: 'Revenue' },
        ]"
        @pick="picked.interaction = $event"
      />
      <!-- Line: the cost trend -->
      <q-chart
        :height="200"
        group="revenue"
        :selected="picked.interaction"
        :marks="[{ type: 'line', data: monthly, x: 'month', y: 'cost', stroke: 'primary', name: 'Cost', link: 'month' }]"
        @pick="picked.interaction = $event"
      />
      <!-- Dot: the revenue again, point by point -->
      <q-chart
        :height="200"
        group="revenue"
        :selected="picked.interaction"
        :marks="[{ type: 'dot', data: monthly, x: 'month', y: 'revenue', fill: 'chart-2', r: 5, name: 'Revenue', link: 'month' }]"
        @pick="picked.interaction = $event"
      />
    </div>
    <p class="demo-picked">
      <template v-if="picked.interaction">
        Clicked: <b>{{ picked.interaction.name ?? "no datum" }}</b>
        <span v-if="picked.interaction.value !== undefined"> · {{ picked.interaction.value }}</span>
        <span v-if="picked.interaction.markName"> · {{ picked.interaction.markName }}</span>
      </template>
      <template v-else>Click a bar, a slice or a legend entry — the four follow.</template>
    </p>
  </div>

  <!-- ── Démos « Interaction » : une par concept ─────────────────────────────── -->

  <!-- `group` seul : rien d'autre que le survol -->
  <div v-else-if="demo === 'link-hover'" class="demo-chart demo-stack">
    <q-chart
      :height="170"
      group="hover"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue' }]"
    />
    <q-chart
      :height="170"
      group="hover"
      :marks="[{ type: 'line', data: monthly, x: 'month', y: 'cost', stroke: 'primary', name: 'Cost' }]"
    />
    <p class="demo-picked">
      Hover a month: the pointer and the tooltip follow in both charts, each reading its own
      value. No <code>@pick</code>, no <code>link</code> — only <code>group</code>.
    </p>
  </div>

  <!-- `selected` seul : mise en évidence, aucun filtrage (`link` absent) -->
  <div v-else-if="demo === 'link-select'" class="demo-chart demo-stack">
    <q-chart
      :height="170"
      group="select"
      :selected="picked.select"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue' }]"
      @pick="picked.select = $event"
    />
    <q-chart
      :height="170"
      group="select"
      :selected="picked.select"
      :marks="[{ type: 'dot', data: monthly, x: 'month', y: 'cost', fill: 'chart-4', r: 5, name: 'Cost' }]"
      @pick="picked.select = $event"
    />
    <p class="demo-picked">
      <template v-if="picked.select">
        Selected <b>{{ picked.select.name }}</b> — highlighted in both charts, and
        <b>nothing is filtered</b>: no mark declares <code>link</code>.
      </template>
      <template v-else>
        Click a bar or a dot: it lights up in both charts — nothing is filtered. Click the same one
        again to clear it.
      </template>
    </p>
  </div>

  <!-- Légende sélectrice : un clic dans la légende filtre le second graphique -->
  <div v-else-if="demo === 'link-legend'" class="demo-chart demo-stack">
    <q-chart
      :height="210"
      :legend="{ position: 'right', offset: 36, action: 'select' }"
      :selected="picked.legend"
      :marks="[
        { type: 'pie', data: monthly, x: 'month', y: 'revenue', radius: '52%', labels: 'percent', name: 'Revenue' },
      ]"
      @pick="picked.legend = $event"
      @unpick="dropped = $event.name"
    />
    <q-chart
      :height="180"
      :selected="picked.legend"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue', link: 'month' }]"
      @pick="picked.legend = $event"
    />
    <p class="demo-picked">
      <template v-if="picked.legend">
        Selected <b>{{ picked.legend.name }}</b> — the bar keeps that month only, the pie keeps all
        its slices. Click the same legend entry again to clear, or
        <button class="demo-clear" type="button" @click="picked.legend = null">Clear</button>
      </template>
      <template v-else>
        <b>No selection</b><span v-if="dropped"> (unpicked <b>{{ dropped }}</b> — <code>@unpick</code>)</span>
        — every month is shown. Click <b>Jan</b> in the pie's legend (the legend is a
        <b>selector</b>, <code>action: 'select'</code>).
      </template>
    </p>
  </div>

  <!-- Jointure sur des champs nommés différemment (`foreignField`) -->
  <div v-else-if="demo === 'link-fields'" class="demo-chart demo-stack">
    <q-chart
      :height="170"
      :selected="picked.fields"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue' }]"
      @pick="picked.fields = $event"
    />
    <q-chart
      :height="170"
      :selected="picked.fields"
      :marks="[
        { type: 'bar', data: byLabel, x: 'label', y: 'revenue', fill: 'chart-3', name: 'Revenue', link: { localField: 'label', foreignField: 'month' } },
      ]"
      @pick="picked.fields = $event"
    />
    <p class="demo-picked">
      Click a month above: the second chart groups by <code>label</code> but joins on
      <code>month</code> — <code>link: { localField: 'label', foreignField: 'month' }</code>.
    </p>
  </div>

  <!-- La sélection ne vient pas d'un graphique : un `<select>` la pilote -->
  <div v-else-if="demo === 'link-app'" class="demo-chart demo-stack">
    <p class="demo-picked">
      <select v-model="appMonth" class="demo-select">
        <option value="">All months</option>
        <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
      </select>
    </p>
    <q-chart
      :height="160"
      :selected="appMonth ? { name: appMonth } : null"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue', link: 'month' }]"
    />
    <q-chart
      :height="160"
      :selected="appMonth ? { name: appMonth } : null"
      :marks="[{ type: 'dot', data: monthly, x: 'month', y: 'cost', fill: 'chart-4', r: 4, name: 'Cost', link: 'month' }]"
    />
    <p class="demo-picked">
      <template v-if="appMonth">
        Selected <b>{{ appMonth }}</b> — filtered from outside the charts. Back to
        <b>All months</b> above to clear it, or
        <button class="demo-clear" type="button" @click="appMonth = ''">Clear</button>
      </template>
      <template v-else>
        <b>No selection</b> — both charts show everything. Pick a month above: they follow, with no
        click on a chart at all.
      </template>
    </p>
  </div>

  <!-- Marque `table` : les mêmes données, la même sélection — en HTML -->
  <div v-else-if="demo === 'table'" class="demo-chart demo-stack">
    <q-chart
      :height="200"
      :selected="picked.table"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue' }]"
      @pick="picked.table = $event"
    />
    <q-chart
      :height="240"
      :selected="picked.table"
      :marks="[
        {
          type: 'table',
          data: monthly,
          link: 'month',
          columns: [
            { field: 'month', label: 'Month' },
            { field: 'revenue', label: 'Revenue', align: 'end' },
            { field: 'cost', label: 'Cost', align: 'end' },
            {
              field: 'revenue',
              label: 'Margin',
              align: 'end',
              format: (_value, row) => `${row.revenue - row.cost}`,
            },
          ],
        },
      ]"
      @pick="picked.table = $event"
    />
    <p class="demo-picked">
      <template v-if="picked.table">
        <b>{{ picked.table.name }}</b> selected — the bar keeps that month and the table keeps one
        row (<code>link: 'month'</code>). Click it again to clear.
      </template>
      <template v-else>
        Click a bar: the table filters to that month. Click a row: the bar follows. Same data, same
        selection — and a table mark draws no canvas.
      </template>
    </p>
  </div>

  <!-- Mode par défaut `filter` : les autres mois **disparaissent**, l'axe se recale -->
  <div v-else-if="demo === 'link-filter'" class="demo-chart demo-stack">
    <q-chart
      :height="200"
      :selected="picked.filter"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue', link: 'month' }]"
      @pick="picked.filter = $event"
    />
    <q-chart
      :height="200"
      :selected="picked.filter"
      :marks="[{ type: 'line', data: monthly, x: 'month', y: 'cost', stroke: 'primary', name: 'Cost', link: 'month' }]"
      @pick="picked.filter = $event"
    />
    <p class="demo-picked">
      <template v-if="picked.filter">
        <b>{{ picked.filter.name }}</b> selected — the other months are <b>removed</b> and the axis
        rescales to that one month. Click the same one again to clear, or
        <button class="demo-clear" type="button" @click="picked.filter = null">Clear</button>
      </template>
      <template v-else>
        Click a month: with the default <code>filter</code> mode the others <b>disappear</b> and the
        axis rescales — compare with <code>dim</code> below.
      </template>
    </p>
  </div>

  <!-- `link-mode="dim"` : les autres mois sont estompés au lieu de disparaître -->
  <div v-else-if="demo === 'table-separators'" class="demo-chart">
    <p class="demo-picked">
      Separators are chosen <b>per mark</b> with <code>separator</code> — <code>horizontal</code>
      by default: one line under each row, and the header keeps a stronger one.
    </p>
    <div class="demo-grid">
      <div v-for="mode in (['horizontal', 'vertical', 'grid', 'none'] as const)" :key="mode">
        <p class="demo-picked"><code>separator: '{{ mode }}'</code></p>
        <q-chart
          :marks="[
            { type: 'table', data: monthly.slice(0, 4), separator: mode,
              columns: [
                { field: 'month', label: 'Month' },
                { field: 'revenue', label: 'Revenue', align: 'end' },
                { field: 'cost', label: 'Cost', align: 'end' },
              ] },
          ]"
        />
      </div>
    </div>
  </div>

  <div v-else-if="demo === 'link-dim'" class="demo-chart demo-stack">
    <q-chart
      :height="200"
      link-mode="dim"
      :selected="picked.dim"
      :marks="[{ type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue', link: 'month' }]"
      @pick="picked.dim = $event"
    />
    <q-chart
      :height="200"
      link-mode="dim"
      :selected="picked.dim"
      :marks="[{ type: 'line', data: monthly, x: 'month', y: 'cost', stroke: 'primary', name: 'Cost', link: 'month' }]"
      @pick="picked.dim = $event"
    />
    <!-- La même sélection, en tableau : la marque `table` suit le mode du chart. Un petit
         dashboard : deux graphiques + les données, tout réagit au même clic. -->
    <q-chart
      link-mode="dim"
      :selected="picked.dim"
      title="Monthly detail"
      :marks="[
        {
          type: 'table',
          data: monthly,
          link: 'month',
          columns: [
            { field: 'month', label: 'Month' },
            { field: 'revenue', label: 'Revenue', align: 'end' },
            { field: 'cost', label: 'Cost', align: 'end' },
          ],
        },
      ]"
      @pick="picked.dim = $event"
    />
    <p class="demo-picked">
      <template v-if="picked.dim">
        <b>{{ picked.dim.name }}</b> selected — the other months are <b>dimmed</b>, not removed: the
        axis, the colours and the shape stay readable, and the <b>table rows</b> fade too (the
        numbers stay there, ready to compare). Click the same one again to clear, or
        <button class="demo-clear" type="button" @click="picked.dim = null">Clear</button>
      </template>
      <template v-else>
        Click a month — in the bars, the line <em>or a table row</em>: with
        <code>link-mode="dim"</code> the others fade out instead of disappearing. The default is
        <code>filter</code> — see the demo above.
      </template>
    </p>
  </div>

  <div v-else class="demo-chart">
    <q-chart
      title="Overview"
      :height="260"
      :marks="[
        { type: 'bar', data: monthly, x: 'month', y: 'cost', fill: 'chart-3', name: 'Cost' },
        { type: 'line', data: monthly, x: 'month', y: 'revenue', stroke: 'primary', name: 'Revenue' },
        { type: 'rule', y: [50], stroke: 'chart-5' },
      ]"
    />
  </div>
</template>

<style scoped>
.demo-chart {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

/* Plusieurs graphiques empilés (démo « legend ») */
.demo-stack {
  display: grid;
  gap: 18px;
}

/* Grille 2×2 des graphiques liés (démo « interaction ») */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 720px) {
  .demo-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Sélecteur externe (démo « link-app ») */
.demo-select {
  padding: 4px 10px;
  border: 1px solid var(--border, #e4e4e7);
  border-radius: 8px;
  background: var(--card, #fff);
  color: inherit;
  font: inherit;
}

/* Bouton de désélection (démos « link-legend » / « link-app ») */
.demo-clear {
  padding: 2px 9px;
  border: 1px solid var(--border, #e4e4e7);
  border-radius: 999px;
  background: var(--card, #fff);
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.demo-clear:hover {
  background: var(--accent, #f4f4f5);
}

/* Retour du clic (démo « interaction ») */
.demo-picked {
  margin: 0;
  text-align: center;
  font-size: 12px;
  color: #71717a;
}
</style>
