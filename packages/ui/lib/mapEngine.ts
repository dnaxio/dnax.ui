// mapEngine — contrat commun aux moteurs de carte de `<q-map>`.
//
// `<q-map>` ne connaît que ce contrat : la prop `provider` choisit un moteur, qui traduit
// centre / zoom / marques / style vers sa bibliothèque (SDK MapTiler, Leaflet) et convertit
// les conventions de coordonnées (`[lng, lat]` côté dnax.ui). Tout ce qui ne dépend pas du
// moteur — props, thème, surcouche de chargement, réactivité — reste dans le composant.
//
// Les deux moteurs sont importés **à la demande** (`createMapEngine`) : un `<q-map
// provider="leaflet">` ne charge jamais le SDK MapTiler, `provider="maplibre"` ne charge
// jamais Leaflet, et inversement.
import type { QMapMarkSpec, QMapPick, QMapProvider } from "./map"

/** Moteur de carte : surface minimale dont `<q-map>` a besoin. */
export interface MapEngine {
  /** Instance native (`Map` du SDK MapTiler, `L.Map` de Leaflet) */
  native: any
  /** Centre `[lng, lat]` + zoom */
  setView(center: [number, number], zoom: number): void
  /** Style de carte : nom court (`streets`, `dataviz`…), ID/URL, ou objet de style —
   *  `dark` demande la variante sombre quand le moteur en a une. Sans effet sur les
   *  moteurs raster (Leaflet). */
  setStyle(style: unknown, dark?: boolean): void
  /** Couche de tuiles raster — sans effet sur MapTiler, qui passe par `setStyle` */
  setRaster?(tiles: string, attribution?: string): void
  /** Redessine les marques (marqueurs, épingles et bulles) */
  setMarks(marks: QMapMarkSpec[]): void
  /** Relief 3D — sans effet si le moteur ne le gère pas */
  setTerrain(on: boolean): void
  /** Projection — sans effet si le moteur ne la gère pas */
  setProjection(projection: string): void
  /** Recalcule la taille du canvas après un changement de conteneur */
  resize(): void
  /** Détruit la carte et ses marques */
  destroy(): void
  /** Carte utilisable — le callback part tout de suite si elle l'est déjà */
  onReady(callback: (engine: MapEngine) => void): void
}

/** Contexte transmis à un moteur par `<q-map>`. */
export interface MapEngineInput {
  /** Fournisseur retenu (le composant a déjà normalisé la valeur) */
  provider: QMapProvider
  /** Élément conteneur : le moteur y monte sa carte */
  el: HTMLElement
  /** Options **déjà construites** pour ce moteur (`mapOptionsOf` / `leafletOptionsOf`) */
  options: Record<string, any>
  /** Centre `[lng, lat]` de départ */
  center: [number, number]
  /** Zoom de départ */
  zoom: number
  /** Mode sombre courant (variante `DARK` des styles MapTiler) */
  dark: boolean
  /** Marques de départ (normalisées par `marksOf`) */
  marks: QMapMarkSpec[]
  /** Contrôles demandés (props `navigation`, `geolocate`, `scale`, `fullscreen`) : le SDK
   *  MapTiler les reçoit par ses options, les autres moteurs les ajoutent eux-mêmes */
  controls?: {
    navigation?: boolean | string
    geolocate?: boolean | string
    scale?: boolean | string
    fullscreen?: boolean | string
  }
  /** Couleur concrète d'une marque (token du thème → couleur CSS) */
  color: (value?: string) => string | undefined
  /** Une marque a été cliquée */
  pick: (payload: QMapPick) => void
  /** Erreur du moteur — y compris non fatale (tuile manquante…) */
  error: (error: unknown) => void
}

/** Fabrique de moteur : `maptiler` / `openstreetmap` → SDK MapTiler, `maplibre` →
 *  MapLibre GL JS seul, `leaflet` → Leaflet. */
export async function createMapEngine(input: MapEngineInput): Promise<MapEngine> {
  if (input.provider === "leaflet") {
    const { createLeafletEngine } = await import("./mapLeaflet")
    return createLeafletEngine(input)
  }

  if (input.provider === "maplibre") {
    const { createMaplibreEngine } = await import("./mapMaplibre")
    return createMaplibreEngine(input)
  }

  const { createMaptilerEngine } = await import("./mapMaptiler")
  return createMaptilerEngine(input)
}

/** Positions de contrôle communes à MapLibre et à Leaflet. */
export const CONTROL_POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const

/** Position de contrôle à partir d'une prop `boolean | string` (`true` → la position par
 *  défaut du moteur, une chaîne valide → elle-même). */
export function controlPosition(
  value: boolean | string | undefined,
  fallback: (typeof CONTROL_POSITIONS)[number],
): (typeof CONTROL_POSITIONS)[number] {
  return typeof value === "string" && (CONTROL_POSITIONS as readonly string[]).includes(value)
    ? (value as (typeof CONTROL_POSITIONS)[number])
    : fallback
}

/**
 * Construit les marques DOM d'un moteur **MapLibre** — le SDK MapTiler et `maplibre-gl`
 * exposent les mêmes `Marker` / `Popup` : ce code est partagé par les deux moteurs.
 * Renvoie la fonction de démontage (à appeler avant d'en construire d'autres).
 */
export function buildMapLibreMarks(
  api: { Marker: any; Popup: any },
  map: any,
  marks: QMapMarkSpec[],
  input: MapEngineInput,
): () => void {
  const created: Array<() => void> = []

  for (const { mark, index, position, html } of marks) {
    const onPick = () => input.pick({ mark, index, position, lng: position[0], lat: position[1] })
    const offset = typeof mark.offset === "number" ? mark.offset : 18

    if (mark.type === "popup") {
      if (!html) continue // une bulle sans contenu n'a rien à montrer
      const popup = new api.Popup({ offset, className: "q-map__popup", closeOnClick: true })
        .setLngLat(position)
        .setHTML(html)
      if (mark.open !== false) popup.addTo(map)

      const node = popup.getElement() as HTMLElement | undefined
      node?.addEventListener("click", onPick)
      created.push(() => {
        node?.removeEventListener("click", onPick)
        popup.remove()
      })
      continue
    }

    // marker
    const markerOptions: Record<string, any> = {}
    const color = input.color(mark.color)
    if (color) markerOptions.color = color
    if (mark.draggable) markerOptions.draggable = true

    const marker = new api.Marker(markerOptions).setLngLat(position)
    if (html) marker.setPopup(new api.Popup({ offset, className: "q-map__popup" }).setHTML(html))
    marker.addTo(map)

    const node = marker.getElement() as HTMLElement | undefined
    node?.addEventListener("click", onPick)
    if (mark.open && html) marker.togglePopup()

    created.push(() => {
      node?.removeEventListener("click", onPick)
      marker.remove()
    })
  }

  return () => {
    for (const dispose of created) dispose()
  }
}
