<script setup lang="ts">
// Live demos for the Rating page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "sizes" | "icons" | "readonly"
}>()

const note = ref(3)
const review = ref(4)
const hearts = ref(5)
const fixed = ref(5)
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-rating">
    <q-rating v-model="note" :max="5" />
  </div>

  <div v-else-if="demo === 'sizes'" class="demo-rating">
    <q-rating v-model="review" :max="5" color="secondary" size="sm" />
    <q-rating v-model="review" :max="5" color="warning" size="md" />
    <q-rating v-model="review" :max="5" color="primary" size="xl" />
  </div>

  <div v-else-if="demo === 'icons'" class="demo-rating">
    <q-rating v-model="hearts" :max="5" icon="lucide:heart" color="red" no-dimming />
  </div>

  <div v-else-if="demo === 'readonly'" class="demo-rating">
    <q-rating v-model="fixed" :max="5" readonly />
    <q-rating v-model="fixed" :max="5" color="teal" disable />
  </div>
</template>

<style scoped>
.demo-rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
}
</style>
