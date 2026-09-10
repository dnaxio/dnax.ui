<script setup lang="ts">
// Live demos for the Text Caption page.
// One component per page — the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "breathing" | "generate" | "highlight" | "positions"
}>()

const IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1287&auto=format&fit=crop"
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-stage">
    <img :src="IMG" class="demo-img" alt="Mountain landscape" />
    <q-text-caption absolute title="Alpine sunrise" subtitle="Golden light over the peaks" />
  </div>

  <div v-else-if="demo === 'breathing'" class="demo-stage">
    <img :src="IMG" class="demo-img" alt="Mountain landscape" />
    <q-text-caption absolute breathing title="Alpine sunrise" subtitle="Golden light over the peaks" />
  </div>

  <div v-else-if="demo === 'generate'" class="demo-stage">
    <img :src="IMG" class="demo-img" alt="Mountain landscape" />
    <q-text-caption
      absolute
      generate
      title="Alpine sunrise"
      subtitle="Golden light over the peaks"
    />
  </div>

  <div v-else-if="demo === 'highlight'" class="demo-stage">
    <img :src="IMG" class="demo-img" alt="Mountain landscape" />
    <q-text-caption
      absolute
      highlight="sunrise"
      title="Alpine sunrise"
      subtitle="Golden light over the peaks"
    />
  </div>

  <div v-else-if="demo === 'positions'" class="demo-row">
    <div class="demo-stage demo-stage--sm">
      <img :src="IMG" class="demo-img" alt="Position top" />
      <q-text-caption absolute position="top" title="Top" />
    </div>
    <div class="demo-stage demo-stage--sm">
      <img :src="IMG" class="demo-img" alt="Position left" />
      <q-text-caption absolute position="left" title="Left" />
    </div>
  </div>
</template>

<style scoped>
.demo-stage {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.demo-stage--sm {
  width: 46%;
  aspect-ratio: 4 / 3;
  flex: 1 1 46%;
}

.demo-img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.demo-stage--sm .demo-img {
  aspect-ratio: 4 / 3;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 16px;
}
</style>
