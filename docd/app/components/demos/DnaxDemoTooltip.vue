<script setup lang="ts">
// Live demos for the Tooltip page (page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "anchors" | "side-align" | "delay" | "disable" | "controlled" | "types"
}>()

const enabled = ref(true)
const tipOpen = ref(false)
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-row">
    <q-btn label="Hover me" color="primary">
      <q-tooltip>Hello! I'm a tooltip.</q-tooltip>
    </q-btn>
    <span class="demo-target">
      Hover this text
      <q-tooltip>…and I appear here</q-tooltip>
    </span>
  </div>

  <div v-else-if="demo === 'anchors'" class="demo-grid">
    <q-btn label="Top (default)" color="secondary">
      <q-tooltip>Anchored on top</q-tooltip>
    </q-btn>
    <q-btn label="Bottom" color="secondary">
      <q-tooltip anchor="bottom middle">Anchored on bottom</q-tooltip>
    </q-btn>
    <q-btn label="Left" color="secondary">
      <q-tooltip anchor="left middle">Anchored on the left</q-tooltip>
    </q-btn>
    <q-btn label="Right + offset" color="secondary">
      <q-tooltip anchor="right middle" :offset="[16, 0]">Pushed 16px right</q-tooltip>
    </q-btn>
  </div>

  <div v-else-if="demo === 'side-align'" class="demo-grid">
    <q-btn label="Top · start" outline>
      <q-tooltip side="top" align="start" show-arrow>Top start</q-tooltip>
    </q-btn>
    <q-btn label="Bottom · center" outline>
      <q-tooltip side="bottom" align="center" show-arrow>Bottom center</q-tooltip>
    </q-btn>
    <q-btn label="Left · end" outline>
      <q-tooltip side="left" align="end" show-arrow>Left end</q-tooltip>
    </q-btn>
    <q-btn label="Right · center" outline>
      <q-tooltip side="right" align="center" show-arrow>Right center</q-tooltip>
    </q-btn>
  </div>

  <div v-else-if="demo === 'delay'" class="demo-row">
    <q-btn label="Hover and wait…" color="primary">
      <q-tooltip :delay="800">I appear after 800 ms (default: 300).</q-tooltip>
    </q-btn>
  </div>

  <div v-else-if="demo === 'disable'" class="demo-col">
    <q-checkbox v-model="enabled" label="Tooltips enabled" />
    <div class="demo-row">
      <q-btn label="First" outline>
        <q-tooltip :disable="!enabled">Enabled</q-tooltip>
      </q-btn>
      <q-btn label="Second" outline>
        <q-tooltip :disable="!enabled">Also enabled</q-tooltip>
      </q-btn>
    </div>
  </div>

  <div v-else-if="demo === 'controlled'" class="demo-col">
    <q-btn label="Toggle the tooltip" color="primary" @click="tipOpen = !tipOpen">
      <q-tooltip v-model="tipOpen">Controlled by v-model (hover also opens it).</q-tooltip>
    </q-btn>
    <p class="demo-p demo-meta">Open: {{ tipOpen }}</p>
  </div>

  <div v-else-if="demo === 'types'" class="demo-grid">
    <q-btn label="Positive" outline>
      <q-tooltip type="positive" show-arrow>All good!</q-tooltip>
    </q-btn>
    <q-btn label="Info" outline>
      <q-tooltip type="info" show-arrow icon="lucide:info">More details</q-tooltip>
    </q-btn>
    <q-btn label="Warning" outline>
      <q-tooltip type="warning" show-arrow icon="lucide:triangle-alert">Careful!</q-tooltip>
    </q-btn>
    <q-btn label="Error" outline>
      <q-tooltip type="error" show-arrow icon="lucide:circle-x">Something failed</q-tooltip>
    </q-btn>
    <q-btn label="Custom" outline>
      <q-tooltip color="#7c3aed" icon="lucide:sparkles" icon-position="right">Custom color, icon right</q-tooltip>
    </q-btn>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  width: 100%;
  max-width: 560px;
}
.demo-target {
  padding: 8px 14px;
  border: 1px dashed rgb(0 0 0 / 0.2);
  border-radius: 8px;
  font-size: 14px;
  color: var(--foreground);
}
.demo-meta {
  font-size: 13px;
  color: #8b93a1;
}
</style>
