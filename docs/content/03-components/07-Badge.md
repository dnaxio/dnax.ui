---
title: Badge
description: "Badge / counter / status label."
navigation:
  icon: lucide:badge-check
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QBadge.vue
      title: Badge
---

## Example

::prose-show-case
#default
    <div class="flex flex-wrap items-center gap-3">
      <q-badge label="3" color="negative" />
      <q-badge label="New" color="primary" />
      <q-badge label="Draft" color="grey" outline />
    </div>
#code
  ```vue
  <div class="flex flex-wrap items-center gap-3">
    <q-badge label="3" color="negative" />
    <q-badge label="New" color="primary" />
    <q-badge label="Draft" color="grey" outline />
  </div>
  ```
::

