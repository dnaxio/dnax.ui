<script setup lang="ts">
// Démos live de la page Numeric Keyboard : code PIN (points de progression intégrés),
// rangées de points (tailles de points), pavé à disposition aléatoire, état d'erreur,
// montant (mode decimal) et variantes (dense, dark, disable, colonnes, séparateur).
import { computed, ref, useTemplateRef } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "pin" | "dots" | "random" | "error" | "amount" | "states"
}>()

// — code PIN : points intégrés (`show-dots`) + `@complete` —
const pin = ref("")
const PIN_LENGTH = 6
const submitted = ref<string | null>(null)
const onComplete = (value: string) => {
  submitted.value = value
  setTimeout(() => {
    pin.value = ""
    submitted.value = null
  }, 1200)
}

// — rangées de points —
const dotted = ref("12")
const growing = ref("0406")

// — disposition aléatoire —
const randomPin = ref("")
const randomSubmitted = ref<string | null>(null)
const shuffles = ref(0)
const pad = useTemplateRef<{ shuffle: () => void }>("pad")

const reshuffle = () => {
  pad.value?.shuffle()
  shuffles.value++
}

const onRandomComplete = (value: string) => {
  randomSubmitted.value = value
  // Nouvelle disposition pour la saisie suivante
  reshuffle()
  setTimeout(() => {
    randomPin.value = ""
    randomSubmitted.value = null
  }, 1200)
}

// — état d'erreur —
const ERROR_CODE = "123456"
const ERROR_LENGTH = 6
const errorPin = ref("")
const error = ref(false)
const errorMessage = ref("")
const onErrorComplete = (value: string) => {
  const ok = value === ERROR_CODE
  error.value = !ok
  errorMessage.value = ok ? "" : "Code incorrect. Réessayez."
}

// — montant —
const amount = ref("")
const amountDisplay = computed(() => {
  if (!amount.value || amount.value === "0,") return "0,00 €"
  const value = Number(amount.value.replace(",", "."))
  return Number.isFinite(value)
    ? value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
    : "0,00 €"
})

// — variantes —
const demoValue = ref("")
const denseValue = ref("12")
const darkValue = ref("")
const columns = ref(3)
</script>

