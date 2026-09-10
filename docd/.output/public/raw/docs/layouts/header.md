# Header Layout

> A top bar for titles and actions — in-flow or fixed, with frosted or glass backgrounds and built-in safe-area insets.

A top bar for titles and actions. **<q-header>** sits in the page flow by
default, or pins to the top of the viewport with `fixed` — the iOS safe-area insets
(top, left, right) are applied automatically. Backgrounds: `translucent` (frosted)
or `glass` (marked glassmorphism). Always pair it with **<q-toolbar>** inside (see
the best practice below).

## Best practice — always use a toolbar

**<q-header>** is a bare bar — wrap its content in a **<q-toolbar>** to get the
standard height and padding, the `q-space` layout helper and consistent alignment.
Every header in this page follows that pattern:

```html
<q-header fixed>
  <q-toolbar>
    <q-icon name="lucide:arrow-left" color="primary" size="22px" />
    <span class="title">Page title</span>
    <q-space />
    <q-btn flat round dense icon="lucide:more-vertical" aria-label="More" />
  </q-toolbar>
</q-header>
```

See the [Toolbar](/docs/components/toolbar) page for the toolbar's own API and
options.

## Basic

In-flow header with a `q-toolbar`: brand icon, title and icon-only actions.

<prose-show-case>
<dnax-demo-header demo="basic">



</dnax-demo-header>

<template v-slot:code="">

```vue
<q-header>
  <q-toolbar>
    <q-icon name="lucide:box" color="primary" size="24px" />
    <span class="q-header__title">Dnax UI</span>
    <q-space />
    <q-btn flat dense no-caps icon="lucide:search" aria-label="Search" />
    <q-btn flat dense no-caps icon="lucide:bell" aria-label="Notifications" />
  </q-toolbar>
</q-header>
```

</template>
</prose-show-case>

## Translucent

`translucent` applies a frosted-glass background (`backdrop-filter: blur`) — pass a
number for a custom opacity (`:translucent="40"`).

<prose-show-case>
<dnax-demo-header demo="translucent">



</dnax-demo-header>

<template v-slot:code="">

```vue
<q-header translucent>
  <q-toolbar>
    <q-icon name="lucide:map" color="primary" size="22px" />
    <span class="q-header__title">Discover</span>
    <q-space />
    <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
  </q-toolbar>
</q-header>
```

</template>
</prose-show-case>

## Glassmorphism

`glass` goes further than translucent: a very translucent background with a
stronger blur + saturation and a light bottom border — the classic frosted look
over colorful content. Tune it with `--q-glass-bg` and `--q-glass-blur`.

<prose-show-case>
<dnax-demo-header demo="glass">



</dnax-demo-header>

<template v-slot:code="">

```vue
<q-header glass>
  <q-toolbar>
    <q-icon name="lucide:map" color="primary" size="22px" />
    <span class="q-header__title">Discover</span>
    <q-space />
    <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
  </q-toolbar>
</q-header>
```

</template>
</prose-show-case>

## Fixed

`fixed` pins the header to the top of the viewport (`position: fixed`), out of the
page flow — content scrolls underneath.

<prose-show-case>
<dnax-demo-header demo="fixed">



</dnax-demo-header>

<template v-slot:code="">

```vue
<q-header fixed>
  <q-toolbar>
    <q-icon name="lucide:arrow-left" color="primary" size="22px" />
    <span class="q-header__title">Details</span>
    <q-space />
    <q-btn flat dense round icon="lucide:more-vertical" aria-label="More" />
  </q-toolbar>
</q-header>
```

</template>
</prose-show-case>

## API

<dnax-api name="QHeader">



</dnax-api>
