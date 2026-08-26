---
title: Chip
description: "Chip — removable, outline, colors."
navigation:
  icon: lucide:tags
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QChip.vue
      title: Chip
---

## Example

::prose-show-case
#default
    <div class="flex flex-wrap items-center gap-3">
      <q-chip label="Chip" color="primary" />
      <q-chip label="Removable" color="secondary" removable />
      <q-chip label="Outline" outline />
    </div>
#code
  ```vue
  <div class="flex flex-wrap items-center gap-3">
    <q-chip label="Chip" color="primary" />
    <q-chip label="Removable" color="secondary" removable />
    <q-chip label="Outline" outline />
  </div>
  ```
::

