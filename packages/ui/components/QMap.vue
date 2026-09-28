<script setup lang="ts">
// QMap — carte interactive, plusieurs fournisseurs (moteurs dans `lib/mapEngine.ts`).
//
//   <q-map center="[2.35, 48.85]" :zoom="12" :marks="[{ type: 'marker', position: [2.35, 48.85], label: 'Paris' }]" />
//   <q-map provider="leaflet" tiles="https://mon-serveur/{z}/{x}/{y}.png" />
//
// - **Client seulement** : le moteur (SDK JS MapTiler ou Leaflet) est importé
//   dynamiquement au montage → ni WebGL ni DOM au prerender SSR.
// - **Fournisseurs** : `maptiler` (défaut, clé requise), `maplibre` (MapLibre GL JS seul,
//   style libre sans clé), `openstreetmap` (raster sans clé, via le SDK MapTiler),
//   `leaflet` (moteur Leaflet, raster sans clé, tuiles XYZ quelconques). Sans clé
//   MapTiler, `maptiler` retombe sur le raster OpenStreetMap avec un avertissement — le
//   cadre n'est jamais vide.
// - `marks` : marques en objets littéraux plats (`marker`, `popup`), comme les marks de
//   `<q-chart>` — voir `lib/map.ts`.
// - Thème : la variante sombre du style suit la classe `.dark` du document (styles
//   vectoriels) ; les bulles et les contrôles des deux moteurs sont peints avec les tokens
//   (`styles/main.css`).
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue"
import type { CSSProperties } from "vue"
import { COLOR_TOKENS } from "../lib/chart"
import { normalizeCssColor, probeContext } from "../lib/color"
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  isKnownProvider,
  leafletOptionsOf,
  mapHeight,
  maplibreOptionsOf,
  mapOptionsOf,
  marksOf,
  parsePosition,
  parseZoom,
  providerOf,
  type QMapMark,
  type QMapPick,
  type QMapPosition,
  type QMapProvider,
} from "../lib/map"
import { createMapEngine, type MapEngine } from "../lib/mapEngine"
import { useComponentProps } from "../lib/useComponentProps"

interface Props {
  /** Fournisseur : `maptiler` (défaut), `maplibre`, `openstreetmap` ou `leaflet` —
   *  `osm` et `openstreet` sont acceptés comme alias d'`openstreetmap` */
  provider?: "maptiler" | "maplibre" | "openstreetmap" | "leaflet" | "osm"
  /** Clé d'API MapTiler (repli : `componentProps.QMap.apiKey` du QConfigProvider).
   *  Sans effet avec `leaflet`. */
  apiKey?: string
  /** Style de carte : nom court (`streets`, `satellite`, `outdoor`, `dataviz`…), ID ou URL
   *  de style. Avec `provider="maplibre"` : `demotiles` (défaut), `openstreetmap`, une URL
   *  de style ou un objet de style. Sans effet avec `leaflet` (tuiles raster).
   *  Nommé `map-style` (et non `style`) pour ne pas entrer en collision avec l'attribut
   *  CSS `style` de Vue. */
  mapStyle?: string
  /** Gabarit de tuiles XYZ des fournisseurs raster (`openstreetmap`, `leaflet` — et
   *  `maplibre` avec `map-style="openstreetmap"`) — défaut : les tuiles OpenStreetMap */
  tiles?: string
  /** Attribution des tuiles (obligatoire pour OpenStreetMap) */
  attribution?: string
  /** Centre de la carte : `[lng, lat]`, `"lng,lat"` ou `{ lng, lat }` — Leaflet reçoit la
   *  même valeur (la conversion `[lat, lng]` est faite par le moteur) */
  center?: QMapPosition
  /** Zoom (0–24) */
  zoom?: number | string
  /** Hauteur du cadre : nombre → px, ou longueur CSS (`"40vh"`) */
  height?: number | string
  /** Marques : marqueurs (bulle optionnelle) et bulles seules */
  marks?: QMapMark[]
  /** Contrôles : `true` (position par défaut), `false`, ou un coin (`top-right`…).
   *  Ignorés par `leaflet` (contrôles natifs de Leaflet). */
  navigation?: boolean | string
  geolocate?: boolean | string
  scale?: boolean | string
  fullscreen?: boolean | string
  /** Relief 3D — styles MapTiler uniquement (`maplibre` : passez une source DEM via
   *  `options.terrain`) */
  terrain?: boolean
  /** Projection : `mercator` (défaut) ou `globe` — MapTiler et MapLibre */
  projection?: "mercator" | "globe"
  /** Force la variante sombre du style (sinon suivi du mode clair/sombre du document) */
  dark?: boolean
  /** Libellé accessible du cadre */
  label?: string
  /** Options brutes du moteur — fusionnées en dernier. Pour Leaflet : options de `L.map()`,
   *  `options.tileLayer` allant à `L.tileLayer()`. */
  options?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  provider: "maptiler",
  apiKey: "",
  mapStyle: "streets",
  tiles: "",
  attribution: "",
  label: "Carte",
})

