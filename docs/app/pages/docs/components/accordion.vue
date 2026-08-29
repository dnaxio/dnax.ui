<script setup lang="ts">
// Accordion — documentation complète de la famille :
// QAccordion + QAccordionItem + QAccordionTrigger + QAccordionContent.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const accordion = useComponent(() => "QAccordion")
const accordionItem = useComponent(() => "QAccordionItem")
const accordionTrigger = useComponent(() => "QAccordionTrigger")
const accordionContent = useComponent(() => "QAccordionContent")

const accordionSource = componentSource("QAccordion")
const accordionItemSource = componentSource("QAccordionItem")
const accordionTriggerSource = componentSource("QAccordionTrigger")
const accordionContentSource = componentSource("QAccordionContent")

const tag = componentTag("QAccordion")

// — Démo interactive —
const open = ref<string | string[]>("intro")
const openMultiple = ref<string[]>(["a"])

const usageSingle = `<q-accordion v-model="open" type="single" collapsible>
  <q-accordion-item value="intro">
    <q-accordion-trigger>Introduction</q-accordion-trigger>
    <q-accordion-content>
      <p>Le contenu de la section, repliable avec animation.</p>
    </q-accordion-content>
  </q-accordion-item>
</q-accordion>`

const usageMultiple = `<q-accordion v-model="openMultiple" type="multiple">
  <q-accordion-item value="a">…</q-accordion-item>
  <q-accordion-item value="b">…</q-accordion-item>
</q-accordion>`

const usageItem = `<q-accordion-item value="intro">
  <q-accordion-trigger>Introduction</q-accordion-trigger>
  <q-accordion-content>Contenu…</q-accordion-content>
</q-accordion-item>`

const usageTrigger = `<q-accordion-trigger label="Introduction" expand-icon="lucide:chevrons-down" />
<!-- ou avec un slot custom -->
<q-accordion-trigger>
  <q-icon name="lucide:sparkles" color="primary" />
  <span>Introduction</span>
</q-accordion-trigger>`

const usageContent = `<q-accordion-content>
  <p>Le contenu reste monté (caché par CSS grid 0fr → 1fr).</p>
</q-accordion-content>`

// — Scripts des démos (refs accompagnant les templates) —
const scriptSingle = `import { ref } from "vue"

const open = ref("intro")`

const scriptMultiple = `import { ref } from "vue"

const openMultiple = ref(["a"])`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Accordion</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Une liste de sections repliables — une seule ou plusieurs ouvertes. La famille
      comprend quatre composants : <b>&lt;q-accordion&gt;</b> (le conteneur),
      <b>&lt;q-accordion-item&gt;</b> (une section), <b>&lt;q-accordion-trigger&gt;</b>
      (le bouton d'ouverture) et <b>&lt;q-accordion-content&gt;</b> (le contenu animé).
    </p>

    <!-- ═══════ QAccordion ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QAccordion — conteneur</h2>

      <docs-demo :code="usageSingle" lang="html" filename="App.vue" :script="scriptSingle">
        <q-accordion v-model="open" type="single" collapsible class="demo-acc">
          <q-accordion-item value="intro">
            <q-accordion-trigger>Introduction</q-accordion-trigger>
            <q-accordion-content>
              <p class="demo-p">
                L'accordéon pilote l'état via <code>v-model</code> : une chaîne en
                mode <code>single</code>, un tableau en mode <code>multiple</code>.
              </p>
            </q-accordion-content>
          </q-accordion-item>
          <q-accordion-item value="theme">
            <q-accordion-trigger>Theming</q-accordion-trigger>
            <q-accordion-content>
              <p class="demo-p">
                Les couleurs et l'arrondi suivent les tokens CSS
                (<code>--primary</code>, <code>--q-radius</code>).
              </p>
            </q-accordion-content>
          </q-accordion-item>
          <q-accordion-item value="icons">
            <q-accordion-trigger>Icons</q-accordion-trigger>
            <q-accordion-content>
              <p class="demo-p">
                Les icônes passent par Iconify : <code>icon="lucide:star"</code>.
              </p>
            </q-accordion-content>
          </q-accordion-item>
        </q-accordion>
      </docs-demo>

      <h3 class="doc-h3">Multiple</h3>
      <docs-demo :code="usageMultiple" lang="html" filename="App.vue" :script="scriptMultiple">
        <q-accordion v-model="openMultiple" type="multiple" class="demo-acc">
          <q-accordion-item value="a">
            <q-accordion-trigger>Option A</q-accordion-trigger>
            <q-accordion-content>
              <p class="demo-p">Plusieurs sections peuvent rester ouvertes.</p>
            </q-accordion-content>
          </q-accordion-item>
          <q-accordion-item value="b">
            <q-accordion-trigger>Option B</q-accordion-trigger>
            <q-accordion-content>
              <p class="demo-p">Le <code>v-model</code> est un tableau de valeurs.</p>
            </q-accordion-content>
          </q-accordion-item>
        </q-accordion>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="accordion" :source="accordionSource" />
    </section>

    <!-- ═══════ QAccordionItem ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QAccordionItem — une section</h2>
      <p class="doc-note">
        Fournit la <code>value</code> (comparée au <code>v-model</code> du conteneur)
        et un identifiant unique aux enfants (pour <code>aria-controls</code>).
      </p>
      <q-syntax :code="usageItem" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="accordionItem" :source="accordionItemSource" />
    </section>

    <!-- ═══════ QAccordionTrigger ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QAccordionTrigger — le bouton</h2>
      <p class="doc-note">
        Le bouton d'ouverture : label ou slot custom, chevron orientable
        (<code>expand-icon</code>), état <code>aria-expanded</code> géré.
      </p>
      <q-syntax :code="usageTrigger" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="accordionTrigger" :source="accordionTriggerSource" />
    </section>

    <!-- ═══════ QAccordionContent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QAccordionContent — le contenu animé</h2>
      <p class="doc-note">
        Le contenu reste toujours monté dans le DOM — l'animation d'ouverture/fermeture
        est faite en CSS (<code>grid-template-rows: 0fr → 1fr</code>).
      </p>
      <q-syntax :code="usageContent" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="accordionContent" :source="accordionContentSource" />
    </section>
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
  margin-bottom: 16px;
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
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.demo-acc {
  width: 100%;
  max-width: 560px;
}

/* espace entre les deux blocs docs-demo (single / multiple) */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
