<script setup lang="ts">
// Live demos for the Virtual Scroll page (page data).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "mixed" | "tuning"
}>()

const rows = Array.from({ length: 50000 }, (_, i) => `Row ${i + 1}`)

const mixedRows = Array.from({ length: 20000 }, (_, i) => ({
  id: i,
  title: `Row ${i + 1}`,
  desc: `Description ${(i % 3) + 1}: ${["Short.", "Medium length text, a bit longer to wrap.", "A much longer description with enough words to wrap onto several lines and demonstrate real measured heights."][i % 3]}`,
}))
</script>

<template>
  <q-virtual-scroll v-if="demo === 'basic'" :items="rows" class="demo-vs">
    <template #default="{ item, ref }">
      <div :ref="ref" class="demo-vs-item">{{ item }}</div>
    </template>
  </q-virtual-scroll>

  <q-virtual-scroll v-else-if="demo === 'mixed'" :items="mixedRows" item-key="id" class="demo-vs">
    <template #default="{ item, ref }">
      <div :ref="ref" class="demo-vs-card">
        <b>{{ item.title }}</b>
        <p>{{ item.desc }}</p>
      </div>
    </template>
  </q-virtual-scroll>

  <q-virtual-scroll
    v-else-if="demo === 'tuning'"
    :items="rows"
    :virtual-scroll-slice-size="20"
    :virtual-scroll-item-size="40"
    class="demo-vs"
  >
    <template #default="{ item, ref }">
      <div :ref="ref" class="demo-vs-item">{{ item }}</div>
    </template>
  </q-virtual-scroll>
</template>

<style scoped>
/* — scrollable demo area — */
.demo-vs {
  height: 300px;
  border: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 10px;
  background: #fff;
}
.demo-vs-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
  font-size: 13px;
  color: var(--foreground);
}
.demo-vs-card {
  padding: 8px 16px;
  border-bottom: 1px solid rgb(0 0 0 / 0.08);
  font-size: 13px;
}
.demo-vs-card b {
  color: var(--foreground);
}
.demo-vs-card p {
  margin: 2px 0 0;
  color: #5b6472;
  line-height: 1.5;
}
</style>
