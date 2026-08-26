<script setup lang="ts">
// QAccordionContent — contenu repliable animé (équivalent AccordionContent).
// Animation de hauteur par CSS grid (0fr → 1fr), contenu toujours monté.
import { computed, inject } from "vue"
import { qAccordionItemKey, qAccordionKey } from "./QAccordion.vue"

const accordion = inject(qAccordionKey, null)
const item = inject(qAccordionItemKey, null)

const isOpen = computed(() => accordion?.isOpen(item?.value ?? "") ?? false)
</script>

<template>
  <div
    :id="item?.uid"
    class="q-accordion__content"
    :class="{ 'q-accordion__content--open': isOpen }"
    role="region"
  >
    <div class="q-accordion__content-inner">
      <slot />
    </div>
  </div>
</template>
