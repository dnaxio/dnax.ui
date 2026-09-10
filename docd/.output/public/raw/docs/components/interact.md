# Interact

> A container of draggable, resizable widgets with grid snapping and Power BI-style dashboard layout helpers.

**<q-interact>** is a container of **positionable widgets**: each item
(`v-model:items`) can be dragged with the mouse or a finger and **resized**
(bottom-right grip), with **grid snapping**. The `x / y / w / h` positions are
exposed and kept in sync, and `toGrid(columns)` translates them into tiles
(column / row / span) to build **Power BI-style dashboards**.

## Dashboard demo

Drag a tile (anywhere, or its top handle with `handle`), resize with the
bottom-right grip, click to select (brings to front). Positions update on
`drag-end` / `resize-end` and are written back through `update:items`.

<prose-show-case>
<dnax-demo-interact demo="dashboard">



</dnax-demo-interact>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const items = ref([
  { id: "kpi", title: "KPI Sales", x: 16, y: 16, w: 240, h: 140 },
  { id: "chart", title: "Revenue", x: 276, y: 16, w: 300, h: 240 },
])

// events : drag-start/move/end, resize-start/move/end, select
// methods : addItem, removeItem, clear, bringToFront, toGrid(columns), realPos
// toGrid(12) → [{ x, y, column, row, spanColumns, spanRows }] pour reconstruire
// le dashboard sur d'autres écrans (Power BI-like).
</script>

<template>
  <q-interact
    v-model:items="items"
    v-model:selected="selected"
    height="440px"
    :snap="8"
    show-grid
  >
    <template #item="{ item }">
      <div class="widget" :style="{ background: item.color }">
        <strong>{{ item.title }}</strong>
        <span>x{{ item.x }} · y{{ item.y }}</span>
      </div>
    </template>
  </q-interact>
</template>
```

</template>
</prose-show-case>

## Notes

Naming: `QInteract` is the generic interactive container; if the intent is
dashboard tiles only, `QBoard` would be more explicit (an alias can be added).
Items carry any extra payload (title, type, color…). A dashboard can be persisted
as JSON (`toGrid()`) and re-created on any screen size. With `collision`, drag &
resize are blocked on occupied zones so items can't overlap (`QBoard` enables it by
default). `readonly` (or `interactive="false"`) disables drag and hides the resize
handles.

## API

<dnax-api name="QInteract">



</dnax-api>
