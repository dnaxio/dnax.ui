# Bottom Sheet

> Open a bottom-anchored panel imperatively from code with $q.bottomSheet, with height, rounded, translucent and transition options.

`$q.bottomSheet` opens a bottom-anchored panel (built-in safe-area) — same
principle as `$q.dialog`, rendered by the automatically mounted
`QBottomSheetProvider`. Drag down, backdrop, `Esc` and browser back all dismiss it.

## Setup

Get `$q` with the `usePlugin()` composable, or install the `QPlugin` for a global
`this.$q` access.

```ts
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

// Legacy: app.use(QPlugin) → this.$q anywhere
import { QPlugin } from "@dnax/ui"
```

The providers are rendered automatically by the outermost `<q-config-provider>`:

```html
<q-config-provider>
  <!-- rend automatiquement QDialogProvider, QNotifyProvider, QLoadingProvider,
       QBottomSheetProvider et QImagePreviewProvider -->
  <NuxtPage />
</q-config-provider>
```

## Usage

Pass an SFC (or a global component name) in `component`. Two patterns, like
`$q.dialog`: **without** `title` / `description` the component **is** the sheet — it
renders a `<q-bottom-sheet v-model="open">` root driven by
`useBottomSheetPluginComponent()` (`open` is already `true`, no `v-model` to set);
**with** them, the provider wraps the panel + header and your component provides the
body, resolving `@ok / @cancel / @dismiss`.

```ts
const $q = usePlugin()

$q.bottomSheet.open({
  component: ShareSheet,          // SFC importé OU nom de composant global
  componentProps: { file: "report.pdf" },
  title: "Share",
  height: "60%",                  // hauteur du panneau (sinon max-height 90vh)
  rounded: "24px",                // coins hauts arrondis
  translucent: true,              // fond frosté (ou :translucent="70")
  transition: "zoom",             // slide-up (défaut) | fade | zoom
  dragThreshold: 60,              // seuil de drag pour fermer (défaut 80)
})
  .onOK((data) => console.log("choice:", data))
  .onCancel(() => console.log("cancelled"))
```

Sheet component (auto pattern — root required):

```html
<script setup lang="ts">
// Le composant DOIT commencer par <q-bottom-sheet> (pattern Quasar) :
// open est fourni par useBottomSheetPluginComponent() (déjà true).
import { useBottomSheetPluginComponent } from "@dnax/ui/runtime"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useBottomSheetPluginComponent()
</script>

<template>
  <q-bottom-sheet v-model="open" @hide="onDialogHide">
    <q-bottom-sheet-header title="Confirm" description="This cannot be undone." />
    <div class="body">…</div>
    <q-bottom-sheet-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-bottom-sheet-footer>
  </q-bottom-sheet>
</template>
```

## Options

Everything is tunable: `height` (fixed panel height), `width`, `rounded` (`true` /
CSS value), `dark`, `translucent` (frosted glass, true = 70% or a percentage),
`persistent` (no backdrop / Esc close), `dragThreshold` (px before drag dismisses)
and `transition` — `slide-up` (default), `fade` or `zoom` (+ optional
`transitionDuration` in ms). The same options exist on the declarative
`<q-bottom-sheet>`.

```html
<q-bottom-sheet v-model="open" height="70%" transition="fade" drag-threshold="60">
  <template #trigger>
    <q-btn color="primary" label="Open" />
  </template>
  <q-bottom-sheet-header title="Settings" description="Same options as the plugin" />
  <div class="body">…</div>
  <q-bottom-sheet-footer>
    <q-btn flat label="Close" @click="open = false" />
  </q-bottom-sheet-footer>
</q-bottom-sheet>
```

## Live example

A real content component (`DemoShareSheet`) pushed through
`$q.bottomSheet.open()` with `height="62%"`, `rounded="24px"`, `translucent` and
`transition="zoom"` — try a target (OK), Cancel, and the backdrop / drag-down.

<prose-show-case>
<dnax-demo-bottom-sheet-plugin demo="live">



</dnax-demo-bottom-sheet-plugin>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { usePlugin } from "@dnax/ui/runtime"
import ShareSheet from "./ShareSheet.vue"

const $q = usePlugin()

const open = () =>
  $q.bottomSheet
    .open({
      component: ShareSheet,
      componentProps: { file: "quarterly-report.pdf" },
      title: "Share file",
      description: "Choose where to send it",
      height: "62%",
      rounded: "24px",
      translucent: true,
      transition: "zoom",
    })
    .onOK((data) => console.log("ok", data))
    .onCancel(() => console.log("cancel"))
    .onDismiss(() => console.log("dismiss"))
</script>

<template>
  <q-btn unelevated no-caps color="primary" icon="lucide:share-2" label="Share file…" @click="open" />
</template>
```

</template>
</prose-show-case>
