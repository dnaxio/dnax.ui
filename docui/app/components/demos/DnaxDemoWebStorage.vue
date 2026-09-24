<script setup lang="ts">
// Démos live de la page Plugin Web Storage ($q.localStorage / $q.sessionStorage).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
// La démo n'écrit que sous des clés préfixées "ws:demo:" — jamais de clear() global.
import { onMounted, ref } from "vue"
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "console"
}>()

const $q = usePlugin()

const DEMO_PREFIX = "ws:demo:"

interface DemoEntry {
  key: string
  type: string
  value: string
}

const demoEntries = ref<DemoEntry[]>([])

const typeOf = (v: unknown) =>
  v instanceof Date ? "date" : Array.isArray(v) ? "array" : v === null ? "null" : typeof v

const refresh = () => {
  demoEntries.value = $q.localStorage
    .getAllKeys()
    .filter((key) => key.startsWith(DEMO_PREFIX))
    .sort()
    .map((key) => {
      const value = $q.localStorage.getItem(key)
      return {
        key: key.slice(DEMO_PREFIX.length),
        type: typeOf(value),
        value: String(value),
      }
    })
}

const storeExamples = () => {
  $q.localStorage.setItem(DEMO_PREFIX + "count", 3)
  $q.localStorage.setItem(DEMO_PREFIX + "updatedAt", new Date())
  $q.localStorage.setItem(DEMO_PREFIX + "config", { theme: "dark", retries: 2 })
  $q.localStorage.setItem(DEMO_PREFIX + "tag", "hello")
  refresh()
}

const removeDemo = (key: string) => {
  $q.localStorage.removeItem(DEMO_PREFIX + key)
  refresh()
}

const clearDemo = () => {
  for (const key of $q.localStorage.getAllKeys()) {
    if (key.startsWith(DEMO_PREFIX)) $q.localStorage.removeItem(key)
  }
  refresh()
}

onMounted(refresh)
</script>

<template>
  <div v-if="demo === 'console'" class="ws-demo">
    <div class="ws-demo__actions">
      <q-btn no-caps color="primary" label="Store examples" @click="storeExamples" />
      <q-btn no-caps flat label="Remove all demo keys" :disable="demoEntries.length === 0" @click="clearDemo" />
    </div>

    <div v-if="demoEntries.length === 0" class="ws-demo__empty">
      Nothing stored yet — click “Store examples”.
    </div>
    <div v-for="entry in demoEntries" :key="entry.key" class="ws-demo__row">
      <code class="ws-demo__key">{{ entry.key }}</code>
      <span class="ws-demo__type">{{ entry.type }}</span>
      <span class="ws-demo__value">{{ entry.value }}</span>
      <q-btn dense flat round icon="lucide:x" aria-label="Remove key" @click="removeDemo(entry.key)" />
    </div>
  </div>
</template>

<style scoped>
.ws-demo {
  width: 100%;
  max-width: 640px;
}
.ws-demo__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.ws-demo__empty {
  padding: 18px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
  border: 1px dashed var(--border);
  border-radius: 10px;
}
.ws-demo__row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  font-size: 13px;
}
.ws-demo__row + .ws-demo__row {
  border-top: 1px solid var(--border);
}
.ws-demo__key {
  flex-shrink: 0;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 12px;
}
.ws-demo__type {
  flex-shrink: 0;
  min-width: 64px;
  text-align: center;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8b93a1;
  background: rgba(148, 163, 184, 0.12);
  padding: 2px 6px;
  border-radius: 999px;
}
.ws-demo__value {
  flex: 1;
  color: var(--foreground);
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}
.ws-demo__row :deep(.q-btn) {
  flex-shrink: 0;
}
</style>
