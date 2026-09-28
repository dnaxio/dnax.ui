// mapLeaflet — moteur **Leaflet** de `<q-map>` : raster sans clé, importé dynamiquement.
//
// Trois différences à garder en tête :
//  - Leaflet travaille en **`[lat, lng]`** (l'inverse de dnax.ui, qui expose `[lng, lat]`)
//    → toute position passe par `toLeaflet()` ;
//  - il n'a ni styles vectoriels, ni relief, ni projection : `setStyle` / `setTerrain` /
//    `setProjection` n'y font rien, c'est `setRaster` qui change la couche de tuiles ;
//  - ses épingles par défaut sont des **images** (impossible de les recolorer par option)
//    → les marqueurs sont dessinés en `divIcon` SVG, ce qui permet la prop `color`.
import {
  safeCssColor,
  toLeaflet,
  type QMapLeafletOptions,
  type QMapMarkSpec,
} from "./map"
import type { MapEngine, MapEngineInput } from "./mapEngine"

/** Épingle SVG (couleur du thème) : Leaflet place le `div`, l'ancre est au pied du pin. */
const pinIcon = (L: any, color: string) =>
  L.divIcon({
    className: "q-map__pin",
    html:
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' +
      `<path d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill="${color}" stroke="#fff" stroke-width="1.6"/>` +
      '<circle cx="12" cy="9" r="2.6" fill="#fff"/>' +
      "</svg>",
    iconSize: [26, 26],
    iconAnchor: [13, 25],
    popupAnchor: [0, -22],
  })

export async function createLeafletEngine(input: MapEngineInput): Promise<MapEngine> {
  // Le paquet n'a pas d'export ESM explicite : on prend le défaut, sinon le module.
  const leaflet: any = await import("leaflet")
  const L: any = leaflet.default ?? leaflet
  const options = input.options as QMapLeafletOptions

  const map = L.map(input.el, {
    center: options.center,
    zoom: options.zoom,
    ...options.mapOptions,
  })

  let layer = L.tileLayer(options.tiles, {
    attribution: options.attribution,
    ...options.layerOptions,
  }).addTo(map)

  let created: Array<() => void> = []
  let readyCallbacks: Array<(engine: MapEngine) => void> = []
  let ready = false

  const clearMarks = () => {
    for (const dispose of created) dispose()
    created = []
  }

  /** Bulle thématée : la classe est posée sur le conteneur `.leaflet-popup`. */
  const popupOptions = (offset?: number) => ({
    className: "q-map__popup",
    offset: L.point(0, -(typeof offset === "number" ? offset : 18)),
  })

  const engine: MapEngine = {
    native: map,

    setView: (center, zoom) => map.setView(toLeaflet(center), zoom),

    // Leaflet n'a pas de notion de style : la couche de tuiles est la carte.
    setStyle: () => {},

    setRaster: (tiles, attribution) => {
      const next = L.tileLayer(tiles, {
        attribution: attribution ?? options.attribution,
        ...options.layerOptions,
      })
      map.removeLayer(layer)
      layer = next.addTo(map)
    },

    setMarks: (marks: QMapMarkSpec[]) => {
      clearMarks()

      for (const { mark, index, position, html } of marks) {
        const latlng = toLeaflet(position)
        const onPick = () => input.pick({ mark, index, position, lng: position[0], lat: position[1] })

        if (mark.type === "popup") {
          if (!html) continue
          const popup = L.popup(popupOptions(mark.offset)).setLatLng(latlng).setContent(html)
          if (mark.open !== false) popup.openOn(map)

          const node = popup.getElement() as HTMLElement | null
          node?.addEventListener("click", onPick)
          created.push(() => {
            node?.removeEventListener("click", onPick)
            popup.remove()
          })
          continue
        }

        const marker = L.marker(latlng, {
          icon: pinIcon(L, safeCssColor(input.color(mark.color)) ?? "#1976d2"),
          draggable: !!mark.draggable,
        })
        if (html) marker.bindPopup(html, popupOptions(mark.offset))
        marker.addTo(map)
        if (mark.open && html) marker.openPopup()

        marker.on("click", onPick)
        created.push(() => marker.remove())
      }
    },

    setTerrain: () => {},
    setProjection: () => {},

    resize: () => map.invalidateSize(),

    destroy: () => {
      clearMarks()
      map.remove()
    },

    onReady: (callback) => {
      if (ready) callback(engine)
      else readyCallbacks.push(callback)
    },
  }

  map.whenReady(() => {
    if (ready) return
    ready = true
    const callbacks = readyCallbacks
    readyCallbacks = []
    for (const callback of callbacks) callback(engine)
  })

  engine.setMarks(input.marks)

  return engine
}
