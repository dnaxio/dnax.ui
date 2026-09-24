<script setup lang="ts">
// Live demos for the Config Provider page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "shell" | "theme"
}>()

// — theme —
const mode = ref<"light" | "dark">("light")
const radiusDemo = ref<"none" | "sm" | "md" | "lg">("md")
const primaryColor = ref("#1976d2")
const modes: ("light" | "dark")[] = ["light", "dark"]
const colorOptions = ["#1976d2", "#e91e63", "#10b981", "#f59e0b", "#8b5cf6", "#0f172a"]
const RADII: { label: string; value: "none" | "sm" | "md" | "lg" }[] = [
  { label: "none", value: "none" },
  { label: "sm", value: "sm" },
  { label: "md", value: "md" },
  { label: "lg", value: "lg" },
]
</script>

<template>
  <div v-if="demo === 'shell'" class="demo-stage demo-stage--shell">
    <q-config-provider>
      <q-app>
        <q-back-header fixed title="Page title" class="demo-shell-bar">
          <q-btn flat round dense icon="lucide:more-vertical" aria-label="More" />
        </q-back-header>
        <q-header fixed class="demo-shell-bar">
          <q-toolbar>
            <q-icon name="lucide:menu" size="22px" />
            <q-space />
            <q-btn flat round dense icon="lucide:search" aria-label="Search" />
          </q-toolbar>
        </q-header>

        <q-page class="demo-shell-page">
          <q-container>
            <p class="demo-p demo-shell-note">
              The page is automatically offset below the two fixed bars — this
              text is never hidden behind the header.
            </p>
          </q-container>
        </q-page>
      </q-app>
    </q-config-provider>
  </div>

  <div v-else-if="demo === 'theme'">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          v-for="m in modes"
          :key="m"
          flat
          no-caps
          :color="mode === m ? 'primary' : ''"
          :label="m"
          @click="mode = m"
        />
      </q-btn-group>
      <q-select
        v-model="radiusDemo"
        :options="RADII"
        option-label="label"
        option-value="value"
        emit-value
        label="radius"
        outlined
        dense
        class="demo-radius"
      />
      <q-select
        v-model="primaryColor"
        :options="colorOptions"
        label="colors.primary"
        outlined
        dense
        class="demo-radius"
      />
    </div>
    <q-config-provider
      :theme="{
        mode,
        colors: { primary: primaryColor },
        componentProps: { default: { radius: radiusDemo } },
      }"
    >
      <div class="demo-stage demo-stage--theme">
        <q-btn unelevated no-caps color="primary" label="Button" />
        <q-input label="Field" outlined dense placeholder="Type here…" />
        <q-chip icon="lucide:zap" label="Chip" color="secondary" outline removable />
      </div>
    </q-config-provider>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}

.demo-radius {
  width: 160px;
}

/* — shell preview stage — */
.demo-stage {
  border: 1px dashed rgb(0 0 0 / 0.14);
  border-radius: 12px;
  overflow: hidden;
  min-height: 120px;
}
.demo-stage--shell {
  background: #fff;
}
.demo-stage--theme {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--muted);
}
.demo-shell-page {
  padding: 18px;
}
.demo-shell-note {
  color: #5b6472;
}
</style>
