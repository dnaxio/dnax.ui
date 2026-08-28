<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Dialog Header", export: "QDialogHeader" },
  { title: "Dialog Footer", export: "QDialogFooter" },
  { title: "Dialog Trigger", export: "QDialogTrigger" },
  { title: "Dialog Provider", export: "QDialogProvider" },
]

</script>

<template>
  <DocsComponentPage title="Dialog" export="QDialog" :parts="parts" />
</template>
