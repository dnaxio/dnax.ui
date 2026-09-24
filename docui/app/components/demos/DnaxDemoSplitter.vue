<script setup lang="ts">
// Live demos for the Splitter page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Identifier of the demo to render */
  demo: "basic" | "horizontal" | "px" | "custom"
}>()

const split = ref(30)
const splitH = ref(60)
const sidePx = ref(180)
const splitCustom = ref(40)

const files = ["App.vue", "main.ts", "useAuth.ts", "README.md", "package.json"]
</script>

<template>
  <div v-if="demo === 'basic'">
    <q-splitter v-model="split" style="height: 260px">
      <template #before>
        <div class="demo-panel demo-panel--code">
          <p class="demo-panel__title">Files</p>
          <div v-for="f in files" :key="f" class="demo-file">{{ f }}</div>
        </div>
      </template>
      <template #after>
        <div class="demo-panel demo-panel--preview">
          <p class="demo-panel__title">Preview</p>
          <p class="demo-p">Drag the handle — or focus it and use the arrow keys.</p>
        </div>
      </template>
    </q-splitter>
    <p class="demo-p demo-meta">Left panel: {{ Math.round(split) }}%</p>
  </div>

  <q-splitter
    v-else-if="demo === 'horizontal'"
    v-model="splitH"
    horizontal
    style="height: 240px"
  >
    <template #before>
      <div class="demo-panel demo-panel--header">
        <p class="demo-panel__title">Toolbar</p>
        <p class="demo-p">Top panel — drag the separator up/down.</p>
      </div>
    </template>
    <template #after>
      <div class="demo-panel demo-panel--body">
        <p class="demo-panel__title">Content</p>
        <p class="demo-p">Shift + arrows step by 10% instead of 1%.</p>
      </div>
    </template>
  </q-splitter>

  <q-splitter
    v-else-if="demo === 'px'"
    v-model="sidePx"
    unit="px"
    :limits="[120, 320]"
    style="height: 220px"
  >
    <template #before>
      <div class="demo-panel demo-panel--sidebar">Sidebar ({{ Math.round(sidePx) }}px)</div>
    </template>
    <template #after>
      <div class="demo-panel demo-panel--body">
        <p class="demo-panel__title">Main content</p>
        <p class="demo-p">Clamped between 120 px and 320 px.</p>
      </div>
    </template>
  </q-splitter>

  <q-splitter
    v-else-if="demo === 'custom'"
    v-model="splitCustom"
    style="height: 220px"
    separator-style="background: transparent"
  >
    <template #before>
      <div class="demo-panel demo-panel--a">A</div>
    </template>
    <template #after>
      <div class="demo-panel demo-panel--b">B</div>
    </template>
    <template #separator>
      <span class="demo-knob">
        <span class="demo-knob__dot" />
        <span class="demo-knob__dot" />
        <span class="demo-knob__dot" />
      </span>
    </template>
  </q-splitter>
</template>

<style scoped>
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}

/* — demo panels — */
.demo-panel {
  height: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  overflow: hidden;
}
.demo-panel__title {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
}
.demo-panel--code {
  background: #0d1117;
  color: #e6edf3;
}
.demo-panel--code .demo-panel__title {
  color: #8b949e;
}
.demo-file {
  padding: 5px 8px;
  margin-bottom: 2px;
  border-radius: 6px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 13px;
  color: #e6edf3;
}
.demo-file:nth-child(odd) {
  background: rgb(255 255 255 / 0.05);
}
.demo-panel--preview {
  background: #fafbfc;
}
.demo-panel--header {
  background: #f3f4f6;
  border-bottom: 1px solid rgb(0 0 0 / 0.08);
}
.demo-panel--body {
  background: #fff;
}
.demo-panel--sidebar {
  background: #f3f4f6;
  border-right: 1px solid rgb(0 0 0 / 0.08);
  font-size: 14px;
  color: var(--foreground);
}
.demo-panel--a {
  background: rgb(25 118 210 / 0.12);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}
.demo-panel--b {
  background: rgb(0 150 136 / 0.12);
  color: #00796b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

/* — custom handle — */
.demo-knob {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 6px 4px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgb(0 0 0 / 0.15);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.12);
}
.demo-knob__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.4);
}
</style>
