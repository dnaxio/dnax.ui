<script setup lang="ts">
// Docs — hub façon Quasar : welcome + recherche + catégories + démarrage rapide.
import { computed, ref } from "vue"
import { menuItems, type MenuItem } from "~/data/menu"

definePageMeta({ layout: "docs" })

const allItems = menuItems.flatMap((g) => [
  ...(g.items ?? []),
  ...(g.groups?.flatMap((sub) => sub.items) ?? []),
])
const componentCount = allItems.length

// — Recherche (filtre les catégories) —
const query = ref("")
const filteredGroups = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return menuItems
  return menuItems
    .map((g) => {
      const items = (g.items ?? []).filter((i) => i.title.toLowerCase().includes(q))
      const groups = (g.groups ?? [])
        .map((sub) => ({ ...sub, items: sub.items.filter((i) => i.title.toLowerCase().includes(q)) }))
        .filter((sub) => sub.items.length > 0)
      return { ...g, items, groups }
    })
    .filter((g) => (g.items?.length ?? 0) > 0 || (g.groups?.length ?? 0) > 0)
})
const hasResults = computed(() => filteredGroups.value.length > 0)

// — Most used (équivalent Quasar) —
const mostUsed = ["QBtn", "QInput", "QSelect", "QTable", "QCard"]
  .map((name) => allItems.find((i) => i.export === name))
  .filter((i): i is MenuItem => !!i)
</script>

<template>
  <div class="docs-home">
    <!-- ═══════════ Welcome ═══════════ -->
    <header class="docs-home__head">
      <h1 class="docs-home__title">Welcome to Dnax UI docs</h1>
      <p class="docs-home__sub">
        Everything you need to build with Dnax UI : {{ componentCount }} Vue 3 components,
        simple syntax, CSS-token theming, Iconify icons, mobile-ready. Use the sidebar to
        navigate, or search below.
      </p>
      <q-input
        v-model="query"
        outlined
        clearable
        placeholder="Search components…"
        class="docs-home__search"
      >
        <template #prepend>
          <q-icon name="lucide:search" color="primary" />
        </template>
      </q-input>
    </header>

    <!-- ═══════════ Most used ═══════════ -->
    <section v-if="!query" class="docs-section">
      <h2 class="docs-home__h2">Most used</h2>
      <div class="docs-chips">
        <q-btn
          v-for="item in mostUsed"
          :key="item.link"
          flat
          no-caps
          color="primary"
          :label="item.title"
          :href="item.link"
        />
      </div>
    </section>

    <!-- ═══════════ Components par catégorie ═══════════ -->
    <section class="docs-section">
      <h2 class="docs-home__h2">Components</h2>
      <div v-if="hasResults" class="docs-cats">
        <div v-for="group in filteredGroups" :key="group.title" class="docs-cat">
          <h3 class="docs-cat__title">{{ group.title }}</h3>
          <div class="docs-cat__links">
            <template v-for="sub in group.groups ?? []" :key="sub.title">
              <q-btn
                v-for="item in sub.items"
                :key="item.link"
                flat
                dense
                no-caps
                color="primary"
                :label="item.title"
                :href="item.link"
              />
            </template>
            <q-btn
              v-for="item in group.items ?? []"
              :key="item.link"
              flat
              dense
              no-caps
              color="primary"
              :label="item.title"
              :href="item.link"
            />
          </div>
        </div>
      </div>
      <p v-else class="docs-home__empty">No component matches “{{ query }}”.</p>
    </section>

    <!-- ═══════════ Getting started ═══════════ -->
    <section id="getting-started" class="docs-section">
      <h2 class="docs-home__h2">Getting started</h2>
      <div class="docs-cards">
        <q-card class="docs-card" bordered radius="lg">
          <q-icon name="lucide:download" color="primary" size="26px" />
          <h3 class="docs-card__title">Installation</h3>
          <p class="docs-card__text">Add the package, register the module, first component.</p>
          <q-btn flat no-caps color="primary" icon="lucide:arrow-right" label="Installation guide" href="/docs/getting-started/installation" />
        </q-card>

        <q-card class="docs-card" bordered radius="lg">
          <q-icon name="lucide:rocket" color="secondary" size="26px" />
          <h3 class="docs-card__title">Setup</h3>
          <p class="docs-card__text">First component, theming, CSS tokens and icons in five minutes.</p>
          <q-btn flat no-caps color="secondary" icon="lucide:arrow-right" label="Setup guide" href="/docs/getting-started/quick-start" />
        </q-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.docs-home {
  max-width: 960px;
}
.docs-home__head {
  margin-bottom: 36px;
}
.docs-home__title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.docs-home__sub {
  margin: 12px 0 0;
  max-width: 640px;
  font-size: 15.5px;
  line-height: 1.65;
  color: #5b6472;
}
.docs-home__search {
  max-width: 420px;
  margin-top: 20px;
}
.docs-section {
  margin-bottom: 40px;
}
.docs-home__h2 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}
.docs-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.docs-cats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}
.docs-cat {
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 14px;
  padding: 18px;
  background: #fff;
}
.docs-cat__title {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
}
.docs-cat__links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.docs-cat__links :deep(.q-btn) {
  font-size: 13px;
}
.docs-home__empty {
  color: #5b6472;
  font-size: 14.5px;
}
.docs-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
.docs-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.docs-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
}
.docs-card__text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: #5b6472;
}
.docs-card__text code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
