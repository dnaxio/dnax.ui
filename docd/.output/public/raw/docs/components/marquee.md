# Marquee

> An infinite scrolling band — a text prop or a rich slot, direction, duration, gap and pause-on-hover.

An infinite scrolling band: **<q-marquee>** loops any content (a `text` prop or a
rich slot) with a seamless CSS animation — `direction` left or right, tunable
`duration` and `gap`, and optional `pause-on-hover`. Animations respect
`prefers-reduced-motion`.

## Basic

The simplest usage: a `text` scrolling to the left, looping seamlessly.

<prose-show-case>
<dnax-demo-marquee demo="basic">



</dnax-demo-marquee>

<template v-slot:code="">

```vue
<script setup lang="ts">
const NEWS = "Latest news — dnax.ui 1.0 released · New components every week · Built for Vue 3 ✨"
</script>

<template>
  <q-marquee :text="NEWS" />
</template>
```

</template>
</prose-show-case>

## Direction

`direction="right"` scrolls the other way.

<prose-show-case>
<dnax-demo-marquee demo="direction">



</dnax-demo-marquee>

<template v-slot:code="">

```vue
<script setup lang="ts">
const NEWS = "Latest news — dnax.ui 1.0 released · New components every week · Built for Vue 3 ✨"
</script>

<template>
  <q-marquee :text="NEWS" direction="right" :duration="30" />
</template>
```

</template>
</prose-show-case>

## Pause on hover

`pause-on-hover` freezes the band while the mouse is over it and resumes on leave —
handy for readable tickers.

<prose-show-case>
<dnax-demo-marquee demo="pause">



</dnax-demo-marquee>

<template v-slot:code="">

```vue
<script setup lang="ts">
const NEWS = "Latest news — dnax.ui 1.0 released · New components every week · Built for Vue 3 ✨"
</script>

<template>
  <q-marquee :text="NEWS" :pause-on-hover="true" />
  <!-- Hover the band to pause it — resume on mouse leave. -->
</template>
```

</template>
</prose-show-case>

## Speed & gap

`duration` is the time of one full cycle in seconds (lower = faster), `gap` the
space between the two copies.

<prose-show-case>
<dnax-demo-marquee demo="tune">



</dnax-demo-marquee>

<template v-slot:code="">

```vue
<script setup lang="ts">
const NEWS = "Latest news — dnax.ui 1.0 released · New components every week · Built for Vue 3 ✨"
</script>

<template>
  <q-marquee :text="NEWS" :duration="10" gap="48px" />
</template>
```

</template>
</prose-show-case>

## Rich content

The default slot accepts anything (the content is rendered twice for the seamless
loop — the second copy is hidden from screen readers).

<prose-show-case>
<dnax-demo-marquee demo="slot">



</dnax-demo-marquee>

<template v-slot:code="">

```vue
<script setup lang="ts">
const features = [
  { label: "Vue 3", icon: "lucide:zap" },
  { label: "TypeScript", icon: "lucide:braces" },
  { label: "Quasar API", icon: "lucide:rocket" },
  { label: "shadcn style", icon: "lucide:sparkles" },
]
</script>

<template>
  <q-marquee :duration="16" :pause-on-hover="true">
    <span v-for="f in features" :key="f" class="chip">
      <q-icon :name="f.icon" size="14px" /> {{ f.label }}
    </span>
  </q-marquee>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QMarquee">



</dnax-api>
