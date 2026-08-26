---
title: Fab
description: "Floating action button with expandable actions. Parts: FabAction."
navigation:
  icon: lucide:plus
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QFab.vue
      title: Fab
    - path: ../packages/ui/components/QFabAction.vue
      title: FabAction
---

## Example

```vue
<q-fab v-model="open" color="primary" position="bottom-right">
  <q-fab-action label="New" />
  <q-fab-action label="Edit" />
</q-fab>
```

## FabAction

```vue
<q-fab-action label="New" />
```

