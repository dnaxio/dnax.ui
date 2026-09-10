<script setup lang="ts">
// Live demos for the Rolling Text page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "direction" | "stop-order" | "text" | "style" | "control"
}>()

// — exposed component refs (start / reset) —
const basicRef = ref()
const controlRef = ref()

const textList = ["aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee", "fffff", "ggggg"]
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-col">
    <q-rolling-text ref="basicRef" :start-num="0" :target-num="123" />
    <q-btn flat no-caps icon="replay" label="Replay" @click="basicRef?.reset()" />
  </div>

  <div v-else-if="demo === 'direction'" class="demo-row">
    <div class="demo-label">
      <code>up</code>
      <q-rolling-text :start-num="0" :target-num="432" direction="up" :duration="1.5" />
    </div>
    <div class="demo-label">
      <code>down</code>
      <q-rolling-text :start-num="0" :target-num="432" :duration="1.5" />
    </div>
  </div>

  <div v-else-if="demo === 'stop-order'" class="demo-row">
    <div class="demo-label">
      <code>ltr</code>
      <q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="ltr" />
    </div>
    <div class="demo-label">
      <code>rtl</code>
      <q-rolling-text :start-num="0" :target-num="54321" :height="44" stop-order="rtl" />
    </div>
  </div>

  <div v-else-if="demo === 'text'" class="demo-row">
    <q-rolling-text :text-list="textList" :duration="1" :height="36" />
  </div>

  <div v-else-if="demo === 'style'" class="demo-row">
    <q-rolling-text
      class="demo-rolling--custom"
      :start-num="12345"
      :target-num="54321"
      :height="54"
      :duration="1.5"
    />
  </div>

  <div v-else-if="demo === 'control'" class="demo-col">
    <q-rolling-text
      ref="controlRef"
      :start-num="0"
      :target-num="54321"
      :auto-start="false"
    />
    <div class="demo-row demo-row--btns">
      <q-btn flat no-caps icon="play" label="Start" @click="controlRef?.start()" />
      <q-btn flat no-caps icon="replay" label="Reset" @click="controlRef?.reset()" />
    </div>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  gap: 42px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 0;
}
.demo-row--btns {
  gap: 10px;
}
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.demo-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  /* page-specific layout wrapper: neutralise the global `.demo-label` tag style */
  font-size: inherit;
  font-weight: 400;
  text-transform: none;
  letter-spacing: normal;
  color: inherit;
}
.demo-label code {
  font-size: 12px;
  color: #8b93a1;
}

/* — custom style: primary badge — */
.demo-rolling--custom {
  --q-rolling-text-background: var(--primary);
  --q-rolling-text-color: #fff;
  --q-rolling-text-font-size: 24px;
  --q-rolling-text-item-width: 42px;
  --q-rolling-text-gap: 5px;
  --q-rolling-text-item-border-radius: 8px;
  padding: 8px 14px;
  border-radius: 12px;
  background: rgb(25 118 210 / 0.08);
}
</style>
