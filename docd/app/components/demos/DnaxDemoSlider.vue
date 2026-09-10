<script setup lang="ts">
// Live demos for the Slider page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "markers" | "colors" | "states" | "vertical"
}>()

const val = ref(40)
const price = ref(120)
const volume = ref(60)
const locked = ref(50)
const vertical = ref(70)
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-slider">
    <q-slider v-model="val" :min="0" :max="100" :step="5" label />
  </div>

  <div v-else-if="demo === 'markers'" class="demo-slider">
    <q-slider v-model="price" :min="0" :max="300" :step="30" label label-always markers color="teal" />
  </div>

  <div v-else-if="demo === 'colors'" class="demo-slider">
    <q-slider v-model="volume" :min="0" :max="100" :step="5" label snap color="secondary" />
  </div>

  <div v-else-if="demo === 'states'" class="demo-row">
    <div class="demo-slider">
      <q-slider v-model="locked" label disable />
    </div>
    <div class="demo-slider">
      <q-slider v-model="locked" label readonly color="teal" />
    </div>
  </div>

  <div v-else-if="demo === 'vertical'" class="demo-slider-v">
    <q-slider v-model="vertical" :min="0" :max="100" vertical label markers color="primary" />
  </div>
</template>

<style scoped>
.demo-slider {
  width: 100%;
  max-width: 480px;
}
.demo-slider-v {
  width: 48px;
  height: 200px;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
}
</style>
