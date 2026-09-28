---
title: Maps
description: Interactive maps with q-map — MapTiler styles, markers, popups, theming
  and dark mode, loaded client-side only.
navigation:
  icon: lucide:map
seo:
  title: Maps (QMap)
  description: QMap — interactive maps for Vue 3 powered by the MapTiler SDK JS, with markers, popups, styles, providers and dark-mode theming.
---

**`<q-map>`** renders an interactive map, powered by the **MapTiler SDK JS** (a
MapLibre GL JS superset). The SDK is loaded **client-side only**, on mount — nothing
map-related runs during SSR. A position is always `[longitude, latitude]`.

## First map

::prose-show-case
:dnax-demo-map{demo="basic"}

#code

```vue
<script setup lang="ts">
const marks = [
  { type: "marker", position: [2.3522, 48.8566], label: "Paris", color: "primary" },
]
</script>

<template>
  <q-map center="[2.3522, 48.8566]" :zoom="11.5" :marks="marks" />
</template>
```
::

`center` accepts `[lng, lat]`, `"lng,lat"` or `{ lng, lat }`; `height` a number (px) or a
CSS length (`"40vh"`). For the keyless providers, `tiles` and `attribution` choose the
raster source (see [OpenStreetMap](/docs/maps/openstreetmap) and
[Leaflet](/docs/maps/leaflet)). Every option of the engine that is not a prop goes
through `options` — merged **last**:

```vue
<q-map :options="{ maxZoom: 16, pitch: 45, hash: true }" />
```

## Providers

`provider` picks the engine and the tiles:

- **`maptiler`** *(default)* — MapTiler Cloud vector styles, terrain and satellite
  imagery, with an API key;
- **`maplibre`** — MapLibre GL JS alone: open-source vector maps, free styles, no key;
- **`openstreetmap`** — the keyless OpenStreetMap raster, on the MapTiler SDK (and the
  automatic fallback when no key is set);
- **`leaflet`** — the keyless OpenStreetMap raster too, but on the lighter **Leaflet**
  engine, with any XYZ tile source.

Each provider has its own page:

::prose-card{icon="lucide:layers" title="MapTiler" to="/docs/maps/maptiler"}
The default provider: vector styles (and their dark variants), 3D terrain, globe projection, controls, client APIs — and the API key.
::

::prose-card{icon="lucide:globe" title="OpenStreetMap" to="/docs/maps/openstreetmap"}
No key at all, via the MapTiler SDK — and the automatic fallback when no MapTiler key is set.
::

::prose-card{icon="lucide:map-pinned" title="Leaflet" to="/docs/maps/leaflet"}
The lighter raster engine: keyless tiles, any XYZ source, SVG pins — no WebGL, no MapTiler dependency.
::

::prose-card{icon="lucide:shapes" title="MapLibre" to="/docs/maps/maplibre"}
Open-source vector maps without any key: free styles, any style URL, globe projection, the whole MapLibre GL JS API.
::

The key is given once to the whole app, or per map:

```vue
<q-config-provider :component-props="{ QMap: { apiKey: 'YOUR_MAPTILER_KEY' } }">
  <q-map … />      <!-- chaque carte de l'app -->
</q-config-provider>

<q-map api-key="YOUR_MAPTILER_KEY" … />
```

**Without a key**, `provider="maptiler"` falls back to the OpenStreetMap raster with a
console warning — the frame is never left empty.

## Marks

`marks` is a list of **flat literal objects**, exactly like `<q-chart>` marks — no
factory, no namespace. A mark is positioned by `position` (`[lng, lat]`, `"lng,lat"` or
`{ lng, lat }`) or by `lng` / `lat`; a mark without a valid position is simply ignored.

| Key | Type | Description |
| --- | --- | --- |
| `type` | `"marker"` \| `"popup"` | a pin (with an optional bubble), or a standalone bubble |
| `position` | `[lng, lat]` \| `"lng,lat"` \| `{ lng, lat }` | where the mark sits |
| `lng` / `lat` | `number` \| `string` | alternative to `position` |
| `label` | `string` | bubble text (escaped) |
| `html` | `string` | bubble HTML — wins over `label`, inserted as-is |
| `color` | `string` | pin colour: a dnax token (`primary`, `chart-2`…) or any CSS colour |
| `open` | `boolean` | bubble open on load (`popup` marks are open by default) |
| `offset` | `number` | bubble offset in px (default `18`) |
| `draggable` | `boolean` | the pin can be dragged (`marker` only) |

::prose-show-case
:dnax-demo-map{demo="marks"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const marks = [
  { type: "marker", position: [2.2945, 48.8584], label: "Tour Eiffel", color: "primary", open: true },
  { type: "marker", position: [2.3499, 48.853], html: "<b>Notre-Dame</b>", color: "chart-2" },
  { type: "marker", position: [2.3431, 48.8615], color: "negative" },
  { type: "popup", position: [2.3376, 48.8606], label: "Le Louvre", open: true },
]

const picked = ref<string | null>(null)
</script>

<template>
  <q-map
    center="[2.3364, 48.8606]"
    :zoom="12.6"
    :marks="marks"
    @pick="picked = `${$event.mark.label} — ${$event.lat}, ${$event.lng}`"
  />
</template>
```
::

`@pick` fires when a mark is clicked, with `{ mark, index, position, lng, lat }` — enough
to drive a detail panel, a filter or the URL. `@ready` hands over the SDK's `Map`
instance, and the component exposes it as well (`map`, plus `refresh()` after the
container becomes visible):

```vue
<q-map ref="map" … @ready="onReady" />

<script setup lang="ts">
const map = ref()

const onReady = (instance: any) => {
  instance.on("click", (e: any) => console.log(e.lngLat))
  instance.flyTo({ center: [2.35, 48.85], zoom: 15 })
}
</script>
```

## Styles & dark mode

`style` takes the SDK's shorthand names — `streets` (default), `satellite`, `hybrid`,
`outdoor`, `winter`, `dataviz`, `basic`, `bright`, `topo`, `voyager`, `toner`, `ocean`,
`landscape`, `aquarelle`, `backdrop`, `stage`, `openstreetmap` — or a style ID / URL.
[MapTiler](/docs/maps/maptiler) has the full table.

The **dark variant** of the current style is picked up automatically when the app
switches to dark mode (the `.dark` class on `<html>`, i.e. the same switch as every other
component) — the popups and the map controls follow the theme too, through CSS tokens.
Force a variant with `:dark="true"` or `:dark="false"`.

## Terrain, projection, controls

`terrain` enables the 3D relief, `projection="globe"` switches to the globe, and the four
controls take `true` (the SDK's default corner), `false`, or a corner name
(`top-left`, `top-right`, `bottom-left`, `bottom-right`):

```vue
<q-map map-style="outdoor" terrain projection="globe" navigation="top-right" :scale="true" />
```

## API

:dnax-api{name="QMap"}
