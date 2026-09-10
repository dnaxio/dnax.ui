<script setup lang="ts">
// Live demos for the Safe Area page (per-page phone mockups).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "portrait" | "landscape" | "all"
}>()
</script>

<template>
  <div v-if="demo === 'portrait'" class="demo-phone">
    <q-safe-area top class="demo-phone__status">
      <span class="demo-phone__time">9:41</span>
      <span class="demo-phone__notch" />
    </q-safe-area>

    <div class="demo-phone__content">
      <div class="demo-card" />
      <div class="demo-card" />
      <div class="demo-card" />
    </div>

    <q-safe-area bottom class="demo-phone__home">
      <span class="demo-phone__home-indicator" />
    </q-safe-area>
  </div>

  <div v-else-if="demo === 'landscape'" class="demo-phone demo-phone--landscape">
    <q-safe-area left class="demo-phone__side">
      <span class="demo-phone__notch-side" />
    </q-safe-area>

    <div class="demo-phone__content">
      <div class="demo-card" />
      <div class="demo-card" />
    </div>
  </div>

  <div v-else-if="demo === 'all'" class="demo-phone">
    <q-safe-area all class="demo-phone__full">
      <p class="demo-full__title">Fullscreen</p>
      <p class="demo-full__text">
        This content avoids every edge — top, right, bottom and left.
      </p>
    </q-safe-area>
  </div>
</template>

<style scoped>
/* — phone mockup — */
.demo-phone {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 500px;
  margin: 0 auto;
  border-radius: 36px;
  border: 10px solid #1d1d1d;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 14px 36px rgb(0 0 0 / 0.22);
}
.demo-phone--landscape {
  flex-direction: row;
  width: 520px;
  height: 250px;
}

/* Desktop simulation of the insets (env() is 0 outside iOS) */
.demo-phone :deep(.q-safe-area--top) {
  padding-top: 44px;
}
.demo-phone :deep(.q-safe-area--right) {
  padding-right: 24px;
}
.demo-phone :deep(.q-safe-area--bottom) {
  padding-bottom: 34px;
}
.demo-phone :deep(.q-safe-area--left) {
  padding-left: 24px;
}
.demo-phone--landscape :deep(.q-safe-area--left) {
  padding-left: 40px;
}

.demo-phone__status {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
}
.demo-phone__time {
  font-size: 12px;
  font-weight: 700;
  color: #111;
}
.demo-phone__notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 92px;
  height: 24px;
  border-radius: 999px;
  background: #111;
}

.demo-phone__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  background: #fafbfc;
  overflow: hidden;
}
.demo-card {
  height: 46px;
  border-radius: 10px;
  background: rgb(0 0 0 / 0.06);
}

.demo-phone__home {
  display: flex;
  justify-content: center;
  background: #f3f4f6;
  border-top: 1px solid rgb(0 0 0 / 0.06);
}
.demo-phone__home-indicator {
  width: 110px;
  height: 5px;
  border-radius: 999px;
  background: #111;
}

.demo-phone__side {
  position: relative;
  background: #f3f4f6;
  border-right: 1px solid rgb(0 0 0 / 0.06);
}
.demo-phone__notch-side {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 72px;
  border-radius: 999px;
  background: #111;
}

/* — all-sides demo (fullscreen) — */
.demo-phone__full {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(160deg, #1976d2, #7c3aed);
  color: #fff;
}
.demo-full__title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.demo-full__text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  opacity: 0.9;
}
</style>
