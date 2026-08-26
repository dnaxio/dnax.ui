---
title: Carousel
description: "Embla-based carousel — orientation, plugins. Parts: CarouselContent, CarouselItem, CarouselNav."
navigation:
  icon: lucide:images
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QCarousel.vue
      title: Carousel
    - path: ../packages/ui/components/QCarouselContent.vue
      title: CarouselContent
    - path: ../packages/ui/components/QCarouselItem.vue
      title: CarouselItem
    - path: ../packages/ui/components/QCarouselNav.vue
      title: CarouselNav
---

## Example

```vue
<q-carousel :opts="{ loop: true }">
  <q-carousel-content>
    <q-carousel-item class="basis-1/2">Slide 1</q-carousel-item>
    <q-carousel-item class="basis-1/2">Slide 2</q-carousel-item>
    <q-carousel-item class="basis-1/2">Slide 3</q-carousel-item>
  </q-carousel-content>
  <q-carousel-nav />
</q-carousel>
```

## CarouselContent

```vue
<q-carousel-content>
  <q-carousel-item>Slide 1</q-carousel-item>
</q-carousel-content>
```

## CarouselItem

```vue
<q-carousel-item>Slide</q-carousel-item>
```

## CarouselNav

```vue
<q-carousel-nav />
```