<template>
  <!-- 1. Code PIN : points de progression intégrés, validation automatique -->
  <div v-if="demo === 'pin'" class="demo-stack">
    <p class="demo-meta demo-meta--lead" aria-live="polite">
      <template v-if="submitted">Code complet : <code>{{ submitted }}</code> — envoi simulé…</template>
      <template v-else>
        Les points se remplissent au fil de la saisie ; <code>@complete</code> se déclenche au
        6<sup>e</sup> chiffre.
      </template>
    </p>

    <q-numeric-keyboard
      v-model="pin"
      show-dots
      :max-length="PIN_LENGTH"
      label="Code à 6 chiffres"
      @complete="onComplete"
    />
  </div>

  <!-- 2. Rangées de points : total imposé, taille des points, ou un point par chiffre -->
  <div v-else-if="demo === 'dots'" class="demo-stack">
    <div class="demo-row demo-row--start">
      <div class="demo-col demo-col--tight">
        <p class="demo-label">
          <code>show-dots</code> + <code>dots="4"</code> + <code>dots-size="18"</code>
        </p>
        <q-numeric-keyboard v-model="dotted" show-dots :dots="4" :dots-size="18" />
        <span class="demo-meta">v-model = <code>{{ JSON.stringify(dotted) }}</code></span>
      </div>

      <div class="demo-col demo-col--tight">
        <p class="demo-label"><code>show-dots</code> seul (champ masqué)</p>
        <q-numeric-keyboard v-model="growing" show-dots dense label="Champ masqué" />
        <span class="demo-meta">v-model = <code>{{ JSON.stringify(growing) }}</code></span>
      </div>
    </div>

    <p class="demo-p">
      Sans <code>max-length</code> ni <code>dots</code>, la rangée grandit d'un point à chaque
      chiffre — un champ masqué. <code>dots</code> fixe un total indépendant de
      <code>max-length</code>, <code>dots-size</code> règle la taille des points (nombre = px, ou
      valeur CSS) et <code>max-length</code> seul suffit pour un code.
    </p>
  </div>

  <!-- 3. Disposition aléatoire : stable pendant la saisie, relancée par `shuffle()` -->
  <div v-else-if="demo === 'random'" class="demo-stack">
    <div class="demo-row">
      <q-btn flat no-caps icon="lucide:shuffle" label="Mélanger" @click="reshuffle" />
      <span class="demo-meta">
        mélanges : <code>{{ shuffles }}</code> — v-model = <code>{{ JSON.stringify(randomPin) }}</code>
      </span>
    </div>

    <q-numeric-keyboard
      ref="pad"
      v-model="randomPin"
      random
      show-dots
      :max-length="4"
      label="Code à 4 chiffres, disposition aléatoire"
      @complete="onRandomComplete"
    />

    <p class="demo-meta" aria-live="polite">
      <template v-if="randomSubmitted">
        Code complet : <code>{{ randomSubmitted }}</code> — nouvelle disposition…
      </template>
      <template v-else>
        La disposition est tirée une fois (côté client) puis reste stable pendant la saisie ;
        elle se relance via <code>shuffle()</code>, ici à chaque code et au bouton
        « Mélanger ».
      </template>
    </p>
  </div>

  <!-- 4. État d'erreur : points rouges + message, remis à zéro quand on efface tout -->
  <div v-else-if="demo === 'error'" class="demo-stack">
    <p class="demo-meta demo-meta--lead">
      Tapez <code>{{ ERROR_CODE }}</code> (bon code) ou autre chose : <code>error</code> passe à
      vrai, les points passent en rouge et le message s'affiche. Effacez tout (<code>⌫</code> ou
      <code>C</code>) : le pavé revient à l'état initial et <code>update:error</code> repasse à
      faux.
    </p>

    <q-numeric-keyboard
      v-model="errorPin"
      v-model:error="error"
      show-dots
      :dots-size="16"
      :max-length="ERROR_LENGTH"
      :error-message="errorMessage"
      label="Code à 6 chiffres avec état d'erreur"
      @complete="onErrorComplete"
    />

    <p class="demo-meta">
      error = <code>{{ error }}</code> — v-model = <code>{{ JSON.stringify(errorPin) }}</code>
    </p>
  </div>

  <!-- 5. Montant : mode decimal, 2 décimales, tout effacer -->
  <div v-else-if="demo === 'amount'" class="demo-stack">
    <div class="demo-amount">
      <span class="demo-amount__label">Montant</span>
      <span class="demo-amount__value">{{ amountDisplay }}</span>
      <span class="demo-amount__raw">v-model = <code>{{ JSON.stringify(amount) }}</code></span>
    </div>

    <q-numeric-keyboard
      v-model="amount"
      mode="decimal"
      :max-decimals="2"
      :max-length="7"
      clearable
      label="Montant en euros"
    />
  </div>

  <!-- 6. Variantes : taille, thème, désactivation, colonnes, séparateur -->
  <div v-else class="demo-stack">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          v-for="count in [3, 4]"
          :key="count"
          flat
          no-caps
          :color="columns === count ? 'primary' : ''"
          :label="`${count} colonnes`"
          @click="columns = count"
        />
      </q-btn-group>
      <span class="demo-meta">v-model = <code>{{ JSON.stringify(demoValue) }}</code></span>
    </div>

    <div class="demo-row demo-row--start">
      <div class="demo-col demo-col--tight">
        <p class="demo-label">dense</p>
        <q-numeric-keyboard v-model="denseValue" dense :columns="columns" clearable />
      </div>

      <div class="demo-col demo-col--tight">
        <p class="demo-label">dark</p>
        <div class="demo-dark-stage">
          <q-numeric-keyboard v-model="darkValue" dark :columns="columns" mode="decimal" decimal-separator="." />
        </div>
      </div>

      <div class="demo-col demo-col--tight">
        <p class="demo-label">disable</p>
        <q-numeric-keyboard model-value="12" disable dense :columns="columns" mode="decimal" />
      </div>
    </div>

    <p class="demo-p">
      <code>columns</code> reflue la grille (4 colonnes = 3 rangées), <code>dense</code>
      réduit la hauteur des touches, <code>dark</code> force le thème sombre et
      <code>decimal-separator</code> suit la locale de l'application.
    </p>
  </div>
</template>

<style scoped>
.demo-col--tight {
  gap: 6px;
}
.demo-row--start {
  align-items: flex-start;
}
.demo-meta--lead {
  margin: 0;
}

/* — affichage du montant — */
.demo-amount {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border: 1px solid var(--border, rgb(0 0 0 / 0.1));
  border-radius: 12px;
  background: var(--card, #fff);
}
.demo-amount__label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}
.demo-amount__value {
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.demo-amount__raw {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* — scène sombre pour la démo dark — */
.demo-dark-stage {
  padding: 12px;
  border-radius: 14px;
  background: #16181d;
}
</style>
