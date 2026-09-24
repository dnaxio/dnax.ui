<script setup lang="ts">
// Live demos de la page Page Layout : le padding utilisateur, la structure Quasar
// (q-page-container > q-page) et la composition du padding avec les offsets des barres
// fixed et la safe-area (règles `.q-page` / `.q-page-container` de styles/main.css).
// Un composant de démo par page, le prop `demo` sélectionne le rendu.
defineProps<{
  /** Demo identifier to render */
  demo: "padding" | "custom" | "container"
}>()

const menus = ["Dashboard", "Projects", "Analytics"]
</script>

<template>
  <!-- Structure Quasar : le conteneur occupe la cellule « page », la page remplit la zone -->
  <q-layout v-if="demo === 'container'" view="hHh LpR fFf" container class="demo-page-shell">
    <q-header bordered class="demo-page-shell-bar">
      <q-toolbar><b class="demo-page-shell-title">Console</b></q-toolbar>
    </q-header>

    <q-sidebar side="left" show-if-above :breakpoint="0" bordered>
      <q-sidebar-content>
        <q-sidebar-menu>
          <q-sidebar-menu-item v-for="label in menus" :key="label">
            <q-sidebar-menu-button :label="label" :active="label === 'Dashboard'" />
          </q-sidebar-menu-item>
        </q-sidebar-menu>
      </q-sidebar-content>
    </q-sidebar>

    <q-page-container>
      <q-page padding class="demo-page-shell-body">
        <div class="demo-page-block">
          <p class="demo-p">
            The container fills the page cell — the page inside fills the container
            (both stay as tall as the viewport says).
          </p>
        </div>
      </q-page>
    </q-page-container>

    <q-footer bordered class="demo-page-shell-bar">
      <q-toolbar><span class="demo-page-shell-title demo-page-shell-title--sm">Dnax UI</span></q-toolbar>
    </q-footer>
  </q-layout>

  <div v-else class="demo-page-frame">
    <q-page :padding="demo === 'custom' ? '24px' : true" class="demo-page">
      <div class="demo-page-block">
        <p class="demo-p">
          {{ demo === "custom" ? "padding=\"24px\"" : "<q-page padding>" }} — the padding is
          the gap between the frame and this block.
        </p>
      </div>
    </q-page>
  </div>
</template>

<style scoped>
.demo-page-frame {
  width: 100%;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
  background: #fafbfc;
}
.demo-page-block {
  padding: 12px;
  border: 1px dashed rgb(25 118 210 / 0.35);
  border-radius: 8px;
  background: rgb(25 118 210 / 0.06);
}

/* — démo « container » : une vraie coquille en mode conteneur — */
.demo-page-shell {
  height: 320px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
}
.demo-page-shell-bar {
  background: var(--card, #fff);
}
.demo-page-shell-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--foreground);
  white-space: nowrap;
}
.demo-page-shell-title--sm {
  font-size: 13px;
  font-weight: 600;
}
.demo-page-shell-body {
  background: #fafbfc;
}
</style>
