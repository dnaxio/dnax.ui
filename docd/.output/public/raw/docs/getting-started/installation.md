# Installation

> Add @dnax/ui to your project and render your first component.

Add `@dnax/ui` to your project — the Nuxt module wires everything: auto-import of
the `Q*` components and the global styles (tokens, safe-area).

## Install the package

```bash [Terminal]
# bun
bun add @dnax/ui

# npm
npm install @dnax/ui

# pnpm
pnpm add @dnax/ui
```

## Register the module

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ["@dnax/ui"],
})
```

<prose-callout variant="note">

The module auto-imports every component (`<q-btn>`, `<q-dialog>`…) and injects
`styles/main.css`.

</prose-callout>

## Your first component

```vue [App.vue]
<template>
  <q-btn color="primary" label="Hello Dnax UI" />
</template>
```

<prose-show-case>
<q-btn color="primary" label="Hello Dnax UI">



</q-btn>

<template v-slot:code="">

```vue
<template>
  <q-btn color="primary" label="Hello Dnax UI" />
</template>
```

</template>
</prose-show-case>

## Without the module

In a plain Vue/Vite app, import components explicitly and add the stylesheet:

```ts [main.ts]
import { QBtn } from "@dnax/ui"
import "@dnax/ui/styles/main.css"
```

## Requirements

- Vue **3.5+**
- TypeScript **5+** (recommended)
- Nuxt **3.12+** for the module (otherwise use the manual setup above)
