<script setup lang="ts">
// QBottomSheetHeader — header du panneau : titre + description + bouton fermer (équivalent DrawerHeader/DrawerTitle).
import { inject } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { qBottomSheetKey } from "./QBottomSheet.vue"

interface Props {
  title?: string
  description?: string
}

const props = defineProps<Props>()
const sheet = inject(qBottomSheetKey, null)
</script>

<template>
  <div class="q-bottom-sheet__header">
    <div class="q-bottom-sheet__header-text">
      <h2 v-if="title" class="q-bottom-sheet__title">{{ title }}</h2>
      <slot name="title" />
      <p v-if="description" class="q-bottom-sheet__description">{{ description }}</p>
      <slot name="description" />
    </div>
    <button
      type="button"
      class="q-bottom-sheet__close"
      aria-label="Fermer"
      @click="sheet?.setOpen(false)"
    >
      <Icon :icon="icons.x" aria-hidden="true" />
    </button>
    <slot />
  </div>
</template>
