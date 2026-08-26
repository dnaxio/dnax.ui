<script setup lang="ts">
// QBubbleGroup — groupe de bulles consécutives du même expéditeur (équivalent BubbleGroup).
import { computed } from "vue"
import { cn } from "../lib/utils"
import { QPrimitive } from "../lib/primitive"

interface Props {
  as?: string
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  asChild: false,
})

const classes = computed(() => cn("q-bubble-group", props.class))
</script>

<template>
  <QPrimitive :as="as" :as-child="asChild" :class="classes">
    <slot />
  </QPrimitive>
</template>
