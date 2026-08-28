<script setup lang="ts">
// Docs — Setup / premier pas.
definePageMeta({ layout: "docs" })

const firstComponent = `<template>
  <q-btn
    flat
    dense
    rounded
    no-caps
    color="primary"
    icon="lucide:download"
    label="Export"
  />
</template>`

const themeCode = `<q-config-provider
  :theme="{
    mode: 'dark', // light | dark | system (défaut : system)
    colors: { primary: '#7c3aed' },
    componentProps: { QBtn: { radius: 'md' } },
  }"
>
  <!-- votre app -->
</q-config-provider>

<!-- Raccourci : mode seul -->
<q-config-provider theme="system" />`

const tokensCode = `/* vos styles peuvent utiliser les tokens */
.card {
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: var(--q-radius-md);
}`

const iconCode = `<q-btn icon="lucide:download" label="Export" />
<q-icon name="lucide:star" color="warning" size="lg" />`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Setup — first steps</h1>
    <p class="guide__lead">
      The essentials in five minutes: first component, theming, tokens and icons.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">First component</h2>
      <p class="guide__note">
        Boolean props act as modifiers — their presence enables the behavior.
      </p>
      <q-syntax :code="firstComponent" lang="html" filename="App.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Theming</h2>
      <p class="guide__note">
        Wrap your app with <code>&lt;q-config-provider&gt;</code> to override colors
        and per-component default props. Nested providers merge (closest wins).
      </p>
      <q-syntax :code="themeCode" lang="html" filename="app.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">CSS tokens</h2>
      <p class="guide__note">
        Every color becomes a CSS variable (<code>--primary</code>,
        <code>--primary-foreground</code>, …), plus radius tokens
        (<code>--q-radius</code>, <code>--q-radius-md</code>…).
      </p>
      <q-syntax :code="tokensCode" lang="css" filename="styles.css" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Icons</h2>
      <p class="guide__note">
        All icons go through Iconify: pass an icon name like
        <code>lucide:star</code> — no icon font, SVG on demand.
      </p>
      <q-syntax :code="iconCode" lang="html" filename="App.vue" copy />
    </section>
  </div>
</template>

<style scoped>
.guide {
  max-width: 760px;
}
.guide__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.guide__lead {
  margin: 12px 0 0;
  font-size: 15.5px;
  line-height: 1.65;
  color: #5b6472;
}
.guide__section {
  margin-top: 32px;
}
.guide__h2 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}
.guide__note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.guide__note code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
