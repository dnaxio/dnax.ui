<script setup lang="ts">
// Live demos de la page App Layout : la coquille complète assemblée (barres +
// tiroir + page), pas une pièce isolée.
// Un composant de démo par page, le prop `demo` sélectionne le rendu.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "shell" | "drawer"
}>()

const menus = [
  { label: "Dashboard", icon: "lucide:layout-dashboard", active: true },
  { label: "Projects", icon: "lucide:folder-kanban", badge: "3" },
  { label: "Analytics", icon: "lucide:chart-line" },
  { label: "Settings", icon: "lucide:settings" },
]

const open = ref(false)
</script>

<template>
  <!-- Coquille complète : barres pleine largeur, tiroir statique gauche, page au centre -->
  <q-layout v-if="demo === 'shell'" view="hHh LpR fFf" container class="demo-app">
    <q-header bordered class="demo-app-bar">
      <q-toolbar>
        <q-icon name="lucide:terminal" size="20px" />
        <b class="demo-app-title">Console</b>
        <q-space />
        <q-btn flat round dense icon="lucide:search" aria-label="Search" />
        <q-btn flat round dense icon="lucide:settings" aria-label="Settings" />
      </q-toolbar>
    </q-header>

    <!-- breakpoint 0 : la démo garde le tiroir statique quelle que soit la fenêtre
         (le mode offcanvas est montré par la démo suivante). -->
    <q-sidebar side="left" show-if-above :breakpoint="0" bordered>
      <q-sidebar-content>
        <q-sidebar-menu>
          <q-sidebar-menu-item v-for="item in menus" :key="item.label">
            <q-sidebar-menu-button
              :label="item.label"
              :icon="item.icon"
              :badge="item.badge"
              :active="item.active"
            />
          </q-sidebar-menu-item>
        </q-sidebar-menu>
      </q-sidebar-content>
    </q-sidebar>

    <q-page-container>
      <q-page class="demo-app-page">
        <q-container>
          <p v-for="n in 10" :key="n" class="demo-p demo-app-row">
            Row {{ n }} — the page scrolls; the bars and the drawer keep their place.
          </p>
        </q-container>
      </q-page>
    </q-page-container>

    <q-footer bordered class="demo-app-bar">
      <q-toolbar><span class="demo-app-title demo-app-title--sm">Dnax UI · console</span></q-toolbar>
    </q-footer>
  </q-layout>

  <!-- Tiroir offcanvas (mode mobile) : il sort de la grille et recouvre la page -->
  <div v-else class="demo-app-mobile">
    <div class="demo-app-bar demo-app-mobile-bar">
      <q-btn flat round dense icon="lucide:menu" aria-label="Open sidebar" @click="open = true" />
      <b class="demo-app-title">Console</b>
      <q-space />
      <q-btn flat round dense icon="lucide:search" aria-label="Search" />
    </div>

    <!-- Sans show-if-above : le panneau est en mode offcanvas (v-model) -->
    <q-sidebar v-model="open" width="260px" bordered elevated>
      <q-sidebar-header class="demo-app-mobile-head">
        <q-icon name="lucide:terminal" size="20px" />
        <b class="demo-app-title">Console</b>
        <q-space />
        <q-sidebar-trigger label="Close sidebar">
          <q-icon name="lucide:x" />
        </q-sidebar-trigger>
      </q-sidebar-header>

      <q-sidebar-content>
        <q-sidebar-menu>
          <q-sidebar-menu-item v-for="item in menus" :key="item.label">
            <q-sidebar-menu-button
              :label="item.label"
              :icon="item.icon"
              :badge="item.badge"
              :active="item.active"
            />
          </q-sidebar-menu-item>
        </q-sidebar-menu>
      </q-sidebar-content>
    </q-sidebar>

    <div class="demo-app-mobile-page">
      <p class="demo-p">The drawer slides over the content and closes on Esc, on the backdrop or with a swipe.</p>
      <p v-for="n in 6" :key="n" class="demo-p demo-app-row">Row {{ n }}</p>
    </div>
  </div>
</template>

<style scoped>
.demo-app {
  height: 420px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
}
.demo-app-bar {
  background: var(--card, #fff);
}
.demo-app-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--foreground);
  white-space: nowrap;
}
.demo-app-title--sm {
  font-size: 13px;
  font-weight: 600;
}
.demo-app-page {
  background: #fafbfc;
}
.demo-app-row {
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px dashed rgb(0 0 0 / 0.06);
}
.demo-app-mobile {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 360px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
}
.demo-app-mobile-bar,
.demo-app-mobile-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
}
.demo-app-mobile-head {
  border-bottom: 1px solid rgb(0 0 0 / 0.08);
}
.demo-app-mobile-page {
  flex: 1;
  overflow: auto;
  padding: 12px 16px;
  background: #fafbfc;
}
</style>
