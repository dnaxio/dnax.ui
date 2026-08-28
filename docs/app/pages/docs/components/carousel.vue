<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Carousel Content", export: "QCarouselContent" },
  { title: "Carousel Item", export: "QCarouselItem" },
  { title: "Carousel Nav", export: "QCarouselNav" },
]

</script>

<template>
  <DocsComponentPage title="Carousel" export="QCarousel" :parts="parts" />
</template>
