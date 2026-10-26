---
title: App Wake Lock
description: Keep the screen awake with $q.wakeLock — a Screen Wake Lock wrapper that
  re-acquires the lock after a tab switch and degrades softly when refused.
navigation:
  icon: lucide:sun
seo:
  title: App Wake Lock ($q.wakeLock)
  description: $q.wakeLock — Screen Wake Lock API with isActive / isCapable, automatic
    re-acquisition on visibility change and SSR-safe defaults.
---

Recipe pages, boarding passes, presentations, navigation views: some screens must stay
on while the user is not touching the device. `$q.wakeLock` wraps the **Screen Wake Lock
API** so that a single `request()` keeps the screen awake, and `release()` lets the device
go back to its normal timeout.

## Setup

Get `$q` with `usePlugin()` (or install `QPlugin` for `this.$q`), or import the object
directly in a plain module:

```ts
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

$q.wakeLock.request()
  .then(() => {
    // the screen will stay on
  })
  .catch(() => {
    // page hidden, battery saver, or not capable
  })

// …later
$q.wakeLock.release()

// Outside components — same singleton
import { wakeLock } from "@dnax/ui"

await wakeLock.request()
```

## Basic usage

One `request()` on mount and one `release()` on unmount is all a component needs:

```html
<script setup lang="ts">
import { onBeforeUnmount } from "vue"
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

$q.wakeLock.request().catch(() => {
  // not available; the page still works, the screen just times out
})

onBeforeUnmount(() => {
  $q.wakeLock.release()
})
</script>
```

`isActive` always reflects the **real** state: `true` only while a lock is actually held.
Watch it if your UI shows the current status:

```ts
import { watch } from "vue"

watch(
  () => $q.wakeLock.isActive,
  (active) => {
    console.log(active ? "Screen kept awake" : "Normal timeout")
  },
)
```

## The browser releases the lock on its own

A wake lock only lives while the page is visible. As soon as the user switches tabs,
minimizes the browser or locks the phone, the browser releases it and `isActive` drops to
`false`. The plugin **remembers** that you asked for the lock and requests it again the
moment the page becomes visible — until you call `release()`. Nothing to wire up on your
side.

## Live demo

The button requests or releases the lock. `isCapable` is `false` until the page has
hydrated (it is also `false` where the API is unavailable, so the control can be hidden
or disabled without a hydration mismatch).

::prose-show-case
:dnax-demo-wake-lock{demo="status"}

#code

```vue
<script setup lang="ts">
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

const toggle = async () => {
  if ($q.wakeLock.isActive) await $q.wakeLock.release()
  else await $q.wakeLock.request()
}
</script>

<template>
  <p>{{ $q.wakeLock.isActive ? "Kept awake" : "Normal timeout" }}</p>
  <q-btn
    :disable="!$q.wakeLock.isCapable"
    :label="$q.wakeLock.isActive ? 'release()' : 'request()'"
    @click="toggle"
  />
</template>
```
::

## When the request is refused

The browser rejects `request()` with a `NotAllowedError` when the page is hidden, when the
device is in a battery saver mode, or when a `screen-wake-lock` Permissions Policy forbids
it (relevant inside an iframe). Treat the rejection as a **soft failure** — the screen
behaves as it always did:

```ts
try {
  await $q.wakeLock.request()
}
catch {
  // keep the feature working without a wake lock
}
```

Where the API does not exist at all, the methods reject with `Not capable` errors. Check
`isCapable` before showing a "keep screen on" control.

## Browser support

The Screen Wake Lock API needs a **secure context** (HTTPS or localhost) and is available
in Chromium-based browsers, Safari 16.4+ and Firefox 126+. Inside the WebViews used by
Capacitor and Cordova on current platforms it works too, so the plugin stays the single
answer for web, PWA and hybrid builds.

## SSR

There is no screen on the server: `isCapable` and `isActive` are both `false` there and
the methods resolve without doing anything. On the client, `isCapable` takes its real
value only after hydration, which keeps markup that depends on it (a `v-if` around a
toggle) from mismatching the server render.

## API

| Member | Type | Description |
| --- | --- | --- |
| `$q.wakeLock.request()` | `Promise<void>` | Requests the lock (idempotent). Rejects on refusal or when not capable |
| `$q.wakeLock.release()` | `Promise<void>` | Releases the lock and stops the automatic re-acquisition |
| `$q.wakeLock.isActive` | boolean | `true` only while a lock is really held — reactive |
| `$q.wakeLock.isCapable` | boolean | Screen Wake Lock available — `false` on the server and before hydration |
| `$q.wakeLock.destroy()` | void | Detaches the visibility listener (custom instances / tests) |

For tests or custom instances, the factory takes injected dependencies:

```ts
import { createWakeLock } from "@dnax/ui"

const lock = createWakeLock({
  api: fakeWakeLockApi,
  visibility: fakeDocument,
  server: false,
})
```
