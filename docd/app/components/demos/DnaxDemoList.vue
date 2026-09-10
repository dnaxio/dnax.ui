<script setup lang="ts">
// Démos live de la page List (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "container" | "basic" | "clickable" | "thumbnail" | "alignment" | "states"
}>()

// — Démos —
const contacts = [
  { name: "Alex Martin", initials: "AM", caption: "Online now", color: "positive" },
  { name: "Samira Chen", initials: "SC", caption: "Last seen 2h ago", color: "secondary" },
  { name: "Jules Dubois", initials: "JD", caption: "Offline", color: "negative" },
]

const activeMenu = ref("inbox")
const menu = [
  { key: "inbox", label: "Inbox", icon: "lucide:inbox", count: "12" },
  { key: "sent", label: "Sent", icon: "lucide:send", count: "3" },
  { key: "drafts", label: "Drafts", icon: "lucide:file-pen", count: "1" },
]

const thumbnail = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop"
</script>

<template>
  <div v-if="demo === 'container'" class="demo-stack">
    <q-list bordered separator class="demo-list">
      <q-item><q-item-section>Bordered + separator</q-item-section></q-item>
      <q-item><q-item-section>Second row</q-item-section></q-item>
    </q-list>
    <q-list dark class="demo-list">
      <q-item><q-item-section>Dark theme</q-item-section></q-item>
    </q-list>
  </div>

  <q-list v-else-if="demo === 'basic'" bordered separator class="demo-list">
    <q-item v-for="c in contacts" :key="c.name">
      <q-item-section avatar>
        <q-avatar :color="c.color" text-color="white">{{ c.initials }}</q-avatar>
      </q-item-section>
      <q-item-section>
        <div class="demo-item-title">{{ c.name }}</div>
        <div class="demo-item-caption">{{ c.caption }}</div>
      </q-item-section>
      <q-item-section side>
        <q-icon name="lucide:chevron-right" color="grey" />
      </q-item-section>
    </q-item>
  </q-list>

  <q-list v-else-if="demo === 'clickable'" bordered class="demo-list">
    <q-item
      v-for="m in menu"
      :key="m.key"
      clickable
      :active="activeMenu === m.key"
      @click="activeMenu = m.key"
    >
      <q-item-section avatar>
        <q-icon :name="m.icon" color="primary" />
      </q-item-section>
      <q-item-section>{{ m.label }}</q-item-section>
      <q-item-section side>
        <q-badge :label="m.count" color="primary" />
      </q-item-section>
    </q-item>
  </q-list>

  <q-list v-else-if="demo === 'thumbnail'" bordered class="demo-list">
    <q-item>
      <q-item-section thumbnail>
        <q-img :src="thumbnail" ratio="1" class="demo-thumb" />
      </q-item-section>
      <q-item-section>
        <div class="demo-item-title">Moraine Lake</div>
        <div class="demo-item-caption">Banff National Park, Canada</div>
      </q-item-section>
      <q-item-section side>
        <q-icon name="lucide:chevron-right" color="grey" />
      </q-item-section>
    </q-item>
  </q-list>

  <q-list v-else-if="demo === 'alignment'" bordered class="demo-list">
    <q-item>
      <q-item-section avatar>
        <q-icon name="lucide:bell" color="warning" size="22px" />
      </q-item-section>
      <q-item-section top>
        <div class="demo-item-title">New update available</div>
        <div class="demo-item-caption">v2.4.0 · 2 minutes ago · a longer description that wraps onto several lines to demonstrate the top alignment.</div>
      </q-item-section>
      <q-item-section side top>
        <q-icon name="lucide:x" />
      </q-item-section>
    </q-item>
  </q-list>

  <q-list v-else-if="demo === 'states'" bordered dense class="demo-list">
    <q-item :inset-level="1">
      <q-item-section>Indented item</q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section>Dense item</q-item-section>
    </q-item>
    <q-item disable>
      <q-item-section>Disabled item</q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped>
.demo-stack {
  gap: 12px;
  align-items: center;
}

.demo-list {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.demo-item-title {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--foreground);
}

.demo-item-caption {
  font-size: 12.5px;
  color: #8b93a1;
}

.demo-thumb {
  width: 56px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
