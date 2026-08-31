<script setup lang="ts">
// QDialogProvider — rend la pile de dialogues programmatiques ($q.dialog).
// Intégré dans QConfigProvider (rendu automatiquement par le plus externe),
// mais utilisable aussi en autonome : <q-dialog-provider><slot /></q-dialog-provider>.
//
// Pattern Quasar : le composant passé à $q.dialog.open({ component }) DOIT contenir
// un <q-dialog v-model="open" @hide="onDialogHide"> à sa racine, piloté via le
// composable useDialogPluginComponent() (exporté par @dnax/ui). Le provider fournit
// le contexte (open, onOK, onCancel) via QDialogHost ; à la fermeture (backdrop,
// Échap, ×, onDialogOK, onDialogCancel), le résolveur correspondant est appelé
// puis l'entrée est retirée de la pile.
import { computed, inject } from "vue"
import { dialogStack, closeDialog } from "../lib/q"
import type { DialogController } from "../lib/q"
import { qConfigKey } from "../lib/config"
import { themeVarsStyle } from "../lib/themeVars"
import QDialogHost from "./internal/QDialogHost.vue"

const dialogs = dialogStack

const config = inject(qConfigKey, null)

// Les dialogs sont téléportés au body (QDialog du composant passé) : on repose
// les tokens du thème sur le host pour qu'ils héritent des couleurs/radius du provider.
const dialogThemeStyle = themeVarsStyle(computed(() => config?.theme.value ?? {}))

const handleOk = (ctrl: DialogController, data?: unknown) => {
  ctrl._resolvers.ok?.(data)
  closeDialog(ctrl)
}
const handleCancel = (ctrl: DialogController) => {
  ctrl._resolvers.cancel?.()
  closeDialog(ctrl)
}
const handleDismiss = (ctrl: DialogController) => {
  ctrl._resolvers.dismiss?.()
  closeDialog(ctrl)
}
</script>

<template>
  <slot />
  <div
    v-for="(dialog, idx) in dialogs"
    :key="idx"
    :style="dialogThemeStyle"
  >
    <q-dialog-host
      :ctrl="dialog"
      :on-ok="(data?: unknown) => handleOk(dialog, data)"
      :on-cancel="() => handleCancel(dialog)"
      :on-hide="() => handleDismiss(dialog)"
      @ok="(data?: unknown) => handleOk(dialog, data)"
      @cancel="() => handleCancel(dialog)"
      @dismiss="() => handleDismiss(dialog)"
      @close="() => handleDismiss(dialog)"
    />
  </div>
</template>
