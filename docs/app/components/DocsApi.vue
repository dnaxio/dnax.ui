<script setup lang="ts">
// DocsApi — bloc API d'un composant : onglets Props / Slots / Events / Methods.
// Props lus sur la définition runtime ; slots / events / methods analysés depuis
// la source SFC (componentSource). Les onglets vides sont masqués.
import { computed, ref } from "vue"
import { emitsOf, methodsOf, propsTableOf, slotsOf } from "~/composables/useComponentDocs"
import DocsPropsTable from "~/components/DocsPropsTable.vue"

const props = defineProps<{
  /** Définition runtime du composant (useComponent("QAccordion")) */
  comp: any
  /** Source SFC brute (componentSource("QAccordion")) */
  source?: string
}>()

const propsList = computed(() => propsTableOf(props.comp, props.source))
const slots = computed(() => slotsOf(props.source))
const events = computed(() => emitsOf(props.comp, props.source))
const methods = computed(() => methodsOf(props.source))

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
  ...(events.value.length
    ? [{ name: "events", label: "Events", icon: "lucide:radio" }]
    : []),
  ...(methods.value.length
    ? [{ name: "methods", label: "Methods", icon: "lucide:braces" }]
    : []),
])

const active = ref<string | number>("props")

const slotDescription = (name: string) =>
  name === "default"
    ? "Default slot — main content of the component."
    : `Named slot — pass content via <template #${name}>.`
</script>

<template>
  <div class="docs-api ">

    <q-tabs
      v-model="active"
      no-caps
      align="left"
      dense
      active-color="primary"
      indicator-color="primary"
      switch-indicator-position
      class="docs-api__tabs"
    >
      <q-tab v-for="t in tabs" :key="t.name" :name="t.name" :icon="t.icon" :label="t.label" />
    </q-tabs>



   <div class="!pt-2"> <q-tab-panels v-model="active" animated class="docs-api__panels">
     <!-- Props -->
     <q-tab-panel name="props">
       <div v-if="!comp" class="doc-empty">Loading…</div>
       <docs-props-table v-else :rows="propsList" />
     </q-tab-panel>

     <!-- Slots -->
     <q-tab-panel v-if="slots.length" name="slots">
       <div class="doc-table-wrap">
         <table class="doc-table">
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
       <div class="doc-table-wrap">
         <table class="doc-table">
           <thead>
             <tr>
               <th>Name</th>
               <th>Payload</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="e in events" :key="e.name">
               <td><code>{{ e.name }}</code></td>
               <td><code v-if="e.payload">{{ e.payload }}</code><span v-else>—</span></td>
             </tr>
           </tbody>
         </table>
       </div>
     </q-tab-panel>

     <!-- Methods -->
     <q-tab-panel v-if="methods.length" name="methods">
       <div class="doc-table-wrap">
         <table class="doc-table">
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
   </q-tab-panels></div>
  </div>
</template>

<style scoped>
.docs-api {
  border: 1px solid rgb(0 0 0 / 0.08);
  background: #fafbfc;
  padding: 18px;
  overflow: hidden;
  margin-top: 14px;
}
.docs-api__tabs {
  background: #f6f7f9;
}
.doc-empty {
  padding: 12px 4px;
  font-size: 13.5px;
  color: #8b93a1;
}
</style>
