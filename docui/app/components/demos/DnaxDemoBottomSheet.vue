<script setup lang="ts">
// Démos live de la page Bottom Sheet (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "variants" | "trigger"
}>()

const open = ref(false)
const openTall = ref(false)
</script>

<template>
  <q-bottom-sheet v-if="demo === 'basic'" v-model="open">
    <template #trigger>
      <q-btn color="primary" icon="lucide:settings" label="Open settings" />
    </template>
    <q-bottom-sheet-header title="Settings" description="Tune your notifications and preferences" />
    <div class="demo-sheet-body">
      <p class="demo-p">
        Drag the handle down, tap the backdrop, or press Escape to close. The panel is
        anchored to the bottom edge and respects the iOS safe area.
      </p>
    </div>
    <q-bottom-sheet-footer>
      <q-btn flat label="Cancel" @click="open = false" />
      <q-btn color="primary" label="Save" @click="open = false" />
    </q-bottom-sheet-footer>
  </q-bottom-sheet>

  <q-bottom-sheet
    v-else-if="demo === 'variants'"
    v-model="openTall"
    height="70%"
    rounded="24px"
    translucent
  >
    <template #trigger>
      <q-btn outline label="Tall translucent sheet" />
    </template>
    <q-bottom-sheet-header title="Quick actions" description="height, rounded and translucent" />
    <div class="demo-sheet-body">
      <p class="demo-p">
        <code>height</code> fixes the panel height, <code>rounded</code> accepts a CSS
        value, and <code>translucent</code> enables a frosted-glass background.
      </p>
    </div>
  </q-bottom-sheet>

  <q-bottom-sheet v-else-if="demo === 'trigger'" v-model="open">
    <template #trigger>
      <q-bottom-sheet-trigger label="Open sheet" />
    </template>
    <q-bottom-sheet-header
      title="Bottom sheet"
      description="Component alternative to the #trigger slot"
    />
    <div class="demo-sheet-body">
      <p class="demo-p">
        QBottomSheetTrigger is the component alternative to the <code>#trigger</code>
        slot — same behavior, rendered as a standalone button.
      </p>
    </div>
  </q-bottom-sheet>
</template>

<style scoped>
/* contenu du panneau (rendu dans le slot de q-bottom-sheet) */
.demo-sheet-body {
  padding: 16px 20px;
}
</style>
