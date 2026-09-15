---
title: Web Storage
description: Type-preserving Web Storage with $q.localStorage and
  $q.sessionStorage — Quasar-compatible, SSR-safe get/set.
navigation:
  icon: lucide:database
seo:
  title: Web Storage ($q.localStorage)
  description: $q.localStorage / $q.sessionStorage — Quasar-compatible typed web storage (SSR-safe).
---

`$q.localStorage` and `$q.sessionStorage` wrap the Web Storage API with one
superpower: stored values keep their **original type** — a `Number` comes back as a
`Number`, and `Date`, `RegExp` and plain objects round-trip too (Quasar Web Storage
plugin).

## Setup

Get `$q` with the `usePlugin()` composable (or install the `QPlugin` for a global
`this.$q`), or import the stores directly from `@dnax/ui` in any plain module:

```ts
import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

$q.localStorage.set("score", 42)                 // number in…
const score = $q.localStorage.getItem("score")   // …number out (42)

// Outside of components — from any plain module
import { localStorage } from "@dnax/ui"

localStorage.setItem("session", { theme: "dark", retries: 2 })
localStorage.has("session") // true
```

Both stores are **SSR/SSG-safe**: the Web Storage API only exists in the browser. On
the server (or when storage is blocked — private mode, disabled cookies…) every
method is a no-op: `getItem` returns `null`, `getAll` returns `{}`.

## Typed values

Values are serialized with a prefix marker, so the raw Web Storage only ever holds
strings while you read and write real data types:

```ts
$q.localStorage.set("updatedAt", new Date())      // Date
$q.localStorage.set("pattern", /^q-/i)           // RegExp
$q.localStorage.set("count", 3)                  // number
$q.localStorage.set("active", true)              // boolean
$q.localStorage.set("profile", { name: "Ada" })  // plain object

// All of them come back with their original type:
$q.localStorage.getItem("updatedAt") // Date (not a string!)
$q.localStorage.getItem("count")     // 3 (number)

// Under the hood the Web Storage only stores prefixed strings:
window.localStorage.getItem("count") // '__q_numb|3'
```

The encoding format is the **same as Quasar's** — keys written by a Quasar app
remain readable here and vice-versa. Any other type (`undefined`, functions…) is
stored as its string form. When setting a value, always wrap the call in a
`try/catch` to handle Web Storage errors (quota exceeded…):

```ts
try {
  $q.localStorage.set("bulk", payload)
}
catch (err) {
  // Web Storage error: quota exceeded, disabled storage…
}
```

Prefer `$q.sessionStorage` when the data should not outlive the browser tab (same
API) and `$q.localStorage` for persistence.

## Live demo

Writes and reads `$q.localStorage` under keys prefixed `ws:demo:` — the type column
shows the round-trip worked:

::prose-show-case
:dnax-demo-web-storage{demo="console"}

#code

```vue
<script setup lang="ts">
const DEMO_PREFIX = "ws:demo:"

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
}
</script>

<template>
<div class="ws-demo">
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
</div>
</template>
```
::

## API

Identical method set on `$q.localStorage` and `$q.sessionStorage`, mirroring
Quasar's Web Storage API
([quasar.dev](https://quasar.dev/quasar-plugins/web-storage)).

| Method | Returns | Description |
| --- | --- | --- |
| `$q.localStorage.has(key)` | boolean | Whether the key exists (alias: hasItem) |
| `$q.localStorage.getLength()` | number | Number of stored keys |
| `$q.localStorage.getItem(key)` | any | Typed value of the key, or null if absent |
| `$q.localStorage.getIndex(index)` | any | Typed value at the given index (Web Storage order), or null |
| `$q.localStorage.getKey(index)` | string? | Key name at the given index, or null |
| `$q.localStorage.getAll()` | object | All entries as `{ key: typed value }` |
| `$q.localStorage.getAllKeys()` | string[] | All key names, in storage order |
| `$q.localStorage.set(key, value)` | void | Stores a value with type serialization (alias: setItem) |
| `$q.localStorage.remove(key)` | void | Removes the key (alias: removeItem) |
| `$q.localStorage.clear()` | void | Empties the whole storage (careful: every key of the origin) |
| `$q.localStorage.isEmpty()` | boolean | Whether the storage is empty |
