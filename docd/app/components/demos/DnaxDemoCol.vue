<script setup lang="ts">
// Live demos for the Col page (page styles only).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "span" | "auto" | "offset" | "responsive" | "alignSelf"
}>()
</script>

<template>
  <q-grid v-if="demo === 'span'" :cols="12" gap="12px" class="demo-grid">
    <q-col :span="12"><div class="demo-cell">12</div></q-col>
    <q-col :span="6"><div class="demo-cell">6</div></q-col>
    <q-col :span="6"><div class="demo-cell">6</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="3"><div class="demo-cell">3</div></q-col>
    <q-col :span="3"><div class="demo-cell">3</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
  </q-grid>

  <q-grid v-else-if="demo === 'auto'" :cols="12" gap="12px" class="demo-grid">
    <q-col><div class="demo-cell">auto</div></q-col>
    <q-col><div class="demo-cell">auto</div></q-col>
    <q-col :span="8"><div class="demo-cell">span 8</div></q-col>
  </q-grid>

  <q-grid v-else-if="demo === 'offset'" :cols="12" gap="12px" class="demo-grid">
    <q-col :span="6" :offset="3"><div class="demo-cell">span 6, offset 3</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="2" :offset="2"><div class="demo-cell">2, offset 2</div></q-col>
  </q-grid>

  <q-grid v-else-if="demo === 'responsive'" :cols="12" gap="12px" class="demo-grid">
    <q-col :span="12" :span-md="8" :span-lg="6"><div class="demo-cell demo-cell--accent">Main</div></q-col>
    <q-col :span="12" :span-md="4" :span-lg="6"><div class="demo-cell demo-cell--accent">Side</div></q-col>
    <q-col v-for="i in 6" :key="i" :span="6" :span-md="4" :span-lg="2">
      <div class="demo-cell">Card {{ i }}</div>
    </q-col>
  </q-grid>

  <q-grid
    v-else-if="demo === 'alignSelf'"
    :cols="12"
    gap="12px"
    align="center"
    style="height: 140px"
    class="demo-grid"
  >
    <q-col :span="4"><div class="demo-cell">default (center)</div></q-col>
    <q-col :span="4" align-self="start"><div class="demo-cell">start</div></q-col>
    <q-col :span="4" align-self="end"><div class="demo-cell">end</div></q-col>
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
