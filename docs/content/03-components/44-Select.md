---
title: Select
description: "Single or multiple selection — client (fuse.js) or server search, chips, inline/modal/sheet/dialog modes."
navigation:
  icon: lucide:chevrons-up-down
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QSelect.vue
      title: Select
---

## Example

::prose-show-case
#default
    <q-select
      :options="[{ label: 'Apple', value: 'apple' }, { label: 'Pear', value: 'pear' }, { label: 'Banana', value: 'banana' }]"
      label="Fruit"
      outlined
      stack-label
    />
#code
  ```vue
  <q-select
    :options="[{ label: 'Apple', value: 'apple' }, { label: 'Pear', value: 'pear' }, { label: 'Banana', value: 'banana' }]"
    label="Fruit"
    outlined
    stack-label
  />
  ```
::

