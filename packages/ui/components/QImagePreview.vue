<script setup lang="ts">
// QImagePreview — visionneuse plein écran : <q-image-preview v-model="open" :images="urls" v-model:index="i" transition="up" close-btn />
// Navigation par carrousel (QSwiper) : swipe horizontal, flèches, clavier.
// Swipe vers le bas pour fermer, × / Échap / clic sur le fond aussi.
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import QSwiper from "./QSwiper.vue"
import QSwiperSlide from "./QSwiperSlide.vue"

type PreviewTransition = "fade" | "up" | "down" | "zoom"

interface Props {
  /** Ouvert (v-model) */
  modelValue?: boolean
  /** URLs d'images — string[] ou { src, title? }[] */
  images?: (string | { src: string; title?: string })[]
  /** Image courante (v-model:index) */
  index?: number
  /** Transition d'ouverture : fade | up | down | zoom (défaut fade) */
  transition?: PreviewTransition
  /** Affiche un bouton fermer (×) */
  closeBtn?: boolean
  /** Affiche le compteur "n / N" (défaut true) */
  counter?: boolean
  /** Fermer en cliquant sur le fond (défaut true) */
  closeOnBackdrop?: boolean
  /** Fermer en glissant vers le bas (défaut true) */
  closeOnSwipeDown?: boolean
  /** Boutons précédent/suivant (défaut true) */
  nav?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  images: () => [],
  index: 0,
  transition: "fade",
  closeBtn: false,
  counter: true,
  closeOnBackdrop: true,
  closeOnSwipeDown: true,
  nav: true,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  "update:index": [value: number]
  /** Émis quand la visionneuse se ferme (swipe bas, backdrop, ×, Escape, v-model=false) */
  dismiss: []
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
})
const idx = computed(() => Math.min(Math.max(props.index, 0), Math.max(0, props.images.length - 1)))

const srcOf = (item: string | { src: string; title?: string }) =>
  typeof item === "string" ? item : item.src

// — Carrousel (QSwiper) —
const swiperInst = ref<any>(null)
const onSwiper = (s: any) => {
  swiperInst.value = s
}
const onSlideChange = (s: any) => {
  if (s && typeof s.realIndex === "number") emit("update:index", s.realIndex)
}
watch(
  () => props.index,
  (v) => {
    if (swiperInst.value && typeof v === "number") swiperInst.value.slideTo(idx.value, 0)
  },
)

const prev = () => {
  const s = swiperInst.value
  if (!s || props.images.length < 2) return
  if (s.activeIndex === 0) s.slideTo(props.images.length - 1)
  else s.slidePrev()
}
const next = () => {
  const s = swiperInst.value
  if (!s || props.images.length < 2) return
  if (s.activeIndex === props.images.length - 1) s.slideTo(0)
  else s.slideNext()
}
const close = () => {
  open.value = false
}

// — Swipe vers le bas pour fermer (geste vertical ; l'horizontal est géré par le carrousel) —
const panelTransform = ref("")
let startX = 0
let startY = 0
let verticalDrag = false
let moved = false
let cleanup: (() => void) | null = null

const onWrapperDown = (e: PointerEvent) => {
  startX = e.clientX
  startY = e.clientY
  verticalDrag = false
  moved = false

  const onMove = (ev: PointerEvent) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    if (Math.abs(dx) + Math.abs(dy) > 8) moved = true
    if (!verticalDrag) {
      if (dy > 0 && Math.abs(dy) > Math.abs(dx)) verticalDrag = true
      else return // drag horizontal → laissé au carrousel
    }
    panelTransform.value = `translate3d(0, ${Math.max(0, dy) * 0.35}px, 0)`
  }
  const onUp = (ev: PointerEvent) => {
    const dy = ev.clientY - startY
    panelTransform.value = ""
    if (verticalDrag && dy > 80 && props.closeOnSwipeDown) close()
    if (cleanup) cleanup()
  }
  window.addEventListener("pointermove", onMove)
  window.addEventListener("pointerup", onUp)
  window.addEventListener("pointercancel", onUp)
  cleanup = () => {
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
    window.removeEventListener("pointercancel", onUp)
    cleanup = null
  }
}

const onSlideClick = () => {
  if (moved) return // ignore après un swipe
  if (props.closeOnBackdrop) close()
}

// — Clavier (Escape, flèches) quand ouvert —
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") close()
  else if (e.key === "ArrowLeft") prev()
  else if (e.key === "ArrowRight") next()
}

watch(open, (v) => {
  if (v) {
    window.addEventListener("keydown", onKeydown)
    document.body.style.overflow = "hidden"
  } else {
    window.removeEventListener("keydown", onKeydown)
    document.body.style.overflow = ""
    emit("dismiss")
  }
})
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown)
  document.body.style.overflow = ""
  if (cleanup) cleanup()
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="`q-image-preview-${transition}`">
      <div
        v-if="open"
        class="q-image-preview"
        :style="panelTransform ? { transform: panelTransform, transition: 'none' } : undefined"
        @pointerdown="onWrapperDown"
      >
        <q-swiper
          :initial-slide="idx"
          :slides-per-view="1"
          class="q-image-preview__swiper"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        >
          <q-swiper-slide v-for="(img, i) in images" :key="i">
            <div class="q-image-preview__slide" @click="onSlideClick">
              <img :src="srcOf(img)" :alt="'Image ' + (i + 1)" draggable="false" />
            </div>
          </q-swiper-slide>
        </q-swiper>

        <button
          v-if="closeBtn"
          type="button"
          class="q-image-preview__btn q-image-preview__close"
          :aria-label="'Fermer'"
          @click="close"
        >
          <Icon :icon="icons.x" />
        </button>

        <template v-if="nav && images.length > 1">
          <button
            type="button"
            class="q-image-preview__btn q-image-preview__nav q-image-preview__nav--prev"
            :aria-label="'Précédente'"
            @click="prev"
          >
            <Icon :icon="icons.chevronLeft" />
          </button>
          <button
            type="button"
            class="q-image-preview__btn q-image-preview__nav q-image-preview__nav--next"
            :aria-label="'Suivante'"
            @click="next"
          >
            <Icon :icon="icons.chevronRight" />
          </button>
        </template>

        <div v-if="counter && images.length" class="q-image-preview__counter">
          {{ idx + 1 }} / {{ images.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
