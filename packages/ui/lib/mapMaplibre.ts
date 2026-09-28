// mapMaplibre — moteur **MapLibre GL JS** seul (sans le SDK MapTiler) : le fork
// open-source de mapbox-gl, importé dynamiquement (aucun WebGL ni DOM au prerender SSR).
//
// Différences avec le moteur MapTiler, qui partage pourtant la même base :
//  - **aucun catalogue de styles** ni clé d'API : le style (`map-style`) est résolu par
//    `maplibreStyle()` — style de démonstration MapLibre, raster OSM, URL ou objet ;
//  - **aucun contrôle par défaut** : le SDK MapTiler ajoute zoom/géolocalisation tout
//    seul, ici ils sont montés explicitement depuis les props ;
//  - **pas de source de relief** : `terrain` n'a pas d'effet (on passe `options.terrain`
//    au constructeur, avec une source DEM déclarée par le style).
import { maplibreStyle, type QMapMaplibreOptions } from "./map"
import {
  buildMapLibreMarks,
  controlPosition,
  type MapEngine,
  type MapEngineInput,
} from "./mapEngine"

export async function createMaplibreEngine(input: MapEngineInput): Promise<MapEngine> {
  // Le paquet est un bundle UMD : on prend le défaut, sinon le module.
  const mod: any = await import("maplibre-gl")
  const maplibregl: any = mod.default ?? mod

  const options = input.options as QMapMaplibreOptions
  const map = new maplibregl.Map({ ...options.map, container: input.el })

  if (!options.styleKnown) {
    console.warn(
      '[q-map] `map-style` inconnu avec provider="maplibre" : repli sur le style de ' +
        'démonstration MapLibre (valeurs : "demotiles", "openstreetmap", une URL de style)',
    )
  }

  // Contrôles : MapLibre n'en monte aucun de lui-même (le SDK MapTiler, si).
  const controls = input.controls ?? {}
  if (controls.navigation !== false) {
    map.addControl(
      new maplibregl.NavigationControl(),
      controlPosition(controls.navigation, "top-right"),
    )
  }
  if (controls.geolocate !== false) {
    map.addControl(
      new maplibregl.GeolocateControl({ trackUserLocation: false }),
      controlPosition(controls.geolocate, "top-right"),
    )
  }
  if (controls.scale) {
    map.addControl(new maplibregl.ScaleControl(), controlPosition(controls.scale, "bottom-right"))
  }
  if (controls.fullscreen) {
    map.addControl(
      new maplibregl.FullscreenControl(),
      controlPosition(controls.fullscreen, "top-right"),
    )
  }

  let clear = () => {}
  let readyCallbacks: Array<(engine: MapEngine) => void> = []
  let ready = false

  const engine: MapEngine = {
    native: map,

    setView: (center, zoom) => map.jumpTo({ center, zoom }),

    setStyle: (style) => map.setStyle(maplibreStyle({ style }).style),

    setMarks: (marks) => {
      clear()
      clear = buildMapLibreMarks(maplibregl, map, marks, input)
    },

    // Pas de relief sans source DEM : `options.terrain` (constructeur) porte le cas.
    setTerrain: () => {},

    setProjection: (projection) => map.setProjection({ type: projection }),

    resize: () => map.resize(),

    destroy: () => {
      clear()
      map.remove()
    },

    onReady: (callback) => {
      if (ready) callback(engine)
      else readyCallbacks.push(callback)
    },
  }

  const markReady = () => {
    if (ready) return
    ready = true
    const callbacks = readyCallbacks
    readyCallbacks = []
    for (const callback of callbacks) callback(engine)
  }

  map.on("load", markReady)
  map.on("error", (event: unknown) => input.error((event as any)?.error ?? event))

  engine.setMarks(input.marks)

  return engine
}
