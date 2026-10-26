---
title: Charts
description: QChart — declarative charts built from marks, painted on a canvas.
navigation:
  icon: lucide:chart-line
seo:
  title: Charts (QChart)
  description: QChart — marks, props and raw chart options.
---

**`<q-chart>`** draws a chart from a list of **marks**. A mark is a plain object —
`{ type: 'line', data, x, y }` — so a chart is *data*, not a component tree: nothing to
import, nothing to nest. Most marks are translated to chart options and painted on a canvas (the
renderer is loaded on the client only, so nothing heavy runs during server rendering); a
[`table`](/docs/charts/table) mark renders real HTML rows instead.

::prose-show-case
<dnax-demo-chart demo="overview"></dnax-demo-chart>

#code

```vue
<script setup lang="ts">
const monthly = [
  { month: "Jan", revenue: 42, cost: 28 },
  { month: "Feb", revenue: 51, cost: 31 },
  { month: "Mar", revenue: 47, cost: 30 },
  { month: "Apr", revenue: 63, cost: 35 },
]
</script>

<template>
  <q-chart
    title="Overview"
    :height="260"
    :marks="[
      { type: 'bar', data: monthly, x: 'month', y: 'cost', fill: 'chart-3', name: 'Cost' },
      { type: 'line', data: monthly, x: 'month', y: 'revenue', stroke: 'primary', name: 'Revenue' },
      { type: 'rule', y: [50], stroke: 'chart-5' },
    ]"
  />
</template>
```

::

Three marks, three layers: bars for the cost, a line for the revenue and a reference rule
at 50. Every mark brings its own `data`, so they can come from different sources.

## Marks

| `type`  | Draws                                | Notable keys                                  |
| ------- | ------------------------------------ | --------------------------------------------- |
| `line`  | Line through the points              | `stroke`, `strokeWidth`, `smooth`, `connectNulls`, `labels` |
| `area`  | Line with a filled surface           | `stroke`, `fill`, `stack`, `labels`           |
| `bar`   | Bars                                 | `fill`, `stack` (`true` / `'percent'`), `base` (floating), `orientation`, `labels` |
| `dot`   | Points                               | `fill`, `r` (radius → bubbles), `symbol`, `trend`, numeric `fill` → colour scale |
| `text`  | Labels                               | `text` (the label), `textAnchor`/`lineAnchor`, `dx`/`dy`, `fill`, `stroke` (halo) |
| `image` | One image per row                    | `src` (required), `width`/`height`/`r`, `rotate` |
| `pie`   | Pie / donut — one slice per row       | `radius`, `innerRadius`, `labels`, `fill`        |
| `heatmap` | Heat map — one cell per row          | `fill` (the value), `labels`, `labelFormat`      |
| `rule`  | Reference line                       | `y: [50]` (horizontal) or `x: [0]` (vertical), `label` |
| `band`  | Threshold band (`markArea`)          | `y0`/`y1` (or `x0`/`x1`), `fill`, `opacity`, `label` |
| `table` | The rows as a **table** (HTML)       | `columns` (`field`, `label`, `align`, `format`, `width`, `summary`), `sortBy`, `pageSize`, `totals` |
| `gauge` | Gauge — value and target             | `min`, `max`, `target`, `bands`, `unit`          |
| `funnel` | Funnel — one slice per stage        | `labels`, `labelFormat`                          |
| `radar` | Radar — multi-criteria comparison    | `x` indicator, `y` value, `z` series             |
| `treemap` | Hierarchy as nested areas         | `parent`, `value`                                |
| `sunburst` | Hierarchy as rings               | `parent`, `value`, `radius`                      |
| `sankey` | Flows between stages                | `x`/`y` (source/target), `value`                 |
| `boxplot` | Box plot — five numbers           | `values` (raw list) or `stats`                   |
| `histogram` | Histogram — native binning      | `bins`, `domain`, `labels`                       |
| `waterfall` | Waterfall — cumulative deltas  | `isTotal`, `negativeFill`, `labels`              |

