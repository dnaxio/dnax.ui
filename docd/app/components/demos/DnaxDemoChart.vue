<script setup lang="ts">
// Démos live « Charts » : marks littéraux `{ type, data, x, y, … }`.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "line" | "bar" | "rule" | "dot" | "image" | "text" | "pie" | "heatmap" | "overview"
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
        { type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue' },
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
        { type: 'bar', data: monthly, x: 'month', y: 'revenue', fill: 'chart-1', name: 'Revenue' },
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

  <div v-else-if="demo === 'pie'" class="demo-chart">
    <q-chart
      title="Revenue by channel"
      :height="260"
      :marks="[
        {
          type: 'pie',
          data: share,
          x: 'channel',
          y: 'revenue',
          radius: '75%',
          innerRadius: '45%',
          labels: 'name-percent',
          name: 'Revenue',
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
</style>
