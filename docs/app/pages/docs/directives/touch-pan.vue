<script setup lang="ts">
// Docs — directive v-touch-pan : détecte le geste « pan » (équivalent Quasar).
import { ref } from "vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const setupCode = `// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-touch-pan.horizontal.mouse="onPan">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchPan } from "@dnax/ui"

app.directive("touch-pan", vTouchPan)`

const usageCode = `<!-- Tactile + souris (modifier .mouse), capture uniquement
     horizontale ; .prevent bloque le scroll natif pendant le pan -->
<div
  class="draggable"
  v-touch-pan.horizontal.mouse.prevent="onPan"
  :style="{ transform: 'translate(' + x + 'px, ' + y + 'px)' }"
>Drag me</div>`

const onPanCode = `// Détails reçus (API Quasar) :
// { evt, position, direction, delta, distance, duration, speed,
//   isFirst, isFinal, isVertical, isHorizontal }
const onPan = ({ delta }) => {
  x.value += delta.x
  y.value += delta.y
}`

// — Démo live — tirer le carré, lecture des détails en direct —
const x = ref(0)
const y = ref(0)
const direction = ref("—")
const last = ref({
  distance: { x: 0, y: 0 },
  duration: 0,
  speed: { x: 0, y: 0 },
  isFirst: false,
  isFinal: false,
})

const onPan = (details: any) => {
  x.value += details.delta.x
  y.value += details.delta.y
  direction.value = details.direction
  last.value = {
    distance: { x: details.distance.x, y: details.distance.y },
    duration: details.duration,
    speed: { x: Math.round(details.speed.x), y: Math.round(details.speed.y) },
    isFirst: details.isFirst,
    isFinal: details.isFinal,
  }
}

const usageDemo = `<div class="pan-stage">
  <div
    class="pan-ball"
    v-touch-pan.horizontal.mouse.prevent="onPan"
    :style="{ transform: 'translate(' + x + 'px, ' + y + 'px)' }"
  ></div>
</div>

<p>direction: {{ direction }} · distance: {{ last.distance.x }}, {{ last.distance.y }} ·
  duration: {{ last.duration }}ms · speed: {{ last.speed.x }}, {{ last.speed.y }}px/s ·
  isFirst: {{ last.isFirst }} · isFinal: {{ last.isFinal }}</p>`

const scriptDemo = `import { ref } from "vue"

const x = ref(0)
const y = ref(0)
const direction = ref("—")
const last = ref({ distance: { x: 0, y: 0 }, duration: 0, speed: { x: 0, y: 0 }, isFirst: false, isFinal: false })

const onPan = ({ delta, direction, distance, duration, speed, isFirst, isFinal }) => {
  x.value += delta.x
  y.value += delta.y
  direction.value = direction
  last.value = { distance, duration, speed, isFirst, isFinal }
}`

// — Tableau modifiers —
const modifierRows: { usage: string; effect: string }[] = [
  { usage: "v-touch-pan=\"handler\"", effect: "Pan tactile — toutes directions (axe dominant au premier mouvement)." },
  { usage: ".horizontal", effect: "Capture uniquement horizontale (left/right) ; le scroll vertical natif reste possible." },
  { usage: ".vertical", effect: "Capture uniquement verticale (up/down)." },
  { usage: ".up / .down / .left / .right", effect: "Capture selon des directions précises." },
  { usage: ".mouse", effect: "Inclut les événements souris (défaut : tactile uniquement)." },
  { usage: ".prevent", effect: "Bloque le scroll natif pendant le pan (tactile)." },
  { usage: ".stop / .capture / .passive", effect: "Comportement d'écouteurs : stopPropagation, capture, passif." },
]

const detailRows: { path: string; type: string; meaning: string }[] = [
  { path: "evt", type: "PointerEvent", meaning: "Événement d'origine (pointermove / pointerup)." },
  { path: "position", type: "{ top, left }", meaning: "Position courante du pointeur (clientY/clientX)." },
  { path: "direction", type: "string", meaning: "'up' | 'down' | 'left' | 'right' — axe dominant au départ." },
  { path: "delta", type: "{ x, y }", meaning: "Déplacement depuis le dernier événement (signé)." },
  { path: "distance", type: "{ x, y }", meaning: "Déplacement total depuis le début du pan (signé)." },
  { path: "duration", type: "number", meaning: "Durée du pan en ms." },
  { path: "speed", type: "{ x, y }", meaning: "Vitesse (px/s), positive par axe." },
  { path: "isFirst / isFinal", type: "boolean", meaning: "Premier / dernier événement du pan." },
  { path: "isVertical / isHorizontal", type: "boolean", meaning: "Axe retenu pour ce pan." },
]
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">v-touch-pan</h1>
    <p class="guide__lead">
      <code>v-touch-pan</code> détecte le geste « pan » (tirer un élément) — le
      remplaçant maison de Hammer.js, façon Quasar. Fonctionne au
      <b>tactile et à la souris</b> (modifier <code>.mouse</code>), avec
      capture par direction (<code>.horizontal</code>,
      <code>.vertical</code>, <code>.up/.down/.left/.right</code>) et blocage
      optionnel du scroll (<code>.prevent</code>).
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
      <q-syntax :code="onPanCode" lang="ts" filename="usePan.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <p class="guide__note">
        Attrape la pastille (souris) et glisse-la horizontalement — la position
        suit le pan, et les détails s'affichent en direct :
      </p>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue" :script="scriptDemo">
        <div class="pan-stage">
          <div
            class="pan-ball"
            v-touch-pan.horizontal.mouse.prevent="onPan"
            :style="{ transform: `translate(${x}px, ${y}px)` }"
          />
        </div>
        <div class="pan-meta">
          direction: <code>{{ direction }}</code> ·
          distance: <code>{{ last.distance.x }}, {{ last.distance.y }}</code> ·
          duration: <code>{{ last.duration }}ms</code> ·
          speed: <code>{{ last.speed.x }}, {{ last.speed.y }}px/s</code> ·
          isFirst: <code>{{ last.isFirst }}</code> ·
          isFinal: <code>{{ last.isFinal }}</code>
        </div>
      </docs-demo>
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

    <section class="guide__section">
      <h2 class="guide__h2">Details</h2>
      <p class="guide__note">
        Chaque événement appelle votre handler avec un objet de détails —
        même forme que Quasar :
      </p>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in detailRows" :key="row.path">
              <td><code>{{ row.path }}</code></td>
              <td>{{ row.type }}</td>
              <td>{{ row.meaning }}</td>
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
.pan-meta code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.pan-stage {
  position: relative;
  height: 220px;
  margin-bottom: 14px;
  overflow: hidden;
  border: 1px dashed var(--border);
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.06);
  user-select: none;
  touch-action: none;
}
.pan-ball {
  position: absolute;
  top: 80px;
  left: calc(50% - 30px);
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: var(--primary);
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.22);
  cursor: grab;
  will-change: transform;
}
.pan-meta {
  font-size: 12px;
  color: #5b6472;
  max-width: 100%;
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
