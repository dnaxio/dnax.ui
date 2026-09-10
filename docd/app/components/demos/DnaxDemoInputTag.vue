<script setup lang="ts">
// Live demos for the Input Tag page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "events" | "states"
}>()

const emails = ref(["ada@dnax.dev", "grace@dnax.dev"])
const features = ref(["Wi-Fi", "GPS"])
const limited = ref(["alpha"])
const lastEvent = ref("")
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-field">
    <q-input-tag
      v-model="emails"
      label="Emails"
      placeholder="Type and press Enter"
      outlined
    />
  </div>

  <div v-else-if="demo === 'events'" class="demo-field">
    <q-input-tag
      v-model="features"
      label="Features"
      placeholder="Add a feature…"
      outlined
      @add="lastEvent = 'added: ' + $event"
      @remove="lastEvent = 'removed: ' + $event"
    />
    <p class="demo-p demo-event">Last event: {{ lastEvent || "—" }}</p>
  </div>

  <div v-else-if="demo === 'states'" class="demo-col">
    <q-input-tag v-model="limited" label="Max 3 tags" :max-tags="3" outlined />
    <q-input-tag v-model="features" label="Filled & dense" filled dense />
    <q-input-tag v-model="emails" label="Disabled" disable outlined />
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.demo-col {
  gap: 16px;
  max-width: 420px;
  margin: 0 auto;
}
.demo-event {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
</style>
