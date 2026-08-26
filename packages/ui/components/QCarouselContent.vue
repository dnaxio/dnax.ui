<script setup lang="ts">
// QCarouselContent — le viewport scrollable + la piste flex (équivalent CarouselContent).
// L'emblaRef est appliqué sur le viewport (racine de mesure Embla).
import { inject } from "vue"
import { qCarouselKey } from "./QCarousel.vue"

const carousel = inject(qCarouselKey, null)
</script>

<template>
  <div
    :ref="carousel?.emblaRef"
    class="q-carousel__viewport"
    :class="{ 'q-carousel__viewport--vertical': carousel?.orientation.value === 'vertical' }"
  >
    <div
      class="q-carousel__container"
      :class="{ 'q-carousel__container--vertical': carousel?.orientation.value === 'vertical' }"
    >
      <slot />
    </div>
  </div>
</template>
