# Breadcrumbs

> Show the current page's position in the hierarchy, with automatic separators between crumbs.

A breadcrumb shows the position of the current page in the hierarchy. The family
has two components: **<q-breadcrumbs>** (the container — it **automatically**
inserts a separator between crumbs and highlights the last one, the current page)
and **<q-breadcrumbs-el>** (one crumb: a router/native link or plain text).
Semantic rendering in the shadcn-vue style: `nav > ol > li` with
`aria-current="page"` on the current page.

## Basic

<prose-show-case>
<q-breadcrumbs>
<q-breadcrumbs-el icon="lucide:home" label="Home">



</q-breadcrumbs-el>


  <q-breadcrumbs-el label="Components">



</q-breadcrumbs-el>


  <q-breadcrumbs-el label="Breadcrumbs">



</q-breadcrumbs-el>
</q-breadcrumbs>

<template v-slot:code="">

```vue
<q-breadcrumbs>
  <q-breadcrumbs-el icon="lucide:home" label="Home" />
  <q-breadcrumbs-el label="Components" />
  <q-breadcrumbs-el label="Breadcrumbs" />
</q-breadcrumbs>
```

</template>
</prose-show-case>

The default separator is `/`. The last crumb receives the `active-color` (default
`primary`) and a heavier weight — it is the current page, usually not clickable.
The other crumbs use softened text, automatically adapted to dark mode through the
CSS tokens.

## Custom separators

<prose-show-case>
<div className="demo-stack">
<q-breadcrumbs separator="›">
<q-breadcrumbs-el icon="lucide:folder" label="Projects">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="dnax.ui">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Packages">



</q-breadcrumbs-el>
</q-breadcrumbs>


  <q-breadcrumbs separator="lucide:chevron-right" separator-color="secondary">
<q-breadcrumbs-el label="Home">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Settings">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Profile">



</q-breadcrumbs-el>
</q-breadcrumbs>
</div>

<template v-slot:code="">

```vue
<q-breadcrumbs separator="›">
  <q-breadcrumbs-el icon="lucide:folder" label="Projects" />
  <q-breadcrumbs-el label="dnax.ui" />
  <q-breadcrumbs-el label="Packages" />
</q-breadcrumbs>

<q-breadcrumbs separator="lucide:chevron-right" separator-color="secondary">
  <q-breadcrumbs-el label="Home" />
  <q-breadcrumbs-el label="Settings" />
  <q-breadcrumbs-el label="Profile" />
</q-breadcrumbs>
```

</template>
</prose-show-case>

`separator` accepts text (`"/"`, `"›"`, `"·"`…) or an Iconify icon name (e.g.
`"lucide:chevron-right"`); `separator-color` changes its color (token or hex).
Pass `separator=""` to have no separator at all.

## Links

<prose-show-case>
<div className="demo-stack">
<q-breadcrumbs separator="›">
<q-breadcrumbs-el icon="lucide:book-open" label="Docs" to="/docs">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Button" to="/docs/components/btn">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Breadcrumbs">



</q-breadcrumbs-el>
</q-breadcrumbs>


  <q-breadcrumbs separator="›">
<q-breadcrumbs-el label="Docs" href="https://llmstxt.org" target="_blank">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Disabled link" href="https://quasar.dev" disable="">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Current page">



</q-breadcrumbs-el>
</q-breadcrumbs>
</div>

<template v-slot:code="">

```vue
<q-breadcrumbs separator="›">
  <q-breadcrumbs-el icon="lucide:book-open" label="Docs" to="/docs" />
  <q-breadcrumbs-el label="Button" to="/docs/components/btn" />
  <q-breadcrumbs-el label="Breadcrumbs" />
</q-breadcrumbs>

<q-breadcrumbs separator="›">
  <q-breadcrumbs-el label="Docs" href="https://llmstxt.org" target="_blank" />
  <q-breadcrumbs-el label="Disabled link" href="https://quasar.dev" disable />
  <q-breadcrumbs-el label="Current page" />
</q-breadcrumbs>
```

</template>
</prose-show-case>

