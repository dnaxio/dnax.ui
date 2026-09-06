<script setup lang="ts">
// Docs — directive v-touch-repeat : handler répété pendant l'appui (équivalent Quasar).
import { ref } from "vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const setupCode = `// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <button v-touch-repeat.mouse="onRepeat">…</button>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchRepeat } from "@dnax/ui"

app.directive("touch-repeat", vTouchRepeat)`

const usageCode = `<button v-touch-repeat.mouse="onRepeat">Hold to repeat</button>

<!-- réglages : 500ms avant le 1er appel, puis toutes les 100ms -->
<button v-touch-repeat.mouse="{ delay: 500, interval: 100 }">…</button>

<!-- ou forme courte '500:100' -->`

const onRepeatCode = `// Détails reçus :
// { evt, count, elapsed }
const onRepeat = ({ count }) => {
  console.log('repeat', count)
}`

const value = ref(0)
const fastValue = ref(0)
const onRepeat = () => { value.value++ }
const onFastRepeat = () => { fastValue.value++ }

const usageDemo = `<div class="repeat-row">
  <button class="repeat-pad" type="button" v-touch-repeat.mouse="onRepeat">
    +1 (600 / 150ms)
  </button>
  <button class="repeat-pad repeat-pad--fast" type="button"
    v-touch-repeat.mouse="{ delay: 400, interval: 60 }">
    +1 (400 / 60ms)
  </button>
</div>

<p>value: {{ value }} · fast: {{ fastValue }}</p>`

const scriptDemo = `import { ref } from "vue"

const value = ref(0)
const onRepeat = () => { value.value++ }`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">v-touch-repeat</h1>
    <p class="guide__lead">
      <code>v-touch-repeat</code> répète un handler <b>tant que l'élément est
      pressé</b> (tactile et souris via <code>.mouse</code>) : un premier appel
      après le <b>délai</b> (600 ms par défaut), puis toutes les
      <b>interval</b> ms (150 ms par défaut) — idéal pour des steppers
      (+ / −), des compteurs ou des défilements continus.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Setup</h2>
      <q-syntax :code="setupCode" lang="ts" filename="plugins/directives.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Usage</h2>
      <q-syntax :code="usageCode" lang="html" filename="App.vue" copy />
      <q-syntax :code="onRepeatCode" lang="ts" filename="useRepeat.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue" :script="scriptDemo">
        <div class="repeat-row">
          <button class="repeat-pad" type="button" v-touch-repeat.mouse="onRepeat">
            +1 (600 / 150ms)
          </button>
          <button
            class="repeat-pad repeat-pad--fast"
            type="button"
            v-touch-repeat.mouse="{ delay: 400, interval: 60 }"
          >
            +1 (400 / 60ms)
          </button>
        </div>
        <p class="repeat-meta">
          value: <code>{{ value }}</code> · fast: <code>{{ fastValue }}</code>
        </p>
      </docs-demo>
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Modifiers &amp; value</h2>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Usage</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>v-touch-repeat="handler"</code></td><td>Premier appel à 600 ms puis toutes les 150 ms.</td></tr>
            <tr><td><code>600</code> (nombre)</td><td>Intervalle de répétition personnalisé.</td></tr>
            <tr><td><code>'500:100'</code></td><td>Délai : intervalle.</td></tr>
            <tr><td><code>{ delay, interval }</code></td><td>Réglage sous forme d'objet.</td></tr>
            <tr><td><code>.mouse</code></td><td>Inclut la souris.</td></tr>
            <tr><td><code>.stop / .prevent / .capture / .passive</code></td><td>Comportement des écouteurs.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.guide { max-width: 860px; }
.guide__title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; color: var(--foreground); }
.guide__lead { margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #5b6472; max-width: 720px; }
.guide__section { margin-bottom: 44px; }
.guide__h2 { margin: 0 0 14px; font-size: 19px; font-weight: 700; color: var(--foreground); }
.guide__note { margin: 0 0 14px; font-size: 14px; line-height: 1.6; color: #5b6472; max-width: 700px; }
.guide__note code, .repeat-meta code { background: rgba(25, 118, 210, 0.08); color: var(--primary); padding: 1px 5px; border-radius: 5px; font-size: 0.92em; }
.repeat-row { display: flex; gap: 12px; flex-wrap: wrap; }
.repeat-pad {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  box-shadow: 0 6px 16px rgb(0 0 0 / 0.16);
}
.repeat-pad--fast { background: #0d9488; }
.repeat-meta { margin: 14px 0 0; font-size: 12px; color: #5b6472; }
.api-table-wrap { max-width: 100%; overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
.api-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.api-table th, .api-table td { text-align: left; padding: 8px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
.api-table th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #8b93a1; background: rgba(148, 163, 184, 0.06); }
.api-table tr:last-child td { border-bottom: none; }
.api-table code { background: rgba(25, 118, 210, 0.08); color: var(--primary); padding: 1px 5px; border-radius: 5px; font-size: 0.92em; white-space: nowrap; }
</style>
