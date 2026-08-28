<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Card Content", export: "QCardContent" },
  { title: "Card Actions", export: "QCardActions" },
]

</script>

<template>
  <DocsComponentPage title="Card" export="QCard" :parts="parts" />
</template>
