<script setup lang="ts">
// QAccordionItem — item de l'accordéon (équivalent AccordionItem). Fournit value + uid aux enfants.
import { provide } from "vue"
import { qAccordionItemKey, type AccordionItemContext } from "./QAccordion.vue"

let itemSeq = 0

interface Props {
  /** Identifiant de l'item (lié au v-model de l'accordéon) */
  value: string
}

const props = defineProps<Props>()

const uid = `q-acc-${itemSeq++}`

provide<AccordionItemContext>(qAccordionItemKey, { value: props.value, uid })
</script>

<template>
  <div class="q-accordion__item">
    <slot />
  </div>
</template>
