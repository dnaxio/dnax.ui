<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Bottom Sheet Header", export: "QBottomSheetHeader" },
  { title: "Bottom Sheet Footer", export: "QBottomSheetFooter" },
  { title: "Bottom Sheet Trigger", export: "QBottomSheetTrigger" },
  { title: "Bottom Sheet Provider", export: "QBottomSheetProvider" },
]

</script>

<template>
  <DocsComponentPage title="Bottom Sheet" export="QBottomSheet" :parts="parts" />
</template>
