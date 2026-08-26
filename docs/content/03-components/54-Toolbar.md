---
title: Toolbar
description: "Horizontal action bar."
navigation:
  icon: lucide:rectangle-horizontal
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QToolbar.vue
      title: Toolbar
---

## Example

::prose-show-case
#default
    <q-toolbar class="not-prose rounded-sm border border-dashed px-3 text-sm font-semibold">
      <q-btn flat dense label="Back" />
      <q-space />
      <q-btn color="primary" dense label="Action" />
    </q-toolbar>
#code
  ```vue
  <q-toolbar class="not-prose rounded-sm border border-dashed px-3 text-sm font-semibold">
    <q-btn flat dense label="Back" />
    <q-space />
    <q-btn color="primary" dense label="Action" />
  </q-toolbar>
  ```
::

