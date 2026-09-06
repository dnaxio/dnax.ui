<script setup lang="ts">
// Docs — directive v-intersection (IntersectionObserver, équivalent Quasar).
import { ref } from "vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const setupCode = `// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <div v-intersection="onVisibility">…</div>

// Sans le module Nuxt (ou enregistrement manuel) :
import { vIntersection } from "@dnax/ui"

app.directive("intersection", vIntersection)`

const usageCode = `<!-- handler appelé à chaque changement de visibilité -->
<div v-intersection="onEntry">…</div>

<!-- une seule fois : l'observation s'arrête après la 1ère entrée -->
<div v-intersection.once="onFirstView">…</div>

<!-- configuration (threshold, rootMargin…) — observer partagé par cfg -->
<div v-intersection="{ handler: onEntry, cfg: { threshold: 0.3 } }">…</div>

<!-- désactivé -->
<div v-intersection="false">…</div>`

const onEntryCode = `// handler(entry: IntersectionObserverEntry)
const onEntry = ({ isIntersecting, target }) => {
  if (isIntersecting) {
    // visible — ex. lazy load, animation…
  }
}`

// — Démo : cartes qui « s'allument » en entrant dans le viewport —
const visible = ref<Record<number, boolean>>({})
const onceCount = ref(0)

const mark = (index: number, isIntersecting: boolean) => {
  visible.value[index] = isIntersecting
}
const onOnce = () => { onceCount.value++ }

const usageDemo = `<div class="ix-scroll">
  <div
    v-for="i in 8"
    :key="i"
    class="ix-card"
    :class="{ 'ix-card--on': visible[i] }"
    v-intersection="(e) => mark(i, e.isIntersecting)"
  >
    Card {{ i }} — {{ visible[i] ? 'visible' : 'hidden' }}
  </div>
  <div class="ix-sentinel" v-intersection.once="onOnce">
    Sentinel (.once) fired {{ onceCount }} time(s)
  </div>
</div>

<p>{{ Object.values(visible).filter(Boolean).length }} card(s) visible</p>`

const scriptDemo = `import { ref } from "vue"

const visible = ref({})
const mark = (index, isIntersecting) => {
  visible.value[index] = isIntersecting
}`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">v-intersection</h1>
    <p class="guide__lead">
      <code>v-intersection</code> appelle un handler quand l'élément
      <b>entre ou sort du viewport</b> — propulsé par l'API
      <code>IntersectionObserver</code>. Valeurs acceptées : fonction,
      <code>{ handler, cfg }</code> (options observer), ou <code>false</code>
      pour désactiver ; modifier <code>.once</code> pour n'observer que la
      première apparition. Les éléments aux options identiques
      <b>partagent un même observer</b> (listes longues économes).
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
      <q-syntax :code="onEntryCode" lang="ts" filename="useIntersection.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <p class="guide__note">
        Scrolle dans la zone : les cartes s'allument à l'entrée et s'éteignent
        à la sortie ; le sentinel <code>.once</code> ne se déclenche qu'une
        fois :
      </p>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue" :script="scriptDemo">
        <div class="ix-scroll">
          <div
            v-for="i in 8"
            :key="i"
            class="ix-card"
            :class="{ 'ix-card--on': visible[i] }"
            v-intersection="(entry: any) => mark(i, entry.isIntersecting)"
          >
            Card {{ i }} — {{ visible[i] ? "visible" : "hidden" }}
          </div>
          <div class="ix-sentinel" v-intersection.once="onOnce">
            Sentinel (.once) fired {{ onceCount }} time(s)
          </div>
        </div>
        <p class="ix-meta">
          {{ Object.values(visible).filter(Boolean).length }} card(s) visible
        </p>
      </docs-demo>
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
.guide__note code, .ix-meta code { background: rgba(25, 118, 210, 0.08); color: var(--primary); padding: 1px 5px; border-radius: 5px; font-size: 0.92em; }
.ix-scroll {
  height: 260px;
  padding: 12px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.05);
}
.ix-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  margin-bottom: 10px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  color: var(--foreground);
  font-size: 13px;
  transition: background-color 0.25s ease, color 0.25s ease;
}
.ix-card--on {
  background: var(--primary);
  color: #fff;
}
.ix-sentinel {
  padding: 10px;
  border: 1px dashed var(--border);
  border-radius: 10px;
  font-size: 12px;
  text-align: center;
  color: #5b6472;
}
.ix-meta { font-size: 12px; color: #5b6472; }
</style>
