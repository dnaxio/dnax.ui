---
title: Button Dropdown
description: A QBtn with a caret that drops down a menu of items, on any side of the trigger.
navigation:
  icon: lucide:chevron-down
seo:
  title: Button Dropdown (QBtnDropdown)
  description: QBtnDropdown — a QBtn with a caret that drops down a menu of items.
---

A **`<q-btn>`** that drops down a menu of `items`. Each item can carry a `leftIcon`
and a `rightIcon`, plus a `description`, a `color`, a `separator` or a `disable`d
state. Selecting an item emits `select` with its `value` (or the item itself when no
`value` is set). The popup can open on any side of the trigger (`position`) with a
custom gap (`offset`).

## User menu — label trigger

A typical user menu: the trigger shows the account label and a caret, the actions
use a `leftIcon` and the destructive one is separated and tinted with
`color="negative"`.

::prose-show-case
<dnax-demo-btn-dropdown demo="menu"></dnax-demo-btn-dropdown>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastMenu = ref("—")

const menuItems = [
  { label: "Profile", value: "profile", leftIcon: "lucide:user" },
  { label: "Account settings", value: "account", leftIcon: "lucide:user-cog" },
  { label: "Notifications", value: "notifications", leftIcon: "lucide:bell" },
  { separator: true },
  { label: "Sign out", value: "logout", leftIcon: "lucide:log-out", color: "negative" },
]

const onMenuSelect = (value) => (lastMenu.value = String(value))
</script>

<template>
  <div class="demo-row">
    <q-btn-dropdown
      label="Jane Cooper"
      outline
      no-caps
      :items="menuItems"
      @select="onMenuSelect"
    />
  </div>
</template>
```
::

## Single choice — dynamic right check

Reuse the same items with a *dynamic* `rightIcon`: a `lucide:check` marks the
current choice. Static right icons (here `command` for the shortcut) work the same
way.

::prose-show-case
<dnax-demo-btn-dropdown demo="view"></dnax-demo-btn-dropdown>

#code

```vue
<script setup lang="ts">
import { computed, ref } from "vue"

const view = ref("grid")
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
}
</script>

<template>
  <div class="demo-row">
    <q-btn-dropdown label="View" flat no-caps :items="viewItems" @select="onViewSelect" />
  </div>
</template>
```
::

## Sticky actions column in a table

The real-world pattern: one `⋯` dropdown per row inside a scrollable table. The menu
is teleported in `<body>` (`position: fixed`), so it stays visible above the rows
and the sticky cell — even while the table scrolls.

::prose-show-case
<dnax-demo-btn-dropdown demo="row"></dnax-demo-btn-dropdown>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastRow = ref("—")

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

const onRowSelect = (value) => (lastRow.value = String(value))
</script>

<template>
  <div class="table-scroll">
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
  <p class="demo-meta">Selected: <code>{{ lastRow }}</code></p>
</template>
```
::

## Popup placement & offset

`position` places the popup around the trigger: below / above (`-start` aligns the
left edge, `-end` the right edge) or on a side (`right`, `left` — vertically
centered; `right-start`… align top, `-end` bottom). Without a suffix the popup is
centered on the cross axis. The default is `bottom-end`; `align="left"` is kept as
an alias for `bottom-start`. `offset` sets the gap between the panel and the trigger
(default 4 px).

::prose-show-case
<dnax-demo-btn-dropdown demo="placement"></dnax-demo-btn-dropdown>

#code

```vue
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
  <q-btn-dropdown label="Full-width trigger" stretch outline no-caps :items="posItems" position="bottom-start" />
</div>
```
::

On a **full-width** trigger (`stretch` or a fixed width), the caret is pushed to the
far right edge of the button instead of sitting next to the label — no matter how
wide the trigger is.

`stretch` makes the trigger fill its container: the root element widens to `100%`,
so the inner `<q-btn>` really stretches. Nothing else is needed — no
`class="w-full"` on the component.

## Panel width — `fit`

The panel is **at least as wide as its trigger** — Quasar's `QMenu.fit` behaviour,
on by **default** (`fit: true`). A full-width trigger therefore gets a full-width
panel, aligned with the button edges:

::prose-show-case
<dnax-demo-btn-dropdown demo="fit"></dnax-demo-btn-dropdown>

#code

```vue
<div class="fit-col">
  <q-btn-dropdown label="fit (default)" stretch outline no-caps :items="posItems" position="bottom-start" />
  <q-btn-dropdown label="fit = false" :fit="false" stretch outline no-caps :items="posItems" position="bottom-start" />
</div>
```
::

`fit` is a **floor, not an exact width**: the panel is sized
`max(menu-width, trigger width)`. `menu-width` (default `220px`) stays the minimum
for small triggers, and a long item label can still widen the panel. Pass
`:fit="false"` to fall back to `menu-width` alone.

## Panel classes & styles

The panel is teleported to `<body>`, so `content-class` and `content-style` are the
escape hatch to restyle it. Both are applied **after** the computed style (placement,
`min-width`), so they override it — the way to force an exact width, a background or
a radius:

::prose-show-case
<dnax-demo-btn-dropdown demo="content"></dnax-demo-btn-dropdown>

#code

```vue
<!-- min-width forcée : le panneau s'aligne plus large que menu-width -->
<q-btn-dropdown flat round dense :items="posItems" content-style="min-width: 300px" />

<!-- apparence du panneau (rayon, ombre) sur l'élément téléporté -->
<q-btn-dropdown
  label="Rounded panel"
  outline
  no-caps
  :items="posItems"
  content-style="border-radius: 16px; box-shadow: 0 16px 40px rgb(0 0 0 / 0.2)"
/>
```
::

`content-class` does the same with a class name. Use it from a **global**
stylesheet: the panel is rendered by the shared panel engine, outside the scope of
the component that declares the dropdown, so its scoped styles do not apply.

## API

<dnax-api name="QBtnDropdown"></dnax-api>
