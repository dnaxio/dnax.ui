<script setup lang="ts">
// Live demos for the Tab Panels page (state kept per page).
// One component per page — the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "animations" | "lazy" | "rich"
}>()

// — basic —
const tab = ref("one")

// — animations —
const tabAnim = ref("a")
const animation = ref<"fade" | "slide-right" | "slide-left" | "slide-up" | "slide-down">("fade")
const animationOptions = [
  { label: "Fade", value: "fade" },
  { label: "Slide right", value: "slide-right" },
  { label: "Slide left", value: "slide-left" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide down", value: "slide-down" },
]

// — lazy —
const tabLazy = ref("a")

// — rich —
const tabRich = ref("one")
</script>

<template>
  <div v-if="demo === 'basic'">
    <q-tabs
      v-model="tab"
      align="left"
      no-caps
      active-color="primary"
      indicator-color="primary"
      class="demo-panels-tabs"
    >
      <q-tab name="one" label="One" />
      <q-tab name="two" label="Two" />
      <q-tab name="three" label="Three" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="demo-panels">
      <q-tab-panel name="one">
        <p class="demo-p">Panel “One” — fades in when selected.</p>
      </q-tab-panel>
      <q-tab-panel name="two">
        <p class="demo-p">Panel “Two” — shares the v-model with the tabs.</p>
      </q-tab-panel>
      <q-tab-panel name="three">
        <p class="demo-p">Panel “Three” — visibility is driven by v-show.</p>
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <div v-else-if="demo === 'animations'">
    <q-select
      v-model="animation"
      :options="animationOptions"
      emit-value
      outlined
      dense
      label="Animation"
      class="demo-panels-select"
    />

    <q-tabs
      v-model="tabAnim"
      align="left"
      no-caps
      dense
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="a" label="A" />
      <q-tab name="b" label="B" />
      <q-tab name="c" label="C" />
    </q-tabs>

    <q-tab-panels v-model="tabAnim" animated :animation="animation" swipeable class="demo-panels">
      <q-tab-panel name="a">
        <p class="demo-p">Panel A</p>
      </q-tab-panel>
      <q-tab-panel name="b">
        <p class="demo-p">Panel B</p>
      </q-tab-panel>
      <q-tab-panel name="c">
        <p class="demo-p">Panel C</p>
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <div v-else-if="demo === 'lazy'">
    <q-tabs
      v-model="tabLazy"
      align="left"
      no-caps
      active-color="primary"
      indicator-color="primary"
      class="demo-panels-tabs"
    >
      <q-tab name="a" label="Light" />
      <q-tab name="b" label="Heavy" />
    </q-tabs>
    <q-tab-panels v-model="tabLazy" animated class="demo-panels">
      <q-tab-panel name="a">
        <p class="demo-p">Light panel — always mounted.</p>
      </q-tab-panel>
      <q-tab-panel name="b" lazy-render>
        <p class="demo-p">Heavy panel — its content only mounts after the first visit.</p>
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <div v-else-if="demo === 'rich'">
    <q-tabs
      v-model="tabRich"
      align="left"
      no-caps
      active-color="primary"
      indicator-color="primary"
      class="demo-panels-tabs"
    >
      <q-tab name="one" label="List" />
      <q-tab name="two" label="Form" />
    </q-tabs>
    <q-tab-panels v-model="tabRich" animated class="demo-panels">
      <q-tab-panel name="one">
        <q-list bordered>
          <q-item><q-item-section>Row A</q-item-section></q-item>
          <q-item><q-item-section>Row B</q-item-section></q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="two">
        <q-input label="Name" outlined />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style scoped>
.demo-panels-tabs {
  margin-bottom: 12px;
}

.demo-panels-select {
  max-width: 240px;
  margin-bottom: 12px;
}

.demo-panels :deep(.q-tab-panel) {
  padding: 16px;
  background: #fafbfc;
  border: 1px solid rgb(0 0 0 / 0.08);
}
</style>
