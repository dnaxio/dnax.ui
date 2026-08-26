<script setup lang="ts">
// QImg — API Quasar : <q-img src="…" ratio="16/9" contain position="50% 50%" spinner-color loading />
// Slots : default (overlay), loading, error
import { computed, ref } from "vue"
import { cn } from "../lib/utils"
import { colorValue } from "../lib/colors"

interface Props {
  src?: string
  alt?: string
  /** Ratio d'affichage ("16/9", "4/3", "1", nombre) */
  ratio?: string | number
  /** object-fit: contain (sinon cover) */
  contain?: boolean
  /** Position de l'image ("50% 50%") */
  position?: string
  /** Force l'état chargement */
  loading?: boolean
  spinnerColor?: string
  spinnerSize?: string
  imgClass?: string
  imgStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: "50% 50%",
  loading: false,
  spinnerColor: "",
  spinnerSize: "",
  imgClass: "",
  imgStyle: "",
})

const emit = defineEmits<{ load: [event: Event]; error: [event: Event] }>()

const imgLoading = ref(false)
const imgError = ref(false)

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

const imageStyle = computed(() => `${props.imgStyle}; object-position: ${props.position}`)

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
  <div class="q-img" :style="containerStyle">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="q-img__image"
      :class="imageClasses"
      :style="imageStyle"
      loading="lazy"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="showLoading" class="q-img__state">
      <slot name="loading">
        <span class="q-spinner" :style="spinnerStyle" aria-hidden="true" />
      </slot>
    </div>
    <div v-else-if="imgError" class="q-img__state">
      <slot name="error" />
    </div>
    <div class="q-img__overlay">
      <slot />
    </div>
  </div>
</template>
