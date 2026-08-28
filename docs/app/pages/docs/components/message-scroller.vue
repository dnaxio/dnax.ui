<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Message Scroller Content", export: "QMessageScrollerContent" },
  { title: "Message Scroller Item", export: "QMessageScrollerItem" },
  { title: "Message Scroller Button", export: "QMessageScrollerButton" },
  { title: "Message Scroller Viewport", export: "QMessageScrollerViewport" },
  { title: "Message Scroller Provider", export: "QMessageScrollerProvider" },
]

</script>

<template>
  <DocsComponentPage title="Message Scroller" export="QMessageScroller" :parts="parts" />
</template>
