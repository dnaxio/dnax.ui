# Image Preview

> Open the fullscreen image viewer imperatively from code with $q.imagePreview and its goTo controller.

`$q.imagePreview` opens the fullscreen image viewer from anywhere — rendered by the
automatically mounted `QImagePreviewProvider`.

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

Same options as `<q-image-preview>` — `images` (string<span>



</span>

 or `{ src }`<span>



</span>

), `index`,
`transition`, `closeBtn`, `counter`… — plus `onDismiss`. The returned controller
exposes `goTo(index)`.

```ts
const $q = usePlugin()

$q.imagePreview.open({
  images: [
    "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop",
  ],
  index: 0,
  transition: "up",
  closeBtn: true,
  onDismiss: () => console.log("preview closed"),
}).goTo(1)
```

## Live demo

<prose-show-case>
<dnax-demo-image-preview-plugin demo="live">



</dnax-demo-image-preview-plugin>

<template v-slot:code="">

```vue
<div class="row">
  <q-btn no-caps color="primary" label="Open preview" @click="fire" />
</div>
```

</template>
</prose-show-case>
