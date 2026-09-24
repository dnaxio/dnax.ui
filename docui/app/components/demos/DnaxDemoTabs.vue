<script setup lang="ts">
// Live demos for the Tabs page (state kept per page).
// One component per page — the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "align" | "icons" | "counts" | "switch" | "animated" | "collapse" | "colors" | "route"
}>()

// — basic / switch / animated / collapse / colors —
const tab = ref("one")

// — align —
const tabAlign = ref("home")
const alignDemo = ref<"left" | "center" | "right" | "justify">("center")
const stretchDemo = ref(false)

// — icons / counts —
const tabIcons = ref("inbox")
const tabCounts = ref("inbox")

// — transitions —
const transitionDemo = ref<"spring" | "smooth" | "elastic">("spring")
const durationDemo = ref(350)
const durations = [100, 200, 350, 500, 800]

// — colors —
const activeColorDemo = ref("primary")
const inactiveColorDemo = ref("secondary")
const colorOptions = [
  "primary",
  "secondary",
  "accent",
  "positive",
  "negative",
  "info",
  "warning",
  "dark",
]
</script>

<template>
  <div v-if="demo === 'basic'">
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary" switch-indicator-position>
      <q-tab name="one" label="One" />
      <q-tab name="two" label="Two" />
      <q-tab name="three" label="Three" />
    </q-tabs>
    <p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>
  </div>

  <div v-else-if="demo === 'align'">
    <div class="demo-row demo-row--align">
      <q-select
        v-model="alignDemo"
        :options="['left', 'center', 'right', 'justify']"
        label="align"
        outlined
        dense
        class="demo-align-select"
      />
      <q-checkbox v-model="stretchDemo" label="stretch" color="secondary" />
    </div>
    <q-tabs
      v-model="tabAlign"
      :align="alignDemo"
      :stretch="stretchDemo"
      no-caps
      dense
      active-color="secondary"
      indicator-color="secondary"
      class="demo-tabs-stretch"
    >
      <q-tab name="home" label="Home" />
      <q-tab name="profile" label="Profile" />
      <q-tab name="messages" label="Messages" />
    </q-tabs>
    <p class="demo-p demo-tabs-meta">
      align = {{ alignDemo }} · stretch = {{ stretchDemo ? "on" : "off" }}
    </p>
  </div>

  <div v-else-if="demo === 'icons'">
    <q-tabs v-model="tabIcons" inline-label no-caps active-color="primary" switch-indicator-position>
      <q-tab name="inbox" icon="lucide:inbox" label="Inbox" alert="negative" />
      <q-tab name="sent" icon="lucide:send" label="Sent" />
      <q-tab name="drafts" icon="lucide:file-text" label="Drafts" />
    </q-tabs>
  </div>

  <div v-else-if="demo === 'counts'">
    <q-tabs v-model="tabCounts" no-caps active-color="primary" switch-indicator-position>
      <q-tab name="inbox" icon="lucide:inbox" label="Inbox" :count="12" />
      <q-tab name="social" icon="lucide:users" label="Social" :count="5" count-color="info" />
      <q-tab name="spam" icon="lucide:shield-alert" label="Spam" :count="125" count-color="warning" />
      <q-tab name="sent" icon="lucide:send" label="Sent" />
    </q-tabs>
  </div>

  <div v-else-if="demo === 'switch'">
    <div class="demo-switch-row">
      <div class="demo-switch-col">
        <p class="demo-p demo-switch-label">no indicator</p>
        <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
          <q-tab name="one" label="One" />
          <q-tab name="two" label="Two" />
          <q-tab name="three" label="Three" />
        </q-tabs>
      </div>
      <div class="demo-switch-col">
        <p class="demo-p demo-switch-label">bottom (default)</p>
        <q-tabs v-model="tab" switch-indicator-position active-color="primary" indicator-color="primary">
          <q-tab name="one" label="One" />
          <q-tab name="two" label="Two" />
          <q-tab name="three" label="Three" />
        </q-tabs>
      </div>
      <div class="demo-switch-col">
        <p class="demo-p demo-switch-label">top</p>
        <q-tabs v-model="tab" switch-indicator-position="top" active-color="primary" indicator-color="primary">
          <q-tab name="one" label="One" />
          <q-tab name="two" label="Two" />
          <q-tab name="three" label="Three" />
        </q-tabs>
      </div>
    </div>
    <p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>
  </div>

  <div v-else-if="demo === 'animated'">
    <div class="demo-row demo-row--align">
      <q-select
        v-model="transitionDemo"
        :options="['spring', 'smooth', 'elastic']"
        label="transition"
        outlined
        dense
        class="demo-align-select"
      />
      <q-select
        v-model="durationDemo"
        :options="durations"
        label="duration (ms)"
        outlined
        dense
        class="demo-align-select"
      />
    </div>
    <q-tabs
      v-model="tab"
      animated
      :transition="transitionDemo"
      :transition-duration="durationDemo"
      active-color="primary"
      indicator-color="primary"
      switch-indicator-position
    >
      <q-tab name="one" label="One" />
      <q-tab name="two" label="Two" />
      <q-tab name="three" label="Three" />
    </q-tabs>
    <p class="demo-p demo-tabs-meta">
      transition = {{ transitionDemo }} · {{ durationDemo }}ms
    </p>
  </div>

  <div v-else-if="demo === 'collapse'">
    <div class="demo-row demo-row--align">
      <q-select
        v-model="transitionDemo"
        :options="['spring', 'smooth', 'elastic']"
        label="transition"
        outlined
        dense
        class="demo-align-select"
      />
    </div>
    <q-tabs
      v-model="tab"
      collapse-inactive
      animated
      :transition="transitionDemo"
      active-color="primary"
      indicator-color="primary"
      switch-indicator-position
    >
      <q-tab name="home" icon="lucide:home" label="Home" />
      <q-tab name="inbox" icon="lucide:inbox" label="Inbox" />
      <q-tab name="users" icon="lucide:users" label="Users" />
      <q-tab name="settings" icon="lucide:settings" label="Settings" />
    </q-tabs>
    <p class="demo-p demo-tabs-meta">
      Selected tab: {{ tab }} · transition = {{ transitionDemo }}
    </p>
  </div>

  <div v-else-if="demo === 'colors'">
    <div class="demo-row demo-row--align">
      <q-select
        v-model="activeColorDemo"
        :options="colorOptions"
        label="active-color"
        outlined
        dense
        class="demo-align-select"
      />
      <q-select
        v-model="inactiveColorDemo"
        :options="colorOptions"
        label="inactive-color"
        outlined
        dense
        class="demo-align-select"
      />
    </div>
    <q-tabs
      v-model="tab"
      :active-color="activeColorDemo"
      :inactive-color="inactiveColorDemo"
      switch-indicator-position
    >
      <q-tab name="one" label="One" />
      <q-tab name="two" label="Two" />
      <q-tab name="three" label="Three" />
    </q-tabs>
    <p class="demo-p demo-tabs-meta">
      active = {{ activeColorDemo }} · inactive = {{ inactiveColorDemo }}
    </p>
  </div>

  <div v-else-if="demo === 'route'">
    <q-tabs active-color="primary" indicator-color="primary" switch-indicator-position>
      <q-route-tab to="/docs" exact icon="lucide:book-open" label="Docs" />
      <q-route-tab to="/mockup" icon="lucide:smartphone" label="Mockup" />
    </q-tabs>
    <p class="demo-p demo-tabs-meta">
      Current route: <code>{{ $route.path }}</code> — the matching tab gets
      the active color without any v-model.
    </p>
  </div>
</template>

<style scoped>
.demo-tabs-meta {
  margin-top: 12px;
}

.demo-row--align {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.demo-align-select {
  width: 180px;
}

.demo-switch-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.demo-switch-col {
  flex: 1 1 260px;
  min-width: 0;
}

.demo-switch-label {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #8b93a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Parent flex → checks that `stretch` fills the width */
.demo-tabs-stretch {
  display: flex;
}
</style>
