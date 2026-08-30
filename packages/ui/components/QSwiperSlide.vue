<script setup lang="ts">
// QSwiperSlide — slide de QSwiper (wrapper de SwiperSlide) :
// <q-swiper-slide v-for="(s, i) in slides" :key="i" :virtual-index="i">
// Reçoit les props de SwiperSlide (tag, zoom, virtualIndex) + swiperRef/swiperSlideIndex
// injectés automatiquement par le Swiper parent. Le slot expose isActive/isVisible/isPrev/isNext.
import { SwiperSlide } from "swiper/vue"

// swiper/vue identifie les slides par type.name === "SwiperSlide" — le wrapper
// doit conserver ce nom pour que le parent les récupère.
defineOptions({ name: "SwiperSlide" })
</script>

<template>
  <SwiperSlide v-bind="$attrs">
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </SwiperSlide>
</template>
