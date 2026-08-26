---
title: LinearProgress
description: "Linear progress bar — stripe, indeterminate."
navigation:
  icon: lucide:chart-no-axes-column-increasing
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QLinearProgress.vue
      title: LinearProgress
---

## Example

::prose-show-case
#default
    <div class="grid gap-4">
      <q-linear-progress :value="0.7" color="primary" />
      <q-linear-progress :value="0.45" color="positive" stripe />
    </div>
#code
  ```vue
  <div class="grid gap-4">
    <q-linear-progress :value="0.7" color="primary" />
    <q-linear-progress :value="0.45" color="positive" stripe />
  </div>
  ```
::

