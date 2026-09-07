<script setup lang="ts">
// Bar — documentation du composant QBar : barre fine façon Quasar (fenêtre /
// app, contrôles, menus), utile pour Electron frameless ou entêtes de dialogs.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const bar = useComponent(() => "QBar")
const barSource = componentSource("QBar")
const tag = componentTag("QBar")

const usageBasic = `<q-bar class="demo-bar demo-bar--light">
  <span class="demo-dot demo-dot--red" />
  <span class="demo-dot demo-dot--yellow" />
  <span class="demo-dot demo-dot--green" />
  <span class="demo-space" />
  <b>untitled.txt</b>
</q-bar>

<q-bar dense class="demo-bar demo-bar--light">
  <b>File</b> · Edit · View · Window · Help
</q-bar>`

const usageDark = `<q-bar dark class="demo-bar">
  <q-icon name="lucide:terminal" size="15px" />
  <b>bash — 80×24</b>
  <span class="demo-space" />
  <span>─</span><span>□</span><span>✕</span>
</q-bar>`

const usageProps = `<q-bar as="header" role="toolbar" label="App bar">
  <span class="demo-title">App</span>
</q-bar>

<!-- compact (dense) + force le sombre (dark) -->
<q-bar dense dark role="toolbar" label="Status bar">
  <span>Ready</span>
  <span class="demo-space" />
  <span>Ln 1, Col 1</span>
</q-bar>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Bar</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      <b>&lt;q-bar&gt;</b> est une <b>barre fine</b> pour le haut d'une fenêtre
      ou d'une app — contrôles fenêtre (Mac/Windows), menus, statut… Le pendant
      d'une toolbar mais plus discret : idéale pour les apps
      <b>Electron frameless</b> ou les entêtes de panneaux. Porte
      <code>role="toolbar"</code> par défaut, avec <code>dense</code>,
      <code>dark</code> et <code>as</code> configurables.
    </p>

    <section class="doc-section">
      <h2 class="doc-h2">Style macOS / fenêtre</h2>
      <p class="doc-note">
        Contenu libre (points de contrôle, titre, actions) — poussez à droite
        avec un espace flexible :
      </p>
      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-bar class="demo-bar demo-bar--light">
          <span class="demo-dot demo-dot--red" />
          <span class="demo-dot demo-dot--yellow" />
          <span class="demo-dot demo-dot--green" />
          <span class="demo-space" />
          <b>untitled.txt</b>
        </q-bar>
        <q-bar dense class="demo-bar demo-bar--light demo-gap">
          <b>File</b> · Edit · View · Window · Help
        </q-bar>
      </docs-demo>
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">Sombre &amp; contrôles fenêtre</h2>
      <p class="doc-note">
        <code>dark</code> force le fond sombre (utile hors mode dark global),
        idéal avec un terminal ou une barre de titre de fenêtre :
      </p>
      <docs-demo :code="usageDark" lang="html" filename="App.vue">
        <q-bar dark class="demo-bar">
          <q-icon name="lucide:terminal" size="15px" />
          <b>bash — 80×24</b>
          <span class="demo-space" />
          <span class="demo-win">─</span>
          <span class="demo-win">□</span>
          <span class="demo-win demo-win--close">✕</span>
        </q-bar>
      </docs-demo>
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">Props &amp; sémantique</h2>
      <p class="doc-note">
        <code>as</code> change la balise rendue, <code>role</code> /
        <code>label</code> gèrent l'accessibilité (plusieurs toolbars sur une
        page → donnez un <code>label</code>) :
      </p>
      <docs-demo :code="usageProps" lang="html" filename="App.vue">
        <q-bar as="header" role="toolbar" label="App bar" class="demo-bar demo-bar--light">
          <b class="demo-title">App</b>
        </q-bar>
        <q-bar dense dark role="toolbar" label="Status bar" class="demo-bar demo-gap">
          <span>Ready</span>
          <span class="demo-space" />
          <span>Ln 1, Col 1</span>
        </q-bar>
      </docs-demo>
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">QBar API</h2>
      <docs-api :comp="bar" :source="barSource" />
    </section>
  </div>
</template>

<style scoped>
.doc { max-width: 860px; }
.doc-head { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
.doc-title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.015em; color: var(--foreground); }
.doc-tag { font-size: 13px; color: var(--primary); background: rgba(25, 118, 210, 0.08); padding: 3px 8px; border-radius: 6px; }
.doc-lead { margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #5b6472; max-width: 720px; }
.doc-section { margin-bottom: 44px; }
.doc-h2 { margin: 0 0 14px; font-size: 19px; font-weight: 700; color: var(--foreground); }
.doc-note { margin: 0 0 14px; font-size: 14px; line-height: 1.6; color: #5b6472; max-width: 700px; }
.doc-note code, .doc-lead code { background: rgba(25, 118, 210, 0.08); color: var(--primary); padding: 1px 5px; border-radius: 5px; font-size: 0.92em; }

.demo-bar { border-radius: 10px; }
.demo-bar--light { background: #f2f3f5; }
.demo-gap { margin-top: 10px; }
.demo-space { flex: 1; }
.demo-dot { width: 12px; height: 12px; border-radius: 50%; }
.demo-dot--red { background: #ff5f57; }
.demo-dot--yellow { background: #febc2e; }
.demo-dot--green { background: #28c840; }
.demo-win { color: #a0a5ad; cursor: default; padding: 0 2px; }
.demo-win--close { color: #e0614d; }
.demo-title { font-size: 13px; }
</style>
