<script setup lang="ts">
// Docs — plugins $q.localStorage / $q.sessionStorage : stockage web typé
// (API Quasar Web Storage — https://quasar.dev/quasar-plugins/web-storage).
import { onMounted, ref } from "vue"
import { usePlugin } from "@dnax/ui/runtime"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const $q = usePlugin()

const setupCode = `import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

$q.localStorage.set("score", 42)                 // number in…
const score = $q.localStorage.getItem("score")   // …number out (42)

// Outside of components — from any plain module
import { localStorage } from "@dnax/ui"

localStorage.setItem("session", { theme: "dark", retries: 2 })
localStorage.has("session") // true`

const typesCode = `$q.localStorage.set("updatedAt", new Date())      // Date
$q.localStorage.set("pattern", /^q-/i)           // RegExp
$q.localStorage.set("count", 3)                  // number
$q.localStorage.set("active", true)              // boolean
$q.localStorage.set("profile", { name: "Ada" })  // plain object

// All of them come back with their original type:
$q.localStorage.getItem("updatedAt") // Date (not a string!)
$q.localStorage.getItem("count")     // 3 (number)

// Under the hood the Web Storage only stores prefixed strings:
window.localStorage.getItem("count") // '__q_numb|3'`

const tryCatchCode = `try {
  $q.localStorage.set("bulk", payload)
}
catch (err) {
  // Web Storage error: quota exceeded, disabled storage…
}`

// — Live demo : mini console sur clés préfixées "ws:demo:" —
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

const usageDemo = `<div class="ws-demo">
  <div class="ws-demo__actions">
    <q-btn no-caps color="primary" label="Store examples" @click="storeExamples" />
    <q-btn no-caps flat label="Remove all demo keys"
      :disable="demoEntries.length === 0" @click="clearDemo" />
  </div>

  <div v-if="demoEntries.length === 0" class="ws-demo__empty">
    Nothing stored yet — click “Store examples”.
  </div>
  <div v-for="entry in demoEntries" :key="entry.key" class="ws-demo__row">
    <code class="ws-demo__key">{{ entry.key }}</code>
    <span class="ws-demo__type">{{ entry.type }}</span>
    <span class="ws-demo__value">{{ entry.value }}</span>
    <q-btn dense flat round icon="lucide:x" aria-label="Remove key"
      @click="removeDemo(entry.key)" />
  </div>
</div>`

const scriptDemo = `const DEMO_PREFIX = "ws:demo:"

const demoEntries = ref([])

const refresh = () => {
  demoEntries.value = $q.localStorage
    .getAllKeys()
    .filter((key) => key.startsWith(DEMO_PREFIX))
    .sort()
    .map((key) => {
      const value = $q.localStorage.getItem(key)
      return { key, type: typeof value, value: String(value) }
    })
}

const storeExamples = () => {
  $q.localStorage.setItem(DEMO_PREFIX + "count", 3)
  $q.localStorage.setItem(DEMO_PREFIX + "updatedAt", new Date())
  $q.localStorage.setItem(DEMO_PREFIX + "config", { theme: "dark", retries: 2 })
  $q.localStorage.setItem(DEMO_PREFIX + "tag", "hello")
  refresh()
}

const removeDemo = (key) => {
  $q.localStorage.removeItem(DEMO_PREFIX + key)
  refresh()
}

const clearDemo = () => {
  for (const key of $q.localStorage.getAllKeys()) {
    if (key.startsWith(DEMO_PREFIX)) $q.localStorage.removeItem(key)
  }
  refresh()
}`

// — Tableau API —
const apiRows: { path: string; type: string; meaning: string }[] = [
  { path: "has(key)", type: "boolean", meaning: "Whether the key exists (alias: hasItem)" },
  { path: "getLength()", type: "number", meaning: "Number of stored keys" },
  { path: "getItem(key)", type: "any", meaning: "Typed value of the key, or null if absent" },
  { path: "getIndex(index)", type: "any", meaning: "Typed value at the given index (Web Storage order), or null" },
  { path: "getKey(index)", type: "string?", meaning: "Key name at the given index, or null" },
  { path: "getAll()", type: "object", meaning: "All entries as { key: typed value }" },
  { path: "getAllKeys()", type: "string[]", meaning: "All key names, in storage order" },
  { path: "set(key, value)", type: "void", meaning: "Stores a value with type serialization (alias: setItem)" },
  { path: "remove(key)", type: "void", meaning: "Removes the key (alias: removeItem)" },
  { path: "clear()", type: "void", meaning: "Empties the whole storage (careful: every key of the origin)" },
  { path: "isEmpty()", type: "boolean", meaning: "Whether the storage is empty" },
]
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Web Storage</h1>
    <p class="guide__lead">
      <code>$q.localStorage</code> and <code>$q.sessionStorage</code> wrap the Web
      Storage API with one superpower: stored values keep their
      <b>original type</b> — a <code>Number</code> comes back as a
      <code>Number</code>, and <code>Date</code>, <code>RegExp</code> and plain
      objects round-trip too (Quasar Web Storage plugin).
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Setup</h2>
      <p class="guide__note">
        Get <code>$q</code> with the <code>usePlugin()</code> composable (or install
        the <code>QPlugin</code> for a global <code>this.$q</code>), or import the
        stores directly from <code>@dnax/ui</code> in any plain module:
      </p>
      <q-syntax :code="setupCode" lang="ts" filename="storage.ts" copy />
      <p class="guide__note">
        Both stores are <b>SSR/SSG-safe</b>: the Web Storage API only exists in the
        browser. On the server (or when storage is blocked — private mode,
        disabled cookies…) every method is a no-op:
        <code>getItem</code> returns <code>null</code>, <code>getAll</code>
        returns <code>{}</code>.
      </p>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Typed values</h2>
      <p class="guide__note">
        Values are serialized with a prefix marker, so the raw Web Storage only
        ever holds strings while you read and write real data types:
      </p>
      <q-syntax :code="typesCode" lang="ts" filename="typed.ts" copy />
      <p class="guide__note">
        The encoding format is the <b>same as Quasar's</b> — keys written by a
        Quasar app remain readable here and vice-versa. Any other type
        (<code>undefined</code>, functions…) is stored as its string form. When
        setting a value, always wrap the call in a
        <code>try/catch</code> to handle Web Storage errors (quota exceeded…):
      </p>
      <q-syntax :code="tryCatchCode" lang="ts" filename="safe.ts" copy />
      <p class="guide__note">
        Prefer <code>$q.sessionStorage</code> when the data should not outlive the
        browser tab (same API) and <code>$q.localStorage</code> for persistence.
      </p>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <p class="guide__note">
        Writes and reads <code>$q.localStorage</code> under keys prefixed
        <code>ws:demo:</code> — the type column shows the round-trip worked:
      </p>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue" :script="scriptDemo">
        <div class="ws-demo">
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
      </docs-demo>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">API</h2>
      <p class="guide__note">
        Identical method set on <code>$q.localStorage</code> and
        <code>$q.sessionStorage</code>, mirroring Quasar's Web Storage API
        (<a href="https://quasar.dev/quasar-plugins/web-storage" target="_blank" rel="noopener">quasar.dev</a>).
      </p>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in apiRows" :key="row.path">
              <td><code>$q.localStorage.{{ row.path }}</code></td>
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
.guide__note a {
  color: var(--primary);
}

/* — live demo — */
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