Shared keys: `link` (join to the shared selection — see [Interaction](/docs/charts/interaction)),
`columns` (for a [Table](/docs/charts/table) mark),
`data` (rows, or plain values), `x` / `y` (the data mapping), `name` (legend
entry), **`z`** (one series — and one legend entry — per value), `fill` / `stroke`
(a series color), `opacity`, `title` (per-point tooltip), `orientation`. Series marks also accept
**`yAxis`** (`left` / `right`), **`labels`** + `labelPosition` + `labelFormat` and
**`thresholds`** (`[{ value, op, color }]`). Text marks add
their own keys — `text`, `textAnchor`, `lineAnchor`, `dx` / `dy`, `fontSize`… — listed on
the [Text](/docs/charts/text) page.

### Channels

A channel accepts three forms:

```ts
{ x: "month" }                  // field name, resolved per row
{ x: ["Jan", "Feb"] }           // explicit values (or a constant if a single one)
{ x: (d, i) => d.month }        // accessor function
```

Colors: the `--chart-1…6` palette by default, `primary` and friends to follow the host
theme, or any CSS color. See [Line](/docs/charts/line) for the full table.

## Props

| Prop      | Type             | Default          | Description                                                                   |
| --------- | ---------------- | ---------------- | ----------------------------------------------------------------------------- |
| `marks`   | `QChartMark[]`   | `[]`             | The layers of the chart.                                                      |
| `x` / `y` | `QChartAxis`     | —                | **Axis** config: `type` (`band`/`linear`/`time`/`log`), `label`, `min`, `max`, `grid`, `margin` (gap between the numbers and the axis — 16 px by default on the value axis), `format` (see [Formatting](/docs/charts/formatting)), `labelRotate`, `splitNumber`, `timeUnit` / `timeZone`. The `label` is always drawn **inside the frame**: the X name is **centred under** the axis, the Y name sits **top-left at the axis line** (so it is never clipped, whatever the tick width). |
| `yRight`  | `QChartAxis`     | —                | **Secondary Y axis**, on the right — marks target it with `yAxis: 'right'`. See [Dashboards](/docs/charts/dashboards). |
| `locale`  | `string`         | provider         | Locale of numbers and dates (`fr-FR` with a French provider, `en-US` otherwise). |
| `compact` | `boolean`        | `false`          | Mini-widget: reduced margins, no axis labels / lines / legend, no split lines. |
| `height`  | `number \| string` | `280`          | Container height (a number is read as pixels, otherwise a CSS value).          |
| `title`   | `string`         | —                | Chart title.                                                                   |
| `colors`  | `string[]`       | `--chart-1…6`    | Series palette, for marks without an explicit color.                           |
| `legend`  | `boolean \| QChartLegend` | auto      | `false` hides it, `true` forces it (by default: as soon as a series is named). An object places it: `{ position, offset, align }`. |
| `tooltip` | `boolean \| QChartTooltip` | `true`   | Hover tooltip (a blurred glass card, styled from the theme tokens). **`axis` trigger by default** on every cartesian chart (bar, line, dot…), with a shadow band for bars and a vertical cursor otherwise; `item` — point or cell by point — when a mark declares a `title`, or for a labels-only (`text`) chart. The object form adds `formatter`, `valueFormatter`, `nameFormatter`, `sortDesc`. |
| `group`   | `string`         | —                | **Linked charts**: charts sharing a group synchronize hover, tooltip, legend, zoom and emphasis. |
| `selected`| `QChartPick \| null` | `null`       | Currently selected element — highlighted in every series. See [Interaction](/docs/charts/interaction). |
| `link-mode`| `filter` \| `dim` | `filter`        | What happens to the rows that do **not** match the selection: removed, or **dimmed** at `dim-opacity`. Applies to every linked mark, **`table` rows included**. |
| `dim-opacity`| `number`      | `0.25`           | Opacity of the unselected elements in `link-mode="dim"`.              |
| `loading` | `boolean`        | `false`          | Loading overlay (slot `loading`, localised default).                           |
| `error`   | `boolean \| string` | —             | Error overlay — `true` for the localised message, or the message itself (slot `error`). |
| `empty`   | `boolean`        | auto             | Forces the empty overlay (otherwise shown when no mark has data; slot `empty`). |
| `texts`   | `object`         | i18n             | Overrides the built-in labels (`loading`, `empty`, `error`, `exportCsv`, `total`, `page`…). |
| `exportable` | `boolean`     | `false`          | `table` mark: shows the **CSV export** button.                                 |
| `options` | `object`         | —                | Raw chart options, merged **last** (escape hatch).                             |

