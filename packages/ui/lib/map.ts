// map.ts — `<q-map>` : props → options du SDK JS MapTiler, et conventions des marques.
//
// Pur : aucun DOM, aucun import de `@maptiler/sdk` (le composant seul fait le pont, par
// import dynamique côté client) → tout est testable hors navigateur, comme
// `lib/chart.ts`. Le SDK est basé sur MapLibre GL JS.
//
//   <q-map
//     center="[2.35, 48.85]"
//     :zoom="12"
//     :marks="[{ type: 'marker', position: [2.35, 48.85], label: 'Paris' }]"
//   />
//
// Référence : https://docs.maptiler.com/sdk-js/ (SDK JS v4)

/** Fournisseurs de tuiles supportés.
 *  - `maptiler` : SDK JS MapTiler (styles vectoriels, terrain, globe) + clé d'API ;
 *  - `maplibre` : **MapLibre GL JS** seul (VectorGL), sans clé — style libre ;
 *  - `openstreetmap` : raster OpenStreetMap via le SDK MapTiler, sans clé ;
 *  - `leaflet` : moteur Leaflet, raster sans clé (tuiles XYZ quelconques). */
export type QMapProvider = "maptiler" | "maplibre" | "openstreetmap" | "leaflet"

/** Valeurs acceptées par la prop `provider` : les noms canoniques, plus les alias
 *  (`osm`, `openstreet`, `map-libre`…) résolus par `providerOf`. */
export type QMapProviderInput = QMapProvider | "osm" | "openstreet" | "map-libre"

export const MAP_PROVIDERS: readonly QMapProvider[] = [
  "maptiler",
  "maplibre",
  "openstreetmap",
  "leaflet",
]

/** Alias tolérés → fournisseur canonique. */
export const PROVIDER_ALIASES: Record<string, QMapProvider> = {
  osm: "openstreetmap",
  openstreet: "openstreetmap",
  "open-street-map": "openstreetmap",
  "map-tiler": "maptiler",
  "map-libre": "maplibre",
  "maplibre-gl": "maplibre",
  "leaflet.js": "leaflet",
  "leaflet-js": "leaflet",
}

/** Fournisseur canonique d'une valeur de prop — valeur absente ou inconnue →
 *  `maptiler` (le fournisseur par défaut, celui du SDK). */
export function providerOf(provider?: unknown): QMapProvider {
  if (typeof provider !== "string") return "maptiler"
  const key = provider.trim().toLowerCase()
  if (key === "maptiler" || key === "maplibre" || key === "openstreetmap" || key === "leaflet")
    return key
  return PROVIDER_ALIASES[key] ?? "maptiler"
}

/** La valeur est-elle un fournisseur connu (canonique ou alias) ? `undefined` = défaut,
 *  donc connu : sert au composant pour avertir sur une faute de frappe. */
export function isKnownProvider(provider?: unknown): boolean {
  if (provider === undefined || provider === null || provider === "") return true
  if (typeof provider !== "string") return false
  const key = provider.trim().toLowerCase()
  return (
    key === "maptiler" ||
    key === "maplibre" ||
    key === "openstreetmap" ||
    key === "leaflet" ||
    key in PROVIDER_ALIASES
  )
}

/** Centre par défaut : vue monde. Jamais de géolocalisation IP implicite — le SDK
 *  centre la carte sur le visiteur (par IP) quand aucun `center` n'est fourni. */
export const DEFAULT_CENTER: readonly [number, number] = [0, 20]

export const DEFAULT_ZOOM = 1.5

/** Hauteur du cadre quand `height` n'est pas fourni (px) */
export const DEFAULT_MAP_HEIGHT = 320

/** Styles nommés acceptés par la prop `style` → clés de `MapStyle` du SDK (« reference
 *  styles » du README MapTiler). Toute autre valeur est passée telle quelle au SDK :
 *  ID de style (`"outdoor-v2"`) ou URL (`"https://api.maptiler.com/maps/<id>/style.json"`). */
export const MAP_STYLE_KEYS = [
  "streets",
  "satellite",
  "hybrid",
  "outdoor",
  "winter",
  "dataviz",
  "basic",
  "bright",
  "topo",
  "voyager",
  "toner",
  "ocean",
  "landscape",
  "aquarelle",
  "backdrop",
  "stage",
  "openstreetmap",
] as const

export type QMapStyleKey = (typeof MAP_STYLE_KEYS)[number]

