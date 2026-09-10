# Container

> A centered max-width wrapper with configurable padding or fluid mode, plus decorative grid, star, wave, aurora and image backgrounds.

A centered, max-width wrapper: **<q-container>** keeps content readable on wide
screens (`max-width`, default 1200px), with a configurable `padding` or full-width
`fluid` mode. The optional `background-effect` adds a decorative backdrop — a
fading `grid` of squares, a `star` grid, `falling-stars`, a `flickering-grid`, an
`interactive-grid`, gliding `wave`s or a drifting `aurora`.

## Basic

`max-width`, `padding` and `fluid` control the box — the slot holds anything.

<prose-show-case>
<dnax-demo-container demo="basic">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container>
  <p>Max-width 1200px by default, 16px horizontal padding.</p>
</q-container>

<q-container max-width="640px" padding="24px">
  <p>A narrower, roomier container.</p>
</q-container>

<q-container fluid>
  <p>Fluid: full width, padding kept.</p>
</q-container>
```

</template>
</prose-show-case>

## Grid background

`background-effect="grid"` draws a square grid that fades towards the edges — set
the line color with `grid-color` and the spacing between lines with `grid-spacing`
(any CSS size).

<prose-show-case>
<dnax-demo-container demo="grid">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container
  background-effect="grid"
  grid-color="rgba(25, 118, 210, 0.3)"
  grid-spacing="48px"
  class="demo-surface"
>
  <h3 class="demo-title">Grid background</h3>
  <p class="demo-text">
    A square grid that fades out towards the edges — the line color and
    spacing come from <code>grid-color</code> / <code>grid-spacing</code>.
  </p>
</q-container>
```

</template>
</prose-show-case>

## Star grid

`background-effect="star"` draws a starfield: small dots on a grid with larger
twinkling stars, fading towards the edges. Tune the color with `star-color`, the
spacing with `star-spacing` and the dot size with `star-dot-size` — perfect over
dark surfaces. Animations respect `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-container demo="star">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container
  background-effect="star"
  star-color="#f5d76e"
  star-spacing="36px"
  star-dot-size="2px"
  class="demo-surface demo-surface--dark"
>
  <h3 class="demo-title">Star grid</h3>
  <p class="demo-text">
    A starfield of dots that fades towards the edges — the color, spacing and
    dot size come from <code>star-color</code> / <code>star-spacing</code> /
    <code>star-dot-size</code>.
  </p>
</q-container>
```

</template>
</prose-show-case>

## Falling stars

`background-effect="falling-stars"` drops diagonal streaks with a fading trail in
a seamless loop — perfect over dark surfaces. The trail color comes from
`star-color`. Animations respect `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-container demo="falling">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container
  background-effect="falling-stars"
  star-color="#f5d76e"
  class="demo-surface demo-surface--dark"
>
  <h3 class="demo-title">Falling stars</h3>
  <p class="demo-text">
    Diagonal streaks with a fading trail that fall in a seamless loop —
    colored with <code>star-color</code>.
  </p>
</q-container>
```

</template>
</prose-show-case>

## Flickering grid

`background-effect="flickering-grid"` draws a grid of small squares where some
cells flicker like faulty neon. The square color comes from `grid-color`, the
spacing from `grid-spacing`. Animations respect `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-container demo="flicker">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container
  background-effect="flickering-grid"
  grid-color="#7dd3fc"
  class="demo-surface demo-surface--dark"
>
  <h3 class="demo-title">Flickering grid</h3>
  <p class="demo-text">
    A grid of small squares where some cells flicker like faulty neon —
    colored with <code>grid-color</code>, spaced with <code>grid-spacing</code>.
  </p>
</q-container>
```

</template>
</prose-show-case>

## Interactive grid

`background-effect="interactive-grid"` dims the grid and lights the cells back up
in a circle around the mouse cursor. The square color comes from `grid-color`, the
spacing from `grid-spacing`.

<prose-show-case>
<dnax-demo-container demo="interactive">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container
  background-effect="interactive-grid"
  grid-color="#7dd3fc"
  class="demo-surface demo-surface--dark"
>
  <h3 class="demo-title">Interactive grid</h3>
  <p class="demo-text">
    Move the mouse over the surface — the cells light up around the cursor.
    Colored with <code>grid-color</code>, spaced with <code>grid-spacing</code>.
  </p>
</q-container>
```

</template>
</prose-show-case>

## Wave

`background-effect="wave"` layers two waves that glide seamlessly along the bottom
edge. Tune the colors with `wave-color` (first) and `wave-color-2` (second).
Animations respect `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-container demo="wave">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container background-effect="wave" class="demo-surface">
  <h3 class="demo-title">Wave background</h3>
  <p class="demo-text">
    Two layered waves that glide seamlessly along the bottom edge —
    colored with <code>wave-color</code> / <code>wave-color-2</code>.
  </p>
</q-container>
```

</template>
</prose-show-case>

## Aurora background

`background-effect="aurora"` adds soft glowing halos that drift slowly behind the
content. Tune the gradients with `aurora-color` (first halo) and `aurora-color-2`
(second). Animations respect `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-container demo="aurora">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container
  background-effect="aurora"
  aurora-color="#f472b6"
  aurora-color-2="#fb923c"
  class="demo-surface"
>
  <h3 class="demo-title">Aurora background</h3>
  <p class="demo-text">
    Soft glowing halos that drift slowly behind the content — the gradient
    colors come from <code>aurora-color</code> / <code>aurora-color-2</code>.
  </p>
</q-container>
```

</template>
</prose-show-case>

## Glass

`glass` turns the container into a frosted panel: a translucent background with a
`backdrop-filter` blur of whatever sits behind it, a light border and a soft
shadow. Respects dark mode.

<prose-show-case>
<dnax-demo-container demo="glass">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container glass class="demo-surface">
  <h3 class="demo-title">Glass container</h3>
  <p class="demo-text">
    A translucent frosted panel — whatever sits behind it blurs through
    (backdrop-filter).
  </p>
</q-container>
```

</template>
</prose-show-case>

## Image background

`background-image` renders a URL as a full-bleed layer behind the content.
`background-image-size` controls the box — `cover` (default), `contain`, or a CSS
size (`"50%"`, `"400px"` → centered box). Combined with `glass` the image is
**glassmorphized** (blurred + saturated) — and `background-animated` drifts it
with a slow, indeterminate Ken Burns motion: `background-animation-direction`
picks the loop behavior (`alternate` default, `alternate-reverse`, `normal`
restart, `reverse`) and `background-animation-duration` the speed (default 24s).
Animations respect `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-container demo="image">



</dnax-demo-container>

<template v-slot:code="">

```vue
<q-container
  glass
  background-animated
  :background-image-size="imgSize"
  :background-animation-direction="imgDir"
  background-image="https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  class="demo-surface"
>
  <h3 class="demo-title">Glass over a moving image</h3>
  <p class="demo-text">
    The background image is glassmorphized (blurred + saturated) and drifts
    with a slow, indeterminate Ken Burns motion.
  </p>
</q-container>
```

</template>
</prose-show-case>

## API

<dnax-api name="QContainer">



</dnax-api>
