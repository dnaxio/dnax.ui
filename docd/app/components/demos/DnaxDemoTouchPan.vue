<script setup lang="ts">
// Démos live de la page directive v-touch-pan (état par page).
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic"
}>()

const x = ref(0)
const y = ref(0)
const direction = ref("—")
const last = ref({
  distance: { x: 0, y: 0 },
  duration: 0,
  speed: { x: 0, y: 0 },
  isFirst: false,
  isFinal: false,
})

const onPan = (details: any) => {
  x.value += details.delta.x
  y.value += details.delta.y
  direction.value = details.direction
  last.value = {
    distance: { x: details.distance.x, y: details.distance.y },
    duration: details.duration,
    speed: { x: Math.round(details.speed.x), y: Math.round(details.speed.y) },
    isFirst: details.isFirst,
    isFinal: details.isFinal,
  }
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-pan">
    <div class="pan-stage">
      <div
        class="pan-ball"
        v-touch-pan.horizontal.mouse.prevent="onPan"
        :style="{ transform: `translate(${x}px, ${y}px)` }"
      ></div>
    </div>
    <div class="pan-meta">
      direction: <code>{{ direction }}</code> ·
      distance: <code>{{ last.distance.x }}, {{ last.distance.y }}</code> ·
      duration: <code>{{ last.duration }}ms</code> ·
      speed: <code>{{ last.speed.x }}, {{ last.speed.y }}px/s</code> ·
      isFirst: <code>{{ last.isFirst }}</code> ·
      isFinal: <code>{{ last.isFinal }}</code>
    </div>
  </div>
</template>

<style scoped>
.pan-stage {
  position: relative;
  height: 220px;
  margin-bottom: 14px;
  overflow: hidden;
  border: 1px dashed var(--border);
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.06);
  user-select: none;
  touch-action: none;
}
.pan-ball {
  position: absolute;
  top: 80px;
  left: calc(50% - 30px);
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: var(--primary);
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.22);
  cursor: grab;
  will-change: transform;
}
.pan-meta {
  font-size: 12px;
  color: #5b6472;
  max-width: 100%;
}
.pan-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
