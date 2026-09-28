<script setup lang="ts">
// Démos live de la page Bottom Sheet (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "variants" | "trigger" | "breakpoints" | "seamless"
}>()

const open = ref(false)
const openTall = ref(false)
const openBreakpoints = ref(false)
const openSeamless = ref(false)
const query = ref("")
/** surface de la démo « variants » : "plain" | "translucent" | "glass" */
const SURFACES = ["plain", "translucent", "glass"] as const
const surface = ref<(typeof SURFACES)[number]>("translucent")
/** variantes d'ombre proposées dans la démo « seamless » */
const SHADOWS = [
  { label: "default", value: true },
  { label: "softer", value: "0 -1px 6px rgb(0 0 0 / 0.05)" },
  { label: "none", value: false },
  { label: "strong", value: "0 -8px 32px rgb(0 0 0 / 0.35)" },
] as const
const shadow = ref<boolean | string>(true)
/** Point d'ancrage courant (`v-model:breakpoint`) — 0.25 = le plus bas */
const breakpoint = ref(0.25)
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

  <div v-else-if="demo === 'variants'" class="demo-stack">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          v-for="value in SURFACES"
          :key="value"
          flat
          no-caps
          :color="surface === value ? 'primary' : ''"
          :label="value"
          @click="surface = value"
        />
      </q-btn-group>
    </div>

    <q-bottom-sheet
      v-model="openTall"
      height="70%"
      rounded="24px"
      :translucent="surface === 'translucent'"
      :glass="surface === 'glass'"
    >
      <template #trigger>
        <q-btn outline label="Tall sheet" />
      </template>
      <q-bottom-sheet-header title="Quick actions" :description="`surface: ${surface}`" />
      <div class="demo-sheet-body">
        <p class="demo-p">
          <code>height</code> fixes the panel height, <code>rounded</code> accepts a CSS
          value, <code>translucent</code> gives a frosted-glass background (opacity from
          <code>--q-translucent-opacity</code>) and <code>glass</code> a stronger
          glassmorphism — same recipe as <code>q-header</code> / <code>q-footer</code>, with a
          light border.
        </p>
      </div>
    </q-bottom-sheet>

    <p class="demo-meta">
      translucent = {{ surface === "translucent" }} · glass = {{ surface === "glass" }} —
      <code>glass</code> l'emporte si les deux sont passés.
    </p>
  </div>

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

  <div v-else-if="demo === 'seamless'" class="demo-stack">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          v-for="option in SHADOWS"
          :key="option.label"
          flat
          no-caps
          :color="shadow === option.value ? 'primary' : ''"
          :label="option.label"
          @click="shadow = option.value"
        />
      </q-btn-group>
    </div>

    <q-bottom-sheet v-model="openSeamless" seamless rounded="0" width="100%" :shadow="shadow">
      <template #trigger>
        <q-btn color="primary" icon="lucide:panels-bottom" label="Open seamless sheet" />
      </template>

      <q-bottom-sheet-header
        title="Quick search"
        description="No backdrop: the page stays visible and clickable"
      />

      <div class="demo-sheet-body">
        <q-input v-model="query" dense outlined placeholder="Rechercher…" />
        <p class="demo-p" style="margin-top: 12px">
          The sheet floats over the page: no dim, no click blocker, and a softened shadow by
          default (pick another one above). Close it with Escape, the browser back gesture or
          the button below.
        </p>
      </div>

      <q-bottom-sheet-footer>
        <q-btn flat label="Close" @click="openSeamless = false" />
      </q-bottom-sheet-footer>
    </q-bottom-sheet>

    <p class="demo-meta">
      shadow =
      <code>{{ shadow === true ? "true (softened)" : shadow === false ? "false" : shadow }}</code>
    </p>
  </div>

  <q-bottom-sheet
    v-else
    v-model="openBreakpoints"
    v-model:breakpoint="breakpoint"
    :breakpoints="[0.25, 0.5, 0.75]"
  >
    <template #trigger>
      <q-btn color="primary" icon="lucide:map" label="Open sheet (breakpoints)" />
    </template>

    <q-bottom-sheet-header
      title="Places nearby"
      :description="`Breakpoint: ${breakpoint}`"
    />

    <div class="demo-sheet-body">
      <p class="demo-p">
        Drag the handle — or press <code>Enter</code> / <code>Space</code> on it — to move
        between 25 %, 50 % and 75 % of the viewport. The list below stays scrollable at
        every breakpoint: the handle drives the height, never the scroll.
      </p>
      <p v-for="n in 24" :key="n" class="demo-p demo-sheet-row">Row {{ n }}</p>
    </div>
  </q-bottom-sheet>
</template>

<style scoped>
/* contenu du panneau (rendu dans le slot de q-bottom-sheet) */
.demo-sheet-body {
  padding: 16px 20px;
}

/* lignes de la démo « breakpoints » : assez nombreuses pour que le contenu déborde */
.demo-sheet-row {
  padding: 10px 0;
  margin: 0;
  border-bottom: 1px dashed rgb(0 0 0 / 0.06);
}
</style>
