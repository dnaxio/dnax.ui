<script setup lang="ts">
// Live demos for the Reorder page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "custom" | "handle" | "disabled"
}>()

// — basic —
const names = ref([
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Edsger Dijkstra",
])
const lastEvent = ref("")
const onReorder = (e: { from: number; to: number }) => {
  lastEvent.value = `moved ${e.from + 1} → ${e.to + 1}`
}

// — custom items (cards) —
const tracks = ref([
  { id: "m83", title: "Midnight City", artist: "M83" },
  { id: "daft", title: "Instant Crush", artist: "Daft Punk" },
  { id: "fm", title: "Feels Like We Only Go Backwards", artist: "Tame Impala" },
  { id: "blond", title: "Pink + White", artist: "Frank Ocean" },
  { id: "ocean", title: "Bohemian Rhapsody", artist: "Queen" },
])

// — handle mode —
const queue = ref(["Now playing", "Next up", "Later", "Last"])

// — disabled —
const locked = ref(["Locked A", "Locked B", "Locked C"])
</script>

<template>
  <q-reorder
    v-if="demo === 'basic'"
    v-model="names"
    class="demo-list"
    @reorder="onReorder"
  >
    <template #item="{ item, index, dragging }">
      <div class="demo-row" :class="{ 'demo-row--dragging': dragging }">
        <span class="demo-row__index">{{ index + 1 }}</span>
        <span>{{ item }}</span>
      </div>
    </template>
  </q-reorder>

  <q-reorder v-else-if="demo === 'custom'" v-model="tracks" row-key="id" class="demo-list">
    <template #item="{ item, dragging }">
      <div class="demo-track" :class="{ 'demo-track--dragging': dragging }">
        <span class="demo-track__art">
          <q-icon name="lucide:music-2" size="16px" />
        </span>
        <div class="demo-track__meta">
          <b>{{ item.title }}</b>
          <span>{{ item.artist }}</span>
        </div>
      </div>
    </template>
  </q-reorder>

  <q-reorder v-else-if="demo === 'handle'" v-model="queue" handle class="demo-list">
    <template #item="{ item, index }">
      <span class="demo-row">{{ index + 1 }}. {{ item }}</span>
    </template>
  </q-reorder>

  <q-reorder v-else-if="demo === 'disabled'" v-model="locked" disable class="demo-list">
    <template #item="{ item }">
      <span class="demo-row">{{ item }}</span>
    </template>
  </q-reorder>
</template>

<style scoped>
/* — demo lists — */
.demo-list {
  max-width: 460px;
  margin: 0 auto;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  background: var(--background, #fff);
  font-size: 14px;
  color: var(--foreground);
}
.demo-row + .demo-row {
  margin-top: 6px;
}
.demo-row__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 7px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
}
.demo-row--dragging {
  border-color: var(--primary);
  box-shadow: 0 10px 24px rgb(25 118 210 / 0.18);
}

/* — track card — */
.demo-track {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  background: var(--background, #fff);
}
.demo-track + .demo-track {
  margin-top: 6px;
}
.demo-track__art {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: #fff;
  flex-shrink: 0;
}
.demo-track__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
}
.demo-track__meta b {
  font-size: 14px;
  color: var(--foreground);
}
.demo-track__meta span {
  font-size: 12px;
  color: #8b93a1;
}
.demo-track--dragging {
  border-color: var(--primary);
  box-shadow: 0 10px 24px rgb(124 58 237 / 0.2);
}
</style>