With `to`, the crumb renders a link that navigates (`router.push`, or `replace` if
requested) — hovering colors and underlines it. `href` + `target` covers native
links (`_blank` opening with automatic `rel="noopener"`). `disable` disables the
crumb.

## Colors, align & dense

<prose-show-case>
<div className="demo-stack">
<q-breadcrumbs active-color="secondary" color="#8b5cf6">
<q-breadcrumbs-el icon="lucide:home" label="Home">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Theming">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Colors">



</q-breadcrumbs-el>
</q-breadcrumbs>


  <q-breadcrumbs align="center" gutter="14px" dense="">
<q-breadcrumbs-el icon="lucide:smartphone" label="Mobile">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Design">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Dense & centered">



</q-breadcrumbs-el>
</q-breadcrumbs>


  <q-breadcrumbs align="right">
<q-breadcrumbs-el label="Git">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="Branch">



</q-breadcrumbs-el>


    <q-breadcrumbs-el label="main">



</q-breadcrumbs-el>
</q-breadcrumbs>
</div>

<template v-slot:code="">

```vue
<q-breadcrumbs active-color="secondary" color="#8b5cf6">
  <q-breadcrumbs-el icon="lucide:home" label="Home" />
  <q-breadcrumbs-el label="Theming" />
  <q-breadcrumbs-el label="Colors" />
</q-breadcrumbs>

<q-breadcrumbs align="center" gutter="14px" dense>
  <q-breadcrumbs-el icon="lucide:smartphone" label="Mobile" />
  <q-breadcrumbs-el label="Design" />
  <q-breadcrumbs-el label="Dense &amp; centered" />
</q-breadcrumbs>

<q-breadcrumbs align="right">
  <q-breadcrumbs-el label="Git" />
  <q-breadcrumbs-el label="Branch" />
  <q-breadcrumbs-el label="main" />
</q-breadcrumbs>
```

</template>
</prose-show-case>

`color` tints the intermediate crumbs, `active-color` the current page, `gutter`
sets the spacing (CSS value), `align` (left/center/right) positions the trail and
`dense` reduces the visual height.

## Change event

<prose-show-case>
<dnax-demo-breadcrumbs demo="change">



</dnax-demo-breadcrumbs>

<template v-slot:code="">

```vue
<script setup lang="ts">
const lastCrumb = ref("—")
const onChange = (index) => (lastCrumb.value = "crumb #" + (index + 1))
</script>

<template>
  <q-breadcrumbs separator="›" @change="onChange">
    <q-breadcrumbs-el icon="lucide:home" label="Home" />
    <q-breadcrumbs-el label="Design system" />
    <q-breadcrumbs-el label="Components" />
    <q-breadcrumbs-el label="Breadcrumbs" />
  </q-breadcrumbs>
  <p class="demo-meta">Clicked: <code>{{ lastCrumb }}</code></p>
</template>
```

</template>
</prose-show-case>

`@change` is emitted when the user clicks a crumb that is **not** the current page
(the last one). Payload: the (0-based) index of the clicked crumb — handy for
programmatic navigation, tracking, or reacting to a level choice. With link crumbs
(`to` / `href`) the click navigates *and* emits `change`.

## QBreadcrumbsEl — one crumb

Icon + label, or custom content through the default slot (which replaces the
label). Without `to` / `href` the crumb is a plain `<span>` — the classic case of
the current page.

```vue
<q-breadcrumbs>
  <q-breadcrumbs-el icon="lucide:home" label="Home" to="/docs" />
  <!-- label remplacé par le slot par défaut -->
  <q-breadcrumbs-el to="/docs">
    <q-avatar size="sm" color="primary" text-color="white" icon="lucide:component" class="demo-el-avatar" />
    <span>Components</span>
  </q-breadcrumbs-el>
  <q-breadcrumbs-el label="Breadcrumbs" />
</q-breadcrumbs>
```

### API

<dnax-api name="QBreadcrumbsEl">



</dnax-api>

## API — QBreadcrumbs

The container consumes the **default slot** (the crumbs). It exposes no named
slot: customize each crumb inside `<q-breadcrumbs-el>`.

<dnax-api name="QBreadcrumbs">



</dnax-api>
