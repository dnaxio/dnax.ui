<script setup lang="ts">
// Live demos for the Card page (page styles).
// One component per page, the `demo` prop selects which demo to render.
defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "bordered" | "actions" | "glass" | "hover"
}>()
</script>

<template>
  <q-card v-if="demo === 'basic'" class="demo-card">
    <q-card-content>
      <h3 class="demo-card-title">Getting started</h3>
      <p class="demo-p">
        A card is a flexible container that groups related content and actions.
        The <code>media</code> slot takes an image, the default slot the body,
        and the <code>actions</code> slot a <code>q-card-actions</code> row.
      </p>
    </q-card-content>
  </q-card>

  <div v-else-if="demo === 'bordered'" class="demo-card-row">
    <q-card bordered radius="lg" class="demo-card">
      <q-card-content>
        <h3 class="demo-card-title">Bordered</h3>
        <p class="demo-p">A subtle 1px border with <code>bordered</code>.</p>
      </q-card-content>
    </q-card>

    <q-card elevated class="demo-card">
      <q-card-content>
        <h3 class="demo-card-title">Elevated</h3>
        <p class="demo-p">
          Cards are flat by default — add <code>elevated</code> for a shadow,
          or <code>flat</code> to remove it explicitly.
        </p>
      </q-card-content>
    </q-card>
  </div>

  <q-card v-else-if="demo === 'actions'" bordered class="demo-card">
    <q-card-content>
      <h3 class="demo-card-title">Draft release</h3>
      <p class="demo-p">
        Actions are grouped in the <code>actions</code> slot of the card and
        aligned with <code>q-card-actions</code>.
      </p>
    </q-card-content>
    <template #actions>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" />
        <q-btn label="Save" />
      </q-card-actions>
    </template>
  </q-card>

  <div v-else-if="demo === 'glass'" class="demo-glass-stage">
    <span class="demo-glass-blob demo-glass-blob--a"></span>
    <span class="demo-glass-blob demo-glass-blob--b"></span>
    <span class="demo-glass-blob demo-glass-blob--c"></span>

    <q-card glass class="demo-glass-card">
      <q-card-content>
        <h3 class="demo-glass-title">Glass card</h3>
        <p class="demo-glass-text">blur(14px) + translucent background — try the hover one.</p>
      </q-card-content>
    </q-card>

    <q-card glass hover class="demo-glass-card">
      <q-card-content>
        <h3 class="demo-glass-title">Glass + hover</h3>
        <p class="demo-glass-text">Same card with the hover animation enabled.</p>
      </q-card-content>
    </q-card>
  </div>

  <div v-else-if="demo === 'hover'" class="demo-card-row">
    <q-card hover elevated class="demo-card">
      <q-card-content>
        <h3 class="demo-card-title">Elevated + hover</h3>
        <p class="demo-p">Lifts 4px and strengthens the shadow on hover.</p>
      </q-card-content>
    </q-card>

    <q-card hover bordered class="demo-card">
      <q-card-content>
        <h3 class="demo-card-title">Bordered + hover</h3>
        <p class="demo-p">The border stays, the card lifts smoothly.</p>
      </q-card-content>
    </q-card>
  </div>
</template>

<style scoped>
.demo-card {
  min-width: 240px;
  flex: 1;
}
.demo-card-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
}
.demo-card-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground, #1f2937);
}

/* — glassmorphism — */
.demo-glass-stage {
  position: relative;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
  padding: 48px 24px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #1976d2, #7c3aed 55%, #0e7490);
}
.demo-glass-card {
  flex: 1;
  min-width: 220px;
  color: #fff;
}
.demo-glass-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}
.demo-glass-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.85);
}
.demo-glass-blob {
  position: absolute;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.35);
  pointer-events: none;
}
.demo-glass-blob--a {
  width: 190px;
  height: 190px;
  top: -50px;
  left: -40px;
}
.demo-glass-blob--b {
  width: 150px;
  height: 150px;
  bottom: -40px;
  right: 12%;
  background: rgb(255 214 102 / 0.55);
}
.demo-glass-blob--c {
  width: 110px;
  height: 110px;
  top: 28%;
  right: -24px;
  background: rgb(102 255 214 / 0.5);
}
</style>