const emit = defineEmits<{
  /** Carte prête — reçoit l'instance native (`Map` du SDK MapTiler, `L.Map` de Leaflet) */
  ready: [map: any]
  /** Une marque a été cliquée */
  pick: [payload: QMapPick]
  /** Erreur du moteur : échec de construction (surcouche « Carte indisponible ») ou
   *  erreur signalée ensuite (tuile, style, réseau) — seule la première est émise */
  error: [error: unknown]
}>()

/** Valeurs globales du composant (`componentProps.QMap` du QConfigProvider) */
const defaults = useComponentProps("QMap")

const el = ref<HTMLElement | null>(null)
const engine = shallowRef<MapEngine | null>(null)
const loading = ref(true)
const failure = ref<string | null>(null)

// ─── Thème clair / sombre ──────────────────────────────────────────────────────

const documentDark = ref(false)
let themeObserver: MutationObserver | null = null

const isDocumentDark = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("dark")

/** `dark` explicite, sinon le mode du document (classe `.dark` sur `<html>`) */
const isDark = computed(() => props.dark ?? documentDark.value)

// ─── Valeurs résolues ──────────────────────────────────────────────────────────

const center = computed(() => parsePosition(props.center) ?? ([...DEFAULT_CENTER] as [number, number]))
const zoom = computed(() => parseZoom(props.zoom) ?? DEFAULT_ZOOM)
const frameStyle = computed<CSSProperties>(() => ({ height: mapHeight(props.height) }))
const apiKey = computed(() => props.apiKey || String(defaults.value.apiKey ?? ""))

/** Fournisseur effectif : `maptiler` sans clé retombe sur le raster OpenStreetMap. */
const provider = computed<QMapProvider>(() => {
  const requested = providerOf(props.provider)
  return requested === "maptiler" && !apiKey.value ? "openstreetmap" : requested
})

/** Marques normalisées (positions résolues, marques invalides écartées) */
const markSpecs = computed(() => marksOf(props.marks))

/** Options passées au moteur, selon le fournisseur. Pour MapTiler, `style` reste la
 *  valeur brute de la prop : c'est le moteur qui résout les noms courts (`MapStyle`). */
const engineOptions = computed<Record<string, any>>(() => {
  const shared = {
    center: center.value,
    zoom: zoom.value,
    tiles: props.tiles,
    attribution: props.attribution,
    options: props.options,
  }

  if (provider.value === "leaflet") return leafletOptionsOf(shared)
  if (provider.value === "maplibre") return maplibreOptionsOf({ ...shared, style: props.mapStyle })

  return mapOptionsOf({
    ...shared,
    provider: provider.value,
    apiKey: apiKey.value,
    style: props.mapStyle,
    navigation: props.navigation,
    geolocate: props.geolocate,
    scale: props.scale,
    fullscreen: props.fullscreen,
  })
})

/** Style à appliquer : la prop pour MapTiler (nom court, ID ou URL) et MapLibre (le
 *  moteur résout `demotiles` / `openstreetmap` / URL), le style raster construit pour
 *  `openstreetmap`, `undefined` pour Leaflet (pas de notion de style). */
const styleForProvider = computed<any>(() =>
  provider.value === "leaflet"
    ? undefined
    : provider.value === "openstreetmap"
      ? engineOptions.value.style
      : props.mapStyle,
)

