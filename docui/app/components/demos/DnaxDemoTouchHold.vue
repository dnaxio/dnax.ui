<script setup lang="ts">
// Démos live de la page directive v-touch-hold (état par page).
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic"
}>()

const count = ref(0)
const fastCount = ref(0)
const last = ref({ duration: 0, x: 0, y: 0 })

const onHold = (details: any) => {
  count.value++
  last.value = {
    duration: details.duration,
    x: Math.round(details.position.left),
    y: Math.round(details.position.top),
  }
}

const onFastHold = (details: any) => {
  fastCount.value++
  last.value = {
    duration: details.duration,
    x: Math.round(details.position.left),
    y: Math.round(details.position.top),
  }
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-hold">
    <div class="hold-row">
      <button class="hold-pad" type="button" v-touch-hold.mouse="onHold">
        Hold 600ms
      </button>
      <button
        class="hold-pad hold-pad--fast"
        type="button"
        v-touch-hold.mouse="{ time: 350, sensitivity: 6 }"
        @click="fastCount++"
      >
        Hold 350ms
      </button>
    </div>
    <p class="hold-meta">
      holds: <code>{{ count }}</code> · fast: <code>{{ fastCount }}</code>
      · last: <code>{{ last.duration }}ms</code> at
      <code>{{ last.x }}, {{ last.y }}</code>
    </p>
  </div>
</template>

<style scoped>
.hold-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.hold-pad {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 96px;
  border: none;
  border-radius: 16px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.18);
}
.hold-pad--fast {
  background: #7c3aed;
}
.hold-meta {
  margin: 14px 0 0;
  font-size: 12px;
  color: #5b6472;
}
.hold-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
