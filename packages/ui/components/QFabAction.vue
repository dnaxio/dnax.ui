<script setup lang="ts">
// QFabAction — action individuelle du QFab (équivalent QFabAction Quasar).
// Au clic : émet "click" et ferme le QFab parent.
import { computed, inject } from "vue"
import type { Component } from "vue"
import { qFabKey } from "./QFab.vue"
import { colorValue, foregroundFor } from "../lib/colors"

interface Props {
  /** Libellé affiché à côté du bouton */
  label?: string
  /** Icône Lucide */
  icon?: Component
  /** Couleur du bouton rond (token ou hex) */
  color?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "",
  disable: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const fab = inject(qFabKey, null)

const onClick = (e: MouseEvent) => {
  if (props.disable) return
  fab?.close()
  emit("click", e)
}

const btnStyle = computed<Record<string, string> | undefined>(() =>
  props.color
    ? { backgroundColor: colorValue(props.color), color: foregroundFor(props.color) }
    : undefined,
)
</script>

<template>
  <button type="button" class="q-fab__action" role="menuitem" :disabled="disable" @click="onClick">
    <span v-if="label" class="q-fab__action-label">{{ label }}</span>
    <span class="q-fab__action-btn" :style="btnStyle">
      <component :is="icon" aria-hidden="true" />
    </span>
  </button>
</template>
