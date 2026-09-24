<script setup lang="ts">
// Live demos for the Spinner page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "types" | "sizes" | "colors"
}>()

type SpinnerType =
  | "tail" | "oval" | "bars" | "dots" | "grid" | "rings" | "puff" | "audio"
  | "ios" | "radio" | "gear" | "gears" | "cube"

const type = ref<SpinnerType>("tail")
const types = [
  "tail", "oval", "bars", "dots", "grid", "rings", "puff", "audio",
  "ios", "radio", "gear", "gears", "cube",
]
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-row">
    <q-spinner size="40px" color="primary" />
    <q-spinner type="ios" size="40px" color="secondary" />
    <q-spinner type="audio" size="40px" color="positive" />
    <q-spinner type="radio" size="40px" color="warning" />
    <q-spinner type="gear" size="40px" color="info" />
    <q-spinner type="gears" size="40px" color="teal" />
    <q-spinner type="cube" size="40px" color="#7c3aed" />
  </div>

  <div v-else-if="demo === 'types'" class="demo-col">
    <q-select v-model="type" :options="types" outlined dense label="Type" class="demo-select" />
    <q-spinner :type="type" size="44px" color="primary" />
  </div>

  <div v-else-if="demo === 'sizes'" class="demo-row">
    <q-spinner size="16px" />
    <q-spinner size="24px" color="secondary" />
    <q-spinner size="36px" color="positive" />
    <q-spinner size="48px" color="warning" />
    <q-spinner size="64px" color="teal" />
  </div>

  <div v-else-if="demo === 'colors'" class="demo-row">
    <q-spinner :thickness="3" color="primary" />
    <q-spinner :thickness="3" color="secondary" />
    <q-spinner :thickness="3" color="#7c3aed" />
    <q-spinner type="dots" color="negative" />
    <q-spinner type="audio" color="warning" />
    <q-spinner type="bars" color="positive" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 0;
}
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.demo-select {
  width: 200px;
}
</style>