// ─── Couleurs des marques ──────────────────────────────────────────────────────

/** Token dnax (`primary`, `chart-2`…) lu sur le thème, ou couleur CSS — normalisée
 *  (`lib/color.ts`) car elle finit dans un attribut SVG/markup (cf. `.q-map` de main.css). */
const colorOf = (color?: string): string | undefined => {
  if (typeof color !== "string" || color.trim() === "") return undefined
  const value = color.trim()
  const node = el.value
  const isToken = !!node && (COLOR_TOKENS as readonly string[]).includes(value)
  const raw = isToken ? getComputedStyle(node).getPropertyValue(`--${value}`).trim() : value
  if (!raw) return undefined
  return normalizeCssColor(raw, probeContext()) ?? raw
}

// ─── Cycle de vie ─────────────────────────────────────────────────────────────

let resizeObserver: ResizeObserver | null = null
/** Style (et mode sombre) appliqué par la dernière fois — évite un `setStyle` au montage */
let appliedStyle: unknown = null
let appliedDark: boolean | undefined
/** La carte a fini de charger (moteur prêt) */
let isReady = false
/** Minuteur de repli : ne jamais laisser la surcouche « Chargement… » indéfiniment */
let readyTimer: ReturnType<typeof setTimeout> | null = null
/** Erreurs signalées par le moteur (la 1re est journalisée et émise, les suivantes tues) */
let errorCount = 0

/** Délai au bout duquel on retire la surcouche même sans `ready` : les tuiles peuvent
 *  échouer (réseau, quota) sans que la carte soit inutilisable. */
const READY_TIMEOUT = 8000

const messageOf = (event: any): string => {
  const error = event?.error ?? event
  const message = error?.message ?? (typeof error === "string" ? error : "")
  return message ? `Carte indisponible — ${message}` : "Carte indisponible"
}

const fail = (error: unknown) => {
  console.warn("[q-map]", error)
  loading.value = false
  failure.value = messageOf(error)
  emit("error", error)
}

/** Erreur signalée **par le moteur** une fois la carte lancée (tuile, style, réseau…) :
 *  la carte reste utilisable, on n'affiche donc pas d'erreur plein cadre — seulement le
 *  premier avertissement et l'événement `error`. Les échecs de construction, eux,
 *  passent par `fail()` (surcouche « Carte indisponible »). */
const noteError = (error: unknown) => {
  if (errorCount++ > 0) return
  console.warn("[q-map]", error)
  emit("error", error)
}

/** Fournisseurs dont la carte est un raster : ils ignorent `map-style` (les tuiles
 *  passent par `tiles`), alors que `maptiler` et `maplibre` portent des styles. */
const RASTER_PROVIDERS: readonly QMapProvider[] = ["openstreetmap", "leaflet"]

/** Relief / projection : des méthodes du moteur, à appliquer une fois la carte chargée
 *  (au constructeur, MapTiler jette « Style is not done loading » sur `terrain`, et
 *  MapLibre attend un style chargé) puis à chaque changement. Chaque moteur ne fait que
 *  ce qu'il sait faire : `openstreetmap` et `leaflet` sont des no-op. */
const applyTerrainProjection = (target: MapEngine) => {
  if (props.terrain) target.setTerrain(true)
  if (props.projection) target.setProjection(props.projection)
}

