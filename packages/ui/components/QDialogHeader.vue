<script setup lang="ts">
// QDialogHeader — header de la modale façon barre d'app (équivalent QHeader) :
// le contenu est embarqué dans un <q-toolbar> (min-height 50px, padding 0 12px),
// avec titre + description + bouton fermer (équivalent DialogHeader/Title/Close).
// no-padding retire le padding horizontal du toolbar.
import { inject } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { qDialogKey } from "./QDialog.vue"
import QToolbar from "./QToolbar.vue"
import QSpace from "./QSpace.vue"

interface Props {
  title?: string
  description?: string
  /** Bouton fermer */
  showClose?: boolean
  /** Supprime le padding du toolbar (contenu collé aux bords) */
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showClose: true,
  noPadding: false,
})

const dialog = inject(qDialogKey, null)
</script>

<template>
  <div
    class="q-dialog__header"
    :class="{ 'q-dialog__header--no-padding': noPadding }"
    v-bind="$attrs"
  >
    <q-toolbar>
      <div class="q-dialog__header-text">
        <h2 v-if="title" class="q-dialog__title">{{ title }}</h2>
        <slot name="title" />
        <p v-if="description" class="q-dialog__description">{{ description }}</p>
        <slot name="description" />
      </div>
      <q-space />
      <button
        v-if="showClose"
        type="button"
        class="q-dialog__close"
        aria-label="Fermer"
        @click="dialog?.setOpen(false)"
      >
        <Icon :icon="icons.x" aria-hidden="true" />
      </button>
      <slot />
    </q-toolbar>
  </div>
</template>
