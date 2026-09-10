# Board

> Power BI-style dashboards — tiles laid out on a background grid, with drag & resize handled by QInteract.

**<q-board>** builds **Power BI-style dashboards**: a **background tile grid**
(columns × rows, optionally numbered) and, **inside it**, **QInteract** handling
the **drag & resize**. Widgets are expressed in **grid units** (`column, row, spanColumns, spanRows`) — ideal for a persistent, responsive, rebuildable layout.

## Dashboard demo

Move a tile or resize it (bottom-right handle): the background grid stays fixed
and the tile snaps back to the cells (`column / row / spanColumns / spanRows`).

<prose-show-case>
<dnax-demo-board demo="dashboard">



</dnax-demo-board>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

// Tiles in GRID units (Power BI-like)
const tiles = ref([
  { id: "kpi",   title: "KPI Sales", column: 0, row: 0, spanColumns: 4, spanRows: 3 },
  { id: "chart", title: "Revenue",   column: 4, row: 0, spanColumns: 5, spanRows: 5 },
])

// Drag / resize are handled INTERNALLY by QInteract (pixels), converted back
// to tiles: v-model:items receives rounded column/row/spanColumns/spanRows.
// layout() returns the current tiles (persistence / rebuild).
</script>

<template>
  <q-board
    v-model:items="tiles"
    v-model:selected="selected"
    :columns="12"
    :row-height="56"
    :gap="6"
    show-labels
  >
    <template #item="{ item }">
      <div class="tile" :style="{ background: item.color }">
        <strong>{{ item.title }}</strong>
        <span>col {{ item.column }} · row {{ item.row }} · {{ item.spanColumns }}×{{ item.spanRows }}</span>
      </div>
    </template>
  </q-board>

  <!--
    • :gap="6" (default 6) spaces the tiles.
    • collision (default true) blocks drag/resize on an occupied zone:
      :collision="false" allows free stacking.
    • show-labels numbers the background grid columns/rows.
    • readonly: frozen dashboard — drag disabled, resize handles hidden.
  -->
</template>
```

</template>
</prose-show-case>

## Notes

`QBoard` is the "dashboard" layer; it delegates drag & resize to `QInteract`
(see its page). The cell width is **adaptive** (the grid follows the container
width via ResizeObserver); the height is automatic according to the tiles (or
explicit `rows` / `height`). A `gap` spacing (default 6) keeps tiles from being
glued together, and `collision` (default true) blocks any overlap. `readonly`
disables drag & hides the handles (frozen dashboard).

## API

<dnax-api name="QBoard">



</dnax-api>
