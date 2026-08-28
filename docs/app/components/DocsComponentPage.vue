<script setup lang="ts">
// Page docs générique d'un composant : démo (Preview/Code) + props (+ parties d'une famille).
import { computed, ref, watchEffect } from "vue"
import { componentTag, propsTableOf, useComponent } from "~/composables/useComponentDocs"
import DocsPropsTable from "~/components/DocsPropsTable.vue"
import DocsDemo from "~/components/DocsDemo.vue"

interface Part {
  title: string
  export: string
}

const props = defineProps<{
  /** Titre affiché (ex. "Accordion") */
  title: string
  /** Export dans @dnax/ui (ex. "QAccordion") */
  export: string
  /** Parties d'une famille (ex. AccordionItem, AccordionTrigger, AccordionContent) */
  parts?: Part[]
}>()

const tag = computed(() => componentTag(props.export))
const usageCode = computed(() => `<${tag.value} />`)
const comp = useComponent(() => props.export)
const propsList = computed(() => propsTableOf(comp.value))

// — Parties (familles) : chargées pour leurs props —
const loadedParts = ref<(Part & { tag: string; usage: string; comp: any; props: ReturnType<typeof propsTableOf> })[]>([])
watchEffect(async () => {
  loadedParts.value = []
  if (!props.parts?.length) return
  const mod = await import("@dnax/ui/runtime")
  loadedParts.value = props.parts.map((p) => {
    const c = (mod as any)[p.export] ?? null
    const t = componentTag(p.export)
    return { ...p, tag: t, usage: `<${t} />`, comp: c, props: propsTableOf(c) }
  })
})
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">{{ title }}</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <section class="doc-section">
      <h2 class="doc-h2">Example</h2>
      <docs-demo :code="usageCode" lang="html" filename="example.vue">
        <component :is="comp" v-if="comp" />
        <q-inner-loading v-else :showing="true" />
      </docs-demo>
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">Props</h2>
      <docs-props-table :rows="propsList" />
    </section>

    <!-- Parties d'une famille -->
    <template v-for="part in loadedParts" :key="part.export">
      <section class="doc-section">
        <h2 class="doc-h2">{{ part.title }}</h2>
        <docs-demo :code="part.usage" lang="html" filename="example.vue">
          <component :is="part.comp" v-if="part.comp" />
          <q-inner-loading v-else :showing="true" />
        </docs-demo>
        <docs-props-table :rows="part.props" class="doc-part-props" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-section {
  margin-bottom: 36px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-part-props {
  margin-top: 14px;
}
</style>