/** Clé de `MapStyle` d'un nom court, ou `undefined` si c'est un ID/URL de style. */
export function mapStyleKey(style: unknown): QMapStyleKey | undefined {
  if (typeof style !== "string") return undefined
  const key = style.trim().toLowerCase()
  return (MAP_STYLE_KEYS as readonly string[]).includes(key) ? (key as QMapStyleKey) : undefined
}

/** Gabarit de tuiles raster par défaut (OpenStreetMap) — utilisé par
 *  `provider="openstreetmap"`, `provider="leaflet"` et le repli sans clé MapTiler. */
export const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

/** Attribution par défaut des tuiles OpenStreetMap (obligatoire à l'affichage). */
export const OSM_ATTRIBUTION = "© OpenStreetMap contributors"

/** Style raster (MapLibre / SDK MapTiler) d'une source de tuiles XYZ. */
export function osmStyle(tiles: string = OSM_TILES, attribution: string = OSM_ATTRIBUTION) {
  return {
    version: 8,
    sources: {
      osm: { type: "raster", tiles: [tiles], tileSize: 256, maxzoom: 19, attribution },
    },
    layers: [{ id: "osm", type: "raster", source: "osm" }],
  }
}

/** Style raster OpenStreetMap par défaut (`provider="openstreetmap"` / repli sans clé).
 *  Aucune clé d'API : c'est ce qui permet à la carte de rester visible en démo. */
export const OSM_STYLE = osmStyle()

/** Coordonnées en convention **Leaflet** : `[lat, lng]` (l'inverse de dnax.ui). */
export const toLeaflet = (position: readonly [number, number]): [number, number] => [
  position[1],
  position[0],
]

/** Couleur acceptable dans un attribut/motif SVG/HTML (anti-injection dans un `divIcon`).
 *  Renvoie `undefined` si la valeur sort du jeu de caractères d'une couleur CSS. */
export function safeCssColor(value?: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const color = value.trim()
  return /^[#a-zA-Z0-9(),.%\s\/+-]{1,64}$/.test(color) ? color : undefined
}

/** Longitude/latitude — `[lng, lat]`, `"lng,lat"` (ou `"[lng, lat]"`) ou `{ lng, lat }` */
export type QMapPosition =
  | [number, number]
  | string
  | { lng?: number | string; lat?: number | string; lon?: number | string }

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined
  if (typeof value !== "string" || value.trim() === "") return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

/** Coordonnées valides (lng ∈ [-180, 180], lat ∈ [-90, 90]) — `[lng, lat]`. */
const coordinates = (lng: unknown, lat: unknown): [number, number] | undefined => {
  const x = toNumber(lng)
  const y = toNumber(lat)
  if (x === undefined || y === undefined) return undefined
  if (x < -180 || x > 180 || y < -90 || y > 90) return undefined
  return [x, y]
}

/** Position `[lng, lat]`, ou `undefined` si la valeur est absente/illisible/hors bornes. */
export function parsePosition(value?: unknown): [number, number] | undefined {
  if (Array.isArray(value)) return coordinates(value[0], value[1])

  if (typeof value === "string") {
    // "[2.35, 48.85]", "2.35, 48.85" ou "2.35 48.85"
    const parts = value.replace(/[[\]()]/g, "").split(/[,;\s]+/).filter(Boolean)
    return parts.length >= 2 ? coordinates(parts[0], parts[1]) : undefined
  }

  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>
    return coordinates(o.lng ?? o.lon, o.lat)
  }

  return undefined
}

/** Zoom borné à [0, 24]. */
export function parseZoom(value: unknown): number | undefined {
  const n = toNumber(value)
  return n === undefined ? undefined : Math.min(24, Math.max(0, n))
}

/** Hauteur CSS du cadre : nombre → px, chaîne CSS telle quelle, sinon défaut. */
export function mapHeight(value: unknown): string {
  const n = toNumber(value)
  if (n !== undefined && n > 0) return `${n}px`
  return typeof value === "string" && value.trim() !== "" ? value.trim() : `${DEFAULT_MAP_HEIGHT}px`
}

// ─── Marques ────────────────────────────────────────────────────────────────────

export type QMapMarkType = "marker" | "popup"

/** Une marque est un **objet littéral plat** (comme les marks de `<q-chart>`) :
 *  `marker` = épingle (+ bulle optionnelle), `popup` = bulle seule. */
