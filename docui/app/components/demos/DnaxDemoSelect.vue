<script setup lang="ts">
// Live demos for the Select page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "customKeys" | "outlined" | "multiple" | "primitives" | "panel" | "offset" | "direction"
}>()

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
]

const countries = [
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "us", name: "United States" },
]

const frameworks = [
  { id: "vue", name: "Vue" },
  { id: "react", name: "React" },
  { id: "svelte", name: "Svelte" },
]

const color = ref<{ value: string; label: string } | null>(null)
const country = ref<string | null>(null)
const framework = ref<string | null>(null)
const size = ref<string | null>(null)
const level = ref<number | null>(null)
const multi = ref<string[]>([])

// — Modes inline / modal / sheet —
const modeDemo = ref<"inline" | "modal" | "sheet">("inline")
const panelVal = ref<string | null>(null)

// — Écart champ ↔ popup —
const offsetDefault = ref<string | null>(null)
const offsetWide = ref<string | null>(null)
const offsetZero = ref<string | null>(null)

// — Direction du popup —
const posDemo = ref<string>("auto")
const posVal = ref<string | null>(null)
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-field">
    <q-select
      v-model="color"
      :options="colors"
      label="Color"
      placeholder="Pick a color"
    />
  </div>

  <div v-else-if="demo === 'customKeys'" class="demo-field">
    <q-select
      v-model="country"
      :options="countries"
      option-label="name"
      option-value="id"
      label="Country"
      emit-value
    />
  </div>

  <div v-else-if="demo === 'outlined'" class="demo-field">
    <q-select
      v-model="framework"
      :options="frameworks"
      option-label="name"
      option-value="id"
      label="Framework"
      placeholder="Select…"
      outlined
      clearable
      dense
    />
  </div>

  <div v-else-if="demo === 'multiple'" class="demo-field">
    <q-select
      v-model="multi"
      :options="colors"
      label="Favorite colors"
      multiple
      use-chips
      emit-value
      clearable
    />
  </div>

  <div v-else-if="demo === 'primitives'" class="demo-field demo-col">
    <q-select v-model="size" :options="['S', 'M', 'L', 'XL']" label="Size" />
    <q-select v-model="level" :options="[1, 2, 3, 4, 5]" label="Level" />
    <p class="demo-p">size = <code>{{ size }}</code> · level = <code>{{ level }}</code></p>
  </div>

  <div v-else-if="demo === 'panel'" class="demo-select-panel">
    <div class="demo-row">
      <q-select
        v-model="modeDemo"
        :options="['inline', 'modal', 'sheet']"
        label="mode"
        outlined
        dense
        class="demo-mode-select"
      />
    </div>

    <q-select
      v-model="panelVal"
      :options="countries"
      option-label="name"
      option-value="id"
      label="Country"
      emit-value
      :mode="modeDemo"
      outlined
      clearable
      use-search
      :sheet-options="{ width: '100%', searchPlaceholder: 'Search countries…' }"
      :modal-options="{ height: '360px' }"
    />

    <p class="demo-p demo-p--value">
      Selected: <code>{{ panelVal ?? "—" }}</code>
    </p>
  </div>

  <div v-else-if="demo === 'offset'" class="demo-select-offset">
    <q-select v-model="offsetZero" :options="colors" label="offset 0" :offset="0" emit-value />
    <q-select v-model="offsetDefault" :options="colors" label="offset 8 (default)" emit-value />
    <q-select v-model="offsetWide" :options="colors" label="offset 16" :offset="16" emit-value />
  </div>

  <div v-else-if="demo === 'direction'" class="demo-select-panel">
    <div class="demo-row">
      <q-select
        v-model="posDemo"
        :options="['auto', 'bottom', 'top', 'bottom-start', 'bottom-end', 'top-start', 'top-end']"
        label="position"
        outlined
        dense
        class="demo-pos-select"
      />
    </div>

    <q-select
      v-model="posVal"
      :options="countries"
      option-label="name"
      option-value="id"
      label="Country"
      emit-value
      :position="posDemo"
      :inline-options="{ width: '240px' }"
      outlined
    />

    <p class="demo-p demo-p--value">
      Selected: <code>{{ posVal ?? "—" }}</code>
    </p>
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 520px;
}
.demo-field.demo-col {
  gap: 14px;
  align-items: stretch;
  max-width: 520px;
}

/* — Démo des modes : le popup inline est en `position: absolute`, il faut de la
   hauteur pour qu'il ne soit pas coupé par le bloc de démo — */
.demo-select-panel {
  width: 100%;
  max-width: 460px;
  min-height: 320px;
  margin: 0 auto;
  padding-top: 32px;
}
.demo-select-panel .demo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.demo-mode-select {
  width: 160px;
}
.demo-pos-select {
  width: 240px;
}
.demo-p--value {
  margin: 14px 0 0;
}

/* — Démo de l'écart (`offset`) : place pour les popups — */
.demo-select-offset {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 520px;
  min-height: 340px;
  margin: 0 auto;
  padding-top: 24px;
}
</style>
