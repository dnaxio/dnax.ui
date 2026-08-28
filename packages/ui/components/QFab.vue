<script lang="ts">
// QFab — bouton d'action flottant (FAB) avec actions dépliables, API Quasar.
import type { InjectionKey } from "vue"

export interface QFabContext {
  close: () => void
}

export const qFabKey: InjectionKey<QFabContext> = Symbol("q-fab")
</script>

<script setup lang="ts">
import { computed, provide, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { colorValue, foregroundFor } from "../lib/colors"

type FabPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"

interface Props {
  /** Ouvert (v-model) */
  modelValue?: boolean
  /** Position du FAB à l'écran */
  position?: FabPosition
  /** Icône Iconify du bouton principal (défaut : lucide:plus — rotation 45° à l'ouverture) */
  icon?: string
  /** Couleur du bouton principal (token ou hex) */
  color?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  position: "bottom-right",
  icon: icons.plus,
  color: "primary",
  disable: false,
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
})

const toggle = () => {
  if (!props.disable) open.value = !open.value
}

provide<QFabContext>(qFabKey, {
  close: () => {
    open.value = false
  },
})

const mainStyle = computed<Record<string, string>>(() => ({
  backgroundColor: colorValue(props.color),
  color: foregroundFor(props.color),
}))
</script>

<template>
  <div class="q-fab" :class="[`q-fab--${position}`, open && 'q-fab--open']">
    <div class="q-fab__actions" role="menu">
      <slot />
    </div>
    <button
      type="button"
      class="q-fab__main"
      :style="mainStyle"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-label="open ? 'Fermer les actions' : 'Ouvrir les actions'"
      :disabled="disable"
      @click="toggle"
    >
      <Icon :icon="icon" aria-hidden="true" />
    </button>
  </div>
</template>
