<script setup lang="ts">
// DemoConfirmDialog — exemple réel d'un composant passé à $q.dialog.open().
// Pattern Quasar : la racine DOIT être <q-dialog> piloté par useDialogPluginComponent().
// Reçoit title/message via componentProps, simule une suppression async, et
// renvoie le message à travers onDialogOK(data).
import { ref } from "vue"
import { useDialogPluginComponent } from "@dnax/ui/runtime"

const props = defineProps<{
  title?: string
  message?: string
  confirmLabel?: string
  color?: string
}>()

const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const busy = ref(false)

const confirm = async () => {
  busy.value = true
  // Simulation d'une opération serveur (API, upload…)
  await new Promise((r) => setTimeout(r, 900))
  onDialogOK(props.message ?? "done")
}
</script>

<template>
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header :title="title ?? 'Confirm'" :description="message" />
    <div class="demo-confirm-body">
      <p class="demo-confirm-text">
        This dialog is a real component rendered by
        <code>$q.dialog.open()</code>. It owns its own
        <code>&lt;q-dialog&gt;</code> root and resolves
        <code>onOK / onCancel / onDismiss</code>.
      </p>
    </div>
    <q-dialog-footer>
      <q-btn flat label="Cancel" :disable="busy" @click="onDialogCancel" />
      <q-btn
        unelevated
        no-caps
        :color="color ?? 'negative'"
        :label="busy ? 'Deleting…' : (confirmLabel ?? 'Delete')"
        :loading="busy"
        @click="confirm"
      />
    </q-dialog-footer>
  </q-dialog>
</template>

<style scoped>
.demo-confirm-body {
  padding: 4px 24px 12px;
}
.demo-confirm-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-confirm-text code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
