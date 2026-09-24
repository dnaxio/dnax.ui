<script setup lang="ts">
// Bloc API d'une **marque de graphique** (`bar`, `line`, `dot`, `image`, `text`, `rule`…).
// Les options viennent de `packages/ui/lib/chart.ts` — `MARK_OPTIONS` (clés acceptées par la
// marque) et le JSDoc de `QChartMark` (type + description) — analysés au build par
// `scripts/mark-parse.ts` → module virtuel `#build/dnax-ui-meta.mjs`.
// Sur chaque page `/docs/charts/<marque>` : cette table **puis** l'API de `<q-chart>`.
import { computed } from "vue"
import { markMeta } from "~/composables/useComponentDocs"

const props = defineProps<{
  /** Type de la marque documentée (ex. "bar") */
  mark: string
}>()

const options = computed(() => markMeta(props.mark)?.options ?? [])
</script>

<template>
  <div class="dnax-mark not-prose">
    <div class="dnax-mark__head">
      <code class="dnax-mark__tag">{ type: '{{ mark }}', … }</code>
    </div>

    <p v-if="!options.length" class="dnax-mark__empty">Loading…</p>

    <div v-else class="dnax-table-wrap">
      <table class="dnax-table">
        <thead>
          <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in options" :key="o.key">
            <td>
              <code>{{ o.key }}</code>
            </td>
            <td>
              <code>{{ o.type }}</code>
            </td>
            <td>
              {{ o.description }}
              <span v-if="o.values?.length" class="dnax-mark__values">
                — <code>{{ o.values.join(" | ") }}</code>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dnax-mark {
  margin: 1rem 0;
  padding: 0.75rem;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 0.75rem;
}
.dnax-mark__head {
  margin-bottom: 0.5rem;
}
.dnax-mark__tag {
  font-size: 13px;
  color: var(--primary, #1976d2);
  background: rgb(25 118 210 / 0.08);
  padding: 2px 8px;
  border-radius: 6px;
}
.dnax-mark__values {
  color: #6b7280;
}
.dnax-mark__empty {
  padding: 10px 4px;
  font-size: 13.5px;
  color: #8b93a1;
}
</style>
