<script setup lang="ts">
// Table des props d'un composant dnax.ui (utilisée par les pages de contenu MDC).
// La colonne « Values » (valeurs possibles, littéraux analysés dans la source)
// n'apparaît que si au moins une prop en expose.
import { computed } from "vue"

const props = defineProps<{
  rows: { name: string; type: string; required: boolean; default: string; values?: string[] }[]
}>()

const hasValues = computed(() => props.rows.some((r) => r.values?.length))
</script>

<template>
  <div class="dnax-table-wrap">
    <table class="dnax-table">
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
            <span v-else class="dnax-none">—</span>
          </td>
          <td><code>{{ p.default }}</code></td>
          <td>{{ p.required ? "yes" : "no" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dnax-none {
  color: #b3bac6;
}
</style>
