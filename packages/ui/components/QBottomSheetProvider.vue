<script setup lang="ts">
// QBottomSheetProvider — rend la pile de bottom sheets programmatiques ($q.bottomSheet).
// Intégré dans QConfigProvider (rendu automatiquement par le plus externe),
// utilisable aussi en autonome : <q-bottom-sheet-provider><slot /></q-bottom-sheet-provider>.
import { computed, inject } from "vue"
import { bottomSheetStack, closeBottomSheet } from "../lib/q"
import type { BottomSheetController } from "../lib/q"
import { qConfigKey } from "../lib/config"
import { themeVarsStyle } from "../lib/themeVars"

const sheets = bottomSheetStack

const config = inject(qConfigKey, null)

// Téléporté au body : on repose les tokens du thème sur le panneau
const sheetThemeStyle = themeVarsStyle(computed(() => config?.theme.value ?? {}))

const handleOk = (ctrl: BottomSheetController, data?: unknown) => {
  ctrl._resolvers.ok?.(data)
  closeBottomSheet(ctrl)
}
const handleCancel = (ctrl: BottomSheetController) => {
  ctrl._resolvers.cancel?.()
  closeBottomSheet(ctrl)
}
const handleDismiss = (ctrl: BottomSheetController) => {
  ctrl._resolvers.dismiss?.()
  closeBottomSheet(ctrl)
}
</script>

<template>
  <slot />
  <q-bottom-sheet
    v-for="(sheet, idx) in sheets"
    :key="idx"
    :model-value="true"
    :persistent="sheet._opts.persistent"
    :width="sheet._opts.width"
    :height="sheet._opts.height"
    :rounded="sheet._opts.rounded"
    :dark="sheet._opts.dark"
    :translucent="sheet._opts.translucent"
    :drag-threshold="sheet._opts.dragThreshold"
    :content-style="sheetThemeStyle"
    @update:model-value="(v: boolean) => !v && handleDismiss(sheet)"
  >
    <q-bottom-sheet-header
      v-if="sheet._opts.title || sheet._opts.description"
      :title="sheet._opts.title"
      :description="sheet._opts.description"
    />
    <component
      :is="sheet._opts.component"
      v-bind="sheet._opts.componentProps"
      @ok="(data?: unknown) => handleOk(sheet, data)"
      @cancel="handleCancel(sheet)"
      @dismiss="handleDismiss(sheet)"
      @close="handleDismiss(sheet)"
    />
  </q-bottom-sheet>
</template>
