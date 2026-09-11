<script setup lang="ts">
// Live demos for the Button Dropdown page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { computed, ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "menu" | "view" | "row" | "placement" | "fit" | "content"
}>()

// — user menu (left icons + separator) —
const lastMenu = ref("—")

const menuItems = [
  { label: "Profile", value: "profile", leftIcon: "lucide:user" },
  { label: "Account settings", value: "account", leftIcon: "lucide:user-cog" },
  { label: "Notifications", value: "notifications", leftIcon: "lucide:bell" },
  { separator: true },
  { label: "Sign out", value: "logout", leftIcon: "lucide:log-out", color: "negative" },
]

const onMenuSelect = (value: unknown) => (lastMenu.value = String(value))

// — single choice (dynamic right check) —
const view = ref("grid")
const lastView = ref("grid")

const viewItems = computed(() => [
  {
    label: "Grid view",
    value: "grid",
    leftIcon: "lucide:columns-3",
    rightIcon: view.value === "grid" ? "lucide:check" : undefined,
  },
  {
    label: "List view",
    value: "list",
    leftIcon: "lucide:rows-3",
    rightIcon: view.value === "list" ? "lucide:check" : undefined,
  },
  { separator: true },
  {
    label: "Keyboard shortcuts",
    value: "shortcuts",
    leftIcon: "lucide:keyboard",
    rightIcon: "lucide:command",
  },
])

const onViewSelect = (value: unknown) => {
  const v = String(value)
  if (v === "grid" || v === "list") view.value = v
  lastView.value = v
}

// — sticky actions column in a scrollable table —
const lastRow = ref("—")

const rowItems = [
  { label: "Edit", value: "edit", leftIcon: "lucide:pencil" },
  { label: "Suspend", value: "suspend", leftIcon: "lucide:pause" },
  {
    label: "Reset password",
    description: "Sends a reset link",
    value: "reset-password",
    leftIcon: "lucide:key-round",
  },
  { separator: true },
  {
    label: "Delete",
    description: "Irreversible",
    value: "delete",
    leftIcon: "lucide:trash-2",
    color: "negative",
  },
]

const rows = [
  { initials: "JC", name: "Jane Cooper", email: "jane@acme.io", role: "Admin" },
  { initials: "RV", name: "Rayan Verger", email: "rayan@acme.io", role: "Editor" },
  { initials: "FB", name: "Fatima B.", email: "fatima@acme.io", role: "Viewer" },
  { initials: "OK", name: "Omar K.", email: "omar@acme.io", role: "Admin" },
]

const onRowSelect = (value: unknown) => (lastRow.value = String(value))

// — popup placement (position + offset) —
const posItems = [
  { label: "Rename", value: "rename", leftIcon: "lucide:pencil" },
  { label: "Duplicate", value: "duplicate", leftIcon: "lucide:copy" },
  { separator: true },
  { label: "Delete", value: "delete", leftIcon: "lucide:trash-2", color: "negative" },
]
</script>

