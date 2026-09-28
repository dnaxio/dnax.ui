// Tests unitaires de la traduction props → options du SDK MapTiler (`<q-map>`).
import { describe, expect, it } from "bun:test"
import {
  DEFAULT_CENTER,
  DEFAULT_MAP_HEIGHT,
  DEFAULT_ZOOM,
  escapeHtml,
  isKnownProvider,
  leafletOptionsOf,
  MAPLIBRE_DEMO_STYLE,
  maplibreOptionsOf,
  maplibreStyle,
  mapHeight,
  mapOptionsOf,
  mapStyleKey,
  markPosition,
  marksOf,
  OSM_ATTRIBUTION,
  OSM_STYLE,
  OSM_TILES,
  parsePosition,
  parseZoom,
  popupHtml,
  providerOf,
  safeCssColor,
  toLeaflet,
} from "./map"

describe("providerOf", () => {
  it("reconnaît les deux fournisseurs canoniques (casse et espaces ignorés)", () => {
    expect(providerOf("maptiler")).toBe("maptiler")
    expect(providerOf(" MapTiler ")).toBe("maptiler")
    expect(providerOf("openstreetmap")).toBe("openstreetmap")
    expect(providerOf("OpenStreetMap")).toBe("openstreetmap")
  })

  it("résout les alias osm / openstreet / open-street-map", () => {
    expect(providerOf("osm")).toBe("openstreetmap")
    expect(providerOf("OSM")).toBe("openstreetmap")
    expect(providerOf("openstreet")).toBe("openstreetmap")
    expect(providerOf("open-street-map")).toBe("openstreetmap")
  })

  it("reconnaît Leaflet", () => {
    expect(providerOf("leaflet")).toBe("leaflet")
    expect(providerOf(" Leaflet ")).toBe("leaflet")
    expect(providerOf("leaflet.js")).toBe("leaflet")
  })

  it("reconnaît MapLibre (et son alias map-libre)", () => {
    expect(providerOf("maplibre")).toBe("maplibre")
    expect(providerOf(" MapLibre ")).toBe("maplibre")
    expect(providerOf("map-libre")).toBe("maplibre")
    expect(providerOf("maplibre-gl")).toBe("maplibre")
  })

  it("retombe sur maptiler quand la valeur est absente ou inconnue", () => {
    expect(providerOf()).toBe("maptiler")
    expect(providerOf("")).toBe("maptiler")
    expect(providerOf("mapbox")).toBe("maptiler")
    expect(providerOf(42)).toBe("maptiler")
  })
})

describe("isKnownProvider", () => {
  it("accepte les noms canoniques, les alias et l'absence de valeur", () => {
    expect(isKnownProvider(undefined)).toBe(true)
    expect(isKnownProvider("maptiler")).toBe(true)
    expect(isKnownProvider("openstreetmap")).toBe(true)
    expect(isKnownProvider("osm")).toBe(true)
    expect(isKnownProvider("openstreet")).toBe(true)
    expect(isKnownProvider("leaflet")).toBe(true)
    expect(isKnownProvider("leaflet.js")).toBe(true)
    expect(isKnownProvider("maplibre")).toBe(true)
    expect(isKnownProvider("map-libre")).toBe(true)
    expect(isKnownProvider("mapbox")).toBe(false)
  })

  it("signale une faute de frappe", () => {
    expect(isKnownProvider("mapbox")).toBe(false)
    expect(isKnownProvider(" maptiler ")).toBe(true)
    expect(isKnownProvider(1)).toBe(false)
  })
})

