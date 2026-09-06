<script setup lang="ts">
// QBottomSheetHost — host interne du $q.bottomSheet (pattern Quasar, comme
// QDialogHost) : rend le composant passé tel quel et lui fournit le contexte
// plugin. Le composant DOIT contenir un <q-bottom-sheet v-model="open"
// @hide="onDialogHide"> comme racine, piloté via
// useBottomSheetPluginComponent() — open est déjà true (pas de v-model à
// mettre). À la fermeture (@hide) ou via onDialogOK / onDialogCancel, les
// résolveurs sont appelés et l'entrée retirée.
import { provide, ref } from "vue"
import { qBottomSheetPluginKey } from "../../lib/q"
import type { BottomSheetController } from "../../lib/q"

const props = defineProps<{
  ctrl: BottomSheetController
  onOk: (data?: unknown) => void
  onCancel: () => void
  onHide: () => void
}>()

const open = ref(true)

provide(qBottomSheetPluginKey, {
  open,
  onDialogOK: (data?: unknown) => props.onOk(data),
  onDialogCancel: () => props.onCancel(),
  onDialogHide: () => props.onHide(),
})

// Le composant émet aussi les events legacy (ok/cancel/dismiss/close)
const emit = defineEmits<{
  ok: [data?: unknown]
  cancel: []
  dismiss: []
  close: []
}>()
</script>

<template>
  <component
    :is="props.ctrl._opts.component"
    v-bind="props.ctrl._opts.componentProps"
    @ok="emit('ok', $event)"
    @cancel="emit('cancel')"
    @dismiss="emit('dismiss')"
    @close="emit('close')"
  />
</template>
