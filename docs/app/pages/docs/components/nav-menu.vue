<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Nav Menu Content", export: "QNavMenuContent" },
  { title: "Nav Menu Item", export: "QNavMenuItem" },
  { title: "Nav Menu Trigger", export: "QNavMenuTrigger" },
]

</script>

<template>
  <DocsComponentPage title="Nav Menu" export="QNavMenu" :parts="parts" />
</template>
