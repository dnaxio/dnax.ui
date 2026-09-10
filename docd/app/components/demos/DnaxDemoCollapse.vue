<script setup lang="ts">
// Démos live de la page Collapse (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "icons" | "uncontrolled" | "states" | "custom"
}>()

const openBasic = ref(true)
const openIcons = ref(false)
const openCustom = ref(false)
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-collapse">
    <q-collapse v-model="openBasic" label="Account" caption="Profile, security and preferences">
      <p class="demo-p">
        The content is animated with a measured height (0 → auto) and stays
        mounted in the DOM — hidden with CSS, not unmounted.
      </p>
    </q-collapse>
  </div>

  <div v-else-if="demo === 'icons'" class="demo-collapse">
    <q-collapse
      v-model="openIcons"
      label="Security"
      caption="Two-factor authentication"
      icon-left="lucide:shield"
      icon-right="lucide:badge-check"
    >
      <p class="demo-p">Iconify icons on both sides of the header.</p>
    </q-collapse>
  </div>

  <div v-else-if="demo === 'uncontrolled'" class="demo-collapse">
    <q-collapse label="FAQ — What is Dnax UI?" default-opened>
      <p class="demo-p">
        Without a <code>v-model</code>, the collapse keeps its own internal state,
        initialized by <code>default-opened</code>.
      </p>
    </q-collapse>
  </div>

  <div v-else-if="demo === 'states'" class="demo-collapse demo-collapse--stack">
    <q-collapse label="Dense" caption="Compact header" dense>
      <p class="demo-p">A smaller header with <code>dense</code>.</p>
    </q-collapse>
    <q-collapse label="Disabled" disable>
      <p class="demo-p">Clicking the header does nothing.</p>
    </q-collapse>
  </div>

  <div v-else-if="demo === 'custom'" class="demo-collapse">
    <q-collapse v-model="openCustom" header-class="q-collapse__header--custom">
      <template #header>
        <q-icon name="lucide:sparkles" color="primary" />
        <span class="q-collapse__label">Custom header</span>
      </template>
      <p class="demo-p">Anything goes inside the <code>#header</code> slot.</p>
    </q-collapse>
  </div>
</template>

<style scoped>
.demo-collapse {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.demo-collapse--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
