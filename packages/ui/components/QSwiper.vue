<script setup lang="ts">
// QSwiper — carrousel type Swiper (API swiperjs/vue) :
// <q-swiper :slides-per-view="2" :space-between="16" loop navigation :autoplay="{ delay: 2000 }" effect="fade">
// Wrapper autour de swiper/vue : TOUS les paramètres Swiper passent en props/attrs
// (slides-per-view, space-between, loop, centered-slides, navigation, pagination,
// autoplay, effect, virtual, thumbs…), les événements via @slide-change, @swiper…
// Tous les modules courants sont pré-enregistrés — remplaçables via :modules.
import { Swiper } from "swiper/vue"
import {
  A11y,
  Autoplay,
  Controller,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFade,
  EffectFlip,
  FreeMode,
  Grid,
  HashNavigation,
  History,
  Keyboard,
  Manipulation,
  Mousewheel,
  Navigation,
  Pagination,
  Parallax,
  Scrollbar,
  Thumbs,
  Virtual,
  Zoom,
} from "swiper/modules"

// Styles Swiper (core + modules)
import "swiper/css"
import "swiper/css/a11y"
import "swiper/css/autoplay"
import "swiper/css/controller"
import "swiper/css/effect-cards"
import "swiper/css/effect-coverflow"
import "swiper/css/effect-creative"
import "swiper/css/effect-cube"
import "swiper/css/effect-fade"
import "swiper/css/effect-flip"
import "swiper/css/free-mode"
import "swiper/css/grid"
import "swiper/css/hash-navigation"
import "swiper/css/history"
import "swiper/css/keyboard"
import "swiper/css/manipulation"
import "swiper/css/mousewheel"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/parallax"
import "swiper/css/scrollbar"
import "swiper/css/thumbs"
import "swiper/css/virtual"
import "swiper/css/zoom"

interface Props {
  /** Modules Swiper — défaut : tous les modules courants (navigation, pagination,
   * autoplay, effets, virtual, thumbs…). Passez un tableau custom pour réduire le bundle. */
  modules?: unknown[]
}

const props = withDefaults(defineProps<Props>(), {
  modules: () => [
    A11y,
    Autoplay,
    Controller,
    EffectCards,
    EffectCoverflow,
    EffectCreative,
    EffectCube,
    EffectFade,
    EffectFlip,
    FreeMode,
    Grid,
    HashNavigation,
    History,
    Keyboard,
    Manipulation,
    Mousewheel,
    Navigation,
    Pagination,
    Parallax,
    Scrollbar,
    Thumbs,
    Virtual,
    Zoom,
  ],
})
</script>

<template>
  <div class="q-swiper">
    <Swiper v-bind="$attrs" :modules="modules">
      <slot />
    </Swiper>
  </div>
</template>
