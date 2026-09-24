<script setup lang="ts">
// Live demos for the Syntax page — the code snippets are page data.
defineProps<{
  /** Identifier of the demo to render */
  demo: "basic" | "languages" | "themes"
}>()

const tsCode = `interface User {
  id: number
  name: string
  roles: string[]
}

const formatName = (user: User): string =>
  user.name.toUpperCase()`

const vueCode = `<template>
  <q-btn label="Hello" icon="lucide:heart" color="primary" />
</template>`

const bashCode = `npm install @dnax/ui
npm run dev
npm run build`

const cssCode = `.q-btn {
  --q-btn-h: 40px;
  border-radius: 8px;
}`

const jsonCode = `{
  "name": "my-app",
  "extends": ["@dnax/ui"]
}`
</script>

<template>
  <q-syntax v-if="demo === 'basic'" :code="tsCode" lang="ts" filename="utils.ts" copy />

  <div v-else-if="demo === 'languages'" class="demo-col">
    <q-syntax :code="vueCode" lang="vue" filename="App.vue" />
    <q-syntax :code="bashCode" lang="bash" filename="terminal" copy />
    <q-syntax :code="cssCode" lang="css" filename="main.css" />
    <q-syntax :code="jsonCode" lang="json" filename="package.json" />
  </div>

  <div v-else-if="demo === 'themes'" class="demo-col">
    <q-syntax :code="tsCode" lang="ts" filename="default-theme.ts" copy />
    <q-syntax :code="tsCode" lang="ts" theme="github-light" filename="light-theme.ts" copy />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}
</style>
