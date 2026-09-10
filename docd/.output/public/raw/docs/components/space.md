# Space

> A flex spacer that fills the remaining space and pushes surrounding elements apart.

`<q-space>` fills the remaining space in a flex container, pushing the elements on either side apart — the classic way to right-align a trailing action in a toolbar or a row. It renders an `aria-hidden` spacer element.

## Example

<prose-show-case>
<div className="demo-row">
<q-btn label="Back" flat="">



</q-btn>


  <q-space>



</q-space>


  <q-btn label="Save" color="primary" unelevated="">



</q-btn>
</div>

<template v-slot:code="">

```vue
<div class="demo-row">
  <q-btn label="Back" flat />
  <q-space />
  <q-btn label="Save" color="primary" unelevated />
</div>
```

</template>
</prose-show-case>

The parent must be a flex container (`.demo-row`, `<q-toolbar>`, `<q-header>`…): `q-space` grows to absorb the free space (`flex: 1 1 auto`).

## API

<dnax-api name="QSpace">



</dnax-api>
