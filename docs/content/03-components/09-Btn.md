---
title: Btn
description: "Button — flat, outline, unelevated variants, sizes, colors, radius."
navigation:
  icon: lucide:mouse-pointer-click
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QBtn.vue
      title: Btn
---

## Example

::prose-show-case
#default
    <div class="flex flex-wrap items-center gap-3">
      <q-btn color="primary" label="Primary" />
      <q-btn color="secondary" flat label="Flat" />
      <q-btn color="negative" outline label="Outline" />
      <q-btn color="accent" radius="lg" label="Rounded" />
      <q-btn color="info" unelevated label="No shadow" />
    </div>
#code
  ```vue
  <div class="flex flex-wrap items-center gap-3">
    <q-btn color="primary" label="Primary" />
    <q-btn color="secondary" flat label="Flat" />
    <q-btn color="negative" outline label="Outline" />
    <q-btn color="accent" radius="lg" label="Rounded" />
    <q-btn color="info" unelevated label="No shadow" />
  </div>
  ```
::

