<script setup lang="ts">
// QMessageScrollerItem — ligne du transcript (équivalent MessageScrollerItem).
// message-id : ancrage/visibilité/sauts ; scroll-anchor : marque le début d'un tour.
import { inject, onBeforeUnmount, onMounted, ref } from "vue"
import { qMessageScrollerKey } from "./QMessageScrollerProvider.vue"

let itemSeq = 0

/** Presets d'animation d'entrée d'un message (portés depuis ui-thing) */
type QMessageAnimationPreset =
  | "fade"
  | "slide-up"
  | "slide-side"
  | "pop"
  | "spring-bounce"
  | "blur-fade"
  | "scale-fade"

interface Props {
  /** Identifiant stable (ancrage, visibilité, sauts) — auto-généré si absent */
  messageId?: string
  /** Marque cette ligne comme le début d'un tour (positionnée près du haut à l'ajout) */
  scrollAnchor?: boolean
  /** Animation d'entrée du message à son ajout (fade, slide-up, pop, spring-bounce…) */
  animationPreset?: QMessageAnimationPreset
}

const props = withDefaults(defineProps<Props>(), {
  scrollAnchor: false,
})

const ctx = inject(qMessageScrollerKey, null)
const el = ref<HTMLElement | null>(null)

const resolvedId = props.messageId ?? `q-msg-item-${itemSeq++}`

onMounted(() => ctx?.registerItem({ id: resolvedId, el, anchor: props.scrollAnchor }))
onBeforeUnmount(() => ctx?.unregisterItem(resolvedId))
</script>

<template>
  <div
    ref="el"
    class="q-msg-scroller__item"
    :class="animationPreset && `q-msg-anim-${animationPreset}`"
  >
    <slot />
  </div>
</template>
