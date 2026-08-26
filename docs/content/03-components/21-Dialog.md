---
title: Dialog
description: "Modal — positions, transitions, maximized, persistent. Parts: DialogHeader, DialogFooter, DialogTrigger."
navigation:
  icon: lucide:square-dashed-mouse-pointer
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QDialog.vue
      title: Dialog
    - path: ../packages/ui/components/QDialogHeader.vue
      title: DialogHeader
    - path: ../packages/ui/components/QDialogFooter.vue
      title: DialogFooter
    - path: ../packages/ui/components/QDialogTrigger.vue
      title: DialogTrigger
---

## Example

```vue
<q-dialog v-model="open" transition="zoom">
  <q-dialog-header title="Title" description="Dialog description." />
  <q-card-content>
    <p>Modal content.</p>
  </q-card-content>
  <q-dialog-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="OK" @click="open = false" />
  </q-dialog-footer>
</q-dialog>
```

## DialogHeader

```vue
<q-dialog-header title="Title" description="Description" />
```

## DialogFooter

```vue
<q-dialog-footer>
  <q-btn color="primary" label="Confirm" />
</q-dialog-footer>
```

## DialogTrigger

```vue
<q-dialog-trigger>
  <q-btn label="Open" />
</q-dialog-trigger>
```

