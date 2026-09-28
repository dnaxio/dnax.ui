<script setup lang="ts">
// Live demos de la page Maps (q-map) : le SDK MapTiler n'est chargé que côté client.
// Sans clé d'API (env NUXT_PUBLIC_MAPTILER_API_KEY), les démos passent au fournisseur
// OSM (raster sans clé) pour rester visibles partout — les démos `styles` et `terrain`
// sont alors sans effet : elles ne portent que sur les styles MapTiler.
import { computed, ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "marks" | "styles" | "terrain" | "openstreetmap" | "leaflet" | "maplibre"
}>()

const publicConfig = useRuntimeConfig().public as Record<string, unknown>
const apiKey = computed(() => String(publicConfig.maptilerApiKey ?? ""))
const provider = computed(() => (apiKey.value ? "maptiler" : "openstreetmap"))

const PARIS: [number, number] = [2.3522, 48.8566]
// Massif du Mont-Blanc : le relief 3D s'y voit immédiatement
const MONT_BLANC: [number, number] = [6.8649, 45.8327]

// — styles nommés du SDK —
const STYLES = ["streets", "basic", "dataviz", "outdoor", "satellite"] as const
const mapStyle = ref<string>("streets")

// — relief & projection —
const terrain = ref(true)
const globe = ref(false)

const basicMarks = [
  { type: "marker" as const, position: PARIS, label: "Paris", color: "primary" },
]

const marks = [
  {
    type: "marker" as const,
    position: [2.2945, 48.8584] as [number, number],
    label: "Tour Eiffel",
    color: "primary",
    open: true,
  },
  {
    type: "marker" as const,
    position: [2.3499, 48.853] as [number, number],
    html: "<b>Notre-Dame</b><br />Île de la Cité",
    color: "chart-2",
  },
  { type: "marker" as const, position: [2.3431, 48.8615] as [number, number], color: "negative" },
  {
    type: "popup" as const,
    position: [2.3376, 48.8606] as [number, number],
    label: "Le Louvre",
    open: true,
  },
]

const picked = ref<string | null>(null)

const onPick = (payload: { mark: { label?: string }; lat: number; lng: number }) => {
  picked.value = `${payload.mark.label ?? "Marque"} — ${payload.lat.toFixed(4)}, ${payload.lng.toFixed(4)}`
}
</script>

<template>
  <div class="demo-map">
    <q-map
      v-if="demo === 'basic'"
      :provider="provider"
      :api-key="apiKey"
      :center="PARIS"
      :zoom="11.5"
      :marks="basicMarks"
      :height="340"
    />

    <template v-else-if="demo === 'marks'">
      <q-map
        :provider="provider"
        :api-key="apiKey"
        :center="[2.3364, 48.8606]"
        :zoom="12.6"
        :marks="marks"
        :height="340"
        @pick="onPick"
      />
      <p class="demo-meta">@pick → {{ picked ?? "cliquez une marque" }}</p>
    </template>

    <template v-else-if="demo === 'openstreetmap'">
      <q-map
        provider="openstreetmap"
        :center="PARIS"
        :zoom="11.5"
        :marks="basicMarks"
        :height="340"
      />
      <p class="demo-meta">
        provider="openstreetmap" — aucune clé, aucune session comptée : la carte reste
        identique en mode sombre (raster OpenStreetMap).
      </p>
    </template>

    <template v-else-if="demo === 'leaflet'">
      <q-map
        provider="leaflet"
        :center="[2.3364, 48.8606]"
        :zoom="12.6"
        :marks="marks"
        :height="340"
        @pick="onPick"
      />
      <p class="demo-meta">
        provider="leaflet" — moteur Leaflet (tuiles raster sans clé), épingles SVG colorées ;
        @pick → {{ picked ?? "cliquez une marque" }}
      </p>
    </template>

    <template v-else-if="demo === 'maplibre'">
      <q-map
        provider="maplibre"
        :center="[10, 35]"
        :zoom="1.6"
        projection="globe"
        :marks="basicMarks"
        :height="340"
      />
      <p class="demo-meta">
        provider="maplibre" — style de démonstration MapLibre (monde) et projection globe :
        aucune clé, aucun service tiers.
      </p>
    </template>

    <template v-else-if="demo === 'styles'">
      <div class="demo-row">
        <q-btn-group>
          <q-btn
            v-for="name in STYLES"
            :key="name"
            flat
            no-caps
            :color="mapStyle === name ? 'primary' : ''"
            :label="name"
            @click="mapStyle = name"
          />
        </q-btn-group>
      </div>

      <q-map
        :provider="provider"
        :api-key="apiKey"
        :map-style="mapStyle"
        :center="PARIS"
        :zoom="11.8"
        :height="340"
      />
      <p class="demo-meta">
        map-style = "{{ mapStyle }}"
        <template v-if="!apiKey">
          — sans clé MapTiler, les styles nommés n'ont pas d'effet (raster OpenStreetMap).
        </template>
      </p>
    </template>

    <template v-else>
      <div class="demo-row">
        <q-btn-group>
          <q-btn
            flat
            no-caps
            :color="terrain ? 'primary' : ''"
            label="terrain"
            @click="terrain = !terrain"
          />
          <q-btn
            flat
            no-caps
            :color="globe ? 'primary' : ''"
            label="projection globe"
            @click="globe = !globe"
          />
        </q-btn-group>
      </div>

      <q-map
        :provider="provider"
        :api-key="apiKey"
        map-style="outdoor"
        :center="MONT_BLANC"
        :zoom="11.5"
        :terrain="terrain"
        :projection="globe ? 'globe' : 'mercator'"
        :height="340"
      />
      <p class="demo-meta">
        terrain = {{ terrain }} · projection = {{ globe ? "globe" : "mercator" }} —
        le relief 3D et la projection sont des méthodes du SDK (`enableTerrain`,
        `setProjection`), appliquées sans recharger la carte.
      </p>
    </template>
  </div>
</template>