describe("parsePosition", () => {
  it("accepte un tableau [lng, lat]", () => {
    expect(parsePosition([2.35, 48.85])).toEqual([2.35, 48.85])
  })

  it("accepte une chaîne (JSON ou séparateurs)", () => {
    expect(parsePosition("[2.35, 48.85]")).toEqual([2.35, 48.85])
    expect(parsePosition("2.35,48.85")).toEqual([2.35, 48.85])
    expect(parsePosition("2.35 48.85")).toEqual([2.35, 48.85])
    expect(parsePosition("2.35;48.85")).toEqual([2.35, 48.85])
  })

  it("accepte un objet { lng, lat } (ou lon)", () => {
    expect(parsePosition({ lng: 2.35, lat: 48.85 })).toEqual([2.35, 48.85])
    expect(parsePosition({ lon: "-73.98", lat: "40.75" })).toEqual([-73.98, 40.75])
  })

  it("rejette les valeurs illisibles ou hors bornes", () => {
    expect(parsePosition()).toBeUndefined()
    expect(parsePosition(null)).toBeUndefined()
    expect(parsePosition("Paris")).toBeUndefined()
    expect(parsePosition("2.35")).toBeUndefined()
    expect(parsePosition([2.35, "a"])).toBeUndefined()
    expect(parsePosition([200, 10])).toBeUndefined()
    expect(parsePosition([10, 95])).toBeUndefined()
    expect(parsePosition([Number.NaN, 10])).toBeUndefined()
  })
})

describe("parseZoom", () => {
  it("lit un nombre ou une chaîne numérique", () => {
    expect(parseZoom(12)).toBe(12)
    expect(parseZoom("12.5")).toBe(12.5)
  })

  it("borne à [0, 24] et ignore l'illisible", () => {
    expect(parseZoom(-3)).toBe(0)
    expect(parseZoom(99)).toBe(24)
    expect(parseZoom("")).toBeUndefined()
    expect(parseZoom(undefined)).toBeUndefined()
  })
})

describe("mapHeight", () => {
  it("convertit un nombre en px", () => {
    expect(mapHeight(420)).toBe("420px")
    expect(mapHeight("320")).toBe("320px")
  })

  it("rend une longueur CSS telle quelle", () => {
    expect(mapHeight("50vh")).toBe("50vh")
    expect(mapHeight(" clamp(240px, 40vh, 480px) ")).toBe("clamp(240px, 40vh, 480px)")
  })

  it("retombe sur la hauteur par défaut", () => {
    expect(mapHeight(undefined)).toBe(`${DEFAULT_MAP_HEIGHT}px`)
    expect(mapHeight(0)).toBe(`${DEFAULT_MAP_HEIGHT}px`)
    expect(mapHeight("   ")).toBe(`${DEFAULT_MAP_HEIGHT}px`)
  })
})

describe("mapStyleKey", () => {
  it("reconnaît les noms courts (casse et espaces ignorés)", () => {
    expect(mapStyleKey("streets")).toBe("streets")
    expect(mapStyleKey(" Streets ")).toBe("streets")
    expect(mapStyleKey("dataviz")).toBe("dataviz")
  })

  it("laisse passer un ID ou une URL de style", () => {
    expect(mapStyleKey("outdoor-v2")).toBeUndefined()
    expect(mapStyleKey("https://api.maptiler.com/maps/abc/style.json")).toBeUndefined()
    expect(mapStyleKey(undefined)).toBeUndefined()
  })
})

describe("marques", () => {
  it("résout la position (position > lng/lat)", () => {
    expect(markPosition({ type: "marker", position: [2.35, 48.85] })).toEqual([2.35, 48.85])
    expect(markPosition({ type: "marker", lng: 2.35, lat: 48.85 })).toEqual([2.35, 48.85])
    expect(markPosition({ type: "marker", position: "2.35,48.85", lng: 0, lat: 0 })).toEqual([2.35, 48.85])
    expect(markPosition({ type: "marker" })).toBeUndefined()
  })

  it("ne garde que les marques positionnées, dans l'ordre et avec leur index d'origine", () => {
    const marks = [
      { type: "marker" as const, position: [1, 2], label: "a" },
      { type: "marker" as const } as any,
      { type: "popup" as const, position: [3, 4], label: "b" },
    ] as any

    const specs = marksOf(marks)
    expect(specs.map((s) => s.index)).toEqual([0, 2])
    expect(specs.map((s) => s.position)).toEqual([
      [1, 2],
      [3, 4],
    ])
    expect(marksOf(null)).toEqual([])
  })

  it("préfère `html`, sinon échappe `label`", () => {
    expect(popupHtml({ type: "marker", html: "<b>hi</b>", label: "ignoré" })).toBe("<b>hi</b>")
    expect(popupHtml({ type: "marker", label: "<b>a & b</b>" })).toBe("&lt;b&gt;a &amp; b&lt;/b&gt;")
    expect(popupHtml({ type: "marker" })).toBeUndefined()
    expect(escapeHtml(`"quoted" & 'single'`)).toBe("&quot;quoted&quot; &amp; &#39;single&#39;")
  })
})

