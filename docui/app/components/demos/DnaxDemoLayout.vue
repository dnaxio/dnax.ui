<script setup lang="ts">
// Live demos for the Layout page — one shared shell, only the `view` string differs
// (the letter case is what moves the pieces around).
// One component per page, the `demo` prop selects which demo to render.
import { computed } from "vue"

const props = defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "above" | "flowing"
}>()

const VIEWS: Record<string, string> = {
  basic: "hHh LpR fFf",
  above: "lhh LpR fff",
  flowing: "hHh lpr fff",
}

const view = computed(() => VIEWS[props.demo] ?? VIEWS.basic)

const menus = [
  { label: "Dashboard", icon: "lucide:layout-dashboard", active: true },
  { label: "Projects", icon: "lucide:folder-kanban", badge: "3" },
  { label: "Analytics", icon: "lucide:chart-line" },
  { label: "Settings", icon: "lucide:settings" },
]
</script>

<template>
  <q-layout :view="view" container class="demo-shell">
    <q-header bordered class="demo-shell-bar">
      <q-toolbar>
        <q-icon name="lucide:terminal" size="20px" />
        <b class="demo-shell-title">Console</b>
        <q-space />
        <q-btn flat round dense icon="lucide:search" aria-label="Search" />
        <q-btn flat round dense icon="lucide:settings" aria-label="Settings" />
      </q-toolbar>
    </q-header>

    <!-- breakpoint 0 : cette démo garde le panneau en mode statique quelle que soit
         la largeur de la fenêtre (le mode offcanvas est documenté côté Sidebar). -->
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

    <q-page class="demo-shell-page">
      <q-container>
        <p v-for="n in 12" :key="n" class="demo-p demo-shell-row">
          Row {{ n }} — the page scrolls; header, drawer and footer keep their place
          as long as their letter is uppercase.
        </p>
      </q-container>
    </q-page>

    <q-footer bordered class="demo-shell-bar">
      <q-toolbar>
        <span class="demo-shell-title demo-shell-title--sm">Dnax UI · console</span>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style scoped>
.demo-shell {
  height: 420px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
}
.demo-shell-bar {
  background: var(--card, #fff);
}
.demo-shell-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--foreground);
  white-space: nowrap;
}
.demo-shell-title--sm {
  font-size: 13px;
  font-weight: 600;
}
.demo-shell-page {
  background: #fafbfc;
}
.demo-shell-row {
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px dashed rgb(0 0 0 / 0.06);
}
</style>
