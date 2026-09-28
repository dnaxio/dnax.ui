// mapMaptiler — moteur **MapTiler / OpenStreetMap** de `<q-map>` : le SDK JS MapTiler v4
// (MapLibre GL JS + catalogue de styles + APIs), importé dynamiquement (aucun WebGL ni DOM
// au prerender SSR).
//
// Le même moteur sert les deux fournisseurs : `maptiler` (styles vectoriels + clé) et
// `openstreetmap` (style raster construit par `mapOptionsOf`, sans clé). Les méthodes qui
// n'ont de sens que sur les styles MapTiler (`enableTerrain`, `setProjection`) sont
// ignorées pour `openstreetmap`.
//
// C'est aussi lui qui résout les **noms courts de style** (`streets`, `dataviz`…) en
// `MapStyle` du SDK — variante `.DARK` comprise — puisque c'est lui qui détient le SDK.
import { mapStyleKey } from "./map"
import { buildMapLibreMarks, type MapEngine, type MapEngineInput } from "./mapEngine"

export async function createMaptilerEngine(input: MapEngineInput): Promise<MapEngine> {
  const sdk: any = await import("@maptiler/sdk")

  /** Nom court → `MapStyle` du SDK (+ variante sombre si elle existe) ; un objet de
   *  style, un ID ou une URL sont rendus tels quels. */
  const resolveStyle = (value: unknown, dark?: boolean): unknown => {
    const key = mapStyleKey(value)
    if (!key) return value

    const reference = sdk.MapStyle?.[key.toUpperCase()]
    if (!reference) return value

    return dark && reference.DARK ? reference.DARK : reference
  }

  const options = { ...input.options, style: resolveStyle(input.options.style, input.dark) }
  const map = new sdk.Map({ ...options, container: input.el })

  let clear = () => {}
  let readyCallbacks: Array<(engine: MapEngine) => void> = []
  let ready = false

  /** Relief et projection n'ont de sens qu'avec les styles du catalogue MapTiler. */
  const terrainSupported = input.provider === "maptiler"

  const engine: MapEngine = {
    native: map,

    setView: (center, zoom) => map.jumpTo({ center, zoom }),

    setStyle: (style, dark) => map.setStyle(resolveStyle(style, dark)),

    setMarks: (marks) => {
      clear()
      clear = buildMapLibreMarks(sdk, map, marks, input)
    },

    setTerrain: (on) => {
      if (!terrainSupported) return
      if (on) map.enableTerrain?.()
      else map.disableTerrain?.()
    },

    setProjection: (projection) => {
      if (!terrainSupported) return
      map.setProjection?.(projection, { persist: true })
    },

    resize: () => map.resize?.(),

    destroy: () => {
      clear()
      map.remove?.()
    },

    onReady: (callback) => {
      if (ready) callback(engine)
      else readyCallbacks.push(callback)
    },
  }

  // Premier `load` **ou** `ready` : le second attend la fin de l'installation des
  // contrôles du SDK, il peut donc être retardé.
  const markReady = () => {
    if (ready) return
    ready = true
    const callbacks = readyCallbacks
    readyCallbacks = []
    for (const callback of callbacks) callback(engine)
  }

  map.on("load", markReady)
  map.on("ready", markReady)
  map.on("error", (event: unknown) => input.error((event as any)?.error ?? event))

  engine.setMarks(input.marks)

  return engine
}
