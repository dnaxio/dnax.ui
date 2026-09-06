<script setup lang="ts">
// QBottomSheetProvider — rend la pile de bottom sheets programmatiques ($q.bottomSheet).
// Intégré dans QConfigProvider (rendu automatiquement par le plus externe),
// utilisable aussi en autonome : <q-bottom-sheet-provider><slot /></q-bottom-sheet-provider>.
//
// Deux patterns (comme le plugin dialog) :
//  - SANS title/description → le composant passé EST le sheet (racine
//    <q-bottom-sheet v-model="open"> pilotée par useBottomSheetPluginComponent,
//    open déjà true) — rendu tel quel via QBottomSheetHost.
//  - AVEC title/description → le provider enveloppe dans un q-bottom-sheet +
//    header ; le composant fournit le corps et émet @ok/@cancel/@dismiss.
import { computed, inject } from "vue"
import { bottomSheetStack, closeBottomSheet } from "../lib/q"
import type { BottomSheetController } from "../lib/q"
import { qConfigKey } from "../lib/config"
import { themeVarsStyle } from "../lib/themeVars"
import QBottomSheetHost from "./internal/QBottomSheetHost.vue"

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
  <template v-for="(sheet, idx) in sheets" :key="idx">
    <!-- Pattern auto : le composant est lui-même un <q-bottom-sheet> -->
    <q-bottom-sheet-host
      v-if="!sheet._opts.title && !sheet._opts.description"
      :ctrl="sheet"
      :on-ok="(data?: unknown) => handleOk(sheet, data)"
      :on-cancel="() => handleCancel(sheet)"
      :on-hide="() => handleDismiss(sheet)"
      @ok="(data?: unknown) => handleOk(sheet, data)"
      @cancel="handleCancel(sheet)"
      @dismiss="handleDismiss(sheet)"
      @close="handleDismiss(sheet)"
    />
    <!-- Pattern enveloppe : le provider rend le panneau + header, le composant
         fournit le corps (events legacy ok/cancel/dismiss/close) -->
    <q-bottom-sheet
      v-else
      :model-value="true"
      :persistent="sheet._opts.persistent"
      :width="sheet._opts.width"
      :height="sheet._opts.height"
      :rounded="sheet._opts.rounded"
      :dark="sheet._opts.dark"
      :translucent="sheet._opts.translucent"
      :drag-threshold="sheet._opts.dragThreshold"
      :transition="sheet._opts.transition"
      :transition-duration="sheet._opts.transitionDuration"
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
</template>
