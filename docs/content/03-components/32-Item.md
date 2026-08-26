---
title: Item
description: "List row — clickable, active. Parts: ItemSection."
navigation:
  icon: lucide:rows-3
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QItem.vue
      title: Item
    - path: ../packages/ui/components/QItemSection.vue
      title: ItemSection
---

## Example

::prose-show-case
#default
    <q-list bordered class="max-w-sm">
      <q-item clickable><q-item-section>Clickable item</q-item-section></q-item>
      <q-item active><q-item-section>Active item</q-item-section></q-item>
    </q-list>
#code
  ```vue
  <q-list bordered class="max-w-sm">
    <q-item clickable><q-item-section>Clickable item</q-item-section></q-item>
    <q-item active><q-item-section>Active item</q-item-section></q-item>
  </q-list>
  ```
::

## ItemSection

::prose-show-case
#default
    <q-list class="max-w-sm">
      <q-item>
        <q-item-section avatar><q-avatar color="primary" text-color="white">A</q-avatar></q-item-section>
        <q-item-section>Title</q-item-section>
        <q-item-section side>12:00</q-item-section>
      </q-item>
    </q-list>
#code
  ```vue
  <q-list class="max-w-sm">
    <q-item>
      <q-item-section avatar><q-avatar color="primary" text-color="white">A</q-avatar></q-item-section>
      <q-item-section>Title</q-item-section>
      <q-item-section side>12:00</q-item-section>
    </q-item>
  </q-list>
  ```
::

