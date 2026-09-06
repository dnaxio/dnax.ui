<script setup lang="ts">
// Docs — directive v-touch-swipe (équivalent Quasar).
import { ref } from "vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const setupCode = `// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-touch-swipe.horizontal.mouse="onSwipe">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vTouchSwipe } from "@dnax/ui"

app.directive("touch-swipe", vTouchSwipe)`

const usageCode = `<div v-touch-swipe.horizontal.mouse="onSwipe">…</div>

<!-- seuils custom : distance 40px, durée max 300ms -->
<div v-touch-swipe="{ distance: 40, duration: 300 }">…</div>`

const onSwipeCode = `// Détails reçus :
// { evt, direction, distance: { x, y }, duration, speed: { x, y } }
const onSwipe = ({ direction, distance, speed }) => {
  console.log('swipe', direction, distance, speed)
}`

const direction = ref("—")
const speed = ref("—")
const count = ref(0)

const onSwipe = (details: any) => {
  count.value++
  direction.value = details.direction
  speed.value = `${Math.round(details.speed.x)}, ${Math.round(details.speed.y)}px/s`
}

const usageDemo = `<div class="swipe-pad" v-touch-swipe.horizontal.mouse.prevent="onSwipe">
  Swipe me ← / →
</div>

<p>swipes: {{ count }} · direction: {{ direction }} · speed: {{ speed }}</p>`

const scriptDemo = `import { ref } from "vue"

const count = ref(0)
const direction = ref("—")

const onSwipe = ({ direction, speed }) => {
  count.value++
  direction.value = direction
}`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">v-touch-swipe</h1>
    <p class="guide__lead">
      <code>v-touch-swipe</code> détecte un glissement <b>rapide puis relâché</b>
      (swipe), tactile et souris (modifier <code>.mouse</code>), filtré par
      direction (<code>.horizontal</code>, <code>.vertical</code>,
      <code>.up/.down/.left/.right</code>). Seuils par défaut : distance ≥
      <b>50px</b>, durée ≤ <b>300ms</b>.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Setup</h2>
      <q-syntax :code="setupCode" lang="ts" filename="plugins/directives.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Usage</h2>
      <q-syntax :code="usageCode" lang="html" filename="App.vue" copy />
      <q-syntax :code="onSwipeCode" lang="ts" filename="useSwipe.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue" :script="scriptDemo">
        <div class="swipe-pad" v-touch-swipe.horizontal.mouse.prevent="onSwipe">
          Swipe me ← / →
        </div>
        <p class="swipe-meta">
          swipes: <code>{{ count }}</code> · direction: <code>{{ direction }}</code>
          · speed: <code>{{ speed }}</code>
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
            <tr><td><code>v-touch-swipe="handler"</code></td><td>Swipe tactile toutes directions (≥ 50px, ≤ 300ms).</td></tr>
            <tr><td><code>.horizontal / .vertical</code></td><td>Capture uniquement sur l'axe indiqué.</td></tr>
            <tr><td><code>.up / .down / .left / .right</code></td><td>Capture sur des directions précises.</td></tr>
            <tr><td><code>.mouse</code></td><td>Inclut la souris.</td></tr>
            <tr><td><code>{ distance, duration }</code></td><td>Seuils personnalisés (px / ms).</td></tr>
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
.guide__note code, .swipe-meta code { background: rgba(25, 118, 210, 0.08); color: var(--primary); padding: 1px 5px; border-radius: 5px; font-size: 0.92em; }
.swipe-pad {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 1px dashed var(--border);
  border-radius: 14px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  font-weight: 600;
  user-select: none;
  touch-action: pan-y;
}
.swipe-meta { font-size: 12px; color: #5b6472; }
.api-table-wrap { max-width: 100%; overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
.api-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.api-table th, .api-table td { text-align: left; padding: 8px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
.api-table th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #8b93a1; background: rgba(148, 163, 184, 0.06); }
.api-table tr:last-child td { border-bottom: none; }
.api-table code { background: rgba(25, 118, 210, 0.08); color: var(--primary); padding: 1px 5px; border-radius: 5px; font-size: 0.92em; white-space: nowrap; }
</style>
