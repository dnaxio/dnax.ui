---
title: Network
description: Reactive online / offline state with $q.network — SSR-safe, driven by
  navigator.onLine and the browser online / offline events.
navigation:
  icon: lucide:wifi
seo:
  title: Network ($q.network)
  description: $q.network — reactive online/offline state from navigator.onLine, with
    event subscriptions, refresh() and a template-friendly boolean (SSR-safe).
---

`$q.network` tracks whether the browser is connected. `online` is a plain **boolean**
(no `.value`) that stays **reactive** in templates: it flips when the browser fires its
`online` / `offline` events.

## Setup

Read it from `$q` (via `usePlugin()` or the global `QPlugin`), or import the object
directly in a plain module:

```ts
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

if (!$q.network.online) {
  $q.notify.show({ message: "You are offline", type: "warning" })
}

// Outside components — same singleton
import { network } from "@dnax/ui"

network.on("offline", () => pauseSync())
```

## In a template

`online` and `offline` are read **without** `.value`, and the surrounding component
re-renders when the connection changes:

```html
<template>
  <p>
    Connection:
    <strong>{{ $q.network.online ? "online" : "offline" }}</strong>
  </p>

  <q-btn
    :disable="$q.network.offline"
    label="Sync now"
  />
</template>
```

## Reactions

`on("online" | "offline", cb)` registers a listener and returns the unsubscribe function.
Callbacks only fire on a real transition — an `offline` event received while already
offline does nothing:

```ts
import { onBeforeUnmount } from "vue"

const stop = $q.network.on("offline", () => {
  // pause uploads, show a banner…
})
onBeforeUnmount(stop)
```

## Live demo

The buttons emit the browser events. `refresh()` re-reads the real
`navigator.onLine`.

::prose-show-case
:dnax-demo-network{demo="status"}

#code

```vue
<script setup lang="ts">
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

const simulate = (kind: "online" | "offline") => {
  window.dispatchEvent(new Event(kind))
}
</script>

<template>
  <p>{{ $q.network.online ? "Online" : "Offline" }}</p>
  <q-btn flat no-caps label="Simulate offline" @click="simulate('offline')" />
  <q-btn flat no-caps label="Simulate online" @click="simulate('online')" />
  <q-btn color="primary" no-caps label="refresh()" @click="$q.network.refresh()" />
</template>
```
::

## SSR

On the server `online` is `true` — a server has no connection state, and an offline
banner must not flash during SSR. On the client, the real `navigator.onLine` is read
when the module is evaluated; the two values only differ if the device is genuinely
offline at the first render.

## API

| Member | Type | Description |
| --- | --- | --- |
| `$q.network.online` | boolean | Connected — reactive, read without `.value` |
| `$q.network.offline` | boolean | Inverse of `online` |
| `$q.network.refresh()` | boolean | Re-reads `navigator.onLine`, updates the state and returns it |
| `$q.network.on(type, cb)` | `() => void` | Listens to `"online"` or `"offline"` transitions; returns the unsubscribe function |
| `$q.network.destroy()` | void | Detaches the listeners (custom instances / tests) |

`navigator.onLine` only reports **link** status: a Wi-Fi network without internet access
still reads as online. Treat `$q.network` as a hint, not as a reachability check.

For tests or custom instances, the factory takes injected dependencies:

```ts
import { createNetwork } from "@dnax/ui"

const net = createNetwork({
  navigator: { onLine: false },
  target: fakeEventTarget,
})
```
