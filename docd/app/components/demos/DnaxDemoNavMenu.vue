<script setup lang="ts">
// Démos live de la page Nav Menu (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "dropdowns" | "custom"
}>()
</script>

<template>
  <div v-if="demo === 'dropdowns'" class="demo-nav">
    <q-nav-menu>
      <q-nav-menu-trigger name="products" label="Products" icon="lucide:package">
        <q-nav-menu-content>
          <q-nav-menu-item label="Overview" />
          <q-nav-menu-item label="Pricing" />
          <q-nav-menu-item label="Changelog" />
        </q-nav-menu-content>
      </q-nav-menu-trigger>

      <q-nav-menu-trigger name="resources" label="Resources" icon="lucide:book-open">
        <q-nav-menu-content>
          <q-nav-menu-item label="Documentation" />
          <q-nav-menu-item label="Blog" />
          <q-nav-menu-item label="Community" />
        </q-nav-menu-content>
      </q-nav-menu-trigger>

      <q-nav-menu-item label="Contact" />
      <q-nav-menu-item label="GitHub" icon="lucide:github" />
    </q-nav-menu>
  </div>

  <div v-else-if="demo === 'custom'" class="demo-nav">
    <q-nav-menu>
      <q-nav-menu-trigger name="account" label="Account" icon="lucide:user">
        <q-nav-menu-content>
          <q-nav-menu-item label="Profile" icon="lucide:user-round" />
          <q-nav-menu-item label="Settings" icon="lucide:settings" active />
          <q-nav-menu-item label="Log out" icon="lucide:log-out" />
        </q-nav-menu-content>
      </q-nav-menu-trigger>

      <q-nav-menu-trigger name="help">
        <template #trigger>
          <q-icon name="lucide:circle-help" />
          <span>Need help?</span>
        </template>
        <q-nav-menu-content>
          <q-nav-menu-item label="Documentation" />
          <q-nav-menu-item label="Report an issue" />
        </q-nav-menu-content>
      </q-nav-menu-trigger>
    </q-nav-menu>
  </div>
</template>

<style scoped>
.demo-nav {
  display: flex;
  align-items: center;
  padding: 10px 14px 240px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 8px;
  background: #fff;
}
</style>
