<script setup lang="ts">
// Docs — plugin $q.platform : détection de plateforme (API Quasar).
import { usePlugin } from "@dnax/ui/runtime"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const $q = usePlugin()

const setupCode = `import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

// Legacy: app.use(QPlugin) → this.$q anywhere
import { QPlugin } from "@dnax/ui"`

const usageCode = `<template>
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
<\/script>`

const usageTemplate = `<q-tabs v-model="tab" active-color="primary" indicator-color="primary">
  <q-tab name="ios" icon="lucide:smartphone" label="iOS"
    :disable="!$q.platform.is.ios" />
  <q-tab name="android" icon="lucide:smartphone" label="Android"
    :disable="!$q.platform.is.android" />
  <q-tab name="desktop" icon="lucide:monitor" label="Desktop"
    :disable="!$q.platform.is.desktop" />
</q-tabs>`

const scriptTemplate = `import { ref } from "vue"

const tab = ref("ios")`

// — Live demo : appareil courant (statique par session) —
const is = $q.platform.is

const deviceRows: { label: string; value: string }[] = [
  { label: "Browser", value: `${is.name} ${is.version}` },
  { label: "OS", value: is.platform },
  { label: "Device", value: is.mobile ? "Mobile" : is.tablet ? "Tablet" : "Desktop" },
  { label: "Native wrapper", value: is.nativeMobileWrapper ?? "—" },
  { label: "User agent", value: $q.platform.userAgent },
]

const flags: { name: string; value: boolean }[] = [
  { name: "mobile", value: is.mobile },
  { name: "tablet", value: is.tablet },
  { name: "desktop", value: is.desktop },
  { name: "nativeMobile", value: is.nativeMobile },
  { name: "ios", value: is.ios },
  { name: "android", value: is.android },
  { name: "iphone", value: is.iphone },
  { name: "ipad", value: is.ipad },
  { name: "ipod", value: is.ipod },
  { name: "mac", value: is.mac },
  { name: "win", value: is.win },
  { name: "linux", value: is.linux },
  { name: "chrome", value: is.chrome },
  { name: "firefox", value: is.firefox },
  { name: "safari", value: is.safari },
  { name: "edge", value: is.edge },
  { name: "opera", value: is.opera },
  { name: "vivaldi", value: is.vivaldi },
  { name: "ie", value: is.ie },
  { name: "webkit", value: is.webkit },
  { name: "cros", value: is.cros },
  { name: "blackberry", value: is.blackberry },
  { name: "winphone", value: is.winphone },
  { name: "silk", value: is.silk },
  { name: "bex", value: is.bex },
  { name: "electron", value: is.electron },
  { name: "cordova", value: is.cordova },
  { name: "capacitor", value: is.capacitor },
  { name: "has.touch", value: $q.platform.has.touch },
  { name: "has.webStorage", value: $q.platform.has.webStorage },
  { name: "within.iframe", value: $q.platform.within.iframe },
]