export interface QMapMark {
  /** Type de marque */
  type: QMapMarkType
  /** Position `[lng, lat]` (ou `"lng,lat"`, ou `{ lng, lat }`) */
  position?: QMapPosition
  /** Longitude — alternative à `position` */
  lng?: number | string
  /** Latitude — alternative à `position` */
  lat?: number | string
  /** Texte de la bulle (échappé) — ou libellé du marqueur */
  label?: string
  /** Contenu HTML de la bulle (prioritaire sur `label`, inséré tel quel) */
  html?: string
  /** Couleur du marqueur : token dnax (`primary`, `chart-2`…) ou couleur CSS */
  color?: string
  /** Bulle ouverte au chargement (les `popup` sont ouvertes par défaut) */
  open?: boolean
  /** Décalage de la bulle en px (défaut 18) */
  offset?: number
  /** Épingle déplaçable à la souris */
  draggable?: boolean
}

/** Charge utile de `@pick` : la marque cliquée et sa position. */
export interface QMapPick {
  mark: QMapMark
  index: number
  position: [number, number]
  lng: number
  lat: number
}

/** Position d'une marque (`position`, sinon `lng`/`lat`). */
export function markPosition(mark: QMapMark): [number, number] | undefined {
  return parsePosition(mark.position) ?? coordinates(mark.lng, mark.lat)
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/** Échappe un texte destiné à `innerHTML` (`label` d'une marque). */
export const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char)

/** Contenu de la bulle : `html` s'il est fourni, sinon `label` échappé, sinon rien. */
export function popupHtml(mark: QMapMark): string | undefined {
  if (typeof mark.html === "string" && mark.html.trim() !== "") return mark.html
  if (typeof mark.label === "string" && mark.label.trim() !== "") return escapeHtml(mark.label)
  return undefined
}

export interface QMapMarkSpec {
  mark: QMapMark
  index: number
  position: [number, number]
  html?: string
}

/** Marques exploitables, dans l'ordre — une marque sans position valide est ignorée. */
export function marksOf(marks?: readonly QMapMark[] | null): QMapMarkSpec[] {
  const out: QMapMarkSpec[] = []
  if (!Array.isArray(marks)) return out

  marks.forEach((mark, index) => {
    if (!mark || typeof mark !== "object") return
    const position = markPosition(mark)
    if (!position) return
    out.push({ mark, index, position, html: popupHtml(mark) })
  })

  return out
}

// ─── Options du constructeur `Map` ──────────────────────────────────────────────

export interface QMapOptionsInput {
  provider?: QMapProviderInput
  apiKey?: string
  /** Style **déjà résolu** (MapStyle du SDK, variante, ID, URL ou objet de style) */
  style?: unknown
  /** Gabarit de tuiles XYZ pour les fournisseurs raster (`openstreetmap`, `leaflet`) */
  tiles?: string
  /** Attribution des tuiles (obligatoire pour OpenStreetMap) */
  attribution?: string
  center?: unknown
  zoom?: unknown
  /** Contrôles du SDK : `true` (position par défaut), `false`, ou un coin
   *  (`top-left`, `top-right`, `bottom-left`, `bottom-right`) */
  navigation?: boolean | string
  geolocate?: boolean | string
  scale?: boolean | string
  fullscreen?: boolean | string
  /** Options brutes du SDK — fusionnées en **dernier** */
  options?: Record<string, any>
}

/**
 * Options passées à `new Map(...)` du SDK. `provider="openstreetmap"` impose le style
 * raster OpenStreetMap (aucune clé) ; tout le reste est délégué au SDK, et `options` est
 * fusionné en dernier (règle d'or : toute option brute passe par `options`).
 *
 * `terrain` et `projection` **ne sont pas** ici : le SDK les applique au constructeur
 * avant que le style soit chargé et jette alors « Style is not done loading » (vérifié
 * au navigateur) — `<q-map>` les applique après le `load`, via `enableTerrain()` et
 * `setProjection()`.
 */
export function mapOptionsOf(input: QMapOptionsInput = {}): Record<string, any> {
  const provider: QMapProvider = providerOf(input.provider)

  const out: Record<string, any> = {
    center: parsePosition(input.center) ?? DEFAULT_CENTER,
    zoom: parseZoom(input.zoom) ?? DEFAULT_ZOOM,
    style:
      provider === "openstreetmap"
        ? osmStyle(input.tiles ?? OSM_TILES, input.attribution ?? OSM_ATTRIBUTION)
        : input.style,
  }

  if (provider === "maptiler" && input.apiKey) out.apiKey = input.apiKey
  if (input.navigation !== undefined) out.navigationControl = input.navigation
  if (input.geolocate !== undefined) out.geolocateControl = input.geolocate
  if (input.scale !== undefined) out.scaleControl = input.scale
  if (input.fullscreen !== undefined) out.fullscreenControl = input.fullscreen

  return { ...out, ...input.options }
}

