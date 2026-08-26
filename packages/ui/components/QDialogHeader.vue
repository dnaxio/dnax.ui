<script setup lang="ts">
// QDialogHeader — header de la modale : titre + description + bouton fermer (équivalent DialogHeader/Title/Close).
import { inject } from "vue"
import { X } from "@lucide/vue"
import { qDialogKey } from "./QDialog.vue"

interface Props {
  title?: string
  description?: string
  /** Bouton fermer */
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showClose: true,
})

const dialog = inject(qDialogKey, null)
</script>

<template>
  <div class="q-dialog__header">
    <div class="q-dialog__header-text">
      <h2 v-if="title" class="q-dialog__title">{{ title }}</h2>
      <slot name="title" />
      <p v-if="description" class="q-dialog__description">{{ description }}</p>
      <slot name="description" />
    </div>
    <button
      v-if="showClose"
      type="button"
      class="q-dialog__close"
      aria-label="Fermer"
      @click="dialog?.setOpen(false)"
    >
      <X />
    </button>
    <slot />
  </div>
</template>
