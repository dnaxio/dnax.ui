<script setup lang="ts">
// Démos live de la page directive v-touch-repeat (état par page).
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic"
}>()

const value = ref(0)
const fastValue = ref(0)
const onRepeat = () => {
  value.value++
}
const onFastRepeat = () => {
  fastValue.value++
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-repeat">
    <div class="repeat-row">
      <button class="repeat-pad" type="button" v-touch-repeat.mouse="onRepeat">
        +1 (600 / 150ms)
      </button>
      <button
        class="repeat-pad repeat-pad--fast"
        type="button"
        v-touch-repeat.mouse="{ delay: 400, interval: 60 }"
      >
        +1 (400 / 60ms)
      </button>
    </div>
    <p class="repeat-meta">
      value: <code>{{ value }}</code> · fast: <code>{{ fastValue }}</code>
    </p>
  </div>
</template>

<style scoped>
.repeat-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.repeat-pad {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  box-shadow: 0 6px 16px rgb(0 0 0 / 0.16);
}
.repeat-pad--fast {
  background: #0d9488;
}
.repeat-meta {
  margin: 14px 0 0;
  font-size: 12px;
  color: #5b6472;
}
.repeat-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
