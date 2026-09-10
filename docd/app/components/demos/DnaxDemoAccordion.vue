<script setup lang="ts">
// Démos live de la page Accordion (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "single" | "multiple"
}>()

const open = ref<string | string[]>("intro")
const openMultiple = ref<string[]>(["a"])
</script>

<template>
  <q-accordion
    v-if="demo === 'single'"
    v-model="open"
    type="single"
    collapsible
    class="demo-acc"
  >
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

  <q-accordion
    v-else-if="demo === 'multiple'"
    v-model="openMultiple"
    type="multiple"
    class="demo-acc"
  >
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
</template>

<style scoped>
.demo-acc {
  width: 100%;
  max-width: 560px;
}
</style>
