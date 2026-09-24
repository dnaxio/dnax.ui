<script setup lang="ts">
// Live demos for the Skeleton page (per-page styles).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "shapes" | "types" | "card" | "anims" | "dark"
}>()
</script>

<template>
  <div v-if="demo === 'shapes'" class="demo-col demo-col--wide">
    <q-skeleton type="text" width="100%" />
    <q-skeleton type="text" width="80%" />
    <q-skeleton type="text" width="55%" />
    <q-skeleton type="rect" width="100%" height="120px" />
    <q-skeleton type="circle" size="64px" />
  </div>

  <div v-else-if="demo === 'types'" class="demo-grid">
    <q-skeleton type="QBtn" />
    <q-skeleton type="QAvatar" />
    <q-skeleton type="QBadge" />
    <q-skeleton type="QChip" />
    <q-skeleton type="QInput" />
    <q-skeleton type="QToggle" />
    <q-skeleton type="QCheckbox" />
    <q-skeleton type="QRadio" />
    <q-skeleton type="QSlider" />
  </div>

  <div v-else-if="demo === 'card'" class="demo-card">
    <div class="demo-card__row">
      <q-skeleton type="QAvatar" />
      <div class="demo-card__lines">
        <q-skeleton type="text" width="60%" />
        <q-skeleton type="text" width="40%" />
      </div>
    </div>
    <q-skeleton type="text" />
    <q-skeleton type="text" width="90%" />
    <div class="demo-card__row demo-card__row--end">
      <q-skeleton type="QBtn" />
      <q-skeleton type="QBtn" />
    </div>
  </div>

  <div v-else-if="demo === 'anims'" class="demo-row">
    <q-skeleton type="text" width="110px" animation="wave" />
    <q-skeleton type="text" width="110px" animation="pulse" />
    <q-skeleton type="text" width="110px" animation="blink" />
    <q-skeleton type="text" width="110px" animation="fade" />
    <q-skeleton type="text" width="110px" animation="none" />
  </div>

  <div v-else-if="demo === 'dark'" class="demo-dark">
    <q-skeleton type="QAvatar" dark />
    <div class="demo-dark__lines">
      <q-skeleton type="text" width="100%" dark />
      <q-skeleton type="text" width="70%" dark />
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  gap: 10px;
}
.demo-col--wide {
  align-items: stretch;
}
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 18px;
  align-items: center;
  max-width: 560px;
  width: 100%;
}
.demo-row {
  gap: 14px;
}

/* — composed card — */
.demo-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 420px;
  margin: 0 auto;
  padding: 18px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: #fff;
}
.demo-card__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-card__row--end {
  justify-content: flex-end;
}
.demo-card__lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

/* — dark panel — */
.demo-dark {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 420px;
  margin: 0 auto;
  padding: 18px;
  border-radius: 12px;
  background: #1d1d1d;
}
.demo-dark__lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
</style>
