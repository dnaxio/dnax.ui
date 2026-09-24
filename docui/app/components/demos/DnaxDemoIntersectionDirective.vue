<script setup lang="ts">
// Démos live de la page directive v-intersection (état par page).
// Nom distinct de `DnaxDemoIntersection.vue`, déjà utilisé par la page
// composant QIntersection (4.components/intersection.md).
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic"
}>()

const visible = ref<Record<number, boolean>>({})
const onceCount = ref(0)

const mark = (index: number, isIntersecting: boolean) => {
  visible.value[index] = isIntersecting
}
const onOnce = () => {
  onceCount.value++
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-intersection">
    <div class="ix-scroll">
      <div
        v-for="i in 8"
        :key="i"
        class="ix-card"
        :class="{ 'ix-card--on': visible[i] }"
        v-intersection="(entry: any) => mark(i, entry.isIntersecting)"
      >
        Card {{ i }} — {{ visible[i] ? "visible" : "hidden" }}
      </div>
      <div class="ix-sentinel" v-intersection.once="onOnce">
        Sentinel (.once) fired {{ onceCount }} time(s)
      </div>
    </div>
    <p class="ix-meta">
      {{ Object.values(visible).filter(Boolean).length }} card(s) visible
    </p>
  </div>
</template>

<style scoped>
.ix-scroll {
  height: 260px;
  padding: 12px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.05);
}
.ix-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  margin-bottom: 10px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  color: var(--foreground);
  font-size: 13px;
  transition: background-color 0.25s ease, color 0.25s ease;
}
.ix-card--on {
  background: var(--primary);
  color: #fff;
}
.ix-sentinel {
  padding: 10px;
  border: 1px dashed var(--border);
  border-radius: 10px;
  font-size: 12px;
  text-align: center;
  color: #5b6472;
}
.ix-meta {
  font-size: 12px;
  color: #5b6472;
}
.ix-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
