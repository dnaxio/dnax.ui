<script lang="ts">
// QCarousel — carrousel type Carousel shadcn-vue, construit sur Embla.
// <q-carousel :opts="…" :plugins="…" orientation="horizontal|vertical" @init-api="…">
// + QCarouselContent / QCarouselItem / QCarouselPrevious / QCarouselNext
import type { EmblaCarouselType, EmblaPluginType } from "embla-carousel"
import type { InjectionKey, Ref } from "vue"

export interface CarouselContext {
  orientation: Readonly<Ref<"horizontal" | "vertical">>
  emblaRef: Ref<HTMLElement | undefined>
  api: Readonly<Ref<EmblaCarouselType | undefined>>
  canScrollPrev: Readonly<Ref<boolean>>
  canScrollNext: Readonly<Ref<boolean>>
  selectedIndex: Readonly<Ref<number>>
  scrollSnaps: Readonly<Ref<number[]>>
  scrollPrev: () => void
  scrollNext: () => void
}

export const qCarouselKey: InjectionKey<CarouselContext> = Symbol("q-carousel")

export type CarouselApi = EmblaCarouselType
</script>

<script setup lang="ts">
import { computed, provide, ref, watch } from "vue"
import type { EmblaOptionsType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-vue"

interface Props {
  /** Options Embla (align, loop, startIndex, …) */
  opts?: EmblaOptionsType
  /** Plugins Embla (ex. embla-carousel-autoplay) */
  plugins?: EmblaPluginType[]
  /** Orientation du carrousel */
  orientation?: "horizontal" | "vertical"
}

const props = withDefaults(defineProps<Props>(), {
  orientation: "horizontal",
  plugins: () => [],
})

const emit = defineEmits<{ initApi: [api: EmblaCarouselType] }>()

const orientation = computed(() => props.orientation)

const emblaOptions = computed<EmblaOptionsType>(() => ({
  align: "start",
  ...props.opts,
  axis: orientation.value === "vertical" ? "y" : "x",
}))

const emblaPlugins = computed(() => props.plugins)

const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, emblaPlugins)

const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const selectedIndex = ref(0)
const scrollSnaps = ref<number[]>([])

const onSelect = () => {
  const api = emblaApi.value
  if (!api) return
  canScrollPrev.value = api.canScrollPrev()
  canScrollNext.value = api.canScrollNext()
  selectedIndex.value = api.selectedScrollSnap()
  scrollSnaps.value = api.scrollSnapList()
}

watch(
  emblaApi,
  (api) => {
    if (!api) return
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    emit("initApi", api)
  },
  { flush: "post" },
)

const scrollPrev = () => emblaApi.value?.scrollPrev()
const scrollNext = () => emblaApi.value?.scrollNext()

provide<CarouselContext>(qCarouselKey, {
  orientation,
  emblaRef,
  api: emblaApi,
  canScrollPrev,
  canScrollNext,
  selectedIndex,
  scrollSnaps,
  scrollPrev,
  scrollNext,
})
</script>

<template>
  <div
    class="q-carousel"
    :class="orientation === 'vertical' && 'q-carousel--vertical'"
  >
    <slot
      :api="emblaApi"
      :can-scroll-prev="canScrollPrev"
      :can-scroll-next="canScrollNext"
      :scroll-prev="scrollPrev"
      :scroll-next="scrollNext"
      :selected-index="selectedIndex"
      :scroll-snaps="scrollSnaps"
    />
  </div>
</template>