::prose-callout{variant="note"}
The props `x`, `y` and `title` configure the **chart** (its axes and heading). Inside a
mark, the same names are **channels**: `x` / `y` are the data mapping and `title` is the
per-point tooltip. They never collide — a mark is just an object.
::

### Events and methods

`@ready` receives the chart instance, also available as `chart` on the component ref
(`refresh()` forces a re-render — useful after a hidden container becomes visible).
`@pick` fires on every click on an element, with a normalized payload (`{ name, value,
markName, dataIndex, … }`) — see [Interaction](/docs/charts/interaction).
`@unpick` fires when the user **deselects** (a re-click on the selected element, or on the
selected legend entry), with the dropped element — `@pick` receives `null` in the same movement. A legend click carries the very
same identity as a click on an element (`markName`, `markIndex`, `markType`, `dataIndex`,
`data`), with `origin: 'legend'`.

### Legend

The legend appears as soon as a series is named. It sits **above the plot area**, with a
comfortable **24 px gap** reserved in the grid — the plot is never pushed against the legend
(the first tick label of the axis sits right at the grid edge, so a small margin reads as an
overlap). Place the legend wherever it fits and set the gap:

::prose-show-case
<dnax-demo-chart demo="legend"></dnax-demo-chart>

#code

```vue
<script setup lang="ts">
const monthly = [
  { month: "Jan", revenue: 42, cost: 28 },
  { month: "Feb", revenue: 51, cost: 31 },
  { month: "Mar", revenue: 47, cost: 30 },
  { month: "Apr", revenue: 63, cost: 35 },
]

const marks = [
  { type: 'line', data: monthly, x: 'month', y: 'revenue', stroke: 'primary', name: 'Revenue' },
  { type: 'line', data: monthly, x: 'month', y: 'cost', stroke: 'chart-2', name: 'Cost' },
]
</script>

<template>
  <!-- Above the plot, with a generous gap -->
  <q-chart :height="170" :marks="marks" :legend="{ position: 'top', offset: 32 }" />

  <!-- Below, centred -->
  <q-chart :height="170" :marks="marks" :legend="{ position: 'bottom', align: 'center' }" />

  <!-- On the side: a vertical legend -->
  <q-chart :height="190" :marks="marks" :legend="{ position: 'right' }" />
</template>
```

::

| Key | Value | Effect |
| --- | --- | --- |
| `position` | `top` *(default)*, `bottom`, `left`, `right` | Where the legend sits. `left` / `right` turn it **vertical**. |
| `offset` | number (px, default `24`) | Gap between the legend and the plot area — the space is **reserved** in the grid, so nothing overlaps. |
| `align` | `start` *(default)*, `center`, `end` | Alignment along the edge, for a `top` or `bottom` legend. |
| `action` | `toggle` *(default)*, `select` | `toggle` hides the series (the default behaviour). `select` turns the legend into a **selector**: the click emits `@pick`, the series stay visible, and a second click on the same entry clears the selection. |

`legend: false` hides it, `legend: true` shows it even when no series is named.
With `action: 'select'` the legend drives the [Interaction](/docs/charts/interaction) link
instead of hiding series.

## The `options` escape hatch

Everything the marks do not cover goes through the `options` prop, which is merged **after**
the generated option (so it wins). Zoom, toolbox, `visualMap`, `dataset`, `aria`… all pass
that way:

```vue
<q-chart
  :marks="[/* … */]"
  :options="{ dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 0 }] }"
/>
```

::prose-callout{variant="warning"}
Features that are **not part of the bundle** are silently ignored: `dataZoom` (zoom and
panning) and `aria` (accessibility descriptions) are not registered by default, so passing them
through `options` has no effect. `markLine`, `markArea`, the radar coordinate and the colour
scales **are** registered — the marks rely on them.
::

## API

