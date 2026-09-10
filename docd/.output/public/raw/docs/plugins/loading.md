# Loading

> Show a counted fullscreen loading overlay imperatively from code with $q.loading.

`$q.loading` shows a counted fullscreen overlay — rendered by the automatically
mounted `QLoadingProvider`.

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

`show()` is **counted**: call it several times and `hide()` once to keep it visible.
Options: `message`, `icon`, `spinnerColor`, `boxed`, `transparent`.

```ts
const $q = usePlugin()

$q.loading.show({
  message: "Uploading…",
  spinnerColor: "primary",
})
// … then
$q.loading.hide()
```

## Live demo

<prose-show-case>
<dnax-demo-loading-plugin demo="live">



</dnax-demo-loading-plugin>

<template v-slot:code="">

```vue
<div class="row">
  <q-btn no-caps color="primary" label="Show 2s" @click="fire" />
</div>
```

</template>
</prose-show-case>
