<script setup lang="ts">
// QBottomSheetTrigger — bouton d'ouverture (équivalent DrawerTrigger), alternative au slot #trigger.
import { inject } from "vue"
import { qBottomSheetKey } from "./QBottomSheet.vue"

interface Props {
  label?: string
}

const props = defineProps<Props>()
const sheet = inject(qBottomSheetKey, null)
</script>

<template>
  <button type="button" class="q-bottom-sheet__trigger-btn" @click="sheet?.setOpen(true)">
    <slot>{{ label }}</slot>
  </button>
</template>
