---
title: Sidebar
description: "Side panel — side, overlay, breakpoint, v-model. Parts: SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger."
navigation:
  icon: lucide:panel-left
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QSidebar.vue
      title: Sidebar
    - path: ../packages/ui/components/QSidebarContent.vue
      title: SidebarContent
    - path: ../packages/ui/components/QSidebarFooter.vue
      title: SidebarFooter
    - path: ../packages/ui/components/QSidebarHeader.vue
      title: SidebarHeader
    - path: ../packages/ui/components/QSidebarMenu.vue
      title: SidebarMenu
    - path: ../packages/ui/components/QSidebarMenuButton.vue
      title: SidebarMenuButton
    - path: ../packages/ui/components/QSidebarMenuItem.vue
      title: SidebarMenuItem
    - path: ../packages/ui/components/QSidebarTrigger.vue
      title: SidebarTrigger
---

## Example

```vue
<q-sidebar v-model="open" side="left">
  <q-sidebar-header>
    <span class="font-semibold">My app</span>
  </q-sidebar-header>
  <q-sidebar-content>
    <q-sidebar-menu>
      <q-sidebar-menu-item>
        <q-sidebar-menu-button>Home</q-sidebar-menu-button>
      </q-sidebar-menu-item>
      <q-sidebar-menu-item>
        <q-sidebar-menu-button>Settings</q-sidebar-menu-button>
      </q-sidebar-menu-item>
    </q-sidebar-menu>
  </q-sidebar-content>
  <q-sidebar-footer>
    <span class="text-sm">Profile</span>
  </q-sidebar-footer>
</q-sidebar>
```

## SidebarContent

```vue
<q-sidebar-content>
  <q-sidebar-menu>…</q-sidebar-menu>
</q-sidebar-content>
```

## SidebarFooter

```vue
<q-sidebar-footer>Bottom area</q-sidebar-footer>
```

## SidebarHeader

```vue
<q-sidebar-header>Top area</q-sidebar-header>
```

## SidebarMenu

```vue
<q-sidebar-menu>
  <q-sidebar-menu-item>
    <q-sidebar-menu-button>Item</q-sidebar-menu-button>
  </q-sidebar-menu-item>
</q-sidebar-menu>
```

## SidebarMenuButton

```vue
<q-sidebar-menu-button>Home</q-sidebar-menu-button>
```

## SidebarMenuItem

```vue
<q-sidebar-menu-item>
  <q-sidebar-menu-button>Item</q-sidebar-menu-button>
</q-sidebar-menu-item>
```

## SidebarTrigger

```vue
<q-sidebar-trigger />
```

