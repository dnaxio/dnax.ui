<script setup lang="ts">
// Live demos for the Carousel page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "loop" | "vertical"
}>()

// Stable object: avoids recreating the Embla options on every render
const loopOpts = { loop: true }
</script>

<template>
  <q-carousel v-if="demo === 'basic'" class="demo-carousel">
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

  <q-carousel v-else-if="demo === 'loop'" class="demo-carousel" :opts="loopOpts">
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

  <q-carousel
    v-else-if="demo === 'vertical'"
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
</template>

<style scoped>
.demo-carousel {
  width: 100%;
  max-width: 560px;
}
.demo-carousel--vertical {
  height: 280px;
}
.demo-carousel--vertical :deep(.q-carousel__viewport) {
  height: 100%;
}
.demo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  background: var(--primary, #1976d2);
}
.demo-carousel--vertical .demo-slide {
  height: 100%;
}
.demo-slide--2 {
  background: #4caf50;
}
.demo-slide--3 {
  background: #ff9800;
}
.demo-slide--4 {
  background: #9c27b0;
}
</style>
