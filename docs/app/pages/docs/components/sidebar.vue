<script setup lang="ts">
// Généré par scripts/gen-menu.ts — personnalisez librement ce fichier.
import DocsComponentPage from "~/components/DocsComponentPage.vue"

definePageMeta({ layout: "docs" })

const parts = [
  { title: "Sidebar Header", export: "QSidebarHeader" },
  { title: "Sidebar Content", export: "QSidebarContent" },
  { title: "Sidebar Footer", export: "QSidebarFooter" },
  { title: "Sidebar Menu", export: "QSidebarMenu" },
  { title: "Sidebar Menu Button", export: "QSidebarMenuButton" },
  { title: "Sidebar Menu Item", export: "QSidebarMenuItem" },
  { title: "Sidebar Trigger", export: "QSidebarTrigger" },
]

</script>

<template>
  <DocsComponentPage title="Sidebar" export="QSidebar" :parts="parts" />
</template>