// — Tableau API —
const apiRows: { path: string; type: string; meaning: string }[] = [
  { path: "is.mobile", type: "boolean", meaning: "Mobile device (phone or tablet, browser)" },
  { path: "is.tablet", type: "boolean", meaning: "Tablet (iPad, Android tablet)" },
  { path: "is.desktop", type: "boolean", meaning: "Desktop browser" },
  { path: "is.nativeMobile", type: "boolean", meaning: "Mobile device inside a native wrapper (Cordova/Capacitor)" },
  { path: "is.nativeMobileWrapper", type: "string?", meaning: "'cordova' | 'capacitor' — or undefined" },
  { path: "is.ios", type: "boolean", meaning: "iOS device (iPhone, iPad, iPod)" },
  { path: "is.android", type: "boolean", meaning: "Android device" },
  { path: "is.iphone / is.ipad / is.ipod", type: "boolean", meaning: "Specific iOS device" },
  { path: "is.mac / is.win / is.linux", type: "boolean", meaning: "Desktop OS" },
  { path: "is.cros", type: "boolean", meaning: "Chrome OS (Chromebook)" },
  { path: "is.blackberry / is.winphone / is.silk", type: "boolean", meaning: "Legacy devices" },
  { path: "is.chrome", type: "boolean", meaning: "Google Chrome (Chromium)" },
  { path: "is.firefox", type: "boolean", meaning: "Firefox" },
  { path: "is.safari", type: "boolean", meaning: "Safari (WebKit)" },
  { path: "is.edge", type: "boolean", meaning: "Microsoft Edge" },
  { path: "is.opera / is.vivaldi", type: "boolean", meaning: "Opera / Vivaldi" },
  { path: "is.ie", type: "boolean", meaning: "Internet Explorer / Trident" },
  { path: "is.webkit", type: "boolean", meaning: "WebKit or WebKit-based engine" },
  { path: "is.cordova / is.capacitor", type: "boolean", meaning: "Inside a Cordova / Capacitor wrapper" },
  { path: "is.electron", type: "boolean", meaning: "Inside Electron" },
  { path: "is.bex", type: "boolean", meaning: "Browser extension (BEX)" },
  { path: "is.touch", type: "boolean", meaning: "Touch-capable screen (alias of has.touch)" },
  { path: "is.mouse", type: "boolean", meaning: "Fine pointer (mouse) available" },
  { path: "is.name", type: "string", meaning: "Browser name: 'chrome', 'firefox', … 'generic'" },
  { path: "is.version", type: "string", meaning: "Full browser version ('70.0.3538.110')" },
  { path: "is.versionNumber", type: "number", meaning: "Major browser version (70, -1 unknown)" },
  { path: "is.platform", type: "string", meaning: "OS name: 'mac', 'win', 'linux', 'ios', 'android', 'cros'…" },
  { path: "has.touch", type: "boolean", meaning: "Touch-capable screen" },
  { path: "has.webStorage", type: "boolean", meaning: "localStorage / sessionStorage available" },
  { path: "within.iframe", type: "boolean", meaning: "App is running inside an IFRAME" },
  { path: "userAgent", type: "string", meaning: "navigator.userAgent" },
  { path: "platform", type: "string", meaning: "navigator.platform ('iPhone', 'Linux armv81', …)" },
  { path: "isServer / isClient", type: "boolean", meaning: "Where the code is running (SSR-safe)" },
]
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Platform</h1>
    <p class="guide__lead">
      <code>$q.platform</code> detects the platform the code is running on —
      static, SSR-safe and grouped under <code>is</code> (Quasar Platform API).
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Setup</h2>
      <p class="guide__note">
        Get <code>$q</code> with the <code>usePlugin()</code> composable, or install
        the <code>QPlugin</code> for a global <code>this.$q</code> access.
      </p>
      <q-syntax :code="setupCode" lang="ts" filename="app.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Usage</h2>
      <p class="guide__note">
        Every detection flag lives under <code>$q.platform.is</code>, and the
        capabilities under <code>$q.platform.has</code>. Because it is static
        (the user agent never changes during a session) it is safe to read
        anywhere — in templates, composables or plain modules.
      </p>
      <q-syntax :code="usageCode" lang="html" filename="App.vue" copy />

      <h3 class="guide__h3">In a template</h3>
      <p class="guide__note">
        Same object is exposed to templates when using <code>&lt;script setup&gt;</code>
        with <code>usePlugin()</code>:
      </p>
      <q-syntax :code="usageTemplate" lang="html" filename="App.vue" :script="scriptTemplate" />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Your device</h2>
      <p class="guide__note">
        Live values detected on the current browser:
      </p>
      <docs-demo :code="usageTemplate" lang="html" filename="App.vue" :script="scriptTemplate">
        <div class="demo-device">
          <div class="demo-device__rows">
            <div v-for="row in deviceRows" :key="row.label" class="demo-device__row">
              <span class="demo-device__label">{{ row.label }}</span>
              <span class="demo-device__value">{{ row.value }}</span>
            </div>
          </div>
          <div class="demo-flags">
            <span
              v-for="f in flags"
              :key="f.name"
              class="demo-flag"
              :class="f.value ? 'demo-flag--on' : 'demo-flag--off'"
            >
              <span class="demo-flag__dot" />
              <code>{{ f.name }}</code>
            </span>
          </div>
        </div>
      </docs-demo>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">API</h2>
      <p class="guide__note">
        Full property list, mirroring the Quasar Platform API
        (<a href="https://quasar.dev/options/platform-detection" target="_blank" rel="noopener">quasar.dev</a>).
      </p>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in apiRows" :key="row.path">
              <td><code>$q.platform.{{ row.path }}</code></td>
              <td>{{ row.type }}</td>
              <td>{{ row.meaning }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.guide__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.guide__lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.guide__section {
  margin-bottom: 44px;
}
.guide__h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.guide__h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.guide__note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.guide__note code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

/* — live demo — */
.demo-device {
  width: 100%;
  max-width: 640px;
}
.demo-device__rows {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 14px;
}
.demo-device__row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 14px;
  font-size: 13px;
}
.demo-device__row + .demo-device__row {
  border-top: 1px solid var(--border);
}
.demo-device__label {
  color: #8b93a1;
  flex-shrink: 0;
}
.demo-device__value {
  color: var(--foreground);
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}
.demo-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.demo-flag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid var(--border);
}
.demo-flag code {
  font-size: 12px;
  color: var(--foreground);
}
.demo-flag__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.demo-flag--on {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.35);
}
.demo-flag--on .demo-flag__dot {
  background: #10b981;
}
.demo-flag--off {
  background: rgba(148, 163, 184, 0.08);
  opacity: 0.75;
}
.demo-flag--off .demo-flag__dot {
  background: #94a3b8;
}

/* — tableau API — */
.api-table-wrap {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
}
.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.api-table th,
.api-table td {
  text-align: left;
  padding: 8px 14px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.api-table th {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
  background: rgba(148, 163, 184, 0.06);
}
.api-table tr:last-child td {
  border-bottom: none;
}
.api-table code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
  white-space: nowrap;
}
</style>
