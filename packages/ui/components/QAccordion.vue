<script lang="ts">
// QAccordion — accordéon type Accordion shadcn-vue (reka-ui), style Quasar.
// <q-accordion v-model type="single|multiple" collapsible> + QAccordionItem/Trigger/Content
import type { InjectionKey } from "vue"

export interface AccordionContext {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

export const qAccordionKey: InjectionKey<AccordionContext> = Symbol("q-accordion")

export interface AccordionItemContext {
  value: string
  uid: string
}

export const qAccordionItemKey: InjectionKey<AccordionItemContext> = Symbol("q-accordion-item")
</script>

<script setup lang="ts">
import { provide } from "vue"

interface Props {
  /** Valeur(s) ouverte(s) : string (single) ou string[] (multiple) */
  modelValue?: string | string[]
  /** single (un seul ouvert) | multiple */
  type?: "single" | "multiple"
  /** En single : permet de refermer l'item ouvert */
  collapsible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "single",
  collapsible: false,
})

const emit = defineEmits<{ "update:modelValue": [value: string | string[] | undefined] }>()

const isOpen = (value: string): boolean => {
  if (props.type === "multiple") return (props.modelValue as string[] | undefined)?.includes(value) ?? false
  return props.modelValue === value
}

const toggle = (value: string) => {
  if (props.type === "multiple") {
    const list = (props.modelValue as string[] | undefined) ?? []
    emit(
      "update:modelValue",
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    )
  }
  else if (props.modelValue === value) {
    if (props.collapsible) emit("update:modelValue", undefined)
  }
  else {
    emit("update:modelValue", value)
  }
}

provide<AccordionContext>(qAccordionKey, { isOpen, toggle })
</script>

<template>
  <div class="q-accordion">
    <slot />
  </div>
</template>