onMounted(async () => {
  documentDark.value = isDocumentDark()
  if (typeof MutationObserver !== "undefined") {
    themeObserver = new MutationObserver(() => {
      documentDark.value = isDocumentDark()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })
  }

  const node = el.value
  if (!node) return

  if (props.provider === "maptiler" && !apiKey.value) {
    console.warn(
      "[q-map] aucune clé d'API MapTiler (prop `api-key` ou componentProps.QMap.apiKey) : " +
        'repli sur le raster OpenStreetMap (provider="openstreetmap")',
    )
  }
  if (!isKnownProvider(props.provider)) {
    console.warn(
      `[q-map] fournisseur \`${props.provider}\` inconnu : repli sur \`maptiler\` ` +
        '(valeurs : "maptiler", "openstreetmap", "leaflet" — alias "osm", "openstreet")',
    )
  }
  if (RASTER_PROVIDERS.includes(provider.value) && props.mapStyle !== "streets") {
    console.warn(
      `[q-map] \`map-style\` est sans effet avec provider="${props.provider}" (tuiles raster) : ` +
        "utilisez la prop `tiles` pour choisir la source",
    )
  }

  try {
    const next = await createMapEngine({
      provider: provider.value,
      el: node,
      options: engineOptions.value,
      center: center.value,
      zoom: zoom.value,
      marks: markSpecs.value,
      dark: isDark.value,
      controls: {
        navigation: props.navigation,
        geolocate: props.geolocate,
        scale: props.scale,
        fullscreen: props.fullscreen,
      },
      color: colorOf,
      pick: (payload) => emit("pick", payload),
      error: noteError,
    })

    if (!el.value) {
      next.destroy() // démonté pendant le chargement du moteur
      return
    }

    engine.value = next
    appliedStyle = styleForProvider.value
    appliedDark = isDark.value

    next.onReady((ready) => {
      isReady = true
      loading.value = false
      if (readyTimer) clearTimeout(readyTimer)
      readyTimer = null
      applyTerrainProjection(ready)
      emit("ready", ready.native)
    })

    // Repli : une carte dont les tuiles n'arrivent pas ne doit pas rester sous la
    // surcouche — l'utilisateur voit la carte (fond neutre) et la console explique.
    readyTimer = setTimeout(() => {
      readyTimer = null
      if (!isReady) {
        console.warn("[q-map] la carte n'a pas signalé son chargement — surcouche retirée")
        loading.value = false
      }
    }, READY_TIMEOUT)

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => engine.value?.resize())
      resizeObserver.observe(node)
    }
  } catch (error) {
    fail(error)
  }
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
  resizeObserver?.disconnect()
  resizeObserver = null
  if (readyTimer) clearTimeout(readyTimer)
  readyTimer = null
  isReady = false
  engine.value?.destroy()
  engine.value = null
})

// ─── Réactivité ───────────────────────────────────────────────────────────────

// Style (et bascule clair/sombre : la variante `.DARK` est résolue par le moteur)
watch([styleForProvider, isDark], ([style, dark]) => {
  if (!isReady || style === undefined) return
  if (style === appliedStyle && dark === appliedDark) return
  appliedStyle = style
  appliedDark = dark
  engine.value?.setStyle(style, dark)
})

// Tuiles raster (Leaflet) — `mapOptionsOf` gère déjà le cas d'`openstreetmap`.
watch([() => props.tiles, () => props.attribution], () => {
  const target = engine.value
  if (!isReady || provider.value !== "leaflet" || !target?.setRaster) return
  const next = leafletOptionsOf({ tiles: props.tiles, attribution: props.attribution })
  target.setRaster(next.tiles, next.attribution)
})

watch([center, zoom], ([nextCenter, nextZoom]) => {
  if (isReady) engine.value?.setView(nextCenter, nextZoom)
})

watch(markSpecs, (specs) => engine.value?.setMarks(specs), { deep: true })

watch(
  () => props.terrain,
  (value) => {
    const target = engine.value
    if (!target || !isReady || typeof value !== "boolean") return
    target.setTerrain(value)
  },
)

watch(
  () => props.projection,
  (value) => {
    const target = engine.value
    if (!target || !isReady || !value) return
    target.setProjection(value)
  },
)

defineExpose({
  /** Instance native (`Map` du SDK MapTiler, `L.Map` de Leaflet) — API complète du moteur */
  map: computed(() => engine.value?.native ?? null),
  /** Recalcule la taille du canvas (cadre qui vient d'apparaître) */
  refresh: () => engine.value?.resize(),
})
</script>

<template>
  <div class="q-map" :style="frameStyle" v-bind="$attrs">
    <div ref="el" class="q-map__canvas" role="application" :aria-label="label" />

    <div v-if="loading || failure" class="q-map__overlay">
      <p class="q-map__note">{{ failure ?? "Chargement de la carte…" }}</p>
    </div>
  </div>
</template>
