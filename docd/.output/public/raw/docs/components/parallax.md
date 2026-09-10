# Parallax

> A background image that scrolls slower than the page, with a speed factor, content overlay and scroll-container tracking.

A background image that scrolls **slower than the page**, creating depth.
**<q-parallax>** tracks the window scroll — or the nearest scrollable container —
and always keeps the image covering its box. Overlay any content with the default
slot.

## Basic

Set an image with `src` and a block `height`, then scroll the page to see the effect.

<prose-show-case>
<dnax-demo-parallax demo="basic">



</dnax-demo-parallax>

<template v-slot:code="">

```vue
<q-parallax :src="image" :height="300">
  <h3 class="title">Dnax UI</h3>
  <p class="subtitle">Scroll the page — the background moves slower.</p>
</q-parallax>
```

</template>
</prose-show-case>

## Speed

`speed` (0.1–1, default 1) tunes how much the image drifts.

<prose-show-case>
<dnax-demo-parallax demo="speed">



</dnax-demo-parallax>

<template v-slot:code="">

```vue
<q-parallax :src="image" :height="220" :speed="0.4">
  <p class="caption">speed = 0.4 — a subtle drift</p>
</q-parallax>
```

</template>
</prose-show-case>

## Content overlay

The slot is centered over the image — anything goes (badges, text, buttons…).

<prose-show-case>
<dnax-demo-parallax demo="content">



</dnax-demo-parallax>

<template v-slot:code="">

```vue
<q-parallax :src="image" :height="240">
  <q-badge color="primary" label="✦ Parallax content" class="badge" />
</q-parallax>
```

</template>
</prose-show-case>

## Inside a scroll container

When the parallax lives in a scrollable box, it automatically tracks that container
instead of the page.

<prose-show-case>
<dnax-demo-parallax demo="container">



</dnax-demo-parallax>

<template v-slot:code="">

```vue
<div class="scroll">
  <p>Scroll inside this box — the parallax tracks its container.</p>
  <q-parallax :src="image" :height="180" />
  <p>More content below… and the image still moves.</p>
</div>
```

</template>
</prose-show-case>

## API

<dnax-api name="QParallax">



</dnax-api>
