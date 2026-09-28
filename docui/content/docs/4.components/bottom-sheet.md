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

Three surfaces are available — `translucent` (frosted glass, opacity from
`--q-translucent-opacity`), **`glass`** (a stronger glassmorphism: very translucent
background, strong blur, light border — the same recipe as `q-header` / `q-footer`), and
the plain panel. `glass` wins if both are set, and both are tunable in CSS
(`--q-glass-bg`, `--q-glass-blur`, `--q-translucent-bg`, `--q-translucent-blur`):

```vue
<q-bottom-sheet glass … />

<!-- flou plus discret, fond à peine teinté : les variables vont au **panneau** téléporté,
     donc par `content-style` (le `style` du composant ne pointerait que le déclencheur) -->
<q-bottom-sheet
  glass
  :content-style="{ '--q-glass-blur': '12px', '--q-glass-bg': 'rgb(255 255 255 / 0.08)' }"
  …
/>
```

### Breakpoints

Instead of one height, the panel can rest at **several heights** — the sheet-modal
pattern: pass the fractions of the viewport it may snap to, and drag the handle (or press
`Enter` / `Space` on it) to move from one to the next.

::prose-show-case
<dnax-demo-bottom-sheet demo="breakpoints"></dnax-demo-bottom-sheet>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref(false)
const breakpoint = ref(0.25) // le point d'ancrage courant (v-model:breakpoint)
</script>

<template>
  <q-bottom-sheet v-model="open" v-model:breakpoint="breakpoint" :breakpoints="[0.25, 0.5, 0.75]">
    <template #trigger>
      <q-btn color="primary" icon="lucide:map" label="Open sheet" />
    </template>

    <q-bottom-sheet-header title="Places nearby" :description="`Breakpoint: ${breakpoint}`" />
    <div class="sheet-body">
      <!-- la liste reste défilable à 25 %, 50 % et 75 % -->
    </div>
  </q-bottom-sheet>
</template>
```
::

- **`breakpoints`** — the fractions of the viewport the panel can snap to. They are
  sorted and de-duplicated; `0` is accepted and means *closed*. A string works too
  (`breakpoints="0.25,0.5"`).
- **`breakpoint`** — `v-model:breakpoint`: it is the anchor the sheet opens at, then it
  follows the drags (a value that is not in the list snaps to the nearest one).
- **`height`** is ignored while `breakpoints` is set: the height *is* the anchor.
- The content stays **scrollable at every breakpoint** — the handle drives the height,
  the scroll never moves the panel (this is Ionic's `expandToScroll: false`; there is no
  switch because it is the only behaviour here).
- Released below the lowest anchor by more than `drag-threshold`, the sheet closes —
  dragging it to `0` closes it, even when `0` is not listed (Ionic disables swipe-to-close
  in that case).
- Methods, for keyboard shortcuts or external controls:

```ts
const sheet = ref()
sheet.value.setBreakpoint(0.75) // ramène au point d'ancrage le plus proche
sheet.value.stepBreakpoint(-1) // un cran plus bas
sheet.value.breakpoint // 0.5
```

### Seamless (no backdrop)

`seamless` renders the panel **without any backdrop**: the page behind is neither dimmed
nor blocked — the sheet floats over it and the content underneath keeps receiving clicks.
The click outside therefore no longer closes it; **Échap**, the browser back gesture and
`v-model` still do. It is the non-modal sheet: a search bar, a mini-player, a form panel
over a map.

::prose-show-case
<dnax-demo-bottom-sheet demo="seamless"></dnax-demo-bottom-sheet>

#code

```vue
<q-bottom-sheet v-model="open" seamless rounded="0" width="100%">
  <template #trigger>
    <q-btn color="primary" icon="lucide:panels-bottom" label="Open seamless sheet" />
  </template>

  <q-bottom-sheet-header title="Quick search" description="No backdrop: the page stays clickable" />
  <div class="sheet-body">
    <q-input v-model="query" dense outlined placeholder="Search…" />
  </div>
  <q-bottom-sheet-footer>
    <q-btn flat label="Close" @click="open = false" />
  </q-bottom-sheet-footer>
</q-bottom-sheet>
```
::

**The shadow is softened in that mode.** Without a dimmed backdrop, the default
`0 -4px 24px` would draw a dark band under the sheet: `seamless` switches it to
`0 -2px 12px rgb(0 0 0 / 0.08)`. It is a prop — `true` (default), `false` (no shadow at
all) or a CSS value — and the variable `--q-bs-shadow` can be overridden from a stylesheet:

```vue
<q-bottom-sheet seamless shadow="0 -1px 6px rgb(0 0 0 / 0.05)" … />
<q-bottom-sheet seamless :shadow="false" … />            <!-- aucun trait de séparation -->
```

Combined with `breakpoints`, the panel becomes a resizable floating sheet while the page
stays live.

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
