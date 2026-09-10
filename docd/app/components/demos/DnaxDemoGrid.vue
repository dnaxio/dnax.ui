<script setup lang="ts">
// Live demos for the Grid page (page styles only).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo:
    | "layout"
    | "responsive"
    | "colsResponsive"
    | "cells"
    | "six"
    | "square"
    | "horizontal"
    | "custom"
}>()
</script>

<template>
  <q-grid v-if="demo === 'layout'" :cols="12" gap="16px" class="demo-grid">
    <q-col :span="12"><div class="demo-cell">12</div></q-col>
    <q-col :span="6"><div class="demo-cell">6</div></q-col>
    <q-col :span="6"><div class="demo-cell">6</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
  </q-grid>

  <q-grid v-else-if="demo === 'responsive'" :cols="12" gap="12px" class="demo-grid">
    <q-col :span="12" :span-md="8" :span-lg="6"><div class="demo-cell demo-cell--accent">Main</div></q-col>
    <q-col :span="12" :span-md="4" :span-lg="6"><div class="demo-cell demo-cell--accent">Side</div></q-col>
    <q-col v-for="i in 6" :key="i" :span="6" :span-md="4" :span-lg="2">
      <div class="demo-cell">Card {{ i }}</div>
    </q-col>
  </q-grid>

  <q-grid v-else-if="demo === 'colsResponsive'" :cols="12" gap="12px" class="demo-grid">
    <q-col v-for="i in 6" :key="i" :span="12" :span-md="6" :span-lg="4">
      <div class="demo-cell">Item {{ i }}</div>
    </q-col>
  </q-grid>

  <q-grid v-else-if="demo === 'cells'" :column-num="4" gutter="8" border clickable class="demo-grid">
    <q-grid-item icon="lucide:image" text="Photos" badge="3" />
    <q-grid-item icon="lucide:video" text="Videos" />
    <q-grid-item icon="lucide:music" text="Music" dot />
    <q-grid-item icon="lucide:settings" text="Settings" />
  </q-grid>

  <q-grid v-else-if="demo === 'six'" :column-num="4" gutter="8" border clickable class="demo-grid">
    <q-grid-item icon="lucide:image" text="Photos" />
    <q-grid-item icon="lucide:video" text="Videos" />
    <q-grid-item icon="lucide:music" text="Music" />
    <q-grid-item icon="lucide:map" text="Maps" />
    <q-grid-item icon="lucide:book" text="Books" />
    <q-grid-item icon="lucide:settings" text="Settings" />
  </q-grid>

  <q-grid v-else-if="demo === 'square'" :column-num="3" gutter="10" square border clickable class="demo-grid">
    <q-grid-item icon="lucide:camera" text="Camera" />
    <q-grid-item icon="lucide:map" text="Maps" />
    <q-grid-item icon="lucide:book" text="Books" badge="12" />
  </q-grid>

  <q-grid
    v-else-if="demo === 'horizontal'"
    :column-num="2"
    gutter="10"
    border
    clickable
    direction="horizontal"
    class="demo-grid"
  >
    <q-grid-item icon="lucide:phone" text="Call" />
    <q-grid-item icon="lucide:mail" text="Email" />
  </q-grid>

  <q-grid v-else-if="demo === 'custom'" :column-num="4" gutter="8" border clickable class="demo-grid">
    <q-grid-item href="/docs" icon="lucide:book-open" text="Docs" />
    <q-grid-item
      icon="lucide:heart"
      text="Favorites"
      icon-color="#e91e63"
      badge="99+"
    />
    <q-grid-item disable icon="lucide:lock" text="Locked" />
    <q-grid-item>
      <template #icon>
        <q-spinner size="24px" color="primary" />
      </template>
      <template #default>Loading</template>
    </q-grid-item>
  </q-grid>
</template>

<style scoped>
/* The global `.demo-grid` helper is a flex row; the source page only used it as
   an inert hook, so restore the QGrid layout it must not override. */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(var(--q-grid-cols, 12), minmax(0, 1fr));
  gap: var(--q-grid-gap, 16px);
  row-gap: var(--q-grid-row-gap, var(--q-grid-gap, 16px));
  column-gap: var(--q-grid-column-gap, var(--q-grid-gap, 16px));
  width: 100%;
}

.demo-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border-radius: 8px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary, #1976d2);
  font-size: 13px;
  font-weight: 600;
}
.demo-cell--accent {
  background: rgb(25 118 210 / 0.18);
}
</style>