// ─── Options du moteur Leaflet ──────────────────────────────────────────────────

export interface QMapLeafletOptions {
  /** Centre en convention Leaflet : `[lat, lng]` */
  center: [number, number]
  zoom: number
  /** Gabarit de tuiles XYZ (`{z}`/`{x}`/`{y}`) */
  tiles: string
  /** Attribution des tuiles */
  attribution: string
  /** Options passées à `L.map()` (les `options` utilisateur, `tileLayer` exclu) */
  mapOptions: Record<string, any>
  /** Options passées à `L.tileLayer()` (`options.tileLayer`) */
  layerOptions: Record<string, any>
}

/**
 * Options du moteur **Leaflet** : la couche de tuiles et les options de `L.map()`.
 *
 * Convention de coordonnées : **`[lat, lng]`** — Leaflet l'exige, alors que dnax.ui
 * expose `[lng, lat]` partout ailleurs (la conversion est faite ici, une fois).
 * `options` est passé à `L.map()`, sa clé `tileLayer` à `L.tileLayer()`.
 */
export function leafletOptionsOf(input: QMapOptionsInput = {}): QMapLeafletOptions {
  const { tileLayer, ...mapOptions } = (input.options ?? {}) as Record<string, any>

  return {
    center: toLeaflet(parsePosition(input.center) ?? DEFAULT_CENTER),
    zoom: parseZoom(input.zoom) ?? DEFAULT_ZOOM,
    tiles: typeof input.tiles === "string" && input.tiles.trim() ? input.tiles.trim() : OSM_TILES,
    attribution:
      typeof input.attribution === "string" && input.attribution.trim()
        ? input.attribution.trim()
        : OSM_ATTRIBUTION,
    mapOptions,
    layerOptions: (tileLayer as Record<string, any>) ?? {},
  }
}

// ─── MapLibre GL JS (styles libres, sans clé) ───────────────────────────────────

/** Style de démonstration MapLibre (monde entier, aucune clé) — défaut du fournisseur. */
export const MAPLIBRE_DEMO_STYLE = "https://demotiles.maplibre.org/style.json"

/**
 * Style d'un `<q-map provider="maplibre">` : `demotiles` (défaut), `openstreetmap` (le
 * raster de `osmStyle()`, `tiles`/`attribution` compris), une URL de style, un objet de
 * style complet — ou `streets`, la valeur par défaut du design system, qui n'a pas de
 * sens sans MapTiler et retombe donc sur le style de démo.
 *
 * `known` vaut `false` pour un nom non reconnu : le moteur le signale en console
 * (sinon un `map-style="topo"` afficherait le style de démo en silence).
 */
export function maplibreStyle(input: QMapOptionsInput = {}): { style: any; known: boolean } {
  const value = input.style
  if (value && typeof value === "object") return { style: value, known: true }

  const raw = typeof value === "string" ? value.trim() : ""
  const key = raw.toLowerCase()

  if (key === "" || key === "streets" || key === "demotiles" || key === "demo")
    return { style: MAPLIBRE_DEMO_STYLE, known: true }

  if (key === "openstreetmap" || key === "osm")
    return {
      style: osmStyle(input.tiles ?? OSM_TILES, input.attribution ?? OSM_ATTRIBUTION),
      known: true,
    }

  // URL absolue ou relative (le reste est un nom court inconnu)
  if (/^(https?:)?\/\//.test(raw) || raw.startsWith("/") || raw.startsWith("."))
    return { style: raw, known: true }

  return { style: MAPLIBRE_DEMO_STYLE, known: false }
}

export interface QMapMaplibreOptions {
  /** Options passées à `new Map()` de MapLibre GL JS */
  map: Record<string, any>
  /** Le `map-style` demandé a-t-il été reconnu ? (sinon repli sur le style de démo) */
  styleKnown: boolean
}

/**
 * Options du moteur **MapLibre GL JS** : `center` / `zoom` et le style résolu
 * (`maplibreStyle`). MapLibre n'a ni clé d'API, ni catalogue de styles : c'est le style
 * qui porte les sources de données.
 */
export function maplibreOptionsOf(input: QMapOptionsInput = {}): QMapMaplibreOptions {
  const { style, known } = maplibreStyle(input)

  return {
    map: {
      center: parsePosition(input.center) ?? DEFAULT_CENTER,
      zoom: parseZoom(input.zoom) ?? DEFAULT_ZOOM,
      style,
      ...(input.options ?? {}),
    },
    styleKnown: known,
  }
}
