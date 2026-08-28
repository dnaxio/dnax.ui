<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Bubble Content", export: "QBubbleContent" },
  { title: "Bubble Group", export: "QBubbleGroup" },
  { title: "Bubble Reactions", export: "QBubbleReactions" },
]

</script>

<template>
  <DocsComponentPage title="Bubble" export="QBubble" :parts="parts" />
</template>
