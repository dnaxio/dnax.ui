<script setup lang="ts">
// Live demos for the Footer page (page styles only).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "elevated" | "translucent" | "glass" | "fixed"
}>()
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-stage">
    <div class="demo-stage__content">
      <p class="demo-p">Page content…</p>
    </div>
    <q-footer bordered>
      <q-icon name="lucide:box" color="primary" size="20px" />
      <span>Dnax UI</span>
      <q-space />
      <q-btn flat dense no-caps label="Help" />
      <q-btn flat dense no-caps label="Terms" />
    </q-footer>
  </div>

  <div v-else-if="demo === 'elevated'" class="demo-stage">
    <div class="demo-stage__content">
      <p class="demo-p">Page content…</p>
    </div>
    <q-footer elevated>
      <span>Elevated footer — shadow cast upward</span>
      <q-space />
      <q-btn flat dense no-caps icon="lucide:heart" aria-label="Like" />
    </q-footer>
  </div>

  <div v-else-if="demo === 'translucent'" class="demo-stage demo-stage--gradient">
    <div class="demo-stage__content">
      <p class="demo-p">The colorful background shows through the blurred bar.</p>
    </div>
    <q-footer translucent>
      <span>Frosted glass — blur behind the bar</span>
      <q-space />
      <q-btn flat dense no-caps label="Close" />
    </q-footer>
  </div>

  <div v-else-if="demo === 'glass'" class="demo-stage demo-stage--gradient">
    <div class="demo-stage__content">
      <p class="demo-p">The colorful background shows through the blurred glass bar.</p>
    </div>
    <q-footer glass>
      <span>Glassmorphism — strong blur + light border</span>
      <q-space />
      <q-btn flat dense no-caps label="Close" />
    </q-footer>
  </div>

  <div v-else-if="demo === 'fixed'" class="demo-stage">
    <div class="demo-stage__content">
      <p class="demo-p">In the real app the bar floats above the page bottom.</p>
    </div>
    <q-footer fixed bordered>
      <span>Fixed to the viewport bottom</span>
      <q-space />
      <q-btn color="primary" unelevated no-caps dense label="OK" />
    </q-footer>
  </div>
</template>

<style scoped>
/* — Stage simulating a page with the footer at the bottom — */
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
.demo-stage :deep(.q-footer) {
  margin-top: auto; /* in-flow footer, stuck to the bottom of the stage */
}
.demo-stage :deep(.q-footer--fixed) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
