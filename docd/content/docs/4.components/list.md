---
title: List
description: The list family — a container, rows (clickable, dense, disabled)
  and sections (avatar, thumbnail, side).
navigation:
  icon: lucide:list
seo:
  title: List (QList)
  description: QList, QItem and QItemSection — the list family with the Quasar API.
---

The list family: **`<q-list>`** is the container (padding, borders, separators,
dark), **`<q-item>`** is a row — clickable, active, dense, disabled — and
**`<q-item-section>`** splits it into zones: `avatar` / `thumbnail` on the left, the
main flexible section, and a `side` zone on the right.

## QList — container

`bordered`, `separator` (lines between rows), `dense`, `padding` and `dark`.

::prose-show-case
:dnax-demo-list{demo="container"}

#code

```vue
<q-list bordered separator>
  <q-item><q-item-section>Bordered + separator</q-item-section></q-item>
  <q-item><q-item-section>Second row</q-item-section></q-item>
</q-list>

<q-list dark>
  <q-item><q-item-section>Dark theme</q-item-section></q-item>
</q-list>
```
::

## QItem — basic rows

The classic contact-row layout: avatar, main section (title + caption), side
chevron.

::prose-show-case
:dnax-demo-list{demo="basic"}

#code

```vue
<script setup lang="ts">
const contacts = [
  { name: "Alex Martin", initials: "AM", caption: "Online now", color: "positive" },
  { name: "Samira Chen", initials: "SC", caption: "Last seen 2h ago", color: "secondary" },
  { name: "Jules Dubois", initials: "JD", caption: "Offline", color: "negative" },
]
</script>

<template>
  <q-list bordered separator class="list">
    <q-item v-for="c in contacts" :key="c.name">
      <q-item-section avatar>
        <q-avatar :color="c.color" text-color="white">{{ c.initials }}</q-avatar>
      </q-item-section>
      <q-item-section>
        <div class="title">{{ c.name }}</div>
        <div class="caption">{{ c.caption }}</div>
      </q-item-section>
      <q-item-section side>
        <q-icon name="lucide:chevron-right" color="grey" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
```
::

## Clickable & active

`clickable` adds hover + cursor; `active` (or `active-class`) highlights the
selected row — try clicking.

::prose-show-case
:dnax-demo-list{demo="clickable"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const activeMenu = ref("inbox")
const menu = [
  { key: "inbox", label: "Inbox", icon: "lucide:inbox", count: "12" },
  { key: "sent", label: "Sent", icon: "lucide:send", count: "3" },
  { key: "drafts", label: "Drafts", icon: "lucide:file-pen", count: "1" },
]
</script>

<template>
  <q-list bordered class="list">
    <q-item
      v-for="m in menu"
      :key="m.key"
      clickable
      :active="activeMenu === m.key"
      @click="activeMenu = m.key"
    >
      <q-item-section avatar>
        <q-icon :name="m.icon" color="primary" />
      </q-item-section>
      <q-item-section>{{ m.label }}</q-item-section>
      <q-item-section side>
        <q-badge :label="m.count" color="primary" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
```
::

## QItemSection — thumbnail

`thumbnail` reserves a fixed image zone on the left.

::prose-show-case
:dnax-demo-list{demo="thumbnail"}

#code

```vue
<script setup lang="ts">
const thumbnail = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop"
</script>

<template>
  <q-list bordered class="list">
    <q-item>
      <q-item-section thumbnail>
        <q-img :src="thumbnail" ratio="1" class="thumb" />
      </q-item-section>
      <q-item-section>
        <div class="title">Moraine Lake</div>
        <div class="caption">Banff National Park, Canada</div>
      </q-item-section>
      <q-item-section side>
        <q-icon name="lucide:chevron-right" color="grey" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
```
::

## Alignment

`top` aligns the section to the top; `side top` pins the action icon to the
top-right of a multi-line row.

::prose-show-case
:dnax-demo-list{demo="alignment"}

#code

```vue
<q-list bordered class="list">
  <q-item>
    <q-item-section avatar>
      <q-icon name="lucide:bell" color="warning" size="22px" />
    </q-item-section>
    <q-item-section top>
      <div class="title">New update available</div>
      <div class="caption">v2.4.0 · 2 minutes ago · a longer description that wraps onto several lines to demonstrate the top alignment.</div>
    </q-item-section>
    <q-item-section side top>
      <q-icon name="lucide:x" />
    </q-item-section>
  </q-item>
</q-list>
```
::

## Dense, disabled & inset

`dense` shrinks rows, `disable` greys them out, `inset-level` indents by multiples
of 8px.

::prose-show-case
:dnax-demo-list{demo="states"}

#code

```vue
<q-list bordered dense class="list">
  <q-item :inset-level="1">
    <q-item-section>Indented item</q-item-section>
  </q-item>
  <q-item dense>
    <q-item-section>Dense item</q-item-section>
  </q-item>
  <q-item disable>
    <q-item-section>Disabled item</q-item-section>
  </q-item>
</q-list>
```
::

## QList

:dnax-api{name="QList"}

## QItem

:dnax-api{name="QItem"}

## QItemSection

:dnax-api{name="QItemSection"}
