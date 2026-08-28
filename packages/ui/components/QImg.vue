<script setup lang="ts">
// QImg — API Quasar : <q-img src="…" ratio="16/9" contain position="50% 50%" spinner-color loading />
// Slots : default (overlay), loading (spinner par défaut), error
// Placeholder : placeholder-src (image basse résolution affichée pendant le chargement)
import { computed, ref, watch } from "vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  src?: string
  alt?: string
  /** Ratio d'affichage ("16/9", "4/3", "1", nombre) */
  ratio?: string | number
  /** object-fit: contain (sinon cover) */
  contain?: boolean
  /** Position de l'image ("50% 50%") */
  position?: string
  /** Force l'état chargement (spinner) */
  loading?: boolean
  spinnerColor?: string
  spinnerSize?: string
  /** Image placeholder (basse résolution) affichée pendant le chargement */
  placeholderSrc?: string
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
  imgClass?: string
  imgStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: "50% 50%",
  loading: false,
  spinnerColor: "",
  spinnerSize: "",
  placeholderSrc: "",
  imgClass: "",
  imgStyle: "",
})

const emit = defineEmits<{ load: [event: Event]; error: [event: Event] }>()

const imgLoading = ref(false)
const imgError = ref(false)

// Dès que src change : retour en état chargement (le @load remettra à false)
watch(
  () => props.src,
  (s) => {
    imgLoading.value = !!s
    imgError.value = false
  },
  { immediate: true },
)

const containerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.ratio !== undefined) {
    style.aspectRatio = String(props.ratio).replace("/", " / ")
  }
  return style
})

const spinnerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.spinnerColor) style.color = colorValue(props.spinnerColor)
  if (props.spinnerSize) {
    style.width = props.spinnerSize
    style.height = props.spinnerSize
  }
  return style
})

const imageClasses = computed(() =>
  cn("q-img__image", props.contain && "q-img__image--contain", props.imgClass),
)

// radius : prop explicite > composantProps.QImg > composantProps.default → --q-radius
const effectiveRadius = useRadius("QImg", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const imageStyle = computed(() => `${props.imgStyle}; object-position: ${props.position}`)

// L'image est prête (chargée) → fondu
const ready = computed(() => !imgLoading.value && !imgError.value)

const onLoad = (e: Event) => {
  imgLoading.value = false
  imgError.value = false
  emit("load", e)
}

const onError = (e: Event) => {
  imgLoading.value = false
  imgError.value = true
  emit("error", e)
}

const showLoading = computed(() => props.loading || imgLoading.value)
</script>

<template>
  <div class="q-img" :style="[containerStyle, roundedStyle]">
    <!-- Placeholder basse résolution pendant le chargement -->
    <img
      v-if="placeholderSrc && imgLoading && !imgError"
      :src="placeholderSrc"
      alt=""
      aria-hidden="true"
      class="q-img__placeholder"
      :class="props.contain && 'q-img__image--contain'"
    />

    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="q-img__image"
      :class="[imageClasses, ready && 'q-img__image--ready']"
      :style="imageStyle"
      loading="lazy"
      @load="onLoad"
      @error="onError"
    />

    <!-- Loading / erreur -->
    <div v-if="showLoading" class="q-img__state">
      <slot name="loading">
        <span class="q-spinner" :style="spinnerStyle" aria-hidden="true" />
      </slot>
    </div>
    <div v-else-if="imgError" class="q-img__state">
      <slot name="error" />
    </div>

    <!-- Overlay -->
    <div class="q-img__overlay">
      <slot />
    </div>
  </div>
</template>
