<script setup lang="ts">
// QDialogHost — host interne du $q.dialog : rend le composant passé tel quel et
// lui fournit le contexte plugin (pattern Quasar). Le composant passé DOIT
// contenir un <q-dialog v-model="open" @hide="onDialogHide"> comme racine, piloté
// via useDialogPluginComponent(). À la fermeture (backdrop/Échap/× → @hide), ou
// via onDialogOK / onDialogCancel, les résolveurs sont appelés et l'entrée retirée.
import { provide, ref } from "vue"
import { qDialogPluginKey } from "../../lib/q"
import type { DialogController } from "../../lib/q"

const props = defineProps<{
  ctrl: DialogController
  onOk: (data?: unknown) => void
  onCancel: () => void
  onHide: () => void
}>()

const open = ref(true)

provide(qDialogPluginKey, {
  open,
  onOK: (data?: unknown) => props.onOk(data),
  onCancel: () => props.onCancel(),
  onHide: () => props.onHide(),
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
