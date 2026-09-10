# Circular Progress

> A circular progress ring — determinate, reverse or indeterminate, with an optional centered value.

A circular progress ring. **<q-circular-progress>** draws an SVG ring from
`value` over the `min`–`max` range (defaults `0`–`1`), with a configurable `size`,
`thickness` and `color`, an optional centered `show-value` label, a `reverse`
direction and an `indeterminate` spinning mode.

## Example

<prose-show-case>
<div className="demo-row">
<q-circular-progress :value="0.42" show-value="">



</q-circular-progress>


  <q-circular-progress :value="42" :max="100" color="secondary" show-value="">



</q-circular-progress>


  <q-circular-progress :value="0.3" color="positive" reverse="">



</q-circular-progress>


  <q-circular-progress indeterminate="">



</q-circular-progress>
</div>

<template v-slot:code="">

```vue
<q-circular-progress :value="0.42" show-value />
<q-circular-progress :value="42" :max="100" color="secondary" show-value />
<q-circular-progress :value="0.3" color="positive" reverse />
<q-circular-progress indeterminate />
```

</template>
</prose-show-case>

## API

<dnax-api name="QCircularProgress">



</dnax-api>
