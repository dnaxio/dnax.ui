<script setup lang="ts">
// Démos live de la page Input Currency : valeur formatée, changement de devise/locale,
// bornes et pas clavier, intégration formulaire.
import { computed, ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "currencies" | "limits" | "form"
}>()

const price = ref<number | null>(1234.56)
const tax = ref<number | null>(null)
const total = computed(() => (price.value ?? 0) * 1.2)

// — devise & locale —
const currency = ref("EUR")
const locale = ref("fr-FR")
const CURRENCIES = ["EUR", "USD", "JPY", "GBP"]
const LOCALES = [
  { label: "fr-FR", value: "fr-FR" },
  { label: "en-US", value: "en-US" },
]
const converted = ref<number | null>(9999.5)

// — bornes —
const budget = ref<number | null>(150)
const donations = ref<number | null>(null)

// — formulaire —
const amount = ref<number | null>(49.9)
const submitted = ref<string | null>(null)
const onForm = (event: Event) => {
  const data = new FormData(event.target as HTMLFormElement)
  submitted.value = `amount = ${JSON.stringify(data.get("amount"))} (${typeof data.get("amount")})`
  event.preventDefault()
}
</script>

<template>
  <!-- 1. La valeur du v-model reste un nombre -->
  <div v-if="demo === 'basic'" class="demo-stack">
    <q-input-currency
      v-model="price"
      label="Prix unitaire"
      hint="Saisie formatée à la volée — le modèle reçoit un nombre"
      clearable
      outlined
    />

    <q-input-currency
      v-model="tax"
      label="TVA (facultatif)"
      placeholder="Laisser vide pour 0"
      outlined
      dense
    />

    <div class="demo-row demo-row--between">
      <span class="demo-meta">
        prix = <code>{{ price === null ? "null" : price }}</code> · TVA =
        <code>{{ tax === null ? "null" : tax }}</code>
      </span>
      <span class="demo-meta">total TTC (× 1,2) = <code>{{ total.toFixed(2) }}</code></span>
    </div>
  </div>

  <!-- 2. Devise et locale : symbole, place et décimales changent -->
  <div v-else-if="demo === 'currencies'" class="demo-stack">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          v-for="code in CURRENCIES"
          :key="code"
          flat
          no-caps
          :color="currency === code ? 'primary' : ''"
          :label="code"
          @click="currency = code"
        />
      </q-btn-group>

      <q-select
        v-model="locale"
        :options="LOCALES"
        option-label="label"
        option-value="value"
        emit-value
        map-options
        dense
        outlined
        label="locale"
        style="width: 150px"
      />
    </div>

    <q-input-currency
      v-model="converted"
      :currency="currency"
      :locale="locale"
      label="Montant"
      hint="Le symbole et sa place viennent d'Intl : « 1 234,56 € », « $1,234.56 », « ¥9,999 »…"
      outlined
    />

    <p class="demo-meta">
      currency = <code>{{ currency }}</code> · locale = <code>{{ locale }}</code> · v-model =
      <code>{{ converted }}</code>
    </p>
  </div>

  <!-- 3. Bornes, arrondi, pas clavier -->
  <div v-else-if="demo === 'limits'" class="demo-stack">
    <q-input-currency
      v-model="budget"
      label="Budget (0 – 1 000 €)"
      hint="Les bornes s'appliquent à la sortie du champ ; ↑ ↓ avancent de 10 (Maj : 100)"
      :min="0"
      :max="1000"
      :step="10"
      outlined
    />

    <q-input-currency
      v-model="donations"
      label="Don (négatif autorisé)"
      hint="allow-negative laisse saisir un avoir / une correction"
      allow-negative
      :decimals="3"
      outlined
    />

    <p class="demo-meta">
      budget = <code>{{ budget === null ? "null" : budget }}</code> · don =
      <code>{{ donations === null ? "null" : donations }}</code>
    </p>
  </div>

  <!-- 4. Formulaire : la valeur envoyée est brute -->
  <div v-else class="demo-stack">
    <form class="demo-stack demo-stack--tight" @submit="onForm">
      <q-input-currency
        v-model="amount"
        name="amount"
        label="Montant à régler"
        hint="`name` ajoute un input caché : le formulaire envoie un nombre, sans formatage"
        currency="EUR"
        outlined
      />
      <q-btn type="submit" unelevated no-caps color="primary" label="Envoyer" />
    </form>

    <p v-if="submitted" class="demo-meta">FormData → <code>{{ submitted }}</code></p>

    <div class="demo-stack demo-stack--tight">
      <p class="demo-label">États</p>
      <q-input-currency :model-value="1250" readonly label="readonly" outlined />
      <q-input-currency :model-value="99.9" disable label="disable" outlined />
      <q-input-currency
        :model-value="null"
        error
        error-message="Ce montant dépasse le plafond autorisé"
        label="error"
        outlined
      />
    </div>
  </div>
</template>

<style scoped>
.demo-stack--tight {
  gap: 10px;
}
.demo-row--between {
  justify-content: space-between;
}
</style>
