<script setup lang="ts">
// Live demos for the Header page (page styles only).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "translucent" | "glass" | "fixed"
}>()
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-stage">
    <q-header>
      <q-toolbar>
        <q-icon name="lucide:box" color="primary" size="24px" />
        <span class="q-header__title">Dnax UI</span>
        <q-space />
        <q-btn flat dense no-caps icon="lucide:search" aria-label="Search" />
        <q-btn flat dense no-caps icon="lucide:bell" aria-label="Notifications" />
      </q-toolbar>
    </q-header>
    <div class="demo-stage__content">
      <p class="demo-p">Page content…</p>
    </div>
  </div>

  <div v-else-if="demo === 'translucent'" class="demo-stage demo-stage--gradient">
    <q-header translucent>
      <q-toolbar>
        <q-icon name="lucide:map" color="primary" size="22px" />
        <span class="q-header__title">Discover</span>
        <q-space />
        <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
      </q-toolbar>
    </q-header>
    <div class="demo-stage__content">
      <p class="demo-p">The colorful background shows through the blurred bar.</p>
    </div>
  </div>

  <div v-else-if="demo === 'glass'" class="demo-stage demo-stage--gradient">
    <q-header glass>
      <q-toolbar>
        <q-icon name="lucide:map" color="primary" size="22px" />
        <span class="q-header__title">Discover</span>
        <q-space />
        <q-btn flat dense round icon="lucide:settings" aria-label="Settings" />
      </q-toolbar>
    </q-header>
    <div class="demo-stage__content">
      <p class="demo-p">The colorful background shows through the blurred glass bar.</p>
    </div>
  </div>

  <div v-else-if="demo === 'fixed'" class="demo-stage">
    <q-header fixed>
      <q-toolbar>
        <q-icon name="lucide:arrow-left" color="primary" size="22px" />
        <span class="q-header__title">Details</span>
        <q-space />
        <q-btn flat dense round icon="lucide:more-vertical" aria-label="More" />
      </q-toolbar>
    </q-header>
    <div class="demo-stage__content">
      <p class="demo-p">In the real app the bar floats above the page top.</p>
    </div>
  </div>
</template>

<style scoped>
/* — Stage simulating a page with the header at the top — */
.demo-stage {
  position: relative;
  height: 240px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.demo-stage__content {
  flex: 1;
  padding: 16px;
}
.demo-stage--gradient .demo-stage__content {
  background: linear-gradient(135deg, #4fc3f7, #7e9bff, #b39ddb);
}
.demo-stage--gradient .demo-p {
  color: rgba(255, 255, 255, 0.92);
}
.demo-stage :deep(.q-header--fixed) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.q-header__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
