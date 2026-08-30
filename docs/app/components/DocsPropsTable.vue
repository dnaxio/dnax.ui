<script setup lang="ts">
// Table des props d'un composant (utilisée par les pages docs).
// La colonne « Values » (valeurs possibles, littéraux de chaînes analysés dans la
// source) n'apparaît que si au moins une prop en expose.
// Styles (.doc-table…) partagés dans docs/app/assets/css/main.css.
import { computed } from "vue"

const props = defineProps<{
  rows: { name: string; type: string; required: boolean; default: string; values?: string[] }[]
}>()

const hasValues = computed(() => props.rows.some((r) => r.values?.length))
</script>

<template>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th v-if="hasValues">Values</th>
          <th>Default</th>
          <th>Required</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in rows" :key="p.name">
          <td><code>{{ p.name }}</code></td>
          <td><code>{{ p.type }}</code></td>
          <td v-if="hasValues">
            <code v-if="p.values?.length">{{ p.values.join(" | ") }}</code>
            <span v-else class="doc-none">—</span>
          </td>
          <td><code>{{ p.default }}</code></td>
          <td>{{ p.required ? "yes" : "no" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.doc-none {
  color: #b3bac6;
}
</style>
