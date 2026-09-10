# Button Actions

> A dropdown button driven by an actions array — generated trigger and menu items.

A dropdown button driven by an `actions` array — the trigger is a **<q-btn>** and
the menu is generated from each item's `label`, `icon`, `color` and `description`.
Clicking an item emits `select-action` with its `value` (or the item itself when no
`value` is set).

## Icon trigger — row actions

The classic table pattern: a `flat round dense` « ⋯ » button. The menu is
right-aligned by default so it never overflows the row edge.

<prose-show-case>
<dnax-demo-btn-actions demo="row">



</dnax-demo-btn-actions>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastRow = ref("—")

const rowActions = [
  { label: "Edit", value: "edit", icon: "lucide:pencil" },
  { label: "Suspend", value: "suspend", icon: "lucide:pause" },
  { label: "Reset password", value: "reset-password", icon: "lucide:key-round" },
  { separator: true },
  { label: "Delete", value: "delete", icon: "lucide:trash-2", color: "negative" },
]

const onRowAction = (value) => (lastRow.value = String(value))
</script>

<template>
  <q-btn-actions
    flat
    round
    dense
    :actions="rowActions"
    @select-action="onRowAction"
  />
</template>
```

</template>
</prose-show-case>

## Label + caret (QBtnDropdown style)

With a `label`, the trigger shows a chevron that rotates while the menu is open.
Every QBtn modifier (`outline`, `flat`, `color`…) applies; use `no-caret` to hide
the arrow.

<prose-show-case>
<dnax-demo-btn-actions demo="menu">



</dnax-demo-btn-actions>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastMenu = ref("—")

const menuActions = [
  { label: "Copy link", value: "copy-link", icon: "lucide:link" },
  { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
  { separator: true },
  { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
]

const onMenuAction = (value) => (lastMenu.value = String(value))
</script>

<template>
  <q-btn-actions
    label="Actions"
    outline
    no-caps
    :actions="menuActions"
    @select-action="onMenuAction"
  />
</template>
```

</template>
</prose-show-case>

## Descriptions, colors & disabled items

Each action accepts a `color` token (e.g. `positive` / `negative`), a `description`
subtitle, a `separator` divider above it, and can be `disable`d. `menu-width`,
`align="left"` (alias of `position="bottom-start"`), `position` and `offset` tune
the panel.

<prose-show-case>
<dnax-demo-btn-actions demo="manage">



</dnax-demo-btn-actions>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastManage = ref("—")

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

const onManageAction = (value) => (lastManage.value = String(value))
</script>

<template>
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
</template>
```

</template>
</prose-show-case>

## Stretch

`stretch` widens the trigger to `100%` of its container — the root element itself
grows, so the inner `<q-btn>` really stretches and the caret stays at the far right
edge. Useful for full-width form actions or stacked menus.

<prose-show-case>
<dnax-demo-btn-actions demo="stretch">



</dnax-demo-btn-actions>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastMenu = ref("—")

const menuActions = [
  { label: "Copy link", value: "copy-link", icon: "lucide:link" },
  { label: "Duplicate", value: "duplicate", icon: "lucide:copy" },
  { separator: true },
  { label: "Archive", value: "archive", icon: "lucide:archive", color: "warning" },
]

const onMenuAction = (value) => (lastMenu.value = String(value))
</script>

<template>
  <q-btn-actions
    label="Full width"
    stretch
    outline
    no-caps
    :actions="menuActions"
    @select-action="onMenuAction"
  />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QBtnActions">



</dnax-api>
