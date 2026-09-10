# Badge

> Badges are small labels for counts, states and notifications, with floating, outline and transparent variants.

Badges are small labels for counts, states or notifications. They inherit the
design tokens of the theme and support `floating` positioning on top of other
elements, `outline`, `transparent` and `multi-line` variants.

## Colors

<prose-show-case>
<div className="demo-row">
<q-badge label="Primary" color="primary">



</q-badge>


  <q-badge label="Secondary" color="secondary">



</q-badge>


  <q-badge label="Positive" color="positive">



</q-badge>


  <q-badge label="Negative" color="negative">



</q-badge>


  <q-badge label="Warning" color="warning">



</q-badge>


  <q-badge label="Info" color="info">



</q-badge>


  <q-badge label="Custom" color="#7c3aed">



</q-badge>
</div>

<template v-slot:code="">

```vue
<q-badge label="Primary" color="primary" />
<q-badge label="Secondary" color="secondary" />
<q-badge label="Positive" color="positive" />
<q-badge label="Negative" color="negative" />
<q-badge label="Warning" color="warning" />
<q-badge label="Info" color="info" />
<q-badge label="Custom" color="#7c3aed" />
```

</template>
</prose-show-case>

`color` accepts a design token or a hex value; the text color is derived
automatically for contrast and can be overridden with `text-color`.

## Variants

<prose-show-case>
<dnax-demo-badge demo="variants">



</dnax-demo-badge>

<template v-slot:code="">

```vue
<q-badge label="Outline" outline />
<q-badge label="Transparent" transparent />
<q-badge :label="42" color="negative" />

<q-badge label="A long label that wraps on two lines" multi-line class="demo-wide" />
```

</template>
</prose-show-case>

`label` accepts strings or numbers. `outline` keeps only a border, `transparent`
lowers the opacity, and `multi-line` lets long labels wrap (use it with a
constrained width).

## Floating

<prose-show-case>
<dnax-demo-badge demo="floating">



</dnax-demo-badge>

<template v-slot:code="">

```vue
<q-btn round icon="lucide:bell" color="primary">
  <q-badge floating color="negative" label="3" />
</q-btn>

<span class="badge-host">
  <q-icon name="lucide:shopping-cart" size="lg" />
  <q-badge floating color="positive" label="9" />
</span>
```

</template>
</prose-show-case>

`floating` positions the badge absolutely in the top-right corner of its parent —
the parent must be positioned (`position: relative`). `q-btn` already is; wrap
other elements in a relative container.

## Custom content

<prose-show-case>
<q-badge color="dark">
<q-icon name="lucide:star" size="sm" left="">



</q-icon>

 New

</q-badge>

<template v-slot:code="">

```vue
<q-badge color="dark">
  <q-icon name="lucide:star" size="sm" left /> New
</q-badge>
```

</template>
</prose-show-case>

The default slot overrides `label` — useful to embed an icon or any markup inside
the badge.

## API

<dnax-api name="QBadge">



</dnax-api>
