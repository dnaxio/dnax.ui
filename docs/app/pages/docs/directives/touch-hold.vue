<script setup lang="ts">
// Docs — directive v-touch-hold : appui long (équivalent Quasar).
import { ref } from "vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const setupCode = `// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-touch-hold.mouse="onHold">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchHold } from "@dnax/ui"

app.directive("touch-hold", vTouchHold)`

const usageCode = `<div v-touch-hold.mouse="onHold">
  Press and hold me
</div>

<!-- délai personnalisé : 400ms, 8px tactile, 10px souris -->
<div v-touch-hold.mouse="'400:8:10'">…</div>

<!-- ou objet : 350ms, sensibilité 6px -->
<div v-touch-hold.mouse="{ time: 350, sensitivity: 6 }">…</div>`

const onHoldCode = `// Détails reçus :
// { evt, position: { left, top }, duration }
const onHold = ({ position, duration }) => {
  console.log('hold', duration + 'ms', position)
}`

// — Démo live — appui long par défaut (600ms) + version rapide (350ms) —
const count = ref(0)
const fastCount = ref(0)
const last = ref({ duration: 0, x: 0, y: 0 })

const onHold = (details: any) => {
  count.value++
  last.value = { duration: details.duration, x: Math.round(details.position.left), y: Math.round(details.position.top) }
}

const onFastHold = (details: any) => {
  fastCount.value++
  last.value = { duration: details.duration, x: Math.round(details.position.left), y: Math.round(details.position.top) }
}

const usageDemo = `<div class="hold-row">
  <button class="hold-pad" v-touch-hold.mouse="onHold">
    Hold 600ms
  </button>
  <button class="hold-pad hold-pad--fast" v-touch-hold.mouse="{ time: 350, sensitivity: 6 }" @click="fastCount++">
    Hold 350ms
  </button>
</div>

<p>holds: {{ count }} · fast: {{ fastCount }} · last:
  {{ last.duration }}ms at {{ last.x }}, {{ last.y }}</p>`

const scriptDemo = `import { ref } from "vue"

const count = ref(0)
const last = ref({ duration: 0, x: 0, y: 0 })

const onHold = ({ position, duration }) => {
  count.value++
  last.value = { duration, x: Math.round(position.left), y: Math.round(position.top) }
}`

const valueRows: { value: string; effect: string }[] = [
  { value: "handler", effect: "Appui maintenu 600 ms (défaut) — sensibilité 5px tactile / 7px souris." },
  { value: "nombre (ex. 400)", effect: "Délai d'appui personnalisé en ms." },
  { value: "'400:8:10'", effect: "Délai + sensibilité tactile + sensibilité souris (arg style Quasar)." },
  { value: "{ time, sensitivity, mouseSensitivity }", effect: "Même réglage sous forme d'objet." },
]

const modifierRows: { usage: string; effect: string }[] = [
  { usage: "v-touch-hold=\"handler\"", effect: "Appui long tactile uniquement (600 ms par défaut)." },
  { usage: ".mouse", effect: "Inclut la souris." },
  { usage: ".capture / .mouseCapture", effect: "Capture : le hold s'applique même si un enfant fait stopPropagation." },
  { usage: ".prevent / .stop / .passive", effect: "Comportement des événements (preventDefault, stopPropagation, passif)." },
]
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">v-touch-hold</h1>
    <p class="guide__lead">
      <code>v-touch-hold</code> détecte l'<b>appui long</b> (hold) — tactile et
      souris (modifier <code>.mouse</code>). Délai par défaut
      <b>600 ms</b>, sensibilité <b>5px</b> (tactile) / <b>7px</b> (souris), le
      tout configurable. Une fois déclenché, le geste est
      <b>consommé</b> : l'appui long ne produit pas de clic par-dessus.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Setup</h2>
      <p class="guide__note">
        Enregistrée automatiquement par le module <code>@dnax/ui</code> (mode
        client) :
      </p>
      <q-syntax :code="setupCode" lang="ts" filename="plugins/directives.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Usage</h2>
      <q-syntax :code="usageCode" lang="html" filename="App.vue" copy />
      <q-syntax :code="onHoldCode" lang="ts" filename="useHold.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <p class="guide__note">
        Appuie et maintiens (souris) sur une pastille : la première utilise le
        délai par défaut (600 ms), la seconde un délai de 350 ms — un
        <code>@click</code> sur la pastille rapide ne se déclenche pas après un
        hold (geste consommé) :
      </p>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue" :script="scriptDemo">
        <div class="hold-row">
          <button class="hold-pad" type="button" v-touch-hold.mouse="onHold">
            Hold 600ms
          </button>
          <button
            class="hold-pad hold-pad--fast"
            type="button"
            v-touch-hold.mouse="{ time: 350, sensitivity: 6 }"
            @click="fastCount++"
          >
            Hold 350ms
          </button>
        </div>
        <p class="hold-meta">
          holds: <code>{{ count }}</code> · fast: <code>{{ fastCount }}</code>
          · last: <code>{{ last.duration }}ms</code> at
          <code>{{ last.x }}, {{ last.y }}</code>
        </p>
      </docs-demo>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Value</h2>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Value</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in valueRows" :key="row.value">
              <td><code>{{ row.value }}</code></td>
              <td>{{ row.effect }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Modifiers</h2>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Usage</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in modifierRows" :key="row.usage">
              <td><code>{{ row.usage }}</code></td>
              <td>{{ row.effect }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.guide__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.guide__lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.guide__section {
  margin-bottom: 44px;
}
.guide__h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.guide__note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.guide__note code,
.hold-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.hold-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.hold-pad {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 96px;
  border: none;
  border-radius: 16px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.18);
}
.hold-pad--fast {
  background: #7c3aed;
}
.hold-meta {
  margin: 14px 0 0;
  font-size: 12px;
  color: #5b6472;
}

.api-table-wrap {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
}
.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.api-table th,
.api-table td {
  text-align: left;
  padding: 8px 14px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.api-table th {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
  background: rgba(148, 163, 184, 0.06);
}
.api-table tr:last-child td {
  border-bottom: none;
}
.api-table code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
  white-space: nowrap;
}
</style>
