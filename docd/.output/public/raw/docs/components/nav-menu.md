# Nav Menu

> A top navigation bar with hover/click dropdown menus, icons, custom triggers and accessible keyboard navigation.

A top navigation bar with dropdown menus, modeled on shadcn-vue's NavigationMenu.
The family comprises four components: **<q-nav-menu>** (the bar),
**<q-nav-menu-trigger>** (the dropdown button), **<q-nav-menu-content>** (the
dropdown panel) and **<q-nav-menu-item>** (a link or button). The dropdowns open on
hover or click and close on outside click or `Escape`; arrow keys navigate the items.

## QNavMenu — the bar

A `<nav>` that provides the context (which trigger is open, trigger registration) to
its children. Dropdowns close on outside click; arrow keys / `Home` / `End` move the
focus, `Escape` closes.

### Dropdowns

<prose-show-case>
<dnax-demo-nav-menu demo="dropdowns">



</dnax-demo-nav-menu>

<template v-slot:code="">

```vue
<q-nav-menu>
  <q-nav-menu-trigger name="products" label="Products" icon="lucide:package">
    <q-nav-menu-content>
      <q-nav-menu-item label="Overview" />
      <q-nav-menu-item label="Pricing" />
      <q-nav-menu-item label="Changelog" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>

  <q-nav-menu-trigger name="resources" label="Resources" icon="lucide:book-open">
    <q-nav-menu-content>
      <q-nav-menu-item label="Documentation" />
      <q-nav-menu-item label="Blog" />
      <q-nav-menu-item label="Community" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>

  <q-nav-menu-item label="Contact" />
  <q-nav-menu-item label="GitHub" icon="lucide:github" />
</q-nav-menu>
```

</template>
</prose-show-case>

### Icons & custom trigger

<prose-show-case>
<dnax-demo-nav-menu demo="custom">



</dnax-demo-nav-menu>

<template v-slot:code="">

```vue
<q-nav-menu>
  <q-nav-menu-trigger name="account" label="Account" icon="lucide:user">
    <q-nav-menu-content>
      <q-nav-menu-item label="Profile" icon="lucide:user-round" />
      <q-nav-menu-item label="Settings" icon="lucide:settings" active />
      <q-nav-menu-item label="Log out" icon="lucide:log-out" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>

  <q-nav-menu-trigger name="help">
    <template #trigger>
      <q-icon name="lucide:circle-help" />
      <span>Need help?</span>
    </template>
    <q-nav-menu-content>
      <q-nav-menu-item label="Documentation" />
      <q-nav-menu-item label="Report an issue" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>
</q-nav-menu>
```

</template>
</prose-show-case>

### API

<dnax-api name="QNavMenu">



</dnax-api>

## QNavMenuTrigger — the dropdown button

A button that opens its dropdown panel (the default slot) on hover or click, with a
rotating chevron. The `name` identifies the trigger (auto-generated if absent) and the
`trigger` slot replaces the button content.

```html
<q-nav-menu-trigger name="resources" label="Resources">
  <q-nav-menu-content>
    <q-nav-menu-item label="Blog" />
    <q-nav-menu-item label="Community" />
  </q-nav-menu-content>
</q-nav-menu-trigger>
```

### API

<dnax-api name="QNavMenuTrigger">



</dnax-api>

## QNavMenuContent — the dropdown panel

The floating panel positioned under the trigger — place it in the default slot of a
**<q-nav-menu-trigger>**. A white card with border, shadow and rounded corners,
listing **<q-nav-menu-item>** children.

```html
<q-nav-menu-trigger name="products" label="Products">
  <q-nav-menu-content>
    <q-nav-menu-item label="Overview" />
    <q-nav-menu-item label="Pricing" />
  </q-nav-menu-content>
</q-nav-menu-trigger>
```

### API

<dnax-api name="QNavMenuContent">



</dnax-api>

## QNavMenuItem — the link

Renders a `<button>`, or a native `<a>` when `href` is set. Accepts an Iconify `icon`
and an `active` state (`aria-current="page"` + primary color); clicking it closes any
open dropdown.

```html
<q-nav-menu-item label="Docs" icon="lucide:book-open" href="/docs" active />
<q-nav-menu-item label="GitHub" icon="lucide:github" href="https://github.com" />
```

### API

<dnax-api name="QNavMenuItem">



</dnax-api>
