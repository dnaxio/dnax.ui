<script setup lang="ts">
// QCollapse — API Quasar (pattern QExpansionItem) : <q-collapse v-model label="…" icon="…" caption dense>
// Équivalent du Collapsible shadcn-vue : animation de hauteur via CSS grid (0fr → 1fr).
import { computed, ref } from "vue"
import type { Component } from "vue"
import { ChevronDown } from "@lucide/vue"
import { cn } from "../lib/utils"

let collapseSeq = 0

interface Props {
  /** État ouvert (v-model) ; si absent, état interne initialisé par defaultOpened */
  modelValue?: boolean
  /** Ouvert par défaut (mode non contrôlé) */
  defaultOpened?: boolean
  /** Texte du header */
  label?: string
  /** Sous-titre du header */
  caption?: string
  /** Icône Lucide à gauche du label */
  icon?: Component
  /** Icône Lucide du chevron (défaut : chevron-down) */
  expandIcon?: Component
  headerClass?: string
  /** Hauteur réduite */
  dense?: boolean
  /** Désactivé */
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpened: false,
  dense: false,
  disable: false,
  headerClass: "",
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

const uid = `q-collapse-${collapseSeq++}`

const internalOpen = ref(props.defaultOpened)
const open = computed({
  get: () => props.modelValue ?? internalOpen.value,
  set: (v) => {
    internalOpen.value = v
    emit("update:modelValue", v)
  },
})

const toggle = () => {
  if (props.disable) return
  open.value = !open.value
}

const headerClasses = computed(() =>
  cn(
    "q-collapse__header",
    props.dense && "q-collapse__header--dense",
    props.disable && "q-collapse__header--disabled",
    props.headerClass,
  ),
)
</script>

<template>
  <div class="q-collapse">
    <button
      type="button"
      class="q-collapse__header"
      :class="headerClasses"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="uid"
      :disabled="disable"
      @click="toggle"
    >
      <span class="q-collapse__header-inner">
        <slot name="header">
          <component :is="icon" v-if="icon" class="q-collapse__lead-icon" aria-hidden="true" />
          <span class="q-collapse__titles">
            <span v-if="label" class="q-collapse__label">{{ label }}</span>
            <span v-if="caption" class="q-collapse__caption">{{ caption }}</span>
          </span>
        </slot>
      </span>
      <component
        :is="expandIcon || ChevronDown"
        class="q-collapse__expand"
        :class="{ 'q-collapse__expand--rotated': open }"
        aria-hidden="true"
      />
    </button>
    <div :id="uid" class="q-collapse__content" :class="{ 'q-collapse__content--open': open }">
      <div class="q-collapse__inner">
        <slot />
      </div>
    </div>
  </div>
</template>
