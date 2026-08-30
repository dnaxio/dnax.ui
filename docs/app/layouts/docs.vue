<script setup lang="ts">
// Docs layout — header + sidebar (catégories repliables) + contenu.
import { ref, watch } from "vue"
import { menuItems } from "~/data/menu"
import ThemeToggle from "~/components/ThemeToggle.vue"

const route = useRoute()
const open = ref(false)

const isActive = (link: string) => route.path === link.split("#")[0]

// Groupes repliables : ouvre automatiquement le groupe du composant actif
const openGroups = ref<Record<string, boolean>>({})
watch(
  () => route.path,
  (path) => {
    const group = menuItems.find(
      (g) =>
        g.items?.some((i) => i.link.split("#")[0] === path) ||
        g.groups?.some((sub) => sub.items.some((i) => i.link.split("#")[0] === path)),
    )
    if (group) openGroups.value[group.title] = true
  },
  { immediate: true },
)
</script>

<template>
  <q-app>


    <div class="docs-body">
      <q-sidebar sticky height="100vh" v-model="open" show-if-above :breakpoint="1023" bordered>
        <q-sidebar-header class="side-head">
          <a href="/" class="logo-link" aria-label="Dnax UI — home">
            <q-icon name="lucide:box" color="primary" size="22px" />
            <span class="logo">Dnax<b>UI</b></span>
          </a>
          <q-space />
          <theme-toggle />
          <q-btn
            flat
            round
            dense
            icon="lucide:x"
            aria-label="Close sidebar"
            class="side-close"
            @click="open = false"
          />
        </q-sidebar-header>
        <q-sidebar-content class="scroll"  style="height:80vh">
          <div class="q-sidebar__menu">
            <q-collapse
              v-for="group in menuItems"
              :key="group.title"
              v-model="openGroups[group.title]"
              :label="group.title"
              :icon-left="group.icon"
              dense
              header-class="sidebar-group"
            >
              <div class="sidebar-group__items">
                <template v-for="sub in group.groups ?? []" :key="sub.title">
                  <div class="sidebar-subgroup">{{ sub.title }}</div>
                  <q-sidebar-menu-button
                    v-for="item in sub.items"
                    :key="item.link"
                    :label="item.title"
                    :href="item.link"
                    :active="isActive(item.link)"
                  />
                </template>
                <q-sidebar-menu-button
                  v-for="item in group.items ?? []"
                  :key="item.link"
                  :label="item.title"
                  :href="item.link"
                  :active="isActive(item.link)"
                />
              </div>
            </q-collapse>
          </div>
        </q-sidebar-content>
      </q-sidebar>

      <q-page class="docs-content">
        <slot />
      </q-page>
    </div>
  </q-app>
</template>

<style scoped>
.logo {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
}
.logo b {
  color: var(--primary);
}

.docs-body {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  align-items: flex-start;
  /* La page scrolle normalement ; la sidebar est sticky (reste collée en haut) */
}

.docs-content {
  min-width: 0;
  flex: 1 1 auto;
  padding: 32px 40px 64px;
  background: #fff;
}

.side-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 56px;
  padding: 0 12px;
  border-bottom: 1px solid var(--q-sidebar-border, rgb(0 0 0 / 0.08));
}

.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  border-radius: 8px;
  padding: 2px 4px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.logo-link:hover {
  opacity: 0.8;
}

.sidebar-group :deep(.q-collapse__label) {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8b93a1;
}

.sidebar-group :deep(.q-collapse__header) {
  padding: 10px 12px;
}

.sidebar-group__items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px 0 6px 12px;
}

.sidebar-subgroup {
  padding: 10px 12px 3px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #8b93a1;
}

/* Le bouton fermer n'est utile qu'en mode offcanvas (mobile) */
.side-close {
  display: none;
}
@media (max-width: 1023px) {
  .side-close {
    display: inline-flex;
  }
}

@media (max-width: 768px) {
  .docs-content {
    padding: 20px 16px 48px;
  }
}
</style>
