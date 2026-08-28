<script setup lang="ts">
// Docs — Installation.
definePageMeta({ layout: "docs" })

const installCode = `# bun
bun add @dnax/ui

# npm
npm install @dnax/ui

# pnpm
pnpm add @dnax/ui`

const moduleCode = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@dnax/ui"],
})`

const manualCode = `import { QBtn } from "@dnax/ui"
import "@dnax/ui/styles/main.css"`

const autoImportCode = `<template>
  <q-btn color="primary" label="Hello Dnax UI" />
</template>`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Installation</h1>
    <p class="guide__lead">
      Add <code>@dnax/ui</code> to your project — the Nuxt module wires everything:
      auto-import of the Q* components and the global styles (tokens, safe-area).
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Install the package</h2>
      <q-syntax :code="installCode" lang="bash" filename="terminal" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Register the module</h2>
      <q-syntax :code="moduleCode" lang="ts" filename="nuxt.config.ts" copy />
      <p class="guide__note">
        The module auto-imports all components (<code>&lt;q-btn&gt;</code>,
        <code>&lt;q-dialog&gt;</code>…) and injects <code>styles/main.css</code>.
      </p>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Your first component</h2>
      <q-syntax :code="autoImportCode" lang="html" filename="App.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Without the module</h2>
      <p class="guide__note">
        In a plain Vue/Vite app, import components explicitly and add the stylesheet:
      </p>
      <q-syntax :code="manualCode" lang="ts" filename="main.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Requirements</h2>
      <ul class="guide__list">
        <li>Vue <b>3.5+</b></li>
        <li>TypeScript <b>5+</b> (recommended)</li>
        <li>Nuxt <b>3.12+</b> for the module (otherwise manual usage)</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.guide {
  max-width: 760px;
}
.guide__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.guide__lead {
  margin: 12px 0 0;
  font-size: 15.5px;
  line-height: 1.65;
  color: #5b6472;
}
.guide__section {
  margin-top: 32px;
}
.guide__h2 {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}
.guide__note {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.guide__note code,
.guide__lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.guide__list {
  margin: 0;
  padding-left: 18px;
  color: #5b6472;
  font-size: 14px;
  line-height: 1.9;
}
</style>
