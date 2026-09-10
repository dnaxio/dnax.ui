# Dialog

> Open a component-based modal dialog imperatively from code with $q.dialog, a chainable controller and OK / Cancel / Dismiss events.

`$q.dialog` pushes a component-based modal dialog — rendered by the automatically
mounted `QDialogProvider`.

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

Pass an SFC (or a global component name) in `component`, with optional
`componentProps`, `title` / `description`, `fullscreen`, `class` and
`persistent`. Returns a chainable controller with `onOK / onCancel / onDismiss`.

```ts
const $q = usePlugin()

$q.dialog.open({
  component: ConfirmDialog, // SFC importé OU nom de composant global
  componentProps: { title: "Delete?", message: "This action cannot be undone." },
  persistent: true,
})
  .onOK(() => console.log("confirmed"))
  .onCancel(() => console.log("cancelled"))
```

## The dialog component

**Quasar-style contract**: the component passed to `$q.dialog.open()` must render a
`<q-dialog>` as its **root**, driven by `useDialogPluginComponent()` — it provides
`open` (bind to `v-model`, already `true` so the dialog opens on mount), and
`onDialogHide` (bind to `@hide`) so backdrop / Esc / × close resolves `onDismiss`.
Call `onDialogOK(data)` or `onDialogCancel()` from your actions. Legacy components
that emit `ok / cancel / dismiss / close` still work.

```html
<script setup lang="ts">
// Le composant DOIT commencer par <q-dialog> (pattern Quasar) :
// il reçoit open (v-model) + les helpers via useDialogPluginComponent().
import { useDialogPluginComponent } from "@dnax/ui"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

<template>
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header title="Confirm deletion" description="This action cannot be undone." />
    <div class="body">…</div>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>
```

## Header · content · footer

The `QDialog` family provides a header, a body section and a footer:
`<q-dialog-header>` (title + description + close button, rendered as a
`q-toolbar` bar), `<q-dialog-content>` and `<q-dialog-footer>` (actions aligned
right). The panel is a flex column capped at `90vh` — add the `scrollable` prop on
`q-dialog-content` to let a long body scroll between fixed header and footer
(required in `maximized` mode, where the panel itself never scrolls).

```html
<script setup lang="ts">
import { useDialogPluginComponent } from "@dnax/ui/runtime"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

<template>
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header
      title="Terms of service"
      description="Scroll to read the full agreement"
    />
    <q-dialog-content scrollable>
      <!-- corps long : défile entre header et footer fixes -->
      <p>…</p>
    </q-dialog-content>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn unelevated no-caps color="primary" label="Accept" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>
```

## Live example

A real dialog component (`DemoConfirmDialog`) pushed through `$q.dialog.open()` —
try OK (async with loading), Cancel, and the backdrop / Esc. The second button opens
a `TermsDialog` with a scrollable body.

<prose-show-case>
<dnax-demo-dialog-plugin demo="live">



</dnax-demo-dialog-plugin>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { usePlugin } from "@dnax/ui/runtime"
import ConfirmDialog from "./ConfirmDialog.vue"

const $q = usePlugin()

const open = () =>
  $q.dialog
    .open({
      component: ConfirmDialog,
      componentProps: {
        title: "Delete account?",
        message: "This action is irreversible — all your data will be removed.",
      },
    })
    .onOK((data) => console.log("ok", data))
    .onCancel(() => console.log("cancel"))
    .onDismiss(() => console.log("dismiss"))
</script>

<template>
  <q-btn unelevated no-caps color="negative" icon="lucide:trash-2" label="Delete account…" @click="open" />
</template>
```

</template>
</prose-show-case>
