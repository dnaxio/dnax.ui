<script setup lang="ts">
// Button Dropdown — QBtnDropdown : QBtn + caret dont le menu liste des items
// porteurs d'une icône gauche (leftIcon) et/ou droite (rightIcon).
import { computed, ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const qBtnDropdown = useComponent(() => "QBtnDropdown")
const qBtnDropdownSource = componentSource("QBtnDropdown")
const tag = componentTag("QBtnDropdown")

// ─── Démo 1 : menu d'actions utilisateur (icônes gauches + séparateur) ───
const lastMenu = ref("—")

const menuItems = [
  { label: "Profile", value: "profile", leftIcon: "lucide:user" },
  { label: "Account settings", value: "account", leftIcon: "lucide:user-cog" },
  { label: "Notifications", value: "notifications", leftIcon: "lucide:bell" },
  { separator: true },
  { label: "Sign out", value: "logout", leftIcon: "lucide:log-out", color: "negative" },
]

const onMenuSelect = (value: unknown) => (lastMenu.value = String(value))

const menuCode = `<q-btn-dropdown
  label="Jane Cooper"
  outline
  no-caps
  :items="menuItems"
  @select="onMenuSelect"
/>`

const menuScript = `const lastMenu = ref("—")

const menuItems = [
  { label: "Profile", value: "profile", leftIcon: "lucide:user" },
  { label: "Account settings", value: "account", leftIcon: "lucide:user-cog" },
  { label: "Notifications", value: "notifications", leftIcon: "lucide:bell" },
  { separator: true },
  { label: "Sign out", value: "logout", leftIcon: "lucide:log-out", color: "negative" },
]

const onMenuSelect = (value) => (lastMenu.value = String(value))`

// ─── Démo 2 : sélection à coche (rightIcon dynamique = check) ───
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

const viewCode = `<q-btn-dropdown
  label="View"
  flat
  no-caps
  :items="viewItems"
  @select="onViewSelect"
/>`

const viewScript = `const view = ref("grid")
const lastView = ref("grid")

const viewItems = computed(() => [
  { label: "Grid view", value: "grid", leftIcon: "lucide:columns-3",
    rightIcon: view.value === "grid" ? "lucide:check" : undefined },
  { label: "List view", value: "list", leftIcon: "lucide:rows-3",
    rightIcon: view.value === "list" ? "lucide:check" : undefined },
  { separator: true },
  { label: "Keyboard shortcuts", value: "shortcuts", leftIcon: "lucide:keyboard",
    rightIcon: "lucide:command" },
])

const onViewSelect = (value) => {
  const v = String(value)
  if (v === "grid" || v === "list") view.value = v
  lastView.value = v
}`

// ─── Démo 3 : colonne d'actions sticky dans une table scrollable ───
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

// ─── Démo 4 : placement du popup (position + offset) ───
const posItems = [
  { label: "Rename", value: "rename", leftIcon: "lucide:pencil" },
  { label: "Duplicate", value: "duplicate", leftIcon: "lucide:copy" },
  { separator: true },
  { label: "Delete", value: "delete", leftIcon: "lucide:trash-2", color: "negative" },
]

const placementCode = `<div class="pos-grid">
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

<q-btn-dropdown label="Full-width trigger" stretch outline no-caps :items="posItems" position="bottom-start" class="pos-stretch" />`

const rowCode = `<div class="table-scroll">
  <table class="mini-table">
    <thead>
      <tr><th>User</th><th>Role</th><th class="cell-actions"></th></tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.email">
        <td>
          <span class="avatar">{{ row.initials }}</span>
          <b>{{ row.name }}</b>
          <small>{{ row.email }}</small>
        </td>
        <td>{{ row.role }}</td>
        <td class="cell-actions">
          <q-btn-dropdown
            flat
            round
            dense
            :items="rowItems"
            @select="onRowSelect"
          />
        </td>
      </tr>
    </tbody>
  </table>
</div>
<p class="demo-meta">Selected: <code>{{ lastRow }}</code></p>`

const rowScript = `const lastRow = ref("—")

const rowItems = [
  { label: "Edit", value: "edit", leftIcon: "lucide:pencil" },
  { label: "Suspend", value: "suspend", leftIcon: "lucide:pause" },
  { label: "Reset password", description: "Sends a reset link",
    value: "reset-password", leftIcon: "lucide:key-round" },
  { separator: true },
  { label: "Delete", description: "Irreversible", value: "delete",
    leftIcon: "lucide:trash-2", color: "negative" },
]

const rows = [
  { initials: "JC", name: "Jane Cooper", email: "jane@acme.io", role: "Admin" },
  { initials: "RV", name: "Rayan Verger", email: "rayan@acme.io", role: "Editor" },
  { initials: "FB", name: "Fatima B.", email: "fatima@acme.io", role: "Viewer" },
  { initials: "OK", name: "Omar K.", email: "omar@acme.io", role: "Admin" },
]

const onRowSelect = (value) => (lastRow.value = String(value))`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Button Dropdown</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A <b>&lt;q-btn&gt;</b> that drops down a menu of <code>items</code>. Each
      item can carry a <code>leftIcon</code> and a <code>rightIcon</code>, plus a
      <code>description</code>, a <code>color</code>, a <code>separator</code> or
      a <code>disable</code>d state. Selecting an item emits
      <code>select</code> with its <code>value</code> (or the item itself when no
      <code>value</code> is set). The popup can open on any side of the trigger
      (<code>position</code>) with a custom gap (<code>offset</code>).
    </p>

    <!-- ═══════ Menu utilisateur (label + icônes gauches) ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">User menu — label trigger</h2>
      <p class="doc-note">
        A typical user menu: the trigger shows the account label and a caret, the
        actions use a <code>leftIcon</code> and the destructive one is separated
        and tinted with <code>color="negative"</code>.
      </p>

      <docs-demo :code="menuCode" lang="html" filename="App.vue" :script="menuScript">
        <div class="demo-row">
          <q-btn-dropdown label="Jane Cooper" outline no-caps :items="menuItems" @select="onMenuSelect" />
        </div>
        <p class="demo-meta">Selected: <code>{{ lastMenu }}</code></p>
      </docs-demo>
    </section>

    <!-- ═══════ Sélection à coche (rightIcon dynamique) ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Single choice — dynamic right check</h2>
      <p class="doc-note">
        Reuse the same items with a <em>dynamic</em> <code>rightIcon</code>: a
        <code>lucide:check</code> marks the current choice. Static right icons
        (here <code>command</code> for the shortcut) work the same way.
      </p>

      <docs-demo :code="viewCode" lang="html" filename="App.vue" :script="viewScript">
        <div class="demo-row">
          <q-btn-dropdown label="View" flat no-caps :items="viewItems" @select="onViewSelect" />
        </div>
        <p class="demo-meta">Selected: <code>{{ lastView }}</code></p>
      </docs-demo>
    </section>

    <!-- ═══════ Table + colonne d'actions sticky ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sticky actions column in a table</h2>
      <p class="doc-note">
        The real-world pattern: one <code>⋯</code> dropdown per row inside a
        scrollable table. The menu is teleported in <code>&lt;body&gt;</code>
        (<code>position: fixed</code>), so it stays visible above the rows and
        the sticky cell — even while the table scrolls.
      </p>

      <docs-demo :code="rowCode" lang="html" filename="App.vue" :script="rowScript">
        <div class="demo-col">
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
      </docs-demo>
    </section>

    <!-- ═══════ Popup placement & offset ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Popup placement &amp; offset</h2>
      <p class="doc-note">
        <code>position</code> places the popup around the trigger: below / above
        (<code>-start</code> aligns the left edge, <code>-end</code> the right
        edge) or on a side (<code>right</code>, <code>left</code> — vertically
        centered; <code>right-start</code>… align top, <code>-end</code> bottom).
        Without a suffix the popup is centered on the cross axis. The default is
        <code>bottom-end</code>; <code>align="left"</code> is kept as an alias
        for <code>bottom-start</code>. <code>offset</code> sets the gap between
        the panel and the trigger (default 4&nbsp;px).
      </p>

      <docs-demo :code="placementCode" lang="html" filename="App.vue">
        <div class="demo-col-pos">
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
          <q-btn-dropdown
            label="Full-width trigger"
            stretch
            outline
            no-caps
            :items="posItems"
            position="bottom-start"
            class="pos-stretch"
          />
        </div>
      </docs-demo>
      <p class="doc-note">
        On a <b>full-width</b> trigger (<code>stretch</code> or a fixed width),
        the caret is pushed to the far right edge of the button instead of
        sitting next to the label — no matter how wide the trigger is.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBtnDropdown</h2>
      <docs-api :comp="qBtnDropdown" :source="qBtnDropdownSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 720px;
}
.doc-note code,
.doc-lead code,
.demo-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.demo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0;
}
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}
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
/* Déclencheur pleine largeur : le caret est collé au bord droit */
.pos-stretch {
  width: 100%;
  max-width: 420px;
}
.demo-meta {
  margin: 8px 0 0;
  font-size: 13px;
  color: #5b6472;
}

/* Mini-table scrollable avec colonne d'actions sticky (démo 3) */
.table-scroll {
  width: 100%;
  max-height: 220px;
  overflow: auto;
  border: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 10px;
  background: #fff;
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
/* Colonne d'actions collée à droite, au-dessus des autres cellules */
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
  background: rgba(25, 118, 210, 0.12);
  color: var(--primary);
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
</style>
