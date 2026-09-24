<script setup lang="ts">
// Live demos for the Radio page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "group" | "colors" | "layout" | "disabled"
}>()

const transport = ref("car")
const theme = ref("dark")
</script>

<template>
  <div v-if="demo === 'group'" class="demo-group">
    <q-radio v-model="transport" val="car" label="Car" />
    <q-radio v-model="transport" val="bike" label="Bike" />
    <q-radio v-model="transport" val="walk" label="Walk" />
  </div>

  <div v-else-if="demo === 'colors'" class="demo-group">
    <q-radio v-model="theme" val="dark" label="Dark" color="primary" />
    <q-radio v-model="theme" val="system" label="System" color="secondary" />
    <q-radio v-model="theme" val="light" label="Light" color="teal" />
  </div>

  <div v-else-if="demo === 'layout'" class="demo-group">
    <q-radio v-model="transport" val="car" label="Left label" left-label />
    <q-radio v-model="transport" val="bike" label="Dense" dense color="secondary" />
  </div>

  <div v-else-if="demo === 'disabled'" class="demo-group">
    <q-radio v-model="transport" val="car" label="Car (disabled)" disable />
    <q-radio v-model="transport" val="walk" label="Walk (readonly)" readonly />
  </div>
</template>

<style scoped>
.demo-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
</style>
