<script setup lang="ts">
// QCarouselItem — slide du carrousel (équivalent CarouselItem).
// basis-full par défaut ; passer une classe (basis-1/2, md:basis-1/3…) pour la taille.
import { computed } from "vue"
import { cn } from "../lib/utils"

interface Props {
  class?: string
}

const props = defineProps<Props>()

const classes = computed(() => cn("q-carousel__item", props.class))
</script>

<template>
  <div class="q-carousel__item" :class="classes">
    <slot />
  </div>
</template>
