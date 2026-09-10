# Syntax

> Code blocks with Shiki syntax highlighting, a filename bar and a copy button.

Code blocks with Shiki syntax highlighting, rendered client-side. They support a
filename bar, a copy button, lazy-loaded languages and themes, and a radius
scale matching the rest of the design system.

## Basic usage

<prose-show-case>
<dnax-demo-syntax demo="basic">



</dnax-demo-syntax>

<template v-slot:code="">

```vue
<script setup lang="ts">
const tsCode = `interface User {
  id: number
  name: string
  roles: string[]
}

const formatName = (user: User): string =>
  user.name.toUpperCase()`
</script>

<template>
  <q-syntax :code="tsCode" lang="ts" filename="utils.ts" copy />
</template>
```

</template>
</prose-show-case>

The code comes from the `code` prop. `lang` selects the Shiki grammar,
`filename` shows a title bar, and `copy` adds a clipboard button.

## Languages

<prose-show-case>
<dnax-demo-syntax demo="languages">



</dnax-demo-syntax>

<template v-slot:code="">

```vue
<script setup lang="ts">
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
  <div class="demo-col">
    <q-syntax :code="vueCode" lang="vue" filename="App.vue" />
    <q-syntax :code="bashCode" lang="bash" filename="terminal" copy />
    <q-syntax :code="cssCode" lang="css" filename="main.css" />
    <q-syntax :code="jsonCode" lang="json" filename="package.json" />
  </div>
</template>
```

</template>
</prose-show-case>

Vue, TypeScript, JavaScript, HTML, CSS, SCSS, JSON, Bash, Markdown, YAML,
Python, Go, Rust and SQL ship by default. Other languages are loaded lazily and
fall back to plain text when unknown.

## Themes

<prose-show-case>
<dnax-demo-syntax demo="themes">



</dnax-demo-syntax>

<template v-slot:code="">

```vue
<script setup lang="ts">
const tsCode = `interface User {
  id: number
  name: string
  roles: string[]
}

const formatName = (user: User): string =>
  user.name.toUpperCase()`
</script>

<template>
  <div class="demo-col">
    <q-syntax :code="tsCode" lang="ts" filename="default-theme.ts" copy />
    <q-syntax :code="tsCode" lang="ts" theme="github-light" filename="light-theme.ts" copy />
  </div>
</template>
```

</template>
</prose-show-case>

The default theme is `github-dark-default`. Any Shiki theme can be passed via
`theme` — it is loaded on demand and falls back to the default if unavailable.
`radius="sm|md|lg"` (or `radius`) controls the corner rounding.

## Default slot

Instead of the `code` prop, the raw code can be placed in the default slot —
convenient for static snippets written directly in a template.

```html
<q-syntax lang="html" filename="App.vue" copy>
  <q-btn label="Hello" />
</q-syntax>
```

## API

<dnax-api name="QSyntax">



</dnax-api>
