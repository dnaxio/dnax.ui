<script setup lang="ts">
// QDialogTrigger — bouton d'ouverture (équivalent DialogTrigger).
import { inject } from "vue"
import { qDialogKey } from "./QDialog.vue"

interface Props {
  label?: string
}

const props = defineProps<Props>()
const dialog = inject(qDialogKey, null)
</script>

<template>
  <button type="button" class="q-dialog__trigger" @click="dialog?.setOpen(true)">
    <slot>{{ label }}</slot>
  </button>
</template>
