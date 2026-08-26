<script setup lang="ts">
// QSidebarHeader — zone haute du QSidebar (équivalent SidebarHeader).
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="q-sidebar__header" :class="props.class">
    <slot />
  </div>
</template>
