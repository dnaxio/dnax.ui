<script setup lang="ts">
// Démos live de la page Count Down (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { onBeforeUnmount, ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "formats" | "target" | "slot" | "controls"
}>()

const done = ref(false)
const ended = ref(false)
const target = ref(Date.now() + 15 * 60 * 1000)
const cd = ref<any>(null)

onBeforeUnmount(() => {
  cd.value?.pause()
})
</script>

<template>
  <template v-if="demo === 'basic'">
    <q-count-down :time="90" class="demo-time" @end="done = true" />
    <p class="demo-p demo-meta">{{ done ? "Done!" : "Counting down…" }}</p>
  </template>

  <div v-else-if="demo === 'formats'" class="demo-col">
    <q-count-down :time="90061" format="DD:HH:mm:ss" class="demo-time" />
    <q-count-down :time="3661" format="mm:ss" class="demo-time demo-time--sub" />
  </div>

  <div v-else-if="demo === 'target'">
    <q-count-down :to="target" format="HH:mm:ss" class="demo-time" />
  </div>

  <div v-else-if="demo === 'slot'">
    <q-count-down :time="30" class="demo-block">
      <template #default="{ formatted, progress, remaining }">
        <div class="demo-bar">
          <div class="demo-bar__fill" :style="{ width: progress * 100 + '%' }" />
        </div>
        <span class="demo-text">{{ formatted }} · {{ remaining }} ms left</span>
      </template>
    </q-count-down>
  </div>

  <div v-else-if="demo === 'controls'">
    <q-count-down ref="cd" :time="10" format="ss" class="demo-time" @end="ended = true" />
    <div class="demo-row">
      <q-btn dense outline no-caps label="Pause" @click="cd?.pause()" />
      <q-btn dense outline no-caps label="Resume" @click="cd?.start()" />
      <q-btn dense outline no-caps label="Reset" @click="cd?.reset()" />
    </div>
    <p class="demo-p demo-meta">{{ ended ? "Finished!" : "—" }}</p>
  </div>
</template>

<style scoped>
.demo-p {
  margin: 0;
}

.demo-meta {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}

.demo-time {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--foreground);
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.demo-time--sub {
  font-size: 22px;
  color: #8b93a1;
}

.demo-col {
  align-items: center;
  gap: 10px;
}

.demo-row {
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

/* — slot custom — */
.demo-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 320px;
  margin: 0 auto;
}

.demo-bar {
  height: 8px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.08);
  overflow: hidden;
}

.demo-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #1976d2, #7c3aed);
  transition: width 0.25s linear;
}

.demo-text {
  text-align: center;
  font-size: 14px;
  color: var(--foreground);
  font-variant-numeric: tabular-nums;
}
</style>
