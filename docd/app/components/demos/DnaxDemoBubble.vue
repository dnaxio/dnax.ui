<script setup lang="ts">
// Live demos for the Bubble page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "chat" | "variants" | "reactions"
}>()
</script>

<template>
  <q-bubble-group v-if="demo === 'chat'" class="demo-chat">
    <div class="demo-bubble-meta">Sarah · 14:02</div>
    <q-bubble align="start" variant="secondary">
      <q-bubble-content>Hey! Did you see the new design system?</q-bubble-content>
    </q-bubble>
    <q-bubble align="start" variant="secondary">
      <q-bubble-content>The card components are really nice.</q-bubble-content>
    </q-bubble>

    <div class="demo-bubble-meta demo-bubble-meta--end">You · 14:03</div>
    <q-bubble align="end">
      <q-bubble-content>Yes! I already used them in the dashboard.</q-bubble-content>
    </q-bubble>
  </q-bubble-group>

  <div v-else-if="demo === 'variants'" class="demo-variants">
    <q-bubble variant="default">
      <q-bubble-content>Default</q-bubble-content>
    </q-bubble>
    <q-bubble variant="secondary">
      <q-bubble-content>Secondary</q-bubble-content>
    </q-bubble>
    <q-bubble variant="muted">
      <q-bubble-content>Muted</q-bubble-content>
    </q-bubble>
    <q-bubble variant="tinted">
      <q-bubble-content>Tinted</q-bubble-content>
    </q-bubble>
    <q-bubble variant="outline">
      <q-bubble-content>Outline</q-bubble-content>
    </q-bubble>
    <q-bubble variant="ghost">
      <q-bubble-content>Ghost</q-bubble-content>
    </q-bubble>
    <q-bubble variant="destructive">
      <q-bubble-content>Destructive</q-bubble-content>
    </q-bubble>
  </div>

  <div v-else-if="demo === 'reactions'" class="demo-chat">
    <q-bubble align="end">
      <q-bubble-content>Great work, team! 🎉</q-bubble-content>
      <q-bubble-reactions>
        <button type="button" aria-label="Like">👍</button>
        <button type="button" aria-label="Heart">❤️</button>
        <button type="button" aria-label="Clap">👏</button>
      </q-bubble-reactions>
    </q-bubble>
  </div>
</template>

<style scoped>
.demo-chat {
  max-width: 480px;
  padding-bottom: 24px; /* room for the anchored reactions */
}
.demo-bubble-meta {
  margin: 0 0 2px;
  font-size: 12px;
  color: #8b93a1;
}
.demo-bubble-meta--end {
  margin-top: 14px;
  text-align: right;
}
.demo-variants {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 480px;
}
.demo-variants :deep(.q-bubble__reactions button),
.demo-chat :deep(.q-bubble__reactions button) {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 2px;
}
</style>
