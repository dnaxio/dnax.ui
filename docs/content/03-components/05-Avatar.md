---
title: Avatar
description: "Avatar — image, icon or initials."
navigation:
  icon: lucide:user-round
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QAvatar.vue
      title: Avatar
---

## Example

::prose-show-case
#default
    <div class="flex items-center gap-4">
      <q-avatar src="https://i.pravatar.cc/96" alt="Avatar" />
      <q-avatar color="primary" text-color="white" :size="40">JD</q-avatar>
    </div>
#code
  ```vue
  <div class="flex items-center gap-4">
    <q-avatar src="https://i.pravatar.cc/96" alt="Avatar" />
    <q-avatar color="primary" text-color="white" :size="40">JD</q-avatar>
  </div>
  ```
::

