<script setup lang="ts">
// QBottomSheetHeader — header du panneau façon barre d'app (équivalent QHeader) :
// le contenu est embarqué dans un <q-toolbar> (min-height 50px, padding 0 12px),
// avec titre + description + bouton fermer (équivalent DrawerHeader/DrawerTitle).
// Si un CONTENU custom est fourni (slot par défaut, sans title/description),
// il n'est PAS enveloppé dans un toolbar — l'utilisateur fournit son layout.
import { Comment, Fragment, Text, computed, inject, onUpdated, ref, useSlots } from "vue"
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

const props = withDefaults(defineProps<Props>(), {
  noPadding: false,
})

const sheet = inject(qBottomSheetKey, null)

const slots = useSlots()

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

const isStandard = computed(
  () => props.title !== undefined || props.description !== undefined,
)
const hasCustomContent = computed(() => {
  void refresh.value
  return slotHasContent(slots.default?.() ?? [])
})
const useCustom = computed(() => !isStandard.value && hasCustomContent.value)
</script>

<template>
  <div
    class="q-bottom-sheet__header"
    :class="{ 'q-bottom-sheet__header--no-padding': noPadding }"
    v-bind="$attrs"
  >
    <slot v-if="useCustom" />

    <q-toolbar v-else>
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
