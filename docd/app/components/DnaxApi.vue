<script setup lang="ts">
// Bloc API d'un composant dnax.ui : onglets Props / Slots / Events / Methods.
// Props lues sur la définition runtime ; slots / events / methods analysés depuis
// la source SFC du composant. Les onglets vides sont masqués.
import { computed, ref } from "vue"
import { componentMeta, componentTag, propsTableOf } from "~/composables/useComponentDocs"
import DnaxPropsTable from "~/components/DnaxPropsTable.vue"

const props = defineProps<{
  /** Export du composant dans @dnax/ui (ex. "QBtn") */
  name: string
}>()

// Import résolu pendant le setup (top-level await) : les tables d'API sont donc
// présentes dès le prerender, sans état « Loading… » dans le HTML statique.
const runtime = await import("@dnax/ui/runtime")

const comp = computed(() => (runtime as Record<string, any>)[props.name] ?? null)
const tag = computed(() => componentTag(props.name))
const meta = computed(() => componentMeta(props.name))

const propsList = computed(() => propsTableOf(comp.value, meta.value?.values))
const slots = computed(() => meta.value?.slots ?? [])
const events = computed(() => meta.value?.events ?? [])
const methods = computed(() => meta.value?.methods ?? [])

interface ApiTab {
  name: string
  label: string
  icon: string
}

const tabs = computed<ApiTab[]>(() => [
  { name: "props", label: "Props", icon: "lucide:list" },
  ...(slots.value.length
    ? [{ name: "slots", label: "Slots", icon: "lucide:layout-template" }]
    : []),
  ...(events.value.length ? [{ name: "events", label: "Events", icon: "lucide:radio" }] : []),
  ...(methods.value.length ? [{ name: "methods", label: "Methods", icon: "lucide:braces" }] : []),
])

const active = ref<string | number>("props")

const slotDescription = (name: string) =>
  name === "default"
    ? "Default slot — main content of the component."
    : `Named slot — pass content via <template #${name}>.`
</script>

<template>
  <div class="dnax-api not-prose">
    <div class="dnax-api__head">
      <code class="dnax-api__tag">&lt;{{ tag }}&gt;</code>
    </div>

    <q-tabs
      v-model="active"
      no-caps
      align="left"
      dense
      active-color="primary"
      indicator-color="primary"
      switch-indicator-position
    >
      <q-tab v-for="t in tabs" :key="t.name" :name="t.name" :icon="t.icon" :label="t.label" />
    </q-tabs>

    <q-tab-panels v-model="active" animated>
      <!-- Props -->
      <q-tab-panel name="props">
        <div v-if="!comp" class="dnax-api__empty">Loading…</div>
        <dnax-props-table v-else :rows="propsList" />
      </q-tab-panel>

      <!-- Slots -->
      <q-tab-panel v-if="slots.length" name="slots">
        <div class="dnax-table-wrap">
          <table class="dnax-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in slots" :key="s.name">
                <td><code>{{ s.name }}</code></td>
                <td>{{ slotDescription(s.name) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-tab-panel>

      <!-- Events -->
      <q-tab-panel v-if="events.length" name="events">
        <div class="dnax-table-wrap">
          <table class="dnax-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Payload</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in events" :key="e.name">
                <td><code>{{ e.name }}</code></td>
                <td>
                  <code v-if="e.payload">{{ e.payload }}</code>
                  <span v-else class="dnax-api__dash">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-tab-panel>

      <!-- Methods -->
      <q-tab-panel v-if="methods.length" name="methods">
        <div class="dnax-table-wrap">
          <table class="dnax-table">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in methods" :key="m.name">
                <td><code>{{ m.name }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style scoped>
.dnax-api {
  margin: 1rem 0;
  padding: 0.75rem;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 0.75rem;
}
.dnax-api__head {
  margin-bottom: 0.5rem;
}
.dnax-api__tag {
  font-size: 13px;
  color: var(--primary, #1976d2);
  background: rgb(25 118 210 / 0.08);
  padding: 2px 8px;
  border-radius: 6px;
}
.dnax-api__empty {
  padding: 10px 4px;
  font-size: 13.5px;
  color: #8b93a1;
}
.dnax-api__dash {
  color: #b3bac6;
}
</style>
