<script setup lang="ts">
// QSkeleton — API Quasar : <q-skeleton type="QBtn" animation="pulse" square dark size width height>
// Équivalent shadcn-vue (div animée) + types composants rendus en formes CSS.
import { computed } from "vue"
import { cn } from "../lib/utils"

type SkeletonType =
  | "text"
  | "rect"
  | "circle"
  | "QBtn"
  | "QAvatar"
  | "QBadge"
  | "QChip"
  | "QInput"
  | "QList"
  | "QToolbar"
  | "QToggle"
  | "QCheckbox"
  | "QRadio"
  | "QSlider"

type SkeletonAnimation = "wave" | "pulse" | "pulse-x" | "pulse-y" | "fade" | "blink" | "none"

interface Props {
  /** Forme : text, rect, circle ou un type de composant (QBtn, QInput…) */
  type?: SkeletonType
  animation?: SkeletonAnimation
  /** Coins droits */
  square?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Taille : circle → diamètre, text → font-size */
  size?: string
  width?: string
  height?: string
  style?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  animation: "wave",
  square: false,
  dark: false,
})

const isSimple = computed(
  () => props.type === "text" || props.type === "rect" || props.type === "circle",
)

const skeletonStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  if (props.type === "circle" && props.size) {
    style.width = props.size
    style.height = props.size
  }
  else if (props.type === "text" && props.size) {
    style.fontSize = props.size
  }
  return style
})

const skeletonClasses = computed(() =>
  cn(
    "q-skeleton",
    `q-skeleton--${props.type}`,
    `q-skeleton--${props.animation}`,
    props.square && "q-skeleton--square",
    props.dark && "q-skeleton--dark",
    props.class,
  ),
)
</script>

<template>
  <div :class="skeletonClasses" :style="[skeletonStyle, props.style]">
    <template v-if="type === 'QBtn'">
      <span class="q-skeleton__bar" style="width: 60%" />
    </template>
    <template v-else-if="type === 'QList'">
      <span class="q-skeleton__line" />
      <span class="q-skeleton__line" style="width: 80%" />
      <span class="q-skeleton__line" style="width: 55%" />
    </template>
    <template v-else-if="type === 'QToolbar'">
      <span class="q-skeleton__dot" />
      <span class="q-skeleton__bar" style="width: 40%" />
      <span class="q-skeleton__bar" style="width: 25%" />
    </template>
    <slot />
  </div>
</template>
