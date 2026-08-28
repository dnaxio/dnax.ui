<script setup lang="ts">
// Table des props d'un composant (utilisée par les pages docs).
// Styles (.doc-table…) partagés dans docs/app/assets/css/main.css.
defineProps<{
  rows: { name: string; type: string; required: boolean; default: string }[]
}>()
</script>

<template>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Required</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in rows" :key="p.name">
          <td><code>{{ p.name }}</code></td>
          <td><code>{{ p.type }}</code></td>
          <td><code>{{ p.default }}</code></td>
          <td>{{ p.required ? "yes" : "no" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
