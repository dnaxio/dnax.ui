<script setup lang="ts">
// QSidebarFooter — zone basse du QSidebar (équivalent SidebarFooter).
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="q-sidebar__footer" :class="props.class">
    <slot />
  </div>
</template>
