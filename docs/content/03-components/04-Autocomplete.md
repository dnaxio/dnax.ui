---
title: Autocomplete
description: "Combobox with client or server filtering (@filter)."
navigation:
  icon: lucide:search
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QAutocomplete.vue
      title: Autocomplete
---

## Example

::prose-show-case
#default
    <q-autocomplete
      :options="[{ label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }, { label: 'Blue', value: 'blue' }]"
      label="Color"
      outlined
      stack-label
    />
#code
  ```vue
  <q-autocomplete
    :options="[{ label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }, { label: 'Blue', value: 'blue' }]"
    label="Color"
    outlined
    stack-label
  />
  ```
::

