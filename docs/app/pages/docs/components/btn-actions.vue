<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Button Actions</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A dropdown button driven by an <code>actions</code> array — the trigger is a
      <b>&lt;q-btn&gt;</b> and the menu is generated from each item's
      <code>label</code>, <code>icon</code>, <code>color</code> and
      <code>description</code>. Clicking an item emits
      <code>select-action</code> with its <code>value</code> (or the item itself
      when no <code>value</code> is set).
    </p>

    <!-- ═══════ Icône seule (menu de ligne) ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Icon trigger — row actions</h2>
      <p class="doc-note">
        The classic table pattern: a <code>flat round dense</code> « ⋯ » button.
        The menu is right-aligned by default so it never overflows the row edge.
      </p>

      <docs-demo :code="rowCode" lang="html" filename="App.vue" :script="rowScript">
        <div class="demo-col">
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
      </docs-demo>
    </section>

    <!-- ═══════ Label + caret ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Label + caret (QBtnDropdown style)</h2>
      <p class="doc-note">
        With a <code>label</code>, the trigger shows a chevron that rotates while
        the menu is open. Every QBtn modifier (<code>outline</code>,
        <code>flat</code>, <code>color</code>…) applies; use <code>no-caret</code>
        to hide the arrow.
      </p>

      <docs-demo :code="menuCode" lang="html" filename="App.vue" :script="menuScript">
        <div class="demo-col">
          <q-btn-actions label="Actions" outline no-caps :actions="menuActions" @select-action="onMenuAction" />
          <p class="demo-meta">Selected: <code>{{ lastMenu }}</code></p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Descriptions & alignement gauche ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Descriptions, colors & disabled items</h2>
      <p class="doc-note">
        Each action accepts a <code>color</code> token (e.g.
        <code>positive</code> / <code>negative</code>), a <code>description</code>
        subtitle, a <code>separator</code> divider above it, and can be
        <code>disable</code>d. <code>menu-width</code>,
        <code>align="left"</code> (alias of <code>position="bottom-start"</code>),
        <code>position</code> and <code>offset</code> tune the panel.
      </p>

      <docs-demo :code="manageCode" lang="html" filename="App.vue" :script="manageScript">
        <div class="demo-col">
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
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBtnActions</h2>
      <docs-api :comp="qBtnActions" :source="qBtnActionsSource" />
    </section>
  </div>
</template>

<script setup lang="ts">
// Button Actions — QBtnActions : bouton-dropdown piloté par un tableau d'actions.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const qBtnActions = useComponent(() => "QBtnActions")
const qBtnActionsSource = componentSource("QBtnActions")
const tag = componentTag("QBtnActions")

// ─── Démo 1 : icône seule (menu de ligne) ───
const lastRow = ref("—")

const rowActions = [
  { label: "Edit", value: "edit", icon: "lucide:pencil" },
  { label: "Suspend", value: "suspend", icon: "lucide:pause" },
  { label: "Reset password", value: "reset-password", icon: "lucide:key-round" },
  { separator: true },
  { label: "Delete", value: "delete", icon: "lucide:trash-2", color: "negative" },
]

const onRowAction = (value: unknown) => (lastRow.value = String(value))

const rowCode = `<q-btn-actions
  flat
  round
  dense
  :actions="rowActions"
  @select-action="onRowAction"
/>`

const rowScript = `const lastRow = ref("—")

const rowActions = [
  { label: "Edit", value: "edit", icon: "lucide:pencil" },
  { label: "Suspend", value: "suspend", icon: "lucide:pause" },
  { label: "Reset password", value: "reset-password", icon: "lucide:key-round" },
  { separator: true },
  { label: "Delete", value: "delete", icon: "lucide:trash-2", color: "negative" },
]

const onRowAction = (value) => (lastRow.value = String(value))`

// ─── Démo 2 : label + caret (style QBtnDropdown) ───
const lastMenu = ref("—")

const menuActions = [
  { label: "Copy link", value: "copy-link", icon: "lucide:link" },
  { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
  { separator: true },
  { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
]

const onMenuAction = (value: unknown) => (lastMenu.value = String(value))

const menuCode = `<q-btn-actions
  label="Actions"
  outline
  no-caps
  :actions="menuActions"
  @select-action="onMenuAction"
/>`

const menuScript = `const lastMenu = ref("—")

const menuActions = [
  { label: "Copy link", value: "copy-link", icon: "lucide:link" },
  { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
  { separator: true },
  { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
]

const onMenuAction = (value) => (lastMenu.value = String(value))`

// ─── Démo 3 : descriptions, alignement & menu-large ───
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

const manageCode = `<q-btn-actions
  label="Manage"
  flat
  dense
  no-caps
  align="left"
  menu-width="240px"
  :actions="manageActions"
  @select-action="onManageAction"
/>`

const manageScript = `const lastManage = ref("—")

const manageActions = [
  { label: "Activate", description: "Bring the user back online",
    value: "activate", icon: "lucide:power", color: "positive" },
  { label: "Reset password", description: "Send a reset link",
    value: "reset-password", icon: "lucide:key-round" },
  { separator: true },
  { label: "Suspend", value: "suspend", icon: "lucide:pause" },
  { label: "Delete", description: "Irreversible", value: "delete",
    icon: "lucide:trash-2", color: "negative", disable: true },
]

const onManageAction = (value) => (lastManage.value = String(value))`
</script>

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
  max-width: 700px;
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

.demo-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.demo-meta {
  margin: 0;
  font-size: 13px;
  color: #5b6472;
}

/* Fausse rangée de table (démo 1) */
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
.row-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(25, 118, 210, 0.12);
  color: var(--primary);
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
</style>
