<script setup lang="ts">
// Live demos for the Sidebar page (per-page state + page styles).
// One component per page, the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "offcanvas" | "static"
}>()

const open = ref(false)
const openStatic = ref(false)
</script>

<template>
  <template v-if="demo === 'offcanvas'">
    <div class="demo-toolbar">
      <q-btn color="primary" icon="lucide:menu" label="Open sidebar" @click="open = true" />
    </div>

    <q-sidebar v-model="open" width="280px" bordered elevated>
      <q-sidebar-header class="demo-side-head">
        <q-icon name="lucide:box" color="primary" size="22px" />
        <b class="demo-brand">Dnax UI</b>
        <q-space />
        <q-sidebar-trigger label="Close sidebar">
          <q-icon name="lucide:x" />
        </q-sidebar-trigger>
      </q-sidebar-header>

      <q-sidebar-content>
        <q-sidebar-menu>
          <q-sidebar-menu-item>
            <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
          </q-sidebar-menu-item>
          <q-sidebar-menu-item>
            <q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
          </q-sidebar-menu-item>
          <q-sidebar-menu-item>
            <q-sidebar-menu-button label="Analytics" icon="lucide:chart-line" />
          </q-sidebar-menu-item>
          <q-sidebar-menu-item>
            <q-sidebar-menu-button label="Settings" icon="lucide:settings" />
          </q-sidebar-menu-item>
        </q-sidebar-menu>
      </q-sidebar-content>

      <q-sidebar-footer>
        <q-sidebar-menu-button label="Log out" icon="lucide:log-out" />
      </q-sidebar-footer>
    </q-sidebar>
  </template>

  <div v-else-if="demo === 'static'" class="demo-layout">
    <q-sidebar show-if-above sticky height="70vh" width="240px" bordered v-model="openStatic">
      <q-sidebar-header class="demo-side-head">
        <q-icon name="lucide:box" color="primary" size="22px" />
        <b class="demo-brand">Dnax UI</b>
      </q-sidebar-header>

      <q-sidebar-content>
        <q-sidebar-menu>
          <q-sidebar-menu-item>
            <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
          </q-sidebar-menu-item>
          <q-sidebar-menu-item>
            <q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
          </q-sidebar-menu-item>
          <q-sidebar-menu-item>
            <q-sidebar-menu-button label="Settings" icon="lucide:settings" />
          </q-sidebar-menu-item>
        </q-sidebar-menu>
      </q-sidebar-content>

      <q-sidebar-footer>
        <div class="demo-user">
          <q-icon name="lucide:user-round" />
          <span>Ada Lovelace</span>
        </div>
      </q-sidebar-footer>
    </q-sidebar>

    <div class="demo-main">
      <h4>Page content</h4>
      <p class="demo-p">
        On wide screens the panel is part of the layout; below the
        breakpoint it collapses into an offcanvas drawer.
      </p>
    </div>
  </div>
</template>

<style scoped>
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}

/* — demo styles — */
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.demo-side-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-brand {
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
  white-space: nowrap;
}
.demo-layout {
  display: flex;
  align-items: stretch;
  min-height: 320px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
}
.demo-main {
  flex: 1 1 auto;
  min-width: 0;
  padding: 20px 24px;
  background: #fafbfc;
}
.demo-main h4 {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
}
</style>