describe("mapOptionsOf", () => {
  it("applique les défauts (centre monde, zoom, style)", () => {
    const options = mapOptionsOf({ style: "STREETS_OBJ" })
    expect(options.center).toEqual([...DEFAULT_CENTER])
    expect(options.zoom).toBe(DEFAULT_ZOOM)
    expect(options.style).toBe("STREETS_OBJ")
    expect(options.apiKey).toBeUndefined()
  })

  it("passe la clé d'API en option et les contrôles demandés", () => {
    const options = mapOptionsOf({
      apiKey: "KEY",
      navigation: true,
      geolocate: false,
      scale: "bottom-left",
      fullscreen: "top-left",
    })

    expect(options.apiKey).toBe("KEY")
    expect(options.navigationControl).toBe(true)
    expect(options.geolocateControl).toBe(false)
    expect(options.scaleControl).toBe("bottom-left")
    expect(options.fullscreenControl).toBe("top-left")
  })

  it("n'impose aucun contrôle non demandé (défauts du SDK)", () => {
    const options = mapOptionsOf({})
    expect("navigationControl" in options).toBe(false)
    expect("geolocateControl" in options).toBe(false)
    expect("terrain" in options).toBe(false)
    expect("projection" in options).toBe(false)
  })

  it("force le style raster OpenStreetMap (et aucune clé) pour provider=\"openstreetmap\"", () => {
    const options = mapOptionsOf({
      provider: "openstreetmap",
      apiKey: "KEY",
      style: "streets",
    })
    expect(options.style).toEqual(OSM_STYLE)
    expect(options.apiKey).toBeUndefined()
  })

  it("accepte les alias de fournisseur (osm)", () => {
    const options = mapOptionsOf({ provider: "osm", style: "streets" })
    expect(options.style).toEqual(OSM_STYLE)
  })

  it("utilise les tuiles passées pour les fournisseurs raster", () => {
    const options = mapOptionsOf({
      provider: "openstreetmap",
      tiles: "https://tuiles.example/{z}/{x}/{y}.png",
      attribution: "© Moi",
    })

    expect(options.style.sources.osm.tiles).toEqual(["https://tuiles.example/{z}/{x}/{y}.png"])
    expect(options.style.sources.osm.attribution).toBe("© Moi")
  })

  it("fusionne `options` en dernier", () => {
    const options = mapOptionsOf({
      center: [1, 2],
      zoom: 5,
      options: { center: [3, 4], zoom: 9, interactive: false, maxZoom: 14 },
    })
    expect(options.center).toEqual([3, 4])
    expect(options.zoom).toBe(9)
    expect(options.interactive).toBe(false)
    expect(options.maxZoom).toBe(14)
  })
})

describe("toLeaflet / safeCssColor", () => {
  it("inverse lng/lat en lat/lng", () => {
    expect(toLeaflet([2.35, 48.85])).toEqual([48.85, 2.35])
  })

  it("laisse passer les couleurs CSS et rejette le reste", () => {
    expect(safeCssColor("#1976d2")).toBe("#1976d2")
    expect(safeCssColor(" rgb(25, 118, 210) ")).toBe("rgb(25, 118, 210)")
    expect(safeCssColor("oklch(0.5 0.1 200)")).toBe("oklch(0.5 0.1 200)")
    expect(safeCssColor('red" onload="alert(1)')).toBeUndefined()
    expect(safeCssColor("<script>")).toBeUndefined()
    expect(safeCssColor("red;background:url(x)")).toBeUndefined()
    expect(safeCssColor(undefined)).toBeUndefined()
  })
})

