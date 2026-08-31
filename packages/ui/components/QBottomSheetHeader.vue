<script setup lang="ts">
// QBottomSheetHeader — header du panneau façon barre d'app (équivalent QHeader) :
// le contenu est embarqué dans un <q-toolbar> (min-height 50px, padding 0 12px),
// avec titre + description + bouton fermer (équivalent DrawerHeader/DrawerTitle).
// no-padding retire le padding horizontal du toolbar.
import { inject } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { qBottomSheetKey } from "./QBottomSheet.vue"
import QToolbar from "./QToolbar.vue"
import QSpace from "./QSpace.vue"

interface Props {
  title?: string
  description?: string
  /** Supprime le padding du toolbar (contenu collé aux bords) */
  noPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  noPadding: false,
})

const sheet = inject(qBottomSheetKey, null)
</script>

<template>
  <div
    class="q-bottom-sheet__header"
    :class="{ 'q-bottom-sheet__header--no-padding': noPadding }"
    v-bind="$attrs"
  >
    <q-toolbar>
      <div class="q-bottom-sheet__header-text">
        <h2 v-if="title" class="q-bottom-sheet__title">{{ title }}</h2>
        <slot name="title" />
        <p v-if="description" class="q-bottom-sheet__description">{{ description }}</p>
        <slot name="description" />
      </div>
      <q-space />
      <button
        type="button"
        class="q-bottom-sheet__close"
        aria-label="Fermer"
        @click="sheet?.setOpen(false)"
      >
        <Icon :icon="icons.x" aria-hidden="true" />
      </button>
      <slot />
    </q-toolbar>
  </div>
</template>
