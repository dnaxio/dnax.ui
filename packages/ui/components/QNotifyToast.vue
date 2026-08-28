<script setup lang="ts">
// QNotifyToast — rendu custom d'une notification $q.notify avec couleur Quasar
// (utilisé par lib/q.ts via toast.custom de vue-sonner).
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { colorValue, contrastText } from "../lib/colors"

interface Props {
  message?: string | number
  caption?: string
  icon?: string
  /** Couleur de fond (token ou hex) — sinon neutre */
  color?: string
  /** Libellé de l'action principale */
  actionLabel?: string
  /** Callback de l'action (fourni par $q.notify) */
  onAction?: () => void
  /** Ferme la notification (fourni par $q.notify) */
  onDismiss?: () => void
}

const props = withDefaults(defineProps<Props>(), {})

const bg = computed(() => (props.color ? colorValue(props.color) : undefined))
const fg = computed(() => (props.color ? contrastText(props.color) : "#1d1d1d"))
</script>

<template>
  <div
    class="q-notify"
    :style="bg ? { backgroundColor: bg, color: fg } : undefined"
    role="status"
  >
    <Icon :icon="icon" v-if="icon" class="q-notify__icon" aria-hidden="true" />
    <div class="q-notify__body">
      <div v-if="message" class="q-notify__message">{{ message }}</div>
      <div v-if="caption" class="q-notify__caption" :style="bg ? { color: fg } : undefined">
        {{ caption }}
      </div>
    </div>
    <button
      v-if="actionLabel"
      type="button"
      class="q-notify__action"
      :style="bg ? { color: fg } : undefined"
      @click="onAction?.()"
    >
      {{ actionLabel }}
    </button>
    <button
      v-if="onDismiss"
      type="button"
      class="q-notify__close"
      aria-label="Fermer"
      @click="onDismiss()"
    >
      ✕
    </button>
  </div>
</template>
