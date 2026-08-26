---
title: Card
description: "Card container — elevated, bordered, dark, radius. Parts: CardContent, CardActions."
navigation:
  icon: lucide:credit-card
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QCard.vue
      title: Card
    - path: ../packages/ui/components/QCardContent.vue
      title: CardContent
    - path: ../packages/ui/components/QCardActions.vue
      title: CardActions
---

## Example

::prose-show-case
#default
    <q-card class="max-w-sm" radius="md">
      <q-card-content>
        <p class="m-0 font-semibold">Card</p>
        <p class="m-0 text-sm opacity-70">Card content with rounded corners.</p>
      </q-card-content>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" />
        <q-btn color="primary" label="OK" />
      </q-card-actions>
    </q-card>
#code
  ```vue
  <q-card class="max-w-sm" radius="md">
    <q-card-content>
      <p class="m-0 font-semibold">Card</p>
      <p class="m-0 text-sm opacity-70">Card content with rounded corners.</p>
    </q-card-content>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" />
      <q-btn color="primary" label="OK" />
    </q-card-actions>
  </q-card>
  ```
::

## CardContent

::prose-show-case
#default
    <q-card><q-card-content>Simple content</q-card-content></q-card>
#code
  ```vue
  <q-card><q-card-content>Simple content</q-card-content></q-card>
  ```
::

## CardActions

::prose-show-case
#default
    <q-card><q-card-content>Aligned actions</q-card-content><q-card-actions align="right"><q-btn color="primary" label="OK" /></q-card-actions></q-card>
#code
  ```vue
  <q-card><q-card-content>Aligned actions</q-card-content><q-card-actions align="right"><q-btn color="primary" label="OK" /></q-card-actions></q-card>
  ```
::

