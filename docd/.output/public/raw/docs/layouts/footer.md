# Footer Layout

> A bottom bar for actions and secondary navigation — in-flow or fixed, with frosted or glass backgrounds and built-in safe-area insets.

A bottom bar for actions and secondary navigation. **<q-footer>** sits in the
page flow by default, or pins to the viewport bottom with `fixed` — the iOS
safe-area bottom padding is built in. Backgrounds: `translucent` (frosted) or
`glass` (marked glassmorphism).

## Basic

In-flow footer with a toolbar inside: brand icon, `q-space` and flat action
buttons. `no-padding` removes the horizontal padding (content flush to the edges,
safe-area kept).

<prose-show-case>
<dnax-demo-footer demo="basic">



</dnax-demo-footer>

<template v-slot:code="">

```vue
<q-footer bordered>
  <q-icon name="lucide:box" color="primary" size="20px" />
  <span>Dnax UI</span>
  <q-space />
  <q-btn flat dense no-caps label="Help" />
  <q-btn flat dense no-caps label="Terms" />
</q-footer>
```

</template>
</prose-show-case>

## Elevated

`elevated` casts a soft shadow upward, separating the bar from the content above
it.

<prose-show-case>
<dnax-demo-footer demo="elevated">



</dnax-demo-footer>

<template v-slot:code="">

```vue
<q-footer elevated>
  <span>Elevated footer — shadow cast upward</span>
  <q-space />
  <q-btn flat dense no-caps icon="lucide:heart" aria-label="Like" />
</q-footer>
```

</template>
</prose-show-case>

## Translucent

`translucent` applies a frosted-glass background (`backdrop-filter: blur`) — pass a
number for a custom opacity (`:translucent="40"`).

<prose-show-case>
<dnax-demo-footer demo="translucent">



</dnax-demo-footer>

<template v-slot:code="">

```vue
<q-footer translucent>
  <span>Frosted glass — blur behind the bar</span>
  <q-space />
  <q-btn flat dense no-caps label="Close" />
</q-footer>

<!-- Opacité personnalisée -->
<q-footer :translucent="40">
  <span>Custom opacity (40%)</span>
</q-footer>
```

</template>
</prose-show-case>

## Glassmorphism

`glass` goes further than translucent: a very translucent background with a
stronger blur + saturation and a light top border. Tune it with `--q-glass-bg` and
`--q-glass-blur`.

<prose-show-case>
<dnax-demo-footer demo="glass">



</dnax-demo-footer>

<template v-slot:code="">

```vue
<q-footer glass>
  <span>Glassmorphism — strong blur + light border</span>
  <q-space />
  <q-btn flat dense no-caps label="Close" />
</q-footer>
```

</template>
</prose-show-case>

## Fixed

`fixed` pins the footer to the bottom of the viewport (`position: fixed`), out of
the page flow. The following `<q-page>` gets an automatic `padding-bottom` equal to
the footer height, so the content is never hidden behind the bar when scrolled to
the end — several fixed footers stack from the bottom. Combined with `reveal`, it
hides when scrolling down and reappears scrolling up.

<prose-show-case>
<dnax-demo-footer demo="fixed">



</dnax-demo-footer>

<template v-slot:code="">

```vue
<q-footer fixed bordered>
  <span>Fixed to the viewport bottom</span>
  <q-space />
  <q-btn color="primary" unelevated no-caps dense label="OK" />
</q-footer>
```

</template>
</prose-show-case>

## API

<dnax-api name="QFooter">



</dnax-api>
