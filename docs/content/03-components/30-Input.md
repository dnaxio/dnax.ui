---
title: Input
description: "Text field — outlined, filled, borderless, clearable, counter, error."
navigation:
  icon: lucide:type
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QInput.vue
      title: Input
---

## Example

::prose-show-case
#default
    <div class="grid gap-4">
      <q-input label="Email" outlined stack-label placeholder="you@example.com" />
      <q-input label="Search" filled dense stack-label />
    </div>
#code
  ```vue
  <div class="grid gap-4">
    <q-input label="Email" outlined stack-label placeholder="you@example.com" />
    <q-input label="Search" filled dense stack-label />
  </div>
  ```
::

