<script setup lang="ts">
// Live demos for the Row page (page styles only).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "gap" | "responsive" | "responsiveMixed" | "align"
}>()
</script>

<template>
  <q-row v-if="demo === 'basic'" gap="12px" class="demo-grid">
    <q-col :span="6"><div class="demo-cell">6</div></q-col>
    <q-col :span="6"><div class="demo-cell">6</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
    <q-col :span="4"><div class="demo-cell">4</div></q-col>
  </q-row>

  <q-row v-else-if="demo === 'gap'" gap="8px" column-gap="28px" class="demo-grid">
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="2"><div class="demo-cell">2</div></q-col>
    <q-col :span="3"><div class="demo-cell">3</div></q-col>
    <q-col :span="3"><div class="demo-cell">3</div></q-col>
  </q-row>

  <q-row v-else-if="demo === 'responsive'" gap="12px" class="demo-grid">
    <q-col :span="12" :span-md="6" :span-lg="3"><div class="demo-cell">12 · 6 · 3</div></q-col>
    <q-col :span="12" :span-md="6" :span-lg="3"><div class="demo-cell">12 · 6 · 3</div></q-col>
    <q-col :span="12" :span-md="6" :span-lg="3"><div class="demo-cell">12 · 6 · 3</div></q-col>
    <q-col :span="12" :span-md="6" :span-lg="3"><div class="demo-cell">12 · 6 · 3</div></q-col>
  </q-row>

  <q-row v-else-if="demo === 'responsiveMixed'" gap="12px" class="demo-grid">
    <q-col :span="12" :span-md="6" :span-lg="3"><div class="demo-cell">12·6·3</div></q-col>
    <q-col :span="12" :span-md="6" :span-lg="3"><div class="demo-cell">12·6·3</div></q-col>
    <q-col :span="12" :span-md="4" :span-lg="6"><div class="demo-cell">12·4·6</div></q-col>
    <q-col :span="12" :span-md="4" :span-lg="6"><div class="demo-cell">12·4·6</div></q-col>
    <q-col :span="12" :span-md="4" :span-lg="12"><div class="demo-cell">12·4·12</div></q-col>
  </q-row>

  <q-row
    v-else-if="demo === 'align'"
    gap="12px"
    align="center"
    style="height: 140px"
    class="demo-grid"
  >
    <q-col :span="4"><div class="demo-cell">center</div></q-col>
    <q-col :span="4" align-self="end"><div class="demo-cell">end (per cell)</div></q-col>
  </q-row>
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
  /* content must never overflow the cell (narrow columns) */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