<template>
  <div v-if="demo === 'menu'" class="demo-col">
    <div class="demo-row">
      <q-btn-dropdown
        label="Jane Cooper"
        outline
        no-caps
        :items="menuItems"
        @select="onMenuSelect"
      />
    </div>
    <p class="demo-meta">Selected: <code>{{ lastMenu }}</code></p>
  </div>

  <div v-else-if="demo === 'view'" class="demo-col">
    <div class="demo-row">
      <q-btn-dropdown label="View" flat no-caps :items="viewItems" @select="onViewSelect" />
    </div>
    <p class="demo-meta">Selected: <code>{{ lastView }}</code></p>
  </div>

  <div v-else-if="demo === 'row'" class="demo-col">
    <div class="table-scroll">
      <table class="mini-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th class="cell-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.email">
            <td>
              <span class="user-cell">
                <span class="avatar">{{ row.initials }}</span>
                <span class="user-cell__text">
                  <b>{{ row.name }}</b>
                  <small>{{ row.email }}</small>
                </span>
              </span>
            </td>
            <td>{{ row.role }}</td>
            <td class="cell-actions">
              <q-btn-dropdown flat round dense :items="rowItems" @select="onRowSelect" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="demo-meta">Selected: <code>{{ lastRow }}</code></p>
  </div>

  <div v-else-if="demo === 'placement'" class="demo-col-pos">
    <div class="pos-grid">
      <q-btn-dropdown label="bottom-start" outline no-caps :items="posItems" position="bottom-start" />
      <q-btn-dropdown label="bottom-end" outline no-caps :items="posItems" position="bottom-end" />
      <q-btn-dropdown label="top-start" outline no-caps :items="posItems" position="top-start" />
      <q-btn-dropdown label="top-end" outline no-caps :items="posItems" position="top-end" />
      <q-btn-dropdown label="right" outline no-caps :items="posItems" position="right" />
      <q-btn-dropdown label="left" outline no-caps :items="posItems" position="left" />
    </div>
    <div class="pos-row">
      <q-btn-dropdown label="offset 4 (default)" outline no-caps :items="posItems" position="bottom-start" />
      <q-btn-dropdown label="offset 16" outline no-caps :items="posItems" position="bottom-start" :offset="16" />
    </div>
    <div class="pos-full">
      <q-btn-dropdown
        label="Full-width trigger"
        stretch
        outline
        no-caps
        :items="posItems"
        position="bottom-start"
      />
    </div>
  </div>

  <div v-else-if="demo === 'fit'" class="demo-col-pos">
    <div class="fit-col">
      <q-btn-dropdown
        label="fit (default)"
        stretch
        outline
        no-caps
        :items="posItems"
        position="bottom-start"
      />
      <q-btn-dropdown
        label="fit = false"
        :fit="false"
        stretch
        outline
        no-caps
        :items="posItems"
        position="bottom-start"
      />
    </div>
  </div>

  <div v-else-if="demo === 'content'" class="demo-col-pos">
    <div class="content-row">
      <q-btn-dropdown flat round dense :items="posItems" content-style="min-width: 300px" />
      <q-btn-dropdown
        label="Rounded panel"
        outline
        no-caps
        :items="posItems"
        content-style="border-radius: 16px; box-shadow: 0 16px 40px rgb(0 0 0 / 0.2)"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-row {
  justify-content: center;
}
.demo-col {
  margin: 0 auto;
}

/* Popup placement demo */
.demo-col-pos {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  padding: 14px 0;
}
.pos-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}
.pos-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
/* Full-width trigger: the container sets the width, `stretch` makes the trigger
   fill it (root becomes 100%, so the inner QBtn can stretch too) — no `w-full`. */
.pos-full {
  width: 100%;
  max-width: 420px;
}

/* `fit` demo: two triggers wider than the panel's `menu-width` (220px) */
.fit-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 420px;
}

/* `content-class` / `content-style` demo */
.content-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

/* Scrollable mini-table with a sticky actions column (demo 3) */
.table-scroll {
  width: 100%;
  max-height: 220px;
  overflow: auto;
  border: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 10px;
  background: #fff;
}
html.dark .table-scroll {
  background: rgb(255 255 255 / 0.04);
  border-color: rgb(255 255 255 / 0.1);
}
.mini-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13.5px;
}
.mini-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 8px 14px;
  background: #f6f7f9;
  color: #5b6472;
  font-size: 11px;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.mini-table td {
  padding: 10px 14px;
  border-top: 1px solid rgb(0 0 0 / 0.06);
  white-space: nowrap;
}
/* Actions column stuck to the right, above the other cells */
.mini-table th.cell-actions,
.mini-table td.cell-actions {
  position: sticky;
  right: 0;
  z-index: 1;
  text-align: right;
  background: #fff;
  box-shadow: -1px 0 0 rgb(0 0 0 / 0.06);
}
.mini-table th.cell-actions {
  background: #f6f7f9;
}

.user-cell {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgb(25 118 210 / 0.12);
  color: var(--primary, #1976d2);
  font-size: 12px;
  font-weight: 700;
}
.user-cell__text {
  display: flex;
  flex-direction: column;
}
.user-cell__text b {
  font-size: 13.5px;
}
.user-cell__text small {
  color: #5b6472;
  font-size: 11.5px;
}
html.dark .user-cell__text small {
  color: #9aa4b2;
}
</style>
