<script setup lang="ts">
// Breadcrumbs — documentation de la famille :
// QBreadcrumbs (conteneur) + QBreadcrumbsEl (une miette).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const breadcrumbs = useComponent(() => "QBreadcrumbs")
const breadcrumbsEl = useComponent(() => "QBreadcrumbsEl")

const breadcrumbsSource = componentSource("QBreadcrumbs")
const breadcrumbsElSource = componentSource("QBreadcrumbsEl")

const tag = componentTag("QBreadcrumbs")

// — Démo Basic —
const basicCode = `<q-breadcrumbs>
  <q-breadcrumbs-el icon="lucide:home" label="Home" />
  <q-breadcrumbs-el label="Components" />
  <q-breadcrumbs-el label="Breadcrumbs" />
</q-breadcrumbs>`

// — Démo Séparateurs —
const separatorsCode = `<q-breadcrumbs separator="›">
  <q-breadcrumbs-el icon="lucide:folder" label="Projects" />
  <q-breadcrumbs-el label="dnax.ui" />
  <q-breadcrumbs-el label="Packages" />
</q-breadcrumbs>

<q-breadcrumbs separator="lucide:chevron-right" separator-color="secondary">
  <q-breadcrumbs-el label="Home" />
  <q-breadcrumbs-el label="Settings" />
  <q-breadcrumbs-el label="Profile" />
</q-breadcrumbs>`

// — Démo Liens —
const linksCode = `<q-breadcrumbs separator="›">
  <q-breadcrumbs-el icon="lucide:book-open" label="Docs" to="/docs" />
  <q-breadcrumbs-el label="Button" to="/docs/components/btn" />
  <q-breadcrumbs-el label="Breadcrumbs" />
</q-breadcrumbs>

<q-breadcrumbs separator="›">
  <q-breadcrumbs-el label="Docs" href="https://llmstxt.org" target="_blank" />
  <q-breadcrumbs-el label="Disabled link" href="https://quasar.dev" disable />
  <q-breadcrumbs-el label="Current page" />
</q-breadcrumbs>`

// — Démo Look —
const lookCode = `<q-breadcrumbs active-color="secondary" color="#8b5cf6">
  <q-breadcrumbs-el icon="lucide:home" label="Home" />
  <q-breadcrumbs-el label="Theming" />
  <q-breadcrumbs-el label="Colors" />
</q-breadcrumbs>

<q-breadcrumbs align="center" gutter="14px" dense>
  <q-breadcrumbs-el icon="lucide:smartphone" label="Mobile" />
  <q-breadcrumbs-el label="Design" />
  <q-breadcrumbs-el label="Dense &amp; centered" />
</q-breadcrumbs>

<q-breadcrumbs align="right">
  <q-breadcrumbs-el label="Git" />
  <q-breadcrumbs-el label="Branch" />
  <q-breadcrumbs-el label="main" />
</q-breadcrumbs>`

// — Démo Change (clic sur une miette) —
const lastCrumb = ref("—")
const onCrumbChange = (index: number) => {
  lastCrumb.value = `crumb #${index + 1}`
}

const changeCode = `<q-breadcrumbs separator="›" @change="onChange">
  <q-breadcrumbs-el icon="lucide:home" label="Home" />
  <q-breadcrumbs-el label="Design system" />
  <q-breadcrumbs-el label="Components" />
  <q-breadcrumbs-el label="Breadcrumbs" />
</q-breadcrumbs>
<p class="demo-meta">Clicked: <code>{{ lastCrumb }}</code></p>`

const changeScript = `const lastCrumb = ref("—")
const onChange = (index) => (lastCrumb.value = "crumb #" + (index + 1))`

