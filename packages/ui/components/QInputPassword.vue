<script setup lang="ts">
// QInputPassword — champ mot de passe avec toggle afficher/masquer (œil / œil barré).
// Wrapper de QInput : toutes les props passent à travers, le type est piloté en interne.
import { computed, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import QInput from "./QInput.vue"
import { useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  modelValue?: string | number | null
  label?: string
  /** Label fixé au-dessus du champ */
  stackLabel?: boolean
  hint?: string
  error?: boolean
  errorMessage?: string
  counter?: boolean
  maxlength?: number
  prefix?: string
  suffix?: string
  clearable?: boolean
  outlined?: boolean
  filled?: boolean
  borderless?: boolean
  dense?: boolean
  disable?: boolean
  readonly?: boolean
  placeholder?: string
  autocomplete?: string
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
}

const props = defineProps<Props>()

const show = ref(false)

// radius : prop explicite > composantProps.QInputPassword > composantProps.default
const effectiveRadius = useRadius("QInputPassword", () => props.radius)

const inputType = computed<"password" | "text">(() => (show.value ? "text" : "password"))

const toggleLabel = computed(() =>
  show.value ? "Masquer le mot de passe" : "Afficher le mot de passe",
)
</script>

<template>
  <q-input v-bind="{ ...$props, ...$attrs }" :radius="effectiveRadius" :type="inputType">
    <template #append>
      <button
        v-if="!disable && !readonly"
        type="button"
        class="q-input-password__toggle"
        :aria-label="toggleLabel"
        @click="show = !show"
      >
        <Icon :icon="show ? icons.eye : icons.eyeOff" aria-hidden="true" />
      </button>
    </template>
    <template v-if="$slots.prepend" #prepend><slot name="prepend" /></template>
    <template v-if="$slots.hint" #hint><slot name="hint" /></template>
    <template v-if="$slots.error" #error><slot name="error" /></template>
  </q-input>
</template>
