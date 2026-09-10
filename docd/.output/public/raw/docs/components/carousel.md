# Carousel

> A scroll-snap carousel built on Embla — content, slides and nav buttons.

A carousel displays a collection of items side by side with scroll-snap navigation,
built on Embla. The family is made of four components: **<q-carousel>** (the
provider), **<q-carousel-content>** (the scrollable viewport and track),
**<q-carousel-item>** (one slide) and **<q-carousel-nav>** (previous/next
buttons). Pass Embla options through `opts` for looping, alignment or autoplay
plugins.

## QCarousel — provider

Owns the Embla instance and shares it with the children through `provide/inject`.
The default slot is scoped and exposes `api`, `canScrollPrev`, `canScrollNext`,
`scrollPrev`, `scrollNext`, `selectedIndex` and `scrollSnaps` — handy for custom
dots or progress.

<prose-show-case>
<dnax-demo-carousel demo="basic">



</dnax-demo-carousel>

<template v-slot:code="">

```vue
<q-carousel class="demo-carousel">
  <q-carousel-content>
    <q-carousel-item>
      <div class="demo-slide demo-slide--1">Slide 1</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--2">Slide 2</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--3">Slide 3</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--4">Slide 4</div>
    </q-carousel-item>
  </q-carousel-content>
  <q-carousel-nav direction="prev" label="Previous slide" />
  <q-carousel-nav direction="next" label="Next slide" />
</q-carousel>
```

</template>
</prose-show-case>

### Loop

<prose-show-case>
<dnax-demo-carousel demo="loop">



</dnax-demo-carousel>

<template v-slot:code="">

```vue
<script setup lang="ts">
const loopOpts = { loop: true }
</script>

<template>
  <q-carousel class="demo-carousel" :opts="loopOpts">
    <q-carousel-content>
      <q-carousel-item>
        <div class="demo-slide demo-slide--1">Slide 1</div>
      </q-carousel-item>
      <q-carousel-item>
        <div class="demo-slide demo-slide--2">Slide 2</div>
      </q-carousel-item>
      <q-carousel-item>
        <div class="demo-slide demo-slide--3">Slide 3</div>
      </q-carousel-item>
    </q-carousel-content>
    <q-carousel-nav direction="prev" label="Previous slide" />
    <q-carousel-nav direction="next" label="Next slide" />
  </q-carousel>
</template>
```

</template>
</prose-show-case>

### Vertical

<prose-show-case>
<dnax-demo-carousel demo="vertical">



</dnax-demo-carousel>

<template v-slot:code="">

```vue
<q-carousel
  class="demo-carousel demo-carousel--vertical"
  orientation="vertical"
>
  <q-carousel-content>
    <q-carousel-item>
      <div class="demo-slide demo-slide--1">Slide 1</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--2">Slide 2</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--3">Slide 3</div>
    </q-carousel-item>
  </q-carousel-content>
  <q-carousel-nav direction="prev" label="Previous slide" />
  <q-carousel-nav direction="next" label="Next slide" />
</q-carousel>
```

</template>
</prose-show-case>

### API

<dnax-api name="QCarousel">



</dnax-api>

## QCarouselContent — viewport & track

The overflow-hidden viewport plus the flex track. The Embla root is measured here,
and the orientation class is applied automatically when the parent is
`orientation="vertical"`.

```html
<q-carousel class="demo-carousel">
  <q-carousel-content>
    <q-carousel-item>
      <div class="demo-slide demo-slide--1">Slide 1</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--2">Slide 2</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--3">Slide 3</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--4">Slide 4</div>
    </q-carousel-item>
  </q-carousel-content>
  <q-carousel-nav direction="prev" label="Previous slide" />
  <q-carousel-nav direction="next" label="Next slide" />
</q-carousel>
```

### API

<dnax-api name="QCarouselContent">



</dnax-api>

## QCarouselItem — one slide

A slide, `basis-full` by default. Override the width with a class (e.g.
`basis-1/2`, `md:basis-1/3`) to show several slides at once.

```html
<q-carousel-item>
  <div class="demo-slide demo-slide--1">Full width</div>
</q-carousel-item>

<!-- size the slide via class : half, third, … -->
<q-carousel-item class="basis-1/2 md:basis-1/3">
  <div class="demo-slide demo-slide--2">50%</div>
</q-carousel-item>
```

### API

<dnax-api name="QCarouselItem">



</dnax-api>

## QCarouselNav — previous / next

The navigation buttons, positioned over the slides (`direction="prev"` left,
`direction="next"` right). They pick the correct chevron automatically for the
current orientation and disable themselves at the edges.

```html
<q-carousel-nav direction="prev" label="Previous slide" />
<q-carousel-nav direction="next" label="Next slide" />
```

### API

<dnax-api name="QCarouselNav">



</dnax-api>
