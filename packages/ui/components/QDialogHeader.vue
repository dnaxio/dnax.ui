<script setup lang="ts">
// QDialogHeader — header de la modale façon barre d'app (équivalent QHeader) :
// le contenu est embarqué dans un <q-toolbar> (min-height 50px, padding 0 12px),
// avec titre + description + bouton fermer OPT-IN (show-close).
// Si un CONTENU custom est fourni (slot par défaut, sans title/description/
// show-close), il n'est PAS enveloppé dans un toolbar — l'utilisateur fournit
// son propre layout (ex. <q-toolbar>) directement dans la barre.
import { Comment, Fragment, Text, computed, inject, onUpdated, ref, useSlots } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { qDialogKey } from "./QDialog.vue"
import QToolbar from "./QToolbar.vue"
import QSpace from "./QSpace.vue"

interface Props {
  title?: string
  description?: string
  /** Affiche le bouton fermer (opt-in — sans la prop, aucun ×) */
  showClose?: boolean
  /** Supprime le padding du toolbar (contenu collé aux bords) */
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showClose: false,
  noPadding: false,
})

const dialog = inject(qDialogKey, null)

const slots = useSlots()

// Force le recalcul de la détection à chaque update (le contenu du slot peut
// changer dynamiquement côté parent)
const refresh = ref(0)
onUpdated(() => {
  refresh.value++
})

function slotHasContent(nodes: unknown[]): boolean {
  for (const n of nodes as any[]) {
    if (!n) continue
    if (n.type === Comment) continue
    if (n.type === Text) {
      if (String(n.children ?? "").trim() !== "") return true
      continue
    }
    if (n.type === Fragment) {
      if (slotHasContent(n.children ?? [])) return true
      continue
    }
    return true
  }
  return false
}

// Mode « custom » : pas de title/description/close et un contenu de slot → on
// rend le slot directement (sans toolbar d'enveloppe)
const isStandard = computed(
  () => props.title !== undefined || props.description !== undefined || props.showClose,
)
const hasCustomContent = computed(() => {
  void refresh.value
  return slotHasContent(slots.default?.() ?? [])
})
const useCustom = computed(() => !isStandard.value && hasCustomContent.value)
</script>

<template>
  <div
    class="q-dialog__header"
    :class="{ 'q-dialog__header--no-padding': noPadding }"
    v-bind="$attrs"
  >
    <!-- Contenu custom : l'utilisateur fournit son propre layout (q-toolbar…) -->
    <slot v-if="useCustom" />

    <!-- Mode standard : toolbar embarqué (title / description / close) -->
    <q-toolbar v-else>
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
