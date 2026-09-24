---
title: Platform
description: Detect the platform the code runs on with $q.platform — a static,
  SSR-safe Quasar Platform API grouped under is / has / within.
navigation:
  icon: lucide:monitor-smartphone
seo:
  title: Platform ($q.platform)
  description: $q.platform — detect OS/browser/device (is.desktop, is.ios, is.mobile, has.touch…).
---

`$q.platform` detects the platform the code is running on — static, SSR-safe and
grouped under `is` (Quasar Platform API).

## Setup

Get `$q` with the `usePlugin()` composable, or install the `QPlugin` for a global
`this.$q` access.

```ts
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

// Legacy: app.use(QPlugin) → this.$q anywhere
import { QPlugin } from "@dnax/ui"
```

## Usage

Every detection flag lives under `$q.platform.is`, and the capabilities under
`$q.platform.has`. Because it is static (the user agent never changes during a
session) it is safe to read anywhere — in templates, composables or plain modules.

```html
<template>
  <q-btn
    :disable="!$q.platform.is.mobile"
    label="Only on mobile"
  />
  <q-btn
    v-if="$q.platform.is.ios"
    label="iOS-specific action"
  />
</template>

<script setup lang="ts">
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

if ($q.platform.is.capacitor) {
  // App native (Capacitor) — accès aux plugins natifs
}
</script>
```

### In a template

Same object is exposed to templates when using `<script setup>` with `usePlugin()`:

```html
<q-tabs v-model="tab" active-color="primary" indicator-color="primary">
  <q-tab name="ios" icon="lucide:smartphone" label="iOS"
    :disable="!$q.platform.is.ios" />
  <q-tab name="android" icon="lucide:smartphone" label="Android"
    :disable="!$q.platform.is.android" />
  <q-tab name="desktop" icon="lucide:monitor" label="Desktop"
    :disable="!$q.platform.is.desktop" />
</q-tabs>
```

## Your device

Live values detected on the current browser:

::prose-show-case
:dnax-demo-platform{demo="device"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const tab = ref("ios")
</script>

<template>
  <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
    <q-tab name="ios" icon="lucide:smartphone" label="iOS"
      :disable="!$q.platform.is.ios" />
    <q-tab name="android" icon="lucide:smartphone" label="Android"
      :disable="!$q.platform.is.android" />
    <q-tab name="desktop" icon="lucide:monitor" label="Desktop"
      :disable="!$q.platform.is.desktop" />
  </q-tabs>
</template>
```
::

## API

Full property list, mirroring the Quasar Platform API
([quasar.dev](https://quasar.dev/options/platform-detection)).

| Property | Type | Meaning |
| --- | --- | --- |
| `$q.platform.is.mobile` | boolean | Mobile device (phone or tablet, browser) |
| `$q.platform.is.tablet` | boolean | Tablet (iPad, Android tablet) |
| `$q.platform.is.desktop` | boolean | Desktop browser |
| `$q.platform.is.nativeMobile` | boolean | Mobile device inside a native wrapper (Cordova/Capacitor) |
| `$q.platform.is.nativeMobileWrapper` | string? | 'cordova' \| 'capacitor' — or undefined |
| `$q.platform.is.ios` | boolean | iOS device (iPhone, iPad, iPod) |
| `$q.platform.is.android` | boolean | Android device |
| `$q.platform.is.iphone / is.ipad / is.ipod` | boolean | Specific iOS device |
| `$q.platform.is.mac / is.win / is.linux` | boolean | Desktop OS |
| `$q.platform.is.cros` | boolean | Chrome OS (Chromebook) |
| `$q.platform.is.blackberry / is.winphone / is.silk` | boolean | Legacy devices |
| `$q.platform.is.chrome` | boolean | Google Chrome (Chromium) |
| `$q.platform.is.firefox` | boolean | Firefox |
| `$q.platform.is.safari` | boolean | Safari (WebKit) |
| `$q.platform.is.edge` | boolean | Microsoft Edge |
| `$q.platform.is.opera / is.vivaldi` | boolean | Opera / Vivaldi |
| `$q.platform.is.ie` | boolean | Internet Explorer / Trident |
| `$q.platform.is.webkit` | boolean | WebKit or WebKit-based engine |
| `$q.platform.is.cordova / is.capacitor` | boolean | Inside a Cordova / Capacitor wrapper |
| `$q.platform.is.electron` | boolean | Inside Electron |
| `$q.platform.is.bex` | boolean | Browser extension (BEX) |
| `$q.platform.is.touch` | boolean | Touch-capable screen (alias of has.touch) |
| `$q.platform.is.mouse` | boolean | Fine pointer (mouse) available |
| `$q.platform.is.name` | string | Browser name: 'chrome', 'firefox', … 'generic' |
| `$q.platform.is.version` | string | Full browser version ('70.0.3538.110') |
| `$q.platform.is.versionNumber` | number | Major browser version (70, -1 unknown) |
| `$q.platform.is.platform` | string | OS name: 'mac', 'win', 'linux', 'ios', 'android', 'cros'… |
| `$q.platform.has.touch` | boolean | Touch-capable screen |
| `$q.platform.has.webStorage` | boolean | localStorage / sessionStorage available |
| `$q.platform.within.iframe` | boolean | App is running inside an IFRAME |
| `$q.platform.userAgent` | string | navigator.userAgent |
| `$q.platform.platform` | string | navigator.platform ('iPhone', 'Linux armv81', …) |
| `$q.platform.isServer / isClient` | boolean | Where the code is running (SSR-safe) |
