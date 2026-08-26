<script setup lang="ts">
// QSidebarContent — zone centrale scrollable du QSidebar (équivalent SidebarContent).
interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="q-sidebar__content" :class="props.class">
    <slot />
  </div>
</template>
