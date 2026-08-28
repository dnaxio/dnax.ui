<script setup lang="ts">
// QAccordionTrigger — bouton d'ouverture (équivalent AccordionTrigger).
import { computed, inject } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { qAccordionItemKey, qAccordionKey } from "./QAccordion.vue"

interface Props {
  label?: string
  /** Icône Iconify du chevron (défaut : lucide:chevron-down) */
  expandIcon?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disable: false,
})

const accordion = inject(qAccordionKey, null)
const item = inject(qAccordionItemKey, null)

const isOpen = computed(() => accordion?.isOpen(item?.value ?? "") ?? false)

const toggle = () => {
  if (props.disable || !item) return
  accordion?.toggle(item.value)
}
</script>

<template>
  <button
    type="button"
    class="q-accordion__trigger"
    :class="{ 'q-accordion__trigger--open': isOpen }"
    :disabled="disable"
    :aria-expanded="isOpen ? 'true' : 'false'"
    :aria-controls="item?.uid"
    @click="toggle"
  >
    <span class="q-accordion__trigger-content">
      <span v-if="label" class="q-accordion__trigger-label">{{ label }}</span>
      <slot />
    </span>
    <Icon
      :icon="expandIcon || icons.chevronDown"
      class="q-accordion__trigger-icon"
      :class="{ 'q-accordion__trigger-icon--rotated': isOpen }"
      aria-hidden="true"
    />
  </button>
</template>
