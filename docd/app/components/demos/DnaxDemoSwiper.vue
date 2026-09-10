<script setup lang="ts">
// Live demos for the Swiper page (QSwiper + QSwiperSlide) — per-page state.
import { ref } from "vue"

defineProps<{
  /** Identifier of the demo to render */
  demo:
    | "basic"
    | "nav"
    | "autoplay"
    | "free"
    | "keyboard"
    | "grid"
    | "effects"
    | "parallax"
    | "zoom"
    | "thumbs"
    | "controller"
    | "hash"
    | "lazy"
    | "virtual"
}>()

// — Event demo —
const currentSlide = ref(1)

// — Effects demo —
const effect = ref<"slide" | "fade" | "cube" | "flip" | "coverflow" | "cards" | "creative">(
  "coverflow",
)
const effectOptions = ["slide", "fade", "cube", "flip", "coverflow", "cards", "creative"]

// — Thumbs / controller demos —
const thumbs = ref<any>(null)
const master = ref<any>(null)

// — Demo images (Unsplash) —
const demoImages = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]
</script>

<template>
  <q-swiper
    v-if="demo === 'basic'"
    :slides-per-view="2"
    :space-between="16"
    loop
    centered-slides
  >
    <q-swiper-slide v-for="i in 8" :key="i">
      <div class="demo-slide demo-slide--img">
        <img
          class="demo-slide__img"
          :src="demoImages[i % demoImages.length]"
          :alt="'Slide ' + (i + 1)"
        />
        <span class="demo-slide__caption">Slide {{ i + 1 }}</span>
      </div>
    </q-swiper-slide>
  </q-swiper>

  <div v-else-if="demo === 'nav'">
    <q-swiper
      navigation
      :pagination="{ clickable: true }"
      @slide-change="currentSlide = $event.realIndex + 1"
    >
      <q-swiper-slide v-for="i in 5" :key="i">
        <div class="demo-slide">Slide {{ i }}</div>
      </q-swiper-slide>
    </q-swiper>
    <p class="demo-p demo-meta">Current slide: {{ currentSlide }}</p>
  </div>

  <q-swiper
    v-else-if="demo === 'autoplay'"
    :autoplay="{ delay: 1800, disableOnInteraction: false }"
    loop
  >
    <q-swiper-slide v-for="i in 5" :key="i">
      <div class="demo-slide">Autoplay {{ i }}</div>
    </q-swiper-slide>
  </q-swiper>

  <q-swiper
    v-else-if="demo === 'free'"
    free-mode
    mousewheel
    grab-cursor
    :slides-per-view="3"
    :space-between="16"
  >
    <q-swiper-slide v-for="i in 9" :key="i">
      <div class="demo-slide demo-slide--sm">Free {{ i }}</div>
    </q-swiper-slide>
  </q-swiper>

  <q-swiper
    v-else-if="demo === 'keyboard'"
    keyboard
    :scrollbar="{ draggable: true }"
    :slides-per-view="3"
    :space-between="16"
  >
    <q-swiper-slide v-for="i in 8" :key="i">
      <div class="demo-slide demo-slide--sm">KB {{ i }}</div>
    </q-swiper-slide>
  </q-swiper>

  <q-swiper
    v-else-if="demo === 'grid'"
    :slides-per-view="3"
    :space-between="16"
    :grid="{ rows: 2, fill: 'row' }"
    class="demo-swiper--grid"
  >
    <q-swiper-slide v-for="i in 8" :key="i">
      <div class="demo-slide demo-slide--sm">Grid {{ i }}</div>
    </q-swiper-slide>
  </q-swiper>

  <div v-else-if="demo === 'effects'">
    <q-select
      v-model="effect"
      :options="effectOptions"
      outlined
      dense
      label="Effect"
      class="demo-effect-select"
    />
    <q-swiper :effect="effect" class="demo-swiper--fixed">
      <q-swiper-slide v-for="(img, i) in demoImages" :key="i">
        <div class="demo-slide demo-slide--img">
          <img class="demo-slide__img" :src="img" :alt="effect" />
          <span class="demo-slide__caption">{{ effect }}</span>
        </div>
      </q-swiper-slide>
    </q-swiper>
  </div>

  <q-swiper v-else-if="demo === 'parallax'" parallax class="demo-swiper--fixed">
    <q-swiper-slide v-for="i in 4" :key="i">
      <div class="demo-parallax">
        <div class="demo-parallax__title" data-swiper-parallax="300">Slide {{ i }}</div>
        <p class="demo-parallax__text" data-swiper-parallax="200">
          Layers move at different speeds as you drag.
        </p>
      </div>
    </q-swiper-slide>
  </q-swiper>

  <q-swiper
    v-else-if="demo === 'zoom'"
    :zoom="true"
    :slides-per-view="2"
    :space-between="16"
    class="demo-swiper--fixed"
  >
    <q-swiper-slide v-for="(img, i) in demoImages" :key="i" zoom>
      <img class="demo-img" :src="img" :alt="'Zoom ' + (i + 1)" />
    </q-swiper-slide>
  </q-swiper>

  <div v-else-if="demo === 'thumbs'">
    <q-swiper :thumbs="{ swiper: thumbs }" :space-between="12" class="demo-swiper--fixed">
      <q-swiper-slide v-for="(img, i) in demoImages" :key="i">
        <div class="demo-slide demo-slide--img">
          <img class="demo-slide__img" :src="img" :alt="'Gallery ' + (i + 1)" />
        </div>
      </q-swiper-slide>
    </q-swiper>

    <q-swiper
      watch-slides-progress
      :slides-per-view="4"
      :space-between="12"
      class="demo-thumbs"
      @swiper="(s: any) => (thumbs = s)"
    >
      <q-swiper-slide v-for="(img, i) in demoImages" :key="i">
        <img class="demo-thumb__img" :src="img" :alt="'Thumb ' + (i + 1)" />
      </q-swiper-slide>
    </q-swiper>
  </div>

  <div v-else-if="demo === 'controller'">
    <q-swiper
      :slides-per-view="3"
      :space-between="12"
      @swiper="(s: any) => (master = s)"
    >
      <q-swiper-slide v-for="i in 5" :key="i">
        <div class="demo-slide demo-slide--sm">Master {{ i }}</div>
      </q-swiper-slide>
    </q-swiper>
    <q-swiper :controller="{ control: master }" :slides-per-view="3" :space-between="12">
      <q-swiper-slide v-for="i in 5" :key="i">
        <div class="demo-slide demo-slide--sm">Slave {{ i }}</div>
      </q-swiper-slide>
    </q-swiper>
  </div>

  <q-swiper v-else-if="demo === 'hash'" hash-navigation class="demo-swiper--fixed">
    <q-swiper-slide v-for="i in 4" :key="i">
      <div class="demo-slide demo-slide--tall">#slide/{{ i }}</div>
    </q-swiper-slide>
  </q-swiper>

  <q-swiper
    v-else-if="demo === 'lazy'"
    lazy-preload
    :slides-per-view="3"
    :space-between="16"
  >
    <q-swiper-slide v-for="(img, i) in demoImages" :key="i" lazy>
      <img class="demo-img" :src="img" loading="lazy" :alt="'Image ' + (i + 1)" />
    </q-swiper-slide>
  </q-swiper>

  <q-swiper
    v-else-if="demo === 'virtual'"
    virtual
    :slides-per-view="3"
    :space-between="16"
  >
    <q-swiper-slide v-for="(_, i) in 1000" :key="i" :virtual-index="i">
      <div class="demo-slide demo-slide--sm">Slide {{ i + 1 }}</div>
    </q-swiper-slide>
  </q-swiper>
