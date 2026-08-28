<script setup lang="ts">
// QDialogProvider — rend la pile de dialogues programmatiques ($q.dialog).
// Intégré dans QConfigProvider (rendu automatiquement par le plus externe),
// mais utilisable aussi en autonome : <q-dialog-provider><slot /></q-dialog-provider>.
// Chaque entrée de la pile est rendue dans un <q-dialog> ; quand le composant
// émet ok / cancel / dismiss / close, le résolveur correspondant est appelé
// puis l'entrée est retirée de la pile.
import { computed, inject } from "vue"
import { dialogStack, closeDialog } from "../lib/q"
import type { DialogController } from "../lib/q"
import { qConfigKey } from "../lib/config"
import { themeVarsStyle } from "../lib/themeVars"

const dialogs = dialogStack

const config = inject(qConfigKey, null)

// Les dialogs sont téléportés au body (QDialog) : on repose les tokens du thème
// sur leur contenu pour qu'ils héritent des couleurs/radius du provider.
const dialogThemeStyle = themeVarsStyle(computed(() => config?.theme.value ?? {}))

const contentStyle = (ctrl: DialogController) =>
  typeof ctrl._opts.fullscreen === "string" ? { width: ctrl._opts.fullscreen } : undefined

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
  <q-dialog
    v-for="(dialog, idx) in dialogs"
    :key="idx"
    :model-value="true"
    :maximized="dialog._opts.fullscreen === true"
    :content-style="[contentStyle(dialog), dialogThemeStyle]"
    :content-class="dialog._opts.class"
    :persistent="dialog._opts.persistent"
    @update:model-value="(v: boolean) => !v && handleDismiss(dialog)"
  >
    <q-dialog-header
      v-if="dialog._opts.title || dialog._opts.description"
      :title="dialog._opts.title"
      :description="dialog._opts.description"
    />
    <component
      :is="dialog._opts.component"
      v-bind="dialog._opts.componentProps"
      @ok="(data?: unknown) => handleOk(dialog, data)"
      @cancel="handleCancel(dialog)"
      @dismiss="handleDismiss(dialog)"
      @close="handleDismiss(dialog)"
    />
  </q-dialog>
</template>
