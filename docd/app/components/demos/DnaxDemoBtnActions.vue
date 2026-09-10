<script setup lang="ts">
// Live demos for the Button Actions page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "row" | "menu" | "manage"
}>()

// — row actions (icon-only trigger) —
const lastRow = ref("—")

const rowActions = [
  { label: "Edit", value: "edit", icon: "lucide:pencil" },
  { label: "Suspend", value: "suspend", icon: "lucide:pause" },
  { label: "Reset password", value: "reset-password", icon: "lucide:key-round" },
  { separator: true },
  { label: "Delete", value: "delete", icon: "lucide:trash-2", color: "negative" },
]

const onRowAction = (value: unknown) => (lastRow.value = String(value))

// — label + caret trigger —
const lastMenu = ref("—")

const menuActions = [
  { label: "Copy link", value: "copy-link", icon: "lucide:link" },
  { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
  { separator: true },
  { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
]

const onMenuAction = (value: unknown) => (lastMenu.value = String(value))

// — descriptions, alignment & menu-width —
const lastManage = ref("—")

const manageActions = [
  {
    label: "Activate",
    description: "Bring the user back online",
    value: "activate",
    icon: "lucide:power",
    color: "positive",
  },
  {
    label: "Reset password",
    description: "Send a reset link",
    value: "reset-password",
    icon: "lucide:key-round",
  },
  { separator: true },
  { label: "Suspend", value: "suspend", icon: "lucide:pause" },
  {
    label: "Delete",
    description: "Irreversible",
    value: "delete",
    icon: "lucide:trash-2",
    color: "negative",
    disable: true,
  },
]

const onManageAction = (value: unknown) => (lastManage.value = String(value))
</script>

<template>
  <div v-if="demo === 'row'" class="demo-col">
    <div class="row-card">
      <span class="row-card__avatar">JC</span>
      <span class="row-card__who">
        <b>Jane Cooper</b>
        <small>jane@acme.io</small>
      </span>
      <q-btn-actions flat round dense :actions="rowActions" @select-action="onRowAction" />
    </div>
    <p class="demo-meta">Selected: <code>{{ lastRow }}</code></p>
  </div>

  <div v-else-if="demo === 'menu'" class="demo-col">
    <q-btn-actions
      label="Actions"
      outline
      no-caps
      :actions="menuActions"
      @select-action="onMenuAction"
    />
    <p class="demo-meta">Selected: <code>{{ lastMenu }}</code></p>
  </div>

  <div v-else-if="demo === 'manage'" class="demo-col">
    <q-btn-actions
      label="Manage"
      flat
      dense
      no-caps
      align="left"
      menu-width="240px"
      :actions="manageActions"
      @select-action="onManageAction"
    />
    <p class="demo-meta">Selected: <code>{{ lastManage }}</code></p>
  </div>
</template>

<style scoped>
.demo-col {
  max-width: 560px;
  margin: 0 auto;
}

.demo-meta {
  margin: 0;
}

/* Fake table row (demo 1) */
.row-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  background: #fff;
}
html.dark .row-card {
  background: rgb(255 255 255 / 0.04);
  border-color: rgb(255 255 255 / 0.1);
}
.row-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgb(25 118 210 / 0.12);
  color: var(--primary, #1976d2);
  font-size: 13px;
  font-weight: 700;
}
.row-card__who {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  font-size: 14px;
}
.row-card__who small {
  color: #5b6472;
  font-size: 12px;
}
html.dark .row-card__who small {
  color: #9aa4b2;
}
</style>
