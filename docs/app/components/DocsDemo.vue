<script setup lang="ts">
// Bloc démo : onglets Preview / Code — pilotés par QTabs + QTabPanels/QTabPanel.
import { ref } from "vue"

defineProps<{
  /** Code affiché dans l'onglet Code */
  code: string
  /** Langage du code (défaut html) */
  lang?: string
  /** Nom de fichier (barre du q-syntax) */
  filename?: string
}>()

const tab = ref<"preview" | "code">("preview")
</script>

<template>
  <div class="demo-block my-4">
    <q-tabs
      v-model="tab"
      no-caps
      inline-label
      align="left"
      active-color="primary"
      indicator-color="primary"
      dense
      class="demo-block__tabs"
    >
      <q-tab name="preview" icon="lucide:eye" label="Preview" />
      <q-tab name="code" icon="lucide:code-xml" label="Code" />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-model="tab" animated class="demo-block__panels">
      <q-tab-panel name="preview" class="">
        <div class="p-4">
            <slot />
        </div>
      </q-tab-panel>
      <q-tab-panel name="code" class="demo-block__code">
        <q-syntax :code="code" :lang="lang ?? 'html'" :filename="filename" copy />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style scoped>
.demo-block {
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 0px;

  overflow: hidden;
}
.demo-block__tabs {
  background: #f6f7f9;
}
.demo-block__panels {
  background: #fafbfc;
}
.demo-block__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  padding: 24px;
}
.demo-block__code :deep(.q-syntax) {
  border: none;
  border-radius: 0;
}
</style>
