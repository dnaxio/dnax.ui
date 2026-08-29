<script setup lang="ts">
// QLoading — overlay de chargement plein écran déclaratif : <q-loading v-model="busy" message="…" icon="…" />
// Alternative au plugin $q.loading (mêmes options visuelles) — piloté par v-model.
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { colorValue } from "../lib/colors"

interface Props {
  /** Affiche/masque l'overlay (v-model) */
  modelValue?: boolean
  /** Message sous le spinner */
  message?: string
  /** Taille du spinner en px (défaut : 48) */
  spinnerSize?: number
  /** Couleur du spinner : token (primary…) ou hex (défaut : primary) */
  spinnerColor?: string
  /** Couleur du message (défaut : #1d1d1d) */
  messageColor?: string
  /** Fond de l'overlay (défaut : rgb(0 0 0 / 0.3)) */
  backgroundColor?: string
  /** Icône Iconify affichée à la place du spinner (ex. : "lucide:loader-circle") */
  icon?: string
  /** Couleur de l'icône (défaut : spinnerColor) */
  iconColor?: string
  /** Garde la carte (fond blanc + ombre) même avec une icône (défaut : transparent) */
  boxed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  spinnerSize: 48,
  spinnerColor: "primary",
  messageColor: "#1d1d1d",
  backgroundColor: "rgb(0 0 0 / 0.3)",
  icon: "",
  iconColor: "",
  boxed: false,
})

defineEmits<{ "update:modelValue": [value: boolean] }>()

const spinnerStyle = computed(() => ({
  width: `${props.spinnerSize}px`,
  height: `${props.spinnerSize}px`,
  borderWidth: `${Math.max(2, Math.round(props.spinnerSize / 8))}px`,
  color: colorValue(props.spinnerColor),
}))

const iconStyle = computed(() => ({
  width: `${props.spinnerSize}px`,
  height: `${props.spinnerSize}px`,
  color: colorValue(props.iconColor || props.spinnerColor),
}))

const messageStyle = computed(() => ({ color: colorValue(props.messageColor) }))
const overlayStyle = computed(() => ({ backgroundColor: props.backgroundColor }))
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="q-loading" :style="overlayStyle" role="status" aria-live="polite">
      <div class="q-loading__box" :class="{ 'q-loading__box--icon': icon && !boxed }">
        <span v-if="!icon" class="q-loading__spinner" :style="spinnerStyle" aria-hidden="true" />
        <Icon v-else :icon="icon" class="q-loading__icon" :style="iconStyle" aria-hidden="true" />
        <div v-if="message" class="q-loading__message" :style="messageStyle">{{ message }}</div>
      </div>
    </div>
  </Teleport>
</template>
