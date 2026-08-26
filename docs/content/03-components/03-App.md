---
title: App
description: "Application root container."
navigation:
  icon: lucide:app-window
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QApp.vue
      title: App
---

## Example

::prose-show-case
#default
    <q-app class="not-prose rounded-sm border border-dashed p-4">
      <q-header style="background:white" class="text-sm font-semibold">Header</q-header>
      <q-page>Page content</q-page>
      <q-footer style="background:white" class="text-sm">Footer</q-footer>
    </q-app>
#code
  ```vue
  <q-app class="not-prose rounded-sm border border-dashed p-4">
    <q-header style="background:white" class="text-sm font-semibold">Header</q-header>
    <q-page>Page content</q-page>
    <q-footer style="background:white" class="text-sm">Footer</q-footer>
  </q-app>
  ```
::

