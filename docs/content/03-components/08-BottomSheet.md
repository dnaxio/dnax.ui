---
title: BottomSheet
description: "iOS-style bottom panel — drag to close, safe areas. Parts: BottomSheetHeader, BottomSheetFooter, BottomSheetTrigger."
navigation:
  icon: lucide:panel-bottom
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QBottomSheet.vue
      title: BottomSheet
    - path: ../packages/ui/components/QBottomSheetHeader.vue
      title: BottomSheetHeader
    - path: ../packages/ui/components/QBottomSheetFooter.vue
      title: BottomSheetFooter
    - path: ../packages/ui/components/QBottomSheetTrigger.vue
      title: BottomSheetTrigger
---

## Example

```vue
<q-bottom-sheet v-model="open">
  <template #trigger>
    <q-btn label="Open" />
  </template>
  <q-bottom-sheet-header title="Choose an action" description="Drag the handle down to close." />
  <q-card-content>
    <p>Panel content.</p>
  </q-card-content>
  <q-bottom-sheet-footer>
    <q-btn flat label="Close" @click="open = false" />
  </q-bottom-sheet-footer>
</q-bottom-sheet>
```

## BottomSheetHeader

```vue
<q-bottom-sheet-header title="Title" description="Description" />
```

## BottomSheetFooter

```vue
<q-bottom-sheet-footer>
  <q-btn color="primary" label="Confirm" />
</q-bottom-sheet-footer>
```

## BottomSheetTrigger

```vue
<q-bottom-sheet-trigger>
  <q-btn label="Open the panel" />
</q-bottom-sheet-trigger>
```

