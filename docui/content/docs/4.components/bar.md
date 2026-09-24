---
title: Bar
description: A thin bar for the top of a window or app — window controls, menus
  and status, with the Quasar API.
navigation:
  icon: lucide:panel-top
seo:
  title: Bar (QBar)
  description: QBar — a thin window/app bar (controls, menus, status).
---

**`<q-bar>`** is a **thin bar** for the top of a window or an app — window
controls (Mac/Windows), menus, status… The counterpart of a toolbar but more
discreet: ideal for **Electron frameless** apps or panel headers. It carries
`role="toolbar"` by default, with configurable `dense`, `dark` and `as`.

## macOS / window style

Free content (control dots, title, actions) — push it to the right with a
flexible spacer:

::prose-show-case
<dnax-demo-bar demo="macos"></dnax-demo-bar>

#code

```vue
<q-bar class="demo-bar demo-bar--light">
  <span class="demo-dot demo-dot--red" />
  <span class="demo-dot demo-dot--yellow" />
  <span class="demo-dot demo-dot--green" />
  <span class="demo-space" />
  <b>untitled.txt</b>
</q-bar>

<q-bar dense class="demo-bar demo-bar--light">
  <b>File</b> · Edit · View · Window · Help
</q-bar>
```
::

## Dark & window controls

`dark` forces a dark background (useful outside global dark mode), ideal with a
terminal or a window title bar:

::prose-show-case
<dnax-demo-bar demo="dark"></dnax-demo-bar>

#code

```vue
<q-bar dark class="demo-bar">
  <q-icon name="lucide:terminal" size="15px" />
  <b>bash — 80×24</b>
  <span class="demo-space" />
  <span>─</span><span>□</span><span>✕</span>
</q-bar>
```
::

## Props & semantics

`as` changes the rendered tag, `role` / `label` handle accessibility (several
toolbars on one page → give each one a `label`):

::prose-show-case
<dnax-demo-bar demo="props"></dnax-demo-bar>

#code

```vue
<q-bar as="header" role="toolbar" label="App bar">
  <span class="demo-title">App</span>
</q-bar>

<!-- compact (dense) + force le sombre (dark) -->
<q-bar dense dark role="toolbar" label="Status bar">
  <span>Ready</span>
  <span class="demo-space" />
  <span>Ln 1, Col 1</span>
</q-bar>
```
::

## API

<dnax-api name="QBar"></dnax-api>
