# Button Group

> Fuse several buttons into one visual unit — fused borders, radius on the outer corners only.

Groups **<q-btn>** into a single visual unit: borders are fused between siblings
and the radius is applied only to the outer corners. Useful for toolbars, toggles
and segmented controls.

## Icon-only buttons

A classic toolbar pattern — three icon buttons welded together with `unelevated`.

<prose-show-case>
<div className="demo-row">
<q-btn-group unelevated="">
<q-btn icon="lucide:bold" ariaLabel="Bold">



</q-btn>


    <q-btn icon="lucide:italic" ariaLabel="Italic">



</q-btn>


    <q-btn icon="lucide:underline" ariaLabel="Underline">



</q-btn>
</q-btn-group>
</div>

<template v-slot:code="">

```vue
<q-btn-group unelevated>
  <q-btn icon="lucide:bold" aria-label="Bold" />
  <q-btn icon="lucide:italic" aria-label="Italic" />
  <q-btn icon="lucide:underline" aria-label="Underline" />
</q-btn-group>
```

</template>
</prose-show-case>

## With labels

Each button keeps its own props — color, `flat` or `icon` mix freely inside the
group.

<prose-show-case>
<div className="demo-row">
<q-btn-group unelevated="">
<q-btn label="Save" icon="lucide:save">



</q-btn>


    <q-btn label="Cancel" flat="">



</q-btn>


    <q-btn label="Delete" icon="lucide:trash-2" color="negative">



</q-btn>
</q-btn-group>
</div>

<template v-slot:code="">

```vue
<q-btn-group unelevated>
  <q-btn label="Save" icon="lucide:save" />
  <q-btn label="Cancel" flat />
  <q-btn label="Delete" icon="lucide:trash-2" color="negative" />
</q-btn-group>
```

</template>
</prose-show-case>

## Outline

The `outline` prop draws a single contour around the whole group — a segmented
control look.

<prose-show-case>
<div className="demo-row">
<q-btn-group outline="">
<q-btn label="Day">



</q-btn>


    <q-btn label="Week">



</q-btn>


    <q-btn label="Month">



</q-btn>
</q-btn-group>
</div>

<template v-slot:code="">

```vue
<q-btn-group outline>
  <q-btn label="Day" />
  <q-btn label="Week" />
  <q-btn label="Month" />
</q-btn-group>
```

</template>
</prose-show-case>

## Stretch

`stretch` widens the group to `100%` of its container and makes every button share
that width — great for split actions.

<prose-show-case>
<div className="demo-col">
<q-btn-group unelevated="" stretch="">
<q-btn label="Accept" color="positive">



</q-btn>


    <q-btn label="Decline" color="negative">



</q-btn>
</q-btn-group>
</div>

<template v-slot:code="">

```vue
<q-btn-group unelevated stretch>
  <q-btn label="Accept" color="positive" />
  <q-btn label="Decline" color="negative" />
</q-btn-group>
```

</template>
</prose-show-case>

## API

<dnax-api name="QBtnGroup">



</dnax-api>
