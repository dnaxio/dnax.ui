<script setup lang="ts">
// Démos live de la page Input (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo:
    | "basic"
    | "types"
    | "autogrow"
    | "variants"
    | "dense"
    | "clear"
    | "affixes"
    | "iconProps"
    | "mask"
    | "hint"
}>()

const text = ref("")
const email = ref("")
const password = ref("")
const age = ref<number | null>(null)
const bio = ref("")
const outlinedVal = ref("")
const filledVal = ref("")
const borderlessVal = ref("")
const denseVal = ref("")
const clearMe = ref("Hello Dnax")
const message = ref("")
const username = ref("")
const hintEmail = ref("")
const errorEmail = ref("")
const phone = ref("")
const code = ref("")
const birthDate = ref("")
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-field">
    <q-input v-model="text" label="Email" placeholder="you@example.com" />
  </div>

  <div v-else-if="demo === 'types'" class="demo-row">
    <div class="demo-col">
      <q-input v-model="email" type="email" label="Email" placeholder="you@example.com" />
    </div>
    <div class="demo-col">
      <q-input v-model="password" type="password" label="Password" />
    </div>
    <div class="demo-col">
      <q-input v-model="age" type="number" label="Age" />
    </div>
  </div>

  <div v-else-if="demo === 'autogrow'" class="demo-field">
    <q-input v-model="bio" label="Bio" autogrow placeholder="Write a few lines…" />
  </div>

  <div v-else-if="demo === 'variants'" class="demo-row">
    <div class="demo-col">
      <q-input v-model="outlinedVal" label="Outlined" outlined />
    </div>
    <div class="demo-col">
      <q-input v-model="filledVal" label="Filled" filled />
    </div>
    <div class="demo-col">
      <q-input v-model="borderlessVal" label="Borderless" borderless />
    </div>
  </div>

  <div v-else-if="demo === 'dense'" class="demo-field">
    <q-input v-model="denseVal" label="Dense pill" dense radius placeholder="Rounded" />
  </div>

  <div v-else-if="demo === 'clear'" class="demo-row">
    <div class="demo-col">
      <q-input v-model="clearMe" label="Clearable" clearable />
    </div>
    <div class="demo-col">
      <q-input v-model="message" label="Message" counter :maxlength="20" />
    </div>
  </div>

  <div v-else-if="demo === 'affixes'" class="demo-field">
    <q-input v-model="username" label="Username" prefix="@">
      <template #prepend><q-icon name="lucide:user" /></template>
      <template #append><q-icon name="lucide:badge-check" /></template>
    </q-input>
  </div>

  <div v-else-if="demo === 'iconProps'" class="demo-field">
    <q-input v-model="email" label="Email" icon-left="lucide:mail" icon-right="lucide:check" />
  </div>

  <div v-else-if="demo === 'mask'" class="demo-col">
    <q-input v-model="phone" label="Phone" mask="##-##-##-##" placeholder="12-34-56-78" outlined />
    <q-input v-model="code" label="Code" mask="XX-XX-XX" fill-mask placeholder="AB-CD-EF" outlined />
    <q-input v-model="birthDate" label="Date" mask="##/##/####" placeholder="15/08/1990" outlined />
  </div>

  <div v-else-if="demo === 'hint'" class="demo-row">
    <div class="demo-col">
      <q-input v-model="hintEmail" label="Email" type="email" hint="We never share your email." />
    </div>
    <div class="demo-col">
      <q-input v-model="errorEmail" label="Email" type="email" error error-message="Please enter a valid email address." />
    </div>
  </div>
</template>

<style scoped>
.demo-field {
  width: 100%;
  max-width: 520px;
}

/* Les colonnes de la page sont des colonnes de `demo-row` (source historique),
   d'où le `flex` + `align-items: stretch` pour que les champs prennent la largeur. */
.demo-col {
  flex: 1 1 220px;
  min-width: 0;
  align-items: stretch;
}
</style>
