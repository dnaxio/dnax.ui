<script setup lang="ts">
// Live demos for the v-ripple directive page (per-page state).
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "position" | "color" | "options"
}>()

// — options demo: enable / disable the directive at runtime —
const enabled = ref(true)
</script>

<template>
  <div v-if="demo === 'basic'" class="rip-col">
    <div class="rip-surface" v-ripple>Click anywhere on this surface</div>

    <div class="rip-list">
      <div class="rip-row" v-ripple>
        <q-icon name="lucide:folder" />
        <span>Documents</span>
      </div>
      <div class="rip-row" v-ripple>
        <q-icon name="lucide:image" />
        <span>Pictures</span>
      </div>
      <div class="rip-row" v-ripple>
        <q-icon name="lucide:music" />
        <span>Music</span>
      </div>
    </div>

    <q-btn no-caps color="primary" label="v-ripple on a QBtn" v-ripple />
  </div>

  <div v-else-if="demo === 'position'" class="rip-grid">
    <div class="rip-surface" v-ripple>From the click point</div>
    <div class="rip-surface rip-surface--dark" v-ripple.center>Always centered</div>
  </div>

  <div v-else-if="demo === 'color'" class="rip-grid">
    <div class="rip-surface" v-ripple:primary>v-ripple:primary</div>
    <div class="rip-surface" v-ripple:negative>v-ripple:negative</div>
    <div class="rip-surface" v-ripple="{ color: '#8b5cf6' }">color: '#8b5cf6'</div>
  </div>

  <div v-else-if="demo === 'options'" class="rip-col">
    <div class="rip-surface" v-ripple.early>Early — starts on pointerdown</div>
    <div class="rip-surface" :class="{ 'rip-surface--off': !enabled }" v-ripple="enabled">
      Runtime toggle — currently <b>{{ enabled ? "enabled" : "disabled" }}</b>
    </div>
    <q-btn
      no-caps
      :outline="enabled"
      :icon="enabled ? 'lucide:circle-slash' : 'lucide:circle-check'"
      :label="enabled ? 'Disable the directive' : 'Enable the directive'"
      @click="enabled = !enabled"
    />
  </div>
</template>

<style scoped>
.rip-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.rip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

/* Surfaces the ripple is applied to */
.rip-surface {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 84px;
  padding: 16px;
  border: 1px dashed var(--border, rgb(0 0 0 / 0.2));
  border-radius: var(--q-radius, 10px);
  background: rgb(148 163 184 / 0.08);
  color: var(--foreground, #1d1d1d);
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
.rip-surface--dark {
  border-style: solid;
  background: #1d1d1d;
  color: #fff;
}
.rip-surface--off {
  opacity: 0.5;
}

.rip-list {
  overflow: hidden;
  border: 1px solid var(--border, rgb(0 0 0 / 0.1));
  border-radius: var(--q-radius, 10px);
}
.rip-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}
.rip-row + .rip-row {
  border-top: 1px solid var(--border, rgb(0 0 0 / 0.08));
}
.rip-row :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--muted-foreground, #5b6472);
}
</style>
