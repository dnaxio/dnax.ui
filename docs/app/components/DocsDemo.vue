<script setup lang="ts">
// Bloc démo : onglets Preview (slot = exemple live) / Code (q-syntax).
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
  <div class="demo-block">
    <q-tabs
      v-model="tab"
      no-caps
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
    <div v-if="tab === 'preview'" class="demo-block__preview">
      <slot />
    </div>
    <q-syntax
      v-else
      :code="code"
      :lang="lang ?? 'html'"
      :filename="filename"
      copy
      class="demo-block__code"
    />
  </div>
</template>

<style scoped>
.demo-block {
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  overflow: hidden;
}
.demo-block__tabs {
  background: #f6f7f9;
}
.demo-block__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  padding: 24px;
  background: #fafbfc;
}
.demo-block__code {
  border: none;
  border-radius: 0;
}
</style>
