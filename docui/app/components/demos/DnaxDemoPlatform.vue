<script setup lang="ts">
// Démos live de la page Plugin Platform ($q.platform : détection de plateforme).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "device"
}>()

const $q = usePlugin()

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
</script>

<template>
  <div v-if="demo === 'device'" class="demo-device">
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
        <span class="demo-flag__dot"></span>
        <code>{{ f.name }}</code>
      </span>
    </div>
  </div>
</template>

<style scoped>
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
</style>
