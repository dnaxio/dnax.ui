# Config Provider

> The app root — theme tokens (colors, mode, default component props) and the programmatic $q providers, mounted once for the whole subtree.

The application root: **<q-config-provider>** supplies the theme (colors, `mode`
light/dark/system, default component props) to the whole subtree through CSS
variables, and automatically mounts the programmatic providers (`$q.dialog`,
`$q.bottomSheet`, `$q.notify`, `$q.loading`, `$q.imagePreview`). It is the first
component of every app — see the initialization best practice below.

## Best practice — app initialization

Wrap the whole app in a single `<q-config-provider>`: it applies the theme to every
component and mounts the providers exactly once (nested providers do not re-mount
them). The canonical shell is:

<prose-show-case>
<dnax-demo-config-provider demo="shell">



</dnax-demo-config-provider>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <q-config-provider :theme="{ mode: 'system', colors: { primary: '#1976d2' } }">
    <q-app>
      <q-back-header fixed title="Page title" @back="router.back()" />
      <q-header fixed>
        <q-toolbar>
          <q-icon name="lucide:menu" size="22px" />
          <q-space />
          <q-btn flat round dense icon="lucide:search" aria-label="Search" />
        </q-toolbar>
      </q-header>

      <q-page>
        <q-container>
          <!-- le contenu de la page — jamais masqué par les barres fixed -->
        </q-container>
      </q-page>

      <q-footer>
        <q-toolbar>
          <q-icon name="lucide:box" size="20px" />
          <span>Dnax UI</span>
        </q-toolbar>
      </q-footer>
    </q-app>
  </q-config-provider>
</template>
```

</template>
</prose-show-case>

The order of the bars matters:

- `<q-back-header fixed>` then `<q-header fixed>` → the back bar settles above, the
header below (automatic stacking).
- `<q-page>` automatically receives a `padding-top` equal to the cumulative height
of the fixed bars before it: the content never slides under them.
- `<q-footer>` stays at the bottom (safe-area bottom applied).

## Structure patterns

The canonical structure of each family — copy these skeletons when starting a new
screen.

### Dialog

```html
<q-dialog v-model="open" maximized>
  <q-dialog-header title="Title" description="Optional subtitle" />
  <!-- corps scrollable du dialog -->
  <div class="dialog-body">
    <p>Contenu…</p>
  </div>
  <q-dialog-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="Confirm" @click="open = false" />
  </q-dialog-footer>
</q-dialog>
```

### Bottom sheet

```html
<q-bottom-sheet v-model="open">
  <template #trigger>
    <q-btn color="primary" icon="lucide:settings" label="Open settings" />
  </template>
  <q-bottom-sheet-header title="Settings" description="Tune your preferences" />
  <div class="sheet-body">
    <p>Contenu du panneau…</p>
  </div>
  <q-bottom-sheet-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="Save" @click="open = false" />
  </q-bottom-sheet-footer>
</q-bottom-sheet>
```

### Action sheet

```html
<q-action-sheet
  v-model="open"
  title="Share to"
  cancel="Dismiss"
  :options="[
    { label: 'Share', icon: 'lucide:share-2' },
    { label: 'Copy link', icon: 'lucide:link' },
    { label: 'Save to device', icon: 'lucide:download' },
  ]"
  @select="onSelect"
/>
```

### Sidebar

```html
<q-sidebar v-model="open" side="left" width="280px" bordered>
  <q-sidebar-header>
    <q-icon name="lucide:box" color="primary" size="22px" />
    <b>App</b>
    <q-space />
    <theme-toggle />
  </q-sidebar-header>
  <q-sidebar-content>
    <q-sidebar-menu>
      <q-sidebar-menu-button label="Home" icon="lucide:house" href="/" />
      <q-sidebar-menu-button label="Settings" icon="lucide:settings" href="/settings" />
    </q-sidebar-menu>
  </q-sidebar-content>
</q-sidebar>
```

### Field pickers (sheet / modal / dialog)

```html
<q-select v-model="plan" :options="plans" label="Plan" mode="sheet" />
<q-date-picker v-model="date" label="Due date" mode="dialog" />
<q-country-picker v-model="code" label="Country" mode="modal" />
<!-- Modes : inline | sheet | modal | dialog — tous gérés par l'overlayBack -->
<!-- sur « retour » navigateur, le panneau se ferme au lieu de naviguer. -->
```

### Programmatic providers

The `$q` plugins are available right after installing the module — the outermost
`<q-config-provider>` renders their stacks.

```html
<q-config-provider>            <!-- le plus externe : monte les providers -->
  <q-app>…</q-app>                       <!-- $q.dialog / $q.bottomSheet / $q.notify / … -->
</q-config-provider>

<script setup lang="ts">
import { $q } from "@dnax/ui"

const confirm = $q.dialog.open({
  component: ConfirmDialog,
  title: "Delete?",
  description: "This cannot be undone.",
})
confirm.onOK(() => remove())
</script>

<!-- ConfirmDialog.vue — doit commencer par <q-dialog> (pattern Quasar) -->
<script setup lang="ts">
import { useDialogPluginComponent } from "@dnax/ui"
const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>
<template>
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header title="Delete?" description="This cannot be undone." />
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>
```

## Theming

`:theme` accepts a mode string (`"light" | "dark" | "system"`) or an object —
`colors` overrides any design token, `componentProps` sets default props per
component (a `default.radius` drives the global `--q-radius`), and `lang="fr" | "en"`
localizes every component that supports it (e.g. `QSpreadsheet` — menus, find,
filters, conditional formatting, status bar; a component `lang` prop still overrides
it). The `.dark` class is applied to `<html>` so teleported overlays follow the theme
too.

<prose-show-case>
<dnax-demo-config-provider demo="theme">



</dnax-demo-config-provider>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const mode = ref("light")
const radius = ref("md")
const primary = ref("#1976d2")
</script>

<template>
  <q-config-provider
    :theme="{
      mode,
      colors: { primary },
      componentProps: { default: { radius } },
    }"
  >
    <div class="demo-stage">
      <q-btn unelevated no-caps color="primary" label="Button" />
      <q-input label="Field" outlined dense placeholder="…" />
    </div>
  </q-config-provider>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QConfigProvider">



</dnax-api>
