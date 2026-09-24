<script setup lang="ts">
// Démos live de la page directive v-touch-swipe (état par page).
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic"
}>()

const direction = ref("—")
const speed = ref("—")
const count = ref(0)

const onSwipe = (details: any) => {
  count.value++
  direction.value = details.direction
  speed.value = `${Math.round(details.speed.x)}, ${Math.round(details.speed.y)}px/s`
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-swipe">
    <div class="swipe-pad" v-touch-swipe.horizontal.mouse.prevent="onSwipe">
      Swipe me ← / →
    </div>
    <p class="swipe-meta">
      swipes: <code>{{ count }}</code> · direction: <code>{{ direction }}</code>
      · speed: <code>{{ speed }}</code>
    </p>
  </div>
</template>

<style scoped>
.swipe-pad {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 1px dashed var(--border);
  border-radius: 14px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  font-weight: 600;
  user-select: none;
  touch-action: pan-y;
}
.swipe-meta {
  font-size: 12px;
  color: #5b6472;
}
.swipe-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
