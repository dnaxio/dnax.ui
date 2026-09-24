<script setup lang="ts">
// Live demos for the Infinite Scroll page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "animated" | "slot" | "silent"
}>()

// 20 initial items, +10 on every scroll, 60 max.
const items = ref(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
let seq = 20
const total = 60

const loadMore = (index: number, done: () => void) => {
  setTimeout(() => {
    const next = Math.min(seq + 10, total)
    for (let i = seq + 1; i <= next; i++) items.value.push(`Item ${i}`)
    seq = next
    done()
  }, 700)
}
</script>

<template>
  <div class="demo-scroll">
    <q-infinite-scroll v-if="demo === 'basic'" :offset="200" @load="loadMore">
      <div v-for="it in items" :key="it" class="demo-item">
        <q-icon name="lucide:inbox" color="primary" size="16px" />
        <span>{{ it }}</span>
      </div>
    </q-infinite-scroll>

    <q-infinite-scroll v-else-if="demo === 'animated'" :offset="200" animated @load="loadMore">
      <div v-for="it in items" :key="it" class="demo-item">
        <q-icon name="lucide:inbox" color="primary" size="16px" />
        <span>{{ it }}</span>
      </div>
    </q-infinite-scroll>

    <q-infinite-scroll v-else-if="demo === 'slot'" :offset="200" @load="loadMore">
      <div v-for="it in items" :key="it" class="demo-item">
        <q-icon name="lucide:inbox" color="primary" size="16px" />
        <span>{{ it }}</span>
      </div>
      <template #loading>
        <q-btn unelevated dense color="primary" no-caps :loading="true" label="Loading more…" />
      </template>
    </q-infinite-scroll>

    <q-infinite-scroll
      v-else-if="demo === 'silent'"
      :offset="200"
      hide-loading
      animated
      @load="loadMore"
    >
      <div v-for="it in items" :key="it" class="demo-item">
        <q-icon name="lucide:inbox" color="primary" size="16px" />
        <span>{{ it }}</span>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<style scoped>
.demo-scroll {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  padding: 8px;
  background: #fff;
}
.demo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--foreground);
}
.demo-item:nth-child(odd) {
  background: rgb(0 0 0 / 0.03);
}
</style>