</template>

<style scoped>
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
.demo-effect-select {
  max-width: 220px;
  margin-bottom: 14px;
}

/* — slides — */
.demo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 170px;
  border-radius: 14px;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  box-shadow: 0 8px 20px rgb(25 118 210 / 0.22);
}
.demo-slide--sm {
  height: 120px;
  font-size: 15px;
}
.demo-slide--tall {
  height: 100%;
  min-height: 180px;
}
.demo-slide:nth-child(3n + 2) {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  box-shadow: 0 8px 20px rgb(124 58 237 / 0.22);
}
.demo-slide:nth-child(3n) {
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  box-shadow: 0 8px 20px rgb(14 116 144 / 0.22);
}

/* — image slides — */
.demo-slide--img {
  position: relative;
  overflow: hidden;
  padding: 0;
}
.demo-slide__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.demo-slide__caption {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

/* — fixed heights (effects, grid, zoom) — */
.demo-swiper--fixed {
  height: 220px;
}
.demo-swiper--grid {
  height: 280px;
}
.demo-swiper--fixed :deep(.swiper),
.demo-swiper--grid :deep(.swiper) {
  height: 100%;
}

/* — parallax — */
.demo-parallax {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  color: #fff;
}
.demo-parallax__title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.demo-parallax__text {
  margin: 0;
  font-size: 14px;
  opacity: 0.85;
}

/* — lazy & zoom images — */
.demo-img {
  display: block;
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
}

/* — thumbs — */
.demo-thumbs {
  height: 64px;
  margin-top: 12px;
}
.demo-thumbs :deep(.swiper) {
  height: 100%;
}
.demo-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  border-radius: 10px;
  border: 2px solid transparent;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.demo-thumb__img {
  display: block;
  width: 100%;
  height: 54px;
  border-radius: 10px;
  border: 2px solid transparent;
  object-fit: cover;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.demo-thumbs :deep(.swiper-slide-thumb-active .demo-thumb),
.demo-thumbs :deep(.swiper-slide-thumb-active .demo-thumb__img) {
  border-color: var(--primary);
}
</style>
