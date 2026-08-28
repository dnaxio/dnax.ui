<script setup lang="ts">
// QAccordionContent — contenu repliable animé (pattern shadcn/reka-ui).
// Animation de hauteur mesurée (scrollHeight) : height 0 ↔ hauteur du contenu,
// overflow hidden → contenu invisible quand réduit (aucun débordement).
import { computed, inject, nextTick, onMounted, ref, watch } from "vue"
import { qAccordionItemKey, qAccordionKey } from "./QAccordion.vue"

const accordion = inject(qAccordionKey, null)
const item = inject(qAccordionItemKey, null)

const isOpen = computed(() => accordion?.isOpen(item?.value ?? "") ?? false)

const rootEl = ref<HTMLElement | null>(null)
const innerEl = ref<HTMLElement | null>(null)
const contentHeight = ref(0)
const measured = ref(false)

// Hauteur mesurée du contenu (padding compris)
const measure = () => {
  const inner = innerEl.value
  if (inner) {
    contentHeight.value = inner.scrollHeight
    measured.value = true
  }
}

const rootStyle = computed<Record<string, string> | undefined>(() => {
  if (!isOpen.value) return { height: "0px" }
  return measured.value ? { height: `${contentHeight.value}px` } : undefined
})

// À l'ouverture : mesurer puis animer 0 → hauteur
watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    measure()
  }
})

// À la fin de l'animation d'ouverture : height auto (le contenu peut grandir)
const onTransitionEnd = () => {
  if (isOpen.value && rootEl.value) rootEl.value.style.height = "auto"
}

onMounted(measure)
</script>

<template>
  <div
    ref="rootEl"
    :id="item?.uid"
    class="q-accordion__content"
    :class="{ 'q-accordion__content--open': isOpen }"
    :style="rootStyle"
    role="region"
    @transitionend="onTransitionEnd"
  >
    <div ref="innerEl" class="q-accordion__content-inner">
      <slot />
    </div>
  </div>
</template>
