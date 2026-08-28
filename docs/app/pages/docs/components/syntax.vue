<script setup lang="ts">
// QSyntax — bloc de code avec coloration syntaxique Shiki (https://shiki.style).
// <q-syntax code="const a = 1" lang="ts" theme="github-dark" filename="app.ts" copy />
// code peut venir de la prop `code` ou du slot par défaut. Rendu côté client.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const syntax = useComponent(() => "QSyntax")
const syntaxSource = componentSource("QSyntax")
const tag = componentTag("QSyntax")

// — Demos —
const basicCode = `<q-syntax :code="tsCode" lang="ts" filename="utils.ts" copy />`

const tsCode = `interface User {
  id: number
  name: string
  roles: string[]
}

const formatName = (user: User): string =>
  user.name.toUpperCase()`

const langsCode = `<q-syntax :code="vueCode" lang="vue" filename="App.vue" />
<q-syntax :code="bashCode" lang="bash" filename="terminal" copy />
<q-syntax :code="cssCode" lang="css" filename="main.css" />
<q-syntax :code="jsonCode" lang="json" filename="package.json" />`

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

const themeCode = `<q-syntax :code="tsCode" lang="ts" theme="github-light" filename="theme.ts" copy />`

const slotCode = `<q-syntax lang="html" filename="App.vue" copy>
  <q-btn label="Hello" />
</q-syntax>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Syntax</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Code blocks with Shiki syntax highlighting, rendered client-side. They support a
      filename bar, a copy button, lazy-loaded languages and themes, and a radius
      scale matching the rest of the design system.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>
      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <q-syntax :code="tsCode" lang="ts" filename="utils.ts" copy />
      </docs-demo>
      <p class="doc-note">
        The code comes from the <code>code</code> prop. <code>lang</code> selects the
        Shiki grammar, <code>filename</code> shows a title bar, and <code>copy</code>
        adds a clipboard button.
      </p>
    </section>

    <!-- ═══════ Languages ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Languages</h2>
      <docs-demo :code="langsCode" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-syntax :code="vueCode" lang="vue" filename="App.vue" />
          <q-syntax :code="bashCode" lang="bash" filename="terminal" copy />
          <q-syntax :code="cssCode" lang="css" filename="main.css" />
          <q-syntax :code="jsonCode" lang="json" filename="package.json" />
        </div>
      </docs-demo>
      <p class="doc-note">
        Vue, TypeScript, JavaScript, HTML, CSS, SCSS, JSON, Bash, Markdown, YAML,
        Python, Go, Rust and SQL ship by default. Other languages are loaded lazily
        and fall back to plain text when unknown.
      </p>
    </section>

    <!-- ═══════ Themes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Themes</h2>
      <docs-demo :code="themeCode" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-syntax :code="tsCode" lang="ts" filename="default-theme.ts" copy />
          <q-syntax :code="tsCode" lang="ts" theme="github-light" filename="light-theme.ts" copy />
        </div>
      </docs-demo>
      <p class="doc-note">
        The default theme is <code>github-dark-default</code>. Any Shiki theme can be
        passed via <code>theme</code> — it is loaded on demand and falls back to the
        default if unavailable. <code>radius="sm|md|lg"</code> (or <code>radius</code>)
        controls the corner rounding.
      </p>
    </section>

    <!-- ═══════ Slot ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Default slot</h2>
      <p class="doc-note">
        Instead of the <code>code</code> prop, the raw code can be placed in the
        default slot — convenient for static snippets written directly in a template.
      </p>
      <q-syntax :code="slotCode" lang="html" filename="App.vue" copy />
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="syntax" :source="syntaxSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* espace entre les deux blocs docs-demo */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
