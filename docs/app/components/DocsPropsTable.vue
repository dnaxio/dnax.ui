<script setup lang="ts">
// Table des props d'un composant (utilisée par les pages docs).
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

<style scoped>
.doc-table-wrap {
  overflow-x: auto;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
}
.doc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.doc-table th,
.doc-table td {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
}
.doc-table th {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
  background: #f6f7f9;
}
.doc-table tr:last-child td {
  border-bottom: none;
}
.doc-table code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 12.5px;
}
</style>
