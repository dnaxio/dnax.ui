<script setup lang="ts">
// Live demos for the Scroll Area page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "visible" | "custom" | "padding" | "chat"
}>()
</script>

<template>
  <q-scroll-area v-if="demo === 'basic'" style="height: 240px">
    <div v-for="i in 30" :key="i" class="demo-log">
      Log entry {{ i }} — scrolling hides the native bar and shows a custom thumb.
    </div>
  </q-scroll-area>

  <q-scroll-area v-else-if="demo === 'visible'" style="height: 200px" visible>
    <div v-for="i in 20" :key="i" class="demo-row">
      {{ i }}. Visible scrollbar — no need to scroll to see it.
    </div>
  </q-scroll-area>

  <q-scroll-area
    v-else-if="demo === 'custom'"
    style="height: 200px"
    bar-style="width: 10px; right: 4px"
    thumb-style="background: #1976d2; border-radius: 5px; opacity: 0.9"
  >
    <div v-for="i in 20" :key="i" class="demo-row">Custom thumb — {{ i }}.</div>
  </q-scroll-area>

  <q-scroll-area
    v-else-if="demo === 'padding'"
    style="height: 220px"
    content-style="padding: 16px 20px"
  >
    <p v-for="i in 6" :key="i" class="demo-paragraph">
      Paragraph {{ i }} — the padding is applied to the scrolling content
      (content-style / content-class), so the thumb reflects the full
      scrollable area.
    </p>
  </q-scroll-area>

  <q-scroll-area v-else-if="demo === 'chat'" style="height: 260px">
    <div v-for="m in 14" :key="m" class="demo-msg" :class="{ 'demo-msg--me': m % 2 === 0 }">
      <div class="demo-msg__bubble">
        {{ m % 2 === 0 ? "You" : "Ada" }} — message {{ m }}: a scrollable
        chat-like list.
      </div>
    </div>
  </q-scroll-area>
</template>

<style scoped>
.demo-log {
  padding: 8px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12.5px;
  color: #4b5563;
}
.demo-log:nth-child(odd) {
  background: rgb(0 0 0 / 0.02);
}
.demo-row {
  /* page-specific row: the legacy page had no global flex `.demo-row` */
  display: block;
  padding: 10px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.05);
  font-size: 14px;
  color: var(--foreground);
}
.demo-paragraph {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-paragraph:last-child {
  margin-bottom: 0;
}

/* — chat — */
.demo-msg {
  display: flex;
  padding: 4px 14px;
}
.demo-msg--me {
  justify-content: flex-end;
}
.demo-msg__bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px 12px 12px 4px;
  background: rgb(0 0 0 / 0.06);
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--foreground);
}
.demo-msg--me .demo-msg__bubble {
  border-radius: 12px 12px 4px 12px;
  background: rgb(25 118 210 / 0.12);
  color: var(--primary);
}
</style>
