---
title: Bottom Sheet
description: A panel that slides up from the bottom edge — the mobile pattern for
  contextual actions and quick settings.
navigation:
  icon: lucide:panel-bottom
seo:
  title: Bottom Sheet (QBottomSheet)
  description: QBottomSheet — a bottom sheet family (panel, header, footer, trigger
    and provider).
---

A bottom sheet slides a panel up from the bottom edge — the mobile pattern for
contextual actions and quick settings. The family comprises five components:
**`<q-bottom-sheet>`** (the panel, with drag-to-dismiss),
**`<q-bottom-sheet-header>`**, **`<q-bottom-sheet-footer>`**,
**`<q-bottom-sheet-trigger>`** and **`<q-bottom-sheet-provider>`** (for the
programmatic `$q.bottomSheet` stack).

## QBottomSheet — the panel

::prose-show-case
<dnax-demo-bottom-sheet demo="basic"></dnax-demo-bottom-sheet>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref(false)
</script>

<template>
  <q-bottom-sheet v-model="open">
    <template #trigger>
      <q-btn color="primary" icon="lucide:settings" label="Open settings" />
    </template>
    <q-bottom-sheet-header title="Settings" description="Tune your notifications and preferences" />
    <div class="demo-sheet-body">
      <p class="demo-p">
        Drag the handle down, tap the backdrop, or press Escape to close. The panel is
        anchored to the bottom edge and respects the iOS safe area.
      </p>
    </div>
    <q-bottom-sheet-footer>
      <q-btn flat label="Cancel" @click="open = false" />
      <q-btn color="primary" label="Save" @click="open = false" />
    </q-bottom-sheet-footer>
  </q-bottom-sheet>
</template>
```
::

### Sizing & look

::prose-show-case
<dnax-demo-bottom-sheet demo="variants"></dnax-demo-bottom-sheet>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const openTall = ref(false)
</script>

<template>
  <q-bottom-sheet v-model="open" height="70%" rounded="24px" translucent>
    <template #trigger>
      <q-btn outline label="Tall translucent sheet" />
    </template>
    <q-bottom-sheet-header title="Quick actions" description="height, rounded and translucent" />
    <div class="demo-sheet-body">
      <p class="demo-p">
        <code>height</code> fixes the panel height, <code>rounded</code> accepts a CSS
        value, and <code>translucent</code> enables a frosted-glass background.
      </p>
    </div>
  </q-bottom-sheet>
</template>
```
::

The opener is declared through the `#trigger` slot (rendered next to the sheet),
and `v-model` keeps the open state in sync. Use `persistent` to disable backdrop /
Escape dismissal, and `drag-threshold` to tune how far the handle must be dragged
to close.

### API

<dnax-api name="QBottomSheet"></dnax-api>

## QBottomSheetHeader — title & close

Sticky bar rendered like the app `q-header` (embedded `q-toolbar`) with a `title`,
an optional `description` and a close button that closes the sheet. Custom content
can be passed through the `#title` and `#description` slots, and `no-padding`
flushes the content to the edges.

```vue
<q-bottom-sheet-header title="Settings" description="Tune your preferences" />

<!-- or with custom slots -->
<q-bottom-sheet-header>
  <template #title>
    <q-icon name="lucide:sparkles" color="primary" />
    <span>Custom title</span>
  </template>
  <template #description>Custom description</template>
</q-bottom-sheet-header>
```

### API

<dnax-api name="QBottomSheetHeader"></dnax-api>

## QBottomSheetFooter — actions

Sticky bar rendered like the app `q-footer` (embedded `q-toolbar`) hosting the
action buttons below the scrollable body, aligned **right**. `no-padding` flushes
the actions to the edges.

```vue
<q-bottom-sheet-footer>
  <q-btn flat label="Cancel" @click="open = false" />
  <q-btn color="primary" label="Save" @click="open = false" />
</q-bottom-sheet-footer>
```

### API

<dnax-api name="QBottomSheetFooter"></dnax-api>

## QBottomSheetTrigger — declarative opener

A button that opens its parent sheet — the component alternative to the
`#trigger` slot. Place it in the `#trigger` slot (as below) or anywhere inside an
open sheet, e.g. to open a nested one.

::prose-show-case
<dnax-demo-bottom-sheet demo="trigger"></dnax-demo-bottom-sheet>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref(false)
</script>

<template>
  <q-bottom-sheet v-model="open">
    <template #trigger>
      <q-bottom-sheet-trigger label="Open sheet" />
    </template>
    <q-bottom-sheet-header title="Bottom sheet" description="Component alternative to the #trigger slot" />
    <div class="demo-sheet-body">
      <p class="demo-p">
        QBottomSheetTrigger is the component alternative to the <code>#trigger</code>
        slot — same behavior, rendered as a standalone button.
      </p>
    </div>
  </q-bottom-sheet>
</template>
```
::

### API

<dnax-api name="QBottomSheetTrigger"></dnax-api>

## QBottomSheetProvider — programmatic sheets

Renders the stack of programmatic sheets pushed with `$q.bottomSheet.open()`. It
is mounted automatically by the outermost `<q-config-provider>` — no extra setup
needed. Each entry is rendered inside a `<q-bottom-sheet>`; when the content
component emits `ok`, `cancel`, `dismiss` or `close`, the matching resolver is
called and the entry is removed.

```ts
import { $q } from "@dnax/ui"

const sheet = $q.bottomSheet.open({
  component: ProfileContent,
  title: "Profile",
  description: "Your public information",
  height: "70%",
  rounded: "24px",
  translucent: true,
})

sheet.onOK((data) => console.log("ok", data))
sheet.onCancel(() => console.log("cancelled"))
```

### API

<dnax-api name="QBottomSheetProvider"></dnax-api>
