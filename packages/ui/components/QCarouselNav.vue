<script setup lang="ts">
// QCarouselPrevious / QCarouselNext — boutons de navigation (équivalent CarouselPrevious/Next).
import { computed, inject } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { qCarouselKey } from "./QCarousel.vue"

interface Props {
  /** "prev" ou "next" */
  direction: "prev" | "next"
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
})

const carousel = inject(qCarouselKey, null)

const isVertical = computed(() => carousel?.orientation.value === "vertical")
const disabled = computed(() =>
  props.direction === "prev" ? !carousel?.canScrollPrev.value : !carousel?.canScrollNext.value,
)

const onClick = () => {
  if (props.direction === "prev") carousel?.scrollPrev()
  else carousel?.scrollNext()
}

const icon = computed(() => {
  if (props.direction === "prev") return isVertical.value ? icons.chevronUp : icons.chevronLeft
  return isVertical.value ? icons.chevronDown : icons.chevronRight
})
</script>

<template>
  <button
    type="button"
    class="q-carousel__nav"
    :class="[
      props.direction === 'prev' ? 'q-carousel__nav--prev' : 'q-carousel__nav--next',
      isVertical && 'q-carousel__nav--vertical',
      disabled && 'q-carousel__nav--disabled',
    ]"
    :disabled="disabled"
    :aria-label="label || (direction === 'prev' ? 'Slide précédente' : 'Slide suivante')"
    @click="onClick"
  >
    <Icon :icon="icon" aria-hidden="true" />
  </button>
</template>
