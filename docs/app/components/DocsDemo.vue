<script setup lang="ts">
// Bloc démo : onglets Preview / Code — pilotés par QTabs + QTabPanels/QTabPanel.
import { ref } from "vue"

defineProps<{
  /** Code affiché dans l'onglet Code */
  code: string
  /** Langage du code (défaut html) */
  lang?: string
  /** Nom de fichier (barre du q-syntax) — remplacé par "Template" si un script est fourni */
  filename?: string
  /** Script setup (données, refs…) affiché sous le template */
  script?: string
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
      <q-tab-panel name="preview">
        <div class="demo-block__preview">
            <slot />
        </div>
      </q-tab-panel>
      <q-tab-panel name="code" class="demo-block__code">
        <q-syntax :code="code" :lang="lang ?? 'html'" filename="Template" copy />
        <q-syntax v-if="script" :code="script" lang="ts" filename="Script setup" copy class="demo-block__script" />
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
  min-height: 300px;
  padding: 24px;
}
.demo-block__code :deep(.q-syntax) {
  border: none;
  border-radius: 0;
}
.demo-block__code :deep(.q-syntax + .q-syntax) {
  border-top: 1px solid rgb(0 0 0 / 0.08);
}
</style>
