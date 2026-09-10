# Notify

> Show toast notifications imperatively from code with $q.notify — position, type, timeout and action buttons.

`$q.notify` fires toast notifications (vue-sonner) from anywhere — rendered by the
automatically mounted `QNotifyProvider`.

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

Options: `message`, `caption`, `icon`, `type` (`positive | negative | warning | info`),
`position`, `timeout` and `actions` (button with handler).

```ts
const $q = usePlugin()

$q.notify.show({
  type: "positive", // positive | negative | warning | info
  message: "Saved successfully",
  caption: "All changes are up to date",
  position: "top",
  timeout: 2500,
})

// With an action
$q.notify.show({
  message: "New version available",
  actions: [{ label: "Update", handler: () => update() }],
})
```

## Live demo

<prose-show-case>
<dnax-demo-notify demo="live">



</dnax-demo-notify>

<template v-slot:code="">

```vue
<div class="row">
  <q-btn no-caps color="positive" label="Success" @click="fire('success', 'Saved')" />
  <q-btn no-caps color="negative" label="Error" @click="fire('error', 'Failed')" />
  <q-btn no-caps color="warning" label="Warning" @click="fire('warning', 'Careful')" />
  <q-btn no-caps color="info" label="Info" @click="fire('info', 'Heads up')" />
</div>
```

</template>
</prose-show-case>
