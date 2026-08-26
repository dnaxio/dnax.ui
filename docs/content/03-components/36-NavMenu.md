---
title: NavMenu
description: "Navigation bar with dropdown menus. Parts: NavMenuContent, NavMenuItem, NavMenuTrigger."
navigation:
  icon: lucide:menu
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QNavMenu.vue
      title: NavMenu
    - path: ../packages/ui/components/QNavMenuContent.vue
      title: NavMenuContent
    - path: ../packages/ui/components/QNavMenuItem.vue
      title: NavMenuItem
    - path: ../packages/ui/components/QNavMenuTrigger.vue
      title: NavMenuTrigger
---

## Example

```vue
<q-nav-menu>
  <q-nav-menu-item href="/docs">
    <q-nav-menu-trigger>Documentation</q-nav-menu-trigger>
    <q-nav-menu-content>
      <q-nav-menu-item href="/docs/getting-started">Getting started</q-nav-menu-item>
    </q-nav-menu-content>
  </q-nav-menu-item>
</q-nav-menu>
```

## NavMenuContent

```vue
<q-nav-menu-content>
  <q-nav-menu-item href="/docs">Sub link</q-nav-menu-item>
</q-nav-menu-content>
```

## NavMenuItem

```vue
<q-nav-menu-item href="/docs">Link</q-nav-menu-item>
```

## NavMenuTrigger

```vue
<q-nav-menu-trigger>Menu</q-nav-menu-trigger>
```