The options of each mark are listed on its own page — [Line](/docs/charts/line),
[Bar](/docs/charts/bar), [Rule](/docs/charts/rule), [Dot](/docs/charts/dot),
[Image](/docs/charts/image), [Text](/docs/charts/text), [Pie](/docs/charts/pie),
[Heatmap](/docs/charts/heatmap), [Band](/docs/charts/band), [Gauge](/docs/charts/gauge),
[Funnel](/docs/charts/funnel), [Radar](/docs/charts/radar), [Treemap](/docs/charts/treemap),
[Sankey](/docs/charts/sankey), [Boxplot](/docs/charts/boxplot),
[Histogram](/docs/charts/histogram), [Waterfall](/docs/charts/waterfall). Cross-cutting guides:
[Formatting](/docs/charts/formatting) and [Dashboards](/docs/charts/dashboards). The
component every mark goes through, and its props, events and methods:

:dnax-api{name="QChart"}

## Chart types

::prose-card{icon="lucide:chart-line" title="Line" to="/docs/charts/line"}
Lines, areas, dots and reference rules — marks, channels and the series palette.
::

::prose-card{icon="lucide:chart-column" title="Bar" to="/docs/charts/bar"}
Bars, grouped and stacked series through the `z` channel, horizontal orientation.
::

::prose-card{icon="lucide:minus" title="Rule" to="/docs/charts/rule"}
Reference lines: a target, a threshold, a baseline — horizontal or vertical.
::

::prose-card{icon="lucide:chart-scatter" title="Dot" to="/docs/charts/dot"}
Scatter plots and bubble charts — one point per row, sized by `r`.
::

::prose-card{icon="lucide:image" title="Image" to="/docs/charts/image"}
One image per row — portraits, flags or logos instead of dots.
::

::prose-card{icon="lucide:type" title="Text" to="/docs/charts/text"}
Labels at `x` and `y` — values on top of bars, annotations, per-point fonts.
::

::prose-card{icon="lucide:chart-pie" title="Pie" to="/docs/charts/pie"}
Pies and donuts — one slice per row, off the axes.
::

::prose-card{icon="lucide:grid-3x3" title="Heatmap" to="/docs/charts/heatmap"}
A value per cell — a colour scale over rows and columns.
::

::prose-card{icon="lucide:table" title="Table" to="/docs/charts/table"}
The same rows as a table — HTML, selectable, filtered by the shared selection.
::

::prose-card{icon="lucide:rectangle-horizontal" title="Band" to="/docs/charts/band"}
Threshold bands — target zones and alert ranges behind the data.
::

::prose-card{icon="lucide:gauge" title="Gauge" to="/docs/charts/gauge"}
A value, its target and coloured performance bands.
::

::prose-card{icon="lucide:filter" title="Funnel" to="/docs/charts/funnel"}
Acquisition and conversion pipelines — one slice per stage.
::

::prose-card{icon="lucide:radar" title="Radar" to="/docs/charts/radar"}
Multi-criteria comparison — one polygon per series.
::

::prose-card{icon="lucide:layout-grid" title="Treemap" to="/docs/charts/treemap"}
Hierarchies as nested areas — treemap and sunburst.
::

::prose-card{icon="lucide:git-fork" title="Sankey" to="/docs/charts/sankey"}
Flows between stages, as weighted links.
::

::prose-card{icon="lucide:chart-no-axes-combined" title="Boxplot" to="/docs/charts/boxplot"}
Distributions — quartiles and medians, from raw values or stats.
::

::prose-card{icon="lucide:chart-column-big" title="Histogram" to="/docs/charts/histogram"}
Native binning — `bins`, `domain`, per-bin counts.
::

::prose-card{icon="lucide:chart-waterfall" title="Waterfall" to="/docs/charts/waterfall"}
Cumulative deltas, totals and connectors.
::

::prose-card{icon="lucide:percent" title="Formatting" to="/docs/charts/formatting"}
FCFA, percentages, compact numbers, dates — through Intl.
::

::prose-card{icon="lucide:layout-dashboard" title="Dashboards" to="/docs/charts/dashboards"}
Secondary axis, 100 % stacks, floating bars, states and compact widgets.
::

::prose-card{icon="lucide:link" title="Interaction" to="/docs/charts/interaction"}
Link several charts together — synced hover and tooltip, click selection and cross-filtering.
::
