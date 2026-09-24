---
title: Circular Progress
description: A circular progress ring — determinate, reverse or indeterminate,
  with an optional centered value.
navigation:
  icon: lucide:loader-circle
seo:
  title: Circular Progress (QCircularProgress)
  description: QCircularProgress — a ring progress indicator with the Quasar API.
---

A circular progress ring. **`<q-circular-progress>`** draws an SVG ring from
`value` over the `min`–`max` range (defaults `0`–`1`), with a configurable `size`,
`thickness` and `color`, an optional centered `show-value` label, a `reverse`
direction and an `indeterminate` spinning mode.

## Example

::prose-show-case
<div class="demo-row">
  <q-circular-progress :value="0.42" show-value></q-circular-progress>
  <q-circular-progress :value="42" :max="100" color="secondary" show-value></q-circular-progress>
  <q-circular-progress :value="0.3" color="positive" reverse></q-circular-progress>
  <q-circular-progress indeterminate></q-circular-progress>
</div>

#code

```vue
<q-circular-progress :value="0.42" show-value />
<q-circular-progress :value="42" :max="100" color="secondary" show-value />
<q-circular-progress :value="0.3" color="positive" reverse />
<q-circular-progress indeterminate />
```
::

## API

<dnax-api name="QCircularProgress"></dnax-api>