// — Usage QBreadcrumbsEl (slot / label) —
const usageEl = `<q-breadcrumbs>
  <q-breadcrumbs-el icon="lucide:home" label="Home" to="/docs" />
  <!-- label remplacé par le slot par défaut -->
  <q-breadcrumbs-el to="/docs">
    <q-avatar size="sm" color="primary" text-color="white" icon="lucide:component" class="demo-el-avatar" />
    <span>Components</span>
  </q-breadcrumbs-el>
  <q-breadcrumbs-el label="Breadcrumbs" />
</q-breadcrumbs>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Breadcrumbs</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Le fil d'ariane indique la position de la page courante dans la hiérarchie.
      La famille comprend deux composants : <b>&lt;q-breadcrumbs&gt;</b> (le
      conteneur — insère <b>automatiquement</b> un séparateur entre les miettes et
      met en avant la dernière, la page courante) et
      <b>&lt;q-breadcrumbs-el&gt;</b> (une miette, lien routeur/natif ou simple
      texte). Rendu sémantique façon shadcn-vue&nbsp;: <code>nav &gt; ol &gt; li</code>
      avec <code>aria-current="page"</code> sur la page courante.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="lucide:home" label="Home" />
          <q-breadcrumbs-el label="Components" />
          <q-breadcrumbs-el label="Breadcrumbs" />
        </q-breadcrumbs>
      </docs-demo>
      <p class="doc-note">
        Le séparateur par défaut est <code>/</code>. La dernière miette reçoit la
        couleur <code>active-color</code> (défaut <code>primary</code>) et un poids
        renforcé — c'est la page courante, en général non cliquable. Les autres
        miettes sont en texte adouci, automatiquement adapté au mode sombre via les
        tokens CSS.
      </p>
    </section>

    <!-- ═══════ Séparateurs ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom separators</h2>
      <docs-demo :code="separatorsCode" lang="html" filename="App.vue">
        <div class="demo-stack">
          <q-breadcrumbs separator="›">
            <q-breadcrumbs-el icon="lucide:folder" label="Projects" />
            <q-breadcrumbs-el label="dnax.ui" />
            <q-breadcrumbs-el label="Packages" />
          </q-breadcrumbs>
          <q-breadcrumbs separator="lucide:chevron-right" separator-color="secondary">
            <q-breadcrumbs-el label="Home" />
            <q-breadcrumbs-el label="Settings" />
            <q-breadcrumbs-el label="Profile" />
          </q-breadcrumbs>
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>separator</code> accepte un texte (<code>"/"</code>, <code>"›"</code>,
        <code>"·"</code>…) ou un nom d'icône Iconify (ex.
        <code>"lucide:chevron-right"</code>) ; <code>separator-color</code> en change
        la couleur (token ou hex). Passez <code>separator=""</code> pour n'avoir
        aucun séparateur.
      </p>
    </section>

    <!-- ═══════ Liens ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Links</h2>
      <docs-demo :code="linksCode" lang="html" filename="App.vue">
        <div class="demo-stack">
          <q-breadcrumbs separator="›">
            <q-breadcrumbs-el icon="lucide:book-open" label="Docs" to="/docs" />
            <q-breadcrumbs-el label="Button" to="/docs/components/btn" />
            <q-breadcrumbs-el label="Breadcrumbs" />
          </q-breadcrumbs>
          <q-breadcrumbs separator="›">
            <q-breadcrumbs-el label="Docs" href="https://llmstxt.org" target="_blank" />
            <q-breadcrumbs-el label="Disabled link" href="https://quasar.dev" disable />
            <q-breadcrumbs-el label="Current page" />
          </q-breadcrumbs>
        </div>
      </docs-demo>
      <p class="doc-note">
        Avec <code>to</code>, la miette rend un lien qui navigue
        (<code>router.push</code>, <code>replace</code> si demandé) — le survol la
        colore et la souligne. <code>href</code> + <code>target</code> couvre les
        liens natifs (ouverture <code>_blank</code> avec <code>rel="noopener"</code>
        automatique). <code>disable</code> désactive la miette.
      </p>
    </section>

    <!-- ═══════ Look ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors, align &amp; dense</h2>
      <docs-demo :code="lookCode" lang="html" filename="App.vue">
        <div class="demo-stack">
          <q-breadcrumbs active-color="secondary" color="#8b5cf6">
            <q-breadcrumbs-el icon="lucide:home" label="Home" />
            <q-breadcrumbs-el label="Theming" />
            <q-breadcrumbs-el label="Colors" />
          </q-breadcrumbs>
          <q-breadcrumbs align="center" gutter="14px" dense>
            <q-breadcrumbs-el icon="lucide:smartphone" label="Mobile" />
            <q-breadcrumbs-el label="Design" />
            <q-breadcrumbs-el label="Dense &amp; centered" />
          </q-breadcrumbs>
          <q-breadcrumbs align="right">
            <q-breadcrumbs-el label="Git" />
            <q-breadcrumbs-el label="Branch" />
            <q-breadcrumbs-el label="main" />
          </q-breadcrumbs>
        </div>
      </docs-demo>
      <p class="doc-note">
        <code>color</code> teinte les miettes intermédiaires, <code>active-color</code>
        la page courante, <code>gutter</code> règle l'espacement (valeur CSS),
        <code>align</code> (left/center/right) cale le fil et <code>dense</code>
        réduit la hauteur visuelle.
      </p>
    </section>

    <!-- ═══════ Change event ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Change event</h2>
      <docs-demo :code="changeCode" lang="html" filename="App.vue" :script="changeScript">
        <q-breadcrumbs separator="›" @change="onCrumbChange" class="demo-change">
          <q-breadcrumbs-el icon="lucide:home" label="Home" />
          <q-breadcrumbs-el label="Design system" />
          <q-breadcrumbs-el label="Components" />
          <q-breadcrumbs-el label="Breadcrumbs" />
        </q-breadcrumbs>
        <p class="demo-meta">Clicked: <code>{{ lastCrumb }}</code></p>
      </docs-demo>
      <p class="doc-note">
        <code>@change</code> est émis quand l'utilisateur clique une miette qui
        n'est <b>pas</b> la page courante (la dernière). Payload&nbsp;: l'index
        (0-based) de la miette cliquée — pratique pour la navigation
        programmatique, le tracking ou pour réagir au choix d'un niveau. Avec des
        miettes-lien (<code>to</code>/<code>href</code>) le clic navigue
        <i>et</i> émet <code>change</code>.
      </p>
    </section>

    <!-- ═══════ QBreadcrumbsEl ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBreadcrumbsEl — une miette</h2>
      <p class="doc-note">
        Icône + label, ou contenu custom via le slot par défaut (remplace le label).
        Sans <code>to</code>/<code>href</code> la miette est un simple
        <code>&lt;span&gt;</code> — le cas classique de la page courante.
      </p>
      <q-syntax :code="usageEl" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="breadcrumbsEl" :source="breadcrumbsElSource" />
    </section>

    <!-- ═══════ API QBreadcrumbs ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API — QBreadcrumbs</h2>
      <p class="doc-note">
        Le conteneur consomme le <b>slot par défaut</b> (les miettes). Il n'expose
        aucun slot nommé : personnalisez chaque miette dans
        <code>&lt;q-breadcrumbs-el&gt;</code>.
      </p>
      <docs-api :comp="breadcrumbs" :source="breadcrumbsSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
/* piles verticales de démos */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-meta {
  margin: 10px 0 0;
  font-size: 13px;
  color: #5b6472;
}
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 680px;
}
.demo-el-avatar {
  margin-right: 1px;
}
</style>
