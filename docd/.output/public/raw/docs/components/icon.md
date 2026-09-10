# Icon

> Render any Iconify icon by name with size tokens, theme colors and inline spacing.

Icons render any Iconify icon by name — `name="lucide:star"` — with token-based
colors and size tokens or raw CSS lengths. They are used everywhere in the design
system (buttons, chips, badges, accordions…).

## Sizes

<prose-show-case>
<div className="demo-row">
<q-icon name="lucide:star" size="sm">



</q-icon>


  <q-icon name="lucide:star" size="md">



</q-icon>


  <q-icon name="lucide:star" size="lg">



</q-icon>


  <q-icon name="lucide:star" size="xl">



</q-icon>
</div>

<template v-slot:code="">

```vue
<q-icon name="lucide:star" size="sm" />
<q-icon name="lucide:star" size="md" />
<q-icon name="lucide:star" size="lg" />
<q-icon name="lucide:star" size="xl" />
```

</template>
</prose-show-case>

`size` maps the tokens `sm` (16px), `md` (24px), `lg` (32px) and `xl` (48px), or
accepts any CSS length such as `"1.5rem"`.

## Colors

<prose-show-case>
<div className="demo-row">
<q-icon name="lucide:heart" color="primary">



</q-icon>


  <q-icon name="lucide:heart" color="positive">



</q-icon>


  <q-icon name="lucide:heart" color="negative">



</q-icon>


  <q-icon name="lucide:heart" color="warning">



</q-icon>


  <q-icon name="lucide:heart" color="#7c3aed">



</q-icon>
</div>

<template v-slot:code="">

```vue
<q-icon name="lucide:heart" color="primary" />
<q-icon name="lucide:heart" color="positive" />
<q-icon name="lucide:heart" color="negative" />
<q-icon name="lucide:heart" color="warning" />
<q-icon name="lucide:heart" color="#7c3aed" />
```

</template>
</prose-show-case>

`color` accepts any design token (`primary`, `positive`, `negative`…) or a hex
value. Without a color the icon inherits the current text color.

## Custom CSS sizes

<prose-show-case>
<div className="demo-row">
<q-icon name="lucide:rocket" size="2rem">



</q-icon>


  <q-icon name="lucide:rocket" size="40px" color="info">



</q-icon>


  <q-icon name="lucide:rocket" size="lg" color="secondary">



</q-icon>
</div>

<template v-slot:code="">

```vue
<q-icon name="lucide:rocket" size="2rem" />
<q-icon name="lucide:rocket" size="40px" color="info" />
<q-icon name="lucide:rocket" size="lg" color="secondary" />
```

</template>
</prose-show-case>

## Spacing & rotation

<prose-show-case>
<dnax-demo-icon demo="spacing">



</dnax-demo-icon>

<template v-slot:code="">

```vue
<span class="demo-inline"><q-icon name="lucide:mail" left /> Inbox</span>
<span class="demo-inline">Drafts <q-icon name="lucide:chevron-right" right /></span>
<q-icon name="lucide:refresh-cw" size="lg" class="demo-spin" />
```

</template>
</prose-show-case>

`left` and `right` add inline margins for in-text usage. There is no rotation prop —
apply a CSS transform class instead (see the rotated refresh icon).

```css
/* rotation : classe CSS personnalisée */
.demo-spin {
  transform: rotate(45deg);
}
```

## API

<dnax-api name="QIcon">



</dnax-api>
