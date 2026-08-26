---
title: CircularProgress
description: "Circular progress ring — show-value, indeterminate."
navigation:
  icon: lucide:loader-circle
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QCircularProgress.vue
      title: CircularProgress
---

## Example

::prose-show-case
#default
    <div class="flex items-center gap-6">
      <q-circular-progress :value="0.7" size="56px" color="primary" show-value />
      <q-circular-progress :value="0.45" size="56px" color="warning" />
    </div>
#code
  ```vue
  <div class="flex items-center gap-6">
    <q-circular-progress :value="0.7" size="56px" color="primary" show-value />
    <q-circular-progress :value="0.45" size="56px" color="warning" />
  </div>
  ```
::

