<script setup lang="ts">
// Démos live de la page Input Textarea (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "rows" | "autogrow" | "resize" | "counter" | "variants" | "states"
}>()

const bio = ref("")
const oneLine = ref("")
const sixLines = ref("")
// Valeur multiligne **initiale** : l'auto-extension doit la mesurer au montage.
const prefilled = ref(
  "A first line measured on mount.\nA second one.\nA third one — the field already has the right height before any keystroke.",
)
const capped = ref("")
const counted = ref("")
const outlinedVal = ref("")
const filledVal = ref("")
const borderlessVal = ref("")
const denseVal = ref("")
const readonlyVal = ref("Locked content — still selectable and copyable.")
const errorVal = ref("Too short.")
const hintVal = ref("")
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-field">
    <q-input-textarea v-model="bio" label="Bio" placeholder="Tell us about yourself…" />
  </div>

  <div v-else-if="demo === 'rows'" class="demo-col">
    <q-input-textarea v-model="oneLine" label="rows = 1" :rows="1" />
    <q-input-textarea v-model="bio" label="rows = 3 (default)" />
    <q-input-textarea v-model="sixLines" label="rows = 6" :rows="6" />
  </div>

  <div v-else-if="demo === 'autogrow'" class="demo-col">
    <q-input-textarea
      v-model="prefilled"
      label="Autogrow — prefilled"
      autogrow
      hint="Grows with the content."
    />
    <q-input-textarea v-model="capped" label="Autogrow — max 4 lines" autogrow :max-rows="4" hint="Beyond 4 lines the field scrolls." />
  </div>

  <div v-else-if="demo === 'resize'" class="demo-col">
    <q-input-textarea v-model="bio" label="resize = vertical" resize="vertical" />
    <q-input-textarea v-model="bio" label="resize = both" resize="both" :rows="2" />
  </div>

  <div v-else-if="demo === 'counter'" class="demo-row">
    <div class="demo-col">
      <q-input-textarea v-model="counted" label="Message" counter :maxlength="120" />
    </div>
  </div>

  <div v-else-if="demo === 'variants'" class="demo-col">
    <q-input-textarea v-model="outlinedVal" label="Outlined" outlined :rows="2" />
    <q-input-textarea v-model="filledVal" label="Filled" filled :rows="2" />
    <q-input-textarea v-model="borderlessVal" label="Borderless" borderless :rows="2" />
    <q-input-textarea v-model="denseVal" label="Dense" dense :rows="2" />
  </div>

  <div v-else-if="demo === 'states'" class="demo-col">
    <q-input-textarea v-model="hintVal" label="With a hint" hint="Markdown is supported." />
    <q-input-textarea
      v-model="errorVal"
      label="With an error"
      error
      error-message="Please write at least 20 characters."
    />
    <q-input-textarea v-model="readonlyVal" label="Readonly" readonly :rows="2" />
    <q-input-textarea v-model="bio" label="Disabled" disable placeholder="Write…" />
    <q-input-textarea v-model="prefilled" label="Clearable" clearable :rows="3" />
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 520px;
}

/* Colonne pleine largeur : les champs multilignes ont besoin de place. */
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 520px;
  min-width: 0;
}
</style>