describe("leafletOptionsOf", () => {
  it("convertit le centre en [lat, lng] et applique les défauts de tuiles", () => {
    const options = leafletOptionsOf({ center: "[2.35, 48.85]", zoom: "12" })

    expect(options.center).toEqual([48.85, 2.35])
    expect(options.zoom).toBe(12)
    expect(options.tiles).toBe(OSM_TILES)
    expect(options.attribution).toBe(OSM_ATTRIBUTION)
    expect(options.mapOptions).toEqual({})
    expect(options.layerOptions).toEqual({})
  })

  it("répartit les options utilisateur entre L.map() et L.tileLayer()", () => {
    const options = leafletOptionsOf({
      tiles: " https://tuiles.example/{z}/{x}/{y}.png ",
      attribution: "© Moi",
      options: { zoomControl: false, maxZoom: 18, tileLayer: { detectRetina: true } },
    })

    expect(options.tiles).toBe("https://tuiles.example/{z}/{x}/{y}.png")
    expect(options.attribution).toBe("© Moi")
    expect(options.mapOptions).toEqual({ zoomControl: false, maxZoom: 18 })
    expect(options.layerOptions).toEqual({ detectRetina: true })
  })

  it("retombe sur la vue monde sans centre ni zoom", () => {
    const options = leafletOptionsOf()
    expect(options.center).toEqual(toLeaflet([...DEFAULT_CENTER]))
    expect(options.zoom).toBe(DEFAULT_ZOOM)
  })
})

describe("maplibreStyle / maplibreOptionsOf", () => {
  it("utilise le style de démonstration par défaut (et pour `streets`)", () => {
    expect(maplibreStyle().style).toBe(MAPLIBRE_DEMO_STYLE)
    expect(maplibreStyle().known).toBe(true)
    expect(maplibreStyle({ style: "streets" }).style).toBe(MAPLIBRE_DEMO_STYLE)
    expect(maplibreStyle({ style: "demotiles" }).style).toBe(MAPLIBRE_DEMO_STYLE)
  })

  it("reconnaît le raster OpenStreetMap, tuiles personnalisées comprises", () => {
    const osm = maplibreStyle({ style: "openstreetmap" })
    expect(osm.known).toBe(true)
    expect(osm.style.sources.osm.tiles).toEqual([OSM_TILES])

    const custom = maplibreStyle({
      style: "osm",
      tiles: "https://tuiles.example/{z}/{x}/{y}.png",
      attribution: "© Moi",
    })
    expect(custom.style.sources.osm.tiles).toEqual(["https://tuiles.example/{z}/{x}/{y}.png"])
    expect(custom.style.sources.osm.attribution).toBe("© Moi")
  })

  it("laisse passer une URL ou un objet de style", () => {
    expect(maplibreStyle({ style: "https://styles.example/style.json" }).style).toBe(
      "https://styles.example/style.json",
    )
    expect(maplibreStyle({ style: "/styles/local.json" }).style).toBe("/styles/local.json")

    const object = { version: 8, sources: {}, layers: [] }
    expect(maplibreStyle({ style: object as any }).style).toBe(object)
  })

  it("signale un nom court inconnu et retombe sur le style de démonstration", () => {
    const unknown = maplibreStyle({ style: "topo" })
    expect(unknown.known).toBe(false)
    expect(unknown.style).toBe(MAPLIBRE_DEMO_STYLE)
  })

  it("construit les options de MapLibre (centre, zoom, style, options brutes)", () => {
    const options = maplibreOptionsOf({
      center: "[2.35, 48.85]",
      zoom: "12",
      options: { maxZoom: 18, pitch: 45 },
    })

    expect(options.map.center).toEqual([2.35, 48.85])
    expect(options.map.zoom).toBe(12)
    expect(options.map.style).toBe(MAPLIBRE_DEMO_STYLE)
    expect(options.map.maxZoom).toBe(18)
    expect(options.map.pitch).toBe(45)
    expect(options.styleKnown).toBe(true)
  })
})
