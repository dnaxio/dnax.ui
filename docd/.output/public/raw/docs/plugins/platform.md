# Platform

> Detect the platform the code runs on with $q.platform — a static, SSR-safe Quasar Platform API grouped under is / has / within.

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

<prose-show-case>
<dnax-demo-platform demo="device">



</dnax-demo-platform>

<template v-slot:code="">

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

</template>
</prose-show-case>

## API

Full property list, mirroring the Quasar Platform API
([quasar.dev](https://quasar.dev/options/platform-detection)).

<table>
<thead>
  <tr>
    <th>
      Property
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Meaning
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        $q.platform.is.mobile
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Mobile device (phone or tablet, browser)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.tablet
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Tablet (iPad, Android tablet)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.desktop
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Desktop browser
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.nativeMobile
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Mobile device inside a native wrapper (Cordova/Capacitor)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.nativeMobileWrapper
      </code>
    </td>
    
    <td>
      string?
    </td>
    
    <td>
      'cordova' | 'capacitor' — or undefined
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.ios
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      iOS device (iPhone, iPad, iPod)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.android
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Android device
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.iphone / is.ipad / is.ipod
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Specific iOS device
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.mac / is.win / is.linux
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Desktop OS
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.cros
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Chrome OS (Chromebook)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.blackberry / is.winphone / is.silk
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Legacy devices
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.chrome
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Google Chrome (Chromium)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.firefox
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Firefox
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.safari
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Safari (WebKit)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.edge
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Microsoft Edge
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.opera / is.vivaldi
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Opera / Vivaldi
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.ie
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Internet Explorer / Trident
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.webkit
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      WebKit or WebKit-based engine
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.cordova / is.capacitor
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Inside a Cordova / Capacitor wrapper
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.electron
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Inside Electron
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.bex
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Browser extension (BEX)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.touch
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Touch-capable screen (alias of has.touch)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.mouse
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Fine pointer (mouse) available
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.name
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      Browser name: 'chrome', 'firefox', … 'generic'
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.version
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      Full browser version ('70.0.3538.110')
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.versionNumber
      </code>
    </td>
    
    <td>
      number
    </td>
    
    <td>
      Major browser version (70, -1 unknown)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.is.platform
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      OS name: 'mac', 'win', 'linux', 'ios', 'android', 'cros'…
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.has.touch
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Touch-capable screen
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.has.webStorage
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      localStorage / sessionStorage available
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.within.iframe
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      App is running inside an IFRAME
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.userAgent
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      navigator.userAgent
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.platform
      </code>
    </td>
    
    <td>
      string
    </td>
    
    <td>
      navigator.platform ('iPhone', 'Linux armv81', …)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $q.platform.isServer / isClient
      </code>
    </td>
    
    <td>
      boolean
    </td>
    
    <td>
      Where the code is running (SSR-safe)
    </td>
  </tr>
</tbody>
</table>
