---
title: Toolbar
description: A horizontal action bar for page headers and footers — title,
  spacer and actions.
navigation:
  icon: lucide:panel-top
seo:
  title: Toolbar (QToolbar)
  description: QToolbar — a horizontal action bar with inset and shrink modifiers.
---

The toolbar is a horizontal action bar for page headers and footers. It has a
default padding of `0 12px` and a `min-height` of 50px, aligns children with flex,
and exposes the Quasar `inset` and `shrink` modifiers.

## Basic toolbar

::prose-show-case
:dnax-demo-toolbar{demo="basic"}

#code

```vue
<q-toolbar>
  <span class="demo-title">Inbox</span>
  <q-space />
  <q-btn flat round dense icon="lucide:search" />
  <q-btn flat round dense icon="lucide:bell" />
  <q-btn flat round dense icon="lucide:menu" />
</q-toolbar>
```
::

Combine a title, `<q-space />` to push actions to the right, and `<q-btn>` for the
actions. Everything inside the default slot is laid out with an 8px gap.

## In a header

::prose-show-case
:dnax-demo-toolbar{demo="header"}

#code

```vue
<q-toolbar>
  <q-btn flat round dense icon="lucide:arrow-left" />
  <span class="demo-title">Settings</span>
  <q-space />
  <q-btn flat dense label="Save" unelevated color="primary" />
</q-toolbar>
```
::

QToolbar is designed to live inside a `<q-header>` or `<q-footer>` — those wrappers
apply the safe-area insets and optional fixed positioning.

```html
<q-header>
  <q-toolbar>
    <q-btn flat round dense icon="lucide:menu" />
    <span class="demo-title">App</span>
    <q-space />
  </q-toolbar>
</q-header>
```

## Inset & shrink

::prose-show-case
:dnax-demo-toolbar{demo="inset-shrink"}

#code

```vue
<q-toolbar inset>
  <q-btn flat round dense icon="lucide:menu" />
  <span class="demo-title">Inset — extra left padding</span>
</q-toolbar>

<q-toolbar shrink>
  <q-btn flat round dense icon="lucide:heart" />
  <span class="demo-title">Shrink — fits content</span>
</q-toolbar>
```
::

`inset` adds extra left padding (16px) — handy under a drawer. `shrink` stops the
toolbar from stretching: it only takes the width of its content.

## API

:dnax-api{name="QToolbar"}
